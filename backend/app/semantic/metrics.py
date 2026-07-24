# app/semantic/metrics.py

SEMANTIC_METRICS = {
    "total_sales": {
        "display_name": "Total Sales",
        "aliases": {
            "sales": 1,
            "total sales": 3,
            "revenue": 3,
            "overall sales": 2,
            "sales amount": 2,
            "total revenue": 3,
            "how much did we sell": 2
        },
        "table": "GLOBAL_SUPERSTORE",
        "column": "SALES",
        "aggregation": "SUM",
        "description": "Total revenue generated from all sales."
    },

    "total_profit": {
        "display_name": "Total Profit",
        "aliases": {
            "profit": 2,
            "total profit": 3,
            "overall profit": 2,
            "earnings": 3,
            "net profit": 3,
            "profit amount": 2
        },
        "table": "GLOBAL_SUPERSTORE",
        "column": "PROFIT",
        "aggregation": "SUM",
        "description": "Total profit generated from all sales."
    },

    "total_orders": {
        "display_name": "Total Orders",
        "aliases": {
            "orders": 2,
            "total orders": 3,
            "order count": 3,
            "number of orders": 3,
            "customer orders": 2
        },
        "table": "GLOBAL_SUPERSTORE",
        "column": "ORDER_ID",
        "aggregation": "COUNT",
        "description": "Total number of customer orders."
    },

    "average_discount": {
        "display_name": "Average Discount",
        "aliases": {
            "discount": 2,
            "average discount": 3,
            "avg discount": 3,
            "discount percentage": 2,
            "mean discount": 2
        },
        "table": "GLOBAL_SUPERSTORE",
        "column": "DISCOUNT",
        "aggregation": "AVG",
        "description": "Average discount applied to orders."
    }
}