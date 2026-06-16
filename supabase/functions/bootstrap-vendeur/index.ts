// One-off: create vendeur jemimaoye and relink history
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EMAIL = "jemimaoye@gmail.com";
const PASSWORD = "241Proxitec";
const FULL_NAME = "Jemima Oye";
const OLD_ID = "2808dbde-bd86-4019-942e-535ff7911970";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: list } = await admin.auth.admin.listUsers();
  if (list?.users?.some((u) => u.email === EMAIL)) {
    return new Response(JSON.stringify({ error: "Auth user existe déjà" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const { data: created, error: cErr } = await admin.auth.admin.createUser({
    email: EMAIL, password: PASSWORD, email_confirm: true,
    user_metadata: { full_name: FULL_NAME },
  });
  if (cErr || !created.user) {
    return new Response(JSON.stringify({ error: cErr?.message ?? "create failed" }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  const uid = created.user.id;

  await admin.from("invoices").update({ vendeur_id: uid }).eq("vendeur_id", OLD_ID);
  await admin.from("prints_log").update({ vendeur_id: uid }).eq("vendeur_id", OLD_ID);
  await admin.from("user_roles").delete().eq("user_id", OLD_ID);
  await admin.from("profiles").delete().eq("id", OLD_ID);
  await admin.from("profiles").upsert({ id: uid, email: EMAIL, full_name: FULL_NAME }, { onConflict: "id" });
  await admin.from("user_roles").insert({ user_id: uid, role: "vendeur" });

  return new Response(JSON.stringify({ ok: true, user_id: uid, email: EMAIL }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
