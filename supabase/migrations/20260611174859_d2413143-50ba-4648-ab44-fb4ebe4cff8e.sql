
-- Trigger-only functions: revoke from everyone (only the trigger system invokes them)
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.decrement_stock_on_invoice_item() FROM PUBLIC, anon, authenticated;

-- has_role: used by RLS policies, needs authenticated execute, but not anon
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- generate_invoice_number: used as default for invoices, needs authenticated execute
REVOKE ALL ON FUNCTION public.generate_invoice_number() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_invoice_number() TO authenticated;
