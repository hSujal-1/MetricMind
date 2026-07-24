from app.semantic.metrics import SEMANTIC_METRICS


def detect_metric(question: str):
    """
    Detects the best matching semantic metric
    using weighted display names and aliases.
    """

    question = question.lower()

    best_metric_name = None
    best_metric = None
    best_score = 0

    for metric_name, metric in SEMANTIC_METRICS.items():

        score = 0

        # Display name carries high weight
        if metric["display_name"].lower() in question:
            score += 5

        # Weighted aliases
        aliases = metric.get("aliases", {})

        for alias, weight in aliases.items():
            if alias.lower() in question:
                score += weight

        # Keep the highest scoring metric
        if score > best_score:
            best_score = score
            best_metric_name = metric_name
            best_metric = metric

    if best_score == 0:
        return None, None

    return best_metric_name, best_metric

def detect_metrics(question: str):
    """
    Detect all matching semantic metrics.
    """

    question = question.lower()

    matched_metrics = []

    for metric_name, metric in SEMANTIC_METRICS.items():

        score = 0

        # Display name
        if metric["display_name"].lower() in question:
            score += 5

        # Weighted aliases
        aliases = metric.get("aliases", {})

        for alias, weight in aliases.items():

            if alias.lower() in question:
                score += weight

        if score > 0:

            matched_metrics.append(
                {
                    "metric_name": metric_name,
                    "metric": metric,
                    "score": score
                }
            )

    matched_metrics.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return matched_metrics