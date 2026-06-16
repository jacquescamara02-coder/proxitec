import { CheckCircle2, Award, Users, Cpu } from "lucide-react";

const values = [
  { icon: CheckCircle2, title: "Fiabilité", desc: "Des solutions éprouvées et garanties pour votre tranquillité d'esprit." },
  { icon: Award, title: "Excellence", desc: "Expertise technique de haut niveau dans tous nos domaines d'intervention." },
  { icon: Users, title: "Proximité", desc: "Un accompagnement personnalisé pour chaque client au Gabon." },
  { icon: Cpu, title: "Innovation", desc: "Des technologies de pointe adaptées aux besoins locaux." },
];

const AboutSection = () => {
  return (
    <section id="apropos" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-montserrat font-bold text-xs uppercase tracking-widest mb-6">
              Qui sommes-nous ?
            </div>
            <h2 className="font-montserrat font-black text-4xl md:text-5xl text-foreground mb-6 leading-tight">
              Votre Expert Technologique{" "}
              <span className="text-gradient-primary">au Gabon</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              <strong className="text-foreground">PROXITEC SOLUTIONS IT &amp; ÉLECTRONIQUE</strong> est une entreprise gabonaise spécialisée
              dans la fourniture, l'installation et la maintenance de solutions informatiques, optiques
              et électroniques sur l'ensemble du territoire gabonais.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Fondée en 2021, nous mettons notre expertise au service des entreprises, institutions et particuliers
              pour sécuriser, connecter et optimiser leurs infrastructures technologiques.
            </p>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-secondary/50">
                <div className="font-montserrat font-bold text-primary text-sm mb-1">NIF</div>
                <div className="text-foreground text-sm font-mono">202102011333-R</div>
              </div>
              <div className="p-4 rounded-xl border border-border bg-secondary/50">
                <div className="font-montserrat font-bold text-primary text-sm mb-1">RCCM</div>
                <div className="text-foreground text-sm font-mono">GA-LBV-01-2021-A10-03344</div>
              </div>
            </div>
          </div>

          {/* Right: Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 rounded-2xl bg-background border border-border shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-montserrat font-bold text-foreground text-lg mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
