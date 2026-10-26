# Common pitfalls

Habits that avoid wasting a phase.

- **Expired logins pass status checks.** The app can say "logged in" while every real call fails. Smoke-test each login before booting.
- **A shared constant changes flag-off behaviour.** Scope new behaviour to the flagged path.
- **Review bots don't converge by themselves.** Findings get narrower each round. Set the fix-or-defer bar up front; record deferred edges as follow-ups in the Bugs ref.
- **The user merges in their own order.** That changes which branch needs each conflict resolution. Re-check PR states after every merge.
- **Symlinked dependencies in a worktree break a few suites.** Note them as known; the integration run needs a real install in its own worktree.
- **A case-insensitive filesystem.** A generated `claude.md` loads as `CLAUDE.md` instructions. Never name generated files after instruction files.
- **Shell traps:**
  - zsh doesn't word-split `$VAR` lists; use `xargs`.
  - An apostrophe in a `gh api -f body='…'` reply breaks quoting; write the body to a file and use `-F body=@file`.
  - `rm -rf "$S"/*` is refused by some environments; use literal paths or `${S:?}`.
- **Refs are edited concurrently.** Re-read before every write to a shared section; never overwrite rows you didn't write.
- **Sandbox load.** Large fabricated datasets can wedge a shared local service. Tear the sandbox down as soon as capture is done; prefer throwaway services for long runs.
