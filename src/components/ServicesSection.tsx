import { useState, useEffect } from "react";
import imgVideosurveillance from "@/assets/service-videosurveillance.jpg";
import imgVideoloft from "@/assets/service-videoloft.jpg";
import imgVideoloftAdaptateurs from "@/assets/videoloft-adaptateurs.png";
import imgVideoloftCloud from "@/assets/videoloft-cloud-backup.png";
import imgVideoloftCentral from "@/assets/videoloft-centralisation.png";
import imgGps from "@/assets/service-gps.jpg";
import imgAccess from "@/assets/service-access-control.jpg";
import imgFormation from "@/assets/service-formation.jpg";
import imgAlarmeVehicule from "@/assets/service-alarme-vehicule.jpg";
import imgAlarme from "@/assets/service-alarme.jpg";
import imgReseau from "@/assets/service-reseau.jpg";
import imgTelephonie from "@/assets/service-telephonie.jpg";
import imgInformatique from "@/assets/service-informatique.jpg";
import { Cloud, MapPin, ShieldCheck, GraduationCap, Car, Flame, Network, PhoneCall, Monitor, Camera, Code2 } from "lucide-react";
import DevisModal from "@/components/DevisModal";

const services = [
  {
    id: 1,
    icon: Camera,
    title: "Vidéosurveillance",
    subtitle: "Systèmes CCTV professionnels",
    image: imgVideosurveillance,
    description:
      "Fourniture, installation et maintenance de systèmes de vidéosurveillance de pointe. Caméras IP, dômes, bullets, PTZ — adaptés aux entreprises, commerces, résidences et bâtiments industriels.",
    features: [
      "Caméras IP haute définition",
      "Enregistrement 24h/7j",
      "Accès à distance via smartphone",
      "Installation professionnelle",
    ],
    badge: null,
    color: "from-blue-700 to-blue-900",
  },
  {
    id: 2,
    icon: Cloud,
    title: "Vidéoloft Cloud",
    subtitle: "Revendeur officiel au Gabon",
    image: imgVideoloft,
    images: [imgVideoloft, imgVideoloftAdaptateurs, imgVideoloftCloud, imgVideoloftCentral],
    description:
      "Solution de stockage vidéo sur le cloud Vidéoloft — transformez vos caméras existantes en système de surveillance cloud. Compatibilité avec la majorité des caméras du marché : Hikvision, Dahua, Axis et plus.",
    features: [
      "Stockage sécurisé dans le cloud",
      "Compatible toutes marques",
      "Détection intelligente de mouvement",
      "Accès depuis n'importe où",
    ],
    badge: "Revendeur Officiel",
    color: "from-sky-600 to-blue-800",
  },
  {
    id: 3,
    icon: MapPin,
    title: "Géolocalisation GPS",
    subtitle: "Suivi de flotte & véhicules",
    image: imgGps,
    description:
      "Système de suivi GPS pour la gestion de flotte, le contrôle des véhicules et la localisation en temps réel. Interface web intuitive avec historique des trajets, alertes et rapports détaillés.",
    features: [
      "Localisation en temps réel",
      "Historique des trajets",
      "Alertes de sortie de zone",
      "Rapports de consommation",
    ],
    badge: "Présent au Gabon",
    color: "from-green-700 to-teal-800",
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Contrôle d'Accès FELIX",
    subtitle: "Revendeur produits FELIX",
    image: imgAccess,
    description:
      "Systèmes de contrôle d'accès biométriques et électroniques de la marque FELIX. Lecteurs d'empreintes, badges RFID, serrures électroniques — pour sécuriser vos locaux professionnels et résidentiels.",
    features: [
      "Lecteurs biométriques",
      "Badges RFID & codes PIN",
      "Serrures électroniques",
      "Gestion centralisée",
    ],
    badge: "Produits FELIX",
    color: "from-purple-700 to-indigo-800",
  },
  {
    id: 5,
    icon: GraduationCap,
    title: "Formations Informatiques",
    subtitle: "Bureautique & Maintenance",
    image: imgFormation,
    description:
      "Formations professionnelles en bureautique (Word, Excel, PowerPoint) et maintenance informatique. Programmes adaptés aux débutants et professionnels pour renforcer les compétences numériques au Gabon.",
    features: [
      "Bureautique Microsoft Office",
      "Maintenance PC & matériel",
      "Formation sur mesure",
      "Certificats de formation",
    ],
    badge: null,
    color: "from-amber-700 to-orange-800",
  },
  {
    id: 6,
    icon: Car,
    title: "Alarmes Véhicules MILANO",
    subtitle: "Sécurité automobile",
    image: imgAlarmeVehicule,
    description:
      "Installation d'alarmes MILANO pour véhicules — protection anti-vol haut de gamme avec télécommande, détecteurs de choc, sirène et immobiliseur. Compatible avec tous types de véhicules.",
    features: [
      "Système anti-vol MILANO",
      "Télécommande à distance",
      "Immobiliseur électronique",
      "Sirène haute puissance",
    ],
    badge: "Marque MILANO",
    color: "from-red-700 to-rose-900",
  },
  {
    id: 7,
    icon: Flame,
    title: "Alarmes Anti-Intrusion & Incendie",
    subtitle: "Protection totale des locaux",
    image: imgAlarme,
    description:
      "Fourniture et installation de systèmes d'alarme anti-intrusion et incendie. Détecteurs de mouvement, capteurs de fumée, centrales d'alarme — pour protéger vos locaux professionnels et résidentiels.",
    features: [
      "Détecteurs de mouvement PIR",
      "Centrales d'alarme multi-zones",
      "Détecteurs de fumée & CO²",
      "Télésurveillance 24h/7j",
    ],
    badge: null,
    color: "from-orange-700 to-red-800",
  },
  {
    id: 8,
    icon: Network,
    title: "Réseaux Informatiques & Optiques",
    subtitle: "Câblage, fibre & configuration",
    image: imgReseau,
    description:
      "Installation et configuration de réseaux informatiques (LAN, WiFi) et optiques (fibre optique, soudures). Déploiement d'infrastructures réseau robustes pour entreprises et institutions.",
    features: [
      "Câblage structuré Cat6/Cat7",
      "Fibre optique & soudures",
      "Configuration réseau & WiFi",
      "Maintenance préventive",
    ],
    badge: null,
    color: "from-cyan-700 to-blue-800",
  },
  {
    id: 9,
    icon: PhoneCall,
    title: "Téléphonie IP & Analogique",
    subtitle: "Solutions de communication",
    image: imgTelephonie,
    description:
      "Fourniture et installation de systèmes de téléphonie IP (VoIP) et analogique. Standards téléphoniques IPBX, postes IP, conférence — pour moderniser vos communications d'entreprise.",
    features: [
      "Autocommutateurs IPBX",
      "Postes IP professionnels",
      "Conférence audio & vidéo",
      "Interconnexion multi-sites",
    ],
    badge: null,
    color: "from-teal-700 to-cyan-800",
  },
  {
    id: 10,
    icon: Monitor,
    title: "Matériel Informatique & Serveurs",
    subtitle: "Fourniture, maintenance & sauvegarde",
    image: imgInformatique,
    description:
      "Vente, installation et maintenance de matériel informatique, serveurs et solutions de travail collaboratif. Sauvegarde de données, gestion de parc informatique et audit technique.",
    features: [
      "Ordinateurs & périphériques",
      "Serveurs & NAS",
      "Solution de sauvegarde",
      "Audit & inventaire parc",
    ],
    badge: null,
    color: "from-slate-700 to-gray-800",
  },
  {
    id: 11,
    icon: Code2,
    title: "Développement Web",
    subtitle: "Sites & applications sur mesure",
    image: imgInformatique,
    description:
      "Conception et développement de sites vitrines, sites e-commerce et applications web sur mesure. Solutions modernes, responsive et optimisées SEO pour propulser votre activité au Gabon et à l'international.",
    features: [
      "Sites vitrines & e-commerce",
      "Applications web sur mesure",
      "Design responsive & SEO",
      "Hébergement & maintenance",
    ],
    badge: "Nouveau",
    color: "from-fuchsia-700 to-purple-900",
  },
];

