type ResponseTableProps = {
  columns: string[];
  rows: Record<string, any>[];
};

export default function ResponseTable({
  columns,
  rows,
}: ResponseTableProps) {

  return (
    <div className="w-full overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-slate-900">

          <tr>

            {columns.map((column) => (

              <th
                key={column}
                className="
                  whitespace-nowrap
                  px-6
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-violet-400
                "
              >
                {column.replaceAll("_", " ")}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {rows.map((row, index) => (

            <tr
              key={index}
              className="
                border-t
                border-slate-800
                transition
                hover:bg-white/[0.03]
              "
            >

              {columns.map((column) => (

                <td
                  key={column}
                  className="
                    whitespace-nowrap
                    px-6
                    py-4
                    text-sm
                    text-slate-300
                  "
                >
                  {row[column] ?? "—"}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}