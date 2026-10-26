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

1. Create a plugin under `plugins/<name>/` with:
   - `.claude-plugin/plugin.json` — at least `name`, `version`, and `description`
   - `skills/<skill>/SKILL.md` — YAML frontmatter with `name` (matching the skill directory) and `description`, then the skill body

2. Register the plugin in both marketplace manifests (keep versions in sync with `plugin.json`):
   - [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) (Claude Code)
   - [`.agents/plugins/marketplace.json`](.agents/plugins/marketplace.json) (Codex; may land in a parallel PR)

3. Run `claude plugin validate . --strict`, then open a PR.

## Naming

In prose, use **Ref** and **refs**. Keep existing identifiers (`ref-plan`, MCP tool names, API hosts) unchanged.

## Security and conduct

- Report vulnerabilities per [SECURITY.md](SECURITY.md).
- By participating, you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
