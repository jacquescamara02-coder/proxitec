
CREATE POLICY "Admins see interventions" ON public.interventions
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

REVOKE SELECT (stock_quantity) ON public.products FROM anon;
