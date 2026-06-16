
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_vendeur_id_fkey;
ALTER TABLE public.prints_log DROP CONSTRAINT IF EXISTS prints_log_vendeur_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE public.interventions DROP CONSTRAINT IF EXISTS interventions_technicien_id_fkey;
ALTER TABLE public.interventions DROP CONSTRAINT IF EXISTS interventions_client_id_fkey;
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_client_id_fkey;
ALTER TABLE public.invoice_items DROP CONSTRAINT IF EXISTS invoice_items_invoice_id_fkey;
ALTER TABLE public.invoice_items DROP CONSTRAINT IF EXISTS invoice_items_product_id_fkey;
