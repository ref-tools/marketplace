#!/usr/bin/env bash
# Pre-flight checks before booting a UI-sweep sandbox.
# Usage:
#   CHECK_PORTS="3001 5433" \
#   CHECK_INSTALL_DIR="/path/to/worktree" \
#   CHECK_HEALTH_URLS="http://127.0.0.1:5433/" \
#   CHECK_LOGIN_CMDS='cli-a status'$'\n''cli-b whoami' \
#   bash scripts/preflight.sh
#
# Does not hard-code project ports, repos, or flags. Exits non-zero on failure.
set -euo pipefail

fail() { echo "preflight: $*" >&2; exit 1; }
ok() { echo "preflight: $*"; }

# --- Ports: refuse if something already listens (likely the user's server) ---
if [[ -n "${CHECK_PORTS:-}" ]]; then
  for port in ${CHECK_PORTS}; do
    if command -v ss >/dev/null 2>&1; then
      if ss -ltn "( sport = :${port} )" 2>/dev/null | grep -q ":${port}"; then
        fail "port ${port} is already in use — pick a free port for the sandbox"
      fi
    elif command -v lsof >/dev/null 2>&1; then
      if lsof -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
        fail "port ${port} is already in use — pick a free port for the sandbox"
      fi
    else
      ok "no ss/lsof; skipped listen check for port ${port}"
    fi
    ok "port ${port} is free"
  done
fi

# --- Stale install: package manifests newer than node_modules ---
if [[ -n "${CHECK_INSTALL_DIR:-}" ]]; then
  dir="${CHECK_INSTALL_DIR:?}"
  [[ -d "${dir}" ]] || fail "CHECK_INSTALL_DIR not a directory: ${dir}"
  if [[ -f "${dir}/package.json" ]]; then
    if [[ ! -d "${dir}/node_modules" ]]; then
      fail "node_modules missing under ${dir} — install before boot"
    fi
    newer="$(find "${dir}" -maxdepth 1 \( -name package.json -o -name package-lock.json -o -name pnpm-lock.yaml -o -name yarn.lock -o -name bun.lockb \) -newer "${dir}/node_modules" -print 2>/dev/null || true)"
    if [[ -n "${newer}" ]]; then
      fail "lockfile/package.json newer than node_modules in ${dir} — reinstall and clear the bundler cache"
    fi
    ok "install looks current in ${dir}"
  else
    ok "no package.json in ${dir}; skipped install check"
  fi
fi

# --- Shared local service health (HTTP) ---
if [[ -n "${CHECK_HEALTH_URLS:-}" ]]; then
  for url in ${CHECK_HEALTH_URLS}; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "${url}" || true)"
    if [[ "${code}" == "000" ]]; then
      fail "health check failed for ${url} (unreachable)"
    fi
    ok "health ${url} → HTTP ${code}"
  done
fi

# --- Login smoke tests: one tiny call per named CLI (newline-separated) ---
if [[ -n "${CHECK_LOGIN_CMDS:-}" ]]; then
  while IFS= read -r cmd; do
    [[ -z "${cmd}" ]] && continue
    ok "login smoke: ${cmd}"
    bash -c "${cmd}" || fail "login smoke failed: ${cmd}"
  done <<< "${CHECK_LOGIN_CMDS}"
fi

ok "all checks passed"
