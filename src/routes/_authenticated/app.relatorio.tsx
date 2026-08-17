import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePerfil } from "@/hooks/use-perfil";
import { montarRelatorio } from "@/lib/relatorio";
import { rotuloFase, inicioJanelaVisivel, isoData } from "@/lib/menopausa";
import { padroesRecentes, type Registro } from "@/lib/padroes";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/relatorio")({
  head: () => ({
    meta: [
      { title: "Seu relatório personalizado — Guia de Menopausa" },
      {
        name: "description",
        content:
          "Relatório montado a partir da sua fase e dos seus sintomas: o que acontece no corpo, o que esperar e recomendações.",
      },
      { property: "og:title", content: "Seu relatório personalizado — Guia de Menopausa" },
      {
        property: "og:description",
        content: "O que está acontecendo no seu corpo, por sintoma, com recomendações práticas.",
      },
    ],
  }),
  component: Relatorio,
});

function Relatorio() {
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

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-5 py-8">
        <Skeleton className="h-24 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </main>
    );
  }

  const secoes = perfil ? montarRelatorio(perfil) : [];
  const padroes = padroesRecentes(registros ?? []);

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-5 py-8">
      <header>
        <p className="text-sm text-muted-foreground">Relatório personalizado</p>
        <h1 className="mt-1 text-3xl font-semibold">{rotuloFase(perfil?.fase_menopausa)}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Montado a partir das suas respostas. Este conteúdo é informativo e não substitui
          avaliação médica individual.
        </p>
      </header>

      {padroes.length > 0 && (
        <Card className="rounded-3xl border-sage/40 sombra-card">
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-sage-foreground">
              O que o seu diário mostra agora
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {padroes.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {secoes.map((secao) => (
        <section key={secao.id} className="space-y-4">
          <h2 className="text-xl font-semibold">{secao.titulo}</h2>
          {secao.blocos.map((bloco) => (
            <Card key={bloco.id} className="rounded-3xl border-border/60 sombra-card">
              <CardContent className="space-y-3 p-6">
                <h3 className="font-medium">{bloco.titulo}</h3>
                {bloco.paragrafos.map((p, i) => (
                  <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
      ))}

      <p className="pb-4 text-xs leading-relaxed text-muted-foreground">
        Conteúdo educativo sobre saúde da mulher. Procure um ginecologista ou endocrinologista
        antes de iniciar suplementos, fitoterápicos ou terapia hormonal.
      </p>
    </main>
  );
}
