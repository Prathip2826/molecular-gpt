import os
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from database import get_db
from models.models import ChatSession, ChatMessage

router = APIRouter()

HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"

class MessageCreate(BaseModel):
    message: str

class SessionCreate(BaseModel):
    user_id: str

@router.post("/session")
async def create_session(data: SessionCreate, db: AsyncSession = Depends(get_db)):
    session = ChatSession(user_id=data.user_id)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return {"id": session.id, "title": session.title}

@router.get("/sessions")
async def get_sessions(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ChatSession).where(ChatSession.user_id == user_id).order_by(ChatSession.created_at.desc())
    )
    sessions = result.scalars().all()
    return [{"id": s.id, "title": s.title, "createdAt": str(s.created_at)} for s in sessions]

@router.get("/{session_id}/messages")
async def get_messages(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at)
    )
    msgs = result.scalars().all()
    return [{"id": m.id, "role": m.role, "content": m.content, "timestamp": str(m.created_at)} for m in msgs]

@router.post("/{session_id}/message")
async def send_message(session_id: str, data: MessageCreate, db: AsyncSession = Depends(get_db)):
    # Save user message
    user_msg = ChatMessage(session_id=session_id, role="user", content=data.message)
    db.add(user_msg)

    # Call HuggingFace
    prompt = f"""<s>[INST] You are a helpful chemistry AI assistant specialized in molecular science, drug discovery, and chemical reactions. Answer clearly and scientifically.

{data.message} [/INST]"""

    ai_response = ""
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"https://api-inference.huggingface.co/models/{HF_MODEL}",
                headers={"Authorization": f"Bearer {HF_API_KEY}"},
                json={
                    "inputs": prompt,
                    "parameters": {
                        "max_new_tokens": 512,
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "repetition_penalty": 1.1,
                    }
                }
            )
            result = response.json()
            if isinstance(result, list) and result[0].get("generated_text"):
                text = result[0]["generated_text"]
                idx = text.rfind("[/INST]")
                ai_response = text[idx + 7:].strip() if idx != -1 else text
            else:
                ai_response = "Model is loading. Please try again in ~20 seconds."
    except Exception as e:
        ai_response = f"AI service temporarily unavailable. Error: {str(e)}"

    # Save AI response
    ai_msg = ChatMessage(session_id=session_id, role="assistant", content=ai_response)
    db.add(ai_msg)
    await db.commit()

    return {"response": ai_response, "session_id": session_id}

@router.delete("/session/{session_id}")
async def delete_session(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ChatSession).where(ChatSession.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.commit()
    return {"message": "Deleted"}
