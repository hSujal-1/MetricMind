"use client";

import BusinessBarChart from "@/components/BarChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";
import BusinessLineChart from "@/components/LineChart";

type VisualizationEngineProps = {
  data: any[];
  columns: string[];
  groupBy?: string[];
  question?: string;
};

export default function VisualizationEngine({
  data,
  columns,
  groupBy = [],
  question = "",
}: VisualizationEngineProps) {

  // =========================================================
  // SAFETY CHECK
  // =========================================================

  if (
    !data ||
    !data.length ||
    !columns ||
    columns.length < 2
  ) {
    return null;
  }

  // =========================================================
  // CHART FIELDS
  // =========================================================

  const xKey = columns[0];

  const yKey = columns[1];

  // =========================================================
  // NORMALIZE DATA
  // =========================================================

  const normalizedRows =
    data.map((row: any) => {

      // Backend already returned an object
      if (
        row &&
        !Array.isArray(row)
      ) {
        return row;
      }

      // Backend returned array format
      const converted: Record<string, any> = {};

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
    });

  // =========================================================
  // QUESTION ANALYSIS
  // =========================================================

  const normalizedQuestion =
    question.toLowerCase();

  // ---------------------------------------------------------
  // Top / Highest questions
  // ---------------------------------------------------------

  const isTopQuestion =
    normalizedQuestion.includes("top") ||
    normalizedQuestion.includes("highest") ||
    normalizedQuestion.includes("best");

  // ---------------------------------------------------------
  // Bottom / Lowest questions
  // ---------------------------------------------------------

  const isBottomQuestion =
    normalizedQuestion.includes("bottom") ||
    normalizedQuestion.includes("lowest") ||
    normalizedQuestion.includes("worst");

  // =========================================================
  // GROUP ANALYSIS
  // =========================================================

  const groupName =
    (
      groupBy[0] ||
      xKey ||
      ""
    ).toLowerCase();

  // =========================================================
  // DIMENSION DETECTION
  // =========================================================

  // ---------------------------------------------------------
  // Geographic / categorical dimensions
  // ---------------------------------------------------------

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

  // =========================================================
  // TIME DIMENSION DETECTION
  // =========================================================

  const isYear =
    groupName.includes("year");

  const isQuarter =
    groupName.includes("quarter");

  const isMonth =
    groupName.includes("month");

  const isDate =
    groupName.includes("date");

  // ---------------------------------------------------------
  // Overall time-series flag
  // ---------------------------------------------------------

  const isTimeSeries =
    isYear ||
    isQuarter ||
    isMonth ||
    isDate;

  // =========================================================
  // CHART DATA
  // =========================================================

  const chartData =
    normalizedRows
      .map((row) => ({
        [xKey]: row[xKey],
        [yKey]:
          Number(row[yKey]) || 0,
      }));

  // =========================================================
  // SORTING
  // =========================================================
  //
  // Time series:
  //     Preserve the backend's chronological order.
  //
  // Normal categorical data:
  //     Sort highest → lowest.
  //
  // =========================================================

  let sortedChartData =
    [...chartData];

  if (!isTimeSeries) {

    sortedChartData =
      sortedChartData.sort(
        (a, b) =>
          b[yKey] - a[yKey]
      );

  }

  // =========================================================
  // CATEGORY COUNT
  // =========================================================

  const categoryCount =
    sortedChartData.length;

  // =========================================================
  // DETERMINE HORIZONTAL CHART
  // =========================================================
  //
  // Time-series MUST NOT become horizontal bars.
  //
  // Example:
  //
  // 20 months
  //     ↓
  // categoryCount > 15
  //
  // But because isTimeSeries = true,
  // Horizontal Bar is disabled.
  //
  // =========================================================

  const shouldUseHorizontalChart =
    !isTimeSeries &&
    (
      isCity ||
      isState ||
      isSubCategory ||
      categoryCount > 15 ||
      isTopQuestion ||
      isBottomQuestion
    );

  // =========================================================
  // LIMIT CATEGORICAL DATA
  // =========================================================

  let visibleChartData =
    sortedChartData;

  // ---------------------------------------------------------
  // Only limit large categorical datasets.
  //
  // Time-series data should NOT be truncated.
  // ---------------------------------------------------------

  if (
    !isTimeSeries &&
    shouldUseHorizontalChart &&
    categoryCount > 15
  ) {

    visibleChartData =
      sortedChartData.slice(0, 15);

  }

  // =========================================================
  // TITLE
  // =========================================================

  let title =
    "Business Performance";

  // ---------------------------------------------------------
  // Time-series title gets highest priority
  // ---------------------------------------------------------

  if (isTimeSeries) {

    if (isMonth) {

      title =
        "Sales Trend by Month";

    }

    else if (isQuarter) {

      title =
        "Sales Trend by Quarter";

    }

    else if (isYear) {

      title =
        "Sales Trend by Year";

    }

    else if (isDate) {

      title =
        "Sales Trend Over Time";

    }

    else {

      title =
        "Sales Trend Over Time";

    }

  }

  else if (isTopQuestion) {

    title =
      "Top Performing Results";

  }

  else if (isBottomQuestion) {

    title =
      "Lowest Performing Results";

  }

  else if (isCity) {

    title =
      "Sales by City";

  }

  else if (isState) {

    title =
      "Sales by State";

  }

  else if (isSubCategory) {

    title =
      "Sales by Sub-Category";

  }

  else if (isCategory) {

    title =
      "Sales by Category";

  }

  else if (isRegion) {

    title =
      "Sales by Region";

  }

  else if (isSegment) {

    title =
      "Sales by Segment";

  }

  // =========================================================
  // DESCRIPTION
  // =========================================================

  let description =
    "Comparison of business performance across categories.";

  // ---------------------------------------------------------
  // Time-series description
  // ---------------------------------------------------------

  if (isTimeSeries) {

    if (isMonth) {

      description =
        "Monthly sales performance showing the movement of sales over time.";

    }

    else if (isQuarter) {

      description =
        "Quarterly sales performance showing changes across business periods.";

    }

    else if (isYear) {

      description =
        "Yearly sales performance showing the long-term business trend.";

    }

    else if (isDate) {

      description =
        "Sales performance across the selected dates.";

    }

    else {

      description =
        "Business performance trend across the selected time period.";

    }

  }

  else if (isTopQuestion) {

    description =
      "Highest-performing results based on the selected business metric.";

  }

  else if (isBottomQuestion) {

    description =
      "Lowest-performing results based on the selected business metric.";

  }

  else if (isCity) {

    description =
      "Top cities ranked by business performance.";

  }

  else if (isState) {

    description =
      "States ranked by business performance.";

  }

  else if (isSubCategory) {

    description =
      "Sub-categories ranked by business performance.";

  }

  else if (isCategory) {

    description =
      "Comparison of business performance across product categories.";

  }

  else if (isRegion) {

    description =
      "Comparison of business performance across regions.";

  }

  else if (isSegment) {

    description =
      "Comparison of business performance across customer segments.";

  }

  // =========================================================
  // CHART TYPE LABEL
  // =========================================================

  let chartTypeLabel =
    "Category Comparison";

  if (isTimeSeries) {

    chartTypeLabel =
      "Trend Analysis";

  }

  else if (shouldUseHorizontalChart) {

    chartTypeLabel =
      "Ranked Comparison";

  }

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="space-y-5">

      {/* ===================================================
          VISUALIZATION HEADER
      =================================================== */}

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

      {/* ===================================================
          TIME SERIES → LINE CHART
      =================================================== */}

      {isTimeSeries ? (

        <BusinessLineChart
          data={sortedChartData}
          xKey={xKey}
          yKey={yKey}
          title={title}
        />

      ) : shouldUseHorizontalChart ? (

        /* =================================================
           MANY CATEGORIES / RANKING
        ================================================= */

        <HorizontalBarChart
          data={visibleChartData}
          xKey={xKey}
          yKey={yKey}
          title={title}
        />

      ) : (

        /* =================================================
           NORMAL CATEGORICAL COMPARISON
        ================================================= */

        <BusinessBarChart
          data={visibleChartData}
          xKey={xKey}
          yKey={yKey}
        />

      )}

      {/* ===================================================
          DATA NOTE
      =================================================== */}

      {!isTimeSeries &&
        categoryCount > 15 && (

          <p
            className="
              text-center
              text-xs
              text-slate-500
            "
          >
            Showing the top 15 results in the visualization.
            Complete results are available below.
          </p>

        )}

    </div>

  );
}