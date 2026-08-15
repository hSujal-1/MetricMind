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

  return new Intl.NumberFormat("en-IN", {
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
// GET SINGLE METRIC DISPLAY NAME
// ============================================================

function getSingleMetricName(metricKey: string): string {
  const normalized = metricKey
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();

  if (
    normalized === "total sales" ||
    normalized === "sales"
  ) {
    return "Sales";
  }

  if (
    normalized === "total profit" ||
    normalized === "profit"
  ) {
    return "Profit";
  }

  if (
    normalized === "total quantity" ||
    normalized === "quantity"
  ) {
    return "Quantity";
  }

  return formatMetricName(metricKey);
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
    <div
      className="
        rounded-xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        px-4
        py-3
        shadow-[0_10px_30px_rgba(101,74,48,0.12)]
      "
    >
      <p className="mb-2 text-sm font-semibold text-[#25221F]">
        {String(label)}
      </p>

      <div className="space-y-1">

        {payload.map((item, index) => (

          <div
            key={`${item.dataKey}-${index}`}
            className="
              flex
              items-center
              justify-between
              gap-6
              text-xs
            "
          >

            <span className="text-[#756F67]">
              {formatMetricName(item.dataKey)}
            </span>

            <span className="font-semibold text-[#C65D32]">
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

  const chartColors = [
    "#C65D32",
    "#D99A5B",
    "#3F7D58",
    "#8C6A4A",
    "#B94A48",
  ];

  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        p-4
        sm:p-5
      "
    >

      <div className="mb-4">

        <h4 className="text-base font-semibold text-[#25221F]">
          {title}
        </h4>

        <p className="mt-1 text-xs text-[#756F67]">
          Comparison across multiple business metrics.
        </p>

      </div>

      <div className="h-[300px] w-full sm:h-[340px] lg:h-[380px]">

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
              stroke="#E7DED2"
              vertical={!horizontal}
              horizontal={horizontal}
            />

            {horizontal ? (

              <>

                <XAxis
                  type="number"
                  tick={{
                    fill: "#756F67",
                    fontSize: 11,
                  }}
                  axisLine={{
                    stroke: "#E7DED2",
                  }}
                  tickLine={false}
                  tickFormatter={(value) =>
                    formatNumber(value)
                  }
                />

                <YAxis
                  type="category"
                  dataKey={xKey}
                  width={120}
                  tick={{
                    fill: "#756F67",
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
                    fill: "#756F67",
                    fontSize: 11,
                  }}
                  axisLine={{
                    stroke: "#E7DED2",
                  }}
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
                    fill: "#756F67",
                    fontSize: 11,
                  }}
                  axisLine={{
                    stroke: "#E7DED2",
                  }}
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
                fill: "rgba(198,93,50,0.06)",
              }}
            />

            <Legend
              wrapperStyle={{
                color: "#756F67",
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
                    chartColors[
                      index % chartColors.length
                    ]
                  }
                  radius={
                    horizontal
                      ? [0, 6, 6, 0]
                      : [6, 6, 0, 0]
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

  const chartColors = [
    "#C65D32",
    "#D99A5B",
    "#3F7D58",
    "#8C6A4A",
    "#B94A48",
  ];

  return (
    <div
      className="
        w-full
        rounded-2xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        p-4
        sm:p-5
      "
    >

      <div className="mb-4">

        <h4 className="text-base font-semibold text-[#25221F]">
          {title}
        </h4>

        <p className="mt-1 text-xs text-[#756F67]">
          Trend comparison across multiple business metrics.
        </p>

      </div>

      <div className="h-[300px] w-full sm:h-[340px] lg:h-[380px]">

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
              stroke="#E7DED2"
            />

            <XAxis
              dataKey={xKey}
              tick={{
                fill: "#756F67",
                fontSize: 11,
              }}
              axisLine={{
                stroke: "#E7DED2",
              }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#756F67",
                fontSize: 11,
              }}
              axisLine={{
                stroke: "#E7DED2",
              }}
              tickLine={false}
              tickFormatter={(value) =>
                formatNumber(value)
              }
            />

            <Tooltip
              content={
                <MultiMetricTooltip />
              }
              cursor={{
                stroke: "#E7DED2",
              }}
            />

            <Legend
              wrapperStyle={{
                color: "#756F67",
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
                    chartColors[
                      index % chartColors.length
                    ]
                  }
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: "#FFFDF8",
                    strokeWidth: 2,
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

      if (
        row &&
        !Array.isArray(row)
      ) {
        return row;
      }

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

  // ==========================================================
  // SAFETY FALLBACK
  // ==========================================================

  if (!metricKeys.length) {
    return null;
  }

  const yKey = metricKeys[0];

  const hasMultipleMetrics =
    metricKeys.length > 1;

  // ==========================================================
  // SINGLE METRIC NAME
  // ==========================================================

  const singleMetricName =
    getSingleMetricName(yKey);

  // ==========================================================
  // QUESTION ANALYSIS
  // ==========================================================

  const normalizedQuestion =
    question.toLowerCase();

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

  // ==========================================================
  // PIE / DONUT ELIGIBLE DIMENSIONS
  // ==========================================================

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
          : `${singleMetricName} Trend by Month`;

    } else if (isQuarter) {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Trend by Quarter`
          : `${singleMetricName} Trend by Quarter`;

    } else if (isYear) {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Trend by Year`
          : `${singleMetricName} Trend by Year`;

    } else if (isDate) {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Over Time`
          : `${singleMetricName} Over Time`;

    } else {

      title =
        hasMultipleMetrics
          ? `${metricKeys
              .map(formatMetricName)
              .join(" & ")} Trend`
          : `${singleMetricName} Trend Over Time`;
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
        : `${singleMetricName} by City`;

  } else if (isState) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by State`
        : `${singleMetricName} by State`;

  } else if (isSubCategory) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Sub-Category`
        : `${singleMetricName} by Sub-Category`;

  } else if (isCategory) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Category`
        : `${singleMetricName} by Category`;

  } else if (isRegion) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Region`
        : `${singleMetricName} by Region`;

  } else if (isSegment) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Segment`
        : `${singleMetricName} by Segment`;

  } else if (isCountry) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Country`
        : `${singleMetricName} by Country`;

  } else if (isMarket) {

    title =
      hasMultipleMetrics
        ? `${metricKeys
            .map(formatMetricName)
            .join(" & ")} by Market`
        : `${singleMetricName} by Market`;
  }

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  let description =
    hasMultipleMetrics
      ? "Comparison of multiple business metrics across the selected dimension."
      : `Comparison of ${singleMetricName.toLowerCase()} across the selected dimension.`;

  // ----------------------------------------------------------
  // Time-series description
  // ----------------------------------------------------------

  if (isTimeSeries) {

    if (isMonth) {

      description =
        hasMultipleMetrics
          ? "Monthly comparison of multiple business metrics over time."
          : `Monthly ${singleMetricName.toLowerCase()} performance showing the movement of ${singleMetricName.toLowerCase()} over time.`;

    } else if (isQuarter) {

      description =
        hasMultipleMetrics
          ? "Quarterly comparison of multiple business metrics."
          : `Quarterly ${singleMetricName.toLowerCase()} performance showing changes across business periods.`;

    } else if (isYear) {

      description =
        hasMultipleMetrics
          ? "Yearly comparison of multiple business metrics."
          : `Yearly ${singleMetricName.toLowerCase()} performance showing the long-term business trend.`;

    } else if (isDate) {

      description =
        hasMultipleMetrics
          ? "Comparison of multiple business metrics across the selected dates."
          : `${singleMetricName} performance across the selected dates.`;

    } else {

      description =
        `${singleMetricName} performance trend across the selected time period.`;
    }

  } else if (isTopQuestion) {

    description =
      `Highest-performing results based on ${singleMetricName.toLowerCase()}.`;

  } else if (isBottomQuestion) {

    description =
      `Lowest-performing results based on ${singleMetricName.toLowerCase()}.`;

  } else if (isCity) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across cities."
        : `${singleMetricName} performance across cities.`;

  } else if (isState) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across states."
        : `${singleMetricName} performance across states.`;

  } else if (isSubCategory) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across sub-categories."
        : `${singleMetricName} performance across sub-categories.`;

  } else if (isCategory) {

    description =
      hasMultipleMetrics
        ? "Comparison of sales and profit across product categories."
        : `Comparison of ${singleMetricName.toLowerCase()} across product categories.`;

  } else if (isRegion) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across regions."
        : `Comparison of ${singleMetricName.toLowerCase()} across regions.`;

  } else if (isSegment) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across customer segments."
        : `Comparison of ${singleMetricName.toLowerCase()} across customer segments.`;

  } else if (isCountry) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across countries."
        : `Comparison of ${singleMetricName.toLowerCase()} across countries.`;

  } else if (isMarket) {

    description =
      hasMultipleMetrics
        ? "Comparison of multiple metrics across markets."
        : `Comparison of ${singleMetricName.toLowerCase()} across markets.`;
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

          NOTE:
          The old "Visualization" label was removed here.
          The chart component itself already displays its title.
      ====================================================== */}

      <div>

        <div
          className="
            flex
            flex-col
            items-start
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <h3
              className="
                text-lg
                font-semibold
                text-[#25221F]
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
              border-[#E7DED2]
              bg-[#F7F3EA]
              px-3
              py-1
              text-xs
              font-medium
              text-[#756F67]
            "
          >
            {chartTypeLabel}
          </div>

        </div>

        <p
          className="
            mt-2
            max-w-3xl
            text-xs
            leading-5
            text-[#756F67]
            sm:text-sm
            sm:leading-6
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

        <MultiMetricLineChart
          data={sortedChartData}
          xKey={xKey}
          metricKeys={metricKeys}
          title={title}
        />

      ) : hasMultipleMetrics ? (

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

        <BusinessLineChart
          data={sortedChartData}
          xKey={xKey}
          yKey={yKey}
          title={title}
        />

      ) : shouldUsePieChart ? (

        <BusinessPieChart
          data={sortedChartData}
          nameKey={xKey}
          valueKey={yKey}
          title={title}
          donut={true}
        />

      ) : shouldUseHorizontalChart ? (

        <HorizontalBarChart
          data={visibleChartData}
          xKey={xKey}
          yKey={yKey}
          title={title}
        />

      ) : (

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
              leading-5
              text-[#756F67]
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