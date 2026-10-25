#!/usr/bin/env bash
# Grava o vídeo de demonstração no simulador do iOS que estiver ligado.
# Uso: .maestro/demo/gravar-video.sh [arquivo-final.mp4]
# Sem argumento, salva (e sobrescreve) ~/Documents/poke-app-demo-ios.mp4.
# Requer: servidor rodando (yarn expo start), Expo Go no simulador, maestro e ffmpeg.
set -euo pipefail

OUTPUT="${1:-$HOME/Documents/poke-app-demo-ios.mp4}"
case "$OUTPUT" in /*) ;; *) OUTPUT="$PWD/$OUTPUT" ;; esac
cd "$(dirname "$0")"
EXPO_URL="${EXPO_URL:-exp://127.0.0.1:8081}"
# SIMULATOR_UDID escolhe o simulador; sem ele, usa o primeiro ligado que tenha o Expo Go.
UDID="${SIMULATOR_UDID:-}"
if [ -z "$UDID" ]; then
  for candidate in $(xcrun simctl list devices booted | grep -oE '[0-9A-F-]{36}'); do
    if xcrun simctl listapps "$candidate" 2>/dev/null | grep -q host.exp.Exponent; then
      UDID="$candidate"
      break
    fi
  done
fi
if [ -z "$UDID" ]; then
  echo "Nenhum simulador do iOS ligado com o Expo Go instalado." >&2
  exit 1
fi
MAESTRO_ENV=(-e APP_ID=host.exp.Exponent -e "EXPO_URL=$EXPO_URL")
RAW="$(mktemp -d)/gravacao-bruta.mp4"

RECORDER=""
stop_recording() {
  if [ -n "$RECORDER" ]; then
    kill -INT "$RECORDER" 2>/dev/null || true
    wait "$RECORDER" || true
    RECORDER=""
  fi
}

# Se algum passo falhar, para a gravação e devolve o simulador ao normal (tema claro, barra de status real).
cleanup() {
  stop_recording
  xcrun simctl ui "$UDID" appearance light
  xcrun simctl status_bar "$UDID" clear
}
trap cleanup EXIT

xcrun simctl status_bar "$UDID" override --time 9:41 --batteryState charged \
  --batteryLevel 100 --wifiBars 3 --cellularBars 4 --dataNetwork wifi
xcrun simctl ui "$UDID" appearance light

maestro --device "$UDID" test "${MAESTRO_ENV[@]}" ../subflows/abrir-app.yaml

xcrun simctl io "$UDID" recordVideo --codec=h264 --force "$RAW" &
RECORDER=$!
sleep 2
maestro --device "$UDID" test "${MAESTRO_ENV[@]}" video-1.yaml
xcrun simctl ui "$UDID" appearance dark
maestro --device "$UDID" test "${MAESTRO_ENV[@]}" video-2.yaml
stop_recording

python3 cortar-pausas.py "$RAW" "$OUTPUT"
