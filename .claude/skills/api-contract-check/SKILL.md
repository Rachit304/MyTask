---
name: api-contract-check
description: Compare implemented routes, request/response shapes and mock services against docs/API_CONTRACTS.md and report drift. Use after adding or changing an endpoint or a mock service.
---

1. Read `docs/API_CONTRACTS.md` only for the sections touching the changed feature.
2. Find the implementation (backend `*.routes.ts` and `*.schema.ts`, or frontend API service interfaces and mocks in `core/mocks/`).
3. Check: method and path, filters and pagination (`limit`, `cursor`), enums (`PENDING|IN_PROGRESS|COMPLETED|CANCELLED`, `LOW|MEDIUM|HIGH`), `DD-MM-YYYY` dates, UTC ISO timestamps, ISO weekdays 1-7, the success/error envelope, and status codes (201, 204, 409 for duplicates, 422, 429).
4. Report mismatches as a short list with `file:line`. If the code is right and the doc is stale, propose the doc edit rather than changing it silently.
