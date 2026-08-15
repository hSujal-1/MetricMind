from app.services.sql_generator import generate_sql_from_plan

from app.services.snowflake_service import (
    execute_query,
    execute_table_query
)

from app.services.metrics_service import get_metric

from app.services.sql_validator import validate_sql


# =========================================================
# TIME COMPARISON HELPER
# =========================================================

def calculate_time_comparison(
    rows,
    columns,
    metrics,
    dimension
):
    """
    Calculate absolute and percentage change between
    the first and last time periods.

    Supports multiple metrics.

    Example:

    2013 -> 2014

    Sales:
        from: 3405860
        to:   4300041

    Profit:
        from: 406935
        to:   504165
    """

    # -----------------------------------------------------
    # Safety checks
    # -----------------------------------------------------

    if not rows or len(rows) < 2:
        return None

    if not columns:
        return None

    # -----------------------------------------------------
    # First and last periods
    # -----------------------------------------------------

    previous_row = rows[0]
    current_row = rows[-1]

    # -----------------------------------------------------
    # Find dimension column
    # -----------------------------------------------------

    try:

        dimension_index = columns.index(dimension)

    except ValueError:

        return None

    previous_period = previous_row[dimension_index]
    current_period = current_row[dimension_index]

    # -----------------------------------------------------
    # Calculate each metric
    # -----------------------------------------------------

    metric_results = {}

    for metric_index, metric in enumerate(metrics):

        # -------------------------------------------------
        # SQL result structure:
        #
        # YEAR | TOTAL_SALES | TOTAL_PROFIT
        #
        # metric_index 0 -> column 1
        # metric_index 1 -> column 2
        # -------------------------------------------------

        value_index = metric_index + 1

        if value_index >= len(columns):
            continue

        try:

            previous_value = previous_row[value_index]
            current_value = current_row[value_index]

        except IndexError:

            continue

        if previous_value is None or current_value is None:
            continue

        # -------------------------------------------------
        # Convert numeric values
        # -------------------------------------------------

        try:

            previous_value = float(previous_value)
            current_value = float(current_value)

        except (TypeError, ValueError):

            continue

        # -------------------------------------------------
        # Absolute change
        # -------------------------------------------------

        change = current_value - previous_value

        # -------------------------------------------------
        # Percentage change
        # -------------------------------------------------

        if previous_value == 0:

            percentage_change = None

        else:

            percentage_change = (
                change / previous_value
            ) * 100

            percentage_change = round(
                percentage_change,
                2
            )

        # -------------------------------------------------
        # Direction
        # -------------------------------------------------

        if change > 0:

            direction = "increase"

        elif change < 0:

            direction = "decrease"

        else:

            direction = "no_change"

        # -------------------------------------------------
        # Store metric result
        # -------------------------------------------------

        metric_results[
            metric["display_name"]
        ] = {

            "from": previous_value,

            "to": current_value,

            "change": change,

            "percentage_change":
                percentage_change,

            "direction":
                direction
        }

    # -----------------------------------------------------
    # Nothing calculated
    # -----------------------------------------------------

    if not metric_results:
        return None

    # -----------------------------------------------------
    # Final comparison object
    # -----------------------------------------------------

    return {

        "type": "time_comparison",

        "dimension": dimension,

        "periods": [
            previous_period,
            current_period
        ],

        "metrics": metric_results
    }


def execute_query_plan(plan: dict):
    """
    Execute a semantic query plan and return the result.

    Supports:
    - KPI queries
    - GROUP BY table queries
    - Time comparison calculations

    Includes SQL safety validation before
    executing any generated SQL.
    """

    # ========================================================
    # Validate metrics
    # ========================================================

    if not plan.get("metrics"):

        return {
            "status": "Failed",
            "message": "No matching metric found."
        }

    metrics = []

    for metric_name in plan["metrics"]:

        metric = get_metric(metric_name)

        if metric is None:

            return {
                "status": "Failed",
                "message": f"Metric '{metric_name}' not found."
            }

        metrics.append(metric)

    # ========================================================
    # Generate SQL
    # ========================================================

    sql = generate_sql_from_plan(plan)

    # ========================================================
    # SQL Safety Validation
    # ========================================================

    validation = validate_sql(sql)

    if not validation.get("valid"):

        return {
            "status": "Failed",
            "message": validation.get(
                "error",
                "Generated SQL failed safety validation."
            )
        }

    # ========================================================
    # Decide execution strategy
    # ========================================================

    if plan.get("group_by"):

        result = execute_table_query(sql)

    else:

        result = execute_query(sql)

    # ========================================================
    # Handle Snowflake execution failure
    # ========================================================

    if result.get("status") == "Failed":

        return result

    # ========================================================
    # GROUP BY queries
    # ========================================================

    if plan.get("group_by"):

        table_rows = []

        for row in result["rows"]:

            row_data = {}

            for index, column in enumerate(
                result["columns"]
            ):

                row_data[column] = row[index]

            table_rows.append(row_data)

        # ====================================================
        # H2 — TIME COMPARISON
        # ====================================================

        comparison = None

        if plan.get("time_comparison"):

            group_by = plan.get(
                "group_by",
                []
            )

            if group_by:

                comparison = calculate_time_comparison(
                    rows=result["rows"],
                    columns=result["columns"],
                    metrics=metrics,
                    dimension=group_by[0]
                )

        # ====================================================
        # TABLE RESPONSE
        # ====================================================

        response = {

            "query_type": "table",

            "metrics": [
                metric["display_name"]
                for metric in metrics
            ],

            "filters": plan.get(
                "filters",
                {}
            ),

            "group_by": plan.get(
                "group_by",
                []
            ),

            "sql": sql,

            "columns": result["columns"],

            "rows": table_rows
        }

        # ====================================================
        # Add comparison only when available
        # ====================================================

        if comparison is not None:

            response["comparison"] = comparison

        return response

    # ========================================================
    # KPI queries
    # ========================================================

    row = result["result"]

    values = {}

    if row:

        for index, metric in enumerate(metrics):

            values[
                metric["display_name"]
            ] = row[index]

    return {

        "query_type": "kpi",

        "metrics": [
            metric["display_name"]
            for metric in metrics
        ],

        "filters": plan.get(
            "filters",
            {}
        ),

        "sql": sql,

        "values": values
    }