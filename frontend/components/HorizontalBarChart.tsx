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

type ChartRow = {
  label: string;
  value: number;
};

export default function HorizontalBarChart({
  data,
  xKey,
  yKey,
  title,
}: HorizontalBarChartProps) {
  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!data || data.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-[#E7DED2]
          bg-[#FFFDF8]
          p-8
          text-center
        "
      >
        <p className="text-sm text-[#756F67]">
          No visualization data available.
        </p>
      </div>
    );
  }

  // =========================================================
  // PREPARE CHART DATA
  // =========================================================

  const chartData: ChartRow[] = data
    .map((row): ChartRow => ({
      label: String(row[xKey] ?? "Unknown"),
      value: Number(row[yKey]) || 0,
    }))
    .sort((a, b) => b.value - a.value);

  // =========================================================
  // DISPLAY TOP 15
  // =========================================================

  const visibleData = chartData.slice(0, 15);

  // =========================================================
  // FORMAT LARGE NUMBERS
  // =========================================================

  const formatValue = (value: number): string => {
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }

    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }

    return value.toLocaleString("en-IN");
  };

  // =========================================================
  // CHART
  // =========================================================

  return (
    <div
      className="
        rounded-2xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        p-6
      "
    >
      {/* =====================================================
          TITLE
      ===================================================== */}

      {title && (
        <div className="mb-6">
          <h4
            className="
              text-lg
              font-semibold
              text-[#25221F]
            "
          >
            {title}
          </h4>

          <p
            className="
              mt-1
              text-sm
              text-[#756F67]
            "
          >
            Showing top {visibleData.length} results
          </p>
        </div>
      )}

      {/* =====================================================
          CHART
      ===================================================== */}

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
              right: 45,
              left: 20,
              bottom: 10,
            }}
          >
            {/* =================================================
                GRID
            ================================================= */}

            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#E7DED2"
            />

            {/* =================================================
                CATEGORY AXIS
            ================================================= */}

            <YAxis
              type="category"
              dataKey="label"
              width={130}
              tick={{
                fill: "#756F67",
                fontSize: 12,
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />

            {/* =================================================
                NUMERIC AXIS
            ================================================= */}

            <XAxis
              type="number"
              dataKey="value"
              tick={{
                fill: "#756F67",
                fontSize: 11,
                fontWeight: 500,
              }}
              tickFormatter={formatValue}
              axisLine={{
                stroke: "#E7DED2",
              }}
              tickLine={false}
            />

            {/* =================================================
                TOOLTIP
            ================================================= */}

            <Tooltip
              cursor={{
                fill: "rgba(198,93,50,0.06)",
              }}
              contentStyle={{
                backgroundColor: "#FFFDF8",
                border: "1px solid #E7DED2",
                borderRadius: "12px",
                color: "#25221F",
                boxShadow:
                  "0 10px 30px rgba(70,50,30,0.12)",
              }}
              labelStyle={{
                color: "#25221F",
                fontWeight: 600,
                marginBottom: "4px",
              }}
              itemStyle={{
                color: "#C65D32",
                fontWeight: 600,
              }}
              formatter={(value: any) => [
                Number(value).toLocaleString("en-IN"),
                yKey.replaceAll("_", " "),
              ]}
            />

            {/* =================================================
                BARS
            ================================================= */}

            <Bar
              dataKey="value"
              name={yKey.replaceAll("_", " ")}
              radius={[0, 8, 8, 0]}
              fill="#C65D32"
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}