import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, LogOut, LayoutDashboard, List, BarChart3, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground")
      }
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, roles, signOut, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <DollarSign className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">FinTrack</span>
            </div>
            <nav className="flex items-center gap-1 ml-4">
              <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/records" icon={List} label="Records" />
              <NavItem to="/analytics" icon={BarChart3} label="Analytics" />
              {isAdmin && <NavItem to="/admin" icon={Users} label="Admin" />}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              {roles.map((r) => (
                <Badge key={r} variant="secondary" className="text-xs capitalize">{r}</Badge>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  );
}
