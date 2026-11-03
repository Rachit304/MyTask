# MyLife — Product Requirements Document

**Version:** 1.0  
**Status:** Initial draft

## 1. Product vision

MyLife is a personal productivity dashboard that helps one user organize tasks, track recurring routines, understand productivity, and use AI to plan their day.

The application should help answer:

- What should I focus on today?
- Which tasks are overdue or upcoming?
- Which routines have I completed?
- How consistent have I been?
- What should I improve next?

## 2. Goals

1. Manage one-time tasks.
2. Create and track recurring routines.
3. Display a useful daily dashboard.
4. Track historical productivity and progress.
5. Integrate Claude for intelligent planning and recommendations.
6. Keep personal data locally in an SQLite database.
7. Learn Claude Code features while building the application.

## 3. Out of scope for the first version

- Multiple users or team collaboration.
- Public cloud deployment.
- Mobile applications.
- Calendar synchronization.
- Autonomous AI modifications without user approval.
- Social features or leaderboards.

## 4. Target user

The first version is designed for a single user on a local computer.

Initial assumptions:
- Desktop-first responsive interface.
- Dark theme.
- Default timezone: `Asia/Kolkata`.
- Local database.
- Internet connection required for Claude and external news.

## 5. Functional requirements

### 5.1 Authentication

- Protect the application using a single-user password.
- Do not hardcode passwords in frontend source code.
- Store a password hash in server-side configuration.
- Use an HTTP-only session cookie.
- Support login, logout, and session validation.
- Keep API keys on the backend.

### 5.2 Dashboard

Display:
- Current date and greeting.
- Tasks due today.
- Overdue and upcoming tasks.
- Today's routine checklist.
- Daily productivity summary.
- AI-generated daily insight.
- A featured quote or interesting fact.

### 5.3 Task management

Each task should have:

- Title.
- Description.
- Category.
- Priority: LOW, MEDIUM, HIGH.
- Status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED.
- Due date.
- Estimated duration.
- Created and updated timestamps.
- Completion timestamp.

Users should be able to:
- Create tasks.
- Edit tasks.
- Delete tasks.
- Change task status.
- Search and filter tasks.
- View overdue and upcoming tasks.
- Review task history.

Important: Carrying a task forward should not create duplicate task records.

### 5.4 Categories

- Create categories.
- Rename categories.
- Assign categories to tasks.
- Delete categories only when it is safe to do so.

### 5.5 Routine management

A routine represents a recurring activity, unlike a one-time task.

Each routine should support:
- Name and description.
- Daily or selected-weekday recurrence.
- Target duration or count.
- Start date.
- Optional end date.
- Active or paused status.

Users should be able to:
- Mark a routine complete for a particular date.
- Undo a completion.
- View completion history.
- Pause and resume routines.
- View current and best streaks.

Do not allow duplicate completion logs for the same routine and date.

### 5.6 Analytics

Provide daily, weekly, and monthly analytics.

Track separately:
- Tasks completed.
- Tasks pending or overdue.
- Routine completion rate.
- Routine consistency.
- Current and best streaks.

Historical metrics should use saved history and routine logs rather than relying only on current task status.

### 5.7 News, facts, and quotes

Display a small feed containing:
- Technology news.
- AI news.
- Science and general knowledge.
- Productivity-related content.
- Interesting facts.
- Quotes.

For news, retain the title, source, URL, publication date, and retrieval date.

Use an appropriate content API or curated content. Handle provider failures gracefully.

### 5.8 AI assistant

Integrate Claude using the Anthropic TypeScript SDK through the backend.

Initial capabilities:

**Natural-language task creation**
- User describes a task in normal language.
- Claude extracts the title, due date, priority, and estimated duration.
- The application displays a proposal for approval.

**Daily planning**
- Analyze pending tasks.
- Consider deadlines and priorities.
- Consider estimated durations and available time.
- Suggest a realistic daily schedule.

**Daily summary**
- Summarize completed tasks and routines.
- Highlight progress and unfinished work.

**Weekly productivity review**
- Identify patterns.
- Highlight consistency and missed routines.
- Suggest practical improvements.

**Contextual questions**
- Answer questions using relevant productivity data.

#### AI safety rules

- Claude must not directly access the database.
- Never expose arbitrary SQL or shell execution to the model.
- Validate all model-generated structured data on the backend.
- Require explicit user approval before AI-proposed changes are applied.
- Revalidate proposals before executing them.
- Prevent duplicate execution of approved actions.
- Keep the Anthropic API key on the backend.

### 5.9 Settings and backup

- Configure timezone.
- Configure
Configure daily planning preferences.

Configure available time for daily planning.

Support local database backup and restore.

Protect backup files because they contain personal data.

6. Non-functional requirements

Angular and TypeScript frontend.

Node.js, Express, and TypeScript backend.

SQLite database with Prisma.

REST API under /api/v1.

Input validation at API boundaries.

Centralized error handling.

Automated unit and integration tests.

No secrets committed to Git.

Accessible keyboard navigation and readable contrast.

Responsive layout.

7. UI direction

Dark theme.

Clean and modern dashboard.

Simple navigation.

Clear separation between tasks and routines.

Minimal visual clutter.

Clear confirmation for destructive operations.

Explicit approval for AI actions.

8. Suggested development phases

Project setup and developer tooling.

Backend foundation and database.

Authentication.

Task and category management.

Routine management.

Dashboard.

Analytics.

Claude integration.

News, facts, and quotes.

Backup, testing, and security hardening.

Claude Code should refine these phases into a dependency-aware implementation plan before coding starts.

9. First-release acceptance criteria

User can log in and log out.

User can create, update, complete, filter, and delete tasks.

User can create routines and record daily completion.

Duplicate routine logs are prevented.

Dashboard displays correct task and routine information.

Historical progress is retained.

Claude can propose tasks and plans.

AI proposals cannot modify data without approval.

Secrets remain outside frontend code and Git.

Core business rules have automated tests.