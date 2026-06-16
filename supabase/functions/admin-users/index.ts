// Edge function: admin user management (create vendeur, delete user, reset password)
// Verifies caller is admin via JWT then uses service role to perform privileged ops
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return json({ error: "Missing token" }, 401);

    // Verify caller
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user }, error: uErr } = await userClient.auth.getUser();
    if (uErr || !user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Check admin role
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Forbidden — admin only" }, 403);

    const { action, payload } = await req.json();

    if (action === "create_vendeur") {
      const { email, password, full_name } = payload ?? {};
      if (!email || !password || !full_name) return json({ error: "Champs requis manquants" }, 400);
      if (password.length < 6) return json({ error: "Mot de passe min 6 caractères" }, 400);

      const { data: created, error: cErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name },
      });
      if (cErr || !created.user) return json({ error: cErr?.message ?? "Erreur création compte" }, 400);

      const newUserId = created.user.id;

      // Defensive: ensure profile exists even if trigger is missing
      const { error: pErr } = await admin
        .from("profiles")
        .upsert({ id: newUserId, email, full_name }, { onConflict: "id" });
      if (pErr) {
        await admin.auth.admin.deleteUser(newUserId);
        return json({ error: "Profil: " + pErr.message }, 400);
      }

      const { error: rErr } = await admin
        .from("user_roles")
        .upsert({ user_id: newUserId, role: "vendeur" }, { onConflict: "user_id,role" });
      if (rErr) {
        await admin.auth.admin.deleteUser(newUserId);
        return json({ error: "Rôle: " + rErr.message }, 400);
      }
      return json({ ok: true, user_id: newUserId });
    }

    if (action === "delete_user") {
      const { user_id } = payload ?? {};
      if (!user_id) return json({ error: "user_id requis" }, 400);
      if (user_id === user.id) return json({ error: "Vous ne pouvez pas vous supprimer vous-même" }, 400);
      const { error: dErr } = await admin.auth.admin.deleteUser(user_id);
      if (dErr) return json({ error: dErr.message }, 400);
      return json({ ok: true });
    }

    if (action === "update_password") {
      // Admin can change ANY user's password, including their own
      const { user_id, password } = payload ?? {};
      if (!user_id || !password) return json({ error: "Champs requis manquants" }, 400);
      if (password.length < 6) return json({ error: "Mot de passe min 6 caractères" }, 400);
      const { error: pErr } = await admin.auth.admin.updateUserById(user_id, { password });
      if (pErr) return json({ error: pErr.message }, 400);
      return json({ ok: true });
    }

    if (action === "list_users") {
      const { data: roles, error: lErr } = await admin
        .from("user_roles")
        .select("user_id, role, created_at")
        .order("created_at", { ascending: false });
      if (lErr) return json({ error: lErr.message }, 400);
      const ids = Array.from(new Set((roles ?? []).map((r: any) => r.user_id)));
      const { data: profs } = await admin
        .from("profiles")
        .select("id, email, full_name")
        .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
      const users = (roles ?? []).map((r: any) => ({
        ...r,
        profiles: map.get(r.user_id) ?? null,
      }));
      return json({ users });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
