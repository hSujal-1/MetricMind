from app.services.sql_generator import generate_sql_from_plan
from app.services.snowflake_service import execute_query
from app.services.metrics_service import get_metric


def execute_query_plan(plan: dict):
    """
    Execute a semantic query plan and return the result.
    Supports one or more metrics.
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

    result = execute_query(sql)

    if result["status"] == "Failed":
        return result

    row = result["result"]

    values = {}

    if row:

        for index, metric in enumerate(metrics):
            values[metric["display_name"]] = row[index]

    return {
        "metrics": [
            metric["display_name"]
            for metric in metrics
        ],
        "filters": plan["filters"],
        "sql": sql,
        "values": values
    }