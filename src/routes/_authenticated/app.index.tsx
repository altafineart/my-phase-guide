import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles, NotebookPen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePerfil } from "@/hooks/use-perfil";
import { rotuloFase, rotuloSintoma, inicioJanelaVisivel, isoData } from "@/lib/menopausa";
import { montarRelatorio, sintomasDoPerfil } from "@/lib/relatorio";
import { padroesRecentes, type Registro } from "@/lib/padroes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({
    meta: [
      { title: "Seu painel — Guia de Menopausa" },
      {
        name: "description",
        content: "Resumo do seu relatório personalizado e atalho para o diário de hoje.",
      },
      { property: "og:title", content: "Seu painel — Guia de Menopausa" },
      {
        property: "og:description",
        content: "Resumo do seu relatório personalizado e diário de sintomas.",
      },
    ],
  }),
  component: Painel,
});

function Painel() {
  const navigate = useNavigate();
  const { data: perfil, isLoading } = usePerfil();

  const { data: registros } = useQuery({
    queryKey: ["registros", "recentes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registros_diario")
        .select("id, data, calorao, intensidade_calorao, sono, humor, energia")
        .gte("data", isoData(inicioJanelaVisivel()))
        .order("data", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Registro[];
    },
  });

  useEffect(() => {
    if (!isLoading && perfil && !perfil.onboarding_completo) {
      navigate({ to: "/comecar" });
    }
  }, [isLoading, perfil, navigate]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-5 py-8">
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-40 rounded-3xl" />
      </main>
    );
  }

  const sintomas = perfil ? sintomasDoPerfil(perfil) : [];
  const secoes = perfil ? montarRelatorio(perfil) : [];
  const primeiro = secoes[0]?.blocos[0];
  const padroes = padroesRecentes(registros ?? []);
  const hoje = isoData(new Date());
  const registroDeHoje = registros?.find((r) => r.data === hoje);

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-5 py-8">
      <section className="rounded-3xl superficie-quente p-6 sombra-suave">
        <p className="text-sm text-accent-foreground/80">Seu momento</p>
        <h1 className="mt-1 text-2xl font-semibold text-accent-foreground">
          {rotuloFase(perfil?.fase_menopausa)}
          {perfil?.idade ? `, ${perfil.idade} anos` : ""}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {sintomas.map((s) => (
            <Badge key={s} variant="secondary" className="rounded-full px-3 py-1 font-normal">
              {rotuloSintoma(s)}
            </Badge>
          ))}
        </div>
      </section>

      {padroes.length > 0 && (
        <Card className="rounded-3xl border-sage/40 bg-card sombra-card">
          <CardContent className="p-6">
            <p className="flex items-center gap-2 text-sm font-medium text-sage-foreground">
              <Sparkles className="size-4" /> Padrões recentes no seu diário
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {padroes.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-3xl sombra-card">
        <CardContent className="p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Do seu relatório
          </p>
          <h2 className="mt-2 text-lg font-semibold">{primeiro?.titulo}</h2>
          <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {primeiro?.paragrafos[0]}
          </p>
          <Button asChild variant="ghost" className="mt-3 rounded-full px-0 text-primary">
            <Link to="/app/relatorio">
              Ler relatório completo <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/60 sombra-card">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-medium">
              <NotebookPen className="size-4 text-primary" /> Como foi o seu dia?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {registroDeHoje
                ? "Você já registrou hoje — pode ajustar quando quiser."
                : "Leva menos de um minuto e alimenta a sua linha do tempo."}
            </p>
          </div>
          <Button asChild size="lg" className="rounded-2xl">
            <Link to="/app/diario">{registroDeHoje ? "Editar registro" : "Registrar hoje"}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
