#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

command -v timeout || {
  echo "build-verified.sh requires GNU timeout." >&2
  exit 69
}

vinext="${SITES_PROJECT_ROOT}/node_modules/.bin/vinext"
if [[ ! -x "${vinext}" ]]; then
  echo "vinext is unavailable. Run npm run install:ci and wait for it to finish before building." >&2
  exit 69
fi

# ---------------------------------------------------------------------------
# PWA build version
# ---------------------------------------------------------------------------

# Prefer the Git commit SHA so every deployed commit has a deterministic
# version. Fall back to a timestamp when Git metadata is unavailable.
if command -v git >/dev/null 2>&1 && git -C "${SITES_PROJECT_ROOT}" rev-parse --short HEAD >/dev/null 2>&1; then
  git_sha="$(git -C "${SITES_PROJECT_ROOT}" rev-parse --short HEAD)"
  build_version="$(date -u +%Y.%m.%d)-${git_sha}"
else
  build_version="$(date -u +%Y.%m.%d-%H%M%S)"
fi

echo "Building PWA version: ${build_version}"

cat > "${SITES_PROJECT_ROOT}/public/version.json" <<EOF
{
  "version": "${build_version}"
}
EOF

cat > "${SITES_PROJECT_ROOT}/lib/app-version.ts" <<EOF
// Generated automatically by scripts/build-verified.sh.
// Do not edit manually.
export const APP_VERSION = "${build_version}";
EOF

# Replace the generated build-version placeholder in the service worker.
sed \
  "s/__BUILD_VERSION__/${build_version}/g" \
  "${SITES_PROJECT_ROOT}/public/sw.template.js" \
  > "${SITES_PROJECT_ROOT}/public/sw.js"

echo "Running bounded vinext build..."

timeout \
  --signal=TERM \
  --kill-after="${SITES_BUILD_KILL_AFTER:-10s}" \
  "${SITES_BUILD_TIMEOUT:-3m}" \
  "${vinext}" build