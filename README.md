# Ref Marketplace

A Claude Code plugin marketplace for [Ref](https://ref.tools).

#### What is Ref?

Ref is a tool for plan authorship and review. Humans and agents work together in shared plan documents: you write and review plans as a team, agents read them, do the work, and report progress back to the plan.

Plan Review moves alignment up front — the team ratifies key decisions before the code gets written, instead of after in code review. It's the cure for [Velocity Sickness](https://ref.tools/blog/ai-broke-alignment).


## Install

Add the marketplace once:

```sh
claude plugin marketplace add ref-tools/marketplace
```

Then install the plugins you want:

```sh
claude plugin install ref-plan@ref-tools
claude plugin install ref-context@ref-tools
claude plugin install ref-design-process@ref-tools
```

You'll be prompted for your Ref API key when enabling an MCP server plugin. Get a key at [ref.tools/keys](https://ref.tools/keys).

## Plugins

| Plugin | What it does |
|---|---|
| `ref-plan` | MCP server for [Ref Plans](https://docs.ref.tools/plans/install/index) — list, create, read, and edit plan documents, and coordinate sub-agents. |
| `ref-context` | MCP server for [Ref docs search](https://docs.ref.tools/context/install/index) — `ref_search_documentation` over public and private docs without wasting your context window. |
| `ref-design-process` | A skill that guides agents through Ref's design process. (Stub — content coming.) |

For full details — other editors and team scoping — see [docs.ref.tools](https://docs.ref.tools).

## Project-scope installs for teams

Teams that want the plugins committed to source control use `--scope project`:

```sh
claude plugin marketplace add ref-tools/marketplace --scope project
claude plugin install ref-plan@ref-tools --scope project
claude plugin install ref-context@ref-tools --scope project
claude plugin install ref-design-process@ref-tools --scope project
```

`marketplace add --scope project` writes `extraKnownMarketplaces` into the project's `.claude/settings.json`. Each `plugin install --scope project` writes that plugin into `enabledPlugins`. Commit the file so teammates who trust the project pick the plugins up automatically instead of installing by hand.

## API keys stay per-user, even at project scope

Do not commit a shared Ref API key. Claude Code reads `pluginConfigs` from only three sources — managed settings, `--settings`, and user settings. Entries in a project's `.claude/settings.json` (or `.claude/settings.local.json`) are ignored: a v2.1.207 security change so a cloned repo can't inject values into server configs.

The practical consequence: `enabledPlugins` is shared via the committed project settings, but every team member is still prompted for their own Ref API key when the plugin is enabled. Sensitive values go to the OS keychain, not into any settings file. On macOS they fall back to `~/.claude/.credentials.json` if the Keychain rejects the write; platforms without a supported keychain always use that file.

## Local development for contributors

To work on a plugin in this repo, load it straight from disk without publishing:

```sh
claude --plugin-dir ./plugins/ref-context
```

`/reload-plugins` picks up edits mid-session.

Validate the marketplace before opening a PR:

```sh
claude plugin validate . --strict
```
