# SecureID System Architecture Documentation

## 1. Architectural Principles
SecureID is engineered following defense-in-depth and least-privilege paradigms:

```
[ Client Browser ]
        │
        ▼ (HTTPS / Cookies: HttpOnly, SameSite=Lax)
[ Helmet Security Gateway & Rate Limiter ]
        │
        ▼
[ Express API Router & Controllers ]
   ├── Authentication Controller (bcrypt, JWT)
   ├── User Controller (SDI Profile Management)
   ├── Activity Controller (Audit Trail)
   ├── Security Controller (Threat Analyzer)
   └── Admin Controller (RBAC Enforced)
        │
        ▼ (Parameterized Prepared Statements)
[ SQLite Database (sql.js WASM) / PostgreSQL ]
```

## 2. Security Controls Matrix

| Attack Vector | Defense Mechanism | File Location |
| :--- | :--- | :--- |
| **SQL Injection (SQLi)** | Parameterized SQLite queries (`?` bindings) | `backend/src/models/database.ts` |
| **Cross-Site Scripting (XSS)** | `HttpOnly` SameSite cookie storage; CSP headers | `backend/src/utils/token.ts`, `backend/src/app.ts` |
| **Brute Force Attacks** | Express Rate Limiter (10 attempts / 15 minutes) | `backend/src/middleware/rateLimiter.ts` |
| **Broken Access Control (BAC)** | Server-side role check (`requireAdmin`) middleware | `backend/src/middleware/authMiddleware.ts` |
| **Credential Theft** | Bcrypt password hashing (Cost factor 10) | `backend/src/utils/hash.ts` |
| **Privilege Escalation** | Docker non-root user (`USER node`) | `Dockerfile` |
| **Supply Chain Risks** | Trivy vulnerability scan & `package-lock.json` | `Jenkinsfile`, `reports/trivy-image-report.md` |
| **Secrets Exposure** | `.gitignore`, `.env.example`, no tokens in client storage | `.gitignore`, `backend/src/config/index.ts` |
