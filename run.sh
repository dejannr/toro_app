#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_DIR="$ROOT_DIR/.run"
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

usage() {
  printf "Usage: ./run.sh {setup|start|start-local|stop|status|logs|check}\n"
}

has_docker() {
  command -v docker >/dev/null 2>&1
}

has_screen() {
  command -v screen >/dev/null 2>&1
}

screen_session_exists() {
  local sessions
  sessions="$(screen -ls 2>/dev/null || true)"
  printf "%s\n" "$sessions" | grep -q "[.]$1[[:space:]]"
}

port_pid() {
  local port="$1"
  lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true
}

setup_local() {
  printf "Installing frontend dependencies...\n"
  (cd "$FRONTEND_DIR" && npm install)

  printf "Installing backend dependencies...\n"
  (cd "$BACKEND_DIR" && python3 -m venv .venv)
  (cd "$BACKEND_DIR" && .venv/bin/pip install -e ".[dev]")
}

start_docker() {
  printf "Starting Docker Compose stack...\n"
  (cd "$ROOT_DIR" && docker compose up --build -d)
  printf "Running backend migrations...\n"
  (cd "$ROOT_DIR" && docker compose run --rm backend alembic upgrade head)
  printf "Frontend: http://localhost:3000\n"
  printf "Backend:  http://localhost:8000\n"
}

start_local() {
  mkdir -p "$RUN_DIR"

  if [ ! -x "$BACKEND_DIR/.venv/bin/uvicorn" ]; then
    printf "Backend dependencies are missing. Run ./run.sh setup first.\n" >&2
    exit 1
  fi

  if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    printf "Frontend dependencies are missing. Run ./run.sh setup first.\n" >&2
    exit 1
  fi

  if has_screen && screen_session_exists toro_backend; then
    printf "Backend is already running.\n"
  elif [ -f "$RUN_DIR/backend.pid" ] && kill -0 "$(cat "$RUN_DIR/backend.pid")" 2>/dev/null; then
    printf "Backend is already running.\n"
  else
    printf "Starting backend on http://%s:%s...\n" "$BACKEND_HOST" "$BACKEND_PORT"
    if has_screen; then
      screen -dmS toro_backend bash -lc "
        cd '$BACKEND_DIR'
        DATABASE_URL='$DATABASE_URL' \
        REDIS_URL='$REDIS_URL' \
        JWT_SECRET_KEY='$JWT_SECRET_KEY' \
        COOKIE_SECURE='$COOKIE_SECURE' \
        COOKIE_SAMESITE='$COOKIE_SAMESITE' \
        FRONTEND_URL='$FRONTEND_URL' \
        BACKEND_URL='$BACKEND_URL' \
        .venv/bin/uvicorn app.main:app --host '$BACKEND_HOST' --port '$BACKEND_PORT' \
          > '$RUN_DIR/backend.log' 2>&1
      "
    else
      (
        cd "$BACKEND_DIR"
        DATABASE_URL="$DATABASE_URL" \
        REDIS_URL="$REDIS_URL" \
        JWT_SECRET_KEY="$JWT_SECRET_KEY" \
        COOKIE_SECURE="$COOKIE_SECURE" \
        COOKIE_SAMESITE="$COOKIE_SAMESITE" \
        FRONTEND_URL="$FRONTEND_URL" \
        BACKEND_URL="$BACKEND_URL" \
        nohup .venv/bin/uvicorn app.main:app --host "$BACKEND_HOST" --port "$BACKEND_PORT" \
          > "$RUN_DIR/backend.log" 2>&1 &
        printf "%s" "$!" > "$RUN_DIR/backend.pid"
      )
    fi
  fi

  if has_screen && screen_session_exists toro_frontend; then
    printf "Frontend is already running.\n"
  elif [ -f "$RUN_DIR/frontend.pid" ] && kill -0 "$(cat "$RUN_DIR/frontend.pid")" 2>/dev/null; then
    printf "Frontend is already running.\n"
  else
    printf "Starting frontend on http://%s:%s...\n" "$FRONTEND_HOST" "$FRONTEND_PORT"
    if has_screen; then
      screen -dmS toro_frontend bash -lc "
        cd '$FRONTEND_DIR'
        BACKEND_URL='$BACKEND_URL' \
        NEXT_PUBLIC_BACKEND_URL='$NEXT_PUBLIC_BACKEND_URL' \
        npm run dev -- --hostname '$FRONTEND_HOST' --port '$FRONTEND_PORT' \
          > '$RUN_DIR/frontend.log' 2>&1
      "
    else
      (
        cd "$FRONTEND_DIR"
        BACKEND_URL="$BACKEND_URL" \
        NEXT_PUBLIC_BACKEND_URL="$NEXT_PUBLIC_BACKEND_URL" \
        nohup npm run dev -- --hostname "$FRONTEND_HOST" --port "$FRONTEND_PORT" \
          > "$RUN_DIR/frontend.log" 2>&1 &
        printf "%s" "$!" > "$RUN_DIR/frontend.pid"
      )
    fi
  fi

  printf "Frontend: http://localhost:%s\n" "$FRONTEND_PORT"
  printf "Backend:  http://localhost:%s\n" "$BACKEND_PORT"
  printf "Logs:     ./run.sh logs\n"
}

