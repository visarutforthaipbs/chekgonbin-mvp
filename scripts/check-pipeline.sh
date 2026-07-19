#!/bin/bash
# Local pipeline supervisor for the DBD monthly scraper.
# Reads the latest scripts/logs/dbd-scrape-*.log, judges OK / FAILED / OVERDUE,
# writes a status file, and alerts (macOS notification + optional GitHub issue)
# ONLY when something needs attention. Meant to run daily via launchd.
#
# Replaces the old cloud Claude routine — runs entirely on this Mac, reads logs
# straight from disk (no git dependency).
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$REPO/scripts/logs"
STATUS_FILE="$LOG_DIR/PIPELINE-STATUS.txt"
GH_REPO="visarutforthaipbs/chekgonbin-mvp"
OVERDUE_DAYS=35
EXPECTED=148

today="$(date +%Y-%m-%d)"
this_month="$(date +%Y-%m)"
dom="$(date +%d)"
now_epoch="$(date +%s)"

latest="$(ls "$LOG_DIR"/dbd-scrape-*.log 2>/dev/null | sort | tail -1)"

status="OK"; reason=""; last_date="none"; updated=0; exitcode="?"; errors=0; age_days="?"

if [[ -z "$latest" ]]; then
    status="OVERDUE"; reason="No scrape logs found at all."
else
    last_date="$(basename "$latest" | sed -E 's/dbd-scrape-(.*)\.log/\1/')"
    log_epoch="$(date -j -f "%Y-%m-%d" "$last_date" +%s 2>/dev/null || echo 0)"
    age_days=$(( (now_epoch - log_epoch) / 86400 ))
    updated="$(grep -c "Supabase updated" "$latest" 2>/dev/null)"; updated="${updated:-0}"
    errors="$(grep -cE "ERROR|CRITICAL|Traceback" "$latest" 2>/dev/null)"; errors="${errors:-0}"
    exitcode="$(grep -E "Done \(exit=" "$latest" | tail -1 | sed -E 's/.*exit=([0-9]+).*/\1/')"
    exitcode="${exitcode:-?}"

    if [[ "$exitcode" != "0" ]]; then
        status="FAILED"; reason="Last run ended exit=$exitcode."
    elif (( age_days > OVERDUE_DAYS )); then
        status="OVERDUE"; reason="Last run was ${age_days} days ago (> ${OVERDUE_DAYS})."
    elif [[ "$dom" -ge 20 && "$last_date" != ${this_month}* ]]; then
        status="OVERDUE"; reason="It's the ${dom}th and no run yet this month (${this_month})."
    fi
fi

report="=== ChekGonBin DBD Pipeline Status ===
Checked:  $(date '+%Y-%m-%d %H:%M:%S %Z')
Host:     $(hostname -s)
Last run: ${last_date} (${age_days} days ago)
Exit:     ${exitcode}
Updated:  ${updated}/${EXPECTED}
Errors:   ${errors}
Status:   ${status}${reason:+  (${reason})}"

echo "$report" | tee "$STATUS_FILE"

if [[ "$status" == "OK" ]]; then
    echo "All OK — no alert."
    exit 0
fi

# --- Alert 1: native macOS notification (visible if someone's logged in) ---
osascript -e "display notification \"${status} — ${reason}\" with title \"ChekGonBin DBD scraper\"" 2>/dev/null || true

# --- Alert 2: GitHub issue (optional — only if gh is installed & authed) ---
if command -v gh >/dev/null 2>&1; then
    open_alerts="$(gh issue list --repo "$GH_REPO" --state open --json title \
        --jq '[.[] | select(.title | startswith("Pipeline Alert: DBD scraper"))] | length' 2>/dev/null || echo "?")"
    if [[ "$open_alerts" == "0" ]]; then
        gh issue create --repo "$GH_REPO" \
            --title "Pipeline Alert: DBD scraper ${status} — ${today}" \
            --body "${report}

To fix: run \`scripts/run-dbd-monthly.sh\` on this Mac, or check the launchd agent \`com.chekgonbin.dbd-monthly\` (\`launchctl list | grep chekgonbin\`)." \
            >/dev/null 2>&1 && echo "Opened GitHub issue." || echo "gh issue create failed — alert saved to $STATUS_FILE."
    elif [[ "$open_alerts" == "?" ]]; then
        echo "gh not authed — alert saved to $STATUS_FILE. Run 'gh auth login' to enable issue alerts."
    else
        echo "Alert issue already open ($open_alerts) — not duplicating."
    fi
else
    echo "gh not installed — alert saved to $STATUS_FILE (and macOS notification sent)."
fi

exit 1
