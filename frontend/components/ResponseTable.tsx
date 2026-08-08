type ResponseTableProps = {
  columns: string[];
  rows: Record<string, any>[];
};

export default function ResponseTable({
  columns,
  rows,
}: ResponseTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">

      <table className="min-w-full">

        <thead className="bg-slate-800/80">

          <tr>

            {columns.map((column) => (
              <th
                key={column}
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-cyan-400
                "
              >
                {column}
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
                hover:bg-slate-800/40
              "
            >

              {columns.map((column) => (

                <td
                  key={column}
                  className="
                    px-6
                    py-4
                    text-sm
                    text-slate-200
                  "
                >
                  {row[column]}
                </td>

              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}