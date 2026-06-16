import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Printer, LogOut, Receipt, Copy } from "lucide-react";
import { toast } from "sonner";
import { formatXAF, formatDateTime } from "@/lib/format";
import { InvoicePrint } from "@/components/admin/InvoicePrint";

interface LineItem { product_id: string | null; product_name: string; reference: string; product_image: string | null; quantity: number; unit_price: number; }

export default function VendeurDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"facture" | "impressions" | "historique">("facture");

  const [products, setProducts] = useState<any[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [lines, setLines] = useState<LineItem[]>([{ product_id: null, product_name: "", reference: "", product_image: null, quantity: 1, unit_price: 0 }]);
  const [savedInvoice, setSavedInvoice] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [printForm, setPrintForm] = useState({ type: "impression", quantity: 1, unit_price: 100, notes: "" });
  const [todayPrints, setTodayPrints] = useState<any[]>([]);
  const [myInvoices, setMyInvoices] = useState<any[]>([]);
  const [viewInv, setViewInv] = useState<any>(null);

  useEffect(() => {
    supabase.from("products").select("id,name,reference,price,stock_quantity,image_url").order("name").then(({ data }) => setProducts(data || []));
    loadToday();
    loadMyInvoices();
  }, []);

  const loadToday = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("prints_log").select("*").eq("log_date", today).order("created_at", { ascending: false });
    setTodayPrints(data || []);
  };

  const loadMyInvoices = async () => {
    const { data } = await supabase.from("invoices").select("*").order("created_at", { ascending: false }).limit(20);
    setMyInvoices(data || []);
  };

  const addLine = () => setLines([...lines, { product_id: null, product_name: "", reference: "", product_image: null, quantity: 1, unit_price: 0 }]);
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));
  const updateLine = (i: number, patch: Partial<LineItem>) => setLines(lines.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  const pickProduct = (i: number, pid: string) => {
    const p = products.find(x => x.id === pid);
    if (p) updateLine(i, { product_id: p.id, product_name: p.name, reference: p.reference || "", product_image: p.image_url || null, unit_price: Number(p.price) });
  };

  const total = lines.reduce((s, l) => s + l.quantity * l.unit_price, 0);

  const submitInvoice = async () => {
    if (!clientName.trim()) { toast.error("Nom du client requis"); return; }
    const valid = lines.filter(l => l.product_name.trim() && l.quantity > 0);
    if (valid.length === 0) { toast.error("Ajoutez au moins une ligne"); return; }
    setSubmitting(true);
    const { data: inv, error } = await supabase.from("invoices").insert({
      client_name: clientName.trim(), client_phone: clientPhone.trim() || null,
      vendeur_id: user!.id, total, status: "payee",
    }).select().single();
    if (error || !inv) { setSubmitting(false); toast.error(error?.message || "Erreur"); return; }
    const itemsPayload = valid.map(l => ({
      invoice_id: inv.id, product_id: l.product_id, product_name: l.product_name,
      reference: l.reference || null, product_image: l.product_image || null,
      quantity: l.quantity, unit_price: l.unit_price, subtotal: l.quantity * l.unit_price,
    }));
    const { data: insertedItems, error: itErr } = await supabase.from("invoice_items").insert(itemsPayload).select();
    setSubmitting(false);
    if (itErr) { toast.error(itErr.message); return; }
    toast.success(`Facture ${inv.invoice_number} créée`);
    setSavedInvoice({ ...inv, items: insertedItems });
    setClientName(""); setClientPhone("");
    setLines([{ product_id: null, product_name: "", reference: "", product_image: null, quantity: 1, unit_price: 0 }]);
    loadMyInvoices();
  };

  const submitPrint = async () => {
    const t = printForm.quantity * printForm.unit_price;
    const { error } = await supabase.from("prints_log").insert({
      vendeur_id: user!.id, type: printForm.type as any, quantity: printForm.quantity,
      unit_price: printForm.unit_price, total: t, notes: printForm.notes || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Enregistré"); setPrintForm({ type: "impression", quantity: 1, unit_price: 100, notes: "" }); loadToday(); }
  };

  const viewInvoice = async (inv: any) => {
    const { data: items } = await supabase.from("invoice_items").select("*").eq("invoice_id", inv.id);
    setViewInv({ ...inv, items: items || [] });
  };

  const handleLogout = async () => { await signOut(); navigate("/auth"); };

  const totalPrintsToday = todayPrints.reduce((s, p) => s + Number(p.total), 0);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-30 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-black text-primary text-lg font-montserrat">PROXITEC</div>
            <div className="text-xs text-muted-foreground">Espace Vendeur</div>
          </div>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button onClick={() => setTab("facture")} className={`px-3 py-1.5 rounded text-sm font-medium ${tab === "facture" ? "bg-card shadow" : ""}`}>Nouvelle facture</button>
            <button onClick={() => setTab("impressions")} className={`px-3 py-1.5 rounded text-sm font-medium ${tab === "impressions" ? "bg-card shadow" : ""}`}>Impressions</button>
            <button onClick={() => setTab("historique")} className={`px-3 py-1.5 rounded text-sm font-medium ${tab === "historique" ? "bg-card shadow" : ""}`}>Historique</button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-1" />Quitter</Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {tab === "facture" && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Receipt className="w-5 h-5" />Nouvelle facture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><Label>Nom du client *</Label><Input value={clientName} onChange={e => setClientName(e.target.value)} /></div>
              <div><Label>Téléphone</Label><Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} /></div>
            </div>

            <div className="space-y-2 mb-4">
              <Label>Produits</Label>
              {lines.map((l, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-12 md:col-span-5">
                    <Select value={l.product_id || ""} onValueChange={v => pickProduct(i, v)}>
                      <SelectTrigger><SelectValue placeholder="Choisir un produit" /></SelectTrigger>
                      <SelectContent>
                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.stock_quantity} en stock)</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input className="mt-1" placeholder="ou saisir un nom libre" value={l.product_name} onChange={e => updateLine(i, { product_name: e.target.value, product_id: null })} />
                  </div>
                  <div className="col-span-4 md:col-span-2"><Label className="text-xs">Qté</Label><Input type="number" min={1} value={l.quantity} onChange={e => updateLine(i, { quantity: Number(e.target.value) })} /></div>
                  <div className="col-span-5 md:col-span-3"><Label className="text-xs">PU (FCFA)</Label><Input type="number" value={l.unit_price} onChange={e => updateLine(i, { unit_price: Number(e.target.value) })} /></div>
                  <div className="col-span-2 md:col-span-1 text-right text-sm font-bold">{formatXAF(l.quantity * l.unit_price)}</div>
                  <div className="col-span-1">{lines.length > 1 && <Button size="icon" variant="ghost" onClick={() => removeLine(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>}</div>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addLine}><Plus className="w-4 h-4 mr-1" />Ajouter une ligne</Button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-2xl font-black">Total : <span className="text-primary">{formatXAF(total)}</span></div>
              <Button size="lg" onClick={submitInvoice} disabled={submitting}>
                {submitting ? "Enregistrement..." : "Enregistrer & Imprimer"}
              </Button>
            </div>
          </Card>
        )}

        {tab === "impressions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Copy className="w-5 h-5" />Nouvelle prestation</h2>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <Select value={printForm.type} onValueChange={v => setPrintForm({ ...printForm, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="impression">Impression</SelectItem>
                      <SelectItem value="photocopie">Photocopie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Quantité</Label><Input type="number" min={1} value={printForm.quantity} onChange={e => setPrintForm({ ...printForm, quantity: Number(e.target.value) })} /></div>
                <div><Label>Prix unitaire (FCFA)</Label><Input type="number" value={printForm.unit_price} onChange={e => setPrintForm({ ...printForm, unit_price: Number(e.target.value) })} /></div>
                <div><Label>Notes</Label><Input value={printForm.notes} onChange={e => setPrintForm({ ...printForm, notes: e.target.value })} placeholder="(facultatif)" /></div>
                <div className="text-xl font-bold">Total : {formatXAF(printForm.quantity * printForm.unit_price)}</div>
                <Button onClick={submitPrint} className="w-full">Enregistrer</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Aujourd'hui</h2>
              <div className="text-3xl font-black text-primary mb-4">{formatXAF(totalPrintsToday)}</div>
              <Table>
                <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Qté</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {todayPrints.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-4">Aucune entrée</TableCell></TableRow>}
                  {todayPrints.map(p => (
                    <TableRow key={p.id}><TableCell className="capitalize">{p.type}</TableCell><TableCell>{p.quantity}</TableCell><TableCell className="text-right font-bold">{formatXAF(Number(p.total))}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {tab === "historique" && (
          <Card>
            <div className="p-4 border-b font-bold">Mes 20 dernières factures</div>
            <Table>
              <TableHeader><TableRow><TableHead>N°</TableHead><TableHead>Date</TableHead><TableHead>Client</TableHead><TableHead>Total</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
              <TableBody>
                {myInvoices.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">Aucune facture</TableCell></TableRow>}
                {myInvoices.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono">{inv.invoice_number}</TableCell>
                    <TableCell>{formatDateTime(inv.created_at)}</TableCell>
                    <TableCell>{inv.client_name}</TableCell>
                    <TableCell className="font-bold">{formatXAF(Number(inv.total))}</TableCell>
                    <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => viewInvoice(inv)}><Printer className="w-4 h-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {savedInvoice && <InvoicePrint invoice={savedInvoice} onClose={() => setSavedInvoice(null)} />}
      {viewInv && <InvoicePrint invoice={viewInv} onClose={() => setViewInv(null)} />}
    </div>
  );
}
