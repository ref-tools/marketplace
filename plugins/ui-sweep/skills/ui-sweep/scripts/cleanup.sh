#!/usr/bin/env bash
# List, then remove, UI-sweep sandbox leftovers.
# Requires explicit paths via env — refuses unguarded variables.
# Never removes the durable `.ui-sweep/` scaffold at the repo root.
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

# Refuse destructive targets: /, $HOME, git toplevel, `.ui-sweep/`, shallow paths (<2 components).
assert_safe_path() {
  local raw="${1:?path required}"
  local abs
  if [[ "${raw}" = /* ]]; then
    abs="${raw}"
  elif [[ -e "${raw}" || -L "${raw}" ]]; then
    abs="$(cd "$(dirname -- "${raw}")" && pwd)/$(basename -- "${raw}")"
  else
    abs="$(pwd)/${raw}"
  fi
  while [[ "${abs}" == */ && "${abs}" != / ]]; do
    abs="${abs%/}"
  done

  if [[ "${abs}" == / ]]; then
    echo "cleanup: refusing to remove /" >&2
    exit 1
  fi

  local base
  base="$(basename -- "${abs}")"
  if [[ "${base}" == ".ui-sweep" ]]; then
    echo "cleanup: refusing to remove durable scaffold .ui-sweep (${abs})" >&2
    exit 1
  fi
  # Also refuse anything under a .ui-sweep directory
  if [[ "${abs}" == */.ui-sweep || "${abs}" == */.ui-sweep/* ]]; then
    echo "cleanup: refusing to remove path under .ui-sweep (${abs})" >&2
    exit 1
  fi

  local home="${HOME:-}"
  if [[ -n "${home}" ]]; then
    local home_abs
    home_abs="$(cd "${home}" 2>/dev/null && pwd)" || home_abs="${home}"
    while [[ "${home_abs}" == */ && "${home_abs}" != / ]]; do
      home_abs="${home_abs%/}"
    done
    if [[ "${abs}" == "${home_abs}" ]]; then
      echo "cleanup: refusing to remove \$HOME (${abs})" >&2
      exit 1
    fi
  fi

  if command -v git >/dev/null 2>&1; then
    local toplevel
    toplevel="$(git rev-parse --show-toplevel 2>/dev/null || true)"
    if [[ -n "${toplevel}" ]]; then
      while [[ "${toplevel}" == */ && "${toplevel}" != / ]]; do
        toplevel="${toplevel%/}"
      done
      if [[ "${abs}" == "${toplevel}" ]]; then
        echo "cleanup: refusing to remove git toplevel (${abs})" >&2
        exit 1
      fi
      if [[ "${abs}" == "${toplevel}/.ui-sweep" || "${abs}" == "${toplevel}/.ui-sweep/"* ]]; then
        echo "cleanup: refusing to remove durable scaffold .ui-sweep (${abs})" >&2
        exit 1
      fi
    fi
  fi

  local count=0
  local rest="${abs#/}"
  if [[ -n "${rest}" ]]; then
    local IFS=/
    # shellcheck disable=SC2206
    local parts=(${rest})
    count=${#parts[@]}
  fi
  if (( count < 2 )); then
    echo "cleanup: refusing path with fewer than 2 components: ${abs}" >&2
    exit 1
  fi
}

remove_path() {
  local p="${1:?path required}"
  assert_safe_path "${p}"
  list "would remove path: ${p}"
  if [[ "${DRY}" == "1" ]]; then
    return 0
  fi
  if [[ -e "${p}" || -L "${p}" ]]; then
    rm -rf -- "${p}"
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
      rm -f -- "${pf}"
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
    # Avoid zsh/word-split surprises: iterate via xargs (-I implies one arg per line)
    printf '%s\n' ${SWEEP_BRANCHES} | xargs -I{} git branch -D {} 2>/dev/null || true
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
