"""
Federo Health — Subgroup Fairness Audit
=======================================
Computes per-subgroup accuracy / F1 for any detected demographic columns.
Flags subgroups whose performance is > 10 pp below the overall average.
"""
import numpy as np
import pandas as pd
from typing import Any, Dict, List, Optional
from sklearn.metrics import accuracy_score, f1_score


def compute_fairness_audit(
    df: pd.DataFrame,
    y_true: np.ndarray,
    y_pred: np.ndarray,
    demographic_columns: List[str],
    threshold_pp: float = 10.0,
) -> Dict[str, Any]:
    """
    Parameters
    ----------
    df                  : cleaned DataFrame (must include demographic_columns)
    y_true              : ground-truth binary labels (same row order as df)
    y_pred              : model predictions (binary)
    demographic_columns : list of column names to audit
    threshold_pp        : percentage-point gap to flag a subgroup (default 10)

    Returns
    -------
    dict matching FairnessAudit schema
    """
    if len(y_true) == 0:
        return {
            "demographic_columns": [],
            "subgroup_results": [],
            "overall_accuracy": 0.0,
            "has_demographic_data": False,
        }

    overall_acc = float(accuracy_score(y_true, y_pred)) * 100

    # Filter to columns actually in df
    valid_demo_cols = [c for c in demographic_columns if c in df.columns]

    if not valid_demo_cols:
        return {
            "demographic_columns": [],
            "subgroup_results": [],
            "overall_accuracy": round(overall_acc, 2),
            "has_demographic_data": False,
        }

    subgroup_results: List[Dict[str, Any]] = []

    for col in valid_demo_cols:
        groups = df[col].astype(str).unique()
        for grp in sorted(groups):
            mask = df[col].astype(str) == grp
            if mask.sum() < 5:
                # Too few samples — skip
                continue
            yt_g = y_true[mask.values]
            yp_g = y_pred[mask.values]

            grp_acc = float(accuracy_score(yt_g, yp_g)) * 100
            # F1 with zero_division guard
            try:
                grp_f1 = float(f1_score(yt_g, yp_g, zero_division=0))
            except Exception:
                grp_f1 = 0.0

            flagged = (overall_acc - grp_acc) > threshold_pp

            subgroup_results.append({
                "subgroup": str(grp),
                "column": col,
                "accuracy": round(grp_acc, 2),
                "f1_score": round(grp_f1, 4),
                "count": int(mask.sum()),
                "flagged": flagged,
            })

    return {
        "demographic_columns": valid_demo_cols,
        "subgroup_results": subgroup_results,
        "overall_accuracy": round(overall_acc, 2),
        "has_demographic_data": True,
    }
