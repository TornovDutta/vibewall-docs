import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    category: 'System Design',
    q: 'What real-world problem does VibeWall solve at a system level?',
    a: 'Traditional social platforms retain sensitive, vulnerable emotional posts indefinitely across database backups, search logs, and profiling graphs. This creates extreme exposure during data breaches or unauthorized access. VibeWall is architected around data minimization: confessions are anonymized, encrypted at rest, moderated in real time by AI, and automatically purged after 12 hours via MongoDB TTL indexes.'
  },
  {
    category: 'Privacy',
    q: 'Why is anonymity critical for student emotional expression?',
    a: 'Anonymity eliminates fear of social judgment, peer harassment, academic profiling, and lingering digital footprints. It empowers students to seek advice and share vulnerability authentically without tying confessions to permanent public records.'
  },
  {
    category: 'AI Moderation',
    q: 'Why did you choose NVIDIA NIM with Meta Llama 3.1 8B Instruct?',
    a: 'NVIDIA NIM provides ultra-low-latency containerized inference for Meta Llama 3.1 8B Instruct. It processes each submission in real time using a specialized few-shot prompt that classifies content with a strict binary response (1 for block, 0 for allow). Toxic posts, threats, hate speech, and harassment are stopped before they ever hit the database, returning a 422 Unprocessable Entity error.'
  },
  {
    category: 'AI Moderation',
    q: 'What happens if the AI moderation service is down or unreachable?',
    a: 'The system embraces fail-safe security. If the NVIDIA NIM API returns an error or fails to respond, the backend throws an AiUnavailableException, returning HTTP 500. Unverified content is never saved to the database in a compromised state.'
  },
  {
    category: 'Cryptography',
    q: 'Why server-side AES-256-GCM encryption instead of relying solely on HTTPS?',
    a: 'HTTPS protects data strictly in flight between client and server. If an attacker gains read access to the database, backups, or disk volumes, HTTPS provides zero defense. VibeWall implements server-side AES/GCM/NoPadding (256-bit) authenticated encryption at rest, guaranteeing that stored confessions and feedback are ciphertext gibberish without the application secret key.'
  },
  {
    category: 'Cryptography',
    q: 'Why application-layer encryption instead of transparent database-level encryption (TDE)?',
    a: 'TDE only protects physical storage media when powered off. Application-layer encryption ensures plaintext never enters the database memory, query logs, or replication streams, neutralizing insider threats and rogue database administrators.'
  },
  {
    category: 'Cryptography',
    q: 'Why use a deterministic IV for AES-256-GCM encryption in VibeWall?',
    a: 'In VibeWall, the IV is deterministically derived from a SHA-256 digest of the content. This enables identical plaintext strings to produce identical ciphertext blocks, allowing fast indexed searches and lookups in MongoDB without compromising the authenticated integrity of GCM mode.'
  },
  {
    category: 'Data Retention',
    q: 'Why is the automatic deletion TTL window set to 12 hours?',
    a: 'Twelve hours matches typical student attention spans, giving sufficient time for peers to read, empathize, and reply with feedback while drastically shrinking the attack surface. Any compromised snapshot older than 12 hours holds zero confession data.'
  },
  {
    category: 'Database',
    q: 'Why choose MongoDB Atlas over relational databases like PostgreSQL?',
    a: 'MongoDB Atlas is ideally suited for ephemeral, document-oriented confession models with embedded feedback arrays. Most importantly, MongoDB provides native background TTL indexes (@Indexed(expireAfter = "PT12H")), which eliminate the need for cron-based cleanup jobs and heavy table locks.'
  },
  {
    category: 'Caching',
    q: 'Why cache confessions in Redis if the data is sensitive?',
    a: 'The public feed (/api/v3/feed/) experiences high concurrent read volume. Redis caches the prepared response list in memory, delivering sub-millisecond latency. Cached entries inherit the same ephemeral lifecycle as database records and are invalidated upon new submissions.'
  },
  {
    category: 'Authentication',
    q: 'How does the two-token JWT authentication and rotation flow work?',
    a: 'VibeWall uses a short-lived 1-hour JWT access token for API requests and a 7-day UUID refresh token stored in MongoDB. When /auth/refresh is invoked, the backend revokes the existing refresh token and generates a brand-new pair. This single-active-session policy thwarts token theft and replay attacks.'
  },
  {
    category: 'Access Control',
    q: 'How is Role-Based Access Control (RBAC) enforced in Spring Security?',
    a: 'VibeWall enforces three distinct security scopes: Public routes (/auth/**, /feed/**, /health), Authenticated User routes (/users/**), and Administrator routes (/admin/**). Role claims are embedded in the signed JWT and verified by JwtAuthFilter before requests reach controller methods.'
  },
  {
    category: 'Architecture',
    q: 'What role does Spring AOP play in VibeWall?',
    a: 'Spring Aspect-Oriented Programming separates cross-cutting concerns from business logic. LoggingAspect traces execution times and parameters across controllers, while ReportAspect intercepts content flagging events for moderation analytics without polluting domain services.'
  },
  {
    category: 'Deployment',
    q: 'How does Docker Compose simplify local development and production deployment?',
    a: 'Docker Compose orchestrates the Spring Boot 3.5 application container and the Redis container within an isolated network. Environment variables from .env configure database URIs, API keys, and CORS settings without modifying source code.'
  },
  {
    category: 'Production',
    q: 'Where can I try the live application and view the source code?',
    a: 'The production client application is deployed and accessible at https://vibewall.me/. The complete backend source code, OpenAPI specs, and deployment manifests are publicly maintained on GitHub at https://github.com/TornovDutta/VibeWall.'
  }
]

