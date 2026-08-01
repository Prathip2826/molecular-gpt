import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@localhost:5432/molecular_gpt"
)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    connect_args={"ssl": "require"},
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

class Base(DeclarativeBase):
    pass

async def create_tables():
    try:
        # ✅ Import all models so tables get created
        from models import models  # noqa
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("✅ DB tables ready")
    except Exception as e:
        print(f"⚠️ DB connection issue: {e}")
        print("Starting without DB - API still works")
        
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()