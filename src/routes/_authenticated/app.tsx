import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { BookOpen, LineChart, Home, History, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppLayout,
});

const NAV = [
  { to: "/app", rotulo: "Início", icone: Home, exact: true },
  { to: "/app/relatorio", rotulo: "Relatório", icone: BookOpen, exact: false },
  { to: "/app/diario", rotulo: "Diário", icone: LineChart, exact: false },
  { to: "/app/historico", rotulo: "Histórico", icone: History, exact: false },
] as const;

function AppLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="border-b border-border/60 bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link to="/app" className="text-sm font-semibold tracking-tight">
            Guia de Menopausa
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full text-muted-foreground"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="size-4" /> Sair
          </Button>
        </div>
      </header>

      <Outlet />

      <nav className="fixed inset-x-0 bottom-0 border-t border-border/60 bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <item.icone className="size-5" />
              {item.rotulo}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
