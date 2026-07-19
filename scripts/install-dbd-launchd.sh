#!/bin/bash
# Install (or reinstall) the DBD daily scraper as a launchd agent on THIS Mac.
# Run it on the target machine, e.g. lighthouse-core:
#     ssh lighthouse-core
#     cd ~/chekgonbin-mvp && git pull && bash scripts/install-dbd-launchd.sh
#
# Idempotent: unloads any existing agent, rewrites the plist with this
# machine's real paths, and loads it. Verifies .env.local and Python first.
set -euo pipefail

LABEL="com.chekgonbin.dbd-daily"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE="$SCRIPT_DIR/$LABEL.plist"
DEST_DIR="$HOME/Library/LaunchAgents"
DEST="$DEST_DIR/$LABEL.plist"

echo "Repo:   $REPO"
echo "Host:   $(hostname -s)"

# --- Preflight: secrets ---
if [[ ! -f "$REPO/.env.local" ]]; then
    echo "WARNING: $REPO/.env.local not found."
    echo "  The scraper needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY there."
    echo "  Copy it over before the job runs, e.g.:"
    echo "    scp .env.local lighthouse-core:$REPO/.env.local"
fi

# --- Preflight: python + deps ---
if [[ -x "$REPO/.venv/bin/python3" ]]; then
    PYTHON="$REPO/.venv/bin/python3"
elif [[ -x "/opt/anaconda3/bin/python3" ]]; then
    PYTHON="/opt/anaconda3/bin/python3"
else
    PYTHON="$(command -v python3 || true)"
fi
if [[ -z "$PYTHON" ]]; then
    echo "ERROR: no python3 found. Install Python or create $REPO/.venv." >&2
    exit 1
fi
echo "Python: $PYTHON"
if ! "$PYTHON" -c "import supabase, curl_cffi, cryptography, bs4, dotenv" 2>/dev/null; then
    echo "WARNING: Python deps missing. Install them with:"
    echo "    $PYTHON -m pip install -r $REPO/scripts/requirements.txt"
fi

# --- Write plist with real absolute paths ---
mkdir -p "$DEST_DIR" "$REPO/scripts/logs"
sed "s#__REPO__#$REPO#g" "$TEMPLATE" > "$DEST"
echo "Wrote:  $DEST"

# --- (Re)load the agent ---
launchctl unload "$DEST" 2>/dev/null || true
launchctl load "$DEST"
echo
echo "Loaded. Current state:"
launchctl list | grep "$LABEL" || echo "  (not shown — check 'launchctl list | grep $LABEL')"
echo
echo "Done. Next scheduled run: daily at 03:00 local time."
echo "To trigger a test run now:  launchctl start $LABEL"
echo "Then watch:                 tail -f $REPO/scripts/logs/dbd-scrape-\$(date +%Y-%m-%d).log"
