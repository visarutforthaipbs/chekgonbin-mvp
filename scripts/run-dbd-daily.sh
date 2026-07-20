#!/bin/bash
# Wrapper invoked by launchd to run the DBD daily scraper.
# Portable: derives the repo root from this script's own location and
# auto-detects Python, so it runs on any Mac (no hardcoded home path).
# Logs to scripts/logs/dbd-scrape-YYYY-MM-DD.log
set -euo pipefail

# Repo root = parent of the scripts/ dir this file lives in.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/.." && pwd)"

# Python: prefer a repo-local venv, then $DBD_PYTHON override, then anaconda, then PATH.
if [[ -x "$REPO/.venv/bin/python3" ]]; then
    PYTHON="$REPO/.venv/bin/python3"
elif [[ -n "${DBD_PYTHON:-}" && -x "${DBD_PYTHON}" ]]; then
    PYTHON="$DBD_PYTHON"
elif [[ -x "/opt/anaconda3/bin/python3" ]]; then
    PYTHON="/opt/anaconda3/bin/python3"
else
    PYTHON="$(command -v python3)"
fi

LOG_DIR="$REPO/scripts/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/dbd-scrape-$(date +%Y-%m-%d).log"

cd "$REPO"
echo "===== $(date '+%Y-%m-%d %H:%M:%S') Starting DBD daily scrape (host=$(hostname -s), python=$PYTHON) =====" >> "$LOG_FILE"
set +e
"$PYTHON" scripts/companu-details.py >> "$LOG_FILE" 2>&1
EXIT=$?
set -e
echo "===== $(date '+%Y-%m-%d %H:%M:%S') Done (exit=$EXIT) =====" >> "$LOG_FILE"

# Post-scrape freshness report: verifies BOTH pipelines (DOE Vercel cron and
# DBD) from Supabase. Written to its own dated file AND appended to the log,
# so there is a fresh report every day right after the scrape.
REPORT_FILE="$LOG_DIR/dbd-report-$(date +%Y-%m-%d).log"
{
    echo "===== $(date '+%Y-%m-%d %H:%M:%S') Pipeline freshness report (host=$(hostname -s)) ====="
    "$PYTHON" scripts/dbd-diagnose.py 2>&1
} | tee "$REPORT_FILE" >> "$LOG_FILE"

exit $EXIT
