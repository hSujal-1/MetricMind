"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getTotalSales,
  getTotalProfit,
  getSalesByRegion,
  getSalesByCategory,
  getTopCities,
  getSalesTrend,
} from "@/services/dashboardService";


// =========================================================
// TYPES
// =========================================================

type ApiResponse = {
  success?: boolean;
  query_type?: string;
  values?: Record<string, any>;
  rows?: Record<string, any>[];
  columns?: string[];
  metrics?: string[];
  filters?: Record<string, any>;
  sql?: string;
  error?: string;
  message?: string;
  [key: string]: any;
};


type DashboardState = {
  totalSales: ApiResponse | null;
  totalProfit: ApiResponse | null;
  regions: ApiResponse | null;
  categories: ApiResponse | null;
  cities: ApiResponse | null;
  trend: ApiResponse | null;
};


// =========================================================
// RESPONSE NORMALIZER
// =========================================================

function normalizeResponse(data: any): ApiResponse {
  if (!data) {
    return {};
  }

  if (
    data.data &&
    typeof data.data === "object"
  ) {
    return {
      ...data.data,
      success:
        data.success ??
        data.data.success,
    };
  }

  return data;
}


// =========================================================
// GET ROWS
// =========================================================

function getRows(
  response: ApiResponse | null
): Record<string, any>[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response.rows)) {
    return response.rows;
  }

  return [];
}


// =========================================================
// GET COLUMNS
// =========================================================

function getColumns(
  response: ApiResponse | null
): string[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response.columns)) {
    return response.columns;
  }

  const rows = getRows(response);

  if (rows.length > 0) {
    return Object.keys(rows[0]);
  }

  return [];
}


// =========================================================
// FIND EXACT KEY
// =========================================================

function findKey(
  row: Record<string, any> | undefined,
  possibleKeys: string[]
): string {
  if (!row) {
    return "";
  }

  const keys = Object.keys(row);

  for (const possibleKey of possibleKeys) {
    const exactKey = keys.find(
      (key) => key === possibleKey
    );

    if (exactKey) {
      return exactKey;
    }
  }

  for (const possibleKey of possibleKeys) {
    const normalizedPossibleKey =
      possibleKey
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    const matchingKey = keys.find(
      (key) =>
        key
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") ===
        normalizedPossibleKey
    );

    if (matchingKey) {
      return matchingKey;
    }
  }

  return "";
}


// =========================================================
// FIND KEY CONTAINING WORD
// =========================================================

function findKeyContaining(
  row: Record<string, any> | undefined,
  possibleWords: string[]
): string {
  if (!row) {
    return "";
  }

  const keys = Object.keys(row);

  for (const key of keys) {
    const normalized = key
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const matched = possibleWords.some(
      (word) =>
        normalized.includes(
          word
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
        )
    );

    if (matched) {
      return key;
    }
  }

  return "";
}


// =========================================================
// FORMAT NUMBER
// =========================================================

function formatNumber(value: any): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const numericValue = Number(
    String(value).replace(/,/g, "")
  );

  if (!Number.isFinite(numericValue)) {
    return String(value);
  }

  return numericValue.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2,
    }
  );
}


// =========================================================
// NUMERIC VALUE
// =========================================================

function getNumericValue(
  value: any
): number {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const number = Number(
    String(value).replace(/,/g, "")
  );

  return Number.isFinite(number)
    ? number
    : 0;
}


// =========================================================
// LABEL VALUE
// =========================================================

function getLabelValue(
  value: any
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Unknown";
  }

  return String(value);
}


// =========================================================
// KPI VALUE
// =========================================================

function getKpiValue(
  response: ApiResponse | null,
  possibleKeys: string[]
): any {
  if (!response) {
    return null;
  }

  if (response.values) {
    const key = findKey(
      response.values,
      possibleKeys
    );

    if (key) {
      return response.values[key];
    }

    const firstValue =
      Object.values(
        response.values
      )[0];

    if (
      firstValue !== undefined &&
      firstValue !== null
    ) {
      return firstValue;
    }
  }

  return null;
}


