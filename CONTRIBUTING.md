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

New Ref skills go under `plugins/ref-skills/skills/<name>/` (one plugin bundle; each skill keeps its own `SKILL.md`).

1. Add the skill directory:
   - `plugins/ref-skills/skills/<name>/SKILL.md` — YAML frontmatter with `name` (matching the skill directory) and `description`, then the skill body
   - Update `plugins/ref-skills/.claude-plugin/plugin.json` and the `ref-skills` entry in [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) if the bundle description should mention the new skill (keep versions in sync)

2. For a new standalone plugin (MCP servers, not Ref skills), create `plugins/<name>/` with `.claude-plugin/plugin.json` and register it in both marketplace manifests:
   - [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) (Claude Code)
   - [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json) (Codex; may land in a parallel PR)

3. Run `claude plugin validate . --strict`, then open a PR.

## Naming

In prose, use **Ref** and **refs**. Keep existing identifiers (`ref-plan`, MCP tool names, API hosts) unchanged.

## Security and conduct

- Report vulnerabilities per [SECURITY.md](SECURITY.md).
- By participating, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
