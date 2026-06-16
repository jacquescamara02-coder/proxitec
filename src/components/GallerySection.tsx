import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const galleryItems = [
  { src: gallery1, title: "Installation Réseau", category: "Réseaux" },
  { src: gallery2, title: "Pose Caméra CCTV", category: "Vidéosurveillance" },
  { src: gallery3, title: "Configuration Serveur", category: "Informatique" },
  { src: gallery4, title: "Équipe Technique", category: "Support IT" },
  { src: gallery5, title: "Contrôle d'Accès FELIX", category: "Sécurité" },
  { src: gallery6, title: "Formation Bureautique", category: "Formation" },
];

const GallerySection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="realisations" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-montserrat font-bold text-xs uppercase tracking-widest mb-6">
            Nos Réalisations
          </div>
          <h2 className="font-montserrat font-black text-4xl md:text-5xl text-foreground mb-4">
            Galerie de{" "}
            <span className="text-gradient-primary">Projets</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez quelques-unes de nos interventions professionnelles réalisées au Gabon.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-hover transition-all duration-400 hover:-translate-y-2"
              onClick={() => setLightbox(index)}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="inline-block px-2 py-0.5 rounded-full bg-gold text-gold-foreground text-xs font-montserrat font-bold mb-2">
                    {item.category}
                  </div>
                  <div className="text-primary-foreground font-montserrat font-bold text-lg">{item.title}</div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>
              {/* Category badge always visible */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/70 backdrop-blur-sm text-primary-foreground text-xs font-montserrat font-semibold group-hover:opacity-0 transition-opacity duration-300">
                {item.category}
              </div>
            </div>
          ))}
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
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6 text-primary-foreground" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryItems[lightbox].src}
              alt={galleryItems[lightbox].title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="text-center mt-4">
              <div className="inline-block px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-montserrat font-bold mb-2">
                {galleryItems[lightbox].category}
              </div>
              <div className="text-primary-foreground font-montserrat font-bold text-xl">
                {galleryItems[lightbox].title}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
