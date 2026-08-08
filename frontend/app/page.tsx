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

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Chat */}
      <ChatBox
        onResponse={(result) => {
          setResponse(result);
        }}
        onLoadingChange={(isLoading) => {
          setLoading(isLoading);
        }}
      />

      {/* Response Area */}
      <section className="mx-auto mt-12 max-w-6xl px-6 pb-16">

        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-slate-900/60
            p-8
            backdrop-blur-xl
            shadow-[0_0_40px_rgba(139,92,246,0.10)]
          "
        >

          {/* Response Header */}
          <div className="mb-6">

            <h3 className="text-xl font-semibold text-white">
              ✨ AI Response
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Generated from your business question
            </p>

          </div>

          {/* Loading */}
          {loading ? (

            <LoadingSpinner />

          ) : response ? (

            /*
             * All response-format logic is handled
             * inside ResponseRenderer.
             *
             * Examples:
             *
             * KPI
             * → Total Sales
             *
             * Single-row result
             * → Best City
             *
             * Multi-row result
             * → Sales by Region
             * → Chart + Detailed Data
             */
            <ResponseRenderer
              response={response}
            />

          ) : (

            /* Empty State */
            <div className="py-10 text-center">

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

              <p className="text-lg font-medium text-slate-300">
                Ready to Analyze
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Ask a business question and MetricMind
                will transform it into an actionable insight.
              </p>

              {/* Example Questions */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">

                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-slate-900
                    px-4
                    py-2
                    text-xs
                    text-slate-400
                  "
                >
                  Total Sales
                </span>

                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-slate-900
                    px-4
                    py-2
                    text-xs
                    text-slate-400
                  "
                >
                  Best City
                </span>

                <span
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-slate-900
                    px-4
                    py-2
                    text-xs
                    text-slate-400
                  "
                >
                  Profit by Category
                </span>

              </div>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}