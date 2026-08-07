import time

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
from app.services.quarter_service import detect_quarter
from app.services.quarter_comparison_service import detect_quarter_comparison
from app.services.superlative_service import detect_superlative
from app.services.synonym_service import normalize_question
from app.services.intent_service import is_business_question


def build_query_plan(question: str):
    """
    Build a semantic query plan from
    a natural language question.
    """

    total_start = time.time()

    # ----------------------------
    # Normalize
    # ----------------------------
    t = time.time()
    question = normalize_question(question)
    print(f"normalize_question: {time.time() - t:.3f} sec")

    # ----------------------------
    # Metrics
    # ----------------------------
    t = time.time()
    matched_metrics = detect_metrics(question)
    print(f"detect_metrics: {time.time() - t:.3f} sec")

    if not matched_metrics:
        t = time.time()
        business_question = is_business_question(question)
        print(f"is_business_question: {time.time() - t:.3f} sec")

        if business_question:
            matched_metrics = [
                {
                    "metric_name": "total_sales"
                }
            ]

    # ----------------------------
    # Filters
    # ----------------------------
    t = time.time()
    filters = detect_filters(question)
    print(f"detect_filters: {time.time() - t:.3f} sec")

    t = time.time()
    date_range = detect_date_range(question)
    print(f"detect_date_range: {time.time() - t:.3f} sec")

    t = time.time()
    relative_time = detect_relative_time(question)
    print(f"detect_relative_time: {time.time() - t:.3f} sec")

    t = time.time()
    time_filters = detect_time_filters(question)
    print(f"detect_time_filters: {time.time() - t:.3f} sec")

    t = time.time()
    quarter_filters = detect_quarter(question)
    print(f"detect_quarter: {time.time() - t:.3f} sec")

    if relative_time:
        filters.update(relative_time)

    elif not date_range:
        filters.update(time_filters)

    filters.update(quarter_filters)

    # ----------------------------
    # Grouping
    # ----------------------------
    t = time.time()
    group_by = detect_group_by(question)
    print(f"detect_group_by: {time.time() - t:.3f} sec")

    # ----------------------------
    # Ordering
    # ----------------------------
    t = time.time()
    order_by = detect_order_by(question, matched_metrics)
    print(f"detect_order_by: {time.time() - t:.3f} sec")

    # ----------------------------
    # Limit
    # ----------------------------
    t = time.time()
    limit = detect_limit(question)
    print(f"detect_limit: {time.time() - t:.3f} sec")

    # ----------------------------
    # Superlative
    # ----------------------------
    t = time.time()
    superlative = detect_superlative(question)
    print(f"detect_superlative: {time.time() - t:.3f} sec")

    # ----------------------------
    # Comparison
    # ----------------------------
    t = time.time()
    comparison = detect_comparison(question)
    print(f"detect_comparison: {time.time() - t:.3f} sec")

    t = time.time()
    quarter_comparison = detect_quarter_comparison(question)
    print(f"detect_quarter_comparison: {time.time() - t:.3f} sec")

    t = time.time()
    time_comparison = detect_time_comparison(question)
    print(f"detect_time_comparison: {time.time() - t:.3f} sec")

    # ----------------------------
    # Having
    # ----------------------------
    t = time.time()
    having = detect_having(question)
    print(f"detect_having: {time.time() - t:.3f} sec")

    # ----------------------------
    # Existing Logic
    # ----------------------------

    if date_range:
        time_comparison = None

    if comparison:
        filters = {}

    if quarter_comparison:
        filters.pop("QUARTER", None)

    if time_comparison:
        filters = {}

    if comparison and not group_by:
        group_by = [comparison["dimension"]]

    if quarter_comparison and not group_by:
        group_by = ["QUARTER"]

    if superlative and matched_metrics:

        order_by = {
            "column": matched_metrics[0]["metric_name"],
            "direction": superlative["direction"]
        }

        if limit is None:
            limit = superlative["limit"]

    metric_names = []

    for item in matched_metrics:
        metric_names.append(item["metric_name"])

    print("=" * 60)
    print(f"TOTAL Query Planner Time: {time.time() - total_start:.3f} sec")
    print("=" * 60)

    return {
        "question": question,
        "metrics": metric_names,
        "filters": filters,
        "group_by": group_by,
        "order_by": order_by,
        "limit": limit,
        "comparison": comparison,
        "quarter_comparison": quarter_comparison,
        "time_comparison": time_comparison,
        "date_range": date_range,
        "having": having
    }