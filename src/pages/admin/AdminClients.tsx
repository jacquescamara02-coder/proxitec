import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

interface Client {
  id: string; name: string; company: string | null; phone: string | null;
  email: string | null; address: string | null; notes: string | null;
}

const empty = { name: "", company: "", phone: "", email: "", address: "", notes: "" };

export default function AdminClients() {
  const { id } = useParams();
  return id ? <ClientDetail id={id} /> : <ClientsList />;
}

function ClientsList() {
  const [items, setItems] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("clients").select("*").order("name");
    setItems((data || []) as Client[]);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (c: Client) => {
    setEditing(c);
    setForm({ name: c.name, company: c.company || "", phone: c.phone || "", email: c.email || "", address: c.address || "", notes: c.notes || "" });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Nom requis"); return; }
    const { error } = editing
      ? await supabase.from("clients").update(form).eq("id", editing.id)
      : await supabase.from("clients").insert(form);
    if (error) toast.error(error.message);
    else { toast.success(editing ? "Modifié" : "Créé"); setOpen(false); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ce client ? (Ses interventions seront aussi supprimées)")) return;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Supprimé"); load(); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-3xl font-black font-montserrat">Clients</h1><p className="text-muted-foreground">Fichier clients et historique.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Nouveau client</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Modifier client" : "Nouveau client"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div><Label>Nom *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Société</Label><Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
              <div><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Adresse</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={save}>Enregistrer</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Société</TableHead><TableHead>Téléphone</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucun client</TableCell></TableRow>}
            {items.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.company || "—"}</TableCell>
                <TableCell>{c.phone || "—"}</TableCell>
                <TableCell>{c.email || "—"}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" asChild><Link to={`/admin/clients/${c.id}`}><Eye className="w-4 h-4" /></Link></Button>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function ClientDetail({ id }: { id: string }) {
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [interventions, setInterventions] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
      setClient(c as Client | null);
      const { data: i } = await supabase.from("interventions").select("*").eq("client_id", id).order("intervention_date", { ascending: false });
      setInterventions(i || []);
      const { data: inv } = await supabase.from("invoices").select("*").eq("client_id", id).order("created_at", { ascending: false });
      setInvoices(inv || []);
    })();
  }, [id]);

  if (!client) return <div>Chargement...</div>;

  return (
    <div>
      <Button variant="ghost" onClick={() => navigate("/admin/clients")} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Retour</Button>
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-black font-montserrat">{client.name}</h1>
        {client.company && <p className="text-muted-foreground">{client.company}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
          <div><span className="text-muted-foreground">Téléphone : </span>{client.phone || "—"}</div>
          <div><span className="text-muted-foreground">Email : </span>{client.email || "—"}</div>
          <div><span className="text-muted-foreground">Adresse : </span>{client.address || "—"}</div>
        </div>
        {client.notes && <p className="mt-4 text-sm bg-muted/50 p-3 rounded">{client.notes}</p>}
      </Card>

      <h2 className="text-xl font-bold mb-3">Interventions ({interventions.length})</h2>
      <Card className="mb-6">
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Technicien</TableHead><TableHead>Statut</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
          <TableBody>
            {interventions.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Aucune intervention</TableCell></TableRow>}
            {interventions.map(i => (
              <TableRow key={i.id}>
                <TableCell>{formatDate(i.intervention_date)}</TableCell>
                <TableCell>{i.type}</TableCell>
                <TableCell>{i.technicien || "—"}</TableCell>
                <TableCell><Badge variant="outline">{i.status}</Badge></TableCell>
                <TableCell className="max-w-md truncate">{i.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <h2 className="text-xl font-bold mb-3">Factures ({invoices.length})</h2>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>N°</TableHead><TableHead>Date</TableHead><TableHead>Total</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader>
          <TableBody>
            {invoices.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">Aucune facture</TableCell></TableRow>}
            {invoices.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono">{inv.invoice_number}</TableCell>
                <TableCell>{formatDate(inv.created_at)}</TableCell>
                <TableCell>{Number(inv.total).toLocaleString("fr-FR")} FCFA</TableCell>
                <TableCell><Badge>{inv.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
