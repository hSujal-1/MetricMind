# app/semantic/metrics.py

SEMANTIC_METRICS = {

    # ----------------------------------
    # SALES
    # ----------------------------------

    "total_sales": {
        "display_name": "Total Sales",

        "aliases": {
            "total sales": 5,
            "overall sales": 4,
            "sales amount": 4,
            "total revenue": 5,
            "revenue": 3,
            "sales": 2,
            "how much did we sell": 4
        },

        "table": "GLOBAL_SUPERSTORE_NEW",
        "column": "SALES",
        "aggregation": "SUM",

        "description": "Total revenue generated from all sales."
    },


    "average_sales": {
        "display_name": "Average Sales",

        "aliases": {
            "average sales": 5,
            "avg sales": 5,
            "mean sales": 5,
            "average revenue": 5,
            "avg revenue": 5,
            "mean revenue": 5
        },

        "table": "GLOBAL_SUPERSTORE_NEW",
        "column": "SALES",
        "aggregation": "AVG",

        "description": "Average sales value across records."
    },


    # ----------------------------------
    # PROFIT
    # ----------------------------------

    "total_profit": {
        "display_name": "Total Profit",

        "aliases": {
            "total profit": 5,
            "overall profit": 4,
            "profit amount": 4,
            "net profit": 5,
            "profit": 2,
            "earnings": 3
        },

        "table": "GLOBAL_SUPERSTORE_NEW",
        "column": "PROFIT",
        "aggregation": "SUM",

        "description": "Total profit generated from all sales."
    },


    "average_profit": {
        "display_name": "Average Profit",

        "aliases": {
            "average profit": 5,
            "avg profit": 5,
            "mean profit": 5,
            "average earnings": 5,
            "avg earnings": 5
        },

        "table": "GLOBAL_SUPERSTORE_NEW",
        "column": "PROFIT",
        "aggregation": "AVG",

        "description": "Average profit value across records."
    },


    # ----------------------------------
    # QUANTITY
    # ----------------------------------

    "total_quantity": {
        "display_name": "Total Quantity",

        "aliases": {
            "total quantity": 5,
            "overall quantity": 4,
            "quantity sold": 5,
            "units sold": 5,
            "total units": 5,
            "units": 2,
            "quantity": 2
        },

        "table": "GLOBAL_SUPERSTORE_NEW",
        "column": "QUANTITY",
        "aggregation": "SUM",

        "description": "Total number of units sold."
    },


    "average_quantity": {
        "display_name": "Average Quantity",

        "aliases": {
            "average quantity": 5,
            "avg quantity": 5,
            "mean quantity": 5,
            "average units": 5,
            "avg units": 5
        },

        "table": "GLOBAL_SUPERSTORE_NEW",
        "column": "QUANTITY",
        "aggregation": "AVG",

        "description": "Average quantity per record."
    },


    # ----------------------------------
    # ORDERS
    # ----------------------------------

    "total_orders": {
        "display_name": "Total Orders",

        "aliases": {
            "total orders": 5,
            "order count": 5,
            "number of orders": 5,
            "customer orders": 4,
            "orders": 2
        },

        "table": "GLOBAL_SUPERSTORE_NEW",
        "column": "ORDER_ID",
        "aggregation": "COUNT",

        "description": "Total number of customer orders."
    },


    # ----------------------------------
    # DISCOUNT
    # ----------------------------------

    "average_discount": {
        "display_name": "Average Discount",

        "aliases": {
            "average discount": 5,
            "avg discount": 5,
            "mean discount": 5,
            "discount percentage": 4,
            "discount": 2
        },

        "table": "GLOBAL_SUPERSTORE_NEW",
        "column": "DISCOUNT",
        "aggregation": "AVG",

        "description": "Average discount applied to orders."
    }
}