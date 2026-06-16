import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NavbarSection from "@/components/NavbarSection";
import { MessageCircle, Package, Search, ArrowLeft } from "lucide-react";
import { formatXAF } from "@/lib/format";

const WHATSAPP_NUMBER = "24107265831";

interface DBProduct {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
}

const waLink = (name: string, price: number) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour PROXITEC, je souhaite commander : ${name} (${formatXAF(price)}). Pouvez-vous confirmer la disponibilité ?`,
  )}`;

const Produits = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCat = params.get("cat") || "";
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, description, category, price, stock_quantity, image_url")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      setProducts((data ?? []) as DBProduct[]);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean) as string[]),
    ).sort();
    return cats.map((name) => ({
      name,
      count: products.filter((p) => p.category === name).length,
      cover: products.find((p) => p.category === name && p.image_url)?.image_url ?? null,
    }));
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (activeCat && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [products, activeCat, search]);

  return (
    <div className="min-h-screen bg-background">
      <NavbarSection />
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/20 text-gold-foreground border border-gold font-montserrat font-bold text-xs uppercase tracking-widest mb-4">
              <Package className="w-3.5 h-3.5" />
              Boutique PROXITEC
            </div>
            <h1 className="font-montserrat font-black text-4xl md:text-5xl text-foreground mb-3">
              Nos <span className="text-gradient-primary">Produits</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Parcourez notre catalogue par catégorie et commandez directement via WhatsApp.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            />
          </div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Chargement…</div>
          ) : !activeCat ? (
            <>
              {/* Categories grid */}
              {categories.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  Aucun produit disponible pour le moment.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setParams({ cat: c.name })}
                      className="group relative overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-hover transition-all duration-400 hover:-translate-y-2 aspect-square"
                    >
                      {c.cover ? (
                        <img
                          src={c.cover}
                          alt={c.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-gold/30 flex items-center justify-center">
                          <Package className="w-16 h-16 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                        <p className="text-white font-montserrat font-black text-lg leading-tight mb-1">
                          {c.name}
                        </p>
                        <p className="text-gold font-montserrat font-bold text-xs uppercase tracking-wider">
                          {c.count} {c.count > 1 ? "produits" : "produit"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* All products preview when searching */}
              {search && filtered.length > 0 && (
                <ProductGrid products={filtered} />
              )}
            </>
          ) : (
            <>
              {/* Back + title */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <button
                  onClick={() => setParams({})}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 text-sm font-montserrat font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Toutes les catégories
                </button>
                <h2 className="font-montserrat font-black text-2xl md:text-3xl">
                  Catégorie : <span className="text-primary">{activeCat}</span>
                </h2>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  Aucun produit dans cette catégorie.
                </div>
              ) : (
                <ProductGrid products={filtered} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1da851] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        aria-label="Contact WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  );
};

const ProductGrid = ({ products }: { products: DBProduct[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
    {products.map((p) => (
      <div
        key={p.id}
        className="group rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-hover transition-all duration-400 hover:-translate-y-2 flex flex-col"
      >
        <div className="aspect-square overflow-hidden bg-muted relative">
          {p.image_url ? (
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Package className="w-12 h-12" />
            </div>
          )}
          {p.stock_quantity > 0 ? (
            <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold bg-green-500 text-white rounded-full uppercase tracking-wider">
              En stock
            </span>
          ) : (
            <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-bold bg-muted-foreground text-white rounded-full uppercase tracking-wider">
              Sur commande
            </span>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          {p.category && (
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
              {p.category}
            </span>
          )}
          <p className="font-montserrat font-semibold text-sm text-foreground leading-tight mb-1 line-clamp-2">
            {p.name}
          </p>
          {p.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
          )}
          <div className="font-montserrat font-black text-lg text-primary mb-3 mt-auto">
            {formatXAF(Number(p.price))}
          </div>
          <a
            href={waLink(p.name, Number(p.price))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-montserrat font-bold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Commander
          </a>
        </div>
      </div>
    ))}
  </div>
);

export default Produits;
