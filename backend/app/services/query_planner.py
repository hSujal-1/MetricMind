from app.services.nlp_service import detect_metric
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

from app.semantic.metrics import SEMANTIC_METRICS


# ============================================================
# DETECT MULTIPLE METRICS
# ============================================================

def detect_multiple_metrics(question: str):
    """
    Detect all semantic metrics mentioned in a question.

    Example:

        "What are the total sales and total profit?"

    returns:

        [
            "total_sales",
            "total_profit"
        ]

    The existing detect_metric() function only detects one
    metric, so this function handles multi-metric questions.
    """

    question_lower = question.lower()

    detected = {}

    for metric_name, metric in SEMANTIC_METRICS.items():

        aliases = metric.get("aliases", {})

        best_score = -1

        for alias, score in aliases.items():

            alias_lower = alias.lower().strip()

            # ------------------------------------------------
            # Match complete phrases/words only
            # ------------------------------------------------

            if alias_lower in question_lower:

                if score > best_score:
                    best_score = score

        if best_score >= 0:

            detected[metric_name] = {
                "metric_name": metric_name,
                "metric": metric,
                "score": best_score
            }

    # --------------------------------------------------------
    # Sort by strongest match
    # --------------------------------------------------------

    matched_metrics = sorted(
        detected.values(),
        key=lambda item: item["score"],
        reverse=True
    )

    return matched_metrics


# ============================================================
# BUILD QUERY PLAN
# ============================================================

def build_query_plan(question: str):
    """
    Build a semantic query plan from
    a natural language question.
    """

    # ========================================================
    # NORMALIZE BUSINESS SYNONYMS
    # ========================================================

    question = normalize_question(question)

    # ========================================================
    # DETECT METRICS
    # ========================================================

    # --------------------------------------------------------
    # First try multiple-metric detection.
    #
    # This allows questions such as:
    #
    # "total sales and total profit"
    # "sales and profit"
    # "sales, profit and quantity"
    # --------------------------------------------------------

    matched_metrics = detect_multiple_metrics(question)

    # --------------------------------------------------------
    # Fallback to the existing single-metric detector
    # --------------------------------------------------------

    if not matched_metrics:

        metric_name, metric = detect_metric(question)

        if metric_name:

            matched_metrics = [
                {
                    "metric_name": metric_name,
                    "metric": metric,
                    "score": 1
                }
            ]

    # ========================================================
    # DETECT FILTERS
    # ========================================================

    filters = detect_filters(question)

    date_range = detect_date_range(question)

    relative_time = detect_relative_time(question)

    time_filters = detect_time_filters(question)

    quarter_filters = detect_quarter(question)

    # --------------------------------------------------------
    # Relative time has priority over explicit year detection
    # --------------------------------------------------------

    if relative_time:

        filters.update(relative_time)

    elif not date_range:

        filters.update(time_filters)

    # --------------------------------------------------------
    # Quarter filters
    # --------------------------------------------------------

    filters.update(quarter_filters)

    # ========================================================
    # DETECT GROUP BY
    # ========================================================

    group_by = detect_group_by(question)

    # ========================================================
    # SUB-CATEGORY GROUP BY FALLBACK
    # ========================================================

    normalized_group_question = (
        question
        .lower()
        .replace("-", " ")
        .replace("_", " ")
    )

    sub_category_phrases = [
        "sub category",
        "sub categories",
        "subcategory",
        "subcategories"
    ]

    if (
        not group_by
        and any(
            phrase in normalized_group_question
            for phrase in sub_category_phrases
        )
    ):

        group_by = ["SUB_CATEGORY"]

    # ========================================================
    # DETECT LIMIT
    # ========================================================

    limit = detect_limit(question)

    # ========================================================
    # DETECT SUPERLATIVE
    # ========================================================

    superlative = detect_superlative(question)

    # ========================================================
    # DEFAULT METRIC FOR RANKING QUERIES
    # ========================================================

    if (
        not matched_metrics
        and group_by
        and superlative
    ):

        matched_metrics = [
            {
                "metric_name": "total_sales",
                "metric": SEMANTIC_METRICS.get("total_sales"),
                "score": 1
            }
        ]

    # ========================================================
    # ORDER BY
    # ========================================================

    order_by = detect_order_by(
        question,
        matched_metrics
    )

    # ========================================================
    # COMPARISONS
    # ========================================================

    comparison = detect_comparison(question)

    quarter_comparison = detect_quarter_comparison(question)

    time_comparison = detect_time_comparison(question)

    having = detect_having(question)

    # ========================================================
    # DATE RANGE PRIORITY
    # ========================================================

    if date_range:

        time_comparison = None

    # ========================================================
    # COMPARISON FILTER RULE
    # ========================================================

    if comparison:

        filters = {}

    # ========================================================
    # QUARTER COMPARISON RULE
    # ========================================================

    if quarter_comparison:

        filters.pop("QUARTER", None)

    # ========================================================
    # TIME COMPARISON RULE
    # ========================================================

    if time_comparison:

        filters = {}

    # ========================================================
    # AUTOMATIC GROUP BY — COMPARISON
    # ========================================================

    if comparison and not group_by:

        group_by = [
            comparison["dimension"]
        ]

    # ========================================================
    # AUTOMATIC GROUP BY — QUARTER COMPARISON
    # ========================================================

    if quarter_comparison and not group_by:

        group_by = ["QUARTER"]

    # ========================================================
    # SUPERLATIVE DETECTION
    # ========================================================

    if superlative and matched_metrics:

        order_by = {
            "column": matched_metrics[0]["metric_name"],
            "direction": superlative["direction"]
        }

        # Only apply LIMIT 1 when the user
        # did not explicitly ask for another limit.

        if limit is None:

            limit = superlative["limit"]

    # ========================================================
    # BUILD METRIC NAME LIST
    # ========================================================

    metric_names = []

    for item in matched_metrics:

        metric_name = item["metric_name"]

        if metric_name not in metric_names:

            metric_names.append(metric_name)

    # ========================================================
    # FINAL QUERY PLAN
    # ========================================================

    return {
        "question": question,

        "metrics": metric_names,

        "filters": filters,

        "group_by": group_by,

        "order_by": order_by,

        "limit": limit,

        # Semantic comparison
        "comparison": comparison,

        # Quarter comparison
        "quarter_comparison": quarter_comparison,

        # Time comparison
        "time_comparison": time_comparison,

        # Date range
        "date_range": date_range,

        # Aggregate filtering
        "having": having
    }