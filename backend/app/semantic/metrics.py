# app/semantic/metrics.py

SEMANTIC_METRICS = {
    "total_sales": {
        "display_name": "Total Sales",
        "table": "GLOBAL_SUPERSTORE",
        "column": "SALES",
        "aggregation": "SUM",
        "description": "Total revenue generated from all sales."
    },

    "total_profit": {
        "display_name": "Total Profit",
        "table": "GLOBAL_SUPERSTORE",
        "column": "PROFIT",
        "aggregation": "SUM",
        "description": "Total profit generated from all sales."
    },

    "total_orders": {
        "display_name": "Total Orders",
        "table": "GLOBAL_SUPERSTORE",
        "column": "ORDER_ID",
        "aggregation": "COUNT",
        "description": "Total number of customer orders."
    },

    "average_discount": {
        "display_name": "Average Discount",
        "table": "GLOBAL_SUPERSTORE",
        "column": "DISCOUNT",
        "aggregation": "AVG",
        "description": "Average discount applied to orders."
    }
}