const ServiceImageSlider = ({ images, title, color }: { images: string[]; title: string; color: string }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`${title} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Afficher l'image ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </>
  );
};

const ServicesSection = () => {
  const [devisOpen, setDevisOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openDevis = (serviceName: string) => {
    setSelectedService(serviceName);
    setDevisOpen(true);
  };

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-montserrat font-bold text-xs uppercase tracking-widest mb-6">
            Nos Services
          </div>
          <h2 className="font-montserrat font-black text-4xl md:text-5xl text-foreground mb-4">
            Des Solutions Complètes &{" "}
            <span className="text-gradient-primary">Professionnelles</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Proxitec vous propose une gamme complète de services technologiques pour répondre à tous vos besoins en sécurité, connectivité et informatique.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-hover transition-all duration-400 hover:-translate-y-2 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                {service.images && service.images.length > 1 ? (
                  <ServiceImageSlider images={service.images} title={service.title} color={service.color} />
                ) : (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-60 group-hover:opacity-40 transition-opacity duration-300`} />
                {/* Icon */}
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-card">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                {/* Badge */}
                {service.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-montserrat font-bold shadow-card">
                    {service.badge}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-muted-foreground font-montserrat font-semibold uppercase tracking-wider mb-1">
                  {service.subtitle}
                </div>
                <h3 className="font-montserrat font-bold text-xl text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-primary block" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => openDevis(service.title)}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary text-primary font-montserrat font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Demander un devis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DevisModal
        open={devisOpen}
        onClose={() => setDevisOpen(false)}
        servicePreselect={selectedService}
      />
    </section>
  );
};

export default ServicesSection;
