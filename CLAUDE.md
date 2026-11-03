# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Status

Pre-implementation. The repo contains only `docs/PRD.md`, `docs/Architecture.md` and `docs/API_CONTRACTS.md`. There are no build, lint or test commands yet; add them here when the projects are scaffolded. The docs are proposals.

Build order: Phase 1 is the Angular UI only, on mock data. The backend follows from Phase 2. Each feature gets an API service interface with an in-memory mock, so the real HTTP service can replace it without changing components. `PRD.md` section 8 lists suggested phases, and says to refine them into a dependency-aware plan before coding.

## Planned architecture

MyLife is a single-user, local productivity app: Angular (standalone components, Signals + RxJS, Angular Material, dark theme) calls an Express + TypeScript modular monolith, which uses Prisma on SQLite. Claude is reached only through the backend, behind an AI provider abstraction.

Backend modules follow `routes -> controller -> service -> repository`, with a Zod `schema` for input. Controllers stay thin and business rules live in services. HTTP calls on the frontend go through services, never directly from components.

## Conventions that span files

- API base is `/api/v1`. Success responses use `{success, data, message}`. Errors use `{success:false, error:{code, message, details}}`.
- Timestamps are UTC ISO 8601. Due dates and routine occurrence dates are `YYYY-MM-DD` local calendar dates. The default timezone is `Asia/Kolkata` and must be configurable. Weekdays are ISO numbers, Monday=1 to Sunday=7.
- A routine has at most one log per (routine, occurrence date); duplicates return 409.
- Preserve TaskHistory. Analytics read from history and routine logs, not from current task status. Carrying a task forward must not duplicate it.
- AI changes must go through this flow: structured proposal, backend validation, user approval, revalidation, then idempotent execution. Proposals can expire. Creating a proposal must not change data. The model gets no database, SQL or shell access, and its output is Zod-validated.
- The app must work for tasks and routines when the AI provider is down.
- Auth uses a password hash from backend env config and an HTTP-only SameSite session cookie. The backend binds to `127.0.0.1`. The Anthropic key never reaches the browser. Keep `.env`, database files and backups out of Git.
- Settings cover timezone, daily planning preferences and available planning time. Database backup and restore are supported, and backup files hold personal data, so protect them.
- UI: dark theme, tasks and routines clearly separated, confirmation before destructive operations, explicit approval for AI actions, keyboard-accessible with readable contrast, responsive.
- Done for the first release means: login and logout; task create, update, complete, filter and delete; routines with daily completion and no duplicate logs; a correct dashboard; retained history; AI proposals that cannot change data without approval; no secrets in frontend code or Git; automated tests for the core business rules (`PRD.md` section 9).
- Update `docs/API_CONTRACTS.md` whenever endpoints change.
