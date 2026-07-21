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