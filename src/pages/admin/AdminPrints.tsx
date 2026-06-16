import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatXAF, formatDate } from "@/lib/format";

export default function AdminPrints() {
  const [items, setItems] = useState<any[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    (async () => {
      const a = from && to ? (from <= to ? from : to) : from;
      const b = from && to ? (from <= to ? to : from) : to;
      let q = supabase.from("prints_log").select("*, profiles:vendeur_id(full_name,email)").order("log_date", { ascending: false });
      if (a) q = q.gte("log_date", a);
      if (b) q = q.lte("log_date", b);
      const { data, error } = await q;
      if (error) console.error("prints_log", error);
      setItems(data || []);
    })();
  }, [from, to]);

  const total = items.reduce((s, i) => s + Number(i.total), 0);

  return (
    <div>
      <h1 className="text-3xl font-black font-montserrat mb-2">Impressions & Photocopies</h1>
      <p className="text-muted-foreground mb-6">Vue consolidée des prestations enregistrées par les vendeurs.</p>

      <Card className="p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div><label className="text-xs text-muted-foreground">Du</label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
        <div><label className="text-xs text-muted-foreground">Au</label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
        <Button variant="outline" onClick={() => { setFrom(""); setTo(""); }}>Réinitialiser</Button>
        <div className="ml-auto font-bold">Total : {formatXAF(total)}</div>
      </Card>

      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Vendeur</TableHead><TableHead>Type</TableHead><TableHead>Qté</TableHead><TableHead>PU</TableHead><TableHead>Total</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Aucune entrée</TableCell></TableRow>}
            {items.map(p => (
              <TableRow key={p.id}>
                <TableCell>{formatDate(p.log_date)}</TableCell>
                <TableCell>{p.profiles?.full_name || p.profiles?.email || "—"}</TableCell>
                <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{formatXAF(Number(p.unit_price))}</TableCell>
                <TableCell className="font-bold">{formatXAF(Number(p.total))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
