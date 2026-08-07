"use client";

import { useState } from "react";
import { askMetricMind } from "../services/api";
import KPICard from "@/components/KPICard";

export default function Home() {

  const [question, setQuestion] = useState("");

  const [response, setResponse] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {

    if (!question.trim()) return;

    setLoading(true);

    try {

      const result = await askMetricMind(question);

      setResponse(result);

    } catch (error) {

      console.error(error);

      alert("Unable to connect to backend.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <h1 className="text-2xl font-bold">
            Metric<span className="text-cyan-400">Mind</span>
          </h1>

          <div className="flex items-center gap-6 text-sm text-slate-400">

            <button className="hover:text-white transition">
              Documentation
            </button>

            <button className="hover:text-white transition">
              GitHub
            </button>

          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16">

        <h2 className="text-center text-5xl font-bold">
          Ask Your Business Anything
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-center text-lg text-slate-400">
          Transform natural language into accurate business insights
          using Semantic AI, FastAPI, and Snowflake.
        </p>

      </section>

      {/* Chat Box */}
      <section className="mx-auto max-w-4xl px-6">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a business question..."
            className="h-36 w-full resize-none rounded-xl bg-slate-950 p-4 outline-none"
          />

          <div className="mt-5 flex justify-end">

            <button
              onClick={handleAsk}
              disabled={loading}
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Ask MetricMind"}
            </button>

          </div>

        </div>

      </section>

      {/* Response Area */}
      <section className="mx-auto mt-12 max-w-6xl px-6 pb-16">

        <div className="rounded-2xl border border-dashed border-slate-700 p-8">

          {response ? (

            response.data?.query_type === "kpi" ? (

              <KPICard
                title={response.data.metrics[0]}
                value={Object.values(response.data.values)[0] as string | number}
              />

            ) : (

              <pre className="overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-6 text-left text-sm text-green-400">
                {JSON.stringify(response, null, 2)}
              </pre>

            )

          ) : (

            <p className="text-center text-slate-500">
              Responses from MetricMind will appear here.
            </p>

          )}

        </div>

      </section>

    </main>

  );

}