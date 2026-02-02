#!/bin/bash
set -Eeuo pipefail

PORT=5000
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
NODE_ENV=development
DEPLOY_RUN_PORT=5000

cd "${COZE_WORKSPACE_PATH}"

kill_port_if_listening() {
    local pids
    pids=$(ss -H -lntp 2>/dev/null | awk -v port="${DEPLOY_RUN_PORT}" '$4 ~ ":"port"$"' | grep -o 'pid=[0-9]*' | cut -d= -f2 | paste -sd' ' - || true)
    if [[ -z "${pids}" ]]; then
      echo "Port ${DEPLOY_RUN_PORT} is free."
      return
    fi
    echo "Port ${DEPLOY_RUN_PORT} in use by PIDs: ${pids} (SIGKILL)"
    echo "${pids}" | xargs -I {} kill -9 {}
    sleep 1
    pids=$(ss -H -lntp 2>/dev/null | awk -v port="${DEPLOY_RUN_PORT}" '$4 ~ ":"port"$"' | grep -o 'pid=[0-9]*' | cut -d= -f2 | paste -sd' ' - || true)
    if [[ -n "${pids}" ]]; then
      echo "Warning: port ${DEPLOY_RUN_PORT} still busy after SIGKILL, PIDs: ${pids}"
    else
      echo "Port ${DEPLOY_RUN_PORT} cleared."
    fi
}

# 清理前端和后端端口
echo "Clearing ports 5000 (frontend) and 5001 (backend) before start..."
kill_port_if_listening
DEPLOY_RUN_PORT=5001 kill_port_if_listening

# 启动后端服务（在后台）
echo "Starting backend server on port 5001..."
cd "${COZE_WORKSPACE_PATH}/server" && pnpm install
node src/index.js > /app/work/logs/bypass/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# 启动前端服务
cd "${COZE_WORKSPACE_PATH}/crypto-monitor"
echo "Installing frontend dependencies..."
pnpm install

echo "Starting frontend server on port ${PORT}..."
npx next dev --webpack --port $PORT > /app/work/logs/bypass/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# 等待服务启动
sleep 5

# 检查服务状态
if ss -lntp | grep -q ":5001.*LISTEN"; then
  echo "✓ Backend server is running on port 5001"
else
  echo "✗ Backend server failed to start"
  tail -20 /app/work/logs/bypass/backend.log
fi

if ss -lntp | grep -q ":5000.*LISTEN"; then
  echo "✓ Frontend server is running on port 5000"
else
  echo "✗ Frontend server failed to start"
  tail -20 /app/work/logs/bypass/frontend.log
fi

echo "All services started successfully!"
echo "Frontend: http://localhost:5000"
echo "Backend API: http://localhost:5001"
echo "WebSocket: ws://localhost:5001/ws"

# 保持脚本运行
wait $FRONTEND_PID $BACKEND_PID
