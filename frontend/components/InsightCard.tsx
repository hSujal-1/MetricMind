type InsightCardProps = {
  title: string;
  label: string;
  value: string | number;
  metric: string;
  metricValue?: string | number;
};

export default function InsightCard({
  title,
  label,
  value,
  metric,
  metricValue,
}: InsightCardProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-violet-500/20
        bg-slate-950/70
        p-8
        shadow-[0_0_50px_rgba(139,92,246,0.12)]
        backdrop-blur-xl
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-violet-500/10
          blur-3xl
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
          bg-fuchsia-500/10
          blur-3xl
        "
      />

      <div className="relative">

        {/* Label */}

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-violet-400/20
              bg-violet-500/10
              text-lg
            "
          >
            ✦
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-400">
            {label}
          </p>

        </div>

        {/* Dimension */}

        <p className="mt-8 text-sm font-medium text-slate-500">
          {title}
        </p>

        <h2
          className="
            mt-2
            break-words
            text-4xl
            font-bold
            tracking-tight
            text-white
          "
        >
          {value}
        </h2>

        {/* Metric */}

        <div className="mt-7 border-t border-white/10 pt-5">

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            {metric}
          </p>

          {metricValue !== undefined && (
            <p
              className="
                mt-2
                text-3xl
                font-bold
                tracking-tight
                text-white
              "
            >
              {Number(metricValue).toLocaleString("en-IN")}
            </p>
          )}

        </div>

      </div>
    </div>
  );
}