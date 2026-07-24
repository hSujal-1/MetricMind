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

    # Add WHERE clause if filters exist
    if filters:
        conditions = []

        for column, value in filters.items():
            conditions.append(f"{column} = '{value}'")

        sql += "WHERE " + " AND ".join(conditions)

    sql += ";"

    return sql.strip()


def generate_sql_from_plan(plan: dict):
    """
    Generate SQL from a semantic query plan.
    Supports one or more metrics.
    """

    metrics = plan.get("metrics", [])
    filters = plan.get("filters", {})

    if not metrics:
        return None

    select_parts = []
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

    if filters:

        conditions = []

        for column, value in filters.items():
            conditions.append(
                f"{column} = '{value}'"
            )

        sql += "WHERE " + " AND ".join(conditions)

    sql += ";"

    return sql.strip()