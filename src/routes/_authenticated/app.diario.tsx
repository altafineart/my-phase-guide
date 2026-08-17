import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, Check } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { inicioJanelaVisivel, isoData, MESES_HISTORICO_VISIVEL } from "@/lib/menopausa";
import { porSemana, type Registro } from "@/lib/padroes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/app/diario")({
  head: () => ({
    meta: [
      { title: "Diário de sintomas — Guia de Menopausa" },
      {
        name: "description",
        content:
          "Registre calorão, sono, humor e energia do dia e acompanhe a evolução dos últimos 6 meses.",
      },
      { property: "og:title", content: "Diário de sintomas — Guia de Menopausa" },
      {
        property: "og:description",
        content: "Registre o seu dia e acompanhe a evolução dos sintomas.",
      },
    ],
  }),
  component: Diario,
});

function Diario() {
  const queryClient = useQueryClient();
  const hoje = isoData(new Date());

  const { data: registros } = useQuery({
    queryKey: ["registros", "janela"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registros_diario")
        .select("id, data, calorao, intensidade_calorao, sono, humor, energia")
        .gte("data", isoData(inicioJanelaVisivel()))
        .order("data", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Registro[];
    },
  });

  const registroDeHoje = registros?.find((r) => r.data === hoje);

  const [calorao, setCalorao] = useState(false);
  const [intensidade, setIntensidade] = useState(2);
  const [sono, setSono] = useState(3);
  const [humor, setHumor] = useState(3);
  const [energia, setEnergia] = useState(3);

  useEffect(() => {
    if (registroDeHoje) {
      setCalorao(registroDeHoje.calorao);
      setIntensidade(registroDeHoje.intensidade_calorao || 2);
      setSono(registroDeHoje.sono);
      setHumor(registroDeHoje.humor);
      setEnergia(registroDeHoje.energia);
    }
  }, [registroDeHoje]);

  const salvar = useMutation({
    mutationFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Sessão expirada");
      const { error } = await supabase.from("registros_diario").upsert(
        {
          user_id: auth.user.id,
          data: hoje,
          calorao,
          intensidade_calorao: calorao ? intensidade : 0,
          sono,
          humor,
          energia,
        },
        { onConflict: "user_id,data" },
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["registros"] }),
  });

  const dados = porSemana(registros ?? []);

  return (
    <main className="mx-auto max-w-3xl space-y-5 px-5 py-8">
      <header>
        <h1 className="text-2xl font-semibold">Diário de sintomas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre como foi o dia. Com o tempo, isso vira a sua linha do tempo.
        </p>
      </header>

      <Card className="rounded-3xl sombra-card">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Teve calorão hoje?</Label>
              <p className="text-sm text-muted-foreground">Ondas de calor ou suor noturno</p>
            </div>
            <Switch checked={calorao} onCheckedChange={setCalorao} />
          </div>

          {calorao && (
            <Escala
              rotulo="Intensidade do calorão"
              valor={intensidade}
              onChange={setIntensidade}
              min="Leve"
              max="Muito intenso"
            />
          )}

          <Escala rotulo="Qualidade do sono" valor={sono} onChange={setSono} min="Péssimo" max="Ótimo" />
          <Escala rotulo="Humor" valor={humor} onChange={setHumor} min="Difícil" max="Leve" />
          <Escala rotulo="Energia" valor={energia} onChange={setEnergia} min="Exausta" max="Cheia" />

          <Button
            size="lg"
            className="h-12 w-full rounded-2xl"
            onClick={() => salvar.mutate()}
            disabled={salvar.isPending}
          >
            {salvar.isSuccess && !salvar.isPending && <Check className="size-4" />}
            {salvar.isPending
              ? "Salvando..."
              : registroDeHoje
                ? "Atualizar registro de hoje"
                : "Salvar registro de hoje"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl sombra-card">
        <CardContent className="p-6">
          <h2 className="font-semibold">Evolução por semana</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Últimos {MESES_HISTORICO_VISIVEL} meses
          </p>

          {dados.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Ainda não há registros suficientes. Comece registrando o dia de hoje.
            </p>
          ) : (
            <Tabs defaultValue="bem-estar" className="mt-4">
              <TabsList className="rounded-full">
                <TabsTrigger value="bem-estar" className="rounded-full">
                  Sono, humor e energia
                </TabsTrigger>
                <TabsTrigger value="calorao" className="rounded-full">
                  Calorões
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bem-estar" className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="semana" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sono" name="Sono" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="humor" name="Humor" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="energia" name="Energia" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="calorao" className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dados}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="semana" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                      }}
                    />
                    <Bar dataKey="calorao" name="Calorão (média)" fill="var(--chart-1)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-dashed border-border bg-muted/40">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="rounded-2xl bg-secondary p-3">
            <Lock className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Histórico completo e análise de tendência de longo prazo</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Em breve. Seus registros anteriores a {MESES_HISTORICO_VISIVEL} meses continuam
              guardados com segurança — por enquanto, a visualização cobre os últimos{" "}
              {MESES_HISTORICO_VISIVEL} meses.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function Escala({
  rotulo,
  valor,
  onChange,
  min,
  max,
}: {
  rotulo: string;
  valor: number;
  onChange: (v: number) => void;
  min: string;
  max: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base">{rotulo}</Label>
        <span className="text-sm font-medium text-primary">{valor}/5</span>
      </div>
      <Slider
        value={[valor]}
        onValueChange={(v) => onChange(v[0] ?? valor)}
        min={1}
        max={5}
        step={1}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
