from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn
from contextlib import asynccontextmanager

from routes import molecules, chat, experiments, research, molecule_tools
from database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    print("✅ DB ready")
    yield

app = FastAPI(title="Molecular GPT API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(molecules.router, prefix="/molecules", tags=["Molecules"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(experiments.router, prefix="/experiments", tags=["Experiments"])
app.include_router(research.router, prefix="/research", tags=["Research"])
app.include_router(molecule_tools.router, prefix="/tools", tags=["Molecule Tools"])

@app.get("/")
def root():
    return {"message": "Molecular GPT API v1.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
