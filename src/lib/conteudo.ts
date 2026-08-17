/**
 * Biblioteca de conteúdo do relatório.
 *
 * Blocos marcados com `sempre: true` entram no relatório de todas as usuárias.
 * Os demais são ativados por tag de fase (`fase_*`) ou de sintoma (`sintoma_*`).
 *
 * O texto atual vem da biblioteca fornecida pelo cliente e serve como base —
 * a curadoria final do conteúdo de saúde ainda está pendente.
 */

export type Bloco = {
  id: string;
  titulo: string;
  secao: "acontecendo" | "sintomas" | "recomendacoes" | "cuidado";
  tags: string[];
  sempre?: boolean;
  paragrafos: string[];
};

export const BLOCOS: Bloco[] = [
  {
    id: "intro-o-que-e-menopausa",
    titulo: "O que é a menopausa",
    secao: "acontecendo",
    tags: [],
    sempre: true,
    paragrafos: [
      "A menopausa é um processo natural na vida de toda mulher que marca o fim da fase reprodutiva. Uma mulher é oficialmente considerada na menopausa quando passa 12 meses consecutivos sem menstruar, na ausência de outras causas médicas. Essa mudança está diretamente relacionada à diminuição da produção de estrogênio e progesterona.",
      "Embora geralmente ocorra entre 45 e 55 anos, a idade exata varia conforme genética, estilo de vida e condições médicas. Algumas mulheres entram na menopausa precoce antes dos 40 anos; outras passam por essa mudança depois dos 55.",
    ],
  },
  {
    id: "fase-perimenopausa",
    titulo: "Onde você está agora: perimenopausa",
    secao: "acontecendo",
    tags: ["fase_perimenopausa"],
    paragrafos: [
      "Você está na perimenopausa — a fase de transição em que os ciclos menstruais se tornam irregulares. Os primeiros sintomas costumam aparecer aqui: ondas de calor, suores noturnos, alterações de humor, dificuldade para dormir e secura vaginal.",
      "À medida que o corpo se adapta a níveis mais baixos de estrogênio, esses sintomas podem se intensificar ou variar em intensidade — isso é esperado.",
    ],
  },
  {
    id: "fase-menopausa",
    titulo: "Onde você está agora: menopausa",
    secao: "acontecendo",
    tags: ["fase_menopausa"],
    paragrafos: [
      "Você está na menopausa — passou um ano sem menstruação, o que significa que os ovários pararam de liberar óvulos e a produção de estrogênio e progesterona caiu a níveis mínimos.",
      "Os sintomas podem se intensificar nessa fase, afetando qualidade de vida, saúde óssea e cardiovascular e bem-estar emocional. Isso não significa que vai piorar indefinidamente — é o pico de adaptação do corpo à nova realidade hormonal.",
    ],
  },
  {
    id: "fase-pos-menopausa",
    titulo: "Onde você está agora: pós-menopausa",
    secao: "acontecendo",
    tags: ["fase_pos_menopausa"],
    paragrafos: [
      "Você está na pós-menopausa, fase que dura o resto da vida. Os sintomas costumam diminuir gradualmente, embora algumas mulheres continuem sentindo ondas de calor ou secura vaginal por anos.",
      "A redução do estrogênio aumenta o risco de osteoporose, doenças cardíacas e alterações na pele — por isso os cuidados de saúde óssea e cardiovascular seguem essenciais mesmo depois que os sintomas do dia a dia diminuem.",
    ],
  },
  {
    id: "fatores-que-influenciam",
    titulo: "O que influencia a sua experiência",
    secao: "acontecendo",
    tags: [],
    sempre: true,
    paragrafos: [
      "Cada mulher vivencia a menopausa de forma diferente. A genética tem papel importante — é comum filhas chegarem à menopausa em idades semelhantes às de suas mães. O estilo de vida também influencia: dieta balanceada e atividade física regular tendem a suavizar os sintomas.",
      "Condições médicas (autoimunes, tireoide, ovários policísticos) e cirurgias ginecológicas também afetam o processo. Estresse e saúde emocional são fundamentais: níveis altos de cortisol podem agravar insônia, ansiedade e fadiga.",
    ],
  },
  {
    id: "sintoma-calorao",
    titulo: "Calorões e suores noturnos",
    secao: "sintomas",
    tags: ["sintoma_calorao"],
    paragrafos: [
      "Sensação repentina de calor intenso no rosto, pescoço e peito, acompanhada de vermelhidão e suor. Podem durar de segundos a vários minutos e, em alguns casos, interferem no sono e na qualidade de vida.",
      "Os suores noturnos estão frequentemente ligados às ondas de calor e causam interrupções no descanso, levando a fadiga e dificuldade de concentração no dia seguinte.",
      "O que ajuda: fitoestrógenos na dieta (soja, linhaça, tofu, grão-de-bico); exercícios aeróbicos leves (caminhada, natação, ciclismo); fitoterápicos como trevo vermelho e cimicífuga. Em casos intensos, a terapia de reposição hormonal pode ser considerada — sempre com avaliação médica individual.",
    ],
  },
  {
    id: "sintoma-insonia",
    titulo: "Insônia e sono interrompido",
    secao: "sintomas",
    tags: ["sintoma_insonia"],
    paragrafos: [
      "A dificuldade para dormir é um dos primeiros sintomas a aparecer, muitas vezes ligada a suores noturnos. Distúrbios do sono podem criar um ciclo em que fadiga e irritabilidade se intensificam.",
      "O que ajuda: técnicas de relaxamento antes de dormir; infusões relaxantes como valeriana ou camomila; magnésio (que também ajuda humor e ossos); rotina regular de exercício, mas não perto da hora de dormir; reduzir cafeína e álcool.",
    ],
  },
  {
    id: "sintoma-humor",
    titulo: "Humor, ansiedade e confusão mental",
    secao: "sintomas",
    tags: ["sintoma_humor"],
    paragrafos: [
      "A diminuição de estrogênio e progesterona pode afetar o equilíbrio químico do cérebro. É comum sentir irritabilidade, ansiedade ou tristeza sem causa aparente, mudanças repentinas de humor e dificuldade de concentração. Esses sentimentos são normais e merecem empatia, não minimização.",
      "A menopausa não causa depressão diretamente, mas aumenta a vulnerabilidade emocional em algumas mulheres. Fique atenta a perda de interesse, isolamento social e falta de energia persistente.",
      "O que ajuda: atividade física regular; dieta balanceada; técnicas de relaxamento e atenção plena; manter rede de apoio — conversar com outras mulheres na mesma fase, grupos de apoio ou terapia.",
    ],
  },
  {
    id: "sintoma-dor-articular",
    titulo: "Dores nas articulações e músculos",
    secao: "sintomas",
    tags: ["sintoma_dor_articular"],
    paragrafos: [
      "Alterações no metabolismo e a diminuição da massa muscular podem levar a dores nas articulações, relacionadas à perda de colágeno e ao envelhecimento dos tecidos — mesmo sem mudança na dieta ou na atividade física.",
      "O que ajuda: exercícios de resistência (musculação leve, faixas elásticas); ioga e pilates, de baixo impacto; ômega-3 para reduzir inflamação; conversar com sua médica sobre cálcio, magnésio e vitamina D.",
    ],
  },
  {
    id: "sintoma-ressecamento",
    titulo: "Ressecamento vaginal e intimidade",
    secao: "sintomas",
    tags: ["sintoma_ressecamento"],
    paragrafos: [
      "A diminuição de estrogênio e testosterona pode reduzir a lubrificação vaginal e alterar a sensibilidade, gerando desconforto durante a relação sexual. Isso é natural, mas pode afetar autoestima e conexão com o parceiro.",
      "O que ajuda: lubrificantes à base de água e hidratantes vaginais; tratamentos tópicos com estrogênio sob supervisão médica; comunicação aberta sobre sentimentos e preocupações; explorar novas formas de intimidade, sem pressão.",
    ],
  },
  {
    id: "sintoma-ganho-peso",
    titulo: "Ganho de peso e metabolismo",
    secao: "sintomas",
    tags: ["sintoma_ganho_peso"],
    paragrafos: [
      "A redução do estrogênio afeta o metabolismo, o que pode levar a ganho de peso e mudança na distribuição de gordura (maior acúmulo abdominal), mesmo sem alterações na dieta.",
      "O que ajuda: proteínas de qualidade (peixe, ovos, frango, leguminosas, nozes) para preservar massa muscular; evitar açúcar refinado e farinha processada; grãos integrais, frutas frescas e gorduras saudáveis; exercício de resistência combinado com aeróbico; boa hidratação.",
    ],
  },
  {
    id: "estrategias-gerais-dieta",
    titulo: "Alimentação",
    secao: "recomendacoes",
    tags: [],
    sempre: true,
    paragrafos: [
      "Fitoestrógenos (soja, linhaça, tofu, grão-de-bico) ajudam a compensar a queda de estrogênio. Proteínas de qualidade preservam massa muscular. Cálcio e vitamina D (laticínios, amêndoas, espinafre, salmão) fortalecem os ossos. Evite açúcar refinado e farinha processada; priorize grãos integrais, frutas frescas e gorduras saudáveis. Beba bastante água.",
    ],
  },
  {
    id: "estrategias-gerais-exercicio",
    titulo: "Movimento",
    secao: "recomendacoes",
    tags: [],
    sempre: true,
    paragrafos: [
      "Exercícios de resistência mantêm densidade óssea. Atividades aeróbicas melhoram circulação e ajudam a controlar ondas de calor. Ioga e pilates fortalecem músculos, melhoram flexibilidade e reduzem tensão. Mesmo 30 minutos por dia fazem diferença — o segredo é achar uma atividade prazerosa e sustentável.",
    ],
  },
  {
    id: "saude-ossea-cardiovascular",
    titulo: "Saúde óssea e cardiovascular",
    secao: "recomendacoes",
    tags: [],
    sempre: true,
    paragrafos: [
      "A queda de estrogênio acelera a perda de densidade óssea e aumenta o risco cardiovascular (LDL sobe, HDL cai, pressão pode subir).",
      "Prevenção óssea: cálcio e vitamina D na dieta, exercício de impacto moderado e de resistência, evitar excesso de cafeína, álcool e sódio.",
      "Prevenção cardiovascular: dieta rica em frutas, vegetais, gorduras saudáveis e peixes; exercício aeróbico regular; manter peso saudável; controlar estresse; evitar fumo.",
      "Exames que costumam ser recomendados: densitometria óssea, colesterol e triglicerídeos, glicose e monitoramento de pressão arterial.",
    ],
  },
  {
    id: "quando-procurar-ajuda",
    titulo: "Quando procurar ajuda profissional",
    secao: "cuidado",
    tags: [],
    sempre: true,
    paragrafos: [
      "Procure ajuda se os sintomas começarem a interferir na sua capacidade de trabalhar, cuidar de si ou manter vida social; se houver alterações de humor difíceis de controlar, tristeza profunda ou perda de interesse em atividades que davam prazer; ou se sintomas físicos persistirem ou piorarem.",
      "Um ginecologista, endocrinologista ou terapeuta pode indicar tratamentos, terapia hormonal ou estratégias de manejo emocional. Procurar ajuda não é sinal de fraqueza — é autocuidado.",
    ],
  },
  {
    id: "conclusao",
    titulo: "Uma nova fase",
    secao: "cuidado",
    tags: [],
    sempre: true,
    paragrafos: [
      "A menopausa é uma fase transformadora que, embora traga desafios, abre espaço para novas oportunidades de autocuidado. Com conhecimento e hábitos saudáveis, é possível atravessar as mudanças hormonais com confiança.",
    ],
  },
];

export const SECOES: { id: Bloco["secao"]; titulo: string }[] = [
  { id: "acontecendo", titulo: "O que está acontecendo no seu corpo" },
  { id: "sintomas", titulo: "Os seus sintomas, um a um" },
  { id: "recomendacoes", titulo: "Recomendações para o seu dia a dia" },
  { id: "cuidado", titulo: "Cuidado e acompanhamento" },
];
