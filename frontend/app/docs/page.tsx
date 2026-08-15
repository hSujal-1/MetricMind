export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#25221F]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[#E7DED2] bg-[#FFFDF8]">

        <div className="mx-auto max-w-5xl px-6 py-16">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D99A5B]/40 bg-[#D99A5B]/10 px-4 py-2 text-sm font-medium text-[#C65D32]">

            <span className="h-2 w-2 rounded-full bg-[#C65D32]" />

            MetricMind Documentation

          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Understand your business.
            <span className="block text-[#C65D32]">
              Ask better questions.
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#756F67]">
            MetricMind transforms natural-language business questions
            into structured insights, visualizations, and detailed results.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-12">

        <div className="grid gap-6 md:grid-cols-3">

          {/* Overview */}

          <div className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C65D32]/10 text-[#C65D32]">
              01
            </div>

            <h2 className="text-lg font-semibold">
              Ask a Question
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#756F67]">
              Enter a business question using natural language.
              For example, ask about sales, profit, regions, categories,
              or cities.
            </p>

          </div>


          {/* AI */}

          <div className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#D99A5B]/15 text-[#C65D32]">
              02
            </div>

            <h2 className="text-lg font-semibold">
              AI Analysis
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#756F67]">
              MetricMind processes your question and generates
              business-focused results using its semantic analytics
              workflow.
            </p>

          </div>


          {/* Visualization */}

          <div className="rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-6">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#3F7D58]/10 text-[#3F7D58]">
              03
            </div>

            <h2 className="text-lg font-semibold">
              Explore Insights
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#756F67]">
              Review KPIs, charts, comparisons, trends, and detailed
              tabular results generated from your business question.
            </p>

          </div>

        </div>


        {/* ===================================================
            HOW IT WORKS
        =================================================== */}

        <section className="mt-12 rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-8">

          <h2 className="text-2xl font-bold">
            How MetricMind Works
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#756F67]">
            The application follows a simple natural-language-to-insight
            workflow.
          </p>


          <div className="mt-8 space-y-6">

            <div className="flex gap-4">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C65D32] text-sm font-bold text-white">
                1
              </div>

              <div>
                <h3 className="font-semibold">
                  Natural Language Question
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#756F67]">
                  Ask a question such as:
                  <span className="ml-1 font-medium text-[#25221F]">
                    "What are the total sales?"
                  </span>
                </p>
              </div>

            </div>


            <div className="flex gap-4">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D99A5B] text-sm font-bold text-white">
                2
              </div>

              <div>
                <h3 className="font-semibold">
                  Semantic Processing
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#756F67]">
                  The question is processed through the MetricMind
                  analytics pipeline to determine the appropriate
                  business metric and grouping.
                </p>
              </div>

            </div>


            <div className="flex gap-4">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3F7D58] text-sm font-bold text-white">
                3
              </div>

              <div>
                <h3 className="font-semibold">
                  Business Insight
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#756F67]">
                  MetricMind presents the result through readable
                  KPIs, visual analysis, and detailed data.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            TECHNOLOGY
        =================================================== */}

        <section className="mt-8 rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-8">

          <h2 className="text-2xl font-bold">
            Technology Stack
          </h2>

          <p className="mt-2 text-sm text-[#756F67]">
            MetricMind is built around a modern analytics architecture.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">

            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "FastAPI",
              "Python",
              "Semantic AI",
              "Snowflake",
              "Recharts",
            ].map((technology) => (

              <span
                key={technology}
                className="
                  rounded-full
                  border
                  border-[#E7DED2]
                  bg-[#F7F3EA]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-[#756F67]
                "
              >
                {technology}
              </span>

            ))}

          </div>

        </section>


        {/* ===================================================
            EXAMPLE QUESTIONS
        =================================================== */}

        <section className="mt-8 rounded-2xl border border-[#E7DED2] bg-[#FFFDF8] p-8">

          <h2 className="text-2xl font-bold">
            Example Questions
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            {[
              "What are the total sales?",
              "What is the total profit?",
              "What are the sales by category?",
              "What are the sales by region?",
              "What are the top 10 cities by sales?",
            ].map((question) => (

              <div
                key={question}
                className="
                  rounded-xl
                  border
                  border-[#E7DED2]
                  bg-[#F7F3EA]
                  px-4
                  py-3
                  text-sm
                  text-[#25221F]
                "
              >
                {question}
              </div>

            ))}

          </div>

        </section>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-[#E7DED2] bg-[#FFFDF8]">

        <div className="mx-auto max-w-5xl px-6 py-8">

          <p className="text-sm text-[#756F67]">
            MetricMind — AI-Powered Business Intelligence
          </p>

        </div>

      </footer>

    </main>
  );
}