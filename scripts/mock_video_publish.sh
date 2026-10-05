#!/usr/bin/env bash
#
# Mock video publisher for local T2 dashboard testing.
# Generates a synthetic H.264 test pattern (moving bars + live timestamp)
# and pushes it via RTSP to a local MediaMTX instance, simulating the
# phone's camera feed. No sample video file required.
#
# Requires: ffmpeg (with libx264 support)
#
# Usage:
#   ./mock_video_publish.sh
#   ./mock_video_publish.sh t2/my-test-session
#   MEDIAMTX_HOST=192.168.1.50 ./mock_video_publish.sh
 
set -euo pipefail
 
PATH_NAME="${1:-t2/mock-session-001}"
HOST="${MEDIAMTX_HOST:-localhost}"
PORT="${MEDIAMTX_PORT:-8554}"
RTSP_URL="rtsp://${HOST}:${PORT}/${PATH_NAME}"
 
echo "Publishing synthetic H.264 test feed to: ${RTSP_URL}"
echo "Ctrl+C to stop."
 
ffmpeg -re \
  -f lavfi -i "testsrc2=size=1280x720:rate=30" \
  -vf "drawtext=text='%{localtime}   MOCK FEED   ${PATH_NAME}':fontcolor=white:fontsize=32:x=20:y=20:box=1:boxcolor=black@0.5" \
  -c:v libx264 -preset ultrafast -tune zerolatency -b:v 2M -g 60 \
  -f rtsp -rtsp_transport tcp \
  "${RTSP_URL}"
 