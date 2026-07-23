# app/semantic/metrics.py

SEMANTIC_METRICS = {
    "total_sales": {
        "display_name": "Total Sales",
        "aliases": [
            "sales",
            "total sales",
            "revenue",
            "overall sales",
            "sales amount",
            "total revenue",
            "how much did we sell"
        ],
        "table": "GLOBAL_SUPERSTORE",
        "column": "SALES",
        "aggregation": "SUM",
        "description": "Total revenue generated from all sales."
    },

    "total_profit": {
        "display_name": "Total Profit",
        "aliases": [
            "profit",
            "total profit",
            "overall profit",
            "earnings",
            "net profit",
            "profit amount"
        ],
        "table": "GLOBAL_SUPERSTORE",
        "column": "PROFIT",
        "aggregation": "SUM",
        "description": "Total profit generated from all sales."
    },

    "total_orders": {
        "display_name": "Total Orders",
        "aliases": [
            "orders",
            "total orders",
            "order count",
            "number of orders",
            "customer orders"
        ],
        "table": "GLOBAL_SUPERSTORE",
        "column": "ORDER_ID",
        "aggregation": "COUNT",
        "description": "Total number of customer orders."
    },

    "average_discount": {
        "display_name": "Average Discount",
        "aliases": [
            "discount",
            "average discount",
            "avg discount",
            "discount percentage",
            "mean discount"
        ],
        "table": "GLOBAL_SUPERSTORE",
        "column": "DISCOUNT",
        "aggregation": "AVG",
        "description": "Average discount applied to orders."
    }
}