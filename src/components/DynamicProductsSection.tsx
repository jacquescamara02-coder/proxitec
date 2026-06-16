import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Package } from "lucide-react";
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
    `Bonjour Proxitec, je souhaite commander : ${name} (${formatXAF(price)}). Pouvez-vous confirmer la disponibilité ?`
  )}`;

const DynamicProductsSection = () => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<string>("Tous");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, name, description, category, price, stock_quantity, image_url")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });
      setProducts((data ?? []) as DBProduct[]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || products.length === 0) return null;

  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]))];
  const filtered = activeCat === "Tous" ? products : products.filter(p => p.category === activeCat);

  return (
    <section id="boutique" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/20 text-gold-foreground border border-gold font-montserrat font-bold text-xs uppercase tracking-widest mb-6">
            <Package className="w-3.5 h-3.5" />
            Boutique en ligne
          </div>
          <h2 className="font-montserrat font-black text-4xl md:text-5xl text-foreground mb-4">
            Produits <span className="text-gradient-primary">en Stock</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Articles disponibles immédiatement dans notre magasin PROXITEC à Libreville.
          </p>
        </div>

        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2.5 rounded-full font-montserrat font-bold text-sm transition-all ${
                  activeCat === cat
                    ? "bg-primary text-primary-foreground shadow-card"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
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
                  <span className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">{p.category}</span>
                )}
                <p className="font-montserrat font-semibold text-sm text-foreground leading-tight mb-2 line-clamp-2">
                  {p.name}
                </p>
                <div className="font-montserrat font-black text-lg text-primary mb-3">
                  {formatXAF(Number(p.price))}
                </div>
                <a
                  href={waLink(p.name, Number(p.price))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-montserrat font-bold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  Commander
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicProductsSection;
