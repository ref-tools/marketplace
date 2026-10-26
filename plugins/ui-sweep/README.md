# ui-sweep

Manual Claude Code skill that turns "sweep the UI of this feature" into a repeatable run in any repo whose app can run locally.

A sweep **boots an isolated local copy of the app**, screenshots every screen and state into a Ref the team can comment on, and reports the bugs it finds with short fix proposals. That costs **dev-server / sandbox processes and agent tokens**. With `--fix`, it also opens **draft PRs** (one per area), works review comments, and runs an integrated gate before you merge — so only run it when you asked for a sweep.

## Requirements

- **Ref MCP** — write refs, upload media, manage comments, attach PRs. Install the `ref-plan` plugin from this marketplace (see below). If it isn't connected, `/ui-sweep` stops before booting anything.
- **Subagents** — the orchestrator fans out inventory, capture, upload, and (with `--fix`) fix agents.
- **Playwright** (or another headless browser library the sweep can drive).
- **`git`**, plus **`gh`** when using `--fix`.
- A way to run the app locally (discovered from agent docs, launch config, e2e/demo harness, or package scripts).

## Install Ref MCP (`ref-plan`)

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-plan@ref-tools --config api_key=YOUR_REF_API_KEY
```

Get a key at [ref.tools/keys](https://ref.tools/keys). If you installed without a key:

```text
/plugin configure ref-plan@ref-tools
```

## Install this plugin

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ui-sweep@ref-tools
```

## Usage

```text
/ui-sweep <feature ref | PR numbers | commit range> [--fix]
```

| Argument | Meaning |
| --- | --- |
| Feature ref(s) | Ids or URLs for the feature to sweep. More can arrive mid-run. |
| PR numbers / commit range | Alternative when there is no feature ref yet. |
| `--fix` | After the catalog and bug report, fix obvious bugs as linked draft PRs, work reviews, and prepare merge order. Without `--fix`, the run stops after the report and cleans up. |

Optional mid-run choices (the skill may ask): which external integrations to call for real; viewports (desktop 1440×900 by default, plus phone 390×844 and dark mode).

### What you get

1. **Catalog ref** titled `ui-sweep: <Feature name>` — Status, "Look at these", then one collapsed section per UI element.
2. **`Bugs` sub-ref** — Needs you (product calls), bugs by area with severity / repro / suspected file / short fix proposal, follow-ups. With `--fix`, a Status PR table sits on top.
3. **Draft PRs** (only with `--fix`), one per area, attached to the bug ref.
4. **A clean machine** — sandbox processes, worktrees, local branches, and temp data removed.

The skill never merges PRs or marks them ready; you do.
