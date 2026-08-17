export type Registro = {
  id: string;
  data: string;
  calorao: boolean;
  intensidade_calorao: number;
  sono: number;
  humor: number;
  energia: number;
};

function media(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/**
 * Compara as últimas 2 semanas com as 2 anteriores e devolve frases curtas
 * sobre padrões recentes, usadas no dashboard e no topo do relatório.
 */
export function padroesRecentes(registros: Registro[]): string[] {
  if (registros.length < 4) return [];

  const hoje = new Date();
  const limite = (dias: number) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() - dias);
    return d.toISOString().slice(0, 10);
  };

  const recente = registros.filter((r) => r.data >= limite(14));
  const anterior = registros.filter((r) => r.data >= limite(28) && r.data < limite(14));
  if (recente.length < 2 || anterior.length < 2) return [];

  const frases: string[] = [];

  const calRec = media(recente.map((r) => (r.calorao ? r.intensidade_calorao || 1 : 0)));
  const calAnt = media(anterior.map((r) => (r.calorao ? r.intensidade_calorao || 1 : 0)));
  if (calRec !== null && calAnt !== null) {
    if (calRec > calAnt + 0.4)
      frases.push("Seus calorões pioraram nas últimas 2 semanas em comparação com o período anterior.");
    else if (calRec < calAnt - 0.4)
      frases.push("Seus calorões deram uma trégua nas últimas 2 semanas.");
  }

  const comparar = (
    chave: "sono" | "humor" | "energia",
    melhora: string,
    piora: string,
  ) => {
    const rec = media(recente.map((r) => r[chave]));
    const ant = media(anterior.map((r) => r[chave]));
    if (rec === null || ant === null) return;
    if (rec > ant + 0.4) frases.push(melhora);
    else if (rec < ant - 0.4) frases.push(piora);
  };

  comparar("sono", "Seu sono vem melhorando nas últimas semanas.", "Seu sono piorou nas últimas 2 semanas.");
  comparar("humor", "Seu humor está mais estável do que no período anterior.", "Seu humor esteve mais oscilante nas últimas 2 semanas.");
  comparar("energia", "Sua energia está em alta comparada às semanas anteriores.", "Sua energia caiu nas últimas 2 semanas.");

  return frases.slice(0, 3);
}

/** Agrupa registros por semana para o gráfico de evolução. */
export function porSemana(registros: Registro[]) {
  const grupos = new Map<string, Registro[]>();
  for (const r of registros) {
    const d = new Date(r.data + "T00:00:00");
    const dia = d.getDay();
    const inicio = new Date(d);
    inicio.setDate(d.getDate() - dia);
    const chave = inicio.toISOString().slice(0, 10);
    const lista = grupos.get(chave) ?? [];
    lista.push(r);
    grupos.set(chave, lista);
  }

  return [...grupos.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([semana, itens]) => {
      const [, mes, dia] = semana.split("-");
      return {
        semana: `${dia}/${mes}`,
        calorao: Number(
          (media(itens.map((r) => (r.calorao ? r.intensidade_calorao || 1 : 0))) ?? 0).toFixed(1),
        ),
        sono: Number((media(itens.map((r) => r.sono)) ?? 0).toFixed(1)),
        humor: Number((media(itens.map((r) => r.humor)) ?? 0).toFixed(1)),
        energia: Number((media(itens.map((r) => r.energia)) ?? 0).toFixed(1)),
      };
    });
}
