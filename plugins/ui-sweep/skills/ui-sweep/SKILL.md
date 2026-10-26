---
name: ui-sweep
description: "Sweep a feature's UI end to end: run the app locally in an isolated sandbox, screenshot every screen and state into a Ref the team can comment on, and report the bugs found with short fix proposals. With --fix, also fix the obvious bugs as linked draft PRs, work the review comments and test the fixes together."
argument-hint: <feature ref | PR numbers | commit range> [--fix]
disable-model-invocation: true
---

# ui-sweep

Manual only. A sweep boots servers and spends agent tokens; with `--fix` it opens PRs. Run only when asked.

**Stop first if the Ref MCP is not connected.** Do not boot anything. Point the user at the `ref-plan` plugin:

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-plan@ref-tools --config api_key=<key>
```

Key from [ref.tools/keys](https://ref.tools/keys). Then `/plugin configure ref-plan@ref-tools` if needed.

Also needs: subagents, Playwright (or equivalent), `git`, and `gh` for `--fix`. Without `gh` and `--fix` was requested, say so and stop after the report.

Paths below are relative to this plugin root (`plugins/ui-sweep/`).

## Inputs

- One or more feature refs (ids or URLs), or the PRs / commit range that landed the feature. More can arrive mid-run.
- Optional: which external integrations to run for real; viewports (desktop 1440×900 default, plus phone 390×844 and dark); `--fix`.

## Outputs

1. **Catalog ref** titled `ui-sweep: <Feature name>` (name from the feature ref). Parent of every other sweep ref. Status → "Look at these" → one collapsed section per UI element (healthy, variants, errors, phone, dark). Each shot: title, one-line description, viewport, bugs seen.
2. **`Bugs` sub-ref.** Default: Needs you → bugs by area (severity, repro, suspected file, short fix proposal) → follow-ups. With `--fix`: Status (PR table + merge order) on top; PR chips on fixed sections.
3. **Draft PRs, one per area** (`--fix` only), PrLinks on the bug ref, both refs linked in the description.
4. **Clean machine:** no sandbox processes, worktrees, local branches, or temp data; comment watch stopped.

**Default run:** phases 1–4, then cleanup. **`--fix`:** continues through phases 5–8.

## Role

You are the **orchestrator**. Never screenshot or fix code yourself. Boot the sandbox, write the shared brief, fan out subagents, keep both refs current, relay decisions. Subagents run in the background and report back. Forward follow-ups to the agent that already has context — do not start a new one for them.

## Workflow

### 1. Read and inventory

- Read every feature ref plus the PRs/commits it lists.
- **Create the catalog ref immediately**, before research: opening + TODO box.
- Fan out an **inventory agent** (Explore, read-only). Prompt: `references/inventory-prompt.md`. Save `INVENTORY.md` in the catalog workspace; every later agent reads it.

### 2. Pre-flight and sandbox

Read `references/project-discovery.md`. Find how the project runs locally (agent docs → launch config → e2e/demo harness → README/scripts). If still unclear, ask **one** question.

Isolation: own ports, own data, own checkout (worktree — never the user's hot-reload tree), feature flags on in this copy only, no real/staging credentials.

Run `scripts/preflight.sh` (ports, stale installs, shared-service health, login smoke tests). Reuse inventory helpers; fill gaps in `scripts/lib.ts` (`signIn`, `shot`, `newPage`) and write a **BRIEF** from `references/brief-template.md`.

Smoke-test sign-in + one screenshot before fanning out. For code newer than the running sandbox, boot a **second sandbox** from a fresh worktree of the base branch with its own install.

### 3. Capture (parallel)

Prompts: `references/capture-prompts.md`.

- **Live agents, one per area** (+ one per real integration): create test records as sub-refs of the test-data parent; capture in user order; open every PNG; report bugs with severity, repro, suspected file, short fix proposal.
- **Edge-state agents, one per area:** fabricate states on **separate seeded test users**. Cover banners, errors, disabled reasons, teammate/viewer/signed-out, phone, dark, flag-off (second server with flag off).
- A working integration stands in for a broken one; tag those shots; re-shoot when fixed.

### 4. Publish catalog and bug report

Templates: `references/ref-templates.md`.

- **Uploader:** Media `upload`, then PUT bytes via `scripts/put-media.mjs` → `media.json`.
- **`scripts/render.mjs`:** manifests → per-shot markdown.
- **Writer:** insert sections verbatim; verify image counts on read-back.
- **`scripts/regroup.mjs`:** regroup by UI element into `:::collapse` sections; "Look at these" first; Status on top.
- **Bug ref:** triage by area. Product calls → Needs you with a recommended pick; deeper work → follow-ups.
- Without `--fix`, go to cleanup (`scripts/cleanup.sh` and the checklist in `references/fix-and-land.md`).

### 5–8. Fix and land (`--fix` only)

Read `references/fix-and-land.md` only when `--fix` is set.

5. Fix clear-cut proposals; wait on Needs you; leave follow-ups listed. Fix agents share one worktree, **disjoint files**, no commits; run the repo's checks on what they touched. Orchestrator checks flag-off parity. Update the bug ref as fixes land.
6. Split into **draft PRs by area** from fresh worktrees off `origin/main`. Each must pass alone or stack. PrLinks to the bug ref; chips on fixed sections.
7. Watch refs for comments; reply → message the owning agent → resolve when landed. Same loop for review bots; fix high-severity / correctness; defer narrow edges as follow-ups.
8. Before any merge: integrate all PRs locally with a real install; run the repo's pre-merge gate, layout/visual tests, feature e2e, one real E2E, flag-off parity. **User merges** — never merge or mark ready. After each merge: merge main into remaining PRs (no rebase/force-push). Then cleanup.

## Guardrails

Put these in the BRIEF and every subagent prompt.

- **User environment off limits.** Never touch the user's running servers, ports, hot-reload checkout, local daemons, credential stores, or staging/production. Test agents never use the user's own accounts.
- **Test artifacts nested.** Every test record is a sub-ref of one test-data parent created at boot.
- **Shared sandbox state stays put.** No agent restarts shared processes, flips sandbox flags, or edits tracked files in the served checkout unless its brief says so.
- **Git:** no force-push or rebase on PR branches (merge the base instead); fetch before push; never commit accidental proof screenshots/snapshots.
- **Gates:** follow the repo's `AGENTS.md` / `CONTRIBUTING`. Drafts compile and pass their own tests; pushes under review run the full local gate first.
- **Flag-off parity:** flagged features must not change flag-off behaviour. Every fix states impact; orchestrator checks.
- **Permissions:** don't retry denied actions (merge, mark ready, mass delete). Surface them as user actions.

## References (load when needed)

| File | When |
| --- | --- |
| `references/project-discovery.md` | Phase 2 — find run path + isolation |
| `references/inventory-prompt.md` | Phase 1 — inventory agent |
| `references/brief-template.md` | Phase 2 — BRIEF + manifest schema |
| `references/capture-prompts.md` | Phase 3 — live / edge / second-sandbox / re-shoot |
| `references/ref-templates.md` | Phase 4 — catalog + Bugs skeletons |
| `references/fix-and-land.md` | Phases 5–8 and cleanup checklist (`--fix` or cleanup) |
| `references/pitfalls.md` | Anytime a phase fails oddly |
