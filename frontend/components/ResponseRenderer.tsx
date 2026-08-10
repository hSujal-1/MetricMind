"use client";

import KPICard from "@/components/KPICard";
import ResponseTable from "@/components/ResponseTable";
import InsightCard from "@/components/InsightCard";
import VisualizationEngine from "@/components/VisualizationEngine";

type ResponseRendererProps = {
  response: any;
};

export default function ResponseRenderer({
  response,
}: ResponseRendererProps) {

  // =========================================================
  // SAFETY CHECK
  // =========================================================

  if (!response) {
    return null;
  }

  // =========================================================
  // FAILED RESPONSE
  // =========================================================

  if (response.success === false) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-red-500/20
          bg-red-950/20
          p-6
        "
      >
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

  // =========================================================
  // KPI RESPONSE
  // =========================================================

  if (response.type === "kpi") {

    const metric = data?.metrics?.[0];

    const value =
      data?.values
        ? Object.values(data.values)[0]
        : null;

    if (
      metric &&
      value !== null &&
      value !== undefined
    ) {
      return (
        <div className="flex justify-center">

          <KPICard
            title={metric}
            value={value as string | number}
          />

        </div>
      );
    }
  }

  // =========================================================
  // TABLE / GROUPED RESPONSE
  // =========================================================

  if (response.type === "table") {

    const columns: string[] =
      data?.columns || [];

    const rows: any[] =
      data?.rows || [];

    // -------------------------------------------------------
    // Empty result
    // -------------------------------------------------------

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

    // -------------------------------------------------------
    // Normalize backend rows
    // -------------------------------------------------------

    const normalizedRows =
      rows.map((row: any) => {

        // Backend already returned object
        if (
          row &&
          !Array.isArray(row)
        ) {
          return row;
        }

        // Backend returned array
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

    // -------------------------------------------------------
    // Group information
    // -------------------------------------------------------

    const groupBy =
      data?.group_by || [];

    // -------------------------------------------------------
    // First result
    // -------------------------------------------------------

    const firstRow =
      normalizedRows[0];

    const entityKey =
      columns[0];

    const metricKey =
      columns[1];

    const entityValue =
      firstRow?.[entityKey];

    const metricValue =
      firstRow?.[metricKey];

    // -------------------------------------------------------
    // User question
    // -------------------------------------------------------

    const question =
      response.question?.toLowerCase() || "";

    // -------------------------------------------------------
    // Ranking question detection
    // -------------------------------------------------------

    const isRankingQuestion =
      question.includes("highest") ||
      question.includes("lowest") ||
      question.includes("top") ||
      question.includes("bottom") ||
      question.includes("best") ||
      question.includes("worst");

    // -------------------------------------------------------
    // Query plan
    // -------------------------------------------------------

    const queryPlan =
      response.query_plan || {};

    const isLimitedQuery =
      queryPlan?.limit === 1;

    // -------------------------------------------------------
    // Single result ranking
    //
    // Example:
    // "What is the highest-selling region?"
    // -------------------------------------------------------

    if (
      normalizedRows.length === 1 &&
      columns.length >= 2 &&
      isRankingQuestion &&
      isLimitedQuery &&
      entityValue !== undefined
    ) {

      const isLowest =
        question.includes("lowest") ||
        question.includes("bottom") ||
        question.includes("worst");

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
            metric={metricKey.replaceAll(
              "_",
              " "
            )}
            metricValue={metricValue}
          />

        </div>
      );
    }

    // =======================================================
    // NORMAL BUSINESS ANALYSIS
    // =======================================================

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
            {data.metrics?.join(" & ") ||
              "Business Analysis"}
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-slate-400
            "
          >
            Results grouped by{" "}

            <span className="text-slate-200">
              {groupBy.join(", ") ||
                columns[0]}
            </span>
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

  // =========================================================
  // FALLBACK
  // =========================================================

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-slate-950/70
        p-6
      "
    >

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