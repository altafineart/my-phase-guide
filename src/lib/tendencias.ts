import type { Registro } from "./padroes";

function media(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export type PontoMensal = {
  chave: string;
  rotulo: string;
  registros: number;
  diasComCalorao: number;
  calorao: number;
  sono: number;
  humor: number;
  energia: number;
};

/** Agrupa os registros por mês para a análise de longo prazo. */
export function porMes(registros: Registro[]): PontoMensal[] {
  const grupos = new Map<string, Registro[]>();
  for (const r of registros) {
    const chave = r.data.slice(0, 7);
    const lista = grupos.get(chave) ?? [];
    lista.push(r);
    grupos.set(chave, lista);
  }

  return [...grupos.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([chave, itens]) => {
      const [ano, mes] = chave.split("-");
      const num = (v: number | null) => Number((v ?? 0).toFixed(1));
      return {
        chave,
        rotulo: `${MESES[Number(mes) - 1]}/${ano.slice(2)}`,
        registros: itens.length,
        diasComCalorao: itens.filter((r) => r.calorao).length,
        calorao: num(media(itens.map((r) => (r.calorao ? r.intensidade_calorao || 1 : 0)))),
        sono: num(media(itens.map((r) => r.sono))),
        humor: num(media(itens.map((r) => r.humor))),
        energia: num(media(itens.map((r) => r.energia))),
      };
    });
}

export type ResumoLongoPrazo = {
  totalRegistros: number;
  primeiroDia: string | null;
  ultimoDia: string | null;
  diasComCalorao: number;
  percentualCalorao: number;
  medias: { calorao: number; sono: number; humor: number; energia: number };
  melhorMes: PontoMensal | null;
  piorMes: PontoMensal | null;
  tendencias: string[];
};

const ROTULOS: Record<"calorao" | "sono" | "humor" | "energia", string> = {
  calorao: "calorões",
  sono: "sono",
  humor: "humor",
  energia: "energia",
};

/**
 * Compara o terço mais recente do histórico com o terço mais antigo e devolve
 * frases sobre a tendência de longo prazo (não apenas as últimas semanas).
 */
export function resumoLongoPrazo(registros: Registro[]): ResumoLongoPrazo {
  const ordenados = [...registros].sort((a, b) => a.data.localeCompare(b.data));
  const meses = porMes(ordenados);
  const num = (v: number | null) => Number((v ?? 0).toFixed(1));

  const base: ResumoLongoPrazo = {
    totalRegistros: ordenados.length,
    primeiroDia: ordenados[0]?.data ?? null,
    ultimoDia: ordenados[ordenados.length - 1]?.data ?? null,
    diasComCalorao: ordenados.filter((r) => r.calorao).length,
    percentualCalorao: ordenados.length
      ? Math.round((ordenados.filter((r) => r.calorao).length / ordenados.length) * 100)
      : 0,
    medias: {
      calorao: num(media(ordenados.map((r) => (r.calorao ? r.intensidade_calorao || 1 : 0)))),
      sono: num(media(ordenados.map((r) => r.sono))),
      humor: num(media(ordenados.map((r) => r.humor))),
      energia: num(media(ordenados.map((r) => r.energia))),
    },
    melhorMes: null,
    piorMes: null,
    tendencias: [],
  };

  const comDados = meses.filter((m) => m.registros >= 3);
  if (comDados.length >= 2) {
    const pontuacao = (m: PontoMensal) => m.sono + m.humor + m.energia - m.calorao;
    base.melhorMes = comDados.reduce((a, b) => (pontuacao(b) > pontuacao(a) ? b : a));
    base.piorMes = comDados.reduce((a, b) => (pontuacao(b) < pontuacao(a) ? b : a));
  }

  if (ordenados.length >= 12) {
    const corte = Math.floor(ordenados.length / 3);
    const antigos = ordenados.slice(0, corte);
    const recentes = ordenados.slice(-corte);

    const compara = (chave: "calorao" | "sono" | "humor" | "energia") => {
      const valor = (r: Registro) =>
        chave === "calorao" ? (r.calorao ? r.intensidade_calorao || 1 : 0) : r[chave];
      const ant = media(antigos.map(valor));
      const rec = media(recentes.map(valor));
      if (ant === null || rec === null) return;
      const delta = rec - ant;
      if (Math.abs(delta) < 0.3) {
        base.tendencias.push(
          `Seu ${ROTULOS[chave]} se manteve estável ao longo de todo o período registrado.`,
        );
        return;
      }
      const subiu = delta > 0;
      if (chave === "calorao") {
        base.tendencias.push(
          subiu
            ? `Seus calorões vêm se intensificando desde o início do seu histórico (${ant.toFixed(1)} → ${rec.toFixed(1)} em média).`
            : `Seus calorões diminuíram ao longo do tempo (${ant.toFixed(1)} → ${rec.toFixed(1)} em média).`,
        );
      } else {
        base.tendencias.push(
          subiu
            ? `Seu ${ROTULOS[chave]} melhorou no longo prazo (${ant.toFixed(1)} → ${rec.toFixed(1)} em média).`
            : `Seu ${ROTULOS[chave]} piorou no longo prazo (${ant.toFixed(1)} → ${rec.toFixed(1)} em média).`,
        );
      }
    };

    compara("calorao");
    compara("sono");
    compara("humor");
    compara("energia");
  }

  return base;
}

export function dataBr(iso?: string | null): string {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
