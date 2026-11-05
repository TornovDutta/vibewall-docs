import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const setupSteps = [
  {
    title: 'Prerequisites',
    description: 'Ensure your development workstation has the following tools installed before beginning.',
    items: [
      'Java Development Kit (JDK 17 LTS or higher)',
      'Apache Maven 3.8+ for build management',
      'Docker Desktop & Docker Compose (v2+)',
      'Git command-line client',
      'NVIDIA Developer account (for free NIM API credits at build.nvidia.com)'
    ]
  },
  {
    title: 'Clone Repository & Navigate to Backend',
    description: 'Clone the VibeWall repository from GitHub and navigate into the backend module directory.',
    code: `# Clone repository
git clone https://github.com/TornovDutta/VibeWall.git

# Navigate into the backend directory
cd VibeWall/backend`
  },
  {
    title: 'Configure Environment Variables (.env)',
    description: 'Create your .env configuration by copying the template and generating cryptographically secure secrets.',
    code: `# Copy environment template
cp .env.example .env

# Generate 32-byte Base64 AES encryption key:
openssl rand -base64 32

# Generate 48-byte Base64 JWT secret:
openssl rand -base64 48`,
    envTable: [
      {
        name: 'NVDIA_API_KEY',
        desc: 'NVIDIA NIM API key (starts with nvapi-...) from build.nvidia.com',
        example: 'nvapi-xxxxxxxxxxxxxxxxxxxx'
      },
      {
        name: 'ENCRYPTION_KEY',
        desc: 'Base64-encoded 32-byte AES key for AES-256-GCM encryption at rest',
        example: 'Generated via openssl rand -base64 32'
      },
      {
        name: 'JWT_SECRET',
        desc: 'HMAC-SHA256 secret key for signing stateless access tokens (min 32 chars)',
        example: 'Generated via openssl rand -base64 48'
      },
      {
        name: 'SPRING_DATA_MONGODB_URI',
        desc: 'MongoDB Atlas connection URI with username, password, and database name',
        example: 'mongodb+srv://user:pass@cluster.mongodb.net/vibewall'
      },
      {
        name: 'SPRING_DATA_REDIS_URL',
        desc: 'Redis connection string for high-speed feed caching',
        example: 'redis://localhost:6379 or redis://redis:6379'
      },
      {
        name: 'ALLOWED_ORIGINS',
        desc: 'Comma-separated CORS allowed origins (development or production client)',
        example: 'http://localhost:5173,https://vibewall.me'
      },
      {
        name: 'SERVER_PORT',
        desc: 'Application HTTP port (defaults to 8080)',
        example: '8080'
      }
    ]
  },
  {
    title: 'Build the Spring Boot Application',
    description: 'Compile Java sources and package the production executable JAR using Maven.',
    code: `# Compile and package JAR without running integration tests
mvn clean package -DskipTests`
  },
  {
    title: 'Run with Docker Compose',
    description: 'Build container images and spin up the backend application with its supporting services.',
    code: `# Build and launch all containers in foreground
docker-compose up --build

# Or run detached in background
docker-compose up -d --build`
  },
  {
    title: 'Verify Installation & Explore Swagger',
    description: 'Verify service health and explore the interactive OpenAPI 3 / Swagger documentation.',
    code: `# Test health endpoint
curl http://localhost:8080/api/v3/health

# Expected response:
# {"status":"UP","service":"VibeWall","timestamp":"2026-..."}

# Interactive Swagger UI:
# http://localhost:8080/api/v3/swagger-ui.html

# OpenAPI JSON Specification:
# http://localhost:8080/api/v3/api-docs`
  }
]

