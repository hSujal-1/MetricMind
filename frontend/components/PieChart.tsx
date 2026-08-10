"use client";

import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type PieChartProps = {
  data: any[];
  nameKey: string;
  valueKey: string;
  title?: string;
  donut?: boolean;
};

function formatNumber(value: any): string {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value ?? "");
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(number);
}

function formatName(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div className="rounded-lg border border-white/10 bg-[#080d20] px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-white">
        {formatName(String(item.name))}
      </p>

      <p className="mt-1 text-xs text-cyan-400">
        {formatNumber(item.value)}
      </p>
    </div>
  );
}

export default function BusinessPieChart({
  data,
  nameKey,
  valueKey,
  title = "Distribution",
  donut = true,
}: PieChartProps) {
  if (!data || !data.length) {
    return null;
  }

  const total = data.reduce(
    (sum, item) =>
      sum + (Number(item[valueKey]) || 0),
    0
  );

  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#070c1d] p-4">

      {/* Header */}

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white">
          {title}
        </h4>

        <p className="mt-1 text-xs text-slate-500">
          Distribution of business performance.
        </p>
      </div>

      {/* Chart */}

      <div className="h-[380px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <RechartsPieChart>

            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              cx="50%"
              cy="45%"
              innerRadius={donut ? 75 : 0}
              outerRadius={125}
              paddingAngle={2}
              labelLine={false}
              label={({
                name,
                percent,
              }: any) =>
                `${String(name)} ${(
                  percent * 100
                ).toFixed(1)}%`
              }
            >

              {data.map(
                (_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#8b5cf6",
                        "#22d3ee",
                        "#34d399",
                        "#f59e0b",
                        "#f472b6",
                        "#60a5fa",
                        "#a78bfa",
                        "#2dd4bf",
                      ][
                        index % 8
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip
              content={<CustomTooltip />}
            />

            <Legend
              verticalAlign="bottom"
              height={45}
              wrapperStyle={{
                color: "#94a3b8",
                fontSize: "12px",
              }}
              formatter={(value) =>
                formatName(String(value))
              }
            />

          </RechartsPieChart>

        </ResponsiveContainer>

      </div>

      {/* Center total for donut */}

      {donut && (
        <div className="-mt-[215px] mb-[170px] flex justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Total
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {formatNumber(total)}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}