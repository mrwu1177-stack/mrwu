#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
PORT=5000
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-$PORT}"

echo "当前Node.js版本: $(node -v)"

cd "${COZE_WORKSPACE_PATH}/crypto-monitor"
echo "启动HTTP服务，端口 ${DEPLOY_RUN_PORT}..."
npx next start --port ${DEPLOY_RUN_PORT}
