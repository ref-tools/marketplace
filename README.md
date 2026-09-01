# Ref Marketplace

Claude Code plugins and skills for [Ref](https://ref.tools).

#### What is Ref?

Ref is a tool for plan authorship and review. Humans and agents work together in shared plan documents: you write and review plans as a team, agents read them, do the work, and report progress back to the plan.

Plan Review moves alignment up front — the team ratifies key decisions before the code gets written, instead of after in code review. It's the cure for [Velocity Sickness](https://ref.tools/blog/ai-broke-alignment).

## Easy install

**Run the install script.** It sets up every supported agent it finds on your machine:

```sh
curl -fsSL https://api.plan.ref.tools/plugins/install/local-agent | bash
```

Supports **Claude Code** and **Codex**. It signs you in through your browser — no API key to copy, no config files to edit — and installs:

- the `ref` CLI to allow your agents more access to control Ref
- hooks so Ref can track and manage your local agents
- the **Ref Plans** MCP server, so agents can read, write, and coordinate on plans

Re-run it anytime to upgrade in place. To sign in as a different account:

```sh
curl -fsSL https://api.plan.ref.tools/plugins/install/local-agent | bash -s -- --reconnect
```

To remove everything, see [Uninstall](#uninstall).

## Skills

Skills in this repo install through the Claude Code marketplace:

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-design-process@ref-tools
```

| Skill | What it does |
|---|---|
| `ref-design-process` | Guides agents through Ref's design process — how to structure a plan, and what to check before calling one done. (Stub — content coming.) |

## MCP servers

The install script already sets up Ref Plans for Claude Code and Codex, so **most people don't need this section.** 

| Plugin | What it does |
|---|---|
| `ref-context` | [Ref docs search](https://docs.ref.tools/context/install/index) — `ref_search_documentation` over public and private docs without burning your context window. Not included in the install script. |
| `ref-plan` | [Ref Plans](https://docs.ref.tools/plans/install/index) — list, create, read, and edit plans, and coordinate sub-agents. Same server the install script sets up; use this only if you skipped the script. |

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-context@ref-tools
```

You'll be prompted for your Ref API key when enabling either server. Get one at [ref.tools/keys](https://ref.tools/keys).

For Cursor, VS Code, Windsurf, ChatGPT, and others, see [docs.ref.tools](https://docs.ref.tools).

## Uninstall

```sh
curl -fsSL 'https://api.plan.ref.tools/plugins/install/local-agent?mode=uninstall' | bash -s -- --uninstall
```

Your API key stays active on your account — revoke it at [ref.tools/keys](https://ref.tools/keys) if you're done with it.

## Contributing

Load a plugin from disk without publishing:

```sh
claude --plugin-dir ./plugins/ref-context
```

`/reload-plugins` picks up edits mid-session. Validate before opening a PR:

```sh
claude plugin validate . --strict
```
