import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Guia de Menopausa" },
      {
        name: "description",
        content:
          "Acesse seu relatório personalizado e o diário de sintomas com um link mágico enviado para o seu e-mail.",
      },
      { property: "og:title", content: "Entrar — Guia de Menopausa" },
      {
        property: "og:description",
        content: "Acesse seu relatório personalizado e o diário de sintomas.",
      },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/app" });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function enviarLink(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/app` },
    });
    setCarregando(false);
    if (error) setErro(error.message);
    else setEnviado(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16 superficie-suave">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar
        </Link>

        <Card className="rounded-3xl border-border/60 sombra-suave">
          <CardHeader>
            <CardTitle className="text-2xl">Entrar no seu guia</CardTitle>
            <CardDescription>
              Sem senha. Enviamos um link de acesso para o seu e-mail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enviado ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="size-10 text-sage" />
                <p className="font-medium">Link enviado</p>
                <p className="text-sm text-muted-foreground">
                  Confira a caixa de entrada de <strong>{email}</strong> e clique no link para
                  acessar. Ele funciona por tempo limitado.
                </p>
                <Button variant="ghost" onClick={() => setEnviado(false)}>
                  Usar outro e-mail
                </Button>
              </div>
            ) : (
              <form onSubmit={enviarLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Seu e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className="h-12 rounded-2xl"
                  />
                </div>
                {erro && <p className="text-sm text-destructive">{erro}</p>}
                <Button type="submit" size="lg" className="h-12 w-full rounded-2xl" disabled={carregando}>
                  <Mail className="size-4" />
                  {carregando ? "Enviando..." : "Receber link de acesso"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Use o mesmo e-mail da sua compra.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
