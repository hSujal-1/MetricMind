from fastapi import APIRouter, Body

from app.services.snowflake_service import (
    check_connection,
    get_tables,
    get_table_columns,
    execute_query
)

from app.services.metrics_service import (
    get_all_metrics,
    get_metric
)

from app.services.sql_generator import generate_sql
from app.services.nlp_service import (
    detect_metric,
    detect_metrics
)
from app.services.filter_service import detect_filters
from app.services.query_planner import build_query_plan

router = APIRouter(
    prefix="/api",
    tags=["MetricMind APIs"]
)


@router.get("/db-health")
def db_health():
    """
    Check the Snowflake database connection.
    """
    return check_connection()


@router.get("/tables")
def tables():
    """
    Returns all tables from the connected Snowflake database.
    """
    return get_tables()


@router.get("/tables/{table_name}/columns")
def table_columns(table_name: str):
    """
    Returns the schema (columns) of a specific table.
    """
    return get_table_columns(table_name)


@router.get("/metrics")
def list_metrics():
    """
    Returns all semantic metrics.
    """
    metrics = get_all_metrics()

    return {
        "count": len(metrics),
        "metrics": metrics
    }


@router.get("/sql/{metric_name}")
def generate_metric_sql(metric_name: str):
    """
    Generates SQL for a semantic metric.
    """

    metric = get_metric(metric_name)

    if metric is None:
        return {
            "status": "Failed",
            "message": "Metric not found."
        }

    sql = generate_sql(metric_name)

    return {
        "metric": metric_name,
        "sql": sql
    }


@router.get("/query/{metric_name}")
def execute_metric(metric_name: str):
    """
    Generates SQL from a semantic metric
    and executes it in Snowflake.
    """

    metric = get_metric(metric_name)

    if metric is None:
        return {
            "status": "Failed",
            "message": "Metric not found."
        }

    sql = generate_sql(metric_name)

    result = execute_query(sql)

    if result["status"] == "Failed":
        return result

    return {
        "metric": metric_name,
        "sql": sql,
        "value": result["result"]
    }


@router.post("/ask")
def ask_question(payload: dict = Body(...)):
    """
    Accepts a natural language question
    and returns the business answer.
    """

    question = payload.get("question", "")

    # Detect metric
    metric_name, metric = detect_metric(question)

    if metric is None:
        return {
            "status": "Failed",
            "message": "No matching metric found."
        }

    # Detect filters
    filters = detect_filters(question)

    # Generate SQL
    sql = generate_sql(metric_name, filters)

    # Execute SQL
    result = execute_query(sql)

    if result["status"] == "Failed":
        return result

    return {
        "question": question,
        "metric": metric["display_name"],
        "filters": filters,
        "sql": sql,
        "value": result["result"]
    }

@router.post("/ask-multi")
def ask_multi(payload: dict = Body(...)):
    """
    Detect multiple semantic metrics from
    a natural language question.
    """

    question = payload.get("question", "")

    matched_metrics = detect_metrics(question)

    if not matched_metrics:
        return {
            "status": "Failed",
            "message": "No matching metrics found."
        }

    return {
        "question": question,
        "metrics": [
            {
                "metric": item["metric"]["display_name"],
                "score": item["score"]
            }
            for item in matched_metrics
        ]
    }
@router.post("/query-plan")
def query_plan(payload: dict = Body(...)):
    """
    Build and return the semantic query plan.
    """

    question = payload.get("question", "")

    plan = build_query_plan(question)

    return plan