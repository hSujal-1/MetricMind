"use client";

import { useState } from "react";
import { askMetricMind } from "@/services/api";

type ChatBoxProps = {
  onResponse: (result: any) => void;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (message: string) => void;
};

const EXAMPLE_QUESTIONS = [
  "What are the total sales?",
  "What is the total profit?",
  "What are the sales by category?",
  "What are the sales by region?",
  "What are the top 10 cities by sales?",
];

export default function ChatBox({
  onResponse,
  onLoadingChange,
  onError,
}: ChatBoxProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (questionOverride?: string) => {
    const currentQuestion = questionOverride ?? question;

    if (!currentQuestion.trim() || loading) {
      return;
    }

    setQuestion(currentQuestion);
    setLoading(true);
    onLoadingChange?.(true);

    try {
      const result = await askMetricMind(currentQuestion);

      onResponse(result);
    } catch (error) {
      console.error("MetricMind request failed:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to connect to backend.";

      onError?.(errorMessage);

      alert(errorMessage);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handleExampleClick = (example: string) => {
    if (loading) {
      return;
    }

    handleAsk(example);
  };

  return (
    <section className="mx-auto max-w-4xl px-6">
      <div
        className="
          rounded-3xl
          border
          border-[#E7DED2]
          bg-[#FFFDF8]
          p-8
          shadow-[0_12px_40px_rgba(88,62,43,0.08)]
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
            border-[#E7DED2]
            bg-[#F7F3EA]
            p-5
            text-[#25221F]
            placeholder:text-[#756F67]
            outline-none
            transition-all
            duration-300
            focus:border-[#C65D32]
            focus:ring-2
            focus:ring-[#C65D32]/15
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        />

        {/* Action Area */}

        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-xs text-[#756F67]">
            Ask about sales, profit, cities, categories, regions...
          </span>

          <button
            type="button"
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="
              rounded-2xl
              bg-[#C65D32]
              px-8
              py-3
              font-semibold
              text-white
              shadow-[0_8px_20px_rgba(198,93,50,0.20)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#A94D29]
              hover:shadow-[0_10px_25px_rgba(198,93,50,0.28)]
              disabled:cursor-not-allowed
              disabled:opacity-50
              disabled:hover:translate-y-0
            "
          >
            {loading ? "Thinking..." : "Ask MetricMind"}
          </button>
        </div>

        {/* Example Questions */}

        <div className="mt-7">
          <p
            className="
              mb-4
              text-center
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#756F67]
            "
          >
            Try an example
          </p>

          <div
            className="
              flex
              flex-wrap
              justify-center
              gap-3
            "
          >
            {EXAMPLE_QUESTIONS.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={loading}
                className="
                  rounded-xl
                  border
                  border-[#E7DED2]
                  bg-[#F7F3EA]
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-[#25221F]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#D99A5B]
                  hover:bg-[#D99A5B]/10
                  hover:text-[#C65D32]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}