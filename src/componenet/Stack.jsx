import React from 'react'

const techLayers = [
  {
    layer: 'Language',
    tech: 'Java 17 (LTS)',
    description: 'Modern Java features, strong typing, pattern matching, and LTS production stability.',
    badge: 'Core Runtime'
  },
  {
    layer: 'Framework',
    tech: 'Spring Boot 3.5',
    description: 'Layered MVC architecture, Spring AOP logging, centralized @ControllerAdvice error handling.',
    badge: 'Application Framework'
  },
  {
    layer: 'Database',
    tech: 'MongoDB Atlas',
    description: 'NoSQL document database utilizing TTL indexes (PT12H) for automated 12-hour document eviction.',
    badge: 'Primary Persistence'
  },
  {
    layer: 'Cache',
    tech: 'Redis',
    description: 'High-speed in-memory caching for public feed endpoints, drastically reducing database load.',
    badge: 'Caching Layer'
  },
  {
    layer: 'Security',
    tech: 'Spring Security, JJWT, BCrypt',
    description: 'Stateless access tokens, 7-day rotating refresh tokens, and BCrypt salted password hashing.',
    badge: 'Auth & Authorization'
  },
  {
    layer: 'Encryption',
    tech: 'AES/GCM/NoPadding (256-bit)',
    description: 'Server-side authenticated encryption at rest for all user confessions and feedback content.',
    badge: 'Data Protection'
  },
  {
    layer: 'AI Integration',
    tech: 'NVIDIA NIM — Meta Llama 3.1 8B Instruct',
    description: 'Zero-shot content safety classifier screening posts before persistence; rejects toxic submissions with 422.',
    badge: 'Content Moderation'
  },
  {
    layer: 'API Docs',
    tech: 'SpringDoc OpenAPI 3 (Swagger UI)',
    description: 'Interactive documentation at /api/v3/swagger-ui.html and machine-readable JSON at /api/v3/api-docs.',
    badge: 'Documentation'
  },
  {
    layer: 'Containerization',
    tech: 'Docker & Docker Compose',
    description: 'Containerized multi-service deployment isolating app, Redis, and environment configs.',
    badge: 'DevOps'
  },
  {
    layer: 'Build Tool',
    tech: 'Maven 3.8+',
    description: 'Declarative dependency management, multi-phase compilation, and packaging pipeline.',
    badge: 'Build System'
  },
  {
    layer: 'Live Web App',
    tech: 'React / Vite Client',
    description: 'Live production user client deployed and active at https://vibewall.me/.',
    badge: 'Production Site'
  }
]

function Stack({ SectionHeading }) {
  return (
    <section id="stack" className="space-y-8">
      <SectionHeading
        label="TECH_STACK --verbose"
        title="Production Architecture &amp; Tech Stack"
        description="A robust, enterprise-grade technology stack chosen for security, privacy-first data handling, and high-throughput scalability."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {techLayers.map((item, idx) => (
          <div
            key={idx}
            className="card p-5 space-y-3 border-gray-800 bg-gray-950/60 hover:border-indigo-500/30 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-400 font-semibold">{item.layer}</span>
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-500/20">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-100">{item.tech}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </div>

            {item.tech.includes('vibewall.me') && (
              <a
                href="https://vibewall.me/"
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 no-underline"
              >
                <span>Visit Live Platform</span>
                <span>↗</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stack