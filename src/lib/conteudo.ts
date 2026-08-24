/**
 * Biblioteca de conteúdo do relatório — versão completa.
 *
 * Baseada no e-book "Guia para a Menopausa" fornecido pelo cliente, dividida em
 * blocos. Blocos com `sempre: true` entram no relatório de todas as usuárias;
 * os demais são ativados por tag de fase (`fase_*`) ou de sintoma (`sintoma_*`).
 */

import imgCorpo from "@/assets/secao-corpo.jpg";
import imgSintomas from "@/assets/secao-sintomas.jpg";
import imgAlimentacao from "@/assets/secao-alimentacao.jpg";
import imgOssos from "@/assets/secao-ossos.jpg";
import imgIntimidade from "@/assets/secao-intimidade.jpg";
import imgMental from "@/assets/secao-mental.jpg";
import type { Fase } from "./menopausa";

export type SecaoId =
  | "acontecendo"
  | "sintomas"
  | "recomendacoes"
  | "ossos"
  | "intimidade"
  | "mental"
  | "cuidado";

export type Bloco = {
  id: string;
  titulo: string;
  secao: SecaoId;
  tags: string[];
  sempre?: boolean;
  paragrafos: string[];
  lista?: string[];
  imagem?: string;
  /**
   * Nuance por fase para blocos de sintoma: como ESSE sintoma específico costuma
   * se comportar em cada fase (aparece de forma diferente, mais intenso, mais
   * constante etc.). Injetado pelo relatorio.ts após os parágrafos principais,
   * só quando a usuária tem a fase correspondente. Mantém o texto do e-book
   * como base única e evita duplicar blocos inteiros por combinação fase×sintoma.
   */
  porFase?: Partial<Record<Fase, string>>;
};

