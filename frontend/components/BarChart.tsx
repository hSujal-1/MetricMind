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

interface BusinessBarChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
}

export default function BusinessBarChart({
  data,
  xKey,
  yKey,
}: BusinessBarChartProps) {

  // Convert metric values safely into numbers
  const normalizedData = data.map((item) => {

    const rawValue = item[yKey];

    let numericValue: number;

    if (typeof rawValue === "number") {
      numericValue = rawValue;
    } else {
      numericValue = Number(
        String(rawValue ?? "")
          .replace(/,/g, "")
          .trim()
      );
    }

    return {
      ...item,
      [yKey]: Number.isFinite(numericValue)
        ? numericValue
        : 0,
    };
  });

  console.log("Chart data:", normalizedData);
  console.log("X key:", xKey);
  console.log("Y key:", yKey);

  // Empty state
  if (!normalizedData.length) {
    return (
      <div className="flex h-[380px] items-center justify-center rounded-2xl border border-white/10 bg-slate-900/50">
        <p className="text-slate-500">
          No chart data available.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[380px] w-full">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <BarChart
          data={normalizedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 70,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.07)"
            vertical={false}
          />

          <XAxis
            dataKey={xKey}
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "rgba(255,255,255,0.12)",
            }}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            interval={0}
            height={80}
          />

          <YAxis
            tick={{
              fill: "#94a3b8",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "rgba(255,255,255,0.12)",
            }}
            tickLine={false}
            tickFormatter={(value) =>
              Number(value).toLocaleString("en-IN")
            }
          />

          <Tooltip
            cursor={false}
            formatter={(value: any) => {
              const numberValue = Number(value);

              return Number.isFinite(numberValue)
                ? numberValue.toLocaleString("en-IN")
                : "0";
            }}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(139,92,246,0.35)",
              borderRadius: "12px",
              color: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
            labelStyle={{
              color: "#c4b5fd",
              fontWeight: 600,
              marginBottom: "4px",
            }}
            itemStyle={{
              color: "#22d3ee",
            }}
          />

          <Bar
            dataKey={yKey}
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
            minPointSize={4}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}