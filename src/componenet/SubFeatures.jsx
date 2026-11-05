import React from 'react'

function SubFeatures({ item }) {
  return (
    <div className="h-full card p-5 flex flex-col justify-between hover:border-indigo-500/40 transition">
      <div>
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-2 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {item.tag || 'ACTIVE'}
          </span>
          <span className="font-mono text-[11px] text-indigo-400">{item.badge || 'ONLINE'}</span>
        </div>

        <h3 className="text-lg font-semibold text-slate-100 mb-2">
          {item.title}
        </h3>

        <p className="text-sm text-slate-300 leading-relaxed">
          {item.details}
        </p>
      </div>

      {item.highlight && (
        <div className="mt-4 pt-3 border-t border-gray-800/80">
          <span className="text-xs font-mono text-slate-400 bg-gray-950/60 px-2 py-1 rounded border border-gray-800">
            {item.highlight}
          </span>
        </div>
      )}
    </div>
  )
}

export default SubFeatures