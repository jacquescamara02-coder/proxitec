GRANT EXECUTE ON FUNCTION public.generate_invoice_number() TO authenticated, service_role;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE public.invoice_number_seq TO authenticated, service_role;