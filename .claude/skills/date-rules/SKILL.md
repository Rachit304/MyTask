---
name: date-rules
description: Checklist for timezone and date handling. Use when writing or reviewing code that touches due dates, routine occurrences, streaks, analytics ranges or "today".
---

- Timestamps are stored and sent as UTC ISO 8601. Due dates and routine occurrence dates are local calendar dates written as `DD-MM-YYYY` (zero-padded, e.g. `05-11-2026`) in the API, UI, docs, fixtures and mocks; never store them as timestamps.
- Use one shared parse/format helper for `DD-MM-YYYY`. Validate input strictly (pattern plus a real calendar date, so `31-02-2026` fails with 422). Never use `new Date("05-11-2026")`, which is parsed as a US month-first date.
- `DD-MM-YYYY` strings do not sort or compare correctly as text. Parse to a date value, or to a sortable key, before ordering, range filters (`dueFrom`, `dueTo`, `from`, `to`) or database queries.
- Default timezone is `Asia/Kolkata` (UTC+5:30, no DST) and must come from settings, not a constant scattered in code.
- "Today" is computed in the configured timezone at the API boundary, through one shared helper. Never use `new Date()` plus `toISOString().slice(0,10)` for a local date, because it gives UTC and the wrong format.
- Weekdays are ISO: Monday=1 to Sunday=7. JavaScript `getDay()` uses Sunday=0, so convert.
- Test boundaries: 23:59 and 00:01 local, a UTC date that differs from the local date (18:30 to 23:59 UTC), month and year ends, and a timezone change.
- Streaks and analytics iterate over local dates, not 24-hour offsets.
