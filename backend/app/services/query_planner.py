from app.services.nlp_service import detect_metrics
from app.services.filter_service import detect_filters
from app.services.groupby_service import detect_group_by


def build_query_plan(question: str):
    """
    Build a semantic query plan from
    a natural language question.
    """

    matched_metrics = detect_metrics(question)

    filters = detect_filters(question)
    group_by = detect_group_by(question)

    metric_names = []

    for item in matched_metrics:
        metric_names.append(item["metric_name"])

    return {
        "question": question,
        "metrics": metric_names,
        "filters": filters,
        "group_by": group_by,
        "order_by": None,
        "limit": None
    }