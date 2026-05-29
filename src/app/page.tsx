"use client";
import { useState, useCallback, useEffect } from "react";
import { LOADERS } from "@/components/loaders";

const SIZES = [32, 48, 64] as const;

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [color, setColor] = useState("#e0e0e0");
  const [size, setSize] = useState<(typeof SIZES)[number]>(48);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(4);
  const [multiColor, setMultiColor] = useState(false);
  const [color2, setColor2] = useState("#6bb5ff");

  const current = LOADERS[selected];
  const LoaderComponent = current.component;

  const handleCopy = useCallback(() => {
    const code = `<${current.name.charAt(0).toUpperCase() + current.name.slice(1)}Loader size={${size}} color="${color}" />`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [current.name, size, color]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") {
        setSelected((s) => (s - 1 + LOADERS.length) % LOADERS.length);
      } else if (e.key === "ArrowRight") {
        setSelected((s) => (s + 1) % LOADERS.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#333] text-[#ccc] font-mono selection:bg-white/15">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-[#2b2b2b]">
        <div className="flex items-center gap-4">
          <span className="text-[#f0f0f0] text-xs uppercase tracking-wider">Agentic Loaders</span>
          <span className="text-[10px] text-white/25 tracking-widest uppercase">v1.0</span>
          <a
            href="https://github.com/kartikk-k/animated-loaders"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white/60 transition-colors"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-white/35 tracking-wider uppercase">
          <span>{LOADERS.length} loaders</span>
          <span className="text-white/15">|</span>
          <span>{size}px</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Preview */}
        <main className="flex-1 flex flex-col items-center justify-center relative pb-28">
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `radial-gradient(circle, #fff 0.5px, transparent 0.5px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
            <button
              onClick={() => setZoom((z) => Math.max(1, z - 1))}
              className="w-7 h-7 flex items-center justify-center text-sm rounded-md bg-[#2b2b2b] border border-white/[0.08] hover:border-white/20 hover:bg-[#3a3a3a] transition-all cursor-pointer text-white/50 hover:text-white/80"
            >
              &minus;
            </button>
            <span className="text-[10px] text-white/35 tracking-widest w-10 text-center font-medium">{zoom}x</span>
            <button
              onClick={() => setZoom((z) => Math.min(10, z + 1))}
              className="w-7 h-7 flex items-center justify-center text-sm rounded-md bg-[#2b2b2b] border border-white/[0.08] hover:border-white/20 hover:bg-[#3a3a3a] transition-all cursor-pointer text-white/50 hover:text-white/80"
            >
              +
            </button>
          </div>

          {/* Loader preview — centered */}
          <div className="relative z-10 flex items-center justify-center">
            <div
              className="relative flex items-center justify-center overflow-hidden"
              style={{ width: size * zoom, height: size * zoom }}
            >
              <div style={{ transform: `scale(${zoom})` }}>
                <LoaderComponent size={size} color={color} color2={multiColor ? color2 : undefined} />
              </div>
            </div>
          </div>

          {/* Bottom: name + copy + info bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center">
            <div className="flex flex-col items-center gap-1.5 mb-2">
              <h2 className="uppercase text-[#f0f0f0] tracking-wide text-sm">{current.name}</h2>
              {/* <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase">{size}px</p> */}
            </div>

            <button
              onClick={handleCopy}
              className={`mb-5 px-4 py-2.5 text-xs tracking-wider uppercase rounded-full border transition-all cursor-pointer ${
                copied
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-white/10 bg-[#2b2b2b] hover:border-white/25 hover:bg-[#3a3a3a] text-white/60 hover:text-white/90"
              }`}
            >
              {copied ? "Copied!" : "Copy React"}
            </button>

            <div className="w-full px-6 py-3 border-t border-white/8 flex items-center justify-between text-[10px] text-white/25 tracking-wider bg-[#2b2b2b]/50">
              <span>&gt; STATUS: RENDERING</span>
              <span>CANVAS {size}x{size} @ {zoom}x ZOOM</span>
            </div>
          </div>
        </main>

        {/* Right: Controls sidebar */}
        <aside className="w-72 border-l border-white/[0.08] flex flex-col overflow-hidden bg-[#2e2e2e]">
          {/* Loader grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-[10px] text-white/35 tracking-widest uppercase mb-3 font-medium">Select Loader</div>
            <div className="grid grid-cols-3 gap-2">
              {LOADERS.map((loader, i) => {
                const L = loader.component;
                return (
                  <button
                    key={loader.name}
                    onClick={() => setSelected(i)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all cursor-pointer ${
                      selected === i
                        ? "border-white/25 bg-white/[0.07] shadow-[0_0_12px_rgba(255,255,255,0.03)]"
                        : "border-transparent hover:border-white/[0.1] hover:bg-white/[0.03]"
                    }`}
                  >
                    <L size={32} color={color} color2={multiColor ? color2 : undefined} />
                    <span className="text-[9px] text-white/45 tracking-wide">{loader.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-white/[0.08] p-4 space-y-5 bg-[#2a2a2a]">
            {/* Color */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[10px] text-white/35 tracking-widest uppercase font-medium">Color</div>
                <button
                  onClick={() => setMultiColor((m) => !m)}
                  className={`text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    multiColor
                      ? "border-white/25 bg-white/[0.08] text-[#e0e0e0]"
                      : "border-white/[0.08] text-white/35 hover:border-white/[0.15] hover:text-white/50"
                  }`}
                >
                  {multiColor ? "2 colors" : "1 color"}
                </button>
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/[0.1] bg-[#2b2b2b] cursor-pointer hover:border-white/20 transition-colors"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor(v);
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-[#252525] border border-white/[0.08] rounded-lg text-[#d0d0d0] font-mono tracking-wider outline-none focus:border-white/25 transition-colors"
                />
              </div>
              {multiColor && (
                <div className="flex items-center gap-2.5 mt-2.5">
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-white/[0.1] bg-[#2b2b2b] cursor-pointer hover:border-white/20 transition-colors"
                  />
                  <input
                    type="text"
                    value={color2}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor2(v);
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-[#252525] border border-white/[0.08] rounded-lg text-[#d0d0d0] font-mono tracking-wider outline-none focus:border-white/25 transition-colors"
                  />
                </div>
              )}
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}
