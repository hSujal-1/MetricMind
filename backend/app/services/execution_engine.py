from app.services.sql_generator import generate_sql_from_plan
from app.services.snowflake_service import execute_query
from app.services.metrics_service import get_metric


def execute_query_plan(plan: dict):
    """
    Execute a semantic query plan and return the result.
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

    if metric is None:
        return {
            "status": "Failed",
            "message": "Metric not found."
        }

    sql = generate_sql_from_plan(plan)

    result = execute_query(sql)

    if result["status"] == "Failed":
        return result

    return {
        "metrics": [
            metric["display_name"]
            for metric in metrics
        ],
        "filters": plan["filters"],
        "sql": sql,
        "value": result["result"]
    }