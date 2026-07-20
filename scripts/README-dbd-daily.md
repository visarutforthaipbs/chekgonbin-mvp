# DBD Monthly Scraper — deploy on a dedicated Mac (lighthouse-core)

The DBD company-details scraper runs monthly via `launchd`. It should live on an
always-on Mac (e.g. **lighthouse-core**) rather than a personal laptop that sleeps
or gets shut down — that's what caused the May–July 2026 gap (issue #1).

## Files
- `run-dbd-monthly.sh` — launchd wrapper. Path-independent: derives the repo root
  from its own location and auto-detects Python (`$REPO/.venv` → `$DBD_PYTHON` →
  anaconda → PATH). No machine-specific paths.
- `com.chekgonbin.dbd-monthly.plist` — **template**. `__REPO__` is substituted at
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
launchctl list | grep com.chekgonbin.dbd-monthly     # confirm loaded
launchctl start com.chekgonbin.dbd-monthly           # trigger a run now
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
launchctl unload ~/Library/LaunchAgents/com.chekgonbin.dbd-monthly.plist
rm ~/Library/LaunchAgents/com.chekgonbin.dbd-monthly.plist
```

## Keep it fresh
`launchd` only runs a missed monthly job when the Mac next wakes — so keep
lighthouse-core awake at the scheduled time (`caffeinate`, Energy Saver
"prevent sleep", or `pmset` scheduled wake before 03:00 on the 1st).
