#!/bin/bash
# ProcessUnity Vendor Lookup - delegates to Python to avoid shell escaping issues
VENDOR_NAME="$1"
CONFIG_PATH="$2"

if [ -z "$VENDOR_NAME" ] || [ -z "$CONFIG_PATH" ]; then
  echo '{"error": "Usage: query-processunity.sh <vendor_name> <config_path>"}'
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
python3 "$SCRIPT_DIR/query-processunity.py" "$VENDOR_NAME" "$CONFIG_PATH"
