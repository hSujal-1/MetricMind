export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />

      <span className="text-slate-400">
        Analyzing your question...
      </span>
    </div>
  );
}