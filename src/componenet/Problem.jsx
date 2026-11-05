import React from 'react'

function Problem({ problems, SectionHeading }) {
  const getBadgeColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30'
      case 'ERROR':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'WARNING':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      case 'INFO':
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/30'
    }
  }

  return (
    <section id="problem" className="space-y-10">
      <SectionHeading
        label="VULNERABILITY_ASSESSMENT.log"
        title="Risks in Traditional Platforms vs VibeWall Defenses"
        description="Traditional social platforms store sensitive, vulnerable student emotional data forever in plaintext. VibeWall neutralizes these risks by architectural design."
      />

      <div className="card p-5 sm:p-6 bg-gray-950/70 border-gray-800">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-slate-300">threat-mitigation-audit.log</span>
          </div>
          <span className="text-emerald-400">STATUS: MITIGATED</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {problems.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-800/80 bg-gray-900/50 p-4 space-y-2 hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${getBadgeColor(
                    item.level
                  )}`}
                >
                  [{item.level}]
                </span>
                <span className="text-xs font-mono text-emerald-400">✓ Resolved</span>
              </div>

              <p className="text-sm font-semibold text-slate-100">{item.text}</p>
              
              {item.mitigation && (
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  <span className="text-indigo-400">↳ Fix: </span>{item.mitigation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Problem