-- 2026-10-12 · Fix: scam reports could never be saved.
-- /api/report-scam inserts `reporter_ip` and the admin pages filter/update
-- `status`, but neither column existed on public.scam_reports, so every
-- insert was rejected (PostgREST: column not found) and the form showed an error.
-- Additive + idempotent: safe to re-run, touches no existing rows' data.

alter table public.scam_reports
  add column if not exists reporter_ip text;

alter table public.scam_reports
  add column if not exists status text not null default 'pending';

alter table public.scam_reports
  drop constraint if exists scam_reports_status_check;
alter table public.scam_reports
  add constraint scam_reports_status_check
  check (status in ('pending', 'verified', 'rejected', 'added_to_blacklist'));

-- Rate-limit lookup: reports per IP in the last hour.
create index if not exists scam_reports_reporter_ip_created_at_idx
  on public.scam_reports (reporter_ip, created_at);

-- Admin list: newest pending first.
create index if not exists scam_reports_status_created_at_idx
  on public.scam_reports (status, created_at desc);

-- Make PostgREST see the new columns immediately.
notify pgrst, 'reload schema';
