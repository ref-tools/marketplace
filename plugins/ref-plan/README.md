# ref-plan

Claude Code plugin for [Ref Plans](https://docs.ref.tools/plans/install/index) — list, create, read, and edit plan documents, and coordinate sub-agents.

The plugin wraps the streamable-HTTP MCP server at `https://api.plan.ref.tools/mcp` in **general mode**. After you enable it, tools such as `List`, `Create`, `Read`, and `Edit` are available.

## Install

Add the marketplace once, then install this plugin:

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-plan@ref-tools
```

You'll be prompted for a Ref API key. Get one at [ref.tools/keys](https://ref.tools/keys).

## Team scoping

The Plans API can scope requests to a team with `?teamId=<TEAM_ID>`. This plugin does not prompt for a team ID: plugin manifests have no conditional templating, so a blank value would become the literal URL `https://api.plan.ref.tools/mcp?teamId=`. Until that can be omitted cleanly, the plugin uses the base URL (the same default as the [Claude Code install docs](https://docs.ref.tools/plans/install/claude-code)).

If you need a team-scoped install today, add the server yourself:

```sh
claude mcp add --transport http ref-plan "https://api.plan.ref.tools/mcp?teamId=<TEAM_ID>" --header "x-ref-api-key: <YOUR_API_KEY>"
```
