import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, Lock } from "lucide-react";
import {
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
import { usePerfil } from "@/hooks/use-perfil";
import {
  inicioJanelaVisivel,
  isoData,
  MESES_HISTORICO_VISIVEL,
  rotuloFase,
} from "@/lib/menopausa";
import { type Registro } from "@/lib/padroes";
import { porMes, resumoLongoPrazo, dataBr } from "@/lib/tendencias";
import { escapeHtml, exportarPDF } from "@/lib/exportar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/app/historico")({
  head: () => ({
    meta: [
      { title: "Histórico completo e tendências — Guia de Menopausa" },
      {
        name: "description",
        content:
          "Histórico completo do seu diário, médias mês a mês e análise de tendência de longo prazo, com exportação em PDF.",
      },
      { property: "og:title", content: "Histórico completo e tendências — Guia de Menopausa" },
      {
        property: "og:description",
        content: "Veja a evolução dos seus sintomas mês a mês e exporte o relatório completo.",
      },
    ],
  }),
  component: Historico,
});

function Historico() {
  const { data: perfil } = usePerfil();

  const { data: registros, isLoading } = useQuery({
    queryKey: ["registros", "historico"],
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

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl space-y-4 px-5 py-8">
        <Skeleton className="h-24 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </main>
    );
  }

  const lista = registros ?? [];
  const meses = porMes(lista);
  const resumo = resumoLongoPrazo(lista);

  const exportar = () => {
    const linhas = [...lista]
      .reverse()
      .map(
        (r) =>
          `<tr><td>${dataBr(r.data)}</td><td>${r.calorao ? `sim (${r.intensidade_calorao || 1}/5)` : "não"}</td><td>${r.sono}/5</td><td>${r.humor}/5</td><td>${r.energia}/5</td></tr>`,
      )
      .join("");

    const linhasMes = meses
      .map(
        (m) =>
          `<tr><td>${m.rotulo}</td><td>${m.registros}</td><td>${m.diasComCalorao}</td><td>${m.calorao}</td><td>${m.sono}</td><td>${m.humor}</td><td>${m.energia}</td></tr>`,
      )
      .join("");

    const html = `
      <div class="capa">
        <p class="sup">Guia de Menopausa</p>
        <h1>Histórico completo e tendências</h1>
        <p>${escapeHtml(rotuloFase(perfil?.fase_menopausa))} · período de ${dataBr(resumo.primeiroDia)} a ${dataBr(resumo.ultimoDia)} · ${resumo.totalRegistros} registros</p>
      </div>
      <div class="destaque">
        <strong>Resumo geral</strong>
        <ul>
          <li>Dias com calorão: ${resumo.diasComCalorao} (${resumo.percentualCalorao}% dos dias registrados)</li>
          <li>Intensidade média do calorão: ${resumo.medias.calorao}</li>
          <li>Média de sono: ${resumo.medias.sono}/5 · humor: ${resumo.medias.humor}/5 · energia: ${resumo.medias.energia}/5</li>
          ${resumo.melhorMes ? `<li>Melhor mês: ${resumo.melhorMes.rotulo}</li>` : ""}
          ${resumo.piorMes ? `<li>Mês mais difícil: ${resumo.piorMes.rotulo}</li>` : ""}
        </ul>
      </div>
      <h2>Análise de tendência de longo prazo</h2>
      ${
        resumo.tendencias.length
          ? `<ul>${resumo.tendencias.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`
          : "<p>Ainda não há registros suficientes para uma análise de longo prazo. Continue registrando alguns dias por semana.</p>"
      }
      <h2>Médias mês a mês</h2>
      <table><thead><tr><th>Mês</th><th>Registros</th><th>Dias c/ calorão</th><th>Calorão</th><th>Sono</th><th>Humor</th><th>Energia</th></tr></thead><tbody>${linhasMes}</tbody></table>
      <h2>Histórico dia a dia</h2>
      <table><thead><tr><th>Data</th><th>Calorão</th><th>Sono</th><th>Humor</th><th>Energia</th></tr></thead><tbody>${linhas}</tbody></table>
      <p class="rodape">Relatório gerado pelo Guia de Menopausa. Leve este documento à sua consulta — ele ajuda a médica a enxergar padrões ao longo do tempo.</p>
    `;
    exportarPDF("Guia de Menopausa — histórico e tendências", html);
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-5 py-8">
      <header>
        <p className="text-sm text-muted-foreground">Diário</p>
        <h1 className="mt-1 text-3xl font-semibold">Histórico completo</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Todos os seus registros, médias mês a mês e a tendência de longo prazo. Ideal para levar
          à consulta.
        </p>
        <Button className="mt-4 rounded-2xl" onClick={exportar} disabled={lista.length === 0}>
          <Download className="size-4" /> Exportar relatório em PDF
        </Button>
      </header>

      {lista.length === 0 ? (
        <Card className="rounded-3xl sombra-card">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Você ainda não tem registros no diário. Assim que começar a registrar, a análise de
            tendências aparece aqui.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { rotulo: "Registros", valor: String(resumo.totalRegistros) },
              { rotulo: "Dias com calorão", valor: `${resumo.percentualCalorao}%` },
              { rotulo: "Sono médio", valor: `${resumo.medias.sono}/5` },
              { rotulo: "Energia média", valor: `${resumo.medias.energia}/5` },
            ].map((item) => (
              <Card key={item.rotulo} className="rounded-3xl sombra-card">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{item.rotulo}</p>
                  <p className="mt-1 text-xl font-semibold">{item.valor}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="rounded-3xl border-sage/40 sombra-card">
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-sage-foreground">
                Tendência de longo prazo
              </h2>
              {resumo.tendencias.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {resumo.tendencias.map((t) => (
                    <li key={t}>• {t}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Registre alguns dias por semana durante algumas semanas para liberar a análise
                  de longo prazo.
                </p>
              )}
              {resumo.melhorMes && resumo.piorMes && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Melhor mês até aqui: <strong>{resumo.melhorMes.rotulo}</strong>. Mês mais
                  difícil: <strong>{resumo.piorMes.rotulo}</strong>.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl sombra-card">
            <CardContent className="p-4 sm:p-6">
              <h2 className="mb-4 text-sm font-medium">Evolução mês a mês</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={meses}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="rotulo" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calorao" name="Calorão" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="sono" name="Sono" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="humor" name="Humor" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="energia" name="Energia" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl sombra-card">
            <CardContent className="p-0">
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card text-xs text-muted-foreground">
                    <tr>
                      <th className="p-3 text-left font-medium">Data</th>
                      <th className="p-3 text-left font-medium">Calorão</th>
                      <th className="p-3 text-left font-medium">Sono</th>
                      <th className="p-3 text-left font-medium">Humor</th>
                      <th className="p-3 text-left font-medium">Energia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...lista].reverse().map((r) => (
                      <tr key={r.id} className="border-t border-border/50">
                        <td className="p-3">{dataBr(r.data)}</td>
                        <td className="p-3">
                          {r.calorao ? `sim (${r.intensidade_calorao || 1}/5)` : "não"}
                        </td>
                        <td className="p-3">{r.sono}/5</td>
                        <td className="p-3">{r.humor}/5</td>
                        <td className="p-3">{r.energia}/5</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <p className="flex items-start gap-2 pb-4 text-xs leading-relaxed text-muted-foreground">
        <Lock className="mt-0.5 size-3.5 shrink-0" />
        A visualização mostra os últimos {MESES_HISTORICO_VISIVEL} meses. Registros mais antigos
        continuam salvos com segurança na sua conta.
      </p>
    </main>
  );
}
