import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

const createSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(128),
  full_name: z.string().trim().min(1).max(100),
});

type UserRow = {
  user_id: string;
  role: "admin" | "vendeur";
  profiles: { email: string; full_name: string } | null;
};

export default function AdminVendeurs() {
  const { user } = useAuth();
  const [items, setItems] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Create dialog
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [creating, setCreating] = useState(false);

  // Password reset dialog
  const [pwdTarget, setPwdTarget] = useState<UserRow | null>(null);
  const [newPwd, setNewPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "list_users" },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setItems((data?.users ?? []) as UserRow[]);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    const parsed = createSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "create_vendeur", payload: parsed.data },
    });
    setCreating(false);
    if (error || data?.error) { toast.error(data?.error ?? error?.message ?? "Erreur"); return; }
    toast.success("Vendeur créé avec succès");
    setOpen(false);
    setForm({ email: "", password: "", full_name: "" });
    load();
  };

  const removeUser = async (u: UserRow) => {
    if (u.user_id === user?.id) { toast.error("Impossible de vous supprimer vous-même"); return; }
    if (!confirm(`Supprimer définitivement ${u.profiles?.email} ? Cette action est irréversible.`)) return;
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "delete_user", payload: { user_id: u.user_id } },
    });
    if (error || data?.error) { toast.error(data?.error ?? error?.message); return; }
    toast.success("Compte supprimé");
    load();
  };

  const savePassword = async () => {
    if (!pwdTarget) return;
    if (newPwd.length < 6) { toast.error("Min 6 caractères"); return; }
    setSavingPwd(true);
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "update_password", payload: { user_id: pwdTarget.user_id, password: newPwd } },
    });
    setSavingPwd(false);
    if (error || data?.error) { toast.error(data?.error ?? error?.message); return; }
    toast.success("Mot de passe mis à jour");
    setPwdTarget(null);
    setNewPwd("");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black font-montserrat">Comptes du personnel</h1>
          <p className="text-muted-foreground">Administrateurs et vendeurs — création, suppression, mots de passe.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg"><Plus className="w-4 h-4 mr-2" />Nouveau vendeur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un compte vendeur</DialogTitle>
              <DialogDescription>Le compte sera actif immédiatement (email pré-confirmé).</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div><Label>Nom complet</Label><Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Mot de passe (min 6)</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button onClick={create} disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer le vendeur"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin inline" /></TableCell></TableRow>}
            {!loading && items.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Aucun compte</TableCell></TableRow>}
            {items.map((u) => (
              <TableRow key={u.user_id + u.role}>
                <TableCell className="font-medium">{u.profiles?.full_name || "—"}</TableCell>
                <TableCell>{u.profiles?.email || "—"}</TableCell>
                <TableCell>
                  <Badge variant={u.role === "admin" ? "default" : "secondary"} className="gap-1">
                    {u.role === "admin" && <ShieldCheck className="w-3 h-3" />}
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" title="Changer le mot de passe" onClick={() => setPwdTarget(u)}>
                    <KeyRound className="w-4 h-4" />
                  </Button>
                  {u.user_id !== user?.id && (
                    <Button size="icon" variant="ghost" title="Supprimer le compte" onClick={() => removeUser(u)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!pwdTarget} onOpenChange={(o) => !o && setPwdTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le mot de passe</DialogTitle>
            <DialogDescription>{pwdTarget?.profiles?.email}</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label>Nouveau mot de passe</Label>
            <Input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} autoFocus />
          </div>
          <DialogFooter>
            <Button onClick={savePassword} disabled={savingPwd}>
              {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
