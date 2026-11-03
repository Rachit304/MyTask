---
name: new-api-module
description: Scaffold a backend feature module (routes, controller, service, repository, schema, types, test) following Architecture section 5. Use when starting a new backend module such as tasks or routines. Argument: module name.
---

Create `backend/src/modules/<name>/` with:

- `<name>.routes.ts`: endpoints only, mounted under `/api/v1`, auth middleware applied.
- `<name>.controller.ts`: parse and validate with the schema, call the service, return the response envelope. No business logic.
- `<name>.service.ts`: business rules. No Express types and no Prisma calls.
- `<name>.repository.ts`: all Prisma access.
- `<name>.schema.ts`: Zod schemas for params, query and body, taken from `docs/API_CONTRACTS.md`.
- `<name>.types.ts` and `<name>.test.ts`.

Before writing, read only the matching section of `docs/API_CONTRACTS.md`. Look at an existing module and match it. After writing, run the `api-contract-check` skill.
