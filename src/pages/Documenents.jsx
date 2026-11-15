import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const faqs = [
  {
    category: 'System Design',
    q: 'What real-world problem does VibeWall solve at a system level?',
    a: 'Traditional social platforms retain sensitive, vulnerable emotional posts indefinitely across database backups, search logs, and profiling graphs. This creates extreme exposure during data breaches or unauthorized access. VibeWall is architected around data minimization: confessions are anonymized, encrypted at rest, moderated in real time by AI, and automatically purged after 12 hours via MongoDB TTL indexes.'
  },
  {
    category: 'Feed & Dynamic Shuffling',
    q: 'How does the unified mixed feed work, and why does the sequence change on every load?',
    a: 'The VibeWall Live Wall combines three distinct content types: anonymous Confessions, interactive Opinion Polls, and community Q&As. To prevent predictable positioning, echo chambers, and biases, the client applies a Fisher-Yates (Knuth) random shuffle algorithm to the combined item stream on every page load or manual refresh. This ensures an engaging, unpredictable discovery experience every time a user visits or taps Reshuffle.'
  },
  {
    category: 'Anonymous Q&A',
    q: 'How does the Anonymous Q&A system work between users and the community?',
    a: 'Users can ask questions in two modes: (1) Community Questions open to everyone on the platform, and (2) Directed Wall Questions addressed to a specific user wall. Questions can be asked 100% anonymously or under a deterministic alias. The wall owner (or any user in the case of community questions) can reply either publicly to showcase the exchange on the Live Wall or privately for personal advice.'
  },
  {
    category: 'Anonymous Q&A',
    q: 'How do other users see questions on their dashboards and feeds?',
    a: 'Public questions are surfaced globally on the Live Wall, the dedicated Community Q&A explore page (/qa), and user dashboards under the "My Q&A" tab. Directed questions land in the targeted user\'s Pending Inbox with instant notification badges. Once answered publicly, questions become part of the randomized feed and the owner\'s public wall (/wall/:userId).'
  },
  {
    category: 'Opinion Polls',
    q: 'How do opinion polls enforce one vote per user while maintaining anonymity?',
    a: 'Polls support 2 to 6 custom options with live vote counters and dynamic percentages. When an authenticated user votes, their vote is tied to an indexed voter set in the Poll document to prevent double-voting. The voting action is recorded atomically ($inc and $addToSet in MongoDB) so individual vote choices remain decoupled from public profiles.'
  },
  {
    category: 'Opinion Polls',
    q: 'How are poll lifecycles and expirations managed?',
    a: 'Polls can be created with 24-hour, 3-day, or 7-day lifecycles. Once a poll expires or is closed by its creator, voting is locked and final percentage distributions remain viewable as an archived community poll.'
  },
  {
    category: 'Notifications',
    q: 'How does the real-time notification system alert users of activity?',
    a: 'VibeWall features a lightweight in-app notification center that alerts users when their confessions receive feedback or reactions, when incoming questions arrive in their Q&A inbox, and when their asked questions are answered. An unread counter on the navigation bar keeps users updated without noisy email spam.'
  },
  {
    category: 'Privacy',
    q: 'Why is anonymity critical for student emotional expression?',
    a: 'Anonymity eliminates fear of social judgment, peer harassment, academic profiling, and lingering digital footprints. It empowers students to seek advice and share vulnerability authentically without tying confessions to permanent public records.'
  },
  {
    category: 'Reputation & Moderation',
    q: 'How does the AI Intent Layer distinguish emotional vulnerability and venting from hate speech?',
    a: 'VibeWall uses an intent-aware moderation prompt on LLM inference pipelines. The prompt instructs the model to carefully analyze user intent: students must feel free to express sadness, heartbreak, academic burnout, loneliness, and emotional vulnerability. However, messages containing malicious intent—such as targeted insults, racial slurs, harassment, bullying, or threats directed at others—are strictly classified as UNSAFE. This ensures a compassionate, supportive atmosphere while eliminating harassment.'
  },
  {
    category: 'Reputation & Moderation',
    q: 'How does the Community Reputation Point System work, and how are points awarded or penalized?',
    a: 'Every user starts with a baseline of 100 reputation points upon registration. Whenever community members like or react positively to a user\'s confession or feedback comment, that author is rewarded with +5 reputation points. Conversely, whenever the AI Intent Layer blocks an attempt to post hateful, insulting, or abusive content, the user is penalized with an automatic deduction of -25 points. This gamifies constructive community participation.'
  },
  {
    category: 'Reputation & Moderation',
    q: 'What happens when a user\'s reputation points drop below zero, and how is the automatic ban enforced?',
    a: 'If a user repeatedly attempts to post hateful content and their reputation points drop below zero (points < 0), the ReputationService automatically marks their account as banned (banned = true), timestamps the action, records the ban reason, and logs a CRITICAL system event. Banned users are completely locked out from posting confessions, submitting comments, asking questions, and voting in polls.'
  },
  {
    category: 'Reputation & Moderation',
    q: 'Why can only an administrator unban accounts from the Admin Panel?',
    a: 'To maintain community safety and accountability, suspended accounts cannot automatically recover or regain posting privileges on their own. Only platform administrators can inspect banned accounts in the Admin Panel (/admin under "Users & Bans"), review incident logs, and perform an administrative unban. Unbanning restores the user\'s reputation to 100 points, clearing the suspension.'
  },
  {
    category: 'User Profile',
    q: 'What is the User Profile page (/profile) and how does it visualize user standing and reputation tiers?',
    a: 'The User Profile page displays the user\'s deterministic anonymous persona (e.g. @Neon Panda), masked account ID, and a live Reputation Health Gauge. The gauge maps points to four tiers: Trusted Vibester (100+ pts), Good Standing (50–99 pts), Caution: Points Low (1–49 pts), and Account Suspended (< 0 pts). Users can also review reputation guidelines, update their username or password, and manage account deletion.'
  },
  {
    category: 'Threaded Responses',
    q: 'How does the redesigned comment and reply system support community discussions and reactions?',
    a: 'Confession feedback features a modern threaded response layout with curved connector lines, unique anonymous gradient avatars for every commenter, and formatted @mention tags. Members can click "Reply" on any comment to target a specific user, use quick supportive sentiment chips (e.g. 💜 You\'re not alone, 🫂 Sending hugs), and like responses to award +5 points to the comment author.'
  },
  {
    category: 'AI Moderation',
    q: 'Why did you choose an LLM for content moderation across Confessions, Polls, and Q&A?',
    a: 'VibeWall uses an LLM inference pipeline (Meta Llama 3.1 / Qwen 2.5 via high-throughput inference APIs) to evaluate confessions, replies, poll questions, and Q&A submissions. Synchronous zero-shot and few-shot safety prompts classify input with strict binary outputs. Toxic posts, harassment, hate speech, and self-harm content are blocked before reaching the database, returning a 422 Unprocessable Entity error.'
  },
  {
    category: 'AI Moderation',
    q: 'What happens if the AI moderation service is down or unreachable?',
    a: 'The system embraces fail-safe security. If the moderation inference API fails to respond or returns an error, the backend throws an AiUnavailableException, returning HTTP 500. Unscreened or unverified content is never saved to the database in an unmoderated state.'
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
    q: 'Why is the automatic deletion TTL window set to 12 hours for confessions?',
    a: 'Twelve hours matches typical student attention spans, giving sufficient time for peers to read, empathize, and reply with feedback while drastically shrinking the attack surface. Any compromised snapshot older than 12 hours holds zero confession data.'
  },
  {
    category: 'Database',
    q: 'Why choose MongoDB Atlas over relational databases like PostgreSQL?',
    a: 'MongoDB Atlas is ideally suited for ephemeral, document-oriented confession models with embedded feedback arrays, poll option aggregates, and Q&A threads. Most importantly, MongoDB provides native background TTL indexes (@Indexed(expireAfter = "PT12H")), which eliminate the need for cron-based cleanup jobs and heavy table locks.'
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
    a: 'VibeWall enforces three distinct security scopes: Public routes (/auth/**, /feed/**, /polls, /qa, /health), Authenticated User routes (/users/**, /qa/inbox, /polls/*/vote), and Administrator routes (/admin/**). Role claims are embedded in the signed JWT and verified by JwtAuthFilter before requests reach controller methods.'
  },
  {
    category: 'Architecture',
    q: 'What role does Spring AOP play in VibeWall?',
    a: 'Spring Aspect-Oriented Programming separates cross-cutting concerns from business logic. LoggingAspect traces execution times and parameters across controllers, while ReportAspect intercepts content flagging events for moderation analytics without polluting domain services.'
  },
  {
    category: 'Admin & Diagnostics',
    q: 'How does the Admin Dashboard monitor and capture runtime errors experienced by users?',
    a: 'VibeWall incorporates an automated, two-layer error monitoring pipeline. On the backend, GenericException (@RestControllerAdvice) intercepts all 4xx, 5xx, and unhandled exceptions, automatically recording the endpoint, HTTP status code, user alias, error message, and diagnostic stack trace into MongoDB with a 7-day TTL. On the frontend, Axios interceptors detect unhandled network disconnects or 5xx responses and transmit client error telemetry to POST /api/v3/admin/logs/client. Administrators inspect this unified stream in real time with search, HTTP status code filtering, and stack trace inspection.'
  },
  {
    category: 'Admin & Diagnostics',
    q: 'How does the system detect and display AI outages, latency degradation, and fallback states?',
    a: 'The HuggingFaceAiServiceImpl monitors live health telemetry across every inference call. It records operational status (HEALTHY, DEGRADED, OFFLINE, UNCONFIGURED), tracks round-trip ping latency in milliseconds, logs provider errors, and flags whether heuristic fallback moderation is active. Administrators can view a live AI Health status banner on the overview page, inspect full diagnostics in the dedicated AI panel, and run on-demand 5-token ping tests via POST /api/v3/admin/ai-test.'
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

  const categories = [
    'All',
    'Reputation & Moderation',
    'User Profile',
    'Threaded Responses',
    'Admin & Diagnostics',
    'System Design',
    'Feed & Dynamic Shuffling',
    'Anonymous Q&A',
    'Opinion Polls',
    'Notifications',
    'AI Moderation',
    'Cryptography',
    'Data Retention',
    'Authentication',
    'Database',
    'Production'
  ]

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
          <span className="text-xs text-slate-400 font-mono">Design Decisions &amp; Engineering Principles</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          System Architecture, Q&amp;A, Polls &amp; Security FAQ
        </h1>

        <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
          Comprehensive explanations of the engineering choices behind VibeWall: unified randomized live feeds,
          anonymous Q&amp;A walls, opinion polls, real-time AI moderation, AES-256-GCM encryption, and stateless token rotation.
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
                  By unifying Confessions, Opinion Polls, and Anonymous Q&amp;A into a randomly shuffled live stream with real-time AI safety screening,
                  VibeWall offers dynamic social engagement with zero privacy leakage and minimal data retention liability.
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
