# DBD Daily Scraper — runs on a dedicated Mac (lighthouse-core)

The DBD company-details scraper runs daily at 03:00 via `launchd` (incremental: only
new agencies and rows older than 30 days; a full refresh on the 1st of each month). It should live on an
always-on Mac (e.g. **lighthouse-core**) rather than a personal laptop that sleeps
or gets shut down — that's what caused the May–July 2026 gap (issue #1).

## Files
- `run-dbd-daily.sh` — launchd wrapper. Path-independent: derives the repo root
  from its own location and auto-detects Python (`$REPO/.venv` → `$DBD_PYTHON` →
  anaconda → PATH). No machine-specific paths.
- `com.chekgonbin.dbd-daily.plist` — **template**. `__REPO__` is substituted at
  install time. Do not load it directly.
- `install-dbd-launchd.sh` — generates the real plist for the current machine,
  installs it to `~/Library/LaunchAgents/`, and loads it. Idempotent.

## One-time deploy to lighthouse-core
```bash
# from your laptop
ssh lighthouse-core

# on lighthouse-core
git clone https://github.com/visarutforthaipbs/chekgonbin-mvp.git ~/chekgonbin-mvp   # or git pull if already cloned
cd ~/chekgonbin-mvp
python3 -m venv .venv && ./.venv/bin/pip install -r scripts/requirements.txt        # recommended
# copy secrets (NOT in git) from your laptop, in a separate terminal:
#   scp .env.local lighthouse-core:~/chekgonbin-mvp/.env.local
bash scripts/install-dbd-launchd.sh
```

The installer prints warnings if `.env.local` or Python deps are missing.

## Verify / test
```bash
launchctl list | grep com.chekgonbin.dbd-daily       # confirm loaded
launchctl start com.chekgonbin.dbd-daily             # trigger a run now
tail -f scripts/logs/dbd-scrape-$(date +%Y-%m-%d).log
```
A successful run ends with `Done (exit=0)` and `148 updated, 0 failed`.

## Daily freshness report
After each scrape, the wrapper runs `scripts/dbd-diagnose.py` and writes a
report to `scripts/logs/dbd-report-$(date +%Y-%m-%d).log` (also appended to the
scrape log). It verifies **both** pipelines from Supabase in one place:
- **DOE whitelist** (Vercel daily cron → `scraped_at`): total agencies + latest scrape.
- **DBD** (this scraper → `dbd_scraped_at`): populated / missing / stale counts,
  plus any agency behind a coverage gap.

Read today's report, or run it on demand:
```bash
cat scripts/logs/dbd-report-$(date +%Y-%m-%d).log     # today's report
./.venv/bin/python3 scripts/dbd-diagnose.py           # run on demand (read-only)
```

## Remove from the old Mac
On the previous host (visarutsankham's laptop), so it doesn't double-run:
```bash
# older installs used the label com.chekgonbin.dbd-monthly — remove either:
launchctl unload ~/Library/LaunchAgents/com.chekgonbin.dbd-*.plist
rm ~/Library/LaunchAgents/com.chekgonbin.dbd-*.plist
```

## Keep it fresh
`launchd` only runs a missed daily job when the Mac next wakes — so keep
lighthouse-core awake at the scheduled time (`caffeinate`, Energy Saver
"prevent sleep", or `pmset` scheduled wake before 03:00 on the 1st).

## What each run does (2026-10-12)
1. **Resolve missing `juristic_id`s.** DOE lists agencies as "บริษัทจัดหางาน X"; DBD
   registers "X จำกัด" or "จัดหางาน X จำกัด". New DOE agencies used to arrive with no ID and
   were never scraped. The scraper now searches DBD and fills the ID **only on an
   unambiguous match** (exact normalized name, or a unique prefix when DOE truncated the
   name); everything else is logged `NEEDS REVIEW`, never guessed.
2. **Scrape** new/stale agencies (full refresh on the 1st).
3. Write `scripts/logs/last_run.json` (counts, host, timestamp) for external health checks.

Flags: `--dry-run` (fetch + resolve, write nothing), `--resolve-only`, `--force`.

## PII guard — read before touching `committees`
`/api/agencies` serves the `agencies` table **publicly**. DBD's committees endpoint
returns `cmtNo` (for natural persons: the 13-digit **Thai citizen ID**) plus
address/phone codes. Only `COMMITTEE_FIELDS` (`cmtSeq, titleName, firstName, lastName,
firstNameE, lastNameE, ntCode`) may ever be stored — `sanitize_committees()` enforces it.
On 2026-10-12 raw committees were found exposing checksum-valid citizen IDs via the
public API; all rows were scrubbed and this allowlist added. **Do not widen it.**
