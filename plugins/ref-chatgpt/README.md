# ref-chatgpt

ChatGPT plugin directory package. This folder is uploaded to the OpenAI plugin portal. It is not a Claude Code or Codex marketplace plugin, so it is not listed in the marketplace manifests.

## Rebuild the ZIP

From the repository root:

```sh
cd plugins/ref-chatgpt && zip -r ../../ref-chatgpt-1.0.0.zip . -x '*.DS_Store' README.md
```

That writes `ref-chatgpt-1.0.0.zip` at the repository root, with `plugin.json` at the archive root. Do not commit the ZIP.

Bump `version` on every resubmission; `name` must stay `ref`.
