# Fix and land (`--fix` only)

Read this only when the user passed `--fix`, or when running the cleanup checklist after any run.

## Fix-agent prompt

```
You are a fix agent. Shared worktree: <path>. You own ONLY these files (disjoint):
<file list>

Bugs to fix (from the Bugs ref):
<list with repro + proposal>

Do not commit. Implement the clear-cut fixes. Do not take product calls in Needs you.
Run the repo's checks on what you touched (typecheck, format, lint, unit/layout/visual as applicable).
If a symlinked install breaks a suite, note it as known — do not "fix" by skipping silently.

Report: root cause, fix summary, files touched, tests run + results, flag-off impact.
```

## Orchestrator before shipping

- Confirm no unflagged behaviour changes when the feature is behind a flag.
- Update the Bugs ref: replace each landed proposal with the fix made; keep area grouping.

## PR split

- Fresh worktree per area off `origin/main`.
- Draft PRs only. Body: summary, links to catalog + Bugs (staleness caveat), bug list, gate-off notes, repo status checklist.
- Each branch typechecks, lints, and passes its own tests **alone**. If not, stack on the PR it depends on.
- PrLinks every PR to the Bugs ref; add PR chips on fixed sections.

## Review-round prompt (per comment)

```
Comment on <ref or PR>: <text>
Plan: <one-line reply>
Owning agent/branch: <id>
After the fix commit lands: reply with the commit SHA and resolve the thread.
Defer only narrow edge cases — reply saying follow-up, leave thread open.
```

## Integration gate (before any merge)

On a local tree with a **real** install, merge all fix PRs onto the base branch, then run:

1. The repo's full pre-merge gate (`AGENTS.md` / `CONTRIBUTING`)
2. Visual or layout tests
3. The feature's e2e suite
4. One real end-to-end run
5. Flag-off parity check

Fix failures on the owning branch. Re-shoot if earlier shots used a stand-in.

## Merge order

- The skill **never** merges or marks PRs ready. Bugs → Status states merge order and what each later PR needs after an earlier one lands.
- After each user merge: merge `main` into remaining PR branches. Never rebase or force-push. Re-apply known conflict resolutions.
- A fix that lands on a branch after its PR merged → follow-up PR, cherry-picked onto main.

## Cleanup checklist (every run)

Run `scripts/cleanup.sh` with explicit env (see script header). Then verify:

- [ ] Headless browsers, dev servers, workers stopped
- [ ] Worktrees and local sweep branches removed
- [ ] Sandbox dirs and temp files deleted
- [ ] Comment watch stopped
- [ ] Catalog and Bugs refs marked done

Anything a permission rule blocks (e.g. wiping a shared database) → user action in Needs you / Status.
