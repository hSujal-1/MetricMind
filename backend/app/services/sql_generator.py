from app.services.metrics_service import get_metric


def generate_sql(metric_name: str, filters: dict = None):
    """
    Generates SQL from a semantic metric
    and optional filters.
    """

    metric = get_metric(metric_name)

    if metric is None:
        return None

    sql = f"""
SELECT {metric['aggregation']}({metric['column']})
FROM {metric['table']}
"""

    if filters:

        conditions = []

        for column, value in filters.items():
            conditions.append(f"{column} = '{value}'")

        sql += "\nWHERE " + " AND ".join(conditions)

    sql += ";"

    return sql.strip()


def generate_sql_from_plan(plan: dict):
    """
    Generate SQL from a semantic query plan.

    Supports:
    - Multiple metrics
    - Filters
    - GROUP BY
    - HAVING
    - ORDER BY
    - LIMIT
    - Comparison queries
    - Quarter comparison queries
    - Time comparison queries
    - Date range queries
    """

    metrics = plan.get("metrics", [])
    filters = plan.get("filters", {})
    group_by = plan.get("group_by", [])
    order_by = plan.get("order_by")
    limit = plan.get("limit")
    comparison = plan.get("comparison")
    quarter_comparison = plan.get("quarter_comparison")
    time_comparison = plan.get("time_comparison")
    date_range = plan.get("date_range")
    having = plan.get("having")

    if not metrics:
        return None

    # Make a copy so we don't modify the original plan
    group_by = list(group_by)

    # Automatically GROUP BY YEAR for time comparisons
    if time_comparison and "YEAR" not in group_by:
        group_by.append("YEAR")

    select_parts = []

    # Add GROUP BY columns first
    for column in group_by:
        select_parts.append(column)

    table_name = None

    for metric_name in metrics:

        metric = get_metric(metric_name)

        if metric is None:
            return None

        table_name = metric["table"]

        select_parts.append(
            f"{metric['aggregation']}({metric['column']}) AS {metric_name.upper()}"
        )

    sql = f"""
SELECT
{',\n'.join(select_parts)}
FROM {table_name}
"""

    # -----------------------------
    # WHERE clause
    # -----------------------------
    conditions = []

    # Existing filters
    for column, value in filters.items():

        # Numeric filters (YEAR, WEEKNUM, QUARTER)
        if isinstance(value, int):
            conditions.append(
                f"{column} = {value}"
            )

        # String filters
        else:
            conditions.append(
                f"{column} = '{value}'"
            )

    # -----------------------------
    # Business comparison filters
    # -----------------------------
    if comparison:

        values = ", ".join(
            f"'{value}'"
            for value in comparison["values"]
        )

        conditions.append(
            f"{comparison['dimension']} IN ({values})"
        )

    # -----------------------------
    # Quarter comparison filters
    # -----------------------------
    if quarter_comparison:

        values = ", ".join(
            str(value)
            for value in quarter_comparison["values"]
        )

        conditions.append(
            f"QUARTER IN ({values})"
        )

    # -----------------------------
    # Time comparison filters
    # -----------------------------
    if time_comparison:

        years = ", ".join(
            str(year)
            for year in time_comparison["years"]
        )

        conditions.append(
            f"YEAR IN ({years})"
        )

    # -----------------------------
    # Date range filters
    # -----------------------------
    if date_range:

        if date_range["operator"] == "BETWEEN":

            conditions.append(
                f"YEAR BETWEEN {date_range['start']} AND {date_range['end']}"
            )

        else:

            conditions.append(
                f"YEAR {date_range['operator']} {date_range['year']}"
            )

    if conditions:
        sql += "\nWHERE " + " AND ".join(conditions)

    # -----------------------------
    # GROUP BY
    # -----------------------------
    if group_by:
        sql += "\nGROUP BY " + ", ".join(group_by)

    # -----------------------------
    # HAVING
    # -----------------------------
    if having:

        metric = get_metric(having["metric"])

        if metric:

            sql += (
                f"\nHAVING "
                f"{metric['aggregation']}({metric['column']}) "
                f"{having['operator']} "
                f"{having['value']}"
            )

    # -----------------------------
    # ORDER BY
    # -----------------------------
    if order_by:

        metric = get_metric(order_by["column"])

        if metric:

            sql += (
                f"\nORDER BY {order_by['column'].upper()} "
                f"{order_by['direction']}"
            )

    # -----------------------------
    # LIMIT
    # -----------------------------
    if limit:
        sql += f"\nLIMIT {limit}"

    sql += ";"

    return sql.strip()