"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type HorizontalBarChartProps = {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  title?: string;
};

export default function HorizontalBarChart({
  data,
  xKey,
  yKey,
  title,
}: HorizontalBarChartProps) {
  if (!data || !data.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-8 text-center">
        <p className="text-slate-400">
          No visualization data available.
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Prepare chart data
  // ---------------------------------------------------------

  const chartData = data
    .map((row) => ({
      [xKey]: String(row[xKey] ?? "Unknown"),
      [yKey]: Number(row[yKey]) || 0,
    }))
    .sort((a, b) => b[yKey] - a[yKey]);

  // ---------------------------------------------------------
  // Display only top 15 categories
  // ---------------------------------------------------------

  const visibleData = chartData.slice(0, 15);

  // ---------------------------------------------------------
  // Format large numbers
  // ---------------------------------------------------------

  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }

    return value.toLocaleString();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-6">

      {/* ---------------------------------------------------
          Title
      --------------------------------------------------- */}

      {title && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white">
            {title}
          </h4>

          <p className="mt-1 text-sm text-slate-400">
            Showing top {visibleData.length} categories
          </p>
        </div>
      )}

      {/* ---------------------------------------------------
          Chart
      --------------------------------------------------- */}

      <div
        style={{
          width: "100%",
          height: Math.max(400, visibleData.length * 45),
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={visibleData}
            layout="vertical"
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="rgba(255,255,255,0.08)"
            />

            {/* ------------------------------------------------
                Category axis
            ------------------------------------------------ */}

            <YAxis
              type="category"
              dataKey={xKey}
              width={130}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* ------------------------------------------------
                Numeric axis
            ------------------------------------------------ */}

            <XAxis
              type="number"
              tick={{
                fill: "#64748b",
                fontSize: 11,
              }}
              tickFormatter={formatValue}
              axisLine={false}
              tickLine={false}
            />

            {/* ------------------------------------------------
                Tooltip
            ------------------------------------------------ */}

            <Tooltip
              cursor={{
                fill: "rgba(255,255,255,0.04)",
              }}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              formatter={(value: any) => [
                Number(value).toLocaleString(),
                yKey,
              ]}
            />

            {/* ------------------------------------------------
                Bars
            ------------------------------------------------ */}

            <Bar
              dataKey={yKey}
              radius={[0, 8, 8, 0]}
              fill="#8b5cf6"
              barSize={24}
            />

          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}