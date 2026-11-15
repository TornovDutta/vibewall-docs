# VibeWall — Documentation & Architecture Portal

> Official documentation, system design specifications, and REST API reference for **[VibeWall](https://vibewall.me/)** — an anonymous confession, opinion poll, and Q&A platform designed for students.

[![Live App](https://img.shields.io/badge/Live%20Platform-vibewall.me-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://vibewall.me/)
[![Backend Repo](https://img.shields.io/badge/GitHub-VibeWall%20Repository-6366F1?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TornovDutta/VibeWall)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![AI Moderation](https://img.shields.io/badge/AI%20Moderation-Llama%203.1%20%2F%20Qwen%202.5-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://build.nvidia.com)

---

## 🌐 Live Platform & Endpoints

- **Production Client Website:** [https://vibewall.me/](https://vibewall.me/)
- **Backend API Base URL:** `http://localhost:8080/api/v3`
- **Interactive Swagger UI:** `http://localhost:8080/api/v3/swagger-ui.html`
- **OpenAPI 3 JSON Spec:** `http://localhost:8080/api/v3/api-docs`

---

## 📖 About This Documentation Site

This React & Tailwind CSS web portal provides a comprehensive guide to VibeWall's architecture, security blueprint, and REST API contracts:

- **Overview (`/`)**: Core system capabilities, problem-mitigation audit log, interactive security blueprint tabs, and full tech stack. Includes coverage of Anonymous Confessions, Interactive Opinion Polls, Anonymous Q&A Walls, Community Reputation Point System, and the Unified Randomized Live Wall.
- **Setup Guide (`/setup`)**: Step-by-step developer guide with copyable commands, `.env` generation details (`openssl rand -base64 32/48`), and Docker Compose deployment.
- **API Reference (`/api`)**: Complete interactive catalog of all `/api/v3` endpoints, categorized by module:
  - **Authentication** (`/auth/**`)
  - **Live Wall & Feed** (`/feed/**`)
  - **Interactive Opinion Polls** (`/polls/**`)
  - **Anonymous Q&A** (`/qa/**`)
  - **Notifications** (`/notifications/**`)
  - **User Profile & Standing** (`/users/me`)
  - **Confessions** (`/users/confession/**`)
  - **Threaded Comments & Likes** (`/users/feedback/**`, `/feedback/**`)
  - **Vibe Reactions** (`/vibes/**`)
  - **Reports & Admin Governance** (`/reports/**`, `/admin/**`, `/admin/users/**`)
  - **Health & Diagnostics** (`/admin/logs/**`, `/admin/ai-status`, `/health`)
- **Architecture, Reputation & Security FAQ (`/docs`)**: In-depth explanations of AI intent moderation (protecting emotional vulnerability while blocking hate speech), the community reputation point system (+5 / -25 pts, auto-ban at < 0), application-layer AES-256-GCM encryption, deterministic IVs for DB search, 12-hour MongoDB TTL auto-deletion, and dynamic Fisher-Yates feed shuffling.

---

## 🛠️ Main Project Architecture Highlights

| Layer | Technology | Key Characteristic |
|---|---|---|
| **Language** | Java 17 LTS | Clean typed domain models and modern language features |
| **Framework** | Spring Boot 3.5 | Layered MVC, Spring AOP logging, `@ControllerAdvice` error handling |
| **Persistence** | MongoDB Atlas | Ephemeral documents with `@Indexed(expireAfter = "PT12H")` TTL and atomic voting sets |
| **Cache** | Redis | In-memory key-value cache accelerating `/api/v3/feed/` reads |
| **Security** | Spring Security + JJWT + BCrypt | Stateless access tokens + 7-day rotating refresh tokens |
| **Encryption** | AES/GCM/NoPadding (256-bit) | Server-side authenticated encryption at rest for confessions & feedback |
| **AI Moderation** | LLM Inference Pipeline (Meta Llama 3.1 / Qwen 2.5) | Synchronous safety classifier; rejects toxic input with `422 Unprocessable Entity` |
| **Interactive Polls** | Spring MVC + MongoDB atomic updates | Dynamic option voting with live percentage calculation and duplicate prevention |
| **Anonymous Q&A** | Spring MVC + WebSocket / Notification hooks | Ask community or specific wall owners; public and private response visibility |
| **Randomized Feed** | Fisher-Yates (Knuth) Shuffle Client Engine | Combines confessions, polls, and Q&A into an unpredictable discovery stream on every load |
| **API Docs** | SpringDoc OpenAPI 3 | Swagger UI documentation available at `/api/v3/swagger-ui.html` |
| **DevOps** | Docker & Docker Compose | Multi-container orchestration linking backend, Redis, and configs |

---

## 🚀 Running This Documentation Project Locally

### Prerequisites
- Node.js 18+
- npm 9+

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm start
# Opens at http://localhost:3000

# 3. Create production build
npm run build
```

---

## 👨‍💻 Author

Designed and developed by **Tornov Dutta**.  
Repository: [https://github.com/TornovDutta/VibeWall](https://github.com/TornovDutta/VibeWall)  
Live Platform: [https://vibewall.me/](https://vibewall.me/)
