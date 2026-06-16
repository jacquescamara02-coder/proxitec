import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Package, Users, Wrench, FileText, Printer,
  UserCog, BarChart3, LogOut, Menu, Settings,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", end: true, label: "Vue d'ensemble", icon: LayoutDashboard },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/interventions", label: "Interventions", icon: Wrench },
  { to: "/admin/factures", label: "Factures", icon: FileText },
  { to: "/admin/impressions", label: "Impressions", icon: Printer },
  { to: "/admin/vendeurs", label: "Vendeurs", icon: UserCog },
  { to: "/admin/rapports", label: "Rapports", icon: BarChart3 },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex bg-muted/30 print:bg-white">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static z-40 inset-y-0 left-0 w-64 bg-card border-r flex-col print:hidden",
        "transform transition-transform lg:transform-none flex",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b">
          <div className="font-black text-xl font-montserrat text-primary">PROXITEC</div>
          <div className="text-xs text-muted-foreground mt-1">Admin Console</div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{user?.email}</div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2">
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <main className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden flex items-center gap-3 p-4 bg-card border-b print:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}><Menu /></Button>
          <div className="font-black text-primary">PROXITEC Admin</div>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-x-auto">{children}</div>
      </main>
    </div>
  );
};
