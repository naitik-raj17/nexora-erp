# Nexora ERP

Enterprise resource planning platform for small and mid-sized businesses, covering **finance, HR, procurement, inventory and reporting** in one web application with role-based access control.

> **Status:** Week 1 — proposal and system design submitted for review. Feature development starts after approval.

## Documents

- [Project proposal and system design (PDF)](docs/Nexora-ERP-Proposal-and-System-Design.pdf) — objectives, scope, requirements, modules, roles and permissions, tech stack, architecture, ERD, wireframes, timeline and version control plan.

## Modules

| Module | Key features |
| --- | --- |
| Core / Admin | Login, users, roles and permissions, departments, audit log, notifications |
| Finance | Chart of accounts, journals, invoices, bills, payments, financial statements |
| HR | Employees, leave, attendance, payroll runs, payslips |
| Procurement | Vendors, requisitions with approval, purchase orders, goods receipt |
| Inventory | Products, warehouses, stock movements, reorder alerts, valuation |
| Reporting | Role-based dashboards, standard reports, CSV/PDF export |

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query |
| Backend | NestJS 11 on Node.js 24, REST + OpenAPI |
| Database | PostgreSQL 17 with Prisma ORM |
| Jobs and cache | Redis 7 + BullMQ |
| Testing | Jest, Supertest, Playwright |
| DevOps | Docker Compose, GitHub Actions, Vercel (web), Render (API) |

## Repository structure

```
nexora-erp/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Zod schemas and types shared by web and api
│   └── config/       # ESLint, TypeScript and Prettier presets
├── prisma/           # Schema, migrations, seed data
├── docs/             # Proposal, ERD, decisions
└── .github/          # CI workflows, PR and issue templates
```

## Branching and commits

| Branch | Purpose |
| --- | --- |
| `main` | Production-ready code, tagged per release |
| `develop` | Integration branch for the current sprint |
| `feature/<issue>-<name>` | One issue or user story, branched from `develop` |
| `fix/<issue>-<name>` | Bug fix during a sprint |
| `hotfix/<name>` | Urgent production fix, branched from `main` |

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), e.g. `feat(procurement): add goods receipt form`. Every change reaches `develop` through a reviewed pull request that passes CI.

## Getting started

Setup instructions (Docker Compose, environment variables, seed data) will be added in Sprint 1.
