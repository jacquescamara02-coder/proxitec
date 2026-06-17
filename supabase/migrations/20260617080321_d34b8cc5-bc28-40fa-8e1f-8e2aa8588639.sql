CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  n INT;
BEGIN
  SELECT COUNT(*) + 1 INTO n
  FROM public.invoices
  WHERE created_at::date = CURRENT_DATE;
  RETURN 'FAC-' || to_char(now(), 'YYMMDD') || '/' || LPAD(n::TEXT, 4, '0');
END;
$function$;