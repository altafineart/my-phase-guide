import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, HeartHandshake, LineChart, Sparkles, Lock } from "lucide-react";
import heroImg from "@/assets/hero-menopausa.jpg";
import { FASES, SINTOMAS, type Fase, type SintomaId } from "@/lib/menopausa";
import { previaTeaser } from "@/lib/relatorio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CHECKOUT_KIWIFY = "https://pay.kiwify.com.br/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guia de Menopausa — seu relatório personalizado" },
      {
        name: "description",
        content:
          "Um guia feito para o seu corpo: relatório personalizado por fase e sintomas, mais um diário para acompanhar calorões, sono, humor e energia.",
      },
      { property: "og:title", content: "Guia de Menopausa — seu relatório personalizado" },
      {
        property: "og:description",
        content:
          "Relatório individualizado por fase e sintomas, e um diário para acompanhar a sua evolução.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-semibold tracking-tight">Guia de Menopausa</span>
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/entrar">Entrar</Link>
        </Button>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 md:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground">
              <Sparkles className="size-4" /> Pagamento único, acesso vitalício
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              A menopausa explicada <em className="not-italic text-primary">para o seu corpo</em> —
              não para todo mundo.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Você responde algumas perguntas sobre a sua fase e os seus sintomas. A partir daí,
              montamos um relatório individual — e um diário para acompanhar como você está de
              verdade, semana a semana.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-13 rounded-2xl px-7 text-base">
                <a href={CHECKOUT_KIWIFY}>
                  Quero meu guia <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-2xl px-7 text-base">
                <a href="#teaser">Ver uma prévia grátis</a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] sombra-suave">
            <img
              src={heroImg}
              alt="Mulher em seus cinquenta anos sentada tranquilamente junto à janela, em luz da manhã"
              width={1280}
              height={1600}
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="superficie-suave py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-3xl font-semibold">Duas coisas, bem feitas</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <Card className="rounded-3xl border-border/60 sombra-card">
                <CardContent className="p-7">
                  <HeartHandshake className="size-7 text-primary" />
                  <h3 className="mt-4 text-xl font-medium">Relatório personalizado</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    Nada de e-book genérico. O texto é montado a partir da sua fase
                    (perimenopausa, menopausa ou pós-menopausa) e dos sintomas que você marcou:
                    o que está acontecendo no seu corpo, o que esperar e o que ajuda em cada caso.
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-border/60 sombra-card">
                <CardContent className="p-7">
                  <LineChart className="size-7 text-primary" />
                  <h3 className="mt-4 text-xl font-medium">Diário de sintomas</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    Um minuto por dia: calorão, sono, humor e energia. Vira um gráfico simples de
                    evolução, e o seu relatório passa a comentar os padrões recentes — como
                    "seus calorões pioraram nas últimas 2 semanas".
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Teaser />

        <section className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h2 className="text-3xl font-semibold">Um pagamento. Para sempre seu.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Sem mensalidade e sem assinatura. Você paga uma vez e mantém acesso ao relatório
            completo e ao diário de sintomas.
          </p>
          <ul className="mx-auto mt-7 grid max-w-md gap-3 text-left">
            {[
              "Relatório personalizado por fase e sintomas",
              "Diário diário de calorão, sono, humor e energia",
              "Gráfico de evolução dos últimos 6 meses",
              "Acesso vitalício, sem renovação",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-sage" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-9 h-13 rounded-2xl px-8 text-base">
            <a href={CHECKOUT_KIWIFY}>
              Comprar acesso vitalício <ArrowRight className="size-4" />
            </a>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Já comprou? <Link to="/entrar" className="text-primary underline">Entre aqui</Link>.
          </p>
        </section>

        <footer className="border-t border-border/60 py-8">
          <p className="mx-auto max-w-3xl px-5 text-center text-xs leading-relaxed text-muted-foreground">
            Conteúdo educativo sobre saúde da mulher. Não substitui consulta, diagnóstico ou
            tratamento médico.
          </p>
        </footer>
      </main>
    </div>
  );
}

function Teaser() {
  const [fase, setFase] = useState<Fase | null>(null);
  const [sintoma, setSintoma] = useState<SintomaId | null>(null);

  const blocos = fase && sintoma ? previaTeaser(fase, sintoma) : [];

  return (
    <section id="teaser" className="mx-auto max-w-3xl px-5 py-16">
      <h2 className="text-3xl font-semibold">Veja um pedacinho, de graça</h2>
      <p className="mt-2 text-muted-foreground">
        Duas perguntas rápidas e você já lê um trecho do relatório que seria seu.
      </p>

      <Card className="mt-7 rounded-3xl border-border/60 sombra-card">
        <CardContent className="space-y-6 p-6 sm:p-7">
          <div>
            <p className="text-sm font-medium">1. Em que fase você está?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FASES.map((f) => (
                <button
                  key={f.valor}
                  type="button"
                  onClick={() => setFase(f.valor)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    fase === f.valor
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {f.rotulo}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">2. O que mais te incomoda hoje?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SINTOMAS.map((s) => (
                <button
                  key={s.valor}
                  type="button"
                  onClick={() => setSintoma(s.valor)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors",
                    sintoma === s.valor
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {s.rotulo}
                </button>
              ))}
            </div>
          </div>

          {blocos.length > 0 && (
            <div className="space-y-4 rounded-2xl bg-muted/60 p-5">
              {blocos.map((b) => (
                <div key={b.id}>
                  <h3 className="font-medium">{b.titulo}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {b.paragrafos[0]}
                  </p>
                </div>
              ))}
              <div className="flex items-start gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
                <Lock className="mt-0.5 size-4 shrink-0" />
                <span>
                  O relatório completo continua com o restante da sua fase, cada sintoma marcado e
                  as recomendações práticas — além do diário de acompanhamento.
                </span>
              </div>
              <Button asChild size="lg" className="h-12 w-full rounded-2xl">
                <a href={CHECKOUT_KIWIFY}>Liberar meu relatório completo</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
