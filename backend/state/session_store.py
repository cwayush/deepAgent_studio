"""
backend/state/session_store.py
================================
Thread-safe in-memory session registry.

Replaces Streamlit's st.session_state.  Each browser session gets a unique
session_id (UUID) stored in localStorage.  The backend maps that ID to a
SessionData object that owns the agent's checkpointer, store, and thread_id.

Sessions expire after TTL_SECONDS of inactivity (default 2 h).
"""

import time
import uuid
import threading
from dataclasses import dataclass, field
from typing import Any, Optional

from langgraph.store.memory import InMemoryStore
from langgraph.checkpoint.memory import MemorySaver


# Session data model
@dataclass
class SessionData:
    """All per-session state previously held in st.session_state."""

    session_id: str

    # LangGraph memory primitives
    checkpointer: MemorySaver = field(default_factory=MemorySaver)
    store: InMemoryStore = field(default_factory=InMemoryStore)

    # Active conversation thread
    thread_id: str = field(default_factory=lambda: str(uuid.uuid4()))

    # Compiled agent + its seed files (rebuilt when config changes)
    agent: Any = None
    seed_files: dict = field(default_factory=dict)
    cfg_key: str = ""

    # StoreBackend seeding flag
    store_seeded: bool = False

    # Eviction timestamp
    last_accessed: float = field(default_factory=time.time)


# Session store
class SessionStore:
    """Thread-safe in-memory registry of SessionData objects."""

    TTL_SECONDS: int = 7200  # 2 hours

    def __init__(self) -> None:
        self._sessions: dict[str, SessionData] = {}
        self._lock = threading.Lock()

    # Public API
    def create(self) -> SessionData:
        """Create a new session and return it."""
        session = SessionData(session_id=str(uuid.uuid4()))
        with self._lock:
            self._sessions[session.session_id] = session
        self._evict_stale()
        return session

    def get(self, session_id: str) -> Optional[SessionData]:
        """Return the session or None.  Refreshes the last-accessed timestamp."""
        with self._lock:
            session = self._sessions.get(session_id)
            if session:
                session.last_accessed = time.time()
            return session

    def reset(self, session_id: str) -> SessionData:
        """Wipe a session completely and return a fresh one with the same ID."""
        fresh = SessionData(session_id=session_id)
        with self._lock:
            self._sessions[session_id] = fresh
        return fresh

    def new_thread(self, session_id: str) -> Optional[str]:
        """Assign a new thread_id to the session; return it, or None if missing."""
        with self._lock:
            session = self._sessions.get(session_id)
            if session is None:
                return None
            session.thread_id = str(uuid.uuid4())
            # Force agent rebuild on next request so the checkpointer
            # starts fresh for this thread
            session.agent = None
            session.cfg_key = ""
            return session.thread_id

    # Internal
    def _evict_stale(self) -> None:
        cutoff = time.time() - self.TTL_SECONDS
        with self._lock:
            stale = [sid for sid, s in self._sessions.items()
                     if s.last_accessed < cutoff]
            for sid in stale:
                del self._sessions[sid]


# Module-level singleton — import this everywhere
session_store = SessionStore()
