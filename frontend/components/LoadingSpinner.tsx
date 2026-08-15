export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-3">

      <div
        className="
          h-6
          w-6
          animate-spin
          rounded-full
          border-2
          border-[#E7DED2]
          border-t-[#C65D32]
        "
      />

      <p
        className="
          text-sm
          font-medium
          text-[#756F67]
        "
      >
        Analyzing your question...
      </p>

    </div>
  );
}