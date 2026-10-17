---
name: using-local-devices
description: Picking a device for a local agent and falling back to cloud when the device is offline. Use when launching an agent on a user's machine.
---

# Using local devices

A local launch runs on the user's own laptop, checkout, auth and toolchain — no cloud harness seat. Cloud harnesses stay the default; local is for when the user wants their own machine.

Call ref-plan:ListDevices first. It returns each paired laptop, the repo names its daemon advertised, and a state line: launchable now, launch disabled, or offline with the last poll age and the command that brings it back. When no launchable device is there, relay that state line and fall back to a cloud harness — enqueueing to an offline device fails at launch with "Device is offline".

ref-plan:LaunchAgent with harness "local" needs `deviceId` and `repo`. Take `repo` from that device's repo line. A device with no repo line runs an older daemon that does not advertise; an unmapped repo errors the agent record after launch rather than at enqueue.

`branch` is optional — omitted, the laptop fetches and cuts a worktree from the repo's default branch. `model` and `effort` are optional too; omitted or "auto", the laptop's own settings win.

A message to a live local session is held and delivered when the current session ends. Expect the delay; do not resend on silence.

When local ACP is on, expect wake messages for needs permission, errored, stopped by user, machine offline / back online, and turn ended. Watch and unblock with ref-plan:ManageAgent: `read` for status, pending permission and a compact log; `answer_permission` for an offered option — never `allow_always` (returns `needs_human`; tell the user); `set_config` for model/mode; `cancel` for the turn; `stop` for the run. Follow-ups stay in SendMessage, which resumes a stopped run in a new session. With no wakeups, `read` with `waitSeconds` instead of tight polling. An agent-scoped session may only drive its own children.

Local has no GitHub-side PR detection, so the child's ref-plan:PrLinks action "add" call is the only attach path. Repeat it in any follow-up that asks for another PR.

A laptop that dies mid-run can leave a child showing as working until a server sweep errors it after about fifteen minutes. Check with the user before assuming a silent local child is still alive.
