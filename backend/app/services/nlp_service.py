from app.semantic.metrics import SEMANTIC_METRICS


def detect_metric(question: str):
    """
    Detects the best matching semantic metric
    using display names and aliases.
    """

    question = question.lower()

    best_metric_name = None
    best_metric = None
    best_score = 0

    for metric_name, metric in SEMANTIC_METRICS.items():

        score = 0

        # Higher weight for display name
        if metric["display_name"].lower() in question:
            score += 3

        # Lower weight for aliases
        for alias in metric.get("aliases", []):
            if alias.lower() in question:
                score += 1

        # Keep the highest scoring metric
        if score > best_score:
            best_score = score
            best_metric_name = metric_name
            best_metric = metric

    if best_score == 0:
        return None, None

    return best_metric_name, best_metric