# Contributing to Nexora ERP

This guide covers how work moves from an issue to a release.

## Prerequisites

- Node.js 24 (see `.nvmrc`) and pnpm 9 (`corepack enable`)
- Docker with Docker Compose
- VS Code with the recommended extensions (`.vscode/extensions.json`)

## Local setup

```bash
git clone https://github.com/naitik-raj17/nexora-erp.git
cd nexora-erp
corepack enable
pnpm install          # also installs the Git hooks
cp .env.example .env  # then adjust values
pnpm db:up            # PostgreSQL, Redis, MinIO, Mailpit
pnpm dev
```

| Service | URL |
| --- | --- |
| Web app | http://localhost:3000 |
| API and Swagger docs | http://localhost:4000/docs |
| MinIO console | http://localhost:9001 |
| Mailpit (test inbox) | http://localhost:8025 |

## Workflow

1. Pick an issue from the GitHub Projects board and move it to **In Progress**.
2. Branch from `develop`: `feature/<issue-id>-<short-name>` or `fix/<issue-id>-<short-name>`.
3. Commit small, focused changes using Conventional Commits.
4. Open a pull request into `develop` and fill in the template.
5. CI (lint, type check, tests, build) must pass and one reviewer must approve.
6. Squash-merge; delete the branch.
7. At the end of each sprint, `develop` is merged into `main` and tagged (`v0.1.0`, `v0.2.0`, …).

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Production-ready code, tagged per release |
| `develop` | Integration branch for the current sprint; deploys to staging |
| `feature/<issue-id>-<short-name>` | One issue or user story |
| `fix/<issue-id>-<short-name>` | Bug fix during a sprint |
| `hotfix/<short-name>` | Urgent production fix from `main`, merged back to `main` and `develop` |

## Commit messages

Format: `type(scope): summary`, checked by Commitlint on every commit.

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Scopes:** `core`, `finance`, `hr`, `procurement`, `inventory`, `reporting`, `web`, `api`, `shared`, `config`, `db`, `ci`, `deps`, `docs`

Examples:

```
feat(procurement): add goods receipt form
fix(finance): reject unbalanced journal entries
test(hr): cover payroll net pay calculation
```

## Definition of done

- [ ] Code reviewed and merged into `develop`
- [ ] Unit and integration tests added; CI green
- [ ] New endpoints documented in Swagger with their required permission
- [ ] UI checked at 1440 px and 768 px widths
- [ ] Deployed to staging and demoed at sprint review

## Code style

- TypeScript strict mode everywhere; no `any` without a comment explaining why.
- Prettier formats on commit (lint-staged); ESLint rules come from `@nexora/config`.
- Request and response shapes are Zod schemas in `packages/shared`.
- Money uses decimal types, never floating point.

## Security

- Never commit `.env` files or secrets; use GitHub Actions secrets for CI.
- Report vulnerabilities privately to the repository owner rather than in a public issue.
