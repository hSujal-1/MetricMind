from app.services.sql_generator import generate_sql_from_plan
from app.services.snowflake_service import (
    execute_query,
    execute_table_query
)
from app.services.metrics_service import get_metric


def execute_query_plan(plan: dict):
    """
    Execute a semantic query plan and return the result.
    Supports KPI queries and GROUP BY table queries.
    """

    if not plan["metrics"]:
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

    sql = generate_sql_from_plan(plan)

    # Decide execution strategy
    if plan.get("group_by"):

        result = execute_table_query(sql)

    else:

        result = execute_query(sql)

    if result["status"] == "Failed":
        return result

    # GROUP BY queries return table data
    if plan.get("group_by"):

        table_rows = []

        for row in result["rows"]:

            row_data = {}

            for index, column in enumerate(result["columns"]):
                row_data[column] = row[index]

            table_rows.append(row_data)

        return {
            "query_type": "table",
            "metrics": [
                metric["display_name"]
                for metric in metrics
            ],
            "filters": plan["filters"],
            "group_by": plan["group_by"],
            "sql": sql,
            "columns": result["columns"],
            "rows": table_rows
        }

    # KPI queries
    row = result["result"]

    values = {}

    if row:

        for index, metric in enumerate(metrics):
            values[metric["display_name"]] = row[index]

    return {
        "query_type": "kpi",
        "metrics": [
            metric["display_name"]
            for metric in metrics
        ],
        "filters": plan["filters"],
        "sql": sql,
        "values": values
    }