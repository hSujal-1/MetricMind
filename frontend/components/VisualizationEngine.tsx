"use client";

import BusinessBarChart from "@/components/BarChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";
import BusinessLineChart from "@/components/LineChart";
import BusinessPieChart from "@/components/PieChart";

import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type VisualizationEngineProps = {
  data: any[];
  columns: string[];
  groupBy?: string[];
  question?: string;
};

// ============================================================
// HELPERS
// ============================================================

function isNumericValue(value: any): boolean {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return false;
  }

  return !Number.isNaN(Number(value));
}

function formatNumber(value: any): string {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value ?? "");
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(number);
}

function formatMetricName(column: string): string {
  return column
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// ============================================================
// CUSTOM MULTI-METRIC TOOLTIP
// ============================================================

function MultiMetricTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: any;
}) {
  if (
    !active ||
    !payload ||
    !payload.length
  ) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#080d20] px-4 py-3 shadow-xl">
      <p className="mb-2 text-sm font-semibold text-white">
        {String(label)}
      </p>

      <div className="space-y-1">
        {payload.map((item, index) => (
          <div
            key={`${item.dataKey}-${index}`}
            className="flex items-center justify-between gap-6 text-xs"
          >
            <span className="text-slate-400">
              {formatMetricName(item.dataKey)}
            </span>

            <span className="font-semibold text-white">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MULTI-METRIC BAR CHART
// ============================================================

function MultiMetricBarChart({
  data,
  xKey,
  metricKeys,
  title,
  horizontal = false,
}: {
  data: any[];
  xKey: string;
  metricKeys: string[];
  title: string;
  horizontal?: boolean;
}) {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#070c1d] p-4">

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white">
          {title}
        </h4>

        <p className="mt-1 text-xs text-slate-500">
          Comparison across multiple business metrics.
        </p>
      </div>

      <div className="h-[380px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <RechartsBarChart
            data={data}
            layout={
              horizontal
                ? "vertical"
                : "horizontal"
            }
            margin={{
              top: 10,
              right: 20,
              left: horizontal ? 45 : 10,
              bottom: 40,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            {horizontal ? (
              <>
                <XAxis
                  type="number"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey={xKey}
                  width={120}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey={xKey}
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                  angle={
                    metricKeys.length > 1
                      ? -20
                      : 0
                  }
                  textAnchor={
                    metricKeys.length > 1
                      ? "end"
                      : "middle"
                  }
                  height={
                    metricKeys.length > 1
                      ? 60
                      : 30
                  }
                />

                <YAxis
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    formatNumber(value)
                  }
                />
              </>
            )}

            <Tooltip
              content={
                <MultiMetricTooltip />
              }
              cursor={{
                fill: "rgba(255,255,255,0.04)",
              }}
            />

            <Legend
              wrapperStyle={{
                color: "#94a3b8",
                fontSize: "12px",
                paddingTop: "12px",
              }}
              formatter={(value) =>
                formatMetricName(value)
              }
            />

            {metricKeys.map(
              (metricKey, index) => (
                <Bar
                  key={metricKey}
                  dataKey={metricKey}
                  name={formatMetricName(
                    metricKey
                  )}
                  fill={
                    index === 0
                      ? "#8b5cf6"
                      : index === 1
                      ? "#22d3ee"
                      : index === 2
                      ? "#34d399"
                      : index === 3
                      ? "#f59e0b"
                      : "#f472b6"
                  }
                  radius={
                    horizontal
                      ? [0, 4, 4, 0]
                      : [4, 4, 0, 0]
                  }
                  maxBarSize={45}
                />
              )
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============================================================
// MULTI-METRIC LINE CHART
// ============================================================

function MultiMetricLineChart({
  data,
  xKey,
  metricKeys,
  title,
}: {
  data: any[];
  xKey: string;
  metricKeys: string[];
  title: string;
}) {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#070c1d] p-4">

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white">
          {title}
        </h4>

        <p className="mt-1 text-xs text-slate-500">
          Trend comparison across multiple business metrics.
        </p>
      </div>

      <div className="h-[380px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <RechartsLineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 30,
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
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                formatNumber(value)
              }
            />

            <Tooltip
              content={
                <MultiMetricTooltip />
              }
            />

            <Legend
              wrapperStyle={{
                color: "#94a3b8",
                fontSize: "12px",
                paddingTop: "12px",
              }}
              formatter={(value) =>
                formatMetricName(value)
              }
            />

            {metricKeys.map(
              (metricKey, index) => (
                <Line
                  key={metricKey}
                  type="monotone"
                  dataKey={metricKey}
                  name={formatMetricName(
                    metricKey
                  )}
                  stroke={
                    index === 0
                      ? "#8b5cf6"
                      : index === 1
                      ? "#22d3ee"
                      : index === 2
                      ? "#34d399"
                      : index === 3
                      ? "#f59e0b"
                      : "#f472b6"
                  }
                  strokeWidth={2}
                  dot={{
                    r: 3,
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              )
            )}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============================================================
// MAIN VISUALIZATION ENGINE
// ============================================================

export default function VisualizationEngine({
  data,
  columns,
  groupBy = [],
  question = "",
}: VisualizationEngineProps) {

  // ==========================================================
  // SAFETY CHECK
  // ==========================================================

  if (
    !data ||
    !data.length ||
    !columns ||
    columns.length < 2
  ) {
    return null;
  }

  // ==========================================================
  // CHART FIELDS
  // ==========================================================

  const xKey = columns[0];

  // ==========================================================
  // NORMALIZE DATA
  // ==========================================================

  const normalizedRows = data.map(
    (row: any) => {

      // Backend already returned an object
      if (
        row &&
        !Array.isArray(row)
      ) {
        return row;
      }

      // Backend returned array format
      const converted: Record<
        string,
        any
      > = {};

      columns.forEach(
        (
          column: string,
          index: number
        ) => {
          converted[column] =
            row[index];
        }
      );

      return converted;
    }
  );

  // ==========================================================
  // DETERMINE METRIC COLUMNS
  // ==========================================================

  const metricKeys = columns.filter(
    (column) => {

      if (column === xKey) {
        return false;
      }

      return normalizedRows.some(
        (row) =>
          isNumericValue(
            row[column]
          )
      );
    }
  );

  // Safety fallback
  if (!metricKeys.length) {
    return null;
  }

  const yKey = metricKeys[0];

  const hasMultipleMetrics =
    metricKeys.length > 1;

  // ==========================================================
  // QUESTION ANALYSIS
  // ==========================================================

  const normalizedQuestion =
    question.toLowerCase();

  // ----------------------------------------------------------
  // Top / Highest questions
  // ----------------------------------------------------------

  const isTopQuestion =
    normalizedQuestion.includes(
      "top"
    ) ||
    normalizedQuestion.includes(
      "highest"
    ) ||
    normalizedQuestion.includes(
      "best"
    );

  // ----------------------------------------------------------
  // Bottom / Lowest questions
  // ----------------------------------------------------------

  const isBottomQuestion =
    normalizedQuestion.includes(
      "bottom"
    ) ||
    normalizedQuestion.includes(
      "lowest"
    ) ||
    normalizedQuestion.includes(
      "worst"
    );

  // ==========================================================
  // GROUP ANALYSIS
  // ==========================================================

  const groupName = (
    groupBy[0] ||
    xKey ||
    ""
  ).toLowerCase();

  // ==========================================================
  // DIMENSION DETECTION
  // ==========================================================

  const isCity =
    groupName.includes("city");

  const isState =
    groupName.includes("state");

  const isSubCategory =
    groupName.includes("sub");

  const isCategory =
    groupName.includes("category");

  const isRegion =
    groupName.includes("region");

  const isSegment =
    groupName.includes("segment");

  const isCountry =
    groupName.includes("country");

  const isMarket =
    groupName.includes("market");

  // ----------------------------------------------------------
  // Pie / Donut eligible dimensions
  // ----------------------------------------------------------

  const isPieDimension =
    isCategory ||
    isSegment;

  // ==========================================================
  // TIME DIMENSION DETECTION
  // ==========================================================

  const isYear =
    groupName.includes("year");

  const isQuarter =
    groupName.includes("quarter");

  const isMonth =
    groupName.includes("month");

  const isDate =
    groupName.includes("date");

  // ----------------------------------------------------------
  // Overall time-series flag
  // ----------------------------------------------------------

  const isTimeSeries =
    isYear ||
    isQuarter ||
    isMonth ||
    isDate;

  // ==========================================================
  // CHART DATA
  // ==========================================================

  const chartData =
    normalizedRows.map(
      (row) => {

        const converted: Record<
          string,
          any
        > = {
          [xKey]: row[xKey],
        };

        metricKeys.forEach(
          (metricKey) => {
            converted[metricKey] =
              Number(
                row[metricKey]
              ) || 0;
          }
        );

        return converted;
      }
    );

  // ==========================================================
  // SORTING
  // ==========================================================
  //
  // Time series:
  //     Preserve backend chronological order.
  //
  // Normal categorical data:
  //     Sort highest → lowest using
  //     the first metric.
  //
  // ==========================================================

  let sortedChartData = [
    ...chartData,
  ];

  if (!isTimeSeries) {
    sortedChartData =
      sortedChartData.sort(
        (a, b) =>
          Number(b[yKey]) -
          Number(a[yKey])
      );
  }

  // ==========================================================
  // CATEGORY COUNT
  // ==========================================================

  const categoryCount =
    sortedChartData.length;

  // ==========================================================
  // PIE / DONUT DECISION
  // ==========================================================

  const shouldUsePieChart =
    !isTimeSeries &&
    !hasMultipleMetrics &&
    isPieDimension &&
    categoryCount <= 8 &&
    !isTopQuestion &&
    !isBottomQuestion;

  // ==========================================================
  // DETERMINE HORIZONTAL CHART
  // ==========================================================

  const shouldUseHorizontalChart =
    !isTimeSeries &&
    (
      isCity ||
      isState ||
      isSubCategory ||
      isCountry ||
      isMarket ||
      categoryCount > 15 ||
      isTopQuestion ||
      isBottomQuestion
    );

  // ==========================================================
  // LIMIT CATEGORICAL DATA
  // ==========================================================

  let visibleChartData =
    sortedChartData;

  if (
    !isTimeSeries &&
    shouldUseHorizontalChart &&
    categoryCount > 15
  ) {
    visibleChartData =
      sortedChartData.slice(0, 15);
  }

  // ==========================================================
  // TITLE
  // ==========================================================

  let title =
    "Business Performance";

  // ----------------------------------------------------------
  // Multi-metric title
  // ----------------------------------------------------------

  if (hasMultipleMetrics) {
    title = metricKeys
      .map(formatMetricName)
      .join(" & ");
  }

  // ----------------------------------------------------------
  // Time-series title
  // ----------------------------------------------------------

  if (isTimeSeries) {

    if (isMonth) {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Trend by Month`
          : "Sales Trend by Month";

    } else if (isQuarter) {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Trend by Quarter`
          : "Sales Trend by Quarter";

    } else if (isYear) {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Trend by Year`
          : "Sales Trend by Year";

    } else if (isDate) {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Over Time`
          : "Sales Trend Over Time";

    } else {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Trend`
          : "Sales Trend Over Time";
    }

  // ----------------------------------------------------------
  // Normal categorical titles
  // ----------------------------------------------------------

  } else if (isTopQuestion) {

    title =
      "Top Performing Results";

  } else if (isBottomQuestion) {

    title =
      "Lowest Performing Results";

  } else if (isCity) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by City`
        : "Sales by City";

  } else if (isState) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by State`
        : "Sales by State";

  } else if (isSubCategory) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Sub-Category`
        : "Sales by Sub-Category";

  } else if (isCategory) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Category`
        : "Sales by Category";

  } else if (isRegion) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Region`
        : "Sales by Region";

  } else if (isSegment) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Segment`
        : "Sales by Segment";

  } else if (isCountry) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Country`
        : "Sales by Country";

  } else if (isMarket) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Market`
        : "Sales by Market";
  }

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  let description =
    hasMultipleMetrics
      ? "Comparison of multiple business metrics across the selected dimension."
      : "Comparison of business performance across categories.";

  // ----------------------------------------------------------
  // Time-series description
  // ----------------------------------------------------------

  if (isTimeSeries) {

    if (isMonth) {

      description =
        hasMultipleMetrics
          ? "Monthly comparison of multiple business metrics over time."
          : "Monthly sales performance showing the movement of sales over time.";

    } else if (isQuarter) {

      description =
        hasMultipleMetrics
          ? "Quarterly comparison of multiple business metrics."
          : "Quarterly sales performance showing changes across business periods.";

    } else if (isYear) {

      description =
        hasMultipleMetrics
          ? "Yearly comparison of multiple business metrics."
          : "Yearly sales performance showing the long-term business trend.";

    } else if (isDate) {

      description =
        hasMultipleMetrics
          ? "Comparison of multiple business metrics across the selected dates."
          : "Sales performance across the selected dates.";

    } else {

      description =
        "Business performance trend across the selected time period.";
    }

  } else if (isTopQuestion) {

    description =
      "Highest-performing results based on the selected business metric.";

  } else if (isBottomQuestion) {

    description =
      "Lowest-performing results based on the selected business metric.";

  } else if (isCity) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across cities."
        : "Top cities ranked by business performance.";

  } else if (isState) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across states."
        : "States ranked by business performance.";

  } else if (isSubCategory) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across sub-categories."
        : "Sub-categories ranked by business performance.";

  } else if (isCategory) {

    description =
      hasMultipleMetrics
        ? "Comparison of sales and profit across product categories."
        : "Comparison of business performance across product categories.";

  } else if (isRegion) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across regions."
        : "Comparison of business performance across regions.";

  } else if (isSegment) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across customer segments."
        : "Comparison of business performance across customer segments.";
  }

  // ==========================================================
  // CHART TYPE LABEL
  // ==========================================================

  let chartTypeLabel =
    "Category Comparison";

  if (
    hasMultipleMetrics &&
    isTimeSeries
  ) {

    chartTypeLabel =
      "Multi-Metric Trend";

  } else if (hasMultipleMetrics) {

    chartTypeLabel =
      "Multi-Metric Comparison";

  } else if (isTimeSeries) {

    chartTypeLabel =
      "Trend Analysis";

  } else if (shouldUsePieChart) {

    chartTypeLabel =
      "Distribution";

  } else if (shouldUseHorizontalChart) {

    chartTypeLabel =
      "Ranked Comparison";
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-5">

      {/* ======================================================
          VISUALIZATION HEADER
      ====================================================== */}

      <div>

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-violet-400
              "
            >
              Visualization
            </p>

            <h3
              className="
                mt-1
                text-lg
                font-semibold
                text-white
              "
            >
              {title}
            </h3>

          </div>

          {/* =================================================
              CHART TYPE BADGE
          ================================================= */}

          <div
            className="
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              px-3
              py-1
              text-xs
              text-slate-400
            "
          >
            {chartTypeLabel}
          </div>

        </div>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          {description}
        </p>

      </div>

      {/* ======================================================
          CHART RENDERING ENGINE
      ====================================================== */}

      {hasMultipleMetrics &&
      isTimeSeries ? (

        // ====================================================
        // MULTI-METRIC TIME SERIES
        // ====================================================

        <MultiMetricLineChart
          data={sortedChartData}
          xKey={xKey}
          metricKeys={metricKeys}
          title={title}
        />

      ) : hasMultipleMetrics ? (

        // ====================================================
        // MULTI-METRIC CATEGORICAL COMPARISON
        // ====================================================

        <MultiMetricBarChart
          data={visibleChartData}
          xKey={xKey}
          metricKeys={metricKeys}
          title={title}
          horizontal={
            shouldUseHorizontalChart
          }
        />

      ) : isTimeSeries ? (

        // ====================================================
        // SINGLE METRIC → LINE CHART
        // ====================================================

        <BusinessLineChart
          data={sortedChartData}
          xKey={xKey}
          yKey={yKey}
          title={title}
        />

      ) : shouldUsePieChart ? (

        // ====================================================
        // SINGLE METRIC → PIE / DONUT CHART
        // ====================================================

        <BusinessPieChart
          data={sortedChartData}
          nameKey={xKey}
          valueKey={yKey}
          title={title}
          donut={true}
        />

      ) : shouldUseHorizontalChart ? (

        // ====================================================
        // MANY CATEGORIES / RANKING
        // ====================================================

        <HorizontalBarChart
          data={visibleChartData}
          xKey={xKey}
          yKey={yKey}
          title={title}
        />

      ) : (

        // ====================================================
        // NORMAL CATEGORICAL COMPARISON
        // ====================================================

        <BusinessBarChart
          data={visibleChartData}
          xKey={xKey}
          yKey={yKey}
        />

      )}

      {/* ======================================================
          DATA NOTE
      ====================================================== */}

      {!isTimeSeries &&
        categoryCount > 15 && (

          <p
            className="
              text-center
              text-xs
              text-slate-500
            "
          >
            Showing the top 15 results in
            the visualization. Complete
            results are available below.
          </p>

        )}

    </div>
  );
}