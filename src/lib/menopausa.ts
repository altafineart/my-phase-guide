/**
 * Domínio do app: fases, sintomas e helpers de rótulo.
 */

export type Fase = "perimenopausa" | "menopausa" | "pos_menopausa";

export const FASES: { valor: Fase; rotulo: string; descricao: string }[] = [
  {
    valor: "perimenopausa",
    rotulo: "Perimenopausa",
    descricao: "Ainda menstruo, mas os ciclos estão irregulares",
  },
  {
    valor: "menopausa",
    rotulo: "Menopausa",
    descricao: "Faz cerca de 12 meses ou mais que não menstruo",
  },
  {
    valor: "pos_menopausa",
    rotulo: "Pós-menopausa",
    descricao: "Já faz vários anos que não menstruo",
  },
];

export type SintomaId =
  | "calorao"
  | "insonia"
  | "humor"
  | "dor_articular"
  | "ressecamento"
  | "ganho_peso";

export const SINTOMAS: { valor: SintomaId; rotulo: string }[] = [
  { valor: "calorao", rotulo: "Calorões e suores noturnos" },
  { valor: "insonia", rotulo: "Insônia e sono ruim" },
  { valor: "humor", rotulo: "Mudanças de humor e ansiedade" },
  { valor: "dor_articular", rotulo: "Dores nas articulações" },
  { valor: "ressecamento", rotulo: "Ressecamento vaginal" },
  { valor: "ganho_peso", rotulo: "Ganho de peso" },
];

export function rotuloFase(fase?: string | null): string {
  return FASES.find((f) => f.valor === fase)?.rotulo ?? "Fase não informada";
}

export function rotuloSintoma(id: string): string {
  return SINTOMAS.find((s) => s.valor === id)?.rotulo ?? id;
}

/** Janela de histórico visível no diário (o resto fica bloqueado). */
export const MESES_HISTORICO_VISIVEL = 6;

export function inicioJanelaVisivel(hoje = new Date()): Date {
  const d = new Date(hoje);
  d.setMonth(d.getMonth() - MESES_HISTORICO_VISIVEL);
  return d;
}

export function isoData(d: Date): string {
  return d.toISOString().slice(0, 10);
}
