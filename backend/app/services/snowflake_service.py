from app.database import get_connection


def check_connection():
    """
    Connects to Snowflake and returns the current version.
    """

    conn = None
    cur = None

    try:
        conn = get_connection()

        cur = conn.cursor()

        cur.execute("SELECT CURRENT_VERSION();")

        version = cur.fetchone()[0]

        return {
            "status": "Connected",
            "snowflake_version": version
        }

    except Exception as e:
        return {
            "status": "Failed",
            "error": str(e)
        }

    finally:
        if cur:
            cur.close()

        if conn:
            conn.close()


def get_tables():
    """
    Returns all tables from the current Snowflake database/schema.
    """

    conn = None
    cur = None

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SHOW TABLES;")

        rows = cur.fetchall()

        tables = [row[1] for row in rows]

        return {
            "count": len(tables),
            "tables": tables
        }

    except Exception as e:
        return {
            "status": "Failed",
            "error": str(e)
        }

    finally:
        if cur:
            cur.close()

        if conn:
            conn.close()

def get_table_columns(table_name):
        """
        Returns column names and data types for a table.
        """

        conn = None
        cur = None

        try:
            conn = get_connection()
            cur = conn.cursor()

            cur.execute(f"DESC TABLE {table_name};")

            rows = cur.fetchall()

            columns = []

            for row in rows:
                columns.append({
                    "name": row[0],
                    "type": row[1]
                })

            return {
                "table": table_name,
                "column_count": len(columns),
                "columns": columns
            }

        except Exception as e:
            return {
                "status": "Failed",
                "error": str(e)
            }

        finally:
            if cur:
                cur.close()

            if conn:
                conn.close()

def execute_query(sql: str):
    """
    Executes any SQL query and returns the first row.
    Supports both single-metric and multi-metric queries.
    """

    conn = None
    cur = None

    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute(sql)

        result = cur.fetchone()

        return {
            "status": "Success",
            "result": result if result else None
        }

    except Exception as e:
        return {
            "status": "Failed",
            "error": str(e)
        }

    finally:
        if cur:
            cur.close()

        if conn:
            conn.close()

def get_distinct_values(table_name: str, column_name: str):
    """
    Returns distinct values from a table column.
    """

    conn = None
    cur = None

    try:
        conn = get_connection()
        cur = conn.cursor()

        query = f"""
        SELECT DISTINCT {column_name}
        FROM {table_name}
        WHERE {column_name} IS NOT NULL
        ORDER BY {column_name};
        """

        cur.execute(query)

        rows = cur.fetchall()

        return [row[0] for row in rows]

    except Exception as e:
        return []

    finally:
        if cur:
            cur.close()

        if conn:
            conn.close()