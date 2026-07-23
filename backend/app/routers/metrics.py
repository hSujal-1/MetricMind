from fastapi import APIRouter

from app.services.snowflake_service import (
    check_connection,
    get_tables,
    get_table_columns,
)

from app.services.metrics_service import get_all_metrics

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