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