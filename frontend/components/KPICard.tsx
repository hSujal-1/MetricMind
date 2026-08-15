type KPICardProps = {
  title: string;
  value: string | number;
};

export default function KPICard({
  title,
  value,
}: KPICardProps) {

  const formattedValue =
    typeof value === "number"
      ? value.toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })
      : value;

  return (
    <div
      className="
        w-full
        max-w-2xl
        rounded-2xl
        border
        border-[#E7DED2]
        bg-[#FFFDF8]
        p-7
        shadow-[0_12px_35px_rgba(70,50,30,0.08)]
      "
    >

      {/* Accent */}

      <div
        className="
          mb-5
          h-1
          w-12
          rounded-full
          bg-[#C65D32]
        "
      />

      {/* Label */}

      <p
        className="
          text-xs
          font-bold
          uppercase
          tracking-[0.18em]
          text-[#756F67]
        "
      >
        {title}
      </p>

      {/* Value */}

      <h2
        className="
          mt-3
          break-words
          text-4xl
          font-bold
          tracking-tight
          text-[#25221F]
          sm:text-5xl
        "
      >
        {formattedValue}
      </h2>

      {/* Supporting text */}

      <div
        className="
          mt-5
          flex
          items-center
          gap-2
          border-t
          border-[#E7DED2]
          pt-4
        "
      >

        <span
          className="
            h-2
            w-2
            rounded-full
            bg-[#3F7D58]
          "
        />

        <span
          className="
            text-xs
            font-medium
            text-[#756F67]
          "
        >
          Current business metric
        </span>

      </div>

    </div>
  );
}