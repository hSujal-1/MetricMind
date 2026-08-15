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

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!data || !data.length) {
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

  const chartData = data.map((row) => ({
    [xKey]: row[xKey],
    [yKey]: Number(row[yKey]) || 0,
  }));

  // =========================================================
  // FORMAT LARGE NUMBERS
  // =========================================================

  const formatValue = (value: number) => {

    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
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
            Trend over time
          </p>

        </div>
      )}

      {/* =====================================================
          CHART AREA
      ===================================================== */}

      <div className="h-[420px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <RechartsLineChart
            data={chartData}
            margin={{
              top: 10,
              right: 25,
              left: 10,
              bottom: 10,
            }}
          >

            {/* =================================================
                GRID
            ================================================= */}

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E7DED2"
              vertical={false}
            />

            {/* =================================================
                X AXIS
            ================================================= */}

            <XAxis
              dataKey={xKey}
              tick={{
                fill: "#756F67",
                fontSize: 12,
                fontWeight: 500,
              }}
              axisLine={{
                stroke: "#E7DED2",
              }}
              tickLine={false}
            />

            {/* =================================================
                Y AXIS
            ================================================= */}

            <YAxis
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
                stroke: "#D99A5B",
                strokeWidth: 1,
                strokeDasharray: "4 4",
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
                LINE
            ================================================= */}

            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#C65D32"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#FFFDF8",
                stroke: "#C65D32",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#C65D32",
                stroke: "#FFFDF8",
                strokeWidth: 2,
              }}
            />

          </RechartsLineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}