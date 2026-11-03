# MyLife — Technical Architecture

**Version:** 1.0  
**Status:** Proposed architecture

## 1. Architecture overview

MyLife will initially use a modular monolith architecture.

```text
Angular Frontend
       |
       | HTTP / JSON
       v
Node.js + Express Backend
       |
       +---- Authentication
       |
       +---- Task Module
       |
       +---- Routine Module
       |
       +---- Dashboard Module
       |
       +---- Analytics Module
       |
       +---- AI Module
       |
       +---- Content Module
       |
       v
Prisma ORM
       |
       v
SQLite Database

AI Module ------> Anthropic Messages API
Content Module -> External Content API
```

Keep the initial system simple. Do not introduce microservices unless there is a clear technical reason.

## 2. Technology stack

| Layer | Technology |
|---|---|
| Frontend | Angular + TypeScript |
| UI | Angular Material |
| Frontend state | Angular Signals + RxJS |
| Backend | Node.js + Express + TypeScript |
| Database | SQLite |
| ORM | Prisma |
| AI | Anthropic TypeScript SDK |
| API | REST |
| API validation | Zod |
| Testing | Angular testing tools + backend test framework |

Exact dependency versions and test tooling should be finalized during project setup.

## 3. Repository structure

```text
mylife/
│
├── frontend/
│   └── src/app/
│       ├── core/
│       │   ├── auth/
│       │   ├── guards/
│       │   ├── interceptors/
│       │   └── services/
│       │
│       ├── shared/
│       │   ├── components/
│       │   ├── pipes/
│       │   └── directives/
│       │
│       ├── layout/
│       │   ├── sidebar/
│       │   ├── header/
│       │   └── main-layout/
│       │
│       ├── features/
│       │   ├── dashboard/
│       │   ├── tasks/
│       │   ├── routines/
│       │   ├── analytics/
│       │   ├── ai-assistant/
│       │   ├── content/
│       │   └── settings/
│       │
│       ├── app.routes.ts
│       └── app.config.ts
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── tasks/
│   │   │   ├── categories/
│   │   │   ├── routines/
│   │   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   ├── ai/
│   │   │   └── content/
│   │   │
│   │   ├── shared/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   │
│   └── .env.example
│
├── docs/
├── .claude/
├── CLAUDE.md
├── .gitignore
└── README.md
```

## 4. Frontend architecture

Use Angular standalone components and lazy-loaded feature routes.

Responsibilities:

- `core`: authentication, guards, interceptors, and application-level services.
- `shared`: reusable UI components and utilities.
- `layout`: sidebar, header, and application shell.
- `features`: independent product modules.

Use Angular Signals for local and shared UI state where appropriate. Use RxJS for asynchronous streams and HTTP operations.

Avoid introducing NgRx in the initial version unless state complexity justifies it.

Keep API communication inside services rather than making HTTP requests directly from components.

## 5. Backend architecture

Use feature-based modules with clear responsibilities.

A typical module may contain:

```text
tasks/
├── tasks.routes.ts
├── tasks.controller.ts
├── tasks.service.ts
├── tasks.repository.ts
├── tasks.schema.ts
├── tasks.types.ts
└── tasks.test.ts
```

Responsibilities:

- **Routes:** Define HTTP endpoints.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Implement business rules.
- **Repositories:** Handle database operations.
- **Schemas:** Validate external input.
- **Tests:** Verify behavior.

Keep controllers thin and business logic inside services.

## 6. Database design

Proposed entities:

| Entity | Responsibility |
|---|---|
| Category | Task categorization |
| Task | Individual task |
| TaskHistory | Task change history |
| Routine | Recurring activity |
| RoutineLog | Completion record for a routine occurrence |
| AIConversation | AI conversation metadata |
| AIMessage | Conversation messages |
| AIAction | AI-proposed action awaiting approval |
| AppSetting | Application preferences |

Important database rules:

- A routine can have only one completion log per occurrence date.
- Use indexes for commonly filtered task fields.
- Preserve task history for analytics.
- Avoid deleting historical data unintentionally.
- Use Prisma migrations for schema changes.

Store date-only values separately from UTC timestamps. Use `Asia/Kolkata` as the initial application timezone, but make it configurable.

## 7. Authentication and security

The application is intended for local single-user use.

- Store a password hash in backend-only configuration.
- Never hardcode a password in Angular.
- Use a server-managed HTTP-only, SameSite session cookie.
- Use a maintained password hashing library.
- Apply login throttling.
- Protect state-changing requests against CSRF as appropriate.
- Bind the backend to `127.0.0.1` by default.
- Keep `.env`, tokens, database files, and backups out of Git.

The Anthropic API key must never be exposed to the browser.

## 8. AI integration architecture

Angular communicates with the MyLife backend. The backend communicates with Anthropic.

```text
Angular AI Assistant
        |
        v
POST /api/v1/ai/chat
        |
        v
Backend AI Service
        |
        +---- Gather relevant productivity data
        |
        +---- Build prompt
        |
        +---- Call Anthropic Messages API
        |
        +---- Validate model response
        |
        v
Return response or action proposal
        |
        v
User reviews proposal
        |
        v
User approves action
        |
        v
Backend revalidates and executes it
```

Use an AI provider/service abstraction so model-specific code does not spread across business modules.

The model must not have direct database access.

Any AI-generated mutation must:
1. Be converted into a structured proposal.
2. Be validated by the backend.
3. Be shown to the user.
4. Require explicit approval.
5. Be revalidated before execution.
6. Be protected against duplicate execution.

## 9. Timezone and date handling

- Default timezone: `Asia/Kolkata`.
- Store timestamps in UTC.
- Treat due dates and routine occurrence dates as local calendar dates.
- Convert dates at the API boundary using the configured timezone.
- Test date calculations around timezone boundaries.

## 10. Testing strategy

**Unit tests**
- Task status transitions.
- Routine recurrence calculations.
- Streak calculations.
- Date handling.
- AI action validation.

**Integration tests**
- API and database interactions.
- Authentication and session handling.
- Routine duplicate prevention.
- AI action approval and rejection.

**Frontend tests**
- Components.
- API services.
- Authentication guards.
- Important user interactions.

**End-to-end tests**
- Login.
- Create and complete a task.
- Create and complete a routine.
- Review dashboard.
- Approve an AI-proposed action.

## 11. Local development

Run frontend and backend as separate development processes initially.

The backend owns the SQLite database and Prisma migrations.

Document commands for:
- Installing dependencies.
- Starting frontend.
- Starting backend.
- Running migrations.
- Running tests.
- Formatting and linting.

The application should remain usable for ordinary task and routine management even when the AI provider is unavailable.