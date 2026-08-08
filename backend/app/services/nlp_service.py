from app.semantic.metrics import SEMANTIC_METRICS


def detect_metric(question: str):
    """
    Detect the best matching semantic metric.

    Uses weighted aliases so that specific
    phrases such as "average sales" take
    priority over generic words such as "sales".
    """

    question = question.lower().strip()

    best_metric_name = None
    best_metric = None
    best_score = 0

    for metric_name, metric in SEMANTIC_METRICS.items():

        score = 0

        display_name = metric["display_name"].lower()

        # ----------------------------------
        # Exact display name
        # ----------------------------------

        if display_name in question:
            score += 10

        # ----------------------------------
        # Weighted aliases
        # ----------------------------------

        aliases = metric.get("aliases", {})

        for alias, weight in aliases.items():

            alias = alias.lower().strip()

            if alias in question:
                score += weight

        # ----------------------------------
        # Keep strongest metric
        # ----------------------------------

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

    Used by endpoints such as /api/ask-multi.
    """

    question = question.lower().strip()

    matched_metrics = []

    for metric_name, metric in SEMANTIC_METRICS.items():

        score = 0

        display_name = metric["display_name"].lower()

        # ----------------------------------
        # Display name
        # ----------------------------------

        if display_name in question:
            score += 10

        # ----------------------------------
        # Weighted aliases
        # ----------------------------------

        aliases = metric.get("aliases", {})

        for alias, weight in aliases.items():

            alias = alias.lower().strip()

            if alias in question:
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