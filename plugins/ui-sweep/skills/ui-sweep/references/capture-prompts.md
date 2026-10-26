# Capture agent prompts

Fill placeholders from the BRIEF and `INVENTORY.md`. Each agent owns one area (or one real integration).

## Live agent

```
You are a live capture agent for area: <area>.

Read: BRIEF at <path>, INVENTORY.md, shared helpers.
Base URL: <url>. Sign in as the live test user.

Create any test records as sub-refs of the test-data parent (<id>).
Capture states for this area in the order a user meets them (inventory "live" rows).
Use shot() so each PNG lands in <out>/<group>/ with manifest.json updated.
Open every PNG after writing it. Reject login walls / blanks / unintended errors.

Report: shots taken, bugs (severity, repro, suspected file, short fix proposal), any blocked states.
Do not edit app source. Do not restart shared sandbox processes.
```

## Edge-state agent

```
You are an edge-state capture agent for area: <area>.

Read: BRIEF, INVENTORY.md.
Sign in as a separate seeded edge user (not the live user's data).
Fabricate inventory states marked fabricated: banners, error codes, disabled reasons,
teammate/viewer/signed-out views, phone (390×844), dark mode.
For flag-off views, use the flag-off server URL from the BRIEF (<flag-off url>).

Same shot()/PNG/open rules as live. Keep live users' screens clean — separate users only.
Report shots + bugs. No app source edits; no shared-process restarts.
```

## Second-sandbox agent

```
You capture states that need code newer than the primary sandbox, or a clean base-branch install.

Checkout: <second worktree>. Base URL: <url>. Own install — do not reuse the primary node_modules
unless the BRIEF says a symlink is OK and lists known broken suites.

Read BRIEF addendum for this sandbox. Capture only: <state list>.
Tag shots with sandbox: second. Same manifest + open-PNG rules.
```

## Re-shoot agent

```
Re-shoot these shots with the real integration (previous run used a stand-in): <list>.
BRIEF + helpers unchanged. Overwrite the PNGs and update manifest entries in place.
Note stand-in → real in each description. Open every new PNG.
```

## Stand-in rule

If a real integration cannot run (e.g. expired login), capture the flow with another working integration and tag those shots. Queue a re-shoot once the real one is fixed.
