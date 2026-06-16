import heroBanner from "@/assets/hero-banner.jpg";
import { Shield, ChevronDown, Mail as MailIcon } from "lucide-react";
import { Link } from "react-router-dom";
import NavbarSection from "@/components/NavbarSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GallerySection from "@/components/GallerySection";
import ProductsSection from "@/components/ProductsSection";
import DynamicProductsSection from "@/components/DynamicProductsSection";

// Floating particles data
const particles = [
  { size: 6, top: "15%", left: "10%", delay: "0s", duration: "6s" },
  { size: 10, top: "25%", left: "80%", delay: "1s", duration: "8s" },
  { size: 4, top: "60%", left: "5%", delay: "2s", duration: "7s" },
  { size: 8, top: "70%", left: "90%", delay: "0.5s", duration: "9s" },
  { size: 5, top: "40%", left: "50%", delay: "3s", duration: "6.5s" },
  { size: 12, top: "80%", left: "30%", delay: "1.5s", duration: "8.5s" },
  { size: 3, top: "10%", left: "60%", delay: "2.5s", duration: "7.5s" },
  { size: 7, top: "50%", left: "20%", delay: "4s", duration: "6s" },
];

const Index = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <NavbarSection />

      {/* Hero Section */}
      <section
        id="accueil"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Proxitec Solutions - IT & Electronique"
            className="w-full h-full object-cover"
          />
          {/* Rouge plein professionnel semi-transparent — caméras visibles */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(4 90% 10% / 0.88) 0%, hsl(4 85% 30% / 0.72) 40%, hsl(4 80% 18% / 0.88) 100%)" }} />
          {/* Éclat rouge vif au centre pour la profondeur */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 30%, hsl(4 85% 45% / 0.45) 0%, transparent 65%)" }} />
          {/* Fondu bas vers le noir profond */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Animated grid lines overlay */}
        <div
          className="absolute inset-0 opacity-8"
          style={{
            backgroundImage: `
              linear-gradient(hsl(220 30% 80% / 0.08) 1px, transparent 1px),
              linear-gradient(90deg, hsl(220 30% 80% / 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold/30 animate-float-particle"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}

        {/* Glowing orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(220 60% 50%), transparent)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(44 95% 50%), transparent)" }}
        />

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-28">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gold bg-gold/20 text-gold mb-6 text-xs sm:text-sm font-bold tracking-widest uppercase"
            style={{
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
              boxShadow: "0 0 16px 2px hsl(42 90% 52% / 0.25)",
            }}
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Solutions IT &amp; Électronique au Gabon</span>
          </div>

          {/* Title */}
          <h1
            className="font-montserrat font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white mb-4 leading-none animate-fade-in-up"
            style={{ animationDelay: "0.2s", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            PROXITEC <span className="sr-only">— Solutions IT &amp; Électronique au Gabon</span>
          </h1>
          <h2
            className="font-montserrat font-bold text-lg sm:text-xl md:text-2xl text-gold mb-6 tracking-widest uppercase animate-fade-in-up"
            style={{ animationDelay: "0.3s", textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
          >
            SOLUTIONS IT &amp; ÉLECTRONIQUE
          </h2>
          <p
            className="text-white/85 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.4s", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            Votre partenaire technologique de confiance au Gabon — fourniture, installation et maintenance
            de solutions informatiques, sécuritaires et électroniques.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); scrollToServices(); }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-montserrat font-bold text-base bg-gold text-gold-foreground hover:shadow-primary-glow transition-all duration-300 hover:scale-105"
            >
              Découvrir nos Services
            </a>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-montserrat font-bold text-base border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300"
            >
              <MailIcon className="w-5 h-5" />
              Nous Contacter
            </button>
          </div>

          {/* Stats row */}
          <div
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              { value: "10+", label: "Services" },
              { value: "2021", label: "Fondé" },
              { value: "Gabon", label: "Basé à Libreville" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-montserrat font-black text-2xl md:text-3xl text-gold">{stat.value}</div>
                <div className="text-primary-foreground/85 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToServices}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/80 hover:text-gold transition-colors animate-bounce"
          aria-label="Défiler vers le bas"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Dynamic Products (admin-managed) */}
      <DynamicProductsSection />

      {/* Products Section */}
      <ProductsSection />

      {/* About Section */}
      <AboutSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/24107265831"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-pulse-glow"
        aria-label="Contacter via WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-primary-darker py-8 text-center">
        <div className="container mx-auto px-6">
          <p className="font-montserrat font-bold text-lg text-primary-foreground mb-1">PROXITEC SOLUTIONS IT &amp; ÉLECTRONIQUE</p>
          <p className="text-muted-foreground text-sm">
            NIF: 202102011333-R | RCCM: GA-LBV-01-2021-A10-03344 | UGB: 90000750398-59
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            © {new Date().getFullYear()} Proxitec Gabon. Tous droits réservés.
          </p>
          <div className="mt-5 flex items-center justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gold/40 text-gold hover:bg-gold hover:text-gold-foreground transition-all duration-300 font-montserrat font-semibold text-xs tracking-widest uppercase"
              aria-label="Espace Administrateur"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
