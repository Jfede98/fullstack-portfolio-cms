#!/usr/bin/env bash
# =============================================================================
# Sincronización bidireccional GitHub ↔ Harness (sin conector entre ambos)
# Se ejecuta desde Husky pre-push. Según el remoto al que haces push:
#   - Push a origin (GitHub)  → también empuja a Harness
#   - Push a harness          → también empuja a origin (GitHub)
#
# Uso manual: ./.scripts/sync-harness.sh [origin|harness]
#   Sin argumentos: asume que el push fue a origin (sincroniza a Harness).
#
# Credenciales:
#   - Push a origin: .env.harness con HARNESS_* (para tu equipo, que trabaja desde GitHub).
#   - Push a harness: .env.harness con GITHUB_USERNAME y GITHUB_PAT (para quien trabaja desde Harness).
# =============================================================================

set -e

# Remoto al que se está haciendo push (pasado por el hook pre-push)
PUSH_REMOTE="${1:-origin}"

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$REPO_ROOT" ]; then
  echo "[sync-remotes] No es un repositorio git. Se omite."
  exit 0
fi

cd "$REPO_ROOT"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# -----------------------------------------------------------------------------
# Push a HARNESS → sincronizar a origin (GitHub)
# Quien trabaja desde Harness debe tener origin apuntando al repo de GitHub
# y credenciales en .env.harness: GITHUB_PAT (y opcionalmente GITHUB_USERNAME).
# -----------------------------------------------------------------------------
if [ "$PUSH_REMOTE" = "harness" ]; then
  if ! git remote get-url origin &>/dev/null; then
    echo "[sync-remotes] Remoto origin no configurado. Solo push a Harness."
    exit 0
  fi

  # Cargar .env.harness por si tiene GITHUB_PAT (para quien trabaja desde Harness)
  if [ -f ".env.harness" ]; then
    set -a
    # shellcheck source=/dev/null
    source ".env.harness"
    set +a
  fi

  if [ -n "${GITHUB_PAT}" ]; then
    ORIGIN_URL="$(git remote get-url origin)"
    if [[ "$ORIGIN_URL" == https://* ]]; then
      ORIGIN_PATH="${ORIGIN_URL#https://}"
      ORIGIN_PATH="${ORIGIN_PATH#*@}"
      # GitHub HTTPS: usuario + PAT (si no hay GITHUB_USERNAME se usa el PAT como usuario)
      git remote set-url origin "https://${GITHUB_USERNAME:-git}:${GITHUB_PAT}@${ORIGIN_PATH}"
    fi
  fi

  echo "[sync-remotes] Push fue a Harness → empujando rama $CURRENT_BRANCH a origin (GitHub)..."
  git push origin "$CURRENT_BRANCH" --force --no-verify
  echo "[sync-remotes] Listo."
  exit 0
fi

# -----------------------------------------------------------------------------
# Push a ORIGIN (GitHub) → sincronizar a Harness
# -----------------------------------------------------------------------------
if [ "$PUSH_REMOTE" != "origin" ]; then
  echo "[sync-remotes] Push a $PUSH_REMOTE: no se sincroniza con Harness ni origin."
  exit 0
fi

# Cargar credenciales Harness
if [ -f ".env.harness" ]; then
  set -a
  # shellcheck source=/dev/null
  source ".env.harness"
  set +a
fi

if [ -z "${HARNESS_REPO_URL}" ] || [ -z "${HARNESS_USERNAME}" ] || [ -z "${HARNESS_PAT}" ]; then
  echo "[sync-remotes] Credenciales Harness no configuradas. Solo push a origin."
  exit 0
fi

HARNESS_URL="https://${HARNESS_USERNAME}:${HARNESS_PAT}@${HARNESS_REPO_URL}"

if git remote get-url harness &>/dev/null; then
  git remote set-url harness "$HARNESS_URL"
else
  git remote add harness "$HARNESS_URL"
fi

echo "[sync-remotes] Push fue a origin (GitHub) → empujando a Harness..."
if [ "$CURRENT_BRANCH" = "main" ]; then
  git push harness main:master --force --no-verify
else
  git push harness "$CURRENT_BRANCH" --force --no-verify
fi

echo "[sync-remotes] Listo."
