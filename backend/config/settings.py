"""
backend/config/settings.py
===========================
Central configuration — paths, env vars, model/backend option lists, prompts.
Import this module anywhere in the backend; .env is loaded here automatically.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Paths
CONFIG_DIR: Path = Path(__file__).parent          # backend/config/
BACKEND_DIR: Path = CONFIG_DIR.parent             # backend/
ROOT_DIR: Path = BACKEND_DIR.parent               # Deep_Agent_Project/
DATA_DIR: Path = ROOT_DIR / "data"                # Deep_Agent_Project/data/

# Load .env from project root once at import time
load_dotenv(ROOT_DIR / ".env")

# Model options  (add more here; frontend fetches this list from the API)
MODEL_OPTIONS: list[str] = [
    "openai:gpt-5.6",
    "openai:gpt-5.6-luna",
    "groq:qwen/qwen3.6-27b",
    "groq:groq/compound",
    "groq:openai/gpt-oss-120b",
    "groq:groq/compound-mini",
    "gemini:gemini-3.7-flash",
    "gemini:gemini-3.6-flash",
    "gemini:gemini-3.5-flash-lite"
]

# Backend options  (value sent by frontend → label shown in UI)
BACKEND_OPTIONS: list[dict] = [
    {"value": "state",      "label": "StateBackend"},
    {"value": "filesystem", "label": "FilesystemBackend"},
    {"value": "store",      "label": "StoreBackend"},
]

# Default prompts
DEFAULT_SYSTEM_PROMPT: str = (
    "You are an expert AI assistant and researcher. You conduct thorough "
    "research using your internet_search tool when needed, plan multi-step "
    "work with write_todos, offload bulky content to files, use your skills "
    "when a query matches one, and delegate deep-dive research to your "
    "subagents. Always cite sources when research was involved."
)

# Runtime helpers — key presence checks for the /api/config/options endpoint
def missing_keys() -> list[str]:
    """Return names of API keys that are absent from the environment."""
    required = {
        "OPENAI_API_KEY": "openai",
        "GROQ_API_KEY": "groq",
        "GOOGLE_API_KEY": 'gemini',
        "TAVILY_API_KEY": "tavily",
    }
    return [label for env, label in required.items() if not os.getenv(env)]
