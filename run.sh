#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/apps/frontend"
BACKEND_DIR="$ROOT_DIR/apps/backend"

BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_HOST="${FRONTEND_HOST:-127.0.0.1}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

DATABASE_URL="${DATABASE_URL:-postgresql+asyncpg://postgres:postgres@localhost:5432/trucking_saas}"
REDIS_URL="${REDIS_URL:-redis://localhost:6379/0}"
JWT_SECRET_KEY="${JWT_SECRET_KEY:-dev-local-secret-change-me}"
COOKIE_SECURE="${COOKIE_SECURE:-false}"
COOKIE_SAMESITE="${COOKIE_SAMESITE:-lax}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:$FRONTEND_PORT}"
BACKEND_URL="${BACKEND_URL:-http://localhost:$BACKEND_PORT}"
NEXT_PUBLIC_BACKEND_URL="${NEXT_PUBLIC_BACKEND_URL:-http://localhost:$BACKEND_PORT}"

BACKEND_PID=""
FRONTEND_PID=""

usage() {
  printf "Usage: ./run.sh [setup|check]\n"
  printf "\n"
  printf "Run without arguments to start the backend and frontend in this terminal.\n"
  printf "Press Ctrl+C to stop both processes.\n"
}

setup_local() {
  printf "Installing frontend dependencies...\n"
  (cd "$FRONTEND_DIR" && npm install)

  printf "Installing backend dependencies...\n"
  (cd "$BACKEND_DIR" && python3 -m venv .venv)
  (cd "$BACKEND_DIR" && .venv/bin/pip install -e ".[dev]")
}

ensure_dependencies() {
  if [ ! -x "$BACKEND_DIR/.venv/bin/uvicorn" ]; then
    printf "Backend dependencies are missing. Run ./run.sh setup first.\n" >&2
    exit 1
  fi

  if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    printf "Frontend dependencies are missing. Run ./run.sh setup first.\n" >&2
    exit 1
  fi
}

stop_processes() {
  trap - INT TERM EXIT
  printf "\nStopping app...\n"

  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi

  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [ -n "$FRONTEND_PID" ]; then
    wait "$FRONTEND_PID" 2>/dev/null || true
  fi

  if [ -n "$BACKEND_PID" ]; then
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
}

run_app() {
  ensure_dependencies

  trap stop_processes INT TERM EXIT

  printf "Starting backend:  http://localhost:%s\n" "$BACKEND_PORT"
  (
    cd "$BACKEND_DIR"
    DATABASE_URL="$DATABASE_URL" \
    REDIS_URL="$REDIS_URL" \
    JWT_SECRET_KEY="$JWT_SECRET_KEY" \
    COOKIE_SECURE="$COOKIE_SECURE" \
    COOKIE_SAMESITE="$COOKIE_SAMESITE" \
    FRONTEND_URL="$FRONTEND_URL" \
    BACKEND_URL="$BACKEND_URL" \
    .venv/bin/uvicorn app.main:app --host "$BACKEND_HOST" --port "$BACKEND_PORT"
  ) &
  BACKEND_PID="$!"

  printf "Starting frontend: http://localhost:%s\n" "$FRONTEND_PORT"
  (
    cd "$FRONTEND_DIR"
    BACKEND_URL="$BACKEND_URL" \
    NEXT_PUBLIC_BACKEND_URL="$NEXT_PUBLIC_BACKEND_URL" \
    npm run dev -- --hostname "$FRONTEND_HOST" --port "$FRONTEND_PORT"
  ) &
  FRONTEND_PID="$!"

  printf "\nLogs are streaming below. Press Ctrl+C to stop the app.\n\n"

  while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
    sleep 1
  done
}

check_all() {
  ensure_dependencies
  (cd "$FRONTEND_DIR" && npm run typecheck)
  (cd "$FRONTEND_DIR" && npm run lint)
  (
    cd "$BACKEND_DIR"
    DATABASE_URL="$DATABASE_URL" \
    REDIS_URL="$REDIS_URL" \
    JWT_SECRET_KEY="$JWT_SECRET_KEY" \
    .venv/bin/pytest
  )
  (cd "$BACKEND_DIR" && .venv/bin/ruff check .)
  (cd "$BACKEND_DIR" && .venv/bin/black --check app tests)
}

case "${1:-run}" in
  run)
    run_app
    ;;
  setup)
    setup_local
    ;;
  check)
    check_all
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage
    exit 1
    ;;
esac
