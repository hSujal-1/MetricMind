"use client";

import { useState } from "react";

type SQLViewerProps = {
  sql: string;
};

export default function SQLViewer({ sql }: SQLViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900">

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-semibold text-cyan-400">
          Generated SQL
        </span>

        <span className="text-slate-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (

        <pre className="overflow-auto border-t border-slate-800 bg-slate-950 p-6 text-sm text-green-400 whitespace-pre-wrap">
          {sql}
        </pre>

      )}

    </div>
  );
}