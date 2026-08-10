"use client";

import KPICard from "@/components/KPICard";
import ResponseTable from "@/components/ResponseTable";
import InsightCard from "@/components/InsightCard";
import VisualizationEngine from "@/components/VisualizationEngine";

type ResponseRendererProps = {
  response: any;
};

// =========================================================
// HELPERS
// =========================================================

function formatMetricName(metric: string): string {
  return metric
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isNumericValue(value: any): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function getMetricColumns(
  columns: string[],
  groupBy: string[]
): string[] {
  return columns.filter(
    (column) =>
      !groupBy.includes(column) &&
      column !== columns[0]
  );
}

function detectRequestedMetric(
  question: string,
  metricColumns: string[]
): string | null {
  const q = question.toLowerCase();

  // Profit has priority when explicitly requested.
  if (
    q.includes("profit") &&
    metricColumns.some((column) =>
      column.toLowerCase().includes("profit")
    )
  ) {
    return (
      metricColumns.find((column) =>
        column.toLowerCase().includes("profit")
      ) || null
    );
  }

  // Quantity
  if (
    q.includes("quantity") &&
    metricColumns.some((column) =>
      column.toLowerCase().includes("quantity")
    )
  ) {
    return (
      metricColumns.find((column) =>
        column.toLowerCase().includes("quantity")
      ) || null
    );
  }

  // Sales
  if (
    q.includes("sales") &&
    metricColumns.some((column) =>
      column.toLowerCase().includes("sales")
    )
  ) {
    return (
      metricColumns.find((column) =>
        column.toLowerCase().includes("sales")
      ) || null
    );
  }

  // Revenue
  if (
    q.includes("revenue") &&
    metricColumns.some((column) =>
      column.toLowerCase().includes("revenue")
    )
  ) {
    return (
      metricColumns.find((column) =>
        column.toLowerCase().includes("revenue")
      ) || null
    );
  }

  // Default to first metric.
  return metricColumns[0] || null;
}

function findBestRow(
  rows: any[],
  metricColumn: string,
  direction: "highest" | "lowest"
): any | null {
  if (!rows.length || !metricColumn) {
    return null;
  }

  const validRows = rows.filter((row) =>
    isNumericValue(row?.[metricColumn])
  );

  if (!validRows.length) {
    return null;
  }

  return validRows.reduce(
    (best, current) => {
      const bestValue = Number(
        best[metricColumn]
      );

      const currentValue = Number(
        current[metricColumn]
      );

      if (direction === "highest") {
        return currentValue > bestValue
          ? current
          : best;
      }

      return currentValue < bestValue
        ? current
        : best;
    }
  );
}

// =========================================================
// COMPONENT
// =========================================================

export default function ResponseRenderer({
  response,
}: ResponseRendererProps) {

  // =======================================================
  // SAFETY CHECK
  // =======================================================

  if (!response) {
    return null;
  }

  // =======================================================
  // FAILED RESPONSE
  // =======================================================

  if (response.success === false) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-950/20 p-6">
        <p className="text-sm font-semibold text-red-300">
          Unable to process your question
        </p>

        <p className="mt-2 text-sm text-red-300/80">
          {response.error ||
            response.message ||
            "Something went wrong."}
        </p>
      </div>
    );
  }

  const data = response.data;

  // =======================================================
  // KPI RESPONSE
  // =======================================================

  if (response.type === "kpi") {

    const metrics: string[] =
      data?.metrics || [];

    const values =
      data?.values || {};

    // -----------------------------------------------------
    // Multiple KPI metrics
    // -----------------------------------------------------

    if (metrics.length > 1) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric: string) => {

            const value =
              values[metric];

            return (
              <KPICard
                key={metric}
                title={metric}
                value={
                  value as string | number
                }
              />
            );
          })}
        </div>
      );
    }

    // -----------------------------------------------------
    // Single KPI
    // -----------------------------------------------------

    const metric =
      metrics[0];

    const value =
      metric
        ? values[metric]
        : Object.values(values)[0];

    if (
      metric &&
      value !== null &&
      value !== undefined
    ) {
      return (
        <div className="flex justify-center">
          <KPICard
            title={metric}
            value={
              value as string | number
            }
          />
        </div>
      );
    }
  }

  // =======================================================
  // TABLE / GROUPED RESPONSE
  // =======================================================

  if (response.type === "table") {

    const columns: string[] =
      data?.columns || [];

    const rows: any[] =
      data?.rows || [];

    // -----------------------------------------------------
    // Empty result
    // -----------------------------------------------------

    if (
      !columns.length ||
      !rows.length
    ) {
      return (
        <div className="py-10 text-center">
          <p className="text-slate-400">
            No data found for this question.
          </p>
        </div>
      );
    }

    // -----------------------------------------------------
    // Normalize backend rows
    // -----------------------------------------------------

    const normalizedRows =
      rows.map((row: any) => {

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
      });

    // -----------------------------------------------------
    // Group information
    // -----------------------------------------------------

    const groupBy: string[] =
      data?.group_by || [];

    // -----------------------------------------------------
    // User question
    // -----------------------------------------------------

    const question =
      response.question?.toLowerCase() ||
      "";

    // -----------------------------------------------------
    // Query plan
    // -----------------------------------------------------

    const queryPlan =
      response.query_plan || {};

    // -----------------------------------------------------
    // Metric columns
    // -----------------------------------------------------

    const metricColumns =
      getMetricColumns(
        columns,
        groupBy
      );

    // -----------------------------------------------------
    // Detect requested metric
    // -----------------------------------------------------

    const requestedMetric =
      detectRequestedMetric(
        question,
        metricColumns
      );

    // -----------------------------------------------------
    // Ranking question detection
    // -----------------------------------------------------

    const isRankingQuestion =
      question.includes("highest") ||
      question.includes("lowest") ||
      question.includes("top") ||
      question.includes("bottom") ||
      question.includes("best") ||
      question.includes("worst");

    // -----------------------------------------------------
    // Ranking direction
    // -----------------------------------------------------

    const isLowest =
      question.includes("lowest") ||
      question.includes("bottom") ||
      question.includes("worst");

    const rankingDirection =
      isLowest
        ? "lowest"
        : "highest";

    // -----------------------------------------------------
    // Query limit
    // -----------------------------------------------------

    const isLimitedQuery =
      queryPlan?.limit !== null &&
      queryPlan?.limit !== undefined;

    // =====================================================
    // 3.2F — SMART BUSINESS INSIGHT
    // =====================================================

    const insightMetric =
      requestedMetric ||
      metricColumns[0];

    const insightRow =
      insightMetric
        ? findBestRow(
            normalizedRows,
            insightMetric,
            rankingDirection
          )
        : null;

    // -----------------------------------------------------
    // Entity column
    // -----------------------------------------------------

    const entityColumn =
      groupBy[0] ||
      columns[0];

    const entityValue =
      insightRow?.[entityColumn];

    const insightMetricValue =
      insightRow?.[insightMetric];

    // =====================================================
    // SINGLE RESULT RANKING
    //
    // Example:
    // "What is the highest-selling region?"
    // =====================================================

    if (
      normalizedRows.length === 1 &&
      columns.length >= 2 &&
      isRankingQuestion &&
      isLimitedQuery &&
      entityValue !== undefined
    ) {

      const title =
        isLowest
          ? "Bottom Performer"
          : "Top Performer";

      const label =
        isLowest
          ? "Lowest Performer"
          : "Highest Performer";

      return (
        <div className="mx-auto max-w-2xl">
          <InsightCard
            title={label}
            label={title}
            value={entityValue}
            metric={formatMetricName(
              insightMetric
            )}
            metricValue={
              insightMetricValue
            }
          />
        </div>
      );
    }

    // =====================================================
    // NORMAL BUSINESS ANALYSIS
    // =====================================================

    const displayMetrics =
      data?.metrics?.length
        ? data.metrics
        : metricColumns.map(
            formatMetricName
          );

    const insightTitle =
      displayMetrics.join(" & ") ||
      "Business Analysis";

    // -----------------------------------------------------
    // Group label
    // -----------------------------------------------------

    const groupLabel =
      groupBy.length
        ? groupBy.join(", ")
        : columns[0];

    // -----------------------------------------------------
    // Dynamic insight text
    // -----------------------------------------------------

    let insightDescription =
      `Results grouped by ${groupLabel}`;

    // -----------------------------------------------------
    // If we have a valid leading entity,
    // make the insight more meaningful.
    // -----------------------------------------------------

    if (
      insightRow &&
      entityValue !== undefined &&
      insightMetric
    ) {

      const metricLabel =
        formatMetricName(
          insightMetric
        );

      const entityLabel =
        String(entityValue);

      const formattedValue =
        isNumericValue(
          insightMetricValue
        )
          ? Number(
              insightMetricValue
            ).toLocaleString("en-IN")
          : String(
              insightMetricValue ?? ""
            );

      if (
        isRankingQuestion
      ) {
        insightDescription =
          `${entityLabel} has the ${
            isLowest
              ? "lowest"
              : "highest"
          } ${metricLabel.toLowerCase()} at ${formattedValue}.`;
      } else {
        insightDescription =
          `Results grouped by ${groupLabel}. ${entityLabel} leads in ${metricLabel.toLowerCase()} at ${formattedValue}.`;
      }
    }

    // =====================================================
    // BUSINESS INSIGHT
    // =====================================================

    return (
      <div className="space-y-10">

        {/* =================================================
            RESULT SUMMARY
        ================================================= */}

        <div>

          <p
            className="
              text-sm
              uppercase
              tracking-[0.2em]
              text-violet-400
            "
          >
            Business Insight
          </p>

          <h3
            className="
              mt-2
              text-2xl
              font-semibold
              text-white
            "
          >
            {insightTitle}
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-slate-400
            "
          >
            {insightDescription}
          </p>

        </div>

        {/* =================================================
            INTELLIGENT VISUALIZATION
        ================================================= */}

        <VisualizationEngine
          data={normalizedRows}
          columns={columns}
          groupBy={groupBy}
          question={response.question}
        />

        {/* =================================================
            DETAILED RESULTS
        ================================================= */}

        <div>

          <h4
            className="
              mb-4
              text-lg
              font-semibold
              text-white
            "
          >
            Detailed Results
          </h4>

          <div
            className="
              overflow-x-auto
              rounded-2xl
              border
              border-white/10
              bg-slate-950/50
            "
          >

            <ResponseTable
              columns={columns}
              rows={normalizedRows}
            />

          </div>

        </div>

      </div>
    );
  }

  // =======================================================
  // FALLBACK
  // =======================================================

  return (
    <div>

      <p
        className="
          mb-4
          text-sm
          font-medium
          text-slate-400
        "
      >
        MetricMind Response
      </p>

      <pre
        className="
          overflow-auto
          whitespace-pre-wrap
          text-sm
          text-green-400
        "
      >
        {JSON.stringify(
          response,
          null,
          2
        )}
      </pre>

    </div>
  );
}