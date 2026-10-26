# Contributing

Thanks for helping improve the Ref marketplace. This repo holds Claude Code and Codex plugins and skills for [Ref](https://ref.tools).

## Develop a plugin locally

Load a plugin from disk without publishing:

```sh
claude --plugin-dir ./plugins/<name>
```

`/reload-plugins` picks up edits mid-session. Validate before opening a PR:

```sh
claude plugin validate . --strict
```

## Add a skill

Skills live under a plugin:

```text
plugins/<name>/skills/<skill>/SKILL.md
```

`SKILL.md` needs YAML frontmatter. The `name` must match the skill directory, and `description` should say when the skill applies:

```markdown
---
name: my-skill
description: Use when …
---

# My skill

…
```

Register the plugin (or update its entry) in both marketplace manifests:

- [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) — Claude Code
- [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json) — Codex

Keep versions and descriptions in sync with the plugin's own manifest files.

## Pull requests

1. Make your change on a branch.
2. Run `claude plugin validate . --strict`.
3. Open a PR against `main` describing what changed and how you tested it.

## Conduct and security

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). To report a vulnerability, see [SECURITY.md](SECURITY.md).
