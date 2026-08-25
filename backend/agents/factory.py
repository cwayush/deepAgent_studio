"""
backend/agents/factory.py
==========================
Agent factory — builds a configured deep-agent from a frontend config dict
and a SessionData object.

Adding a new tool
-----------------
1. Create backend/tools/<your_tool>.py and define a plain Python function.
2. Import it here and add it to the ALL_TOOLS list below.
3. Done — the agent will automatically see it.
"""

from deepagents import create_deep_agent
from deepagents.backends import FilesystemBackend, StateBackend, StoreBackend
from deepagents.backends.utils import create_file_data

from backend.config.settings import DATA_DIR
from backend.models.agent_models import ResearchFindings
from backend.models.api_schemas import AgentConfig
from backend.agents.context import load_agents_md, load_skill_seed_files
from backend.tools.search import internet_search

# Tool registry — add new tools here
ALL_TOOLS = [internet_search]


# Agent factory
def build_agent(cfg: AgentConfig, session) -> tuple:
    """Build a deep-agent wired to the given config and session.

    Args:
        cfg:     AgentConfig from the frontend request.
        session: SessionData from the session store.

    Returns:
        (agent, seed_files) tuple.
        seed_files is non-empty only for StateBackend.
    """
    seed_files: dict = {}

    # 1. Select backend
    if cfg.backend == "state":
        backend = StateBackend()
        if cfg.use_agents_md:
            seed_files["/projects/AGENTS.md"] = create_file_data(load_agents_md())
        if cfg.use_skills:
            seed_files.update(load_skill_seed_files())
        memory_paths = ["/projects/AGENTS.md"] if cfg.use_agents_md else None

    elif cfg.backend == "filesystem":
        # virtual_mode=True keeps the agent sandboxed inside data/
        backend = FilesystemBackend(root_dir=str(DATA_DIR), virtual_mode=True)
        memory_paths = ["/projects/AGENTS.md"] if cfg.use_agents_md else None

    else:  # "store"
        backend = StoreBackend(
            store=session.store,
            namespace=lambda rt: ("memories",),
        )
        if not session.store_seeded:
            if cfg.use_agents_md:
                session.store.put(
                    ("memories",), "/projects/AGENTS.md",
                    create_file_data(load_agents_md()),
                )
            if cfg.use_skills:
                for path, data in load_skill_seed_files().items():
                    session.store.put(("memories",), path, data)
            session.store_seeded = True
        memory_paths = ["/projects/AGENTS.md"] if cfg.use_agents_md else None

    # 2. Build subagents
    subagents = []
    if cfg.use_subagents:
        subagents.append({
            "name": "research-agent",
            "description": "Used to research more in-depth questions",
            "system_prompt": (
                "You are a great researcher. Research thoroughly and cite your sources."
            ),
            "tools": ALL_TOOLS,
        })
        subagents.append({
            "name": "structured-researcher",
            "description": (
                "Researches topics and returns structured findings "
                "(summary, confidence score, source URLs)"
            ),
            "system_prompt": "Research the given topic thoroughly. Return your findings.",
            "tools": ALL_TOOLS,
            "response_format": ResearchFindings,
        })

    # 3. Assemble the agent
    kwargs: dict = dict(
        model=cfg.model,
        tools=ALL_TOOLS,
        system_prompt=cfg.system_prompt,
        backend=backend,
        checkpointer=session.checkpointer,
    )
    if subagents:
        kwargs["subagents"] = subagents
    if cfg.use_skills:
        kwargs["skills"] = ["/skills/"]
    if memory_paths:
        kwargs["memory"] = memory_paths
    if cfg.backend == "store":
        kwargs["store"] = session.store

    return create_deep_agent(**kwargs), seed_files
