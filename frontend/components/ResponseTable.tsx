type ResponseTableProps = {
  columns: string[];
  rows: Record<string, any>[];
};

export default function ResponseTable({
  columns,
  rows,
}: ResponseTableProps) {

  // =========================================================
  // FORMAT CELL VALUE
  // =========================================================

  const formatValue = (value: any) => {

    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    if (typeof value === "number") {
      return value.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      });
    }

    return String(value);
  };

  // =========================================================
  // FORMAT COLUMN NAME
  // =========================================================

  const formatColumn = (column: string) => {

    return column
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  // =========================================================
  // CHECK NUMERIC VALUE
  // =========================================================

  const isNumericValue = (value: any) => {

    return (
      typeof value === "number" ||
      (
        typeof value === "string" &&
        value.trim() !== "" &&
        Number.isFinite(
          Number(
            value.replace(/,/g, "")
          )
        )
      )
    );
  };

  // =========================================================
  // CHECK IF COLUMN IS NUMERIC
  // =========================================================

  const isNumericColumn = (column: string) => {

    return rows.some((row) =>
      isNumericValue(row[column])
    );
  };

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!columns.length || !rows.length) {

    return (
      <div
        className="
          flex
          min-h-[180px]
          items-center
          justify-center
          rounded-2xl
          border
          border-[#E7DED2]
          bg-[#FFFDF8]
          px-6
          text-center
        "
      >

        <div>

          <div
            className="
              mx-auto
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-[#E7DED2]
              bg-[#F7F3EA]
              text-lg
              text-[#756F67]
            "
          >
            —
          </div>

          <p
            className="
              mt-3
              text-sm
              font-semibold
              text-[#25221F]
            "
          >
            No results available
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[#756F67]
            "
          >
            There is no detailed data to display.
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // TABLE
  // =========================================================

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        shadow-[0_8px_30px_rgba(80,50,20,0.05)]
      "
    >

      {/* =====================================================
          SCROLLABLE AREA
      ===================================================== */}

      <div
        className="
          w-full
          overflow-x-auto
        "
      >

        <table
          className="
            min-w-full
            border-collapse
          "
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <thead>

            <tr
              className="
                border-b
                border-[#E7DED2]
                bg-[#F7F3EA]
              "
            >

              {columns.map((column) => {

                const numericColumn =
                  isNumericColumn(column);

                return (

                  <th
                    key={column}
                    className={`
                      whitespace-nowrap
                      px-5
                      py-4
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      text-[#C65D32]
                      ${
                        numericColumn
                          ? "text-right"
                          : "text-left"
                      }
                      sm:px-6
                    `}
                  >
                    {formatColumn(column)}
                  </th>

                );

              })}

            </tr>

          </thead>

          {/* =================================================
              BODY
          ================================================= */}

          <tbody>

            {rows.map((row, index) => (

              <tr
                key={index}
                className="
                  border-b
                  border-[#E7DED2]
                  last:border-b-0
                  transition-colors
                  duration-200
                  hover:bg-[#F7F3EA]/70
                "
              >

                {columns.map((column) => {

                  const value =
                    row[column];

                  const numeric =
                    isNumericValue(value);

                  return (

                    <td
                      key={column}
                      className={`
                        whitespace-nowrap
                        px-5
                        py-4
                        text-sm
                        font-medium
                        ${
                          numeric
                            ? "text-right tabular-nums text-[#25221F]"
                            : "text-left text-[#25221F]"
                        }
                        sm:px-6
                      `}
                    >
                      {formatValue(value)}
                    </td>

                  );

                })}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}