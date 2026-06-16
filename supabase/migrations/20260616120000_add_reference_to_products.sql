-- Add reference field on products + carry reference/image on invoice items
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE public.invoice_items ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE public.invoice_items ADD COLUMN IF NOT EXISTS product_image TEXT;
