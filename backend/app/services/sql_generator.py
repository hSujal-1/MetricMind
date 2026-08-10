from app.services.metrics_service import get_metric


# ============================================================
# GENERATE SQL FROM SINGLE METRIC
# ============================================================

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

            if isinstance(value, int):
                conditions.append(
                    f"{column} = {value}"
                )

            else:
                conditions.append(
                    f"{column} = '{value}'"
                )

        sql += "\nWHERE " + " AND ".join(conditions)

    sql += ";"

    return sql.strip()


# ============================================================
# GROUP BY EXPRESSION
# ============================================================

def get_group_by_expression(column: str):
    """
    Converts semantic GROUP BY fields into
    valid Snowflake SQL expressions.

    ORDER_DATE is stored as DATE in
    GLOBAL_SUPERSTORE_NEW.
    """

    column = column.upper()

    # --------------------------------------------------------
    # MONTH
    # --------------------------------------------------------

    if column == "MONTH":

        return (
            "DATE_TRUNC("
            "'MONTH', "
            "ORDER_DATE"
            ")"
        )

    # --------------------------------------------------------
    # YEAR
    # --------------------------------------------------------

    if column == "YEAR":

        return (
            "YEAR("
            "ORDER_DATE"
            ")"
        )

    # --------------------------------------------------------
    # QUARTER
    # --------------------------------------------------------

    if column == "QUARTER":

        return (
            "QUARTER("
            "ORDER_DATE"
            ")"
        )

    # --------------------------------------------------------
    # Normal database column
    # --------------------------------------------------------

    return column


# ============================================================
# GENERATE SQL FROM QUERY PLAN
# ============================================================

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
    - Month / Quarter / Year grouping
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

    # --------------------------------------------------------
    # Copy GROUP BY so original plan isn't modified
    # --------------------------------------------------------

    group_by = list(group_by)

    # --------------------------------------------------------
    # Automatically GROUP BY YEAR for time comparisons
    # --------------------------------------------------------

    if time_comparison and "YEAR" not in group_by:

        group_by.append("YEAR")

    # ========================================================
    # SELECT
    # ========================================================

    select_parts = []

    # --------------------------------------------------------
    # Add GROUP BY columns
    # --------------------------------------------------------

    for column in group_by:

        expression = get_group_by_expression(column)

        # Use semantic column name as alias
        select_parts.append(
            f"{expression} AS {column}"
        )

    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    table_name = None

    for metric_name in metrics:

        metric = get_metric(metric_name)

        if metric is None:
            return None

        table_name = metric["table"]

        select_parts.append(
            f"{metric['aggregation']}({metric['column']}) "
            f"AS {metric_name.upper()}"
        )

    # ========================================================
    # BASE SQL
    # ========================================================

    sql = f"""
SELECT
{',\n'.join(select_parts)}
FROM {table_name}
"""

    # ========================================================
    # WHERE
    # ========================================================

    conditions = []

    # --------------------------------------------------------
    # Existing filters
    # --------------------------------------------------------

    for column, value in filters.items():

        if isinstance(value, int):

            conditions.append(
                f"{column} = {value}"
            )

        else:

            conditions.append(
                f"{column} = '{value}'"
            )

    # --------------------------------------------------------
    # Business comparison
    # --------------------------------------------------------

    if comparison:

        values = ", ".join(
            f"'{value}'"
            for value in comparison["values"]
        )

        conditions.append(
            f"{comparison['dimension']} IN ({values})"
        )

    # --------------------------------------------------------
    # Quarter comparison
    # --------------------------------------------------------

    if quarter_comparison:

        values = ", ".join(
            str(value)
            for value in quarter_comparison["values"]
        )

        conditions.append(
            f"QUARTER IN ({values})"
        )

    # --------------------------------------------------------
    # Time comparison
    # --------------------------------------------------------

    if time_comparison:

        years = ", ".join(
            str(year)
            for year in time_comparison["years"]
        )

        conditions.append(
            f"YEAR IN ({years})"
        )

    # --------------------------------------------------------
    # Date range
    # --------------------------------------------------------

    if date_range:

        if date_range["operator"] == "BETWEEN":

            conditions.append(
                f"YEAR BETWEEN "
                f"{date_range['start']} "
                f"AND "
                f"{date_range['end']}"
            )

        else:

            conditions.append(
                f"YEAR "
                f"{date_range['operator']} "
                f"{date_range['year']}"
            )

    # --------------------------------------------------------
    # Add WHERE
    # --------------------------------------------------------

    if conditions:

        sql += (
            "\nWHERE "
            + " AND ".join(conditions)
        )

    # ========================================================
    # GROUP BY
    # ========================================================

    if group_by:

        group_expressions = [
            get_group_by_expression(column)
            for column in group_by
        ]

        sql += (
            "\nGROUP BY "
            + ", ".join(group_expressions)
        )

    # ========================================================
    # HAVING
    # ========================================================

    if having:

        metric = get_metric(
            having["metric"]
        )

        if metric:

            sql += (
                "\nHAVING "
                f"{metric['aggregation']}("
                f"{metric['column']}"
                ") "
                f"{having['operator']} "
                f"{having['value']}"
            )

    # ========================================================
    # ORDER BY
    # ========================================================

    if order_by:

        order_column = order_by["column"].upper()
        direction = order_by.get("direction", "ASC").upper()

        # ----------------------------------------------------
        # Metric ORDER BY
        # ----------------------------------------------------

        metric = get_metric(
            order_by["column"]
        )

        if metric:

            sql += (
                "\nORDER BY "
                f"{order_column} "
                f"{direction}"
            )

        # ----------------------------------------------------
        # Time-based GROUP BY ORDER BY
        # ----------------------------------------------------

        elif order_column in ["MONTH", "YEAR", "QUARTER"]:

            expression = get_group_by_expression(
                order_column
            )

            sql += (
                "\nORDER BY "
                f"{expression} "
                f"{direction}"
            )


    # --------------------------------------------------------
    # Automatically sort time-based GROUP BY results
    # --------------------------------------------------------

    else:

        time_columns = [
            column.upper()
            for column in group_by
            if column.upper() in ["MONTH", "YEAR", "QUARTER"]
        ]

        if time_columns:
            time_column = time_columns[0]

            expression = get_group_by_expression(
                time_column
            )

            sql += (
                "\nORDER BY "
                f"{expression} ASC"
            )

    # ========================================================
    # LIMIT
    # ========================================================

    if limit:

        sql += (
            f"\nLIMIT {limit}"
        )

    # ========================================================
    # END SQL
    # ========================================================

    sql += ";"

    return sql.strip()