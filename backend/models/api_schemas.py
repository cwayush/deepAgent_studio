"""
backend/models/api_schemas.py
==============================
Pydantic request/response schemas for the FastAPI endpoints.
These are the contracts between the React frontend and the Python backend.
"""

from __future__ import annotations
from typing import Any, Literal, Optional
from pydantic import BaseModel, Field


# Chat
class AgentConfig(BaseModel):
    """Agent configuration sent by the frontend on every chat request."""

    model: str = "openai:gpt-5.4"
    backend: Literal["state", "filesystem", "store"] = "state"
    use_agents_md: bool = True
    use_skills: bool = True
    use_subagents: bool = True
    system_prompt: str = ""


class ChatRequest(BaseModel):
    """Body for POST /api/chat."""

    session_id: str
    message: str
    config: AgentConfig


class ToolEvent(BaseModel):
    """A single tool call or tool result captured during an agent run."""

    type: Literal["tool_call", "tool_result"]
    name: str
    args: Optional[dict[str, Any]] = None   # present for tool_call
    content: Optional[str] = None           # present for tool_result


class ChatResponse(BaseModel):
    """Response from POST /api/chat."""

    answer: str
    tool_events: list[ToolEvent] = Field(default_factory=list)
    files: dict[str, Any] = Field(default_factory=dict)
    thread_id: str


# Session

class SessionResponse(BaseModel):
    """Returned when a session is created or a new thread is started."""

    session_id: str
    thread_id: str


class NewThreadResponse(BaseModel):
    thread_id: str


# Config options  (fetched once by the frontend on startup)
class BackendOption(BaseModel):
    value: str
    label: str


class ConfigOptionsResponse(BaseModel):
    model_options: list[str]
    backend_options: list[BackendOption]
    default_system_prompt: str
    missing_keys: list[str] = Field(default_factory=list)
