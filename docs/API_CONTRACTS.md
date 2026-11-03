# MyLife — API Contracts

**Version:** 1.0  
**Base URL:** `/api/v1`  
**Status:** Initial API proposal

## 1. API conventions

- Use REST endpoints.
- Use JSON for request and response bodies.
- Authenticate using a server-managed HTTP-only session cookie.
- Validate all incoming requests.
- Use consistent response structures.
- Use ISO 8601 UTC timestamps.
- Use `YYYY-MM-DD` for date-only values.

### Success response

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

### Error response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

## 2. Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate user |
| POST | `/auth/logout` | End session |
| GET | `/auth/session` | Check session validity |

Login request:

```json
{
  "password": "user-entered-password"
}
```

The server should set the session cookie. Never return the password or password hash.

## 3. Category APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/categories` | Get all categories |
| POST | `/categories` | Create category |
| PATCH | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

## 4. Task APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get tasks |
| GET | `/tasks/today` | Get today's tasks |
| GET | `/tasks/overdue` | Get overdue tasks |
| GET | `/tasks/:id` | Get task details |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| PATCH | `/tasks/:id/status` | Update task status |
| DELETE | `/tasks/:id` | Delete task |

Supported filters for `GET /tasks`:

- `status`
- `priority`
- `categoryId`
- `dueFrom`
- `dueTo`
- `search`
- `limit`
- `cursor`

Create task request:

```json
{
  "title": "Study Claude Code Skills",
  "description": "Understand how Skills work",
  "categoryId": "category-id",
  "priority": "HIGH",
  "dueDate": "2026-11-05",
  "estimatedMinutes": 60
}
```

Update status request:

```json
{
  "status": "COMPLETED"
}
```

Allowed statuses:

- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

Allowed priorities:

- `LOW`
- `MEDIUM`
- `HIGH`

## 5. Routine APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/routines` | Get all routines |
| POST | `/routines` | Create routine |
| GET | `/routines/today` | Get today's scheduled routines |
| GET | `/routines/:id` | Get routine details |
| PATCH | `/routines/:id` | Update routine |
| DELETE | `/routines/:id` | Delete or archive routine |
| GET | `/routines/:id/logs` | Get routine history |
| POST | `/routines/:id/logs` | Record routine completion |

Create routine request:

```json
{
  "name": "Read technical material",
  "description": "Study for certification",
  "frequency": "WEEKLY",
  "weekdays": [1, 2, 3, 4, 5],
  "targetMinutes": 30,
  "startDate": "2026-11-03"
}
```

Use ISO weekday numbers: Monday = 1 and Sunday = 7.

Routine completion request:

```json
{
  "occurrenceDate": "2026-11-03",
  "completed": true,
  "actualMinutes": 35,
  "note": "Studied Claude Code hooks"
}
```

The backend must prevent duplicate logs for the same routine and occurrence date.

## 6. Dashboard APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/today` | Get dashboard information |

The response should aggregate:
- Current local date and timezone.
- Today's tasks.
- Overdue task count.
- Today's scheduled routines.
- Routine completion state.
- Productivity summary.
- Latest AI insight.
- Featured quote or fact.

## 7. Analytics APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/daily` | Daily analytics |
| GET | `/analytics/weekly` | Weekly analytics |
| GET | `/analytics/monthly` | Monthly analytics |
| GET | `/analytics/streaks` | Routine streaks |

Example query:

```text
GET /analytics/monthly?from=2026-11-01&to=2026-11-30
```

Task and routine metrics should be reported separately.

## 8. AI APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/chat` | Send message to AI assistant |
| GET | `/ai/conversations` | List conversations |
| GET | `/ai/conversations/:id` | Get conversation |
| POST | `/ai/plan-day` | Generate daily plan |
| POST | `/ai/create-task` | Generate task proposal |
| GET | `/ai/insights/daily` | Get daily AI insight |
| POST | `/ai/actions/:id/approve` | Approve proposed action |
| POST | `/ai/actions/:id/reject` | Reject proposed action |

Example task creation request:

```json
{
  "input": "Finish architecture review by Friday. It should take one hour."
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "proposalId": "proposal-id",
    "actionType": "CREATE_TASK",
    "preview": {
      "title": "Finish architecture review",
      "dueDate": "2026-11-06",
      "estimatedMinutes": 60
    },
    "status": "PENDING_APPROVAL",
    "expiresAt": "2026-11-03T12:00:00.000Z"
  }
}
```

Important:
- Creating a proposal must not create a task.
- The user must approve the proposal.
- The backend must validate the proposal again before execution.
- Approval must be idempotent.
- Expired or rejected proposals cannot be executed.

Daily planning should return suggestions and reasoning. It must not silently change task dates or statuses.

## 9. Content APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/content/news` | Get cached news |
| GET | `/content/facts` | Get interesting facts |
| GET | `/content/quote` | Get featured quote |

Include source attribution and links for news items.

## 10. Settings and backup APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/settings` | Get application settings |
| PATCH | `/settings` | Update application settings |
| POST | `/backup` | Create backup |
| POST | `/restore/validate` | Validate backup |
| POST | `/restore` | Restore backup |

Backup and restore may instead be implemented through local CLI commands if that is safer.

Never expose arbitrary filesystem paths through these endpoints.

## 11. HTTP status codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Successful deletion |
| 400 | Invalid request |
| 401 | Unauthenticated |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Conflict or duplicate operation |
| 422 | Semantically invalid input |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 502 | Upstream provider error |
| 503 | Provider unavailable |

## 12. Contract maintenance

These contracts are a starting point. During implementation:

- Finalize request and response schemas.
- Add pagination conventions.
- Document validation rules.
- Keep API tests synchronized with contracts.
- Update this document when endpoints change.