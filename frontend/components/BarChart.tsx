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

  // =========================================================
  // NORMALIZE METRIC VALUES
  // =========================================================

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

  // =========================================================
  // DEBUG
  // =========================================================


  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!normalizedData.length) {

    return (
      <div
        className="
          flex
          h-[380px]
          items-center
          justify-center
          rounded-2xl
          border
          border-[#E7DED2]
          bg-[#FFFDF8]
        "
      >

        <p className="text-sm text-[#756F67]">
          No chart data available.
        </p>

      </div>
    );
  }

  // =========================================================
  // CHART
  // =========================================================

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
            angle={-30}
            textAnchor="end"
            interval={0}
            height={80}
          />

          {/* =================================================
              Y AXIS
          ================================================= */}

          <YAxis
            tick={{
              fill: "#756F67",
              fontSize: 12,
              fontWeight: 500,
            }}
            axisLine={{
              stroke: "#E7DED2",
            }}
            tickLine={false}
            tickFormatter={(value) =>
              Number(value).toLocaleString("en-IN")
            }
          />

          {/* =================================================
              TOOLTIP
          ================================================= */}

          <Tooltip
            cursor={{
              fill: "rgba(198,93,50,0.06)",
            }}
            formatter={(value: any) => {

              const numberValue = Number(value);

              return Number.isFinite(numberValue)
                ? numberValue.toLocaleString("en-IN")
                : "0";
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
          />

          {/* =================================================
              BAR
          ================================================= */}

          <Bar
            dataKey={yKey}
            fill="#C65D32"
            radius={[8, 8, 0, 0]}
            minPointSize={4}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}