---
name: ref-plans-setup
description: Use when the user wants Ref (ref.tools) plans, refs or Ref memory but no tools from the Ref Plans server at https://api.plan.ref.tools/mcp (such as Home, List, Read, Write or Memory) are available in this session, or a call to them fails because that server is not connected or needs sign-in.
---

# Connect Ref Plans

Ref's plans, refs and memory come from the Ref Plans MCP server at
`https://api.plan.ref.tools/mcp`. This plugin adds automatic memory and guidance on
top of that server; without it, nothing in Ref is available. Help the user connect
it, then continue their task.

1. If tools from this server are available and respond, use them. This skill does
   not apply. Tools from a different Ref server, such as production Ref while this
   plugin targets staging, do not count: never answer from them instead.
2. If this plugin's Ref server is listed but needs sign-in, ask the user to connect
   it: in Claude Code, run `/mcp` and authenticate it; in the Claude app, use
   Connect for this plugin's connector. Sign-in finishes in the browser and hands
   back to Claude, so the browser tab can keep showing "Completing MCP
   authentication..." after it has succeeded.
3. Otherwise, suggest the Ref Plans connector. If you have connector search tools,
   search for "Ref" and suggest only a result whose URL is the server above. If
   none matches, ask the user to add a custom connector with that URL in their
   Claude connector settings (claude.ai/customize/connectors), or to ask an
   organization Owner to add it for the organization.
4. A newly connected connector can appear in this session or only in the next
   one. If Ref tools do not appear, ask the user to start a new chat.

While Ref is not connected, do not invent plan contents, refs or memories. Finish
whatever part of the task does not need Ref, and say what is waiting on the
connection.
