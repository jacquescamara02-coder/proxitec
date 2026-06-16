import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jean-Pierre MOUKALA",
    role: "Directeur Général, Société Gabonaise de Commerce",
    text: "Proxitec a installé notre système de vidéosurveillance complet en un temps record. Travail très professionnel, équipe compétente et réactive. Je recommande vivement leurs services.",
    rating: 5,
    initials: "JM",
  },
  {
    name: "Marie-Claire ONDO",
    role: "Responsable IT, Banque de Développement Gabon",
    text: "Excellente prestation pour notre infrastructure réseau. L'équipe de Proxitec a su comprendre nos besoins et livrer une solution robuste et évolutive. Service après-vente impeccable.",
    rating: 5,
    initials: "MO",
  },
  {
    name: "Édouard NZAMBA",
    role: "Propriétaire, Résidence Bellevue",
    text: "Installation du contrôle d'accès FELIX pour notre résidence. Très satisfait du résultat, les locataires se sentent en sécurité. Prix compétitif et délais respectés.",
    rating: 5,
    initials: "EN",
  },
  {
    name: "Carine BEKALE",
    role: "Gérante, Boutique Mode Libreville",
    text: "Le système GPS de Proxitec nous permet de gérer efficacement notre flotte de livraison. Interface intuitive, support technique disponible 24h/7j. Très bon investissement.",
    rating: 5,
    initials: "CB",
  },
  {
    name: "Rodrigue ELLA",
    role: "Chef de Projet, BTP Gabon",
    text: "Formation bureautique de qualité pour toute notre équipe administrative. Les formateurs de Proxitec sont pédagogues et professionnels. Nos employés ont gagné en productivité.",
    rating: 5,
    initials: "RE",
  },
  {
    name: "Sylvie MOUANDZA",
    role: "Directrice Commerciale, Import Export GBN",
    text: "Notre système de téléphonie IP fonctionne parfaitement depuis l'installation par Proxitec. Communication inter-sites fluide, son cristallin. Très bonne expertise technique.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Christian NGOMA",
    role: "Responsable Sécurité, Hôtel Dialogue Libreville",
    text: "Proxitec a équipé notre hôtel d'un système d'alarme anti-intrusion et de vidéosurveillance Vidéoloft cloud. Solution innovante, accessible depuis nos smartphones. Parfait !",
    rating: 5,
    initials: "CN",
  },
  {
    name: "Patricia BOUANGA",
    role: "PDG, Cabinet Comptable Gabon",
    text: "Nous avons confié à Proxitec notre parc informatique complet — ordinateurs, serveurs et sauvegarde. Suivi rigoureux, contrat de maintenance sérieux. Une vraie relation de confiance.",
    rating: 5,
    initials: "PB",
  },
];

// Double the list for seamless loop
const allTestimonials = [...testimonials, ...testimonials];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 mb-3">
    {Array.from({ length: rating }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
    ))}
  </div>
);

const TestimonialsSection = () => {
  return (
    <section id="avis" className="py-24 bg-secondary overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <div className="text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-montserrat font-bold text-xs uppercase tracking-widest mb-6">
            Témoignages Clients
          </div>
          <h2 className="font-montserrat font-black text-4xl md:text-5xl text-foreground mb-4">
            Ils Nous Font{" "}
            <span className="text-gradient-primary">Confiance</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nos clients gabonais témoignent de leur expérience avec Proxitec Solutions IT & Électronique.
          </p>
        </div>
      </div>

      {/* Scrolling track */}
      <div className="relative w-full">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-secondary to-transparent" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-secondary to-transparent" />

        <div className="flex animate-scroll-left gap-6" style={{ width: "max-content" }}>
          {allTestimonials.map((t, i) => (
            <div
              key={i}
              className="w-80 flex-shrink-0 bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-hover transition-shadow duration-300"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              <StarRating rating={t.rating} />

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="font-montserrat font-black text-primary-foreground text-xs">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <div className="font-montserrat font-bold text-foreground text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
