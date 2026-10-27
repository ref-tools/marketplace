# Inventory agent prompt

Use with a read-only research subagent. Save the result as `INVENTORY.md` in the catalog workspace.

## Prompt skeleton

```
You are the inventory agent for a UI sweep. Read-only: do not edit code, boot servers, or write refs.

Feature context:
- Feature refs / PRs / commits: <list>
- Catalog workspace path: <path>

Goal: list every user-visible screen and state this feature added or changed, grouped by area.

For each state, record:
- area (UI surface or flow name)
- state name (healthy / variant / error / empty / loading / permission / flag-off / …)
- click path from a known entry point
- data that triggers it
- reachability: live stack vs needs fabricated data
- exactly which record, fixture, factory, seed script, or API call produces it
- viewport notes if non-default

Also list existing testing assets to reuse (do not rewrite):
- fixtures, factories, seed scripts
- sign-in and page helpers
- screenshot or visual-test utilities
- any earlier sweep scripts or refs

Write INVENTORY.md at <path> with:
1. Areas (H2) → states (bullets with the fields above)
2. Reusable assets
3. Gaps (what the sweep must invent)

Report back a short summary: area count, state count, live vs fabricated split, top gaps.
```

## Catalog fields per state (required)

| Field | Example |
| --- | --- |
| area | Billing settings |
| state | validation error — empty card |
| click_path | Settings → Billing → Save with blank number |
| trigger_data | empty `cardNumber` on submit |
| reachability | live \| fabricated |
| producer | fixture `billing/empty-card` or API `POST /billing` 422 |
| notes | also phone-width (390×844) + dark |
