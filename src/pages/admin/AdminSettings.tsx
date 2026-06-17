import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, User, KeyRound, Palette, RotateCcw, Check, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// HSL strings stored in CSS variables (no "hsl()" wrapper)
const DEFAULT_THEME = {
  primary: "4 85% 45%",     // PROXITEC red
  gold: "44 95% 50%",       // PROXITEC gold
};

const PRESETS = [
  { name: "Rouge PROXITEC", primary: "4 85% 45%", gold: "44 95% 50%", swatch: "#d11f1f" },
  { name: "Bleu Royal",     primary: "220 85% 45%", gold: "44 95% 50%", swatch: "#1d4ed8" },
  { name: "Vert Émeraude",  primary: "152 70% 38%", gold: "44 95% 50%", swatch: "#10b981" },
  { name: "Violet Premium", primary: "270 75% 50%", gold: "44 95% 50%", swatch: "#8b5cf6" },
  { name: "Orange Sunset",  primary: "20 90% 50%",  gold: "44 95% 50%", swatch: "#f97316" },
  { name: "Noir Élégant",   primary: "220 15% 18%", gold: "44 95% 50%", swatch: "#27272a" },
];

function hexToHsl(hex: string): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16) / 255;
  const g = parseInt(m.slice(2, 4), 16) / 255;
  const b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslToHex(hsl: string): string {
  const [hStr, sStr, lStr] = hsl.split(" ");
  const h = parseFloat(hStr) / 360;
  const s = parseFloat(sStr) / 100;
  const l = parseFloat(lStr) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) { r = g = b = l; }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function applyTheme(t: { primary: string; gold: string }) {
  const root = document.documentElement;
  root.style.setProperty("--primary", t.primary);
  root.style.setProperty("--ring", t.primary);
  root.style.setProperty("--accent-blue", t.primary);
  root.style.setProperty("--gold", t.gold);
}

export function loadSavedTheme() {
  try {
    const raw = localStorage.getItem("proxitec-theme");
    if (raw) applyTheme(JSON.parse(raw));
  } catch {}
}

export default function AdminSettings() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  // Vendor password reset
  type Vendeur = { user_id: string; email: string; full_name: string };
  const [vendeurs, setVendeurs] = useState<Vendeur[]>([]);
  const [selectedVendeur, setSelectedVendeur] = useState<string>("");
  const [vendeurNewPwd, setVendeurNewPwd] = useState("");
  const [vendeurConfirmPwd, setVendeurConfirmPwd] = useState("");
  const [savingVendeurPwd, setSavingVendeurPwd] = useState(false);
  const [loadingVendeurs, setLoadingVendeurs] = useState(false);

  const [theme, setTheme] = useState(() => {
    try { return JSON.parse(localStorage.getItem("proxitec-theme") || "null") || DEFAULT_THEME; }
    catch { return DEFAULT_THEME; }
  });

  useEffect(() => {
    if (!user) return;
    setEmail(user.email ?? "");
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setFullName(data?.full_name ?? ""));
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
    setSavingProfile(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profil mis à jour");
  };

  const changePassword = async () => {
    if (!user?.email) return;
    if (newPwd.length < 6) { toast.error("Le nouveau mot de passe doit faire au moins 6 caractères"); return; }
    if (newPwd !== confirmPwd) { toast.error("Les mots de passe ne correspondent pas"); return; }
    setSavingPwd(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPwd });
    if (signErr) { setSavingPwd(false); toast.error("Mot de passe actuel incorrect"); return; }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setSavingPwd(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Mot de passe changé");
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
  };

  const updateTheme = (next: typeof DEFAULT_THEME) => {
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("proxitec-theme", JSON.stringify(next));
  };

  const resetTheme = () => {
    localStorage.removeItem("proxitec-theme");
    setTheme(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
    toast.success("Thème réinitialisé");
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-black font-montserrat flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-primary" /> Paramètres administrateur
        </h1>
        <p className="text-muted-foreground">Gérez votre profil, votre sécurité et l'apparence du site.</p>
      </div>

      <Card className="p-6 mb-6 hover:shadow-md transition-shadow">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Profil</h2>
        <div className="space-y-4">
          <div><Label>Email</Label><Input value={email} disabled /></div>
          <div><Label>Nom complet</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} /></div>
          <Button onClick={saveProfile} disabled={savingProfile} className="hover-scale">
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 mb-6 hover:shadow-md transition-shadow">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><KeyRound className="w-5 h-5" /> Mot de passe</h2>
        <div className="space-y-4">
          <div><Label>Mot de passe actuel</Label><Input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} /></div>
          <div><Label>Nouveau mot de passe</Label><Input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} /></div>
          <div><Label>Confirmer</Label><Input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} /></div>
          <Button onClick={changePassword} disabled={savingPwd} className="hover-scale">
            {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : "Changer le mot de passe"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2"><Palette className="w-5 h-5" /> Apparence & couleurs</h2>
          <Button variant="ghost" size="sm" onClick={resetTheme}><RotateCcw className="w-4 h-4 mr-2" />Réinitialiser</Button>
        </div>

        <div className="mb-6">
          <Label className="mb-3 block">Thèmes prédéfinis</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESETS.map(p => {
              const active = theme.primary === p.primary && theme.gold === p.gold;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => updateTheme({ primary: p.primary, gold: p.gold })}
                  className={`group relative p-3 rounded-xl border-2 transition-all hover-scale ${active ? "border-primary shadow-md" : "border-border hover:border-primary/50"}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full shadow-inner" style={{ background: p.swatch }} />
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  {active && <Check className="absolute top-2 right-2 w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
          <div>
            <Label>Couleur principale</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                type="color"
                value={hslToHex(theme.primary)}
                onChange={(e) => updateTheme({ ...theme, primary: hexToHsl(e.target.value) })}
                className="w-16 h-11 p-1 cursor-pointer"
              />
              <div className="flex-1 text-sm text-muted-foreground font-mono">{hslToHex(theme.primary).toUpperCase()}</div>
            </div>
          </div>
          <div>
            <Label>Couleur dorée</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                type="color"
                value={hslToHex(theme.gold)}
                onChange={(e) => updateTheme({ ...theme, gold: hexToHsl(e.target.value) })}
                className="w-16 h-11 p-1 cursor-pointer"
              />
              <div className="flex-1 text-sm text-muted-foreground font-mono">{hslToHex(theme.gold).toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-muted/40 border">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Aperçu</div>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="hover-scale">Bouton principal</Button>
            <span className="px-3 py-1.5 rounded-md bg-gold text-gold-foreground font-bold text-sm">Badge doré</span>
            <span className="text-primary font-bold">Texte coloré</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Le thème est appliqué instantanément sur tout le site et sauvegardé dans ce navigateur.</p>
      </Card>
    </div>
  );
}