stop_local() {
  if has_screen; then
    for session in toro_frontend toro_backend; do
      if screen_session_exists "$session"; then
        printf "Stopping %s...\n" "$session"
        screen -S "$session" -X quit
      fi
    done
  fi

  for service in frontend backend; do
    pid_file="$RUN_DIR/$service.pid"
    if [ -f "$pid_file" ]; then
      pid="$(cat "$pid_file")"
      if kill -0 "$pid" 2>/dev/null; then
        printf "Stopping %s...\n" "$service"
        kill "$pid"
      fi
      rm -f "$pid_file"
    fi
  done

  for port in "$FRONTEND_PORT" "$BACKEND_PORT"; do
    for pid in $(port_pid "$port"); do
      printf "Stopping process %s on port %s...\n" "$pid" "$port"
      kill "$pid" 2>/dev/null || true
    done
  done
}

stop_all() {
  stop_local
  if has_docker; then
    printf "Stopping Docker Compose stack if present...\n"
    (cd "$ROOT_DIR" && docker compose down)
  fi
}

status_local() {
  local frontend_pid
  local backend_pid
  frontend_pid="$(port_pid "$FRONTEND_PORT" | tr '\n' ' ')"
  backend_pid="$(port_pid "$BACKEND_PORT" | tr '\n' ' ')"

  if has_screen; then
    for session in toro_frontend toro_backend; do
      if screen_session_exists "$session"; then
        printf "%s: running in screen session\n" "$session"
      else
        printf "%s: stopped\n" "$session"
      fi
    done
    if [ -n "$frontend_pid" ]; then
      printf "frontend port %s: listening pid %s\n" "$FRONTEND_PORT" "$frontend_pid"
    else
      printf "frontend port %s: not listening\n" "$FRONTEND_PORT"
    fi
    if [ -n "$backend_pid" ]; then
      printf "backend port %s: listening pid %s\n" "$BACKEND_PORT" "$backend_pid"
    else
      printf "backend port %s: not listening\n" "$BACKEND_PORT"
    fi
    return
  fi

  for service in frontend backend; do
    pid_file="$RUN_DIR/$service.pid"
    if [ -f "$pid_file" ] && kill -0 "$(cat "$pid_file")" 2>/dev/null; then
      printf "%s: running pid %s\n" "$service" "$(cat "$pid_file")"
    else
      printf "%s: stopped\n" "$service"
    fi
  done
}

logs_local() {
  mkdir -p "$RUN_DIR"
  touch "$RUN_DIR/frontend.log" "$RUN_DIR/backend.log"
  tail -f "$RUN_DIR/backend.log" "$RUN_DIR/frontend.log"
}

check_all() {
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

case "${1:-}" in
  setup)
    setup_local
    ;;
  start)
    if has_docker; then
      start_docker
    else
      start_local
    fi
    ;;
  start-local)
    start_local
    ;;
  stop)
    stop_all
    ;;
  status)
    status_local
    ;;
  logs)
    logs_local
    ;;
  check)
    check_all
    ;;
  *)
    usage
    exit 1
    ;;
esac
