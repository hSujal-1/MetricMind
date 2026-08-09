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

from app.services.sql_generator import (
    generate_sql,
    generate_sql_from_plan
)

from app.services.nlp_service import (
    detect_metric,
    detect_metrics
)

from app.services.filter_service import detect_filters

from app.services.query_planner import (
    build_query_plan
)

from app.services.execution_engine import (
    execute_query_plan
)

from app.models.response_models import APIResponse

from app.services.sql_validator import validate_sql


router = APIRouter(
    prefix="/api",
    tags=["MetricMind APIs"]
)


# ============================================================
# DATABASE HEALTH
# ============================================================

@router.get("/db-health")
def db_health():
    """
    Check the Snowflake database connection.
    """

    return check_connection()


# ============================================================
# TABLES
# ============================================================

@router.get("/tables")
def tables():
    """
    Returns all tables from the connected Snowflake database.
    """

    return get_tables()


# ============================================================
# TABLE COLUMNS
# ============================================================

@router.get("/tables/{table_name}/columns")
def table_columns(table_name: str):
    """
    Returns the schema (columns) of a specific table.
    """

    return get_table_columns(table_name)


# ============================================================
# SEMANTIC METRICS
# ============================================================

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


# ============================================================
# GENERATE SQL FROM METRIC
# ============================================================

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


# ============================================================
# EXECUTE SINGLE METRIC
# ============================================================

@router.get("/query/{metric_name}")
def execute_metric(metric_name: str):
    """
    Generates SQL from a semantic metric,
    validates the SQL for safety,
    and executes it in Snowflake.
    """

    try:

        metric = get_metric(metric_name)

        if metric is None:

            return {
                "status": "Failed",
                "message": "Metric not found."
            }

        # ----------------------------------------------------
        # Generate SQL
        # ----------------------------------------------------

        sql = generate_sql(metric_name)

        # ----------------------------------------------------
        # SQL Safety Validation
        # ----------------------------------------------------

        validation = validate_sql(sql)

        if not validation.get("valid"):

            return {
                "status": "Failed",
                "message": validation.get(
                    "error",
                    "Generated SQL failed safety validation."
                )
            }

        # ----------------------------------------------------
        # Execute validated SQL
        # ----------------------------------------------------

        result = execute_query(sql)

        if result.get("status") == "Failed":

            return result

        return {
            "metric": metric_name,
            "sql": sql,
            "value": result["result"]
        }

    except Exception as e:

        print(
            f"[MetricMind Error] "
            f"{type(e).__name__}: {str(e)}"
        )

        return {
            "status": "Failed",
            "message": (
                "Unable to execute the metric "
                "at the moment. Please try again."
            )
        }


# ============================================================
# NATURAL LANGUAGE BUSINESS QUESTION
# ============================================================

@router.post(
    "/ask",
    response_model=APIResponse
)
def ask_question(payload: dict = Body(...)):
    """
    Accepts a natural language question
    and returns the business answer.

    Includes validation and graceful error handling
    so unexpected backend errors do not expose
    raw server tracebacks to the user.
    """

    try:

        # ----------------------------------------------------
        # Extract question
        # ----------------------------------------------------

        question = payload.get("question", "").strip()

        # ----------------------------------------------------
        # Empty question validation
        # ----------------------------------------------------

        if not question:

            return {
                "success": False,
                "status": "Failed",
                "error": "Please enter a question."
            }

        # ----------------------------------------------------
        # Question length validation
        # ----------------------------------------------------

        if len(question) > 500:

            return {
                "success": False,
                "status": "Failed",
                "error": (
                    "Question is too long. "
                    "Please keep it under 500 characters."
                )
            }

        # ----------------------------------------------------
        # Build semantic query plan
        # ----------------------------------------------------

        plan = build_query_plan(question)

        # ----------------------------------------------------
        # Validate metric detection
        # ----------------------------------------------------

        if not plan.get("metrics"):

            return {
                "success": False,
                "status": "Failed",
                "error": (
                    "Unable to identify a supported "
                    "business metric from your question."
                )
            }

        # ----------------------------------------------------
        # Validate semantic metrics
        # ----------------------------------------------------

        for metric_name in plan["metrics"]:

            metric = get_metric(metric_name)

            if metric is None:

                return {
                    "success": False,
                    "status": "Failed",
                    "error": f"Unsupported metric: {metric_name}"
                }

        # ----------------------------------------------------
        # Execute semantic query
        # ----------------------------------------------------

        result = execute_query_plan(plan)

        # ----------------------------------------------------
        # Handle execution failure
        # ----------------------------------------------------

        if result.get("status") == "Failed":

            return {
                "success": False,
                "status": "Failed",
                "error": result.get(
                    "message",
                    result.get(
                        "error",
                        "Unable to execute the business query."
                    )
                )
            }

        # ----------------------------------------------------
        # Successful response
        # ----------------------------------------------------

        return {
            "success": True,

            "type": result.get("query_type"),

            "question": question,

            "query_plan": plan,

            "sql": result.get("sql"),

            "data": result,

            "message": None
        }

    # ========================================================
    # UNEXPECTED ERROR HANDLING
    # ========================================================

    except Exception as e:

        print(
            f"[MetricMind Error] "
            f"{type(e).__name__}: {str(e)}"
        )

        return {
            "success": False,
            "status": "Failed",
            "error": (
                "Unable to process your business question "
                "at the moment. Please try again."
            )
        }


# ============================================================
# MULTI-METRIC DETECTION
# ============================================================

@router.post("/ask-multi")
def ask_multi(payload: dict = Body(...)):
    """
    Detect multiple semantic metrics from
    a natural language question.
    """

    question = payload.get("question", "").strip()

    if not question:

        return {
            "status": "Failed",
            "message": "Please enter a question."
        }

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


# ============================================================
# QUERY PLAN
# ============================================================

@router.post("/query-plan")
def query_plan(payload: dict = Body(...)):
    """
    Build and return the semantic query plan.
    """

    question = payload.get("question", "").strip()

    if not question:

        return {
            "status": "Failed",
            "message": "Please enter a question."
        }

    plan = build_query_plan(question)

    return plan