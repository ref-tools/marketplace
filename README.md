<a href="https://ref.tools"><img src="https://docs.ref.tools/logo/ref-wordmark-light.png" alt="Ref" width="120"></a>

Plugins and Skills for [Ref](https://ref.tools).

[![Website](https://img.shields.io/badge/Website-ref.tools-2b7bbf)](https://ref.tools) [![License: MIT](https://img.shields.io/badge/License-MIT-5a9e1a)](LICENSE)

#### What is Ref?

Ref is a tool for plan authorship and review. Humans and agents work together in shared refs: you write and review refs as a team, agents read them, do the work, and report progress back.

Review moves alignment up front: the team ratifies key decisions before the code gets written, instead of after in code review. It's the cure for [Velocity Sickness](https://ref.tools/blog/ai-broke-alignment).

## Easy install

**Run the install script.** It sets up every supported agent it finds on your machine:

```sh
curl -fsSL https://api.plan.ref.tools/plugins/install/local-agent | bash
```

Supports **Claude Code** and **Codex**. It signs you in through your browser — no API key to copy, no config files to edit — and installs:

- the `ref` CLI to allow your agents more access to control Ref
- hooks so Ref can track and manage your local agents
- the **Ref** MCP server, so agents can read, write, and coordinate on refs

Re-run it anytime to upgrade in place. To sign in as a different account:

```sh
curl -fsSL https://api.plan.ref.tools/plugins/install/local-agent | bash -s -- --reconnect
```

To remove everything, see [Uninstall](#uninstall).

## Skills

Skills in this repo install through the Claude Code marketplace:

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-skills@ref-tools
```

| Skill | What it does |
|---|---|
| `ref-skills:ui-sweep` | Agent skill for web apps — sandbox the app, catalog every screen into a Ref, report bugs with fix proposals, leave a reusable `.ui-sweep/` scaffold; with `--fix`, ship draft PRs and work the review loop. Works with any agent that reads SKILL.md. Requires the Ref MCP. |

## MCP servers

The install script already sets up Ref for Claude Code and Codex, so **most people don't need this section.**

| Plugin | What it does |
|---|---|
| `ref-context` | [Ref docs search](https://docs.ref.tools/context/install/index) — `ref_search_documentation` over public and private docs without burning your context window. Not included in the install script. |
| `ref-plan` | [Ref](https://docs.ref.tools/plans/install/index) — list, read, and write refs, and coordinate sub-agents. Same server the install script sets up; use this only if you skipped the script. |

### Claude Code

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-context@ref-tools --config api_key=YOUR_REF_API_KEY
claude plugin install ref-plan@ref-tools --config api_key=YOUR_REF_API_KEY
```

Plugin installation does not prompt for a Ref API key; get one at [ref.tools/keys](https://ref.tools/keys) and pass it with `--config` as shown above.

If you installed a plugin without its key, configure it from inside Claude Code:

```text
/plugin configure ref-context@ref-tools
/plugin configure ref-plan@ref-tools
```

### Codex

```sh
codex plugin marketplace add ref-tools/marketplace
codex plugin add ref-context@ref-skills
```

Or open `/plugins` and install from the **Ref Skills** marketplace. `ref-context` signs in with OAuth. For `ref-plan` on Codex, use the [install script](#easy-install) above (Codex plugins cannot take an API key).

For Cursor, VS Code, Windsurf, ChatGPT, and others, see [docs.ref.tools](https://docs.ref.tools).

## Uninstall

```sh
curl -fsSL 'https://api.plan.ref.tools/plugins/install/local-agent?mode=uninstall' | bash -s -- --uninstall
```

Your API key stays active on your account — revoke it at [ref.tools/keys](https://ref.tools/keys) if you're done with it.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
