import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Upload, Loader2, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { formatXAF } from "@/lib/format";

interface Product {
  id: string; name: string; reference: string | null; description: string | null; category: string | null;
  price: number; stock_quantity: number; image_url: string | null; is_visible: boolean;
}

const empty = { name: "", reference: "", description: "", category: "", price: 0, stock_quantity: 0, image_url: "", is_visible: true };

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data || []) as Product[]);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, reference: p.reference || "", description: p.description || "", category: p.category || "",
      price: Number(p.price), stock_quantity: p.stock_quantity, image_url: p.image_url || "", is_visible: p.is_visible,
    });
    setOpen(true);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image trop lourde (max 5 Mo)"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `products/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
      contentType: file.type, upsert: false,
    });
    if (upErr) { setUploading(false); toast.error(upErr.message); return; }
    // Long-lived signed URL (10 years)
    const { data: signed, error: sErr } = await supabase.storage
      .from("product-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    setUploading(false);
    if (sErr || !signed) { toast.error(sErr?.message || "Erreur URL"); return; }
    setForm(f => ({ ...f, image_url: signed.signedUrl }));
    toast.success("Image téléchargée");
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Nom requis"); return; }
    const payload = { ...form, name: form.name.trim(), price: Number(form.price), stock_quantity: Number(form.stock_quantity) };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editing ? "Produit modifié" : "Produit ajouté"); setOpen(false); load(); }
  };

  const del = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Supprimé"); load(); }
  };

  const filtered = items.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-black font-montserrat">Produits</h1>
          <p className="text-muted-foreground">Catalogue et gestion du stock.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="hover-scale"><Plus className="w-4 h-4 mr-2" /> Nouveau produit</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="md:col-span-2"><Label>Nom *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Référence</Label><Input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="Ex: PRX-001" /></div>
              <div><Label>Catégorie</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Vidéosurveillance..." /></div>
              <div><Label>Prix (FCFA)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })} /></div>
              <div className="md:col-span-2">
                <Label>Image du produit</Label>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />
                <div className="mt-2 flex items-center gap-3">
                  {form.image_url ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border bg-muted">
                      <img src={form.image_url} alt="aperçu" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image_url: "" })}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground bg-muted/40">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                  )}
                  <Button type="button" variant="outline" onClick={() => fileInput.current?.click()} disabled={uploading}>
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {uploading ? "Téléchargement..." : (form.image_url ? "Remplacer" : "Choisir une image")}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP — max 5 Mo. Depuis votre téléphone ou ordinateur.</p>
              </div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="flex items-center gap-3"><Switch checked={form.is_visible} onCheckedChange={(v) => setForm({ ...form, is_visible: v })} /><Label>Visible sur le site public</Label></div>
            </div>
            <DialogFooter><Button onClick={save} disabled={uploading}>{editing ? "Enregistrer" : "Créer"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow>
            <TableHead>Image</TableHead><TableHead>Référence</TableHead><TableHead>Nom</TableHead><TableHead>Catégorie</TableHead><TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead><TableHead>Site</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Aucun produit</TableCell></TableRow>}
            {filtered.map((p) => (
              <TableRow key={p.id} className="animate-fade-in">
                <TableCell>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{p.reference || "—"}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.category || "—"}</TableCell>
                <TableCell>{formatXAF(Number(p.price))}</TableCell>
                <TableCell>
                  <Badge variant={p.stock_quantity < 5 ? "destructive" : "secondary"}>{p.stock_quantity}</Badge>
                </TableCell>
                <TableCell>{p.is_visible ? <Badge>Visible</Badge> : <Badge variant="outline">Masqué</Badge>}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => del(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
