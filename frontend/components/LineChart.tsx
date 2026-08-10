"use client";

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type LineChartProps = {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  title?: string;
};

export default function BusinessLineChart({
  data,
  xKey,
  yKey,
  title,
}: LineChartProps) {

  if (!data || !data.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-8 text-center">
        <p className="text-slate-400">
          No visualization data available.
        </p>
      </div>
    );
  }

  const chartData = data.map((row) => ({
    [xKey]: row[xKey],
    [yKey]: Number(row[yKey]) || 0,
  }));

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

      {title && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white">
            {title}
          </h4>

          <p className="mt-1 text-sm text-slate-400">
            Trend over time
          </p>
        </div>
      )}

      <div className="h-[420px] w-full">

        <ResponsiveContainer width="100%" height="100%">

          <RechartsLineChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            <XAxis
              dataKey={xKey}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#64748b",
                fontSize: 11,
              }}
              tickFormatter={formatValue}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                stroke: "rgba(255,255,255,0.15)",
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

            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#22d3ee"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            />

          </RechartsLineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}