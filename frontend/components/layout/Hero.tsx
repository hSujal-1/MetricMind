export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">

      <div className="text-center">

        {/* Badge */}
        <div
          className="
            mb-6
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-[#D99A5B]/40
            bg-[#D99A5B]/10
            px-4
            py-2
            text-sm
            font-medium
            text-[#C65D32]
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-[#C65D32]
            "
          />

          AI-Powered Business Intelligence
        </div>

        {/* Heading */}
        <h2
          className="
            text-5xl
            font-bold
            tracking-tight
            text-[#25221F]
            sm:text-6xl
          "
        >
          Ask Your Business

          <span className="block text-[#C65D32]">
            Anything
          </span>
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-6
            max-w-3xl
            text-lg
            leading-8
            text-[#756F67]
          "
        >
          Transform natural language into accurate business insights
          using Semantic AI, FastAPI, and Snowflake.
        </p>

      </div>

    </section>
  );
}