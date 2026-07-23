from app.services.metrics_service import get_metric


def generate_sql(metric_name: str):
    """
    Generates SQL from a semantic metric.
    """

    metric = get_metric(metric_name)

    if metric is None:
        return None

    sql = f"""
SELECT {metric['aggregation']}({metric['column']})
FROM {metric['table']};
"""

    return sql.strip()