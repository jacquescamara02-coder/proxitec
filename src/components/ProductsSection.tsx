import { useState } from "react";
import { ChevronLeft, ChevronRight, X, MessageCircle } from "lucide-react";

// === Catégorie : Alarmes Véhicules MILANO ===
import milano1 from "@/assets/products/milano/milano-1.jpg";
import milano2 from "@/assets/products/milano/milano-2.jpg";
import milano3 from "@/assets/products/milano/milano-3.avif";
import milano4 from "@/assets/products/milano/milano-4.avif";

// === Catégorie : Vidéosurveillance ===
import camDome from "@/assets/products/videosurveillance/dome-hikvision.jpg";
import camBullet from "@/assets/products/videosurveillance/bullet-hikvision.jpg";
import camSolaire from "@/assets/products/videosurveillance/camera-solaire-4g.jpg";
import camColorvu from "@/assets/products/videosurveillance/colorvu-tube.webp";
import camPtz from "@/assets/products/videosurveillance/ptz-hikvision.jpg";
import camWifi from "@/assets/products/videosurveillance/camera-wifi-exterieure.jpg";
import camKit from "@/assets/products/videosurveillance/kit-camera-4k.jpg";
import camPinhole from "@/assets/products/videosurveillance/mini-camera-pinhole.jpg";

// === Catégorie : Réseau Informatique ===
import reseauConnBlinde from "@/assets/products/reseau/connecteurs-blindes-rj45.jpg";
import reseauConnCat5e from "@/assets/products/reseau/connecteurs-rj45-cat5e.jpg";
import reseauCordonNoir from "@/assets/products/reseau/cordon-brassage-cat6-noir.jpg";
import reseauCordonCouleurs from "@/assets/products/reseau/cordon-brassage-cat6-couleurs.jpg";
import reseauPriseLegrand from "@/assets/products/reseau/prise-mosaique-rj45-legrand.jpg";
import reseauSwitchTpLink from "@/assets/products/reseau/switch-tp-link-16-ports.jpg";

// === Catégorie : Alarme Anti-Intrusion ===
import alarmeFelix from "@/assets/products/alarme-intrusion/alarme-felix.jpg";
import alarmeWifiGsm from "@/assets/products/alarme-intrusion/systeme-wifi-gsm.png";
import alarmeCentre from "@/assets/products/alarme-intrusion/centre-surveillance.png";
import alarmeContact from "@/assets/products/alarme-intrusion/contact-ouverture.webp";
import alarmeDetecteur from "@/assets/products/alarme-intrusion/detecteur-presence.jpg";
import alarmeKitFelix from "@/assets/products/alarme-intrusion/kit-alarme-felix.jpg";
import alarmeKitComplet from "@/assets/products/alarme-intrusion/kit-alarme-complet.png";
import alarmeKitWifi from "@/assets/products/alarme-intrusion/kit-alarme-wifi.png";
import alarmeSireneExt from "@/assets/products/alarme-intrusion/sirene-exterieure.jpg";
import alarmeSireneSansFil from "@/assets/products/alarme-intrusion/sirene-sans-fil.jpg";

// === Catégorie : Incendie ===
import incendieAccessoires from "@/assets/products/incendie/accessoires-detection.png";
import incendieBouton from "@/assets/products/incendie/bouton-urgence.jpg";
import incendieDetecteur from "@/assets/products/incendie/detecteur-fumee.jpg";
import incendieSirene from "@/assets/products/incendie/sirene-stroboscopique.jpg";

// === Catégorie : GPS ===
import gpsMobileApp from "@/assets/products/gps/gps-mobile-app.png";
import gpsVehiculeMoto from "@/assets/products/gps/gps-vehicule-moto.jpg";
import gpsRope from "@/assets/products/gps/gps-rope-plateforme.png";
import gpsTracker from "@/assets/products/gps/gps-tracker.png";
import gpsM558s from "@/assets/products/gps/gps-m558s.png";
import gpsMobileOversee from "@/assets/products/gps/gps-mobile-oversee.png";
import gpsTk003 from "@/assets/products/gps/gps-tk003-suivi.jpg";
import gpsWebInterface from "@/assets/products/gps/gps-web-interface.png";

// === Catégorie : Fibre Optique ===
import optiqueCigarettes from "@/assets/products/optique/cigarettes-epissures.jpg";
import optiqueCliveuse from "@/assets/products/optique/cliveuse-komshine.jpg";
import optiqueEpisseuse from "@/assets/products/optique/episseuse-komshine.jpg";
import optiqueJarretiere from "@/assets/products/optique/jarretiere-fibre.jpg";
import optiqueFx39 from "@/assets/products/optique/komshine-fx39.jpg";
import optiqueReflectometre from "@/assets/products/optique/reflectometre.jpg";
import optiqueSmoove from "@/assets/products/optique/smoove-fibre.jpg";
import optiqueVfl from "@/assets/products/optique/visual-fault-locator.jpg";

