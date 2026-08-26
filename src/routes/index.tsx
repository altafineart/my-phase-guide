import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, HeartHandshake, LineChart, Sparkles, Lock, ShieldCheck, Quote } from "lucide-react";
import heroImg from "@/assets/hero-menopausa.jpg";
import { FASES, SINTOMAS, type Fase, type SintomaId } from "@/lib/menopausa";
import { previaTeaser } from "@/lib/relatorio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Link real do checkout do produto "Guia de Menopausa" na Kiwify (R$27, pagamento único).
const CHECKOUT_KIWIFY = "https://pay.kiwify.com.br/lBGhZU5";

const PRECO = "R$ 27";

// Monta a URL de checkout com UTM diferente por local do botão, para separar no relatório
// da Kiwify (e em qualquer analytics futuro) qual CTA está gerando o clique.
function checkoutUrl(utmContent: "hero" | "pricing" | "teaser") {
  const params = new URLSearchParams({
    utm_source: "site",
    utm_medium: "cta",
    utm_campaign: "landing_page",
    utm_content: utmContent,
  });
  return `${CHECKOUT_KIWIFY}?${params.toString()}`;
}

// Dispara o evento do Meta Pixel no clique do botão de compra, antes do redirect pra Kiwify.
function trackInitiateCheckout(utmContent: string) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;
  fbq("track", "InitiateCheckout", {
    content_name: "guia_menopausa",
    content_category: utmContent,
    value: 27,
    currency: "BRL",
  });
}

// Dispara um evento customizado para o botão de prévia grátis (não vai pro checkout,
// mas ajuda a comparar intenção de compra direta vs. exploração antes de decidir).
function trackViewPreview() {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== "function") return;
  fbq("trackCustom", "ViewPreviewClick");
}

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
              <Sparkles className="size-4" /> Pagamento único de {PRECO} — acesso vitalício ⏰ Oferta válida por 7 dias
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              A menopausa explicada <em className="not-italic text-primary">para o seu corpo</em> —
              não para todo mundo.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Calorão que não passa, noite maldormida, humor que muda sem aviso — e um médico que
              só diz "é a idade mesmo". Você responde algumas perguntas sobre a sua fase e os seus
              sintomas, e a partir daí montamos um relatório individual — e um diário para
              acompanhar como você está de verdade, semana a semana.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-13 rounded-2xl px-7 text-base">
                <a href={checkoutUrl("hero")} onClick={() => trackInitiateCheckout("hero")}>
                  Quero meu guia <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-2xl px-7 text-base">
                <a href="#teaser" onClick={trackViewPreview}>Ver uma prévia grátis</a>
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

        <Teaser />

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

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-semibold">Quem já testou</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                texto:
                  "Eu já tinha lido de tudo na internet, mas parecia que nada se aplicava exatamente ao que eu sentia. O relatório do Guia fez toda a diferença porque explicou o que estava acontecendo com o meu corpo e com os sintomas que eu realmente tinha na perimenopausa. Pela primeira vez me senti ouvida e não apenas mais uma estatística.",
                nome: "Carla M., 48 anos",
              },
              {
                texto:
                  "Acompanhar o diário de sintomas leva menos de um minuto e mudou minha rotina. Ver o gráfico de evolução me ajudou a entender o padrão dos meus calorões e da insônia — inclusive para levar dados concretos na minha consulta médica. Valeu cada centavo.",
                nome: "Luciana T., 52 anos",
              },
              {
                texto:
                  "O que mais me atraiu foi não ter mensalidade. Paguei uma vez só e tenho um material completo que se adapta às minhas fases. O texto é direto, sem enrolação e me deu um direcionamento claro quando a ansiedade e o sono ruim começaram a afetar meu dia a dia.",
                nome: "Patricia S., 55 anos",
              },
            ].map((depoimento) => (
              <Card key={depoimento.nome} className="rounded-3xl border-border/60 sombra-card">
                <CardContent className="p-7">
                  <Quote className="size-6 text-primary" />
                  <p className="mt-4 leading-relaxed text-muted-foreground">"{depoimento.texto}"</p>
                  <p className="mt-4 text-sm font-medium">— {depoimento.nome}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h2 className="text-3xl font-semibold">Um pagamento. Para sempre seu.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Sem mensalidade e sem assinatura. Você paga uma vez e mantém acesso ao relatório
            completo e ao diário de sintomas.
          </p>

          <p className="mt-7 text-5xl font-semibold tracking-tight">{PRECO}</p>
          <p className="mt-1 text-sm text-muted-foreground">à vista, pagamento único</p>
          <p className="mt-1 text-sm font-medium text-destructive">⏰ Oferta válida por 7 dias</p>

          <ul className="mx-auto mt-7 grid max-w-md gap-3 text-left">
            {[
              "Relatório personalizado por fase e sintomas",
              "Diário de calorão, sono, humor e energia",
              "Registro sem limite — histórico completo visível dos últimos 6 meses no app",
              "Acesso vitalício, sem renovação",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-sage" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>

          <Button asChild size="lg" className="mt-9 h-13 rounded-2xl px-8 text-base">
            <a href={checkoutUrl("pricing")} onClick={() => trackInitiateCheckout("pricing")}>
              Comprar acesso vitalício <ArrowRight className="size-4" />
            </a>
          </Button>

          <p className="mx-auto mt-4 flex max-w-sm items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-sage" />
            Garantia de 7 dias: não gostou, devolvemos 100% do valor.
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
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
                <a href={checkoutUrl("teaser")} onClick={() => trackInitiateCheckout("teaser")}>
                  Liberar meu relatório completo
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
