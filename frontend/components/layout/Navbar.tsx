export default function Navbar() {
  return (
    <nav className="border-b border-[#E7DED2] bg-[#FFFDF8]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <a
          href="/"
          className="
            text-2xl
            font-bold
            tracking-tight
            text-[#C65D32]
            transition-colors
            duration-200
            hover:text-[#A94D2A]
          "
        >
          MetricMind
        </a>

        {/* Navigation */}
        <div
          className="
            flex
            items-center
            gap-6
            text-sm
            font-medium
            text-[#756F67]
          "
        >

          {/* Documentation */}
          <a
            href="/docs"
            className="
              transition-colors
              duration-200
              hover:text-[#C65D32]
            "
          >
            Documentation
          </a>

          {/* Dashboard */}
          <a
            href="/dashboard"
            className="
              transition-colors
              duration-200
              hover:text-[#C65D32]
            "
          >
            Dashboard
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/hSujal-1/MetricMind"
            target="_blank"
            rel="noopener noreferrer"
            className="
              transition-colors
              duration-200
              hover:text-[#C65D32]
            "
          >
            GitHub
          </a>

        </div>

      </div>
    </nav>
  );
}