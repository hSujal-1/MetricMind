from fastapi import APIRouter

from app.services.snowflake_service import (
    check_connection,
    get_tables,
    get_table_columns,
)

router = APIRouter()


@router.get("/db-health")
def db_health():
    return check_connection()

@router.get("/tables")
def tables():
    return get_tables()

@router.get("/tables/{table_name}/columns")
def table_columns(table_name: str):
    return get_table_columns(table_name)