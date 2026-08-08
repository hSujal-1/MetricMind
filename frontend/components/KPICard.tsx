type KPICardProps = {
  title: string;
  value: string | number;
};

export default function KPICard({
  title,
  value,
}: KPICardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-slate-900/70
        p-6
        shadow-[0_0_30px_rgba(34,211,238,0.06)]
      "
    >
      <p className="text-sm font-medium text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-cyan-400">
        {value}
      </h2>
    </div>
  );
}