import { Phone, Mail, MapPin, MessageCircle, User } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24" style={{ background: "linear-gradient(135deg, hsl(220 30% 12%) 0%, hsl(4 85% 22%) 50%, hsl(220 30% 10%) 100%)" }}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold font-montserrat font-bold text-xs uppercase tracking-widest mb-6">
            Contactez-nous
          </div>
          <h2 className="font-montserrat font-black text-4xl md:text-5xl text-primary-foreground mb-4">
            Parlons de Votre Projet
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions et vous proposer une solution adaptée.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            {/* Director card */}
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10">
              <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-gold-foreground" />
              </div>
              <div>
                <div className="text-gold font-montserrat font-bold text-sm uppercase tracking-wider mb-1">Directeur des Opérations</div>
                <div className="text-primary-foreground font-montserrat font-bold text-lg">Ing. Patrick NGOMEZO'O NSOH</div>
                <div className="text-primary-foreground/85 text-sm mt-1">Expert en Solutions IT & Electronique</div>
              </div>
            </div>

            {/* Contact items */}
            <div className="space-y-4">
              <a
                href="tel:+24177265831"
                className="flex items-center gap-4 p-5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/30 transition-colors">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-primary-foreground/85 text-xs font-montserrat font-semibold uppercase tracking-wide mb-1">Téléphone</div>
                  <div className="text-primary-foreground font-semibold">+241 77 26 58 31</div>
                  <div className="text-primary-foreground font-semibold">+241 66 37 69 72</div>
                </div>
              </a>

              <a
                href="https://wa.me/24107265831"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <div className="text-primary-foreground/85 text-xs font-montserrat font-semibold uppercase tracking-wide mb-1">WhatsApp</div>
                  <div className="text-primary-foreground font-semibold">+241 07 26 58 31</div>
                  <div className="text-[#25D366] text-sm">Cliquez pour discuter</div>
                </div>
              </a>

              <a
                href="mailto:proxitec111@gmail.com"
                className="flex items-center gap-4 p-5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/30 transition-colors">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-primary-foreground/85 text-xs font-montserrat font-semibold uppercase tracking-wide mb-1">Email</div>
                  <div className="text-primary-foreground font-semibold">proxitec111@gmail.com</div>
                </div>
              </a>

              <div className="flex items-start gap-4 p-5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-primary-foreground/85 text-xs font-montserrat font-semibold uppercase tracking-wide mb-1">Adresse</div>
                  <div className="text-primary-foreground font-semibold">Plein Ciel / Bellevue 1</div>
                  <div className="text-primary-foreground/80">Libreville, Gabon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Google Map */}
          <div className="rounded-2xl overflow-hidden border border-primary-foreground/10 shadow-lg">
            <div className="bg-primary-foreground/5 border-b border-primary-foreground/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="font-montserrat font-bold text-primary-foreground text-sm">
                  Proxitec — Plein Ciel / Bellevue 1, Libreville
                </span>
              </div>
            </div>
            <iframe
              title="Localisation Proxitec Gabon"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.813!2d9.4166!3d0.3921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x107f3bb4c58b5a5f%3A0x1234567890abcdef!2sLibreville%2C%20Gabon!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block"
            />
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center p-8 rounded-2xl bg-primary-foreground/5 border border-gold/20">
            <div className="text-primary-foreground text-lg font-montserrat font-bold">
              Besoin d'un devis ou d'une démonstration ?
            </div>
            <a
              href="https://wa.me/24107265831?text=Bonjour%20Proxitec%2C%20je%20souhaite%20obtenir%20un%20devis."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gold text-gold-foreground font-montserrat font-bold hover:shadow-primary-glow transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Démarrer sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
