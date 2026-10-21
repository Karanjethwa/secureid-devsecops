# SecureID — College Lab Viva & Presentation Guide

## Project: Secure Digital Identity Management System (SDIMS)
- **Course:** DevSecOps Lab (CIAP Microproject)
- **Institution:** Shah & Anchor Kutchhi Engineering College (Academic Year 2026–27)
- **UN SDG Alignment:** SDG 9 — Industry, Innovation and Infrastructure

---

## 1. 3–5 Minute Demonstration Walkthrough Script

### Step 1: Landing Page & SDG 9 Overview (0:00 – 1:00)
- Open the application at `http://localhost:3000`.
- Highlight the **SDG 9 Alignment**: *"Our project implements secure, resilient digital infrastructure by integrating automated DevSecOps security controls into digital identity management."*
- Show the 5-layer architecture diagram: Client -> Frontend (React) -> Gateway/API (Express) -> Auth & RBAC -> SQLite Database.

### Step 2: User Registration & Password Hashing (1:00 – 1:45)
- Click **Get Started** (`/register`).
- Explain that inputs are sanitized and validated against regex patterns on both client and server.
- Mention: *"Passwords are cryptographically hashed using **bcrypt** with a work factor of 10. Plaintext passwords or session secrets are never stored in the database or client localStorage."*
- Demonstrate login via **Student Quick-Fill** (`user_demo` / `DemoUser123!`).

### Step 3: User Dashboard & Digital Identity Token (1:45 – 2:30)
- Point out the **SDI Identity Token** (`SDI-000002`) and the **HTTP-Only Cookie Authenticated** status chip.
- Point out the live clock and audited login counters (Total, Successful, Failed).
- Navigate to **Digital Identity** (`/profile`) and show the permitted profile update modal. Explain: *"We maintain clear academic transparency: this is a local simulated credential and does not claim integration with sovereign government systems."*

### Step 4: Login Activity & Threat Simulation (2:30 – 3:30)
- Navigate to **Login Activity** (`/activity`):
  - Show the table recording timestamps, client IP addresses, user-agent fingerprints, status, and risk ratings.
  - Explain the DevSecOps principle: *"IP addresses are captured at the server proxy boundary for threshold analysis and rate limiting, but do not prove personal identity."*
- Navigate to **Security Center** (`/security`):
  - Click **"Simulate Suspicious Attack"**.
  - Show how the system immediately flags anomalous velocity, logs a failed attempt from an untrusted IP, and issues a live Security Alert.
- Navigate to **AI Analyzer** (`/analyzer`):
  - Show the dynamic risk score calculation (0–100) and actionable hardening guidance.

### Step 5: Administrator Governance & RBAC (3:30 – 4:15)
- Log out and log in as **Administrator** (`admin_demo` / `DemoAdmin123!`).
- Navigate to **Admin Dashboard** (`/admin`) and **User Management** (`/admin/users`):
  - Demonstrate server-side RBAC: Standard users attempting to access `/api/admin/*` receive an HTTP 403 Forbidden.
  - Toggle a user account between `Active` and `Suspended`.
  - Show that every administrative modification creates an immutable entry in the **Administrative Audit Log**.

### Step 6: DevSecOps CI/CD, Trivy & SonarQube Evidence (4:15 – 5:00)
- Navigate to **DevSecOps Pipeline** (`/pipeline`):
  - Walk through the 9 stages: Checkout -> Dependency Audit -> Vitest Tests -> SonarQube SAST -> Multi-stage Docker Build -> Trivy Image Scan -> ECR -> EC2 Deploy -> Health Check.
- Show **Vulnerability Report** (`/vulnerability-report`) and **System Testing** (`/testing`):
  - Show 8 passing automated unit/integration tests and zero critical CVE findings in the Trivy scan.

---

## 2. Anticipated Viva / Examiner Questions & Answers

### Q1: Why did you use HTTP-Only Cookies instead of storing JWT in `localStorage`?
> **Answer:** `localStorage` is accessible to any JavaScript running in the browser context. If an attacker injects a malicious script via Cross-Site Scripting (XSS), they can immediately exfiltrate the JWT. By setting the `HttpOnly` and `SameSite` flags on session cookies, the browser ensures JavaScript cannot read the token, mitigating token theft attacks.

### Q2: What is the difference between SAST (SonarQube) and Container Scanning (Trivy)?
> **Answer:**
> - **SAST (SonarQube):** Analyzes the raw source code (TypeScript/JavaScript) before compilation to detect logic flaws, code smells, insecure algorithms, and OWASP vulnerabilities like SQL injection or hardcoded secrets.
> - **Container Scanning (Trivy):** Scans the packaged artifact (Docker image) including the base OS (Alpine Linux binaries) and third-party npm package dependencies to detect published CVEs in the National Vulnerability Database.

### Q3: How does your application protect against SQL Injection?
> **Answer:** We use strictly parameterized prepared statements (query bindings) in `backend/src/models/database.ts`. User inputs are bound to placeholders (`?`) separately from the SQL command structure, ensuring the SQLite engine parses input strictly as data values, preventing SQL syntax manipulation.

### Q4: Why did you choose a multi-stage Docker build?
> **Answer:** Multi-stage builds separate the build environment from the runtime environment. Development tools, TypeScript compilers, test frameworks, and type definitions are discarded after build time. The final runner container uses lightweight `node:20-alpine` running as a non-root user (`USER node`), minimizing image size (< 180MB) and slashing the vulnerability attack surface.

### Q5: How is SDG 9 incorporated into this project?
> **Answer:** SDG 9 focuses on Industry, Innovation, and Infrastructure. In the modern digital era, identity systems represent critical public infrastructure. By infusing DevSecOps automation, zero-trust RBAC, and transparent vulnerability gating, we make digital identity services reliable, resilient, and accessible.