const WHATSAPP_NUMBER = "24107265831";

type Product = { src: string; label: string };
type ProductCategory = {
  id: string;
  name: string;
  description: string;
  products: Product[];
};

const categories: ProductCategory[] = [
  {
    id: "videosurveillance",
    name: "Vidéosurveillance",
    description:
      "Caméras IP, dômes, bullets, PTZ, solaires et kits complets — Hikvision et autres marques professionnelles disponibles au Gabon.",
    products: [
      { src: camDome, label: "Caméra Dôme Hikvision ColorVu" },
      { src: camBullet, label: "Caméra Bullet Hikvision EXIR H.265+" },
      { src: camColorvu, label: "Caméra Tube Hikvision ColorVu 2MP" },
      { src: camPtz, label: "Caméra PTZ Hikvision Double Objectif" },
      { src: camSolaire, label: "Caméra Solaire 4G Double Objectif" },
      { src: camWifi, label: "Caméra WiFi Extérieure Double Objectif" },
      { src: camKit, label: "Kit 8 Caméras 4K Hikvision HybridLight" },
      { src: camPinhole, label: "Mini Caméra Pinhole Discrète" },
    ],
  },
  {
    id: "milano",
    name: "Alarmes Véhicules MILANO",
    description:
      "Systèmes d'alarme anti-vol MILANO — protection haut de gamme pour tous types de véhicules avec télécommande, sirène et immobiliseur.",
    products: [
      { src: milano1, label: "Kit alarme MILANO complet" },
      { src: milano2, label: "MILANO Roadpower Car Alarm" },
      { src: milano3, label: "MILANO Keyless Entry System" },
      { src: milano4, label: "MILANO Anti-hijack System" },
    ],
  },
  {
    id: "reseau",
    name: "Réseau Informatique",
    description:
      "Connecteurs RJ45, cordons de brassage Cat6, prises murales Legrand et switches TP-Link — tout le matériel réseau professionnel pour vos installations.",
    products: [
      { src: reseauSwitchTpLink, label: "Switch TP-Link 16 Ports Gigabit PoE+" },
      { src: reseauPriseLegrand, label: "Prise Mosaïque RJ45 Legrand Cat6" },
      { src: reseauCordonCouleurs, label: "Cordons de Brassage Cat6 (Couleurs)" },
      { src: reseauCordonNoir, label: "Cordon de Brassage Cat6 Noir" },
      { src: reseauConnBlinde, label: "Connecteurs Blindés RJ45 Cat6" },
      { src: reseauConnCat5e, label: "Connecteurs RJ45 Cat5e" },
    ],
  },
  {
    id: "alarme-intrusion",
    name: "Alarme Anti-Intrusion",
    description:
      "Systèmes d'alarme WiFi + GSM, détecteurs de présence, contacts d'ouverture, sirènes et kits complets FELIX — sécurisez vos locaux avec une surveillance intelligente.",
    products: [
      { src: alarmeKitWifi, label: "Kit Alarme WiFi + GSM Complet" },
      { src: alarmeKitComplet, label: "Kit Alarme Connecté Multi-Capteurs" },
      { src: alarmeKitFelix, label: "Kit Alarme GSM FELIX avec Sirène" },
      { src: alarmeFelix, label: "Centrale Alarme FELIX FX-A712M" },
      { src: alarmeWifiGsm, label: "Système WiFi + GSM Multi-Détecteurs" },
      { src: alarmeCentre, label: "Centre de Surveillance & Monitoring" },
      { src: alarmeDetecteur, label: "Détecteur de Présence Sans Fil" },
      { src: alarmeContact, label: "Contact d'Ouverture Porte/Fenêtre" },
      { src: alarmeSireneSansFil, label: "Sirène d'Alarme Sans Fil" },
      { src: alarmeSireneExt, label: "Sirène d'Alarme Extérieure" },
    ],
  },
  {
    id: "incendie",
    name: "Détection Incendie",
    description:
      "Détecteurs de fumée, boutons d'urgence, sirènes stroboscopiques et accessoires de détection — protégez vos locaux contre les risques d'incendie.",
    products: [
      { src: incendieAccessoires, label: "Accessoires de Détection Incendie" },
      { src: incendieDetecteur, label: "Détecteur de Fumée Autonome" },
      { src: incendieBouton, label: "Bouton d'Urgence Ouverture Porte" },
      { src: incendieSirene, label: "Sirène Stroboscopique Incendie" },
    ],
  },
  {
    id: "gps",
    name: "GPS & Tracking",
    description:
      "Traceurs GPS pour véhicules et motos avec suivi en temps réel, géo-clôture, alertes et application mobile — plateforme MYROPE / Oversee incluse.",
    products: [
      { src: gpsTracker, label: "Traceur GPS Véhicule & Moto" },
      { src: gpsM558s, label: "Traceur GPS M558S Compact" },
      { src: gpsVehiculeMoto, label: "Kit GPS TK003 Véhicule" },
      { src: gpsTk003, label: "Traceur TK003 avec Suivi Mobile" },
      { src: gpsMobileOversee, label: "Application Mobile Oversee GPS" },
      { src: gpsMobileApp, label: "Application Mobile de Suivi" },
      { src: gpsRope, label: "Plateforme MYROPE Cloud Tracking" },
      { src: gpsWebInterface, label: "Interface Web de Suivi GPS" },
    ],
  },
  {
    id: "fibre-optique",
    name: "Fibre Optique",
    description:
      "Épisseuses, cliveuses, réflectomètres, jarretières et accessoires Komshine — outillage professionnel pour l'installation et la maintenance de la fibre optique.",
    products: [
      { src: optiqueEpisseuse, label: "Épisseuse à Fusion Komshine FX39" },
      { src: optiqueFx39, label: "Soudeuse Fibre Optique Komshine FX39" },
      { src: optiqueCliveuse, label: "Cliveuse Fibre Optique FTTH Komshine" },
      { src: optiqueReflectometre, label: "Réflectomètre / Source Lumineuse KLS-35" },
      { src: optiqueVfl, label: "Visual Fault Locator Komshine 10mW" },
      { src: optiqueJarretiere, label: "Jarretière Fibre Optique SC/APC" },
      { src: optiqueCigarettes, label: "Smooves Protection Épissures 61mm" },
      { src: optiqueSmoove, label: "Smooves Fibre Optique (Pack)" },
    ],
  },
];

