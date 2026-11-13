# Ref

Read, write, and coordinate on refs through the hosted Ref MCP server. This plugin
keeps the install identifier `ref-plan` and the server name `RefPlan`.

## Install and connect

In Claude's web or desktop app, open **Customize > Plugins > Add > Add marketplace**,
enter `https://github.com/ref-tools/marketplace`, and add **ref-plan**. Connect Ref
when prompted and complete OAuth. A plugin installation alone does not sign you in.

For Claude Code:

```sh
claude plugin marketplace add ref-tools/marketplace
claude plugin install ref-plan@ref-tools
```

Open `/mcp` in Claude Code and authenticate the RefPlan server. No API key or Ref CLI
is required. Existing API-key users must sign in through OAuth after upgrading to
1.2.0; the plugin no longer reads the old `api_key` setting.

If another Ref connector already reaches the same server, Claude may reuse it and
show tools under its name, such as `Ref_Plan`. The memory module uses the connection
name returned by Claude.

The plugin also ships one skill, `ref-plans-setup`. When the Ref server is missing
or signed out, it has Claude ask you to sign in, or find and suggest the Ref Plans
connector, instead of guessing at Ref content. After you sign in, the browser tab
can stay on "Completing MCP authentication..." while Claude finishes the handoff.
That is expected; return to Claude.

A second skill, `ref-import-memory`, copies memories Claude already has (and any you
paste from another assistant) into Ref memory. Claude proposes the list first and
writes only what you confirm, skipping secrets and temporary state. Run it with
`/ref-plan:ref-import-memory`; Claude does not start it on its own.

## Optional memory

Memory is **off by default**. Enable **Automatic memory** in the plugin's
configuration (`/plugin configure ref-plan@ref-tools` in Claude Code), then start a
new chat. Disable that option to stop automatic recall.

On a compatible Claude Code host, the `prompt.context` module requests your personal
memory index through the existing MCP `Memory` tool. It adds that index alongside
native memory without replacing native instructions. The server supplies recall
and saving guidance; full memory bodies remain available on demand through MCP.
Connection failures preserve the original context and log one diagnostic per chat,
pointing you to connect Ref.

Automatic recall requires Claude Code 2.1.321+ and permission to run the module.
Check the Code tab's own runtime version with `/status`; the desktop app and the
terminal CLI can bundle different versions. Claude documents mods for Code, not
regular Chat or Cowork. Installing the plugin in those surfaces provides the MCP
connection, but does not establish that this memory module runs there.

Do not enable automatic memory in both this plugin and an existing Ref local
installation: that can add the same index twice. Choose one installation to own
automatic recall. The local installer additionally provides agent tracking and CLI
integration; this marketplace package does not replace those features.

For Codex's automatic memory hook, continue using the [local installer](../../README.md#easy-install).
This Claude module is not a Codex hook, and this update does not add it to the Codex
marketplace.

## Maintaining the module

`hooks/memory.js` is copied unchanged from
`local-agent/ref-plugin/hooks/memory.js` in the Ref source repository, and
the skills under `skills/` from `local-agent/ref-cloud-plugin/skills/` there. Keep
them aligned with those sources. The declarative
`hooks/memory.json` selects this package's existing `RefPlan` server name.

## References

- [Account plugins and private marketplaces](https://claude.com/docs/plugins/overview)
- [Where Claude Code mods run](https://code.claude.com/docs/en/plugins/mods/overview)
