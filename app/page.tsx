'use client';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <div className="px-6 py-8 rounded-xl shadow-2xl backdrop-blur-sm bg-black/40 w-full max-w-xl flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl text-white font-extrabold mb-6 bg-clip-text text-transparent text-center drop-shadow">
          Aptos
        </h1>
        <h2 className="text-xl md:text-2xl font-medium mb-6 text-white/90 text-center">
          AI Interview Platform
        </h2>
        <p className="text-base md:text-lg text-white/70 mb-8 text-center max-w-lg">
          Accelerate your hiring and interviewing process with AI-assisted structured interviews,
          room management, and insightful analytics.
        </p>
        <div className="flex gap-4">
          <a
            href="/dashboard"
            className="rounded-lg px-6 py-3 font-semibold bg-gradient-to-r from-cyan-600 via-purple-500 to-pink-500 hover:from-cyan-500 hover:to-pink-400 transition-all shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            Get Started
          </a>
          <a
            href="https://github.com/callmegautam/aptos"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-6 py-3 font-semibold border border-white/20 hover:bg-white/10 transition shadow"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 text-xs text-white/30 text-center w-full select-none">
        © {new Date().getFullYear()} Aptos. All rights reserved.
      </div>
    </main>
  );
}
