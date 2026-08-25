"""
main.py
=======
Project entry point.

Usage:
    python main.py
"""

import uvicorn

def main() -> None:
    """Launch the FastAPI backend server."""
    uvicorn.run("backend.server:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()
