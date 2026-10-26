# Project discovery

How to find a local run path, isolate the sandbox, and what to ask when it's unclear.

## Find the run path (in order)

1. **Project skill or agent doc** — `AGENTS.md` / `CLAUDE.md` or the agent's instruction file, or a skill named like `run`, `dev`, `dev-stack`, `demo`.
2. **Launch config** — e.g. `.claude/launch.json`, or another agent's equivalent launch / run config.
3. **E2E or demo harness** — prefer this when present: it usually boots an isolated copy with seeded users.
4. **README and package scripts** — `dev`, `start`, `docker compose`, Make targets.

Record: boot command(s), required env files, ports (or how ports are chosen), how to seed users, how to flip feature flags for this copy only, and any shared local services (DB, emulator, queue).

## Isolation checklist

Whatever the stack, the sandbox must have:

| Rule | Meaning |
| --- | --- |
| Own ports | Free ports only — never the ones the user's dev server holds. |
| Own data | Throwaway DB/emulator, or at least separate seeded test users. |
| Own checkout | A git worktree — never the checkout the user's server hot-reloads from. |
| Flags on | Feature flags/gates the feature needs, in this copy only. |
| No outside credentials | External calls → test accounts or throwaway config, never real or staging. |

## When it's unclear

If the four sources above still don't explain how to boot an **isolated** copy, ask the user **exactly one** question: how to boot an isolated local copy (command, ports, data, flags). Then proceed from their answer. Do not boot until you have a plan that satisfies the isolation checklist.

## Reuse before writing

Prefer existing fixtures, factories, seed scripts, sign-in helpers, page objects, and screenshot utilities from the inventory. Call them as they are. Write only gaps into the shared library (`scripts/lib.ts`) and the BRIEF.
