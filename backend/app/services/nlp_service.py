from app.semantic.metrics import SEMANTIC_METRICS


def detect_metric(question: str):
    """
    Detects the semantic metric from a user's question.
    Returns both the metric name and metric definition.
    """

    question = question.lower()

    for metric_name, metric in SEMANTIC_METRICS.items():

        display_name = metric["display_name"].lower()

        if display_name in question:
            return metric_name, metric

    return None, None