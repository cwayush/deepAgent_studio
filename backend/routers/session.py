"""
backend/routers/session.py
============================
Session lifecycle endpoints.

  POST   /api/session                   — create a new session
  GET    /api/session/{id}              — get session info
  POST   /api/session/{id}/new-thread  — start a fresh conversation thread
  DELETE /api/session/{id}             — full reset (wipe agent, store, history)
  GET    /api/config/options            — model list, backend list, default prompt
"""

from fastapi import APIRouter, HTTPException

from backend.config.settings import (
    MODEL_OPTIONS,
    BACKEND_OPTIONS,
    DEFAULT_SYSTEM_PROMPT,
    missing_keys,
)
from backend.models.api_schemas import (
    SessionResponse,
    NewThreadResponse,
    ConfigOptionsResponse,
    BackendOption,
)
from backend.state.session_store import session_store

router = APIRouter()


# Config options  (fetched once by the frontend on startup)
@router.get("/api/config/options", response_model=ConfigOptionsResponse)
async def get_config_options():
    """Return model list, backend options, default system prompt, and missing API keys."""
    return ConfigOptionsResponse(
        model_options=MODEL_OPTIONS,
        backend_options=[BackendOption(**opt) for opt in BACKEND_OPTIONS],
        default_system_prompt=DEFAULT_SYSTEM_PROMPT,
        missing_keys=missing_keys(),
    )


# Session CRUD
@router.post("/api/session", response_model=SessionResponse)
async def create_session():
    """Create a new session and return session_id + initial thread_id."""
    session = session_store.create()
    return SessionResponse(
        session_id=session.session_id,
        thread_id=session.thread_id,
    )


@router.get("/api/session/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str):
    """Return current session info."""
    session = session_store.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return SessionResponse(
        session_id=session.session_id,
        thread_id=session.thread_id,
    )


@router.post("/api/session/{session_id}/new-thread", response_model=NewThreadResponse)
async def new_thread(session_id: str):
    """Assign a fresh thread_id — same agent + store, blank conversation."""
    thread_id = session_store.new_thread(session_id)
    if thread_id is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return NewThreadResponse(thread_id=thread_id)


@router.delete("/api/session/{session_id}")
async def reset_session(session_id: str):
    """Wipe the session completely (agent, store, checkpointer, thread)."""
    if session_store.get(session_id) is None:
        raise HTTPException(status_code=404, detail="Session not found")
    session_store.reset(session_id)
    return {"status": "reset", "session_id": session_id}
