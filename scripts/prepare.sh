#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

cd "${COZE_WORKSPACE_PATH}"

echo "当前Node.js版本: $(node -v)"

echo "安装依赖..."
pnpm install --prefer-frozen-lockfile --prefer-offline --loglevel debug --reporter=append-only
