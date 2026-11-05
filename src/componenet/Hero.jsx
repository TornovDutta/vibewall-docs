import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="relative min-h-[75vh] flex flex-col justify-center gap-10 py-8">
      {/* Top Tag Badges */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="kicker text-indigo-400">Production-Ready REST API</span>
        <span className="text-slate-600">•</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
          Spring Boot 3.5 &amp; Java 17
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
          NVIDIA NIM • Llama 3.1
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Live at vibewall.me
        </span>
      </div>

      {/* Main Title & Description */}
      <div className="space-y-5 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-50 leading-[1.12]">
          Anonymous Confession &amp; Feedback Platform for Students
        </h1>
        <p className="text-lg sm:text-xl text-slate-200 font-medium">
          Secure, AI-moderated, encrypted, and ephemeral.
        </p>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          VibeWall lets students express feelings honestly without fear of judgment. Built from scratch with a clean
          MVC layered architecture, real-time AI moderation via NVIDIA NIM (Meta Llama 3.1 8B Instruct), AES-256-GCM
          server-side encryption at rest, 12-hour MongoDB TTL auto-deletion, stateless JWT with rotating refresh tokens,
          and sub-millisecond Redis caching — fully containerized with Docker.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3.5 pt-2">
        <a
          href="https://vibewall.me/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition no-underline"
        >
          <span>Visit Live Website (vibewall.me)</span>
          <span className="text-sm">↗</span>
        </a>

        <Link
          to="/setup"
          className="btn-primary px-5 py-3 rounded-xl no-underline"
        >
          Get Started &amp; Setup →
        </Link>

        <Link
          to="/api"
          className="btn-ghost px-5 py-3 rounded-xl text-sm font-semibold no-underline"
        >
          API Reference
        </Link>

        <a
          href="https://github.com/TornovDutta/VibeWall"
          target="_blank"
          rel="noreferrer"
          className="btn-ghost px-5 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2 no-underline"
        >
          <svg className="h-4 w-4 fill-current text-slate-300" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>GitHub</span>
        </a>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-4">
        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-mono uppercase tracking-wider text-indigo-400">AI Moderation</p>
          <p className="text-sm font-semibold text-slate-100">NVIDIA NIM / Llama 3.1</p>
          <p className="text-xs text-slate-400">Instant safety screening, rejects toxic posts (422)</p>
        </div>

        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-mono uppercase tracking-wider text-sky-400">Encryption at Rest</p>
          <p className="text-sm font-semibold text-slate-100">AES-256-GCM</p>
          <p className="text-xs text-slate-400">Deterministic IV for indexed encrypted lookups</p>
        </div>

        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">Ephemeral Storage</p>
          <p className="text-sm font-semibold text-slate-100">12h TTL Auto-Purge</p>
          <p className="text-xs text-slate-400">MongoDB native index removes expired confessions</p>
        </div>

        <div className="card p-4 space-y-1">
          <p className="text-[11px] font-mono uppercase tracking-wider text-violet-400">Stateless Auth</p>
          <p className="text-sm font-semibold text-slate-100">JWT + Rotating Refresh</p>
          <p className="text-xs text-slate-400">1h access token + 7-day single-active refresh</p>
        </div>
      </div>
    </section>
  )
}

export default Hero