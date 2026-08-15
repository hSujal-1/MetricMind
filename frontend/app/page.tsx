"use client";

import { useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import ChatBox from "@/components/chat/ChatBox";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResponseRenderer from "@/components/ResponseRenderer";

export default function Home() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#25221F]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <Hero />

      {/* =====================================================
          CHAT
      ===================================================== */}

      <ChatBox
        onResponse={(result) => {
          // Clear previous frontend error
          setError(null);

          // Store backend response
          setResponse(result);
        }}
        onLoadingChange={(isLoading) => {
          setLoading(isLoading);

          // Clear error when a new request starts
          if (isLoading) {
            setError(null);
          }
        }}
        onError={(message) => {
          setError(message);
        }}
      />

      {/* =====================================================
          RESPONSE AREA
      ===================================================== */}

      <section className="mx-auto mt-12 max-w-6xl px-6 pb-16">

        <div
          className="
  rounded-3xl
  border
  border-[#E7DED2]
  bg-[#FFFDF8]/90
  p-6
  shadow-[0_12px_40px_rgba(88,62,43,0.08)]
  backdrop-blur-xl
  sm:p-8
"
        >

          {/* =================================================
              RESPONSE HEADER
          ================================================= */}

          <div className="mb-6">

            <h3 className="text-xl font-semibold text-[#25221F]">
              ✨ AI Response
            </h3>

            <p className="mt-1 text-sm text-[#756F67]">
              Generated from your business question
            </p>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <LoadingSpinner />

          ) : error ? (

            /* =================================================
               ERROR STATE
            ================================================= */

            <div className="py-10">

              <div
                className="
                  mx-auto
                  max-w-xl
                  rounded-2xl
                  border
                  border-red-400/20
                  bg-red-500/5
                  p-6
                  text-center
                "
              >

                {/* Error Icon */}

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
                    border-red-400/20
                    bg-red-500/10
                    text-xl
                  "
                >
                  !
                </div>

                {/* Error Title */}

                <p
                  className="
                    mt-4
                    text-lg
                    font-semibold
                    text-red-300
                  "
                >
                  Unable to generate insight
                </p>

                {/* Error Message */}

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-400
                  "
                >
                  {error}
                </p>

                {/* Helpful Message */}

                <p
                  className="
                    mt-4
                    text-xs
                    text-slate-500
                  "
                >
                  Try asking a question about sales,
                  profit, quantity, categories,
                  regions, or cities.
                </p>

              </div>

            </div>

          ) : response ? (

            /*
             * All response-format logic is handled
             * inside ResponseRenderer.
             *
             * KPI
             * → Total Sales
             *
             * Ranking
             * → Best City
             *
             * Grouped Analysis
             * → Sales by Region
             *
             * Comparison
             * → Sales change between years
             *
             * Multi-metric Analysis
             * → Sales & Profit by Category
             */

            <ResponseRenderer
              response={response}
            />

          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="py-10 text-center">

              {/* Icon */}

              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-violet-500/20
                  bg-violet-500/10
                  text-2xl
                  shadow-[0_0_30px_rgba(139,92,246,0.12)]
                "
              >
                ✨
              </div>

              {/* Title */}

              <p className="text-lg font-medium text-slate-300">
                Ready to Analyze
              </p>

              {/* Description */}

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Ask a business question and MetricMind
                will transform it into an actionable insight.
              </p>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}