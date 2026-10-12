-- 2026-10-12 · Evidence pictures (victims' chat screenshots, transfer slips)
-- must not be world-readable. The app now stores "storage:evidence/<file>"
-- and the admin API issues 10-minute signed URLs.
update storage.buckets set public = false where id = 'evidence';
