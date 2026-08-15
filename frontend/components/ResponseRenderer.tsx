"use client";

import KPICard from "@/components/KPICard";
import ResponseTable from "@/components/ResponseTable";
import InsightCard, {
  ComparisonCard,
} from "@/components/InsightCard";
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
          border-[#B94A48]/30
          bg-[#B94A48]/5
          p-5
          sm:p-6
        "
      >
        <div className="flex items-start gap-4">

          {/* Error Icon */}

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[#B94A48]/30
              bg-[#B94A48]/10
              text-sm
              font-bold
              text-[#B94A48]
            "
          >
            !
          </div>

          {/* Error Content */}

          <div className="min-w-0">

            <p className="font-semibold text-[#B94A48]">
              Unable to process your question
            </p>

            <p className="mt-2 text-sm leading-6 text-[#B94A48]/80">
              {response.error ||
                response.message ||
                "Something went wrong while processing your request."}
            </p>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================
  // RESPONSE DATA
  // =========================================================

  const data = response.data;

  // =========================================================
  // KPI RESPONSE
  // =========================================================

  if (response.type === "kpi") {

    const metric =
      data?.metrics?.[0];

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
        <div className="space-y-6">

          {/* =================================================
              QUESTION CONTEXT
          ================================================= */}

          {response.question && (

            <div
              className="
                rounded-2xl
                border
                border-[#E7DED2]
                bg-[#F7F3EA]
                px-4
                py-3
                sm:px-5
              "
            >

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#756F67]
                "
              >
                Your Question
              </p>

              <p
                className="
                  mt-1.5
                  text-sm
                  leading-6
                  text-[#25221F]
                "
              >
                {response.question}
              </p>

            </div>

          )}

          {/* =================================================
              KPI
          ================================================= */}

          <div className="flex justify-center">

            <KPICard
              title={metric}
              value={
                value as string | number
              }
            />

          </div>

        </div>
      );
    }
  }

  // =========================================================
  // TABLE / GROUPED RESPONSE
  // =========================================================

  if (response.type === "table") {

    // -------------------------------------------------------
    // Columns
    // -------------------------------------------------------

    const columns: string[] =
      data?.columns || [];

    // -------------------------------------------------------
    // Rows
    // -------------------------------------------------------

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
        <div
          className="
            rounded-2xl
            border
            border-[#E7DED2]
            bg-[#FFFDF8]
            py-12
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              border
              border-[#E7DED2]
              bg-[#F7F3EA]
              text-lg
              text-[#756F67]
            "
          >
            —
          </div>

          <p
            className="
              mt-4
              text-sm
              font-semibold
              text-[#25221F]
            "
          >
            No data found
          </p>

          <p
            className="
              mx-auto
              mt-1
              max-w-md
              px-4
              text-xs
              leading-5
              text-[#756F67]
            "
          >
            No results were returned for this business question.
          </p>

        </div>
      );
    }

    // =======================================================
    // NORMALIZE BACKEND ROWS
    // =======================================================

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

    // =======================================================
    // GROUP INFORMATION
    // =======================================================

    const groupBy =
      data?.group_by || [];

    // =======================================================
    // COMPARISON INFORMATION
    // =======================================================

    const comparison =
      data?.comparison || null;

    // -------------------------------------------------------
    // Validate time comparison
    // -------------------------------------------------------

    const isTimeComparison =
      comparison?.type ===
      "time_comparison";

    const hasValidPeriods =
      Array.isArray(
        comparison?.periods
      ) &&
      comparison.periods.length >= 2;

    const hasComparisonMetrics =
      comparison?.metrics &&
      typeof comparison.metrics ===
        "object" &&
      Object.keys(
        comparison.metrics
      ).length > 0;

    const shouldShowComparison =
      isTimeComparison &&
      hasValidPeriods &&
      hasComparisonMetrics;

    // =======================================================
    // FIRST RESULT
    // =======================================================

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

    // =======================================================
    // USER QUESTION
    // =======================================================

    const question =
      response.question
        ?.toLowerCase() || "";

    // =======================================================
    // RANKING QUESTION DETECTION
    // =======================================================

    const isRankingQuestion =
      question.includes("highest") ||
      question.includes("lowest") ||
      question.includes("top") ||
      question.includes("bottom") ||
      question.includes("best") ||
      question.includes("worst");

    // =======================================================
    // QUERY PLAN
    // =======================================================

    const queryPlan =
      response.query_plan || {};

    const isLimitedQuery =
      queryPlan?.limit === 1;

    // =======================================================
    // SINGLE RESULT RANKING
    // =======================================================

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
        <div className="mx-auto w-full max-w-2xl">

          {/* Question */}

          {response.question && (

            <div
              className="
                mb-5
                rounded-2xl
                border
                border-[#E7DED2]
                bg-[#F7F3EA]
                px-4
                py-3
                sm:px-5
              "
            >

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#756F67]
                "
              >
                Your Question
              </p>

              <p
                className="
                  mt-1.5
                  text-sm
                  leading-6
                  text-[#25221F]
                "
              >
                {response.question}
              </p>

            </div>

          )}

          <InsightCard
            title={label}
            label={title}
            value={entityValue}
            metric={metricKey.replaceAll(
              "_",
              " "
            )}
            metricValue={
              metricValue
            }
          />

        </div>
      );
    }

    // =======================================================
    // NORMAL BUSINESS ANALYSIS
    // =======================================================

    return (
      <div className="space-y-8 sm:space-y-10">

        {/* =================================================
            QUESTION CONTEXT
        ================================================= */}

        {response.question && (

          <div
            className="
              rounded-2xl
              border
              border-[#E7DED2]
              bg-[#F7F3EA]
              px-4
              py-3
              sm:px-5
              sm:py-4
            "
          >

            <div
              className="
                flex
                flex-col
                gap-1
                sm:flex-row
                sm:items-baseline
                sm:gap-3
              "
            >

              <p
                className="
                  shrink-0
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#756F67]
                "
              >
                Your Question
              </p>

              <p
                className="
                  text-sm
                  leading-6
                  text-[#25221F]
                "
              >
                {response.question}
              </p>

            </div>

          </div>

        )}

        {/* =================================================
            RESULT SUMMARY
        ================================================= */}

        <section>

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#C65D32]
              sm:text-xs
            "
          >
            Business Insight
          </p>

          <h3
            className="
              mt-2
              text-xl
              font-bold
              leading-7
              text-[#25221F]
              sm:text-2xl
            "
          >
            {data.metrics?.join(
              " & "
            ) ||
              "Business Analysis"}
          </h3>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-[#756F67]
            "
          >
            Results grouped by{" "}

            <span
              className="
                font-semibold
                text-[#25221F]
              "
            >
              {groupBy.join(", ") ||
                columns[0]}
            </span>

          </p>

        </section>

        {/* =================================================
            TIME / PERIOD COMPARISON
        ================================================= */}

        {shouldShowComparison && (

          <section>

            <div className="mb-4">

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-[#C65D32]
                "
              >
                Performance Comparison
              </p>

            </div>

            <ComparisonCard
              title={`Comparison from ${
                comparison.periods[0]
              } to ${
                comparison.periods[1]
              }`}
              label="Period Comparison"
              dimension={
                comparison.dimension ||
                "Time"
              }
              periods={
                comparison.periods
              }
              metrics={
                comparison.metrics
              }
            />

          </section>

        )}

        {/* =================================================
            VISUAL ANALYSIS
        ================================================= */}

        <section>

          <div className="mb-4">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#C65D32]
              "
            >
              Visual Analysis
            </p>

          </div>

          <VisualizationEngine
            data={normalizedRows}
            columns={columns}
            groupBy={groupBy}
            question={
              response.question
            }
          />

        </section>

        {/* =================================================
            DETAILED RESULTS
        ================================================= */}

        <section>

          <div className="mb-4">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#756F67]
              "
            >
              Data
            </p>

            <h4
              className="
                mt-1
                text-lg
                font-bold
                text-[#25221F]
              "
            >
              Detailed Results
            </h4>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-[#756F67]
              "
            >
              Complete results returned for this analysis.
            </p>

          </div>

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[#E7DED2]
              bg-[#FFFDF8]
            "
          >

            <ResponseTable
              columns={columns}
              rows={normalizedRows}
            />

          </div>

        </section>

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
        border-[#E7DED2]
        bg-[#FFFDF8]
        p-5
        sm:p-6
      "
    >

      <p
        className="
          mb-4
          text-xs
          font-bold
          uppercase
          tracking-[0.18em]
          text-[#756F67]
        "
      >
        MetricMind Response
      </p>

      <pre
        className="
          max-h-[500px]
          overflow-auto
          whitespace-pre-wrap
          break-words
          rounded-xl
          border
          border-[#E7DED2]
          bg-[#F7F3EA]
          p-4
          text-xs
          leading-5
          text-[#25221F]
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