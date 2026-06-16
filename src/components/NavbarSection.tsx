import { useState, useEffect } from "react";
import { Menu, X, Phone, Package } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoProxitec from "@/assets/logo-proxitec.jpg";

const NavbarSection = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goSection = (id: string) => {
    setMenuOpen(false);
    if (pathname !== "/") {
      navigate("/#" + id);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
    { label: "Accueil", id: "accueil" },
    { label: "À Propos", id: "apropos" },
    { label: "Services", id: "services" },
    { label: "Avis", id: "avis" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-primary shadow-lg py-2" : "bg-black/30 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <button onClick={() => goSection("accueil")} className="flex items-center gap-3">
          <div className="w-40 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-md">
            <img src={logoProxitec} alt="Proxitec Solutions IT & Electronique" className="w-full h-full object-contain p-1" />
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => goSection(link.id)}
              className="font-montserrat font-semibold text-sm text-primary-foreground/80 hover:text-gold transition-colors uppercase tracking-wide"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/produits"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-1.5 font-montserrat font-bold text-sm text-gold hover:text-gold/80 transition-colors uppercase tracking-wide"
          >
            <Package className="w-4 h-4" />
            Produits
          </Link>
          <a
            href="tel:+24177265831"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold text-gold-foreground font-montserrat font-bold text-sm hover:shadow-primary-glow transition-all duration-300 hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            Appeler
          </a>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-primary-foreground"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 py-4 animate-fade-in">
          <div className="container mx-auto px-6 flex flex-col gap-4">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => goSection(link.id)}
                className="font-montserrat font-semibold text-sm text-primary-foreground/80 hover:text-gold transition-colors uppercase tracking-wide text-left"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/produits"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-2 font-montserrat font-bold text-sm text-gold uppercase tracking-wide"
            >
              <Package className="w-4 h-4" />
              Produits
            </Link>
            <a
              href="tel:+24177265831"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gold text-gold-foreground font-montserrat font-bold text-sm w-fit"
            >
              <Phone className="w-4 h-4" />
              +241 77 26 58 31
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarSection;
