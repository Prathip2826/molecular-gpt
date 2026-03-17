from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models.models import ResearchItem

router = APIRouter()

class ResearchCreate(BaseModel):
    user_id: str
    type: str = "note"
    title: str
    content: Optional[str] = None
    tags: List[str] = []

@router.get("")
async def get_research(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ResearchItem).where(ResearchItem.user_id == user_id).order_by(ResearchItem.created_at.desc())
    )
    items = result.scalars().all()
    return [{"id": i.id, "type": i.type, "title": i.title, "content": i.content,
             "tags": i.tags, "createdAt": str(i.created_at)} for i in items]

@router.post("")
async def create_research(data: ResearchCreate, db: AsyncSession = Depends(get_db)):
    item = ResearchItem(
        user_id=data.user_id, type=data.type, title=data.title,
        content=data.content, tags=data.tags
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return {"id": item.id, "message": "Saved"}

@router.delete("/{item_id}")
async def delete_research(item_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ResearchItem).where(ResearchItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    await db.delete(item)
    await db.commit()
    return {"message": "Deleted"}
