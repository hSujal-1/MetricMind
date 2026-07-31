from app.services.nlp_service import detect_metrics
from app.services.filter_service import detect_filters
from app.services.time_filter_service import (
    detect_time_filters,
    detect_time_comparison
)
from app.services.groupby_service import detect_group_by
from app.services.orderby_service import detect_order_by
from app.services.limit_service import detect_limit
from app.services.comparison_service import detect_comparison
from app.services.having_service import detect_having
from app.services.date_range_service import detect_date_range
from app.services.relative_time_service import detect_relative_time


def build_query_plan(question: str):
    """
    Build a semantic query plan from
    a natural language question.
    """

    matched_metrics = detect_metrics(question)

    # Detect filters
    filters = detect_filters(question)

    date_range = detect_date_range(question)

    relative_time = detect_relative_time(question)

    time_filters = detect_time_filters(question)

    # Relative time has priority over explicit year detection
    if relative_time:
        filters.update(relative_time)

    elif not date_range:
        filters.update(time_filters)

    group_by = detect_group_by(question)
    order_by = detect_order_by(question, matched_metrics)
    limit = detect_limit(question)

    comparison = detect_comparison(question)
    time_comparison = detect_time_comparison(question)
    having = detect_having(question)
    # A date range takes precedence over year-over-year comparison
    if date_range:
        time_comparison = None

    # If it's a comparison query, don't use normal filters
    if comparison:
        filters = {}

    # If it's a time comparison query, don't use single YEAR filter
    if time_comparison:
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

        # Semantic comparison
        "comparison": comparison,

        # Time comparison (Year-over-Year)
        "time_comparison": time_comparison,

        # Date range
        "date_range": date_range,

        # Aggregate filtering
        "having": having
    }