function Setup() {
  const [activeStep, setActiveStep] = useState(0)
  const activeContent = setupSteps[activeStep]

  return (
    <main className="container-page py-10 sm:py-14 space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker text-indigo-400">Quickstart Guide</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400 font-mono">Docker &amp; Spring Boot 3.5</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          Backend Setup &amp; Deployment Guide
        </h1>
        <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
          Step-by-step instructions for running the VibeWall REST API locally with Docker Compose,
          configuring NVIDIA NIM content moderation, and setting up AES-256-GCM encryption.
        </p>
        
        <div className="flex items-center gap-4 pt-1">
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold transition-colors flex items-center gap-1"
          >
            <span>← Back to Overview</span>
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            to="/api"
            className="text-slate-300 hover:text-white text-sm font-semibold transition-colors"
          >
            Explore API Endpoints →
          </Link>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Step Navigation Sidebar */}
        <aside className="card p-4 h-fit border-gray-800 bg-gray-950/70">
          <p className="kicker text-slate-400 mb-3">Installation Steps</p>
          <ul className="space-y-1.5">
            {setupSteps.map((step, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left text-xs sm:text-sm rounded-lg px-3 py-2.5 transition flex items-start gap-2.5 ${
                    idx === activeStep
                      ? 'bg-indigo-500/20 text-white border border-indigo-500/50 font-semibold'
                      : 'text-slate-400 hover:bg-gray-800/60 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono ${
                      idx === activeStep
                        ? 'bg-indigo-500 text-white'
                        : 'border border-gray-700 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="leading-tight">{step.title}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-4 border-t border-gray-800/80">
            <a
              href="https://vibewall.me/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
            >
              <span>Visit Production App (vibewall.me)</span>
              <span>↗</span>
            </a>
          </div>
        </aside>

        {/* Step Details Content */}
        <section className="card p-6 sm:p-8 space-y-6 border-gray-800 bg-gray-950/70">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
                0{activeStep + 1}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-50">
                {activeContent.title}
              </h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {activeContent.description}
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-indigo-500/40 via-gray-800 to-transparent" />

          {/* List Format (Prerequisites) */}
          {activeContent.items && (
            <div className="space-y-3">
              <p className="text-xs font-mono uppercase tracking-wider text-indigo-400">Requirements Check</p>
              <ul className="space-y-2.5">
                {activeContent.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Snippets */}
          {activeContent.code && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Terminal / Shell</span>
                <span className="text-[11px] font-mono text-indigo-400">Bash / PowerShell</span>
              </div>
              <div className="bg-black/80 rounded-xl border border-gray-800 p-4 overflow-x-auto">
                <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                  <code>{activeContent.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Environment Variables Table */}
          {activeContent.envTable && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                Environment Variables Reference
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-900/80 text-slate-300 font-mono border-b border-gray-800">
                    <tr>
                      <th className="p-3">Variable</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Example / Generation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-slate-300 font-mono">
                    {activeContent.envTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-900/40">
                        <td className="p-3 font-semibold text-indigo-300 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="p-3 font-sans text-xs text-slate-300 min-w-[200px]">
                          {row.desc}
                        </td>
                        <td className="p-3 text-[11px] text-slate-400">
                          {row.example}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Custom Info Box for Step 3 */}
          {activeStep === 2 && (
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 space-y-1.5 text-xs text-sky-200">
              <p className="font-semibold text-sky-300">🔑 Obtaining NVIDIA NIM API Key:</p>
              <p>
                Visit <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="underline font-mono text-sky-100 hover:text-white">build.nvidia.com</a>,
                sign in, navigate to <strong>Meta Llama 3.1 8B Instruct</strong>, and generate your personal API key (starts with <code className="bg-sky-950/60 px-1 py-0.5 rounded">nvapi-</code>).
                This key powers the real-time AI moderation pipeline.
              </p>
            </div>
          )}

          {/* Custom Info Box for Step 5 */}
          {activeStep === 4 && (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-2 text-xs text-indigo-200">
              <p className="font-semibold text-indigo-300">🐳 Docker Services Containerized:</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li><strong>vibewall-backend</strong>: Spring Boot 3.5 application exposed on port 8080</li>
                <li><strong>vibewall-redis</strong>: Redis 7 caching container connected on default port 6379</li>
                <li><strong>Networks &amp; Environment</strong>: Injected from root <code className="font-mono">.env</code></li>
              </ul>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-800">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="btn-ghost px-4 py-2 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous Step
            </button>
            <span className="text-xs font-mono text-slate-500">
              Step {activeStep + 1} of {setupSteps.length}
            </span>
            <button
              onClick={() => setActiveStep(Math.min(setupSteps.length - 1, activeStep + 1))}
              disabled={activeStep === setupSteps.length - 1}
              className="btn-primary px-4 py-2 text-xs font-semibold rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next Step →
            </button>
          </div>
        </section>
      </div>

      {/* Troubleshooting Grid */}
      <section className="card p-6 sm:p-8 space-y-6 border-gray-800 bg-gray-950/70">
        <div className="space-y-1">
          <p className="kicker text-amber-400">Troubleshooting &amp; FAQs</p>
          <h3 className="text-xl font-bold text-slate-50">Common Resolution Scenarios</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 space-y-2">
            <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-amber-400 font-mono">422 Unprocessable Entity</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The NVIDIA NIM AI content moderator flagged the confession or feedback for toxic, abusive, threatening, or illegal language.
              Only clean, constructive student venting is accepted by the platform.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 space-y-2">
            <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-rose-400 font-mono">AiUnavailableException</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify your <code className="text-indigo-300">NVDIA_API_KEY</code> is correctly set in <code className="text-indigo-300">.env</code>.
              Check that your key has active credits on <code className="text-indigo-300">build.nvidia.com</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 space-y-2">
            <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-sky-400 font-mono">Decryption / Encryption Error</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure <code className="text-indigo-300">ENCRYPTION_KEY</code> is an exact 32-byte Base64 encoded string generated via
              <code className="text-indigo-300 font-mono"> openssl rand -base64 32</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 space-y-2">
            <p className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-emerald-400 font-mono">MongoDB Atlas Network Access</span>
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure your IP address is whitelisted in MongoDB Atlas Security → Network Access, or configure <code className="text-indigo-300">0.0.0.0/0</code> for cloud containers.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Setup