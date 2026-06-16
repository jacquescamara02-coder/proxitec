import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatXAF, formatDateTime } from "@/lib/format";
import { Package, Receipt, AlertTriangle, Wrench, Printer, Users, Search, FileText, User } from "lucide-react";
import { Link } from "react-router-dom";

type Hit = { type: "produit" | "client" | "facture"; id: string; label: string; sub?: string; to: string };

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    salesToday: 0, salesMonth: 0, invoicesToday: 0,
    lowStock: 0, openInterventions: 0, clientsCount: 0, printsToday: 0, productsCount: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentPrints, setRecentPrints] = useState<any[]>([]);
  const [vendorReport, setVendorReport] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    (async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const [invToday, invMonth, lowStockRes, intRes, clientsRes, printsRes, prodCount] = await Promise.all([
        supabase.from("invoices").select("total").gte("created_at", today.toISOString()),
        supabase.from("invoices").select("total").gte("created_at", monthStart.toISOString()),
        supabase.from("products").select("id", { count: "exact", head: true }).lt("stock_quantity", 5),
        supabase.from("interventions").select("id", { count: "exact", head: true }).in("status", ["planifiee", "en_cours"]),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("prints_log").select("total").gte("log_date", today.toISOString().split("T")[0]),
        supabase.from("products").select("id", { count: "exact", head: true }),
      ]);

      setStats({
        salesToday: (invToday.data || []).reduce((s, i) => s + Number(i.total), 0),
        salesMonth: (invMonth.data || []).reduce((s, i) => s + Number(i.total), 0),
        invoicesToday: invToday.data?.length || 0,
        lowStock: lowStockRes.count || 0,
        openInterventions: intRes.count || 0,
        clientsCount: clientsRes.count || 0,
        printsToday: (printsRes.data || []).reduce((s, p) => s + Number(p.total), 0),
        productsCount: prodCount.count || 0,
      });

      // Recent invoices
      const { data: invs } = await supabase
        .from("invoices")
        .select("id,invoice_number,client_name,total,status,created_at,profiles:vendeur_id(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(8);
      setRecentInvoices(invs || []);

      // Recent prints
      const { data: prs } = await supabase
        .from("prints_log")
        .select("id,type,quantity,total,created_at,profiles:vendeur_id(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(8);
      setRecentPrints(prs || []);

      // Vendor month report (sum invoices + prints by vendeur for current month)
      const [{ data: monthInvs }, { data: monthPrints }, { data: profs }] = await Promise.all([
        supabase.from("invoices").select("vendeur_id,total").gte("created_at", monthStart.toISOString()),
        supabase.from("prints_log").select("vendeur_id,total").gte("log_date", monthStart.toISOString().split("T")[0]),
        supabase.from("profiles").select("id,full_name,email"),
      ]);
      const agg = new Map<string, { name: string; invoices: number; prints: number }>();
      (profs || []).forEach(p => agg.set(p.id, { name: p.full_name || p.email || "—", invoices: 0, prints: 0 }));
      (monthInvs || []).forEach((r: any) => {
        const e = agg.get(r.vendeur_id) || { name: "—", invoices: 0, prints: 0 };
        e.invoices += Number(r.total); agg.set(r.vendeur_id, e);
      });
      (monthPrints || []).forEach((r: any) => {
        const e = agg.get(r.vendeur_id) || { name: "—", invoices: 0, prints: 0 };
        e.prints += Number(r.total); agg.set(r.vendeur_id, e);
      });
      setVendorReport(Array.from(agg.values()).filter(v => v.invoices + v.prints > 0)
        .sort((a, b) => (b.invoices + b.prints) - (a.invoices + a.prints)));
    })();
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setHits([]); return; }
    setSearching(true);
    const t = setTimeout(async () => {
      const like = `%${q}%`;
      const [prod, cli, inv] = await Promise.all([
        supabase.from("products").select("id,name,category").or(`name.ilike.${like},category.ilike.${like}`).limit(5),
        supabase.from("clients").select("id,name,phone").or(`name.ilike.${like},phone.ilike.${like}`).limit(5),
        supabase.from("invoices").select("id,invoice_number,client_name,total").or(`invoice_number.ilike.${like},client_name.ilike.${like}`).limit(5),
      ]);
      const out: Hit[] = [
        ...(prod.data || []).map(p => ({ type: "produit" as const, id: p.id, label: p.name, sub: p.category ?? "", to: "/admin/produits" })),
        ...(cli.data || []).map(c => ({ type: "client" as const, id: c.id, label: c.name, sub: c.phone ?? "", to: "/admin/clients" })),
        ...(inv.data || []).map(i => ({ type: "facture" as const, id: i.id, label: i.invoice_number, sub: `${i.client_name} — ${formatXAF(Number(i.total))}`, to: "/admin/factures" })),
      ];
      setHits(out);
      setSearching(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const cards = useMemo(() => [
    { label: "CA du jour", value: formatXAF(stats.salesToday), icon: Receipt, color: "text-emerald-600 bg-emerald-50" },
    { label: "CA du mois", value: formatXAF(stats.salesMonth), icon: Receipt, color: "text-blue-600 bg-blue-50" },
    { label: "Factures aujourd'hui", value: stats.invoicesToday, icon: Receipt, color: "text-violet-600 bg-violet-50" },
    { label: "Impressions du jour", value: formatXAF(stats.printsToday), icon: Printer, color: "text-amber-600 bg-amber-50" },
    { label: "Stock bas (<5)", value: stats.lowStock, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
    { label: "Interventions en cours", value: stats.openInterventions, icon: Wrench, color: "text-orange-600 bg-orange-50" },
    { label: "Clients", value: stats.clientsCount, icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { label: "Produits", value: stats.productsCount, icon: Package, color: "text-slate-600 bg-slate-50" },
  ], [stats]);

  const iconFor = (t: Hit["type"]) => t === "produit" ? Package : t === "client" ? User : FileText;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-black font-montserrat mb-2">Tableau de bord</h1>
      <p className="text-muted-foreground mb-6">Vue consolidée de l'activité PROXITEC.</p>

      <div className="relative mb-8">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Recherche rapide : produit, client, facture..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 h-12 bg-card shadow-sm"
        />
        {query.length >= 2 && (
          <Card className="absolute z-20 left-0 right-0 mt-2 p-2 max-h-80 overflow-y-auto animate-scale-in shadow-lg">
            {searching && <div className="p-3 text-sm text-muted-foreground">Recherche...</div>}
            {!searching && hits.length === 0 && <div className="p-3 text-sm text-muted-foreground">Aucun résultat</div>}
            {hits.map(h => {
              const Icon = iconFor(h.type);
              return (
                <Link
                  key={`${h.type}-${h.id}`}
                  to={h.to}
                  onClick={() => setQuery("")}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center"><Icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{h.label}</div>
                    {h.sub && <div className="text-xs text-muted-foreground truncate">{h.sub}</div>}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{h.type}</span>
                </Link>
              );
            })}
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Card
            key={c.label}
            className="p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</div>
            <div className="text-2xl font-bold mt-1">{c.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
