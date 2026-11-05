import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-800/80 bg-black/90 py-12">
      <div className="container-page space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-sm">
                V
              </div>
              <span className="text-lg font-bold text-slate-100">VibeWall Documentation</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A production-ready REST API for an anonymous confession and feedback platform built for students.
              Features real-time AI moderation, AES-256-GCM encryption at rest, 12-hour auto-deletion, and stateless JWT authentication.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://vibewall.me/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 no-underline transition"
              >
                <span>Live App: vibewall.me</span>
                <span>↗</span>
              </a>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">v3.5 REST API</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Documentation</p>
            <ul className="space-y-1.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition">Overview</Link>
              </li>
              <li>
                <Link to="/setup" className="hover:text-white transition">Setup &amp; Docker Guide</Link>
              </li>
              <li>
                <Link to="/api" className="hover:text-white transition">REST API Endpoints</Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-white transition">Security &amp; FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Links */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-400">External Links</p>
            <ul className="space-y-1.5 text-sm text-slate-400">
              <li>
                <a
                  href="https://vibewall.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition inline-flex items-center gap-1"
                >
                  <span>Production Website</span>
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/TornovDutta/VibeWall"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1"
                >
                  <span>GitHub Repository</span>
                  <span className="text-xs">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://build.nvidia.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition inline-flex items-center gap-1"
                >
                  <span>NVIDIA NIM Portal</span>
                  <span className="text-xs">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-800/80 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} VibeWall. Designed &amp; Developed by Tornov Dutta.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-400">Spring Boot 3.5 • MongoDB Atlas • Redis • Docker</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer