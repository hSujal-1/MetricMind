from app.semantic.metrics import SEMANTIC_METRICS


def get_all_metrics():
    """
    Returns all semantic metrics.
    """
    return list(SEMANTIC_METRICS.values())


def get_metric(metric_name: str):
    """
    Returns a single metric by its key.
    """
    return SEMANTIC_METRICS.get(metric_name.lower())