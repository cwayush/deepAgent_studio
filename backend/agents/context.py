"""
backend/agents/context.py
==========================
Context-engineering helpers: reads AGENTS.md and skill files from data/.

These are pure functions — no HTTP, no session state, no side effects.
"""

from deepagents.backends.utils import create_file_data
from backend.config.settings import DATA_DIR


def load_agents_md() -> str:
    """Return the text of data/projects/AGENTS.md, or empty string if missing."""
    path = DATA_DIR / "projects" / "AGENTS.md"
    return path.read_text(encoding="utf-8") if path.exists() else ""


def load_skill_seed_files() -> dict:
    """Return every .md file under data/skills/ as virtual file-data dicts.

    The returned dict maps virtual paths like '/skills/aws/SKILL.md' to the
    create_file_data() dict that deepagents backends expect.  Used to seed
    StateBackend and StoreBackend agents that have no real disk access.
    """
    files: dict = {}
    skills_root = DATA_DIR / "skills"
    if not skills_root.exists():
        return files

    for f in skills_root.rglob("*.md"):
        virtual_path = "/skills/" + f.relative_to(skills_root).as_posix()
        files[virtual_path] = create_file_data(f.read_text(encoding="utf-8"))

    return files
