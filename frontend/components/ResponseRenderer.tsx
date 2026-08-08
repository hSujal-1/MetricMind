"use client";

import KPICard from "@/components/KPICard";
import ResponseTable from "@/components/ResponseTable";
import BusinessBarChart from "@/components/BarChart";

type ResponseData = {
  columns?: string[];
  rows?: any[];
  metrics?: string[];
  values?: Record<string, any>;
  result?: any;
};

type MetricResponse = {
  success?: boolean;
  type?: string;
  question?: string;
  data?: ResponseData;
};

interface ResponseRendererProps {
  response: MetricResponse;
}

export default function ResponseRenderer({
  response,
}: ResponseRendererProps) {

  const data = response?.data;

  if (!data) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-8 text-center">
        <p className="text-slate-400">
          No response data available.
        </p>
      </div>
    );
  }

  // ============================================================
  // KPI RESPONSE
  // ============================================================

  if (response.type === "kpi") {

    const metricName =
      data.metrics?.[0] ||
      "Business Metric";

    const values = data.values || {};

    const value =
      Object.values(values)[0] ?? "N/A";

    return (
      <KPICard
        title={metricName}
        value={value}
      />
    );
  }

  // ============================================================
  // TABLE RESPONSE
  // ============================================================

  if (response.type === "table") {

    const columns = data.columns || [];
    const rows = data.rows || [];

    // ------------------------------------------------------------
    // No data
    // ------------------------------------------------------------

    if (rows.length === 0) {
      return (
        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-slate-950/60
            p-8
            text-center
          "
        >
          <p className="text-lg font-medium text-slate-300">
            No matching data found
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Try asking a different business question.
          </p>
        </div>
      );
    }

    // ============================================================
    // SINGLE ROW
    // Best City / Best Category / Highest Sales etc.
    // ============================================================

    if (rows.length === 1) {

      const rawRow = rows[0];

      let label: any = null;
      let metricLabel: any = null;
      let value: any = null;

      // ----------------------------------------------------------
      // Case 1:
      // ["New York City", 256397]
      // ----------------------------------------------------------

      if (Array.isArray(rawRow)) {

        if (columns.length >= 2) {

          label = rawRow[0];

          metricLabel = columns[1];

          value = rawRow[1];

        } else if (columns.length === 1) {

          metricLabel = columns[0];

          value = rawRow[0];

        }

      }

      // ----------------------------------------------------------
      // Case 2:
      // {
      //   CITY: "New York City",
      //   TOTAL_SALES: 256397
      // }
      // ----------------------------------------------------------

      else if (
        typeof rawRow === "object" &&
        rawRow !== null
      ) {

        if (columns.length >= 2) {

          label = rawRow[columns[0]];

          metricLabel = columns[1];

          value = rawRow[columns[1]];

        } else {

          const keys = Object.keys(rawRow);

          if (keys.length >= 2) {

            label = rawRow[keys[0]];

            metricLabel = keys[1];

            value = rawRow[keys[1]];

          } else if (keys.length === 1) {

            metricLabel = keys[0];

            value = rawRow[keys[0]];

          }

        }
      }

      // ----------------------------------------------------------
      // Case 3:
      // scalar result
      // ----------------------------------------------------------

      else {

        value = rawRow;

        metricLabel =
          columns[0] || "Result";
      }

      // ----------------------------------------------------------
      // Format number
      // ----------------------------------------------------------

      const displayValue =
        typeof value === "number"
          ? value.toLocaleString("en-IN")
          : value ?? "N/A";

      return (
        <div
          className="
            rounded-2xl
            border
            border-violet-500/20
            bg-slate-950/60
            p-7
            shadow-[0_0_40px_rgba(139,92,246,0.08)]
          "
        >

          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.25em]
              text-violet-400
            "
          >
            Business Insight
          </p>

          <h3
            className="
              mt-3
              text-2xl
              font-bold
              text-white
            "
          >
            {label || "Business Result"}
          </h3>

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-white/10
              bg-slate-900/70
              p-6
            "
          >

            <p
              className="
                text-sm
                font-medium
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              {metricLabel || "Result"}
            </p>

            <p
              className="
                mt-2
                text-4xl
                font-bold
                text-cyan-400
              "
            >
              {displayValue}
            </p>

          </div>

        </div>
      );
    }

    // ============================================================
    // MULTI ROW RESPONSE
    // Sales by Region / Profit by Category etc.
    // ============================================================

    const chartData = rows.map((row) => {

      const item: Record<string, any> = {};

      if (Array.isArray(row)) {

        columns.forEach(
          (column, index) => {

            item[column] = row[index];

          }
        );

      } else if (
        typeof row === "object" &&
        row !== null
      ) {

        columns.forEach(
          (column) => {

            item[column] = row[column];

          }
        );

      }

      return item;

    });

    const xKey = columns[0];

    const yKey = columns[1];

    return (
      <div className="space-y-8">

        {/* ======================================================
            VISUALIZATION
        ====================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-slate-950/50
            p-6
          "
        >

          <div className="mb-5">

            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.25em]
                text-violet-400
              "
            >
              Visualization
            </p>

            <h3
              className="
                mt-2
                text-xl
                font-semibold
                text-white
              "
            >
              Business Performance
            </h3>

          </div>

          <BusinessBarChart
            data={chartData}
            xKey={xKey}
            yKey={yKey}
          />

        </div>

        {/* ======================================================
            DETAILED DATA
        ====================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-slate-950/50
            p-6
          "
        >

          <p
            className="
              mb-5
              text-xs
              font-medium
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            Detailed Data
          </p>

          <ResponseTable
            columns={columns}
            rows={rows}
          />

        </div>

      </div>
    );
  }

  // ============================================================
  // FALLBACK
  // ============================================================

  return (
    <pre
      className="
        overflow-auto
        rounded-2xl
        border
        border-white/10
        bg-slate-950
        p-6
        text-left
        text-sm
        text-green-400
      "
    >
      {JSON.stringify(response, null, 2)}
    </pre>
  );
}