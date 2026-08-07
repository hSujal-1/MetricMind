type KPICardProps = {
  title: string;
  value: string | number;
};

export default function KPICard({
  title,
  value,
}: KPICardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold text-cyan-400">
        {value}
      </h2>

    </div>
  );
}