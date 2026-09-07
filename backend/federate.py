"""
Federo Health — Equity-Weighted FedAvg Aggregation
===================================================
Replaces naive volume-weighted averaging with a blended formula:
  equity_weight_i = 0.7 * (n_i / N) + 0.3 * (1 / K)

where:
  n_i = hospital i's data volume
  N   = total data volume across all participating hospitals
  K   = number of participating hospitals

This ensures smaller/rural hospitals are not drowned out numerically.
"""
import math
import hashlib
import numpy as np
from typing import Any, Dict, List

# Simulated hospital nodes (mirrors HOSPITAL_NODES in federatedEngine.js)
HOSPITAL_NODES = [
    {"id": "h1", "name": "City Medical Center A",   "base_volume": 2840},
    {"id": "h2", "name": "Valley District Clinic",  "base_volume": 950},
    {"id": "h3", "name": "Metro Academic Health B", "base_volume": 6300},
    {"id": "h4", "name": "St. Jude Community Hosp", "base_volume": 1025},
]

# Track global federation state per use_case
_federation_state: Dict[str, Dict[str, Any]] = {}


def _get_state(use_case: str) -> Dict[str, Any]:
    if use_case not in _federation_state:
        _federation_state[use_case] = {
            "round": 0,
            "global_accuracy": 72.0 + np.random.uniform(0, 5),
            "global_loss": 0.62,
            "global_auroc": 0.74,
        }
    return _federation_state[use_case]


def compute_equity_weights(
    hospital_volumes: List[Dict[str, Any]],
    volume_ratio: float = 0.70,
    equal_ratio: float = 0.30,
) -> List[Dict[str, Any]]:
    """
    Compute equity-blended weights for each hospital.

    Parameters
    ----------
    hospital_volumes : list of {hospital_id, hospital_name, data_volume}
    volume_ratio     : fraction of weight from data volume (default 0.70)
    equal_ratio      : fraction of weight from equal split (default 0.30)
    """
    k = len(hospital_volumes)
    if k == 0:
        return []

    total_n = sum(h["data_volume"] for h in hospital_volumes)
    equal_w = 1.0 / k

    result = []
    for h in hospital_volumes:
        vol_w = h["data_volume"] / max(total_n, 1)
        equity_w = volume_ratio * vol_w + equal_ratio * equal_w
        result.append({
            "hospital_id": h["hospital_id"],
            "hospital_name": h["hospital_name"],
            "data_volume": h["data_volume"],
            "volume_weight": round(vol_w, 4),
            "equity_weight": round(equity_w, 4),
        })
    return result


def run_federated_round(use_case: str) -> Dict[str, Any]:
    """
    Simulate one FedAvg round with equity-weighted aggregation.
    Returns metrics + per-hospital equity weights.
    """
    state = _get_state(use_case)
    state["round"] += 1

    # Build hospital volumes (use base + small random variation for realism)
    volumes = []
    for h in HOSPITAL_NODES:
        vol = h["base_volume"] + int(np.random.randint(-50, 100))
        volumes.append({
            "hospital_id": h["id"],
            "hospital_name": h["name"],
            "data_volume": max(vol, 100),
        })

    hospital_weights = compute_equity_weights(volumes)

    # Simulate accuracy improvement per round (plateaus near 96%)
    boost = min(22.0, state["round"] * 2.4)
    noise = np.random.uniform(-0.5, 0.8)
    state["global_accuracy"] = min(96.8, state["global_accuracy"] + boost * 0.18 + noise)
    state["global_loss"] = max(0.08, state["global_loss"] - 0.04 * state["round"] * 0.2)
    state["global_auroc"] = min(0.978, state["global_auroc"] + 0.012)

    return {
        "use_case": use_case,
        "round_number": state["round"],
        "aggregation_method": "equity_weighted_fedavg",
        "global_accuracy": round(state["global_accuracy"], 2),
        "global_loss": round(state["global_loss"], 4),
        "global_auroc": round(state["global_auroc"], 4),
        "hospital_weights": hospital_weights,
        "participating_hospitals": len(HOSPITAL_NODES),
    }


def get_federated_accuracy(use_case: str) -> float:
    """Return the current global federated accuracy for a use case."""
    return _get_state(use_case)["global_accuracy"]
