"""
backend/routers/chat.py
========================
Chat endpoint — runs the deep agent and returns a structured response.

  POST /api/chat
    Body:  ChatRequest  { session_id, message, config: AgentConfig }
    Returns: ChatResponse { answer, tool_events, files, thread_id }

The agent's synchronous .invoke() is offloaded to a thread via asyncio.to_thread
so FastAPI's event loop stays unblocked while the agent works.
"""

import asyncio
from typing import Any

from fastapi import APIRouter, HTTPException

from backend.models.api_schemas import ChatRequest, ChatResponse, ToolEvent
from backend.agents.factory import build_agent
from backend.state.session_store import session_store

router = APIRouter()


# Helpers
def _extract_text(content: Any) -> str:
    """Flatten an AIMessage .content value (str or list of content blocks)."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts: list[str] = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
            elif isinstance(block, str):
                parts.append(block)
        return "\n".join(parts)
    return str(content)


def _extract_tool_events(messages: list) -> list[ToolEvent]:
    """Walk the agent's message list and collect tool calls + results."""
    events: list[ToolEvent] = []

    for msg in messages:
        msg_type = getattr(msg, "type", "")

        # AI message with tool calls
        if msg_type == "ai" and getattr(msg, "tool_calls", None):
            for tc in msg.tool_calls:
                events.append(ToolEvent(
                    type="tool_call",
                    name=tc["name"],
                    args=tc.get("args", {}),
                ))

        # Tool result message
        elif msg_type == "tool":
            raw = _extract_text(msg.content)
            truncated = raw[:800] + ("…" if len(raw) > 800 else "")
            events.append(ToolEvent(
                type="tool_result",
                name=getattr(msg, "name", "tool"),
                content=truncated,
            ))

    return events


def _run_agent(agent, payload: dict, config: dict) -> dict:
    """Thin wrapper so asyncio.to_thread has a plain callable."""
    return agent.invoke(payload, config=config)


# Chat endpoint
@router.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Run the deep agent for one user turn and return the full result.

    The agent is rebuilt only when the configuration changes (cfg_key check).
    seed_files are forwarded in the payload for StateBackend sessions.
    """
    
    # 1. Resolve session
    session = session_store.get(request.session_id)
    if session is None:
        raise HTTPException(
            status_code=404,
            detail=f"Session '{request.session_id}' not found. "
                   "Call POST /api/session first.",
        )

    cfg = request.config
    cfg_key = str(sorted(cfg.model_dump().items()))

    # 2. Rebuild agent only when config changed
    if session.cfg_key != cfg_key or session.agent is None:
        try:
            session.agent, session.seed_files = build_agent(cfg, session)
            session.cfg_key = cfg_key
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to build agent: {exc}",
            ) from exc

    # 3. Build payload
    payload: dict = {
        "messages": [{"role": "user", "content": request.message}]
    }
    if session.seed_files:
        payload["files"] = session.seed_files

    invoke_config = {
        "configurable": {"thread_id": session.thread_id},
        "recursion_limit": 100,
    }

    # 4. Run agent in a thread (keeps the async event loop free)
    try:
        result = await asyncio.to_thread(
            _run_agent, session.agent, payload, invoke_config
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Agent error: {exc}",
        ) from exc

    # 5. Extract messages for this turn only
    all_msgs: list = result.get("messages", [])
    turn_start: int = max(
        (i for i, m in enumerate(all_msgs) if getattr(m, "type", "") == "human"),
        default=0,
    )
    turn_msgs = all_msgs[turn_start + 1:]

    # 6. Build response
    tool_events = _extract_tool_events(turn_msgs)
    answer = _extract_text(all_msgs[-1].content) if all_msgs else "*(no response)*"

    # 7. Virtual files produced this turn (exclude seed files)
    files: dict = {
        p: {"content": d.get("content", "") if isinstance(d, dict) else str(d)}
        for p, d in result.get("files", {}).items()
        if p not in session.seed_files
    }

    return ChatResponse(
        answer=answer,
        tool_events=tool_events,
        files=files,
        thread_id=session.thread_id,
    )
