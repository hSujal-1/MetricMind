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

// =========================================================
// WARM BUSINESS INTELLIGENCE PALETTE
// =========================================================

const CHART_COLORS = [
  "#C65D32", // Burnt orange
  "#D99A5B", // Warm amber
  "#3F7D58", // Muted green
  "#A86F4C", // Warm brown
  "#C9825B", // Soft terracotta
  "#7E8B70", // Sage
  "#B85C38", // Deep terracotta
  "#D6A46D", // Light amber
];

// =========================================================
// NUMBER FORMATTER
// =========================================================

function formatNumber(value: any): string {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value ?? "");
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(number);
}

// =========================================================
// NAME FORMATTER
// =========================================================

function formatName(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// =========================================================
// CUSTOM TOOLTIP
// =========================================================

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
    <div
      className="
        rounded-xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        px-4
        py-3
        shadow-[0_10px_30px_rgba(70,50,30,0.14)]
      "
    >
      <p
        className="
          text-sm
          font-semibold
          text-[#25221F]
        "
      >
        {formatName(String(item.name))}
      </p>

      <p
        className="
          mt-1
          text-xs
          font-semibold
          text-[#C65D32]
        "
      >
        {formatNumber(item.value)}
      </p>
    </div>
  );
}

// =========================================================
// PIE / DONUT CHART
// =========================================================

export default function BusinessPieChart({
  data,
  nameKey,
  valueKey,
  title = "Distribution",
  donut = true,
}: PieChartProps) {

  // =======================================================
  // EMPTY STATE
  // =======================================================

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

  // =======================================================
  // NORMALIZE DATA
  // =======================================================

  const chartData = data.map((item) => ({
    ...item,
    [valueKey]: Number(item[valueKey]) || 0,
  }));

  // =======================================================
  // TOTAL
  // =======================================================

  const total = chartData.reduce(
    (sum, item) =>
      sum + (Number(item[valueKey]) || 0),
    0
  );

  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        p-6
      "
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-4">

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
          Distribution of business performance.
        </p>

      </div>

      {/* ===================================================
          CHART
      =================================================== */}

      <div className="h-[380px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <RechartsPieChart>

            <Pie
              data={chartData}
              dataKey={valueKey}
              nameKey={nameKey}
              cx="50%"
              cy="45%"
              innerRadius={donut ? 78 : 0}
              outerRadius={125}
              paddingAngle={3}
              cornerRadius={4}
              labelLine={false}
              label={({ name, percent }: any) =>
                `${formatName(String(name))} ${(
                  percent * 100
                ).toFixed(1)}%`
              }
            >

              {chartData.map(
                (_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      CHART_COLORS[
                        index %
                          CHART_COLORS.length
                      ]
                    }
                    stroke="#FFFDF8"
                    strokeWidth={2}
                  />
                )
              )}

            </Pie>

            {/* =================================================
                TOOLTIP
            ================================================= */}

            <Tooltip
              content={
                <CustomTooltip />
              }
            />

            {/* =================================================
                LEGEND
            ================================================= */}

            <Legend
              verticalAlign="bottom"
              height={45}
              wrapperStyle={{
                color: "#756F67",
                fontSize: "12px",
              }}
              formatter={(value) =>
                formatName(String(value))
              }
            />

          </RechartsPieChart>

        </ResponsiveContainer>

      </div>

      {/* =====================================================
          DONUT CENTER TOTAL
      ===================================================== */}

      {donut && (
        <div
          className="
            pointer-events-none
            -mt-[215px]
            mb-[170px]
            flex
            justify-center
          "
        >

          <div className="text-center">

            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#756F67]
              "
            >
              Total
            </p>

            <p
              className="
                mt-1
                text-lg
                font-bold
                text-[#25221F]
              "
            >
              {formatNumber(total)}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}