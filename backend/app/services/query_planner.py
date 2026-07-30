from app.services.nlp_service import detect_metrics
from app.services.filter_service import detect_filters
from app.services.groupby_service import detect_group_by
from app.services.orderby_service import detect_order_by
from app.services.limit_service import detect_limit
from app.services.comparison_service import detect_comparison


def build_query_plan(question: str):
    """
    Build a semantic query plan from
    a natural language question.
    """

    matched_metrics = detect_metrics(question)

    filters = detect_filters(question)
    group_by = detect_group_by(question)
    order_by = detect_order_by(question, matched_metrics)
    limit = detect_limit(question)
    comparison = detect_comparison(question)

    # If it's a comparison query, don't use normal filters
    if comparison:
        filters = {}

    # Automatically GROUP BY the comparison dimension
    if comparison and not group_by:
        group_by = [comparison["dimension"]]

    metric_names = []

    for item in matched_metrics:
        metric_names.append(item["metric_name"])

    return {
        "question": question,
        "metrics": metric_names,
        "filters": filters,
        "group_by": group_by,
        "order_by": order_by,
        "limit": limit,

        # Reserved for future semantic capabilities
        "comparison": comparison,
        "having": None
    }