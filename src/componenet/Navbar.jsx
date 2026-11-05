import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Setup Guide', path: '/setup' },
    { label: 'API Reference', path: '/api' },
    { label: 'Architecture & FAQ', path: '/docs' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800/80 bg-black/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 font-bold text-white shadow-lg shadow-indigo-500/25 transition group-hover:scale-105">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-100 group-hover:text-white transition">
                VibeWall
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                Docs &amp; Architecture
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            v3.5 Production
          </span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition no-underline ${
                isActive(link.path)
                  ? 'bg-indigo-500/20 text-white border border-indigo-500/40'
                  : 'text-slate-300 hover:bg-gray-800/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href="https://vibewall.me/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 hover:text-white hover:border-emerald-400 transition no-underline shadow-sm"
          >
            <span>Live App</span>
            <span className="text-[10px]">↗</span>
          </a>

          <a
            href="https://github.com/TornovDutta/VibeWall"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700/70 bg-gray-900/60 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-gray-800 hover:text-white hover:border-gray-600 transition no-underline"
          >
            <svg
              className="h-4 w-4 fill-current text-slate-300"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-slate-300 md:hidden hover:bg-gray-800"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-800 bg-gray-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition no-underline ${
                  isActive(link.path)
                    ? 'bg-indigo-500/20 text-white border border-indigo-500/40'
                    : 'text-slate-300 hover:bg-gray-800/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-gray-800/80 pt-3">
              <a
                href="https://vibewall.me/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25 no-underline"
              >
                <span>Visit Live App (vibewall.me)</span>
                <span>↗</span>
              </a>

              <a
                href="https://github.com/TornovDutta/VibeWall"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-700/70 bg-gray-900/60 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-gray-800 no-underline"
              >
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar