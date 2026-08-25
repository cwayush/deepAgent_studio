"""
backend/models/agent_models.py
===============================
Pydantic schemas used internally by the deep-agent subagents.
"""

from pydantic import BaseModel, Field


class ResearchFindings(BaseModel):
    """Structured output returned by the 'structured-researcher' subagent."""

    summary: str = Field(description="Summary of findings")
    confidence: float = Field(description="Confidence score from 0 to 1")
    sources: list[str] = Field(description="List of source URLs")
