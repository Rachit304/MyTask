---
name: ai-safety-review
description: Checklist from PRD 5.8 for any code that calls Claude or applies AI-proposed changes. Use when adding or reviewing AI endpoints, prompts or the proposal/approval flow.
---

Verify each item with a `file:line` reference:

1. The Anthropic key is read from backend env only and never reaches the frontend, logs or responses.
2. The model is given no tools for the database, SQL, filesystem or shell. Context is built by the backend from a fixed field list with size limits.
3. Model output is parsed and validated with Zod. Malformed output returns an error, not a partial action.
4. A proposal is only stored (`PENDING_APPROVAL`, with `expiresAt`). Creating one changes no tasks.
5. Approve revalidates against current data, checks the status and expiry, and applies in a single transaction.
6. Approve is idempotent: a second call returns the first result and does not apply twice. Rejected and expired proposals cannot run.
7. Daily planning and reviews return suggestions only and never change dates or statuses.
8. Core features still work when the provider fails; the error maps to 502 or 503.
9. Tests use a mocked provider and cover items 3 to 6.
