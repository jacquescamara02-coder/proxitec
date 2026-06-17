import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatXAF, formatDate } from "@/lib/format";

export default function AdminReports() {
  const [from, setFrom] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]);
  const [to, setTo] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<{ invoices: any[]; prints: any[]; topProducts: any[] }>({ invoices: [], prints: [], topProducts: [] });

  useEffect(() => {
    (async () => {
      // Auto-swap if user picked reversed dates
      const a = from <= to ? from : to;
      const b = from <= to ? to : from;
      const fromIso = a + "T00:00:00";
      const toIso = b + "T23:59:59";
      const [{ data: invs, error: e1 }, { data: prs, error: e2 }, { data: items }] = await Promise.all([
        supabase.from("invoices").select("*, profiles:vendeur_id(full_name,email)").gte("created_at", fromIso).lte("created_at", toIso),
        supabase.from("prints_log").select("*").gte("log_date", a).lte("log_date", b),
        supabase.from("invoice_items").select("product_name, quantity, subtotal, invoices!inner(created_at)").gte("invoices.created_at", fromIso).lte("invoices.created_at", toIso),
      ]);
      if (e1) console.error("invoices", e1);
      if (e2) console.error("prints", e2);
      const agg: Record<string, { qty: number; total: number }> = {};
      (items || []).forEach((it: any) => {
        if (!agg[it.product_name]) agg[it.product_name] = { qty: 0, total: 0 };
        agg[it.product_name].qty += it.quantity;
        agg[it.product_name].total += Number(it.subtotal);
      });
      const top = Object.entries(agg).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.total - a.total).slice(0, 20);
      setData({ invoices: invs || [], prints: prs || [], topProducts: top });
    })();
  }, [from, to]);

  const totalVentes = data.invoices.reduce((s, i) => s + Number(i.total), 0);
  const impressions = data.prints.filter((p: any) => p.type === "impression");
  const photocopies = data.prints.filter((p: any) => p.type === "photocopie");
  const totalImpressions = impressions.reduce((s, i) => s + Number(i.total), 0);
  const totalPhotocopies = photocopies.reduce((s, i) => s + Number(i.total), 0);
  const qtyImpressions = impressions.reduce((s, i) => s + Number(i.quantity), 0);
  const qtyPhotocopies = photocopies.reduce((s, i) => s + Number(i.quantity), 0);
  const totalPrints = totalImpressions + totalPhotocopies;

  const byVendeur: Record<string, number> = {};
  data.invoices.forEach((i: any) => {
    const name = i.profiles?.full_name || i.profiles?.email || "Admin";
    byVendeur[name] = (byVendeur[name] || 0) + Number(i.total);
  });

  const exportCSV = () => {
    const lines = [["Type", "Date", "Référence", "Total"].join(";")];
    data.invoices.forEach((i: any) => lines.push(["Facture", formatDate(i.created_at), i.invoice_number, i.total].join(";")));
    data.prints.forEach((p: any) => lines.push(["Impression", formatDate(p.log_date), `${p.type} x${p.quantity}`, p.total].join(";")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rapport-${from}_${to}.csv`;
    a.click();
  };

  return (
    <div>
      <h1 className="text-3xl font-black font-montserrat mb-2">Rapports</h1>
      <p className="text-muted-foreground mb-6">Synthèse des ventes et activités.</p>

      <Card className="p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div><Label>Du</Label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
        <div><Label>Au</Label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
        <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs text-muted-foreground uppercase">Total ventes</div><div className="text-2xl font-bold">{formatXAF(totalVentes)}</div><div className="text-xs text-muted-foreground mt-1">{data.invoices.length} factures</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground uppercase">Impressions</div><div className="text-2xl font-bold">{formatXAF(totalImpressions)}</div><div className="text-xs text-muted-foreground mt-1">{qtyImpressions} pages</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground uppercase">Photocopies</div><div className="text-2xl font-bold">{formatXAF(totalPhotocopies)}</div><div className="text-xs text-muted-foreground mt-1">{qtyPhotocopies} pages</div></Card>
        <Card className="p-5"><div className="text-xs text-muted-foreground uppercase">Total général</div><div className="text-2xl font-bold text-primary">{formatXAF(totalVentes + totalPrints)}</div></Card>
      </div>

      <h2 className="text-xl font-bold mb-3">Ventes par vendeur</h2>
      <Card className="mb-6">
        <Table>
          <TableHeader><TableRow><TableHead>Vendeur</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
          <TableBody>
            {Object.entries(byVendeur).map(([name, total]) => (
              <TableRow key={name}><TableCell>{name}</TableCell><TableCell className="text-right font-bold">{formatXAF(total)}</TableCell></TableRow>
            ))}
            {Object.keys(byVendeur).length === 0 && <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-6">Aucune vente</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>

      <h2 className="text-xl font-bold mb-3">Top produits vendus</h2>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Produit</TableHead><TableHead>Quantité</TableHead><TableHead className="text-right">CA</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.topProducts.map(p => (
              <TableRow key={p.name}><TableCell>{p.name}</TableCell><TableCell>{p.qty}</TableCell><TableCell className="text-right font-bold">{formatXAF(p.total)}</TableCell></TableRow>
            ))}
            {data.topProducts.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-6">Aucune donnée</TableCell></TableRow>}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
