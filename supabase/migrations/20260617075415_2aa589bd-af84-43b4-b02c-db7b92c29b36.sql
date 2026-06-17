ALTER TABLE public.interventions
  ADD COLUMN invoice_number text,
  ADD COLUMN amount numeric(12,2) DEFAULT 0,
  ADD COLUMN tps_amount numeric(12,2) GENERATED ALWAYS AS (ROUND(amount * 9.5 / 109.5, 2)) STORED;