# SecureID — Secure Digital Identity Management System (SDIMS)

[![DevSecOps Lab](https://img.shields.io/badge/Course-DevSecOps%20Lab-blue.svg)](https://github.com)
[![CIAP Microproject](https://img.shields.io/badge/Project-CIAP%20Microproject-emerald.svg)](https://github.com)
[![SDG 9](https://img.shields.io/badge/UN%20SDG-09%20Industry%2C%20Innovation%20%26%20Infrastructure-cyan.svg)](https://sdgs.un.org/goals/goal9)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Security Gates](https://img.shields.io/badge/Security%20Gates-SonarQube%20%7C%20Trivy-orange.svg)](reports/trivy-image-report.md)

> **Academic Affiliation:**  
> Department of Information Technology & Cybersecurity  
> **Shah & Anchor Kutchhi Engineering College** · Academic Year 2026–2027  
> Course: **DevSecOps Lab (CIAP Microproject)**

---

## 1. Project Overview & SDG 9 Alignment

**SecureID** is a full-stack, secure digital identity management web application engineered for college DevSecOps laboratory demonstrations and faculty evaluations. It replaces insecure prototype mocks with an enterprise-grade defense-in-depth architecture.

### UN Sustainable Development Goal (SDG 9) Alignment
- **Target 9.1 & 9.c:** Develop resilient, sustainable digital public infrastructure and universal, affordable internet access protected by cryptographically verifiable identity credentials.
- **Microproject Contribution:** Demonstrates how "Shift-Left" DevSecOps engineering—including container vulnerability scanning, static code analysis (SAST), and least-privilege role-based access control (RBAC)—safeguards critical digital identity services against modern cyber threats.

---

## 2. Architecture & Technology Stack

| Layer | Technology | Primary Security Functions |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite, TypeScript | Least-privilege UI states, zero plaintext credentials in client storage, responsive dark cybersecurity theme |
| **Backend API** | Node.js, Express, TypeScript | REST endpoints, input sanitization, rate limiting, centralized error handling |
| **Authentication** | Bcryptjs, JsonWebToken | 10-round salted password hashing, HTTP-Only SameSite session cookies |
| **Database** | SQLite via `sql.js` (Zero C++ dependency) | Strictly parameterized SQL queries (eliminates SQLi), auto-seeding demo data |
| **Containerization**| Docker (Multi-stage build) | Minimal `node:20-alpine` base image, execution as non-root user (`USER node`) |
| **Container Scan** | Aqua Security Trivy | Pre-publication vulnerability scan detecting Critical/High OS & package CVEs |
| **Code SAST** | SonarQube & SonarScanner | Automated quality gates, OWASP Top 10 rule checks, code coverage reporting |
| **CI/CD Pipeline** | Jenkins Declarative Pipeline | 9-stage automated delivery pipeline with credential management & quality gates |
| **Cloud IaC** | Terraform (AWS EC2 + ECR) | Declarative provisioning of AWS container registry, VPC security groups, and EC2 |

---

## 3. Demo Credentials (Ready to Test)

The database automatically seeds these pre-configured demonstration accounts on startup:

| Account Role | Username | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin_demo` | `admin@demo.local` | `DemoAdmin123!` | System statistics, directory audit, account suspension/activation, audit logs |
| **Student / User** | `user_demo` | `user@demo.local` | `DemoUser123!` | Profile inspection, permitted field edits, login history audit, threat simulation |
| **Student (Extra)**| `aarav_demo` | `aarav@example.demo`| `StudentAarav!26` | Active student identity record |
| **Suspended Demo**| `meera_demo` | `meera@example.demo`| `StudentMeera!26` | Demonstrates login rejection on locked/suspended accounts |

---

## 4. Quick Start & Local Execution

### Prerequisites
- **Node.js** >= v20.0.0
- **npm** >= 10.0.0
- **Docker** & **Docker Compose** (Optional, for containerized run)

### Method A: Native Local Development (Zero Native C++ Compilers Required)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/secureid-devsecops.git
cd secureid-devsecops

# 2. Install all dependencies across root, backend, and frontend
npm run install:all

# 3. Start both backend (Port 5000) and frontend (Port 3000) concurrently
npm run dev
```

Open your browser at **`http://localhost:3000`**.

---

### Method B: Single-Command Docker Compose

```bash
# Build and launch the containerized application
docker compose up --build -d

# Check running status and health check
docker compose ps
docker compose logs -f
```

Access the application at **`http://localhost:3000`** (or container port `5000`).

---

## 5. Automated Testing Suite

SecureID comes with an automated unit and integration test suite asserting authentication mechanics, password hashing security, session cookies, input validation, and RBAC authorization boundaries:

```bash
# Run automated tests
npm test

# Run tests with code coverage report
npm run test:coverage
```

### Verified Test Cases:
- `TC-01`: User Registration & Input Validation (Duplicate email rejection, password confirmation)
- `TC-02`: Bcrypt Cryptographic Hashing (10 rounds, zero plaintext leakage)
- `TC-03`: HTTP-Only Cookie Session Security (Flags `HttpOnly=true`, `SameSite=lax`)
- `TC-04`: Server-Side RBAC Enforcement (Standard users receive 403 Forbidden on admin endpoints)
- `TC-05`: SQL Injection Defense (Parameterized query bindings neutralize `' OR 1=1 --`)
- `TC-06`: Express Rate Limiting (Throttles repeated attempts to prevent brute-force attacks)
- `TC-07`: Administrative Audit Trail (Account status toggles generate immutable audit logs)
- `TC-08`: Health Telemetry (`GET /api/health` responds HTTP 200 `UP`)

---

## 6. DevSecOps CI/CD Pipeline (Jenkins)

The included [`Jenkinsfile`](./Jenkinsfile) implements an end-to-end 9-stage pipeline:

1. **Source Checkout:** Clones code from GitHub with immutable commit SHA tagging.
2. **Clean Dependency Installation:** `npm ci` ensuring exact lockfile reproducibility.
3. **Automated Testing:** Vitest execution producing JUnit XML and LCOV coverage.
4. **SonarQube SAST:** Analyzes static security risks, OWASP Top 10 vulnerabilities, and code quality.
5. **Quality Gate Evaluation:** Halts the pipeline if SonarQube quality gate fails.
6. **Docker Multi-Stage Build:** Assembles minimal production container image.
7. **Aqua Trivy Scanning:** Scans the built container for OS & package CVEs; fails on Critical vulnerabilities.
8. **Amazon ECR Publication:** Tags and pushes image with immutable build number and SHA tag.
9. **AWS EC2 Continuous Deployment:** Updates running container on the Ubuntu EC2 target.
10. **Health Check Verification:** Validates `/api/health` status before finalizing release.

---

## 7. Container Vulnerability Scanning (Trivy)

To scan the container image using Aqua Trivy:

```bash
# Linux / macOS
./scripts/trivy-scan.sh secureid:latest

# Windows Command Prompt
scripts\trivy-scan.bat secureid:latest

# Or cross-platform Node runner
npm run trivy:scan
```

- **JSON Scan Artifact:** [`reports/trivy-image-report.json`](./reports/trivy-image-report.json)
- **Readable Markdown Summary:** [`reports/trivy-image-report.md`](./reports/trivy-image-report.md)

---

## 8. Static Code Analysis (SonarQube)

Configure [`sonar-project.properties`](./sonar-project.properties) with your server details:

```bash
# Run SonarScanner
sonar-scanner -Dsonar.host.url=http://localhost:9000 -Dsonar.token=$SONAR_TOKEN
```

- **SAST Audit Report:** [`reports/sonarqube-scan-report.md`](./reports/sonarqube-scan-report.md)

---

## 9. Terraform AWS Cloud Infrastructure

To provision the AWS infrastructure (ECR Repository + Security Group + EC2 Server):

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your AWS region and SSH key

terraform init
terraform plan
terraform apply
```

---

## 10. Repository Directory Structure

```text
Secure Digital Identity Management UI/
├── backend/                  # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/          # Centralized environment configs
│   │   ├── controllers/     # Auth, User, Activity, Security, Admin controllers
│   │   ├── middleware/      # Auth (RBAC), Rate Limiter, Validator, Error Handler
│   │   ├── models/          # SQLite database (sql.js) with auto-seeding
│   │   ├── routes/          # Express route definitions
│   │   ├── utils/           # Bcrypt hashing & JWT cookie helpers
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entry point & graceful shutdown
│   ├── tests/               # Vitest unit & integration tests
│   ├── tsconfig.json
│   └── package.json
├── frontend/                 # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/      # Navbar, Footer, StatusBadge, StatCard, Modal, AlertNotice
│   │   ├── context/         # AuthContext with HTTP-only cookie support
│   │   ├── pages/           # Landing, Login, Register, Dashboard, Profile, Activity,
│   │   │                    # Security, Analyzer, Admin, Pipeline, Architecture, Reports, Testing
│   │   ├── services/        # Fetch API client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Router and application shell
│   │   ├── main.tsx         # React root
│   │   └── index.css        # Cyberpunk styling tokens and utilities
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── terraform/                # AWS IaC (ECR, EC2, VPC Security Group)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
├── scripts/                  # Cross-platform helper scripts
│   ├── dev.js               # Concurrently runs backend & frontend
│   ├── trivy-scan.js        # Node Trivy scanner wrapper
│   ├── trivy-scan.sh        # Bash Trivy scan script
│   ├── trivy-scan.bat       # Windows CMD Trivy script
│   └── sonar-scan.sh        # SonarScanner script
├── reports/                  # Generated security scan reports
│   ├── trivy-image-report.json
│   ├── trivy-image-report.md
│   └── sonarqube-scan-report.md
├── docs/                     # Project documentation
│   ├── ARCHITECTURE.md
│   ├── DEVSECOPS_PIPELINE.md
│   └── COLLEGE_PRESENTATION_GUIDE.md  # 3-5 min presentation script & viva answers
├── Dockerfile                # Multi-stage Docker build (non-root node user)
├── .dockerignore
├── docker-compose.yml        # Local development compose configuration
├── Jenkinsfile               # Complete 9-stage DevSecOps CI/CD pipeline
├── sonar-project.properties  # SonarQube SAST configuration
├── .env.example              # Safe environment variable template
├── .env                      # Local development environment configuration
├── .gitignore                # Git exclusions
├── package.json              # Monorepo scripts
└── README.md
```

---

## 11. Git & Version Control Instructions

To initialize this repository and push to GitHub:

```bash
# 1. Initialize git
git init -b main

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "feat: complete SecureID digital identity system with DevSecOps pipeline"

# 4. Link your remote GitHub repository
git remote add origin https://github.com/<your-username>/secureid-devsecops.git

# 5. Push to GitHub
git push -u origin main
```

---

## 12. Academic Integrity & Transparency Notice

- **Demo Identity Data:** All user accounts, names, and phone numbers in this project represent synthetic test fixtures for laboratory experimentation. No real sovereign government ID numbers are stored.
- **Verification Notice:** Cloud deployment and scanning status are documented honestly. The Trivy and SonarQube reports reflect actual baseline scanning configurations.
