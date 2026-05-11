#!/bin/bash
# Wrapper invoked by launchd to run the DBD monthly scraper.
# Logs to scripts/logs/dbd-scrape-YYYY-MM-DD.log
set -euo pipefail

REPO="/Users/visarutsankham/chekgonbin-mvp-1"
PYTHON="/opt/anaconda3/bin/python3"
LOG_DIR="$REPO/scripts/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/dbd-scrape-$(date +%Y-%m-%d).log"

cd "$REPO"
echo "===== $(date '+%Y-%m-%d %H:%M:%S') Starting DBD scrape =====" >> "$LOG_FILE"
"$PYTHON" scripts/companu-details.py >> "$LOG_FILE" 2>&1
echo "===== $(date '+%Y-%m-%d %H:%M:%S') Done (exit=$?) =====" >> "$LOG_FILE"
