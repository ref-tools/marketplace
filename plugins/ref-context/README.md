# ref-context

Claude Code plugin for [Ref Context](https://docs.ref.tools/context/install/index) — documentation search over public and private docs without wasting your context window.

The plugin wraps the streamable-HTTP MCP server at `https://api.ref.tools/mcp`. After you enable it, `ref_search_documentation` is available as a tool.

## Install

Add the marketplace once, then install this plugin:

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-context@ref-tools
```

You'll be prompted for a Ref API key. Get one at [ref.tools/keys](https://ref.tools/keys).
