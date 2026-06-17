import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Printer as PrinterIcon, MessageCircle, Mail, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatXAF, formatDateTime, formatDate } from "@/lib/format";
import { InvoicePrint } from "@/components/admin/InvoicePrint";
import { toast } from "sonner";

const WHATSAPP_FALLBACK = "24107265831";

function buildInvoiceMessage(inv: any) {
  const lines = (inv.items || []).map((it: any) =>
    `• ${it.product_name} x${it.quantity} — ${formatXAF(Number(it.subtotal))}`
  ).join("\n");
  return `*PROXITEC — Facture ${inv.invoice_number}*\nDate : ${formatDate(inv.created_at)}\nClient : ${inv.client_name}\n\n${lines}\n\n*TOTAL : ${formatXAF(Number(inv.total))}*\n\nMerci de votre confiance.`;
}

export default function AdminInvoices() {
  const [items, setItems] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [view, setView] = useState<any>(null);

  const load = async () => {
    let q = supabase.from("invoices").select("*, profiles:vendeur_id(full_name,email)").order("created_at", { ascending: false });
    if (from) q = q.gte("created_at", from);
    if (to) q = q.lte("created_at", to + "T23:59:59");
    const { data } = await q;
    setItems(data || []);
  };
  useEffect(() => { load(); }, [from, to]);

  const fetchFull = async (inv: any) => {
    const { data: invItems } = await supabase.from("invoice_items").select("*").eq("invoice_id", inv.id);
    return { ...inv, items: invItems || [] };
  };

  const openInvoice = async (inv: any) => setView(await fetchFull(inv));

  const sendWhatsApp = async (inv: any) => {
    const full = await fetchFull(inv);
    const phone = (full.client_phone || "").replace(/[^0-9]/g, "") || WHATSAPP_FALLBACK;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildInvoiceMessage(full))}`;
    window.open(url, "_blank");
  };

  const sendEmail = async (inv: any) => {
    const full = await fetchFull(inv);
    const to = full.client_email || "";
    if (!to) { toast.error("Aucun email client renseigné"); }
    const subject = `Facture ${full.invoice_number} — PROXITEC`;
    const body = buildInvoiceMessage(full).replace(/\*/g, "");
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const printInvoice = async (inv: any) => {
    setView(await fetchFull(inv));
    setTimeout(() => window.print(), 350);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-black font-montserrat mb-2">Factures</h1>
      <p className="text-muted-foreground mb-6">Toutes les ventes — admin et vendeurs.</p>

      <Card className="p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div><label className="text-xs text-muted-foreground">Du</label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
        <div><label className="text-xs text-muted-foreground">Au</label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
        <Button variant="outline" onClick={() => { setFrom(""); setTo(""); }}>Réinitialiser</Button>
        <div className="ml-auto font-bold">Total : {formatXAF(items.reduce((s, i) => s + Number(i.total), 0))}</div>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>N°</TableHead><TableHead>Date</TableHead><TableHead>Client</TableHead><TableHead>Vendeur</TableHead><TableHead>Total</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Aucune facture</TableCell></TableRow>}
            {items.map(inv => (
              <TableRow key={inv.id} className="animate-fade-in">
                <TableCell className="font-mono">{inv.invoice_number}</TableCell>
                <TableCell>{formatDateTime(inv.created_at)}</TableCell>
                <TableCell>{inv.client_name}</TableCell>
                <TableCell>{inv.profiles?.full_name || inv.profiles?.email || "—"}</TableCell>
                <TableCell className="font-bold">{formatXAF(Number(inv.total))}</TableCell>
                <TableCell><Badge>{inv.status}</Badge></TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="icon" variant="ghost" title="Aperçu" onClick={() => openInvoice(inv)}><Eye className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" title="Imprimer" onClick={() => printInvoice(inv)}><PrinterIcon className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" title="WhatsApp" onClick={() => sendWhatsApp(inv)}><MessageCircle className="w-4 h-4 text-[#25D366]" /></Button>
                  <Button size="icon" variant="ghost" title="Email" onClick={() => sendEmail(inv)}><Mail className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {view && <InvoicePrint invoice={view} onClose={() => setView(null)} />}
    </div>
  );
}
