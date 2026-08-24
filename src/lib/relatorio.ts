import { BLOCOS, SECOES, type Bloco, type SecaoId } from "./conteudo";
import { escapeHtml } from "./exportar";
import { rotuloFase, type Fase } from "./menopausa";

export type PerfilRelatorio = {
  idade?: number | null;
  fase_menopausa?: string | null;
  sintomas_predominantes?: unknown;
};

export type SecaoRelatorio = {
  id: SecaoId;
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

  const fase = perfil.fase_menopausa as Fase | null | undefined;

  const ativos = BLOCOS.filter((b) => b.sempre || b.tags.some((t) => tags.has(t))).map((b) => {
    const nuance = fase && b.porFase ? b.porFase[fase] : undefined;
    return nuance ? { ...b, paragrafos: [...b.paragrafos, nuance] } : b;
  });

  return SECOES.map((secao) => ({
    ...secao,
    blocos: ativos.filter((b) => b.secao === secao.id),
  })).filter((s) => s.blocos.length > 0);
}

/** Prévia curta usada no teaser público da landing. */
export function previaTeaser(fase: string, sintoma: string): Bloco[] {
  return BLOCOS.filter((b) => b.tags.some((t) => t === `fase_${fase}` || t === `sintoma_${sintoma}`));
}

/** HTML do guia completo, usado na exportação em PDF. */
export function relatorioParaHtml(
  perfil: PerfilRelatorio,
  secoes: SecaoRelatorio[],
  padroes: string[] = [],
): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const partes: string[] = [];

  partes.push(`<div class="capa">
    <p class="sup">Guia de Menopausa</p>
    <h1>Seu guia personalizado</h1>
    <p>${escapeHtml(rotuloFase(perfil.fase_menopausa))}${perfil.idade ? `, ${perfil.idade} anos` : ""} · gerado em ${hoje}</p>
  </div>`);

  if (padroes.length > 0) {
    partes.push(
      `<div class="destaque"><strong>O que o seu diário mostra agora</strong><ul>${padroes
        .map((p) => `<li>${escapeHtml(p)}</li>`)
        .join("")}</ul></div>`,
    );
  }

  for (const secao of secoes) {
    partes.push(`<h2>${escapeHtml(secao.titulo)}</h2>`);
    for (const bloco of secao.blocos) {
      const img = bloco.imagem ? `<img src="${bloco.imagem}" alt="">` : "";
      const paras = bloco.paragrafos.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
      const lista = bloco.lista
        ? `<ul>${bloco.lista.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`
        : "";
      partes.push(
        `<div class="bloco"><h3>${escapeHtml(bloco.titulo)}</h3>${img}${paras}${lista}</div>`,
      );
    }
  }

  partes.push(
    `<p class="rodape">Conteúdo educativo sobre saúde da mulher. Não substitui avaliação médica individual. Procure um ginecologista ou endocrinologista antes de iniciar suplementos, fitoterápicos ou terapia hormonal.</p>`,
  );

  return partes.join("\n");
}
