-- Migration: Add DBD financial data columns to agencies table
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/btbwqsvqshjozunwienf/sql/new)

ALTER TABLE agencies
  ADD COLUMN IF NOT EXISTS cap_amt           NUMERIC,       -- registered capital (ทุนจดทะเบียน)
  ADD COLUMN IF NOT EXISTS paid_amt          NUMERIC,       -- paid-up capital (ทุนชำระแล้ว)
  ADD COLUMN IF NOT EXISTS share_qty         INTEGER,       -- number of shares
  ADD COLUMN IF NOT EXISTS share_vol         NUMERIC,       -- share face value (บาท/หุ้น)
  ADD COLUMN IF NOT EXISTS jp_stat_code      TEXT,          -- DBD status code: "1"=operating, "3"=dissolved
  ADD COLUMN IF NOT EXISTS fiscal_year       TEXT,          -- most recent fiscal year (e.g. "2567")
  ADD COLUMN IF NOT EXISTS total_asset       NUMERIC,       -- total assets (สินทรัพย์รวม)
  ADD COLUMN IF NOT EXISTS total_income      NUMERIC,       -- total income (รายได้รวม)
  ADD COLUMN IF NOT EXISTS net_profit        NUMERIC,       -- net profit/loss (กำไรสุทธิ)
  ADD COLUMN IF NOT EXISTS total_equity      NUMERIC,       -- total equity (ส่วนของผู้ถือหุ้น)
  ADD COLUMN IF NOT EXISTS current_ratio     NUMERIC,       -- current ratio (อัตราส่วนสภาพคล่อง)
  ADD COLUMN IF NOT EXISTS debt_to_equity    NUMERIC,       -- D/E ratio (หนี้สินต่อทุน)
  ADD COLUMN IF NOT EXISTS return_on_asset   NUMERIC,       -- ROA % (ผลตอบแทนต่อสินทรัพย์)
  ADD COLUMN IF NOT EXISTS return_on_equity  NUMERIC,       -- ROE % (ผลตอบแทนต่อทุน)
  ADD COLUMN IF NOT EXISTS net_profit_margin NUMERIC,       -- net profit margin %
  ADD COLUMN IF NOT EXISTS gross_profit_margin NUMERIC,     -- gross profit margin %
  ADD COLUMN IF NOT EXISTS business_size_code TEXT,         -- S / M / L
  ADD COLUMN IF NOT EXISTS committees        JSONB,          -- full list of directors/committee members
  ADD COLUMN IF NOT EXISTS financials        JSONB,          -- detailed financial statements (current year)
  ADD COLUMN IF NOT EXISTS financials_prev   JSONB,          -- detailed financial statements (previous year)
  ADD COLUMN IF NOT EXISTS dbd_scraped_at    TIMESTAMPTZ;   -- when DBD data was last fetched

-- Optional: index for faster financial filtering
CREATE INDEX IF NOT EXISTS idx_agencies_jp_stat_code ON agencies (jp_stat_code);
CREATE INDEX IF NOT EXISTS idx_agencies_business_size ON agencies (business_size_code);
CREATE INDEX IF NOT EXISTS idx_agencies_fiscal_year ON agencies (fiscal_year);
