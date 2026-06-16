import { useState } from "react";
import { X, MessageCircle, Send, CheckCircle } from "lucide-react";
import { z } from "zod";

const devisSchema = z.object({
  nom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  telephone: z.string().trim().min(6, "Numéro invalide").max(20),
  email: z.string().trim().email("Email invalide").max(255).or(z.literal("")),
  service: z.string().min(1, "Veuillez sélectionner un service"),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères").max(1000),
});

type DevisForm = z.infer<typeof devisSchema>;

interface DevisModalProps {
  open: boolean;
  onClose: () => void;
  servicePreselect?: string;
}

const services = [
  "Vidéosurveillance",
  "Vidéoloft Cloud",
  "Géolocalisation GPS",
  "Contrôle d'Accès FELIX",
  "Formations Informatiques",
  "Alarmes Véhicules MILANO",
  "Alarmes Anti-Intrusion & Incendie",
  "Réseaux Informatiques & Optiques",
  "Téléphonie IP & Analogique",
  "Matériel Informatique & Serveurs",
  "Autre",
];

const DevisModal = ({ open, onClose, servicePreselect = "" }: DevisModalProps) => {
  const [form, setForm] = useState<DevisForm>({
    nom: "",
    telephone: "",
    email: "",
    service: servicePreselect,
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DevisForm, string>>>({});
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = devisSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof DevisForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof DevisForm;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    const msg = encodeURIComponent(
      `Bonjour Proxitec 👋\n\n*Demande de devis*\n\n` +
      `👤 *Nom :* ${form.nom}\n` +
      `📞 *Téléphone :* ${form.telephone}\n` +
      (form.email ? `📧 *Email :* ${form.email}\n` : "") +
      `🔧 *Service souhaité :* ${form.service}\n\n` +
      `💬 *Message :*\n${form.message}`
    );
    window.open(`https://wa.me/24107265831?text=${msg}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const handleClose = () => {
    setSent(false);
    setForm({ nom: "", telephone: "", email: "", service: servicePreselect, message: "" });
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="gradient-primary p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs font-montserrat font-semibold uppercase tracking-wider mb-1">
              <MessageCircle className="w-4 h-4" />
              Demande envoyée via WhatsApp
            </div>
            <h3 className="font-montserrat font-black text-xl text-primary-foreground">
              Demander un Devis
            </h3>
          </div>
          <button
            onClick={handleClose}
            aria-label="Fermer"
            className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>
        </div>

        {sent ? (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#25D366]/15 flex items-center justify-center mb-4">
              <CheckCircle className="w-9 h-9 text-[#25D366]" />
            </div>
            <h4 className="font-montserrat font-bold text-foreground text-xl mb-2">WhatsApp ouvert !</h4>
            <p className="text-muted-foreground text-sm mb-6">
              Votre message a été préparé. Envoyez-le sur WhatsApp pour recevoir votre devis rapidement.
            </p>
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-xl gradient-primary text-primary-foreground font-montserrat font-bold hover:shadow-primary-glow transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-xs font-montserrat font-semibold text-foreground uppercase tracking-wider mb-1">
                Nom complet *
              </label>
              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Ex: Jean-Pierre MOUKALA"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
              />
              {errors.nom && <p className="text-destructive text-xs mt-1">{errors.nom}</p>}
            </div>

            {/* Téléphone + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-montserrat font-semibold text-foreground uppercase tracking-wider mb-1">
                  Téléphone *
                </label>
                <input
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="+241 77 00 00 00"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
                />
                {errors.telephone && <p className="text-destructive text-xs mt-1">{errors.telephone}</p>}
              </div>
              <div>
                <label className="block text-xs font-montserrat font-semibold text-foreground uppercase tracking-wider mb-1">
                  Email (facultatif)
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@mail.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="block text-xs font-montserrat font-semibold text-foreground uppercase tracking-wider mb-1">
                Service souhaité *
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all"
              >
                <option value="">-- Sélectionner un service --</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.service && <p className="text-destructive text-xs mt-1">{errors.service}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-montserrat font-semibold text-foreground uppercase tracking-wider mb-1">
                Détails de votre besoin *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez votre projet, le lieu d'installation, la taille des locaux..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm transition-all resize-none"
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#25D366] text-white font-montserrat font-bold text-base hover:bg-[#1ebe5d] hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <Send className="w-5 h-5" />
              Envoyer via WhatsApp
            </button>
            <p className="text-center text-muted-foreground text-xs">
              Votre message sera préparé et ouvert dans WhatsApp.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default DevisModal;
