from app.services.nlp_service import detect_metrics
from app.services.filter_service import detect_filters


def build_query_plan(question: str):
    """
    Build a semantic query plan from
    a natural language question.
    """

    matched_metrics = detect_metrics(question)

    filters = detect_filters(question)

    metric_names = []

    for item in matched_metrics:
        metric_names.append(item["metric_name"])

    return {
        "question": question,
        "metrics": metric_names,
        "filters": filters
    }