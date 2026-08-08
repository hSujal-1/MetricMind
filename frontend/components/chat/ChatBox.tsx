"use client";

import { useState } from "react";
import { askMetricMind } from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

type ChatBoxProps = {
  onResponse: (result: any) => void;
  onLoadingChange?: (loading: boolean) => void;
};

export default function ChatBox({
  onResponse,
  onLoadingChange,
}: ChatBoxProps) {

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {

    if (!question.trim() || loading) {
      return;
    }

    setLoading(true);
    onLoadingChange?.(true);

    try {

      const result = await askMetricMind(question);

      onResponse(result);

    } catch (error) {

      console.error(error);

      alert("Unable to connect to backend.");

    } finally {

      setLoading(false);
      onLoadingChange?.(false);

    }
  };

  return (
    <section className="mx-auto max-w-4xl px-6">

      <div
        className="
          rounded-3xl
          border
          border-white/10
          bg-slate-900/60
          p-8
          backdrop-blur-xl
          shadow-[0_0_50px_rgba(139,92,246,0.12)]
        "
      >

        {/* Question Input */}
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          disabled={loading}
          placeholder="Ask a business question..."
          className="
            h-36
            w-full
            resize-none
            rounded-2xl
            border
            border-slate-700/50
            bg-slate-950/80
            p-5
            text-white
            placeholder:text-slate-500
            outline-none
            transition-all
            duration-300
            focus:border-violet-500
            focus:ring-2
            focus:ring-violet-500/30
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />

        {/* Action Area */}
        <div className="mt-5 flex items-center justify-between">

          <span className="text-xs text-slate-500">
            Ask about sales, profit, cities, categories, regions...
          </span>

          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="
              rounded-2xl
              bg-gradient-to-r
              from-violet-500
              to-cyan-500
              px-8
              py-3
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:scale-100
            "
          >
            {loading ? "Thinking..." : "Ask MetricMind"}
          </button>

        </div>

        {/* Loading Indicator */}
        {loading && (
          <LoadingSpinner />
        )}

      </div>

    </section>
  );
}