function Documents() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')

  const categories = ['All', 'System Design', 'AI Moderation', 'Cryptography', 'Data Retention', 'Authentication', 'Database', 'Production']

  const filteredFaqs = faqs.filter((item) => {
    const matchCat = selectedCat === 'All' || item.category === selectedCat
    const matchSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const active = filteredFaqs[activeIndex] || filteredFaqs[0] || faqs[0]

  return (
    <main className="container-page py-10 sm:py-14 space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker text-indigo-400">Architecture FAQ</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400 font-mono">Design Decisions &amp; Security Principles</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          Privacy, Cryptography &amp; Moderation FAQ
        </h1>

        <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
          Comprehensive explanations of the engineering choices behind VibeWall: application-layer AES-256-GCM encryption,
          real-time NVIDIA NIM AI moderation, MongoDB TTL indexes, and stateless JWT token rotation.
        </p>

        <div className="flex items-center gap-4 pt-1">
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors"
          >
            ← Back to Overview
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            to="/api"
            className="text-slate-300 hover:text-white text-sm font-semibold transition-colors"
          >
            Explore API Docs →
          </Link>
        </div>
      </header>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCat(cat)
                setActiveIndex(0)
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedCat === cat
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'bg-gray-900/60 text-slate-400 hover:bg-gray-800 hover:text-slate-200 border border-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setActiveIndex(0)
            }}
            className="w-full rounded-lg border border-gray-800 bg-gray-950/80 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-6">
        {/* Sidebar Questions */}
        <aside className="card p-3 h-[75vh] overflow-y-auto border-gray-800 bg-gray-950/70">
          <p className="kicker text-slate-400 px-2 py-1 mb-2">
            Questions ({filteredFaqs.length})
          </p>
          <ul className="space-y-1">
            {filteredFaqs.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left text-xs sm:text-sm rounded-lg px-3 py-2.5 transition flex flex-col gap-1 ${
                    idx === activeIndex
                      ? 'bg-indigo-500/20 text-white border border-indigo-500/50 font-semibold'
                      : 'text-slate-400 hover:bg-gray-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono text-indigo-400">
                    {item.category}
                  </span>
                  <span className="line-clamp-2 leading-snug">
                    {item.q}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Question & Answer Content */}
        <section className="card p-6 sm:p-8 space-y-6 border-gray-800 bg-gray-950/70">
          {active ? (
            <>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-mono font-semibold text-indigo-300">
                  {active.category}
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-50 leading-snug">
                  {active.q}
                </h2>
              </div>

              <div className="h-px bg-gradient-to-r from-indigo-500/40 via-gray-800 to-transparent" />

              <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
                <p>{active.a}</p>
              </div>

              {/* Callout box */}
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 space-y-2 mt-6">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Key Architectural Takeaway</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  By pairing real-time NVIDIA NIM AI moderation with application-layer AES-256-GCM encryption and 12-hour automated eviction,
                  VibeWall reduces privacy liability and data breach impact to the mathematical minimum.
                </p>
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-sm">No matching questions found.</p>
          )}
        </section>
      </div>
    </main>
  )
}

export default Documents