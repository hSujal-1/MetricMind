export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">

      <div className="text-center">

        {/* Small badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">

          <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />

          AI-Powered Business Intelligence

        </div>

        <h2 className="text-5xl font-bold tracking-tight sm:text-6xl">

          Ask Your Business

          <span className="block bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Anything
          </span>

        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">

          Transform natural language into accurate business insights
          using Semantic AI, FastAPI, and Snowflake.

        </p>

      </div>

    </section>
  );
}