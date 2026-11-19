# apps/api — NestJS backend

Planned for Sprint 1 (after proposal approval).

- NestJS 11 on Node.js 24, REST + OpenAPI (Swagger UI at `/docs`)
- One NestJS module per ERP module under `src/modules/`: `core`, `finance`, `hr`, `procurement`, `inventory`, `reporting`
- Global guards: JWT authentication, RBAC permission check (`module:action`), Zod validation, audit interceptor
- Prisma for data access; BullMQ worker for payroll runs, PDF generation and emails