const buildWhatsAppLink = (productName: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Bonjour Proxitec, je suis intéressé(e) par le produit : ${productName}. Pourriez-vous me donner plus d'informations ?`
  )}`;

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [lightbox, setLightbox] = useState<{ catIdx: number; prodIdx: number } | null>(null);

  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];

  const navigateLightbox = (direction: number) => {
    if (!lightbox) return;
    const cat = categories[lightbox.catIdx];
    const newIdx = lightbox.prodIdx + direction;
    if (newIdx >= 0 && newIdx < cat.products.length) {
      setLightbox({ ...lightbox, prodIdx: newIdx });
    }
  };

  return (
    <section id="produits" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-montserrat font-bold text-xs uppercase tracking-widest mb-6">
            Nos Produits
          </div>
          <h2 className="font-montserrat font-black text-4xl md:text-5xl text-foreground mb-4">
            Catalogue{" "}
            <span className="text-gradient-primary">par Catégorie</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez nos produits classés par catégorie — matériel de qualité professionnelle disponible au Gabon.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-montserrat font-bold text-sm transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Category description */}
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          {currentCategory.description}
        </p>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentCategory.products.map((product, idx) => {
            const catIdx = categories.findIndex((c) => c.id === activeCategory);
            return (
              <div
                key={idx}
                className="group rounded-2xl overflow-hidden bg-card border border-border shadow-card hover:shadow-hover transition-all duration-400 hover:-translate-y-2 flex flex-col"
              >
                {/* Image — clickable for lightbox */}
                <div
                  className="aspect-square overflow-hidden cursor-pointer relative"
                  onClick={() => setLightbox({ catIdx, prodIdx: idx })}
                >
                  <img
                    src={product.src}
                    alt={product.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 pointer-events-none" />
                </div>

                {/* Info + CTA */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="font-montserrat font-semibold text-sm text-foreground text-center leading-tight flex-1 mb-3">
                    {product.label}
                  </p>
                  <a
                    href={buildWhatsAppLink(product.label)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-montserrat font-bold text-xs sm:text-sm transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Commander maintenant
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Fermer"
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {lightbox.prodIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              aria-label="Précédent"
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          {lightbox.prodIdx < categories[lightbox.catIdx].products.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              aria-label="Suivant"
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={categories[lightbox.catIdx].products[lightbox.prodIdx].src}
              alt={categories[lightbox.catIdx].products[lightbox.prodIdx].label}
              className="w-full max-h-[70vh] object-contain rounded-2xl"
            />
            <p className="text-center text-white font-montserrat font-bold text-lg mt-4">
              {categories[lightbox.catIdx].products[lightbox.prodIdx].label}
            </p>
            <p className="text-center text-white/80 text-sm mt-1 mb-4">
              {lightbox.prodIdx + 1} / {categories[lightbox.catIdx].products.length}
            </p>
            <div className="flex justify-center">
              <a
                href={buildWhatsAppLink(categories[lightbox.catIdx].products[lightbox.prodIdx].label)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1da851] text-white font-montserrat font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Commander maintenant
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
