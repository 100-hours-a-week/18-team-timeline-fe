#!/bin/bash
STATUS=$1
TITLE=$2
MESSAGE=$3
WEBHOOK_URL=$4

CONTENT=""

if [[ "$STATUS" == "success" ]]; then
  CONTENT="✅ ${TITLE}\\n${MESSAGE}"
else
  CONTENT="🚨 ${TITLE}\\n${MESSAGE}"
fi

curl -X POST -H "Content-Type: application/json" \
  -d "{\"content\": \"$CONTENT\"}" \
  "$WEBHOOK_URL"
