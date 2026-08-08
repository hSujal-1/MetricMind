export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            MetricMind
          </span>
        </h1>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm text-slate-400">

          <button className="transition hover:text-white">
            Documentation
          </button>

          <button className="transition hover:text-white">
            GitHub
          </button>

        </div>

      </div>
    </nav>
  );
}