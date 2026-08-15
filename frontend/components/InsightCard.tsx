type InsightCardProps = {
  title: string;
  label: string;
  value: string | number;
  metric: string;
  metricValue?: string | number;
};

type ComparisonMetric = {
  from: number;
  to: number;
  change: number;
  percentage_change: number;
  direction: "increase" | "decrease" | "no_change" | string;
};

type ComparisonCardProps = {
  title: string;
  label: string;
  dimension: string;
  periods: Array<string | number>;
  metrics: Record<string, ComparisonMetric>;
};

// =========================================================
// INSIGHT CARD
// =========================================================

export default function InsightCard({
  title,
  label,
  value,
  metric,
  metricValue,
}: InsightCardProps) {

  const formattedMetric =
    metricValue !== undefined
      ? Number(metricValue).toLocaleString(
          "en-IN",
          {
            maximumFractionDigits: 2,
          }
        )
      : null;

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-3xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        p-6
        shadow-[0_12px_35px_rgba(80,50,20,0.08)]
        sm:p-8
      "
    >

      {/* =====================================================
          SUBTLE ACCENT
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-[#C65D32]/8
          blur-3xl
          sm:-right-20
          sm:-top-20
          sm:h-40
          sm:w-40
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-16
          -left-16
          h-32
          w-32
          rounded-full
          bg-[#D99A5B]/8
          blur-3xl
          sm:-bottom-20
          sm:-left-20
          sm:h-40
          sm:w-40
        "
      />

      <div className="relative">

        {/* =================================================
            LABEL
        ================================================= */}

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[#C65D32]/20
              bg-[#C65D32]/8
              text-base
              text-[#C65D32]
              sm:h-10
              sm:w-10
              sm:text-lg
            "
          >
            ✦
          </div>

          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.14em]
              text-[#C65D32]
              sm:text-sm
              sm:tracking-[0.18em]
            "
          >
            {label}
          </p>

        </div>

        {/* =================================================
            DIMENSION
        ================================================= */}

        <p
          className="
            mt-6
            text-sm
            font-medium
            text-[#756F67]
            sm:mt-8
          "
        >
          {title}
        </p>

        <h2
          className="
            mt-2
            break-words
            text-3xl
            font-bold
            leading-tight
            tracking-tight
            text-[#25221F]
            sm:text-4xl
          "
        >
          {value}
        </h2>

        {/* =================================================
            METRIC
        ================================================= */}

        <div
          className="
            mt-6
            border-t
            border-[#E7DED2]
            pt-4
            sm:mt-7
            sm:pt-5
          "
        >

          <p
            className="
              text-[11px]
              font-bold
              uppercase
              tracking-[0.13em]
              text-[#756F67]
              sm:text-xs
              sm:tracking-[0.15em]
            "
          >
            {metric}
          </p>

          {formattedMetric !== null && (
            <p
              className="
                mt-2
                break-words
                text-2xl
                font-bold
                tracking-tight
                text-[#25221F]
                sm:text-3xl
              "
            >
              {formattedMetric}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

// =========================================================
// COMPARISON CARD
// =========================================================

export function ComparisonCard({
  title,
  label,
  dimension,
  periods,
  metrics,
}: ComparisonCardProps) {

  const fromPeriod =
    periods?.[0];

  const toPeriod =
    periods?.[1];

  const metricEntries =
    Object.entries(metrics || {});

  if (!metricEntries.length) {
    return null;
  }

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-3xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        p-6
        shadow-[0_12px_35px_rgba(80,50,20,0.08)]
        sm:p-8
      "
    >

      {/* =====================================================
          SUBTLE ACCENTS
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-[#C65D32]/7
          blur-3xl
          sm:-right-24
          sm:-top-24
          sm:h-48
          sm:w-48
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-20
          h-40
          w-40
          rounded-full
          bg-[#D99A5B]/7
          blur-3xl
          sm:-bottom-24
          sm:-left-24
          sm:h-48
          sm:w-48
        "
      />

      <div className="relative">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[#C65D32]/20
              bg-[#C65D32]/8
              text-base
              font-semibold
              text-[#C65D32]
              sm:h-10
              sm:w-10
              sm:text-lg
            "
          >
            ↗
          </div>

          <div className="min-w-0">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.14em]
                text-[#C65D32]
                sm:text-sm
                sm:tracking-[0.18em]
              "
            >
              {label}
            </p>

            <p
              className="
                mt-1
                text-xs
                text-[#756F67]
              "
            >
              {dimension} comparison
            </p>

          </div>

        </div>

        {/* =================================================
            TITLE
        ================================================= */}

        <p
          className="
            mt-6
            break-words
            text-sm
            font-medium
            leading-6
            text-[#756F67]
            sm:mt-8
          "
        >
          {title}
        </p>

        {/* =================================================
            PERIOD
        ================================================= */}

        <div
          className="
            mt-4
            flex
            flex-wrap
            items-center
            gap-2
            sm:gap-3
          "
        >

          <span
            className="
              rounded-xl
              border
              border-[#E7DED2]
              bg-[#F7F3EA]
              px-3
              py-2
              text-base
              font-semibold
              text-[#25221F]
              sm:px-4
              sm:text-lg
            "
          >
            {fromPeriod}
          </span>

          <span
            className="
              text-lg
              font-medium
              text-[#756F67]
              sm:text-xl
            "
          >
            →
          </span>

          <span
            className="
              rounded-xl
              border
              border-[#C65D32]/20
              bg-[#C65D32]/8
              px-3
              py-2
              text-base
              font-semibold
              text-[#C65D32]
              sm:px-4
              sm:text-lg
            "
          >
            {toPeriod}
          </span>

        </div>

        {/* =================================================
            METRICS
        ================================================= */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-4
            sm:mt-8
            md:grid-cols-2
          "
        >

          {metricEntries.map(
            ([metricName, comparison]) => {

              const {
                from,
                to,
                change,
                percentage_change,
                direction,
              } = comparison;

              const isIncrease =
                direction === "increase";

              const isDecrease =
                direction === "decrease";

              const directionText =
                isIncrease
                  ? "Increase"
                  : isDecrease
                    ? "Decrease"
                    : "No Change";

              const percentageText =
                `${Math.abs(
                  Number(
                    percentage_change
                  )
                ).toFixed(2)}%`;

              const changeText =
                Number(change).toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                );

              const directionColor =
                isIncrease
                  ? "#3F7D58"
                  : isDecrease
                    ? "#B94A48"
                    : "#756F67";

              return (
                <div
                  key={metricName}
                  className="
                    rounded-2xl
                    border
                    border-[#E7DED2]
                    bg-[#F7F3EA]/60
                    p-4
                    sm:p-5
                  "
                >

                  {/* =========================================
                      METRIC NAME
                  ========================================= */}

                  <p
                    className="
                      break-words
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.13em]
                      text-[#756F67]
                      sm:text-xs
                      sm:tracking-[0.15em]
                    "
                  >
                    {metricName}
                  </p>

                  {/* =========================================
                      FROM / TO
                  ========================================= */}

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-3
                      sm:gap-4
                    "
                  >

                    <div className="min-w-0">

                      <p className="text-xs text-[#756F67]">
                        From
                      </p>

                      <p
                        className="
                          mt-1
                          break-words
                          text-base
                          font-semibold
                          text-[#25221F]
                          sm:text-lg
                        "
                      >
                        {Number(from).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                    </div>

                    <div className="min-w-0">

                      <p className="text-xs text-[#756F67]">
                        To
                      </p>

                      <p
                        className="
                          mt-1
                          break-words
                          text-base
                          font-semibold
                          text-[#25221F]
                          sm:text-lg
                        "
                      >
                        {Number(to).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                    </div>

                  </div>

                  {/* =========================================
                      CHANGE
                  ========================================= */}

                  <div
                    className="
                      mt-5
                      border-t
                      border-[#E7DED2]
                      pt-4
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                      "
                    >

                      <div>

                        <p className="text-xs text-[#756F67]">
                          Change
                        </p>

                        <p
                          className="
                            mt-1
                            break-words
                            text-xl
                            font-bold
                            text-[#25221F]
                            sm:text-2xl
                          "
                        >
                          {changeText}
                        </p>

                      </div>

                      <div className="sm:text-right">

                        <p
                          className="
                            text-xl
                            font-bold
                            sm:text-2xl
                          "
                          style={{
                            color: directionColor,
                          }}
                        >
                          {isIncrease
                            ? "+"
                            : isDecrease
                              ? "-"
                              : ""}
                          {percentageText}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            font-bold
                            uppercase
                            tracking-wider
                          "
                          style={{
                            color: directionColor,
                          }}
                        >
                          {directionText}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}