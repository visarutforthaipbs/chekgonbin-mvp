-- Optimizations migration — run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/btbwqsvqshjozunwienf/sql/new

-- ── 1. Trigram extension + indexes for fast fuzzy search ──────────────────────

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Agency name search (used by /api/agencies and /api/check-risk whitelist check)
CREATE INDEX IF NOT EXISTS idx_agencies_name_th_trgm
  ON agencies USING GIN (name_th gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_agencies_name_en_trgm
  ON agencies USING GIN (name_en gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_agencies_license_no
  ON agencies (license_no);

-- Blacklist name search (used by check_blacklist RPC below)
CREATE INDEX IF NOT EXISTS idx_blacklist_name_trgm
  ON blacklist USING GIN (name gin_trgm_ops);

-- ── 2. Blacklist RPC — bidirectional fuzzy match in Postgres ──────────────────
-- Replaces the full JS table scan in /api/check-risk.
-- Accepts pre-normalised terms (Thai company prefixes already stripped by JS).
-- Returns true if any active blacklist entry matches on name or contacts.

CREATE OR REPLACE FUNCTION check_blacklist(
  name_query    text DEFAULT '',
  contact_query text DEFAULT ''
)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM blacklist
    WHERE status = 'active'
      AND (
        -- Name: bidirectional substring match
        (
          name_query <> ''
          AND (
            name ILIKE '%' || name_query || '%'
            OR name_query ILIKE '%' || name || '%'
          )
        )
        OR
        -- Contacts: any array element matches bidirectionally
        (
          contact_query <> ''
          AND EXISTS (
            SELECT 1
            FROM unnest(contacts) AS c
            WHERE c ILIKE '%' || contact_query || '%'
               OR contact_query ILIKE '%' || c || '%'
          )
        )
      )
  )
$$;

-- ── 3. Risk-checks retention — delete rows older than N days ──────────────────
-- Call monthly via a Supabase scheduled job or manually:
--   SELECT cleanup_old_risk_checks(90);

CREATE OR REPLACE FUNCTION cleanup_old_risk_checks(retain_days int DEFAULT 90)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count int;
BEGIN
  DELETE FROM risk_checks
  WHERE created_at < NOW() - (retain_days || ' days')::interval;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- ── 4. Freshness check helper — used by pipeline supervisor ──────────────────
-- Returns count of agencies with stale or missing DBD data.

CREATE OR REPLACE FUNCTION dbd_freshness_report(stale_days int DEFAULT 40)
RETURNS TABLE (
  total_agencies     bigint,
  dbd_populated      bigint,
  dbd_missing        bigint,
  dbd_stale          bigint,
  last_dbd_update    timestamptz
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    COUNT(*)                                                          AS total_agencies,
    COUNT(*) FILTER (WHERE dbd_scraped_at IS NOT NULL)               AS dbd_populated,
    COUNT(*) FILTER (WHERE dbd_scraped_at IS NULL)                   AS dbd_missing,
    COUNT(*) FILTER (
      WHERE dbd_scraped_at < NOW() - (stale_days || ' days')::interval
    )                                                                 AS dbd_stale,
    MAX(dbd_scraped_at)                                               AS last_dbd_update
  FROM agencies
$$;
