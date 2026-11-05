import React from 'react'
import Hero from '../componenet/Hero'
import Problem from '../componenet/Problem'
import Features from '../componenet/Features'
import Security from '../componenet/Security'
import Stack from '../componenet/Stack'
import { Link } from 'react-router-dom'

const problems = [
  {
    level: 'CRITICAL',
    text: 'Toxic harassment, hate speech, threats, and bullying without automated moderation',
    mitigation: 'NVIDIA NIM Meta Llama 3.1 8B Instruct screens every confession & feedback synchronously; rejects unsafe submissions with 422 Unprocessable Entity.'
  },
  {
    level: 'HIGH',
    text: 'Sensitive student emotional confessions stored indefinitely in databases and backup snapshots',
    mitigation: 'MongoDB Atlas native TTL indexing (PT12H) automatically purges documents 12 hours after creation.'
  },
  {
    level: 'WARNING',
    text: 'Plaintext data at rest exposed to database dumps, credential theft, and unauthorized operators',
    mitigation: 'Server-side AES-256-GCM authenticated encryption with deterministic SHA-256 derived IVs for encrypted lookups.'
  },
  {
    level: 'INFO',
    text: 'Identity leaks and session hijacking risks in anonymous sharing environments',
    mitigation: 'Stateless 1-hour JWT access tokens paired with 7-day single-active rotating refresh tokens and BCrypt password hashing.'
  }
]

const features = [
  {
    title: 'Anonymous Posting',
    details: 'Students post confessions and thoughts without exposing real-world identity, profile linkages, or personal trackers.',
    badge: 'PRIVACY FIRST',
    tag: 'ACTIVE',
    highlight: 'Zero Identity Leakage'
  },
  {
    title: 'AI Content Moderation',
    details: 'Every submission is screened in real time by Meta Llama 3.1 8B Instruct via NVIDIA NIM. Unsafe content is blocked immediately.',
    badge: 'SAFETY ENGINE',
    tag: 'NVIDIA NIM',
    highlight: '422 Unprocessable Entity'
  },
  {
    title: 'Stateless JWT & Refresh Rotation',
    details: 'Two-token strategy: short-lived 1-hour JWT for API requests + 7-day rotating refresh token. Re-issuance invalidates older tokens.',
    badge: 'SECURITY',
    tag: 'SPRING SECURITY',
    highlight: 'HMAC-SHA256 & BCrypt'
  },
  {
    title: 'AES-256-GCM Encryption',
    details: 'All text content is encrypted at the application layer with AES/GCM/NoPadding before persistence to MongoDB.',
    badge: 'CRYPTOGRAPHY',
    tag: 'AES-GCM',
    highlight: '256-Bit Authenticated'
  },
  {
    title: 'Sub-Millisecond Redis Caching',
    details: 'Public feed endpoints are cached in Redis, providing blistering fast read throughput while shielding MongoDB.',
    badge: 'PERFORMANCE',
    tag: 'REDIS',
    highlight: 'High Throughput'
  },
  {
    title: 'Role-Based Access Control (RBAC)',
    details: 'Three clear permission boundaries: Public (/auth/**, /feed/**), Authenticated User (/users/**), and Administrator (/admin/**).',
    badge: 'GOVERNANCE',
    tag: 'RBAC',
    highlight: 'Least Privilege'
  },
  {
    title: '12-Hour Auto-Deletion (TTL)',
    details: 'Confessions and their feedback automatically vanish after 12 hours via MongoDB native TTL index (PT12H).',
    badge: 'DATA MINIMIZATION',
    tag: 'MONGODB ATLAS',
    highlight: 'Automatic Expiration'
  },
  {
    title: 'Community Reporting System',
    details: 'Users can flag abusive confessions, feeding into an administrative audit log for human-in-the-loop review.',
    badge: 'COMMUNITY',
    tag: 'REPORTING',
    highlight: 'Human-in-the-Loop'
  },
  {
    title: 'Admin Management Dashboard API',
    details: 'Dedicated admin routes for managing users, inspecting pending reports, and marking flags APPROVED or REJECTED.',
    badge: 'OPERATIONS',
    tag: 'ADMIN API',
    highlight: 'Full Lifecycle Ops'
  },
  {
    title: 'Confession Feedback System',
    details: 'Students can post supportive feedback directly to confessions, protected by the same AI moderation filter and encryption.',
    badge: 'COMMUNITY',
    tag: 'FEEDBACK',
    highlight: 'Encrypted & Moderated'
  },
  {
    title: 'Spring AOP Logging & Aspects',
    details: 'Cross-cutting concerns like audit logging and report interception are handled cleanly via Spring Aspect-Oriented Programming.',
    badge: 'OBSERVABILITY',
    tag: 'SPRING AOP',
    highlight: 'Clean Architecture'
  },
  {
    title: 'Dockerized Microservice',
    details: 'Containerized with Docker & Docker Compose for reproducible local testing and resilient production deployment.',
    badge: 'DEVOPS',
    tag: 'DOCKER',
    highlight: 'Docker Compose Ready'
  }
]

function SectionHeading({ label, title, description }) {
  return (
    <div className="space-y-3 text-center max-w-3xl mx-auto">
      {label && <p className="kicker text-indigo-400">{label}</p>}
      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      )}
    </div>
  )
}

function Landing() {
  return (
    <main className="relative container-page space-y-24 py-10 sm:py-14">
      {/* Hero */}
      <Hero />

      {/* Live Deployment Banner */}
      <section className="relative overflow-hidden card p-6 sm:p-8 border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-gray-900/60 to-gray-900/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                Production Web App Live
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-50">
              Experience VibeWall in Production: vibewall.me
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              The full client interface connected to this Spring Boot backend is live and actively serving student confessions.
              Test real-time posting, feed browsing, and feedback directly in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://vibewall.me/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition no-underline"
            >
              <span>Open vibewall.me</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Problems & Mitigations */}
      <Problem
        problems={problems}
        SectionHeading={SectionHeading}
      />

      {/* Features */}
      <Features
        features={features}
        SectionHeading={SectionHeading}
      />

      {/* Security Architecture Blueprint */}
      <Security
        SectionHeading={SectionHeading}
      />

      {/* Stack */}
      <Stack
        SectionHeading={SectionHeading}
      />

      {/* Interactive Swagger / API Docs Banner */}
      <section className="relative overflow-hidden card p-6 sm:p-10 border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-gray-900/60 to-gray-900/40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.20),_transparent_55%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <p className="kicker text-indigo-400">OpenAPI 3 / Swagger Documentation</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-50">
              Interactive API Reference &amp; Specifications
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              Explore all REST routes mounted under <code className="text-indigo-300 font-mono">/api/v3</code>.
              Complete with request schemas, JWT Bearer authentication headers, and Swagger UI integration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/api"
              className="btn-primary px-5 py-3 rounded-xl no-underline"
            >
              Browse Endpoints →
            </Link>
            <Link
              to="/setup"
              className="btn-ghost px-5 py-3 rounded-xl text-sm font-semibold no-underline"
            >
              Setup Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Docs FAQ Banner */}
      <section className="relative overflow-hidden card p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_55%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3 max-w-2xl">
            <p className="kicker text-sky-400">System Design &amp; Architecture</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-50">
              Privacy, Moderation &amp; Encryption FAQ
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              Deep dive into why AES-GCM deterministic IVs were selected, how the NVIDIA NIM moderation filter operates,
              and why MongoDB TTL indexes enforce privacy by default.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/docs"
              className="btn-primary px-5 py-3 rounded-xl no-underline"
            >
              Read Architecture FAQ →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Landing