export const BLOCOS: Bloco[] = [
  /* ---------------------------------------------------------------- */
  /* 1. O que está acontecendo no seu corpo                            */
  /* ---------------------------------------------------------------- */
  {
    id: "boas-vindas",
    titulo: "Bem-vinda",
    secao: "acontecendo",
    tags: [],
    sempre: true,
    imagem: imgCorpo,
    paragrafos: [
      "A menopausa é uma fase inevitável na vida de toda mulher, mas cada experiência é única. Essa transição, que marca o fim dos ciclos menstruais e da fertilidade, vem acompanhada de mudanças físicas, emocionais e psicológicas. Muitas delas são naturais — ainda assim, podem causar preocupação e desafios reais no dia a dia.",
      "Durante a menopausa o corpo passa por flutuações hormonais que afetam diferentes áreas da vida: de ondas de calor a mudanças de humor, passando por sexualidade e bem-estar emocional. Com o conhecimento certo e o apoio necessário, é possível assumir o controle dessas mudanças e encontrar formas eficazes de lidar com elas.",
      "Este guia foi montado a partir das suas respostas para transformar essa fase em uma oportunidade de autodescoberta, bem-estar e renovação. A menopausa não é o fim de uma fase — é o início de outra, cheia de possibilidades.",
    ],
  },
  {
    id: "intro-o-que-e-menopausa",
    titulo: "O que é a menopausa e quando ela ocorre",
    secao: "acontecendo",
    tags: [],
    sempre: true,
    paragrafos: [
      "A menopausa é um processo natural que marca o fim da fase reprodutiva. Uma mulher é oficialmente considerada na menopausa quando passa 12 meses consecutivos sem menstruar, na ausência de outras causas médicas. Essa mudança está diretamente relacionada à diminuição da produção de estrogênio e progesterona, hormônios essenciais para a regulação do ciclo menstrual e para o equilíbrio geral do corpo.",
      "Embora geralmente ocorra entre 45 e 55 anos, a idade exata varia conforme genética, estilo de vida e condições médicas. Algumas mulheres entram na menopausa precoce antes dos 40 anos; outras passam por essa mudança depois dos 55.",
      "A menopausa pode acontecer naturalmente, como parte do envelhecimento, ou ser induzida por cirurgias ginecológicas, tratamentos como quimioterapia e radioterapia pélvica, ou doenças que afetam a função ovariana.",
    ],
  },
  {
    id: "estagios-menopausa",
    titulo: "Os estágios: perimenopausa, menopausa e pós-menopausa",
    secao: "acontecendo",
    tags: [],
    sempre: true,
    paragrafos: [
      "A menopausa não é um evento isolado, mas um processo em etapas. Na perimenopausa as flutuações hormonais deixam o ciclo irregular: períodos mais curtos ou mais longos, ondas de calor, insônia ou fadiga constante.",
      "Depois de um ano sem menstruação, considera-se que a mulher atingiu a menopausa. Os ovários param de liberar óvulos e a produção hormonal cai a níveis mínimos — os sintomas podem se intensificar e afetar qualidade de vida, saúde óssea, cardiovascular e emocional.",
      "Na pós-menopausa, que dura o resto da vida, os sintomas costumam diminuir gradualmente, ainda que algumas mulheres sintam ondas de calor ou secura vaginal por anos. A redução do estrogênio aumenta o risco de osteoporose, doenças cardíacas e alterações na pele — por isso os hábitos saudáveis seguem essenciais.",
    ],
  },
  {
    id: "fase-perimenopausa",
    titulo: "Onde você está agora: perimenopausa",
    secao: "acontecendo",
    tags: ["fase_perimenopausa"],
    paragrafos: [
      "Você está na perimenopausa — a fase de transição em que os ciclos menstruais se tornam irregulares. Os primeiros sintomas costumam aparecer aqui: ondas de calor, suores noturnos, alterações de humor, dificuldade para dormir e secura vaginal.",
      "À medida que o corpo se adapta a níveis mais baixos de estrogênio, esses sintomas podem se intensificar ou variar em intensidade — isso é esperado, e registrar o que você sente ajuda a enxergar o padrão em vez de dias soltos.",
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
    id: "alteracoes-hormonais",
    titulo: "Alterações hormonais e seus efeitos no corpo",
    secao: "acontecendo",
    tags: [],
    sempre: true,
    paragrafos: [
      "A queda de estrogênio e progesterona altera a regulação da temperatura corporal (ondas de calor e suores noturnos), o metabolismo (ganho de peso e maior acúmulo de gordura abdominal) e a pele, que perde elasticidade.",
      "No campo emocional, as flutuações hormonais influenciam o humor, com episódios de irritabilidade, ansiedade e maior sensibilidade. A memória e a concentração também podem ser afetadas, gerando a sensação de \u201Cconfusão mental\u201D.",
      "Nos ossos, a perda progressiva de densidade aumenta o risco de osteoporose — o que torna essencial adotar cedo hábitos que fortaleçam o esqueleto.",
    ],
  },
  {
    id: "fatores-que-influenciam",
    titulo: "O que influencia a sua experiência",
    secao: "acontecendo",
    tags: [],
    sempre: true,
    paragrafos: [
      "A genética tem papel importante — é comum filhas chegarem à menopausa em idades semelhantes às de suas mães e avós. O estilo de vida também pesa: dieta balanceada e atividade física regular tendem a suavizar os sintomas, enquanto fumo, excesso de álcool e açúcares processados podem antecipar a menopausa e agravar seus efeitos.",
      "Condições médicas (doenças autoimunes, tireoide, ovários policísticos) e cirurgias ginecológicas afetam o processo. O estresse é decisivo: níveis altos de cortisol desequilibram os hormônios e agravam insônia, ansiedade e fadiga.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 2. Sintomas                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: "sintomas-panorama",
    titulo: "Como os sintomas afetam o dia a dia",
    secao: "sintomas",
    tags: [],
    sempre: true,
    imagem: imgSintomas,
    paragrafos: [
      "Os sintomas da menopausa podem impactar bastante a qualidade de vida quando não são acompanhados. Distúrbios do sono causados por ondas de calor e ansiedade criam um ciclo em que fadiga e irritabilidade se intensificam, afetando trabalho, concentração e paciência.",
      "Desconfortos físicos, como secura vaginal ou dores musculares, afetam autoestima e vida íntima. Muitas mulheres sentem que perderam o controle do próprio corpo. Apesar disso, é importante lembrar: a menopausa não é uma doença, e sim uma fase de transição — com informação, hábitos saudáveis e apoio emocional é possível viver bem.",
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
    ],
    lista: [
      "Fitoestrógenos na dieta: soja, linhaça, tofu, grão-de-bico.",
      "Exercícios aeróbicos leves: caminhada, natação, ciclismo.",
      "Fitoterápicos como trevo vermelho e cimicífuga, com orientação profissional.",
      "Roupas em camadas, tecidos leves e ambiente arejado à noite.",
      "Em casos intensos, a terapia de reposição hormonal pode ser considerada com avaliação médica individual.",
    ],
    porFase: {
      perimenopausa:
        "Na sua fase atual, a perimenopausa, os calorões costumam ser mais imprevisíveis do que intensos — aparecem e somem sem um padrão claro, porque o estrogênio ainda está oscilando, não baixo de forma estável. Registrar no diário ajuda a começar a enxergar algum padrão.",
      menopausa:
        "Na sua fase atual, a menopausa, os calorões tendem a ser mais frequentes e intensos para a maioria das mulheres — costuma ser o período de pico desse sintoma, já que o estrogênio está nos níveis mais baixos.",
      pos_menopausa:
        "Na sua fase atual, a pós-menopausa, os calorões costumam perder força aos poucos, mas em algumas mulheres continuam por vários anos. Se ainda incomodam bastante nessa fase, vale conversar com sua médica sobre outras formas de manejo.",
    },
  },
  {
    id: "sintoma-insonia",
    titulo: "Insônia e sono interrompido",
    secao: "sintomas",
    tags: ["sintoma_insonia"],
    paragrafos: [
      "A dificuldade para dormir é um dos primeiros sintomas a aparecer, muitas vezes ligada a suores noturnos. Distúrbios do sono criam um ciclo em que fadiga e irritabilidade se intensificam ao longo do dia.",
    ],
    lista: [
      "Técnicas de relaxamento e respiração consciente antes de dormir.",
      "Infusões relaxantes como valeriana ou camomila.",
      "Magnésio, que também ajuda humor e ossos.",
      "Rotina regular de exercício, mas não perto da hora de dormir.",
      "Reduzir cafeína e álcool, principalmente no fim da tarde.",
    ],
    porFase: {
      perimenopausa:
        "Na sua fase atual, a perimenopausa, a insônia costuma estar ligada à própria oscilação hormonal, não só aos suores noturnos — o sono pode ficar mais leve e picado mesmo em noites sem calorão.",
      menopausa:
        "Na sua fase atual, a menopausa, os suores noturnos frequentes tendem a ser a causa mais direta das interrupções do sono — cuidar dos calorões noturnos costuma trazer bastante melhora para o sono nessa fase.",
      pos_menopausa:
        "Na sua fase atual, a pós-menopausa, mesmo quando os suores noturnos diminuem, o sono pode continuar mais frágil — outros fatores, como rotina, ansiedade e a própria idade, passam a pesar mais do que o hormônio isoladamente.",
    },
  },
  {
    id: "sintoma-humor",
    titulo: "Humor, ansiedade e confusão mental",
    secao: "sintomas",
    tags: ["sintoma_humor"],
    paragrafos: [
      "A diminuição de estrogênio e progesterona afeta o equilíbrio químico do cérebro, inclusive a serotonina. É comum sentir irritabilidade, ansiedade ou tristeza sem causa aparente, mudanças repentinas de humor e dificuldade de concentração. Esses sentimentos são normais e merecem empatia, não minimização.",
      "A fadiga crônica é outro sintoma frequente e nem sempre está ligada à falta de sono: a sensação de exaustão vem acompanhada de dificuldade de memória e concentração, gerando frustração e insegurança.",
    ],
    lista: [
      "Atividade física regular, que estimula endorfinas.",
      "Dieta balanceada e boa hidratação.",
      "Meditação, respiração consciente e atenção plena.",
      "Rede de apoio: conversar com outras mulheres na mesma fase, grupos ou terapia.",
    ],
    porFase: {
      perimenopausa:
        "Na sua fase atual, a perimenopausa, as oscilações de humor tendem a ser mais abruptas, acompanhando as mesmas flutuações hormonais que deixam o ciclo menstrual irregular — dias bem diferentes um do outro são comuns aqui.",
      menopausa:
        "Na sua fase atual, a menopausa, com o estrogênio estabilizado em níveis baixos, o humor tende a ficar mais constante (ainda que mais vulnerável) do que instável — irritabilidade ou ansiedade persistentes merecem mais atenção do que picos isolados.",
      pos_menopausa:
        "Na sua fase atual, a pós-menopausa, muitas mulheres relatam mais estabilidade emocional do que sentiam durante a transição. Se tristeza ou ansiedade persistente aparecem só agora, vale investigar outras causas além do hormonal com sua médica.",
    },
  },
  {
    id: "sintoma-dor-articular",
    titulo: "Dores nas articulações e músculos",
    secao: "sintomas",
    tags: ["sintoma_dor_articular"],
    paragrafos: [
      "Alterações no metabolismo e a diminuição da massa muscular podem levar a dores nas articulações, relacionadas à perda de colágeno e ao envelhecimento dos tecidos — mesmo sem mudança na dieta ou na atividade física.",
    ],
    lista: [
      "Exercícios de resistência: musculação leve, faixas elásticas.",
      "Ioga e pilates, de baixo impacto, para postura e flexibilidade.",
      "Ômega-3 para reduzir inflamação.",
      "Conversar com sua médica sobre cálcio, magnésio e vitamina D.",
    ],
    porFase: {
      perimenopausa:
        "Na sua fase atual, a perimenopausa, as dores costumam ser mais esporádicas, indo e vindo conforme o estrogênio oscila.",
      menopausa:
        "Na sua fase atual, a menopausa, com o estrogênio estavelmente mais baixo, as dores articulares tendem a ficar mais constantes — muitas mulheres notam esse sintoma se firmar justamente nessa fase.",
      pos_menopausa:
        "Na sua fase atual, a pós-menopausa, dor articular persistente pode se somar ao desgaste natural das articulações com a idade. Vale diferenciar com avaliação médica o que é hormonal do que tem outras causas, como osteoartrose.",
    },
  },
  {
    id: "sintoma-ressecamento",
    titulo: "Ressecamento vaginal e desconforto íntimo",
    secao: "sintomas",
    tags: ["sintoma_ressecamento"],
    paragrafos: [
      "A diminuição de estrogênio e testosterona reduz a lubrificação vaginal e altera a sensibilidade, gerando desconforto durante a relação sexual. Isso é natural, mas pode afetar autoestima e conexão com o parceiro.",
    ],
    lista: [
      "Lubrificantes à base de água e hidratantes vaginais.",
      "Tratamentos tópicos com estrogênio sob supervisão médica.",
      "Comunicação aberta sobre sentimentos e preocupações.",
      "Explorar novas formas de intimidade, sem pressão.",
    ],
    porFase: {
      perimenopausa:
        "Na sua fase atual, a perimenopausa, o ressecamento costuma ser leve e ir e vir, muitas vezes chegando antes de outros sintomas mais notados.",
      menopausa:
        "Na sua fase atual, a menopausa, esse sintoma tende a ficar mais perceptível e constante, à medida que a mucosa vaginal se adapta a níveis mais baixos de estrogênio.",
      pos_menopausa:
        "Na sua fase atual, a pós-menopausa, o ressecamento costuma não melhorar sozinho com o tempo — diferente de sintomas como o calorão, ele tende a se manter ou piorar aos poucos sem tratamento, porque depende do estrogênio continuar baixo, não de uma fase de adaptação temporária. Por isso costuma valer a pena tratar diretamente em vez de só esperar passar.",
    },
  },
  {
    id: "sintoma-ganho-peso",
    titulo: "Ganho de peso e metabolismo",
    secao: "sintomas",
    tags: ["sintoma_ganho_peso"],
    paragrafos: [
      "A redução do estrogênio afeta o metabolismo, o que pode levar a ganho de peso e mudança na distribuição de gordura (maior acúmulo abdominal), mesmo sem alterações na dieta.",
    ],
    lista: [
      "Proteínas de qualidade (peixe, ovos, frango, leguminosas, nozes) para preservar massa muscular.",
      "Evitar açúcar refinado e farinha processada.",
      "Grãos integrais, frutas frescas e gorduras saudáveis.",
      "Exercício de resistência combinado com aeróbico.",
      "Boa hidratação ao longo do dia.",
    ],
    porFase: {
      perimenopausa:
        "Na sua fase atual, a perimenopausa, as mudanças no peso costumam ser mais sutis, muitas vezes se misturando com um metabolismo que já vem em transição pela idade.",
      menopausa:
        "Na sua fase atual, a menopausa, a queda mais acentuada do estrogênio tende a acelerar o acúmulo de gordura abdominal, mesmo sem grandes mudanças na rotina — é um período em que ajustar alimentação e exercício costuma trazer diferença mais visível.",
      pos_menopausa:
        "Na sua fase atual, a pós-menopausa, o metabolismo mais lento se soma ao envelhecimento natural. Manter massa muscular com exercício de resistência continua sendo uma das estratégias mais eficazes para sustentar o metabolismo nessa fase.",
    },
  },

  /* ---------------------------------------------------------------- */
  /* 3. Recomendações                                                  */
  /* ---------------------------------------------------------------- */
  {
    id: "estrategias-gerais-dieta",
    titulo: "Alimentação para equilibrar hormônios",
    secao: "recomendacoes",
    tags: [],
    sempre: true,
    imagem: imgAlimentacao,
    paragrafos: [
      "Certos alimentos ajudam a equilibrar os hormônios e reduzir o desconforto. Os fitoestrógenos têm estrutura semelhante ao estrogênio humano e ajudam a compensar sua diminuição. Proteínas de qualidade preservam massa muscular e previnem perda óssea, enquanto cálcio e vitamina D fortalecem os ossos.",
    ],
    lista: [
      "Fitoestrógenos: soja, linhaça, tofu, grão-de-bico.",
      "Proteínas: peixe, ovos, frango, leguminosas e nozes.",
      "Cálcio e vitamina D: laticínios, amêndoas, espinafre, salmão.",
      "Evitar açúcares refinados e farinhas processadas.",
      "Gorduras saudáveis: abacate, azeite de oliva e nozes.",
      "Hidratação: beber bastante água ajuda pele e mucosas.",
    ],
  },
  {
    id: "estrategias-gerais-exercicio",
    titulo: "Movimento e atividade física",
    secao: "recomendacoes",
    tags: [],
    sempre: true,
    paragrafos: [
      "O exercício regula o peso, reduz o estresse, fortalece os ossos, melhora a saúde cardiovascular e estimula endorfinas, ajudando humor e ansiedade.",
      "Exercícios de resistência mantêm densidade óssea; atividades aeróbicas melhoram circulação e ajudam a controlar ondas de calor; ioga e pilates fortalecem músculos, melhoram flexibilidade e reduzem tensão. Mesmo 30 minutos por dia fazem diferença — o segredo é achar uma atividade prazerosa e sustentável.",
    ],
  },
  {
    id: "estresse-bem-estar",
    titulo: "Gerenciamento do estresse",
    secao: "recomendacoes",
    tags: [],
    sempre: true,
    paragrafos: [
      "Estresse e ansiedade intensificam os sintomas. Meditação, respiração consciente e atenção plena reduzem os níveis de cortisol e aumentam a sensação de calma.",
      "Dedicar tempo a atividades prazerosas — ler, ouvir música, pintar, estar na natureza — equilibra as emoções. Praticar gratidão e autocuidado diário sustenta uma atitude mais serena diante das mudanças.",
    ],
  },
  {
    id: "alternativas-tratamentos",
    titulo: "Alternativas naturais e tratamentos médicos",
    secao: "recomendacoes",
    tags: [],
    sempre: true,
    paragrafos: [
      "Existem opções que vão de remédios naturais a tratamentos médicos. A fitoterapia é uma das alternativas mais usadas: trevo vermelho, cimicífuga e dong quai contêm fitoestrógenos que podem reduzir ondas de calor.",
      "Quando os sintomas são intensos e afetam muito a qualidade de vida, a terapia de reposição hormonal (TRH) pode ser considerada — sempre prescrita por médica após avaliação individual de riscos e benefícios.",
    ],
    lista: [
      "Suplementos de magnésio e ômega-3 para humor, fadiga e ossos.",
      "Infusões relaxantes como valeriana e camomila para o sono.",
      "Hidratantes vaginais para aliviar o ressecamento.",
      "Cálcio e vitamina D para fortalecer os ossos.",
      "Acupuntura e reflexologia, úteis para algumas mulheres.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 4. Saúde óssea e cardiovascular                                   */
  /* ---------------------------------------------------------------- */
  {
    id: "densidade-ossea",
    titulo: "Impacto da menopausa na densidade óssea",
    secao: "ossos",
    tags: [],
    sempre: true,
    imagem: imgOssos,
    paragrafos: [
      "Um dos efeitos mais significativos da menopausa é a perda acelerada de densidade óssea, que aumenta o risco de osteoporose e fraturas. Nos primeiros anos a perda pode ser rápida, afetando principalmente vértebras, quadris e pulsos.",
      "Histórico familiar de osteoporose, dieta pobre em cálcio e vitamina D, sedentarismo, álcool em excesso, tabagismo e certos medicamentos aumentam o risco. Medidas preventivas desde o início da transição fazem grande diferença.",
    ],
  },
  {
    id: "dieta-ossos",
    titulo: "Dieta para fortalecer os ossos",
    secao: "ossos",
    tags: [],
    sempre: true,
    paragrafos: [
      "O cálcio é essencial para a formação e a manutenção óssea, e a vitamina D permite sua absorção adequada. Magnésio, fósforo e vitamina K completam o time de nutrientes que sustentam o esqueleto.",
    ],
    lista: [
      "Cálcio: iogurte, queijo, leite, amêndoas, sardinha, tofu, espinafre e couve.",
      "Vitamina D: luz solar, salmão, atum, ovos e cogumelos (suplementação sob orientação médica).",
      "Magnésio: sementes, nozes e leguminosas.",
      "Vitamina K: brócolis, couve-de-bruxelas e repolho.",
      "Evitar excesso de cafeína, álcool e sódio, que atrapalham a absorção de cálcio.",
    ],
  },
  {
    id: "exercicio-osteoporose",
    titulo: "Exercício para prevenir a osteoporose",
    secao: "ossos",
    tags: [],
    sempre: true,
    paragrafos: [
      "A atividade física estimula a regeneração óssea, melhora a densidade mineral, fortalece músculos e melhora o equilíbrio — reduzindo o risco de quedas e fraturas.",
    ],
    lista: [
      "Impacto moderado: caminhar, dançar, subir escadas.",
      "Resistência: pesos livres ou faixas elásticas.",
      "Ioga e pilates para postura, flexibilidade e estabilidade.",
      "Equilíbrio: tai chi chuan e exercícios de coordenação.",
      "Rotina de pelo menos 30 minutos por dia, combinando tipos diferentes.",
    ],
  },
  {
    id: "risco-cardiovascular",
    titulo: "Riscos cardiovasculares e como preveni-los",
    secao: "ossos",
    tags: [],
    sempre: true,
    paragrafos: [
      "Sem a proteção do estrogênio, o colesterol LDL tende a subir e o HDL a cair, aumentando o risco de aterosclerose. A pressão arterial pode aumentar e o metabolismo desacelera, favorecendo o acúmulo de gordura abdominal — outro fator de risco.",
    ],
    lista: [
      "Dieta rica em frutas, vegetais, leguminosas, peixes gordurosos e gorduras saudáveis.",
      "Reduzir gorduras saturadas, ultraprocessados e sal.",
      "Exercício aeróbico regular: caminhada, natação, bicicleta.",
      "Manter peso saudável e controlar o estresse.",
      "Evitar fumo e o consumo excessivo de álcool.",
    ],
  },
  {
    id: "exames-monitoramento",
    titulo: "Exames e monitoramento",
    secao: "ossos",
    tags: [],
    sempre: true,
    paragrafos: [
      "Acompanhamento médico adequado permite prevenir e tratar precocemente. Converse com a sua médica sobre a periodicidade ideal para você.",
    ],
    lista: [
      "Densitometria óssea, para detectar osteoporose no início.",
      "Exames de sangue: colesterol, triglicerídeos e glicose.",
      "Monitoramento regular da pressão arterial.",
      "Eletrocardiograma e exames cardíacos em caso de histórico familiar ou sintomas.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 5. Saúde sexual e vida íntima                                     */
  /* ---------------------------------------------------------------- */
  {
    id: "intimidade-hormonios",
    titulo: "Alterações hormonais e vida sexual",
    secao: "intimidade",
    tags: [],
    sempre: true,
    imagem: imgIntimidade,
    paragrafos: [
      "A queda de estrogênio e testosterona pode reduzir a libido, a lubrificação e alterar a sensibilidade. Somam-se fadiga, ansiedade e insônia, que também diminuem o interesse pela intimidade, além de mudanças na percepção do próprio corpo.",
      "Apesar disso, é plenamente possível manter uma vida sexual satisfatória. O desejo e o prazer podem ser vividos de novas formas, com foco na conexão emocional, nas preliminares e na exploração sem pressa.",
    ],
  },
  {
    id: "intimidade-estrategias",
    titulo: "Estratégias para melhorar a satisfação sexual",
    secao: "intimidade",
    tags: [],
    sempre: true,
    paragrafos: [
      "Cuidar da saúde vaginal é o primeiro passo: o ressecamento e o afinamento das paredes vaginais causam desconforto, mas há soluções simples e eficazes.",
    ],
    lista: [
      "Lubrificantes à base de água e hidratantes vaginais.",
      "Tratamentos tópicos com estrogênio sob supervisão médica.",
      "Relaxamento (ioga, meditação, respiração) para reduzir a tensão.",
      "Massagens, contato físico e exploração sensorial sem pressão por desempenho.",
    ],
  },
  {
    id: "intimidade-casal",
    titulo: "Comunicação no casal",
    secao: "intimidade",
    tags: [],
    sempre: true,
    paragrafos: [
      "Compartilhar o que está acontecendo fortalece o relacionamento. Falar abertamente sobre medos, expectativas e necessidades reduz a ansiedade e aumenta a conexão.",
      "O apoio mútuo é fundamental: um parceiro compassivo e disposto a se adaptar faz diferença. Atividades que promovem proximidade — viagens, jantares, momentos de qualidade — reforçam o vínculo. Em alguns casos, a orientação de um terapeuta especializado em sexualidade é muito útil.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 6. Humor e saúde mental                                           */
  /* ---------------------------------------------------------------- */
  {
    id: "mental-humor",
    titulo: "Mudanças de humor e saúde mental",
    secao: "mental",
    tags: [],
    sempre: true,
    imagem: imgMental,
    paragrafos: [
      "A menopausa não causa depressão diretamente, mas aumenta a vulnerabilidade emocional. Mudanças de humor repentinas, irritabilidade e ansiedade são comuns — em parte pela diminuição da serotonina.",
      "Fique atenta a sinais que merecem atenção profissional: perda de interesse por atividades que davam prazer, isolamento social, tristeza persistente e falta de energia que não melhora com descanso.",
    ],
  },
  {
    id: "mental-apoio",
    titulo: "Rede de apoio e autocuidado",
    secao: "mental",
    tags: [],
    sempre: true,
    paragrafos: [
      "Compartilhar experiências com outras mulheres na mesma fase alivia e dá perspectiva. Grupos de apoio, conversas com amigas, terapia psicológica ou coaching ajudam a lidar com as mudanças emocionais e a fortalecer a autoestima.",
    ],
    lista: [
      "Reserve momentos diários só seus, mesmo que curtos.",
      "Mantenha rotina de sono e refeições relativamente estável.",
      "Registre como você está se sentindo — padrões dizem mais que dias isolados.",
      "Peça ajuda cedo; não espere chegar ao limite.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* 7. Cuidado e acompanhamento                                       */
  /* ---------------------------------------------------------------- */
  {
    id: "quando-procurar-ajuda",
    titulo: "Quando procurar ajuda profissional",
    secao: "cuidado",
    tags: [],
    sempre: true,
    paragrafos: [
      "Procure ajuda se os sintomas começarem a interferir na sua capacidade de trabalhar, cuidar de si ou manter vida social; se houver alterações de humor difíceis de controlar, tristeza profunda ou perda de interesse em atividades que davam prazer; ou se sintomas físicos persistirem ou piorarem com o tempo.",
      "Um ginecologista, endocrinologista ou terapeuta pode indicar tratamentos, terapia hormonal ou estratégias de manejo emocional. Procurar ajuda não é sinal de fraqueza — é autocuidado.",
    ],
  },
  {
    id: "conclusao",
    titulo: "O começo de uma nova versão de você",
    secao: "cuidado",
    tags: [],
    sempre: true,
    paragrafos: [
      "A menopausa é uma fase transformadora que, embora traga desafios, abre portas para novas oportunidades de autocuidado e bem-estar. Com conhecimento e hábitos saudáveis, é possível atravessar as mudanças hormonais e emocionais com confiança e tranquilidade.",
      "Alimentação equilibrada, exercício regular e gerenciamento do estresse são aliados essenciais. O apoio de quem você ama e a comunicação aberta com profissionais de saúde fazem uma diferença enorme nessa transição.",
      "A menopausa não é o fim de nada: é o início de uma fase em que cada mulher pode se redescobrir, se fortalecer e viver com plenitude.",
    ],
  },
];

export const SECOES: { id: SecaoId; titulo: string }[] = [
  { id: "acontecendo", titulo: "O que está acontecendo no seu corpo" },
  { id: "sintomas", titulo: "Os seus sintomas, um a um" },
  { id: "recomendacoes", titulo: "Recomendações para o seu dia a dia" },
  { id: "ossos", titulo: "Saúde óssea e cardiovascular" },
  { id: "intimidade", titulo: "Saúde sexual e vida íntima" },
  { id: "mental", titulo: "Humor e saúde mental" },
  { id: "cuidado", titulo: "Cuidado e acompanhamento" },
];v
