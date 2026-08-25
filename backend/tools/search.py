"""
backend/tools/search.py
========================
Internet search tool powered by Tavily.

To add a new tool:
  1. Define a plain Python function with a clear docstring (used as the tool description).
  2. Import it in backend/agents/factory.py and add it to the `tools` list.
  That's it — no other files need changing.
"""

import os
from typing import Literal

from tavily import TavilyClient

# Initialise the client once at import time.
# TAVILY_API_KEY must be present in .env (loaded by backend/config/settings.py).
_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY", ""))


def internet_search(
    query: str,
    max_results: int = 5,
    topic: Literal["general", "news", "finance"] = "general",
    include_raw_content: bool = False,
) -> dict:
    """Search the web and return relevant results for the given query."""
    return _client.search(
        query,
        max_results=max_results,
        include_raw_content=include_raw_content,
        topic=topic,
    )