// =========================================================
// SALES TREND CHART
// =========================================================

function SalesTrendChart({
  response,
}: {
  response: ApiResponse | null;
}) {
  const rows = getRows(response);

  if (!rows.length) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center">
        <p className="text-sm text-[#756F67]">
          No sales trend data available.
        </p>
      </div>
    );
  }

  const firstRow = rows[0];

  const xKey =
    findKey(
      firstRow,
      [
        "year",
        "YEAR",
        "order_year",
        "ORDER_YEAR",
        "date",
        "DATE",
      ]
    ) ||
    Object.keys(firstRow)[0] ||
    "";

  const yKey =
    findKey(
      firstRow,
      [
        "total_sales",
        "TOTAL_SALES",
        "sales",
        "SALES",
        "sum_sales",
        "SUM_SALES",
      ]
    ) ||
    findKeyContaining(
      firstRow,
      ["sales"]
    ) ||
    Object.keys(firstRow)[1] ||
    "";

  const values = rows.map(
    (row) => ({
      label: getLabelValue(
        row[xKey]
      ),
      value: getNumericValue(
        row[yKey]
      ),
    })
  );

  const maxValue = Math.max(
    ...values.map(
      (item) => item.value
    ),
    1
  );

  const width = 620;
  const height = 280;

  const left = 55;
  const right = 20;
  const top = 20;
  const bottom = 45;

  const chartWidth =
    width - left - right;

  const chartHeight =
    height - top - bottom;

  const points = values.map(
    (item, index) => {
      const x =
        values.length === 1
          ? left +
            chartWidth / 2
          : left +
            (index /
              (values.length - 1)) *
              chartWidth;

      const y =
        top +
        chartHeight -
        (item.value /
          maxValue) *
          chartHeight;

      return {
        ...item,
        x,
        y,
      };
    }
  );

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  return (
    <div className="h-full w-full overflow-visible">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full overflow-visible"
      >

        {/* GRID */}

        {[0, 1, 2, 3, 4].map(
          (line) => {
            const y =
              top +
              (chartHeight / 4) *
                line;

            return (
              <line
                key={line}
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="#E7DED2"
                strokeDasharray="3 4"
              />
            );
          }
        )}


        {/* LINE */}

        <path
          d={path}
          fill="none"
          stroke="#C65D32"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />


        {/* POINTS + TOOLTIP */}

        {points.map(
          (point, index) => (
            <g
              key={index}
              className="group"
            >

              {/* Invisible larger hover area */}

              <circle
                cx={point.x}
                cy={point.y}
                r="12"
                fill="transparent"
                className="cursor-pointer"
              />


              {/* Actual point */}

              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#FFFDF8"
                stroke="#C65D32"
                strokeWidth="2"
                className="transition-all duration-150"
              />


              {/* X AXIS LABEL */}

              <text
                x={point.x}
                y={height - 15}
                textAnchor="middle"
                fontSize="10"
                fill="#756F67"
              >
                {point.label}
              </text>


              {/* CUSTOM TOOLTIP */}

              <g
                className="
                  pointer-events-none
                  opacity-0
                  transition-opacity
                  duration-150
                  group-hover:opacity-100
                "
              >

                <rect
                  x={point.x - 60}
                  y={point.y - 58}
                  width="120"
                  height="42"
                  rx="7"
                  fill="#25221F"
                />

                <text
                  x={point.x}
                  y={point.y - 40}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#FFFDF8"
                >
                  {point.label}
                </text>

                <text
                  x={point.x}
                  y={point.y - 25}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#F7F3EA"
                >
                  Sales:{" "}
                  {formatNumber(
                    point.value
                  )}
                </text>

              </g>

            </g>
          )
        )}

      </svg>
    </div>
  );
}


// =========================================================
// HORIZONTAL BAR CHART
// =========================================================

