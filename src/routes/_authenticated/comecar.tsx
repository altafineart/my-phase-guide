import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { FASES, SINTOMAS, type Fase, type SintomaId } from "@/lib/menopausa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/comecar")({
  head: () => ({
    meta: [
      { title: "Vamos começar — Guia de Menopausa" },
      {
        name: "description",
        content: "Responda algumas perguntas para montarmos o seu relatório personalizado.",
      },
      { property: "og:title", content: "Vamos começar — Guia de Menopausa" },
      {
        property: "og:description",
        content: "Responda algumas perguntas para montarmos o seu relatório personalizado.",
      },
    ],
  }),
  component: Comecar,
});

function Comecar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [passo, setPasso] = useState(0);
  const [idade, setIdade] = useState("");
  const [fase, setFase] = useState<Fase | null>(null);
  const [ultima, setUltima] = useState("");
  const [sintomas, setSintomas] = useState<SintomaId[]>([]);

  const salvar = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Sessão expirada");
      const { error } = await supabase.from("profiles").upsert({
        id: auth.user.id,
        email: auth.user.email ?? null,
        idade: idade ? Number(idade) : null,
        fase_menopausa: fase,
        ultima_menstruacao: ultima || null,
        sintomas_predominantes: sintomas,
        onboarding_completo: true,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["perfil"] });
      navigate({ to: "/app" });
    },
  });

  const passos = ["Sobre você", "Sua fase", "Seus sintomas"];

  return (
    <main className="min-h-screen superficie-suave px-5 py-12">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8 flex items-center gap-2">
          {passos.map((p, i) => (
            <div key={p} className="flex-1">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  i <= passo ? "bg-primary" : "bg-border",
                )}
              />
              <p className="mt-2 text-xs text-muted-foreground">{p}</p>
            </div>
          ))}
        </div>

        <Card className="rounded-3xl border-border/60 sombra-suave">
          <CardContent className="space-y-6 p-6 sm:p-8">
            {passo === 0 && (
              <>
                <div>
                  <h1 className="text-2xl font-semibold">Vamos personalizar o seu guia</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Nada aqui é diagnóstico — é conteúdo de orientação, montado a partir das suas
                    respostas.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idade">Sua idade</Label>
                  <Input
                    id="idade"
                    type="number"
                    min={25}
                    max={90}
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="52"
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ultima">Data da última menstruação (se souber)</Label>
                  <Input
                    id="ultima"
                    type="date"
                    value={ultima}
                    onChange={(e) => setUltima(e.target.value)}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <Button
                  size="lg"
                  className="h-12 w-full rounded-2xl"
                  disabled={!idade}
                  onClick={() => setPasso(1)}
                >
                  Continuar <ArrowRight className="size-4" />
                </Button>
              </>
            )}

            {passo === 1 && (
              <>
                <div>
                  <h1 className="text-2xl font-semibold">Em que fase você está?</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Escolha a opção que mais se parece com o seu momento.
                  </p>
                </div>
                <div className="space-y-3">
                  {FASES.map((f) => (
                    <button
                      key={f.valor}
                      type="button"
                      onClick={() => setFase(f.valor)}
                      className={cn(
                        "w-full rounded-2xl border p-4 text-left transition-colors",
                        fase === f.valor
                          ? "border-primary bg-accent/60"
                          : "border-border bg-card hover:bg-muted",
                      )}
                    >
                      <p className="font-medium">{f.rotulo}</p>
                      <p className="text-sm text-muted-foreground">{f.descricao}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" className="h-12 rounded-2xl" onClick={() => setPasso(0)}>
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    className="h-12 flex-1 rounded-2xl"
                    disabled={!fase}
                    onClick={() => setPasso(2)}
                  >
                    Continuar <ArrowRight className="size-4" />
                  </Button>
                </div>
              </>
            )}

            {passo === 2 && (
              <>
                <div>
                  <h1 className="text-2xl font-semibold">O que mais incomoda hoje?</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Pode marcar quantos quiser. O relatório é montado em cima disso.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SINTOMAS.map((s) => {
                    const ativo = sintomas.includes(s.valor);
                    return (
                      <button
                        key={s.valor}
                        type="button"
                        onClick={() =>
                          setSintomas((atual) =>
                            ativo ? atual.filter((x) => x !== s.valor) : [...atual, s.valor],
                          )
                        }
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors",
                          ativo
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card hover:bg-muted",
                        )}
                      >
                        {ativo && <Check className="size-4" />}
                        {s.rotulo}
                      </button>
                    );
                  })}
                </div>
                {salvar.isError && (
                  <p className="text-sm text-destructive">
                    Não conseguimos salvar agora. Tente novamente.
                  </p>
                )}
                <div className="flex gap-3">
                  <Button variant="ghost" className="h-12 rounded-2xl" onClick={() => setPasso(1)}>
                    Voltar
                  </Button>
                  <Button
                    size="lg"
                    className="h-12 flex-1 rounded-2xl"
                    disabled={sintomas.length === 0 || salvar.isPending}
                    onClick={() => salvar.mutate()}
                  >
                    {salvar.isPending ? "Montando..." : "Ver meu relatório"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
