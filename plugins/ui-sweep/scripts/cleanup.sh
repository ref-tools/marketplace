#!/usr/bin/env bash
# List, then remove, UI-sweep sandbox leftovers.
# Requires explicit paths via env — refuses unguarded variables.
#
# Usage:
#   SWEEP_WORKTREE=/tmp/sweep-wt \
#   SWEEP_DIR=/tmp/sweep-out \
#   SWEEP_BRANCHES="sweep/billing sweep/checkout" \
#   SWEEP_PID_FILE=/tmp/sweep-pids \
#   bash scripts/cleanup.sh
#
# Set SWEEP_DRY_RUN=1 to only list.
set -euo pipefail

DRY="${SWEEP_DRY_RUN:-0}"

list() { echo "cleanup: $*"; }

remove_path() {
  local p="${1:?path required}"
  list "would remove path: ${p}"
  if [[ "${DRY}" == "1" ]]; then
    return 0
  fi
  if [[ -e "${p}" || -L "${p}" ]]; then
    rm -rf "${p}"
    echo "cleanup: removed ${p}"
  else
    echo "cleanup: skip (missing) ${p}"
  fi
}

# --- Processes from a pid file (one pid per line) ---
if [[ -n "${SWEEP_PID_FILE:-}" ]]; then
  pf="${SWEEP_PID_FILE:?}"
  if [[ -f "${pf}" ]]; then
    list "pid file ${pf}:"
    cat "${pf}" || true
    if [[ "${DRY}" != "1" ]]; then
      while IFS= read -r pid; do
        [[ -z "${pid}" ]] && continue
        if kill -0 "${pid}" 2>/dev/null; then
          kill "${pid}" 2>/dev/null || true
          echo "cleanup: signaled pid ${pid}"
        fi
      done < "${pf}"
      rm -f "${pf}"
    fi
  else
    list "no pid file at ${pf}"
  fi
fi

# --- Worktree ---
if [[ -n "${SWEEP_WORKTREE:-}" ]]; then
  wt="${SWEEP_WORKTREE:?}"
  list "worktree: ${wt}"
  if [[ -d "${wt}" ]]; then
    if [[ "${DRY}" != "1" ]] && command -v git >/dev/null 2>&1; then
      git worktree remove --force "${wt}" 2>/dev/null || remove_path "${wt}"
    else
      remove_path "${wt}"
    fi
  fi
fi

# --- Local branches (space-separated names) ---
if [[ -n "${SWEEP_BRANCHES:-}" ]]; then
  list "branches: ${SWEEP_BRANCHES}"
  if [[ "${DRY}" != "1" ]] && command -v git >/dev/null 2>&1; then
    # Avoid zsh/word-split surprises: iterate via xargs
    printf '%s\n' ${SWEEP_BRANCHES} | xargs -n1 -I{} git branch -D {} 2>/dev/null || true
  fi
fi

# --- Sandbox output / temp dir ---
if [[ -n "${SWEEP_DIR:-}" ]]; then
  remove_path "${SWEEP_DIR:?}"
fi

# Optional second sandbox dir
if [[ -n "${SWEEP_DIR_2:-}" ]]; then
  remove_path "${SWEEP_DIR_2:?}"
fi

echo "cleanup: done (dry_run=${DRY})"
