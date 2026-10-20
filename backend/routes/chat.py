import os
import uuid
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from database import get_db

router = APIRouter()

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

SYSTEM_PROMPT = (
    "You are a helpful chemistry AI assistant specialized in molecular science, "
    "drug discovery, and chemical reactions."
)


class MessageCreate(BaseModel):
    message: str
    temperature: float = 0.7
    max_tokens: int = 1024


class SessionCreate(BaseModel):
    user_id: str


async def call_groq(user_message: str, temperature: float, max_tokens: int) -> str:
    """Calls Groq and returns the reply text. Never raises KeyError:
    if Groq returns an error, the real message is returned/logged."""
    groq_key = os.getenv("GROQ_API_KEY", "")
    if not groq_key:
        return "Error: GROQ_API_KEY is missing on the server (add it in HF Space secrets)."

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                GROQ_URL,
                headers={
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": GROQ_MODEL,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_message},
                    ],
                    "max_tokens": max(max_tokens, 1024),
                    "temperature": temperature,
                    "reasoning_effort": "low",
                },
            )
        result = response.json()
    except Exception as e:
        print("GROQ REQUEST FAILED:", repr(e))
        return f"Error: could not reach AI service ({type(e).__name__})."

    if "choices" not in result:
        print("GROQ ERROR:", response.status_code, result)
        err = result.get("error", {})
        msg = err.get("message") if isinstance(err, dict) else str(err)
        return f"Error: Groq says -> {msg or 'unknown error'}"

    content = (result["choices"][0]["message"].get("content") or "").strip()
    return content or "Error: AI returned an empty reply. Please try again."


@router.post("/session")
async def create_session(data: SessionCreate, db: AsyncSession = Depends(get_db)):
    try:
        session_id = str(uuid.uuid4())
        await db.execute(
            text("INSERT INTO chat_sessions (id, user_id, title) VALUES (:id, :uid, :title)"),
            {"id": session_id, "uid": data.user_id, "title": "New Chat"},
        )
        await db.commit()
        return {"id": session_id, "title": "New Chat"}
    except Exception as e:
        return {"id": None, "error": str(e)}


@router.get("/sessions")
async def get_sessions(user_id: str, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            text("SELECT id, title, created_at FROM chat_sessions WHERE user_id = :uid ORDER BY created_at DESC"),
            {"uid": user_id},
        )
        rows = result.fetchall()
        return [{"id": r[0], "title": r[1], "createdAt": str(r[2])} for r in rows]
    except Exception:
        return []


@router.get("/{session_id}/messages")
async def get_messages(session_id: str, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            text("SELECT id, role, content, created_at FROM chat_messages WHERE session_id = :sid ORDER BY created_at"),
            {"sid": session_id},
        )
        rows = result.fetchall()
        return [{"id": r[0], "role": r[1], "content": r[2], "timestamp": str(r[3])} for r in rows]
    except Exception as e:
        print(f"Get messages error: {e}")
        return []


@router.post("/{session_id}/message")
async def send_message(session_id: str, data: MessageCreate, db: AsyncSession = Depends(get_db)):
    ai_response = await call_groq(data.message, data.temperature, data.max_tokens)

    try:
        count_result = await db.execute(
            text("SELECT COUNT(*) FROM chat_messages WHERE session_id = :sid"),
            {"sid": session_id},
        )
        count = count_result.scalar()
        if count == 0:
            title = data.message[:60] + ("..." if len(data.message) > 60 else "")
            await db.execute(
                text("UPDATE chat_sessions SET title = :title WHERE id = :id"),
                {"title": title, "id": session_id},
            )

        await db.execute(
            text("INSERT INTO chat_messages (id, session_id, role, content) VALUES (:id, :sid, :role, :content)"),
            {"id": str(uuid.uuid4()), "sid": session_id, "role": "user", "content": data.message},
        )
        await db.execute(
            text("INSERT INTO chat_messages (id, session_id, role, content) VALUES (:id, :sid, :role, :content)"),
            {"id": str(uuid.uuid4()), "sid": session_id, "role": "assistant", "content": ai_response},
        )
        await db.commit()
    except Exception as e:
        print(f"DB save error: {e}")

    return {"response": ai_response, "session_id": session_id}


@router.delete("/session/{session_id}")
async def delete_session(session_id: str, db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("DELETE FROM chat_messages WHERE session_id = :id"), {"id": session_id})
        await db.execute(text("DELETE FROM chat_sessions WHERE id = :id"), {"id": session_id})
        await db.commit()
        return {"message": "Deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/simple")
async def simple_chat(data: MessageCreate):
    reply = await call_groq(data.message, data.temperature, data.max_tokens)
    return {"response": reply}
    