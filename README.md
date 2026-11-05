# VibeWall — Documentation & Architecture Portal

> Official documentation, system design specifications, and REST API reference for **[VibeWall](https://vibewall.me/)** — an anonymous confession and feedback platform designed for students.

[![Live App](https://img.shields.io/badge/Live%20Platform-vibewall.me-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://vibewall.me/)
[![Backend Repo](https://img.shields.io/badge/GitHub-VibeWall%20Repository-6366F1?style=for-the-badge&logo=github&logoColor=white)](https://github.com/TornovDutta/VibeWall)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![NVIDIA NIM](https://img.shields.io/badge/AI%20Moderation-NVIDIA%20NIM%20(Llama%203.1)-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://build.nvidia.com)

---

## 🌐 Live Platform

- **Production Client Website:** [https://vibewall.me/](https://vibewall.me/)
- **Backend API Base URL:** `http://localhost:8080/api/v3`
- **Interactive Swagger UI:** `http://localhost:8080/api/v3/swagger-ui.html`
- **OpenAPI 3 JSON Spec:** `http://localhost:8080/api/v3/api-docs`

---

## 📖 About This Documentation Site

This React & Tailwind CSS web portal provides a comprehensive guide to VibeWall's architecture, security blueprint, and REST API contracts:

- **Overview (`/`)**: Core system capabilities, problem-mitigation audit log, interactive security blueprint tabs, and full tech stack.
- **Setup Guide (`/setup`)**: Step-by-step developer guide with copyable commands, `.env` generation details (`openssl rand -base64 32/48`), and Docker Compose deployment.
- **API Reference (`/api`)**: Complete interactive catalog of all `/api/v3` endpoints, categorized by module (Authentication, Feed, Confessions, Feedback, Reports, Admin, Health) with request/response schemas.
- **Privacy & Security FAQ (`/docs`)**: In-depth explanations of application-layer AES-256-GCM encryption, deterministic IVs for DB search, NVIDIA NIM binary classification prompts, and 12-hour MongoDB TTL auto-deletion.

---

## 🛠️ Main Project Architecture Highlights

| Layer | Technology | Key Characteristic |
|---|---|---|
| **Language** | Java 17 LTS | Clean typed domain models and modern language features |
| **Framework** | Spring Boot 3.5 | Layered MVC, Spring AOP logging, `@ControllerAdvice` error handling |
| **Persistence** | MongoDB Atlas | Ephemeral documents with `@Indexed(expireAfter = "PT12H")` TTL |
| **Cache** | Redis | In-memory key-value cache accelerating `/api/v3/feed/` reads |
| **Security** | Spring Security + JJWT + BCrypt | Stateless access tokens + 7-day rotating refresh tokens |
| **Encryption** | AES/GCM/NoPadding (256-bit) | Server-side authenticated encryption at rest for confessions & feedback |
| **AI Moderation** | NVIDIA NIM (Meta Llama 3.1 8B Instruct) | Synchronous zero-shot safety classifier; rejects toxic input with `422` |
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
