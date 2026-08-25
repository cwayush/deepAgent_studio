"""
backend/server.py
==================
FastAPI application — wires together CORS, routers, and startup events.

Start with:
    python main.py
      or
    uvicorn backend.server:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import session as session_router
from backend.routers import chat as chat_router

# App instance
app = FastAPI(
    title="Deep Agent API",
    description=(
        "REST API for the Deep Agents chatbot. "
        "Powered by deepagents, LangGraph, and FastAPI."
    ),
    version="1.0.0",
)

# CORS — allow the Vite dev server and any local origin
# In production restrict allow_origins to your actual frontend domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",   # CRA / other dev servers
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(session_router.router, tags=["Session"])
app.include_router(chat_router.router,    tags=["Chat"])


# Health check
@app.get("/health", tags=["Health"])
async def health():
    """Simple liveness probe."""
    return {"status": "ok"}
