import { BLOCOS, SECOES, type Bloco } from "./conteudo";

export type PerfilRelatorio = {
  idade?: number | null;
  fase_menopausa?: string | null;
  sintomas_predominantes?: unknown;
};

export type SecaoRelatorio = {
  id: Bloco["secao"];
  titulo: string;
  blocos: Bloco[];
};

export function sintomasDoPerfil(perfil: PerfilRelatorio): string[] {
  const s = perfil.sintomas_predominantes;
  return Array.isArray(s) ? (s.filter((x) => typeof x === "string") as string[]) : [];
}

/** Monta o relatório individual a partir de blocos ativados por fase + sintomas. */
export function montarRelatorio(perfil: PerfilRelatorio): SecaoRelatorio[] {
  const tags = new Set<string>();
  if (perfil.fase_menopausa) tags.add(`fase_${perfil.fase_menopausa}`);
  for (const s of sintomasDoPerfil(perfil)) tags.add(`sintoma_${s}`);

  const ativos = BLOCOS.filter(
    (b) => b.sempre || b.tags.some((t) => tags.has(t)),
  );

  return SECOES.map((secao) => ({
    ...secao,
    blocos: ativos.filter((b) => b.secao === secao.id),
  })).filter((s) => s.blocos.length > 0);
}

/** Prévia curta usada no teaser público da landing. */
export function previaTeaser(fase: string, sintoma: string): Bloco[] {
  const tags = new Set([`fase_${fase}`, `sintoma_${sintoma}`]);
  return BLOCOS.filter((b) => b.tags.some((t) => tags.has(t)));
}