function SalesBarChart({
  response,
  labelKeys,
  valueKeys,
}: {
  response: ApiResponse | null;
  labelKeys: string[];
  valueKeys: string[];
}) {
  const rows = getRows(response);

  if (!rows.length) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center">
        <p className="text-sm text-[#756F67]">
          No visualization data available.
        </p>
      </div>
    );
  }

  const firstRow = rows[0];

  const labelKey =
    findKey(
      firstRow,
      labelKeys
    ) ||
    Object.keys(firstRow)[0] ||
    "";

  const valueKey =
    findKey(
      firstRow,
      valueKeys
    ) ||
    findKeyContaining(
      firstRow,
      [
        "sales",
        "profit",
        "sum",
      ]
    ) ||
    Object.keys(firstRow)[1] ||
    "";

  const values = rows
    .map(
      (row) => ({
        label: getLabelValue(
          row[labelKey]
        ),
        value: getNumericValue(
          row[valueKey]
        ),
      })
    )
    .filter(
      (item) =>
        item.label !==
          "Unknown" ||
        item.value !== 0
    )
    .slice(0, 10);

  if (!values.length) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center">
        <p className="text-sm text-[#756F67]">
          No valid chart data available.
        </p>
      </div>
    );
  }

  const maxValue = Math.max(
    ...values.map(
      (item) => item.value
    ),
    1
  );

  return (
    <div className="flex h-full min-h-[280px] flex-col justify-center gap-3 px-3 py-4">

      {values.map(
        (item, index) => {

          const percentage =
            Math.max(
              0,
              Math.min(
                100,
                (item.value /
                  maxValue) *
                  100
              )
            );

          return (
            <div
              key={`${item.label}-${index}`}
              className="
                group
                relative
                grid
                grid-cols-[110px_1fr_85px]
                items-center
                gap-3
              "
            >

              {/* LABEL */}

              <p
                className="
                  truncate
                  text-xs
                  font-medium
                  text-[#756F67]
                "
                title={item.label}
              >
                {item.label}
              </p>


              {/* BAR */}

              <div className="relative h-3 overflow-visible rounded-full bg-[#F0E9DE]">

                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#C65D32]
                    transition-all
                    duration-300
                    group-hover:bg-[#A94D2A]
                  "
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>


              {/* VALUE */}

              <p className="text-right text-xs font-semibold tabular-nums text-[#25221F]">
                {formatNumber(
                  item.value
                )}
              </p>


              {/* HOVER TOOLTIP */}

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-full
                  left-1/2
                  z-50
                  mb-2
                  -translate-x-1/2
                  translate-y-1
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-[#E7DED2]
                  bg-[#25221F]
                  px-3
                  py-2
                  text-xs
                  text-white
                  opacity-0
                  shadow-[0_8px_20px_rgba(37,34,31,0.18)]
                  transition-all
                  duration-150
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >

                <p className="font-semibold">
                  {item.label}
                </p>

                <p className="mt-1 text-[#F7F3EA]">
                  Sales:{" "}
                  {formatNumber(
                    item.value
                  )}
                </p>

              </div>

            </div>
          );
        }
      )}

    </div>
  );
}


// =========================================================
// CATEGORY DONUT CHART
// =========================================================

function CategoryChart({
  response,
}: {
  response: ApiResponse | null;
}) {
  const rows = getRows(response);

  if (!rows.length) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center">
        <p className="text-sm text-[#756F67]">
          No category data available.
        </p>
      </div>
    );
  }

  const firstRow = rows[0];

  const labelKey =
    findKey(
      firstRow,
      [
        "category",
        "CATEGORY",
        "category_name",
        "CATEGORY_NAME",
      ]
    ) ||
    Object.keys(firstRow)[0] ||
    "";

  const valueKey =
    findKey(
      firstRow,
      [
        "total_sales",
        "TOTAL_SALES",
        "sales",
        "SALES",
        "sum_sales",
        "SUM_SALES",
      ]
    ) ||
    findKeyContaining(
      firstRow,
      ["sales"]
    ) ||
    Object.keys(firstRow)[1] ||
    "";

  const values = rows
    .map(
      (row) => ({
        label: getLabelValue(
          row[labelKey]
        ),
        value: getNumericValue(
          row[valueKey]
        ),
      })
    )
    .filter(
      (item) =>
        item.value > 0
    );

  if (!values.length) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center">
        <p className="text-sm text-[#756F67]">
          No valid category data available.
        </p>
      </div>
    );
  }

  const total = values.reduce(
    (sum, item) =>
      sum + item.value,
    0
  );

  const radius = 75;

  const circumference =
    2 * Math.PI * radius;

  let accumulated = 0;

  return (
    <div className="flex h-full min-h-[280px] items-center justify-center gap-8">

      {/* DONUT */}

      <div className="relative h-52 w-52">

        <svg
          viewBox="0 0 200 200"
          className="h-full w-full -rotate-90 overflow-visible"
        >

          {/* BACKGROUND */}

          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#F0E9DE"
            strokeWidth="30"
          />


          {/* SEGMENTS */}

          {values.map(
            (item, index) => {

              const segment =
                (item.value /
                  total) *
                circumference;

              const offset =
                -accumulated;

              accumulated +=
                segment;

              return (
                <g
                  key={index}
                  className="group"
                >

                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke={
                      index === 0
                        ? "#C65D32"
                        : index === 1
                          ? "#D98B63"
                          : "#6F8B72"
                    }
                    strokeWidth="30"
                    strokeDasharray={`${segment} ${
                      circumference -
                      segment
                    }`}
                    strokeDashoffset={
                      offset
                    }
                    strokeLinecap="butt"
                    className="
                      cursor-pointer
                      transition-all
                      duration-200
                      group-hover:opacity-75
                    "
                  />


                  {/* NATIVE TOOLTIP */}

                  <title>
                    {`${item.label} — Sales: ${formatNumber(
                      item.value
                    )}`}
                  </title>

                </g>
              );
            }
          )}

        </svg>


        {/* CENTER */}

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#756F67]">
            TOTAL
          </span>

          <span className="mt-1 text-lg font-bold text-[#25221F]">
            {formatNumber(
              total
            )}
          </span>

        </div>

      </div>


      {/* LEGEND */}

      <div className="space-y-3">

        {values.map(
          (item, index) => (
            <div
              key={index}
              className="group relative flex cursor-pointer items-center gap-2"
            >

              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{
                  backgroundColor:
                    index === 0
                      ? "#C65D32"
                      : index === 1
                        ? "#D98B63"
                        : "#6F8B72",
                }}
              />

              <span className="text-xs text-[#756F67]">
                {item.label}
              </span>


              {/* LEGEND TOOLTIP */}

              <div
                className="
                  pointer-events-none
                  absolute
                  left-full
                  top-1/2
                  z-50
                  ml-3
                  -translate-y-1/2
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-[#E7DED2]
                  bg-[#25221F]
                  px-3
                  py-2
                  text-xs
                  text-white
                  opacity-0
                  transition-opacity
                  duration-150
                  group-hover:opacity-100
                "
              >
                {formatNumber(
                  item.value
                )}
              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}


// =========================================================
// DASHBOARD PAGE
// =========================================================

export default function DashboardPage() {

  const [
    dashboard,
    setDashboard,
  ] = useState<DashboardState>({
    totalSales: null,
    totalProfit: null,
    regions: null,
    categories: null,
    cities: null,
    trend: null,
  });


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  // =======================================================
  // LOAD DASHBOARD DATA
  // =======================================================

  useEffect(() => {

    let mounted = true;

    async function loadDashboard() {

      try {

        setLoading(true);
        setError(null);

        const [
          totalSalesResponse,
          totalProfitResponse,
          regionResponse,
          categoryResponse,
          cityResponse,
          trendResponse,
        ] = await Promise.all([
          getTotalSales(),
          getTotalProfit(),
          getSalesByRegion(),
          getSalesByCategory(),
          getTopCities(),
          getSalesTrend(),
        ]);


        if (!mounted) {
          return;
        }


        setDashboard({
          totalSales:
            normalizeResponse(
              totalSalesResponse
            ),

          totalProfit:
            normalizeResponse(
              totalProfitResponse
            ),

          regions:
            normalizeResponse(
              regionResponse
            ),

          categories:
            normalizeResponse(
              categoryResponse
            ),

          cities:
            normalizeResponse(
              cityResponse
            ),

          trend:
            normalizeResponse(
              trendResponse
            ),
        });

      } catch (err: any) {

        if (!mounted) {
          return;
        }

        setError(
          err?.message ||
            "Unable to load dashboard data."
        );

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    }


    loadDashboard();


    return () => {
      mounted = false;
    };

  }, []);


  // =======================================================
  // KPI VALUES
  // =======================================================

  const totalSales =
    useMemo(
      () =>
        getKpiValue(
          dashboard.totalSales,
          [
            "total_sales",
            "TOTAL_SALES",
            "sales",
            "SALES",
            "sum_sales",
            "SUM_SALES",
          ]
        ),
      [dashboard.totalSales]
    );


  const totalProfit =
    useMemo(
      () =>
        getKpiValue(
          dashboard.totalProfit,
          [
            "total_profit",
            "TOTAL_PROFIT",
            "profit",
            "PROFIT",
            "sum_profit",
            "SUM_PROFIT",
          ]
        ),
      [dashboard.totalProfit]
    );


  const regionCount =
    useMemo(() => {

      const rows =
        getRows(
          dashboard.regions
        );

      return rows.length;

    }, [dashboard.regions]);


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (
      <main className="min-h-screen bg-[#F7F3EA] px-4 py-10 text-[#25221F] sm:px-6 lg:px-10">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C65D32]">
              BUSINESS INTELLIGENCE
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Sales Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#756F67]">
              Loading business performance data...
            </p>

          </div>


          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-32
                    animate-pulse
                    rounded-2xl
                    border
                    border-[#E7DED2]
                    bg-[#FFFDF8]
                  "
                />
              )
            )}

          </div>


          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    h-[430px]
                    animate-pulse
                    rounded-2xl
                    border
                    border-[#E7DED2]
                    bg-[#FFFDF8]
                  "
                />
              )
            )}

          </div>

        </div>

      </main>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error) {

    return (
      <main className="min-h-screen bg-[#F7F3EA] px-4 py-10 text-[#25221F] sm:px-6 lg:px-10">

        <div className="mx-auto max-w-3xl">

          <div className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-8 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C65D32]">
              DASHBOARD ERROR
            </p>

            <h1 className="mt-2 text-2xl font-bold">
              Unable to load dashboard
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#756F67]">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="
                mt-6
                rounded-xl
                bg-[#C65D32]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-[0_8px_20px_rgba(198,93,50,0.18)]
                transition-colors
                hover:bg-[#A94D2A]
              "
            >
              Retry
            </button>

          </div>

        </div>

      </main>
    );
  }


  // =======================================================
  // MAIN DASHBOARD
  // =======================================================

  return (
    <main className="min-h-screen bg-[#F7F3EA] px-4 py-10 text-[#25221F] sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C65D32]">
            BUSINESS INTELLIGENCE
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#25221F]">
            Sales Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756F67]">
            Overview of sales performance across time,
            regions, categories, and cities.
          </p>

        </div>


        {/* =================================================
            KPI SUMMARY
        ================================================= */}

        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">


          {/* TOTAL SALES */}

          <div className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
              TOTAL SALES
            </p>

            <p className="mt-3 text-2xl font-bold text-[#25221F]">
              ₹{formatNumber(
                totalSales
              )}
            </p>

            <p className="mt-2 text-xs text-[#756F67]">
              Overall business sales
            </p>

          </div>


          {/* TOTAL PROFIT */}

          <div className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
              TOTAL PROFIT
            </p>

            <p className="mt-3 text-2xl font-bold text-[#25221F]">

              {totalProfit ===
              null
                ? "—"
                : `₹${formatNumber(
                    totalProfit
                  )}`}

            </p>

            <p className="mt-2 text-xs text-[#756F67]">
              Overall business profit
            </p>

          </div>


          {/* REGIONS */}

          <div className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
              REGIONS
            </p>

            <p className="mt-3 text-2xl font-bold text-[#25221F]">
              {regionCount ||
                "—"}
            </p>

            <p className="mt-2 text-xs text-[#756F67]">
              Sales regions covered
            </p>

          </div>


          {/* CITY PERFORMANCE */}

          <div className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
              CITY PERFORMANCE
            </p>

            <p className="mt-3 text-2xl font-bold text-[#25221F]">
              Top 10
            </p>

            <p className="mt-2 text-xs text-[#756F67]">
              Highest-performing cities
            </p>

          </div>

        </section>


        {/* =================================================
            VISUAL ANALYSIS
        ================================================= */}

        <section>

          <div className="mb-5">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
              VISUAL ANALYSIS
            </p>

            <h2 className="mt-2 text-xl font-semibold text-[#25221F]">
              Sales Performance
            </h2>

            <p className="mt-1 text-sm text-[#756F67]">
              Explore sales trends and business performance
              across different dimensions.
            </p>

          </div>


          {/* =================================================
              CHART GRID
          ================================================= */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">


            {/* SALES TREND */}

            <div className="min-h-[430px] rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
                TREND ANALYSIS
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#25221F]">
                Sales Trend
              </h2>

              <p className="mt-1 text-sm text-[#756F67]">
                Year-over-year sales performance.
              </p>

              <div className="mt-6 min-h-[280px] overflow-visible rounded-xl border border-[#E7DED2] bg-[#FFFDF8] p-3">

                <SalesTrendChart
                  response={
                    dashboard.trend
                  }
                />

              </div>

            </div>


            {/* SALES BY REGION */}

            <div className="min-h-[430px] rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
                REGIONAL ANALYSIS
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#25221F]">
                Sales by Region
              </h2>

              <p className="mt-1 text-sm text-[#756F67]">
                Comparison of sales across regions.
              </p>

              <div className="mt-6 min-h-[280px] overflow-visible rounded-xl border border-[#E7DED2] bg-[#FFFDF8] p-3">

                <SalesBarChart
                  response={
                    dashboard.regions
                  }
                  labelKeys={[
                    "region",
                    "REGION",
                    "region_name",
                    "REGION_NAME",
                  ]}
                  valueKeys={[
                    "total_sales",
                    "TOTAL_SALES",
                    "sales",
                    "SALES",
                    "sum_sales",
                    "SUM_SALES",
                  ]}
                />

              </div>

            </div>


            {/* SALES BY CATEGORY */}

            <div className="min-h-[430px] rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
                CATEGORY ANALYSIS
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#25221F]">
                Sales by Category
              </h2>

              <p className="mt-1 text-sm text-[#756F67]">
                Category contribution to overall sales.
              </p>

              <div className="mt-6 min-h-[280px] overflow-visible rounded-xl border border-[#E7DED2] bg-[#FFFDF8] p-3">

                <CategoryChart
                  response={
                    dashboard.categories
                  }
                />

              </div>

            </div>


            {/* TOP 10 CITIES */}

            <div className="min-h-[430px] rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6 shadow-[0_8px_30px_rgba(80,50,20,0.05)]">

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C65D32]">
                CITY PERFORMANCE
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#25221F]">
                Top 10 Cities
              </h2>

              <p className="mt-1 text-sm text-[#756F67]">
                Highest-performing cities by sales.
              </p>

              <div className="mt-6 min-h-[280px] overflow-visible rounded-xl border border-[#E7DED2] bg-[#FFFDF8] p-3">

                <SalesBarChart
                  response={
                    dashboard.cities
                  }
                  labelKeys={[
                    "city",
                    "CITY",
                    "city_name",
                    "CITY_NAME",
                  ]}
                  valueKeys={[
                    "total_sales",
                    "TOTAL_SALES",
                    "sales",
                    "SALES",
                    "sum_sales",
                    "SUM_SALES",
                  ]}
                />

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-10 border-t border-[#E7DED2] pt-6">

          <p className="text-center text-xs text-[#756F67]">
            MetricMind • AI-Powered Business Intelligence
          </p>

        </div>

      </div>

    </main>
  );
}