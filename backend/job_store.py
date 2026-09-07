"""
Federo Health — In-Memory Job Store
Keyed by job_id, holds raw CSV text, quality reports, and training results.
Fine for demo / hackathon; swap for Redis/DB in production.
"""
import uuid
from typing import Any, Dict, Optional

_jobs: Dict[str, Dict[str, Any]] = {}


def create_job() -> str:
    """Create a new job and return its ID."""
    job_id = str(uuid.uuid4())[:12]
    _jobs[job_id] = {
        "status": "created",
        "raw_csv": None,
        "use_case": None,
        "quality_report": None,
        "training_status": None,   # live progress dict
        "train_result": None,
        "model_card": None,
    }
    return job_id


def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    return _jobs.get(job_id)


def update_job(job_id: str, **kwargs) -> None:
    if job_id in _jobs:
        _jobs[job_id].update(kwargs)


def delete_job(job_id: str) -> None:
    _jobs.pop(job_id, None)
