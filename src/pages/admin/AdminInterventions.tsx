import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";

const empty = { client_id: "", intervention_date: new Date().toISOString().split("T")[0], type: "", description: "", technicien: "", status: "planifiee", notes: "" };

export default function AdminInterventions() {
  const [items, setItems] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await supabase.from("interventions").select("*, clients(name)").order("intervention_date", { ascending: false });
    setItems(data || []);
    const { data: cs } = await supabase.from("clients").select("id,name").order("name");
    setClients(cs || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (i: any) => {
    setEditing(i);
    setForm({
      client_id: i.client_id, intervention_date: i.intervention_date,
      type: i.type, description: i.description || "", technicien: i.technicien || "",
      status: i.status, notes: i.notes || "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.client_id || !form.type) { toast.error("Client et type requis"); return; }
    const { error } = editing
      ? await supabase.from("interventions").update(form as any).eq("id", editing.id)
      : await supabase.from("interventions").insert(form as any);
    if (error) toast.error(error.message);
    else { toast.success("Enregistré"); setOpen(false); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    await supabase.from("interventions").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-3xl font-black font-montserrat">Interventions</h1><p className="text-muted-foreground">Suivi des fiches d'intervention.</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Nouvelle</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Modifier" : "Nouvelle intervention"}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="md:col-span-2">
                <Label>Client *</Label>
                <Select value={form.client_id} onValueChange={v => setForm({ ...form, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir un client" /></SelectTrigger>
                  <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={form.intervention_date} onChange={e => setForm({ ...form, intervention_date: e.target.value })} /></div>
              <div><Label>Type *</Label><Input value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="Installation, maintenance..." /></div>
              <div><Label>Technicien</Label><Input value={form.technicien} onChange={e => setForm({ ...form, technicien: e.target.value })} /></div>
              <div>
                <Label>Statut</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planifiee">Planifiée</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="terminee">Terminée</SelectItem>
                    <SelectItem value="annulee">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>Notes internes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={save}>Enregistrer</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Client</TableHead><TableHead>Type</TableHead><TableHead>Technicien</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucune intervention</TableCell></TableRow>}
            {items.map(i => (
              <TableRow key={i.id}>
                <TableCell>{formatDate(i.intervention_date)}</TableCell>
                <TableCell className="font-medium">{i.clients?.name || "—"}</TableCell>
                <TableCell>{i.type}</TableCell>
                <TableCell>{i.technicien || "—"}</TableCell>
                <TableCell><Badge variant="outline">{i.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(i)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(i.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
