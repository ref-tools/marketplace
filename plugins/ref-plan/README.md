# ref-plan

Claude Code plugin for [Ref](https://docs.ref.tools/plans/install/index) — list, read, and write refs, and coordinate sub-agents.

The plugin wraps the streamable-HTTP MCP server at `https://api.plan.ref.tools/mcp` in **general mode**. After you enable it, tools such as `List`, `Read`, and `Write` are available.

## Install

Add the marketplace once, then install this plugin:

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-plan@ref-tools --config api_key=YOUR_REF_API_KEY
```

Plugin installation does not prompt for a Ref API key. Get one at [ref.tools/keys](https://ref.tools/keys) and pass it with `--config` as shown above.

If you installed the plugin without its key, configure it from inside Claude Code:

```text
/plugin configure ref-plan@ref-tools
```

## Team scoping

The API can scope requests to a team with `?teamId=<TEAM_ID>`. This plugin does not prompt for a team ID: plugin manifests have no conditional templating, so a blank value would become the literal URL `https://api.plan.ref.tools/mcp?teamId=`. Until that can be omitted cleanly, the plugin uses the base URL (the same default as the [Claude Code install docs](https://docs.ref.tools/plans/install/claude-code)).

If you need a team-scoped install today, add the server yourself:

```sh
claude mcp add --transport http RefPlan "https://api.plan.ref.tools/mcp?teamId=<TEAM_ID>" --header "x-ref-api-key: <YOUR_API_KEY>"
```
