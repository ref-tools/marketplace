# Capture BRIEF template

Write one BRIEF per sandbox (and a short addendum for a second sandbox). Every capture agent reads it.

## Template

```markdown
# BRIEF — ui-sweep capture

## Isolation (do not violate)
- User's running servers, ports, and hot-reload checkout are off limits.
- Use only this sandbox: ports, data, and checkout below.
- External calls: test/throwaway config only — never real or staging credentials.
- Test records: create as sub-refs of the test-data parent only.

## Sandbox
- Worktree / checkout: <path>
- Boot: <command>
- Base URL: <url>
- Ports: <list>
- Env file / secrets location: <path> (sandbox-only)
- Feature flags for this copy: <how to set>
- Test-data parent ref id: <id>
- Seeded users: <live user> | <edge user(s)>

## Library
- Shared helpers: <path to scripts/lib.ts or project helpers>
- signIn(page, user): <how>
- shot(page, group, name, meta): writes PNG + appends to <group>/manifest.json
- Reuse from inventory (call as-is): <list>

## Output format
Each capture writes under <out>/<group>/:
- <name>.png
- manifest.json — array of shot records (see schema)

After every PNG: open the file and confirm it shows the intended UI (not a login wall, blank page, or error you didn't mean to capture).

## Bug reports
For each bug: severity (blocker|high|medium|low), repro steps, suspected file, one- or two-line fix proposal.

## Area ownership
You own only: <area>. Do not edit tracked app source. Do not restart shared sandbox processes or flip flags unless this brief says you may.
```

## Manifest schema

`manifest.json` in each group directory is a JSON array:

```json
[
  {
    "file": "settings-billing-empty.png",
    "title": "Billing — empty card error",
    "description": "Inline validation under card number after Save.",
    "viewport": "1440x900",
    "area": "Billing settings",
    "state": "validation error",
    "bugs": [
      {
        "severity": "medium",
        "repro": "…",
        "suspectedFile": "…",
        "fixProposal": "…"
      }
    ]
  }
]
```

Required keys per shot: `file`, `title`, `description`, `viewport`, `area`, `state`. `bugs` may be `[]`.
