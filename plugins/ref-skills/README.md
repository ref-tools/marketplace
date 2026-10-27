<a href="https://ref.tools"><img src="https://docs.ref.tools/logo/ref-wordmark-light.png" alt="Ref" width="120"></a>

# ref-skills

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-skills@ref-tools
```

## Skills

- `ui-sweep` - Catalog screenshots for a complex feature.

# 🧹 ui-sweep

An agent skill that turns "sweep the UI of this web app feature" into a repeatable run in any repo whose app can run locally. Designed for **web apps** driven in a headless browser. Native iOS/Android apps are out of scope.

A sweep **boots an isolated local copy of the app**, screenshots every screen and state into a Ref the team can comment on, and reports the bugs it finds with short fix proposals. That costs **dev-server / sandbox processes and agent tokens**. With `--fix`, it also opens **draft PRs** (one per area), works review comments, and runs an integrated gate before you merge.

The first run also leaves a **reusable UI-testing scaffold** in `.ui-sweep/` at the repo root (helpers, run recipe, BRIEF, inventory). Later sweeps and normal UI testing reuse it; cleanup does not remove it.

## What you get

1. **Catalog ref** titled `ui-sweep: <Feature name>` — Status, "Look at these", then one collapsed section per UI element.
2. **`Bugs` sub-ref** — Needs you (product calls), bugs by area with severity / repro / suspected file / short fix proposal, follow-ups. With `--fix`, a Status PR table sits on top.
3. **Draft PRs** (only with `--fix`), one per area, attached to the bug ref.
4. **A reusable UI-testing scaffold in `.ui-sweep/`** — project helpers, run recipe, BRIEF, and inventory for later sweeps and UI testing. Default run leaves it uncommitted (the report tells you you can commit it); with `--fix`, it ships as its own draft PR ("Add ui-sweep scaffold"), separate from bug-fix PRs.
5. **A clean machine** — sandbox processes, worktrees, local branches, and temp data removed (`.ui-sweep/` is kept).

The skill never merges PRs or marks them ready; you do.

## Install this skill

**Claude Code** — install the `ref-skills` plugin (see [Install](#install) above). The skill shows as `ref-skills:ui-sweep`.

**Codex** — ask Codex to install it with its built-in skill installer:

```text
Use the skill-installer skill to install https://github.com/ref-tools/marketplace/tree/main/plugins/ref-skills/skills/ui-sweep
```

or copy it manually (Codex loads skills from `$CODEX_HOME/skills/<name>`, default `~/.codex/skills`):

```sh
git clone --depth 1 https://github.com/ref-tools/marketplace /tmp/ref-marketplace
mkdir -p ~/.codex/skills
cp -R /tmp/ref-marketplace/plugins/ref-skills/skills/ui-sweep ~/.codex/skills/
```

Restart Codex so it picks up the skill.

**Other agents** — copy `plugins/ref-skills/skills/ui-sweep/` into your agent's skills directory; see your agent's docs for where that is.

## Usage

Where the agent supports slash commands:

```text
/ref-skills:ui-sweep <feature ref | PR numbers | commit range> [--fix]
```

Or in plain language: `run ui-sweep on <feature ref>, with --fix`.

| Argument | Meaning |
| --- | --- |
| Feature ref(s) | Ids or URLs for the feature to sweep. More can arrive mid-run. |
| PR numbers / commit range | Alternative when there is no feature ref yet. |
| `--fix` | After the catalog and bug report, fix obvious bugs as linked draft PRs, work reviews, and prepare merge order. Without `--fix`, the run stops after the report and cleans up. |

Optional mid-run choices (the skill may ask): which external integrations to call for real; viewports (desktop 1440×900 by default, plus phone-width browser viewport 390×844 and dark mode).

## Requirements

- **Ref MCP** — write refs, upload media, manage comments, attach PRs. If it isn't connected, `/ref-skills:ui-sweep` stops before booting anything — see [If your agent is missing the Ref MCP](#if-your-agent-is-missing-the-ref-mcp) below.
- **Subagents or parallel background tasks** — the orchestrator fans out inventory, capture, upload, and (with `--fix`) fix agents. If the agent has neither, run those agents one after another.
- **Playwright** (or another headless browser library the sweep can drive).
- **`git`**, plus **`gh`** when using `--fix`.
- A way to run the app locally (discovered from agent docs, launch config, e2e/demo harness, or package scripts).

## If your agent is missing the Ref MCP

**Claude Code and Codex** — run the install script (sets up the Ref MCP server for both):

```sh
curl -fsSL https://api.plan.ref.tools/plugins/install/local-agent | bash
```

**Other agents** — see [docs.ref.tools/plans/install](https://docs.ref.tools/plans/install/index).
