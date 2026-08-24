# Your Menopause Guide

Crie um app chamado "Guia de Menopausa" em React + Vite + TypeScript + Tailwind + shadcn/ui, com Supab

ase como backend (auth + banco de dados). É um app de saúde pra mulheres em perimenopausa, menopausa e

 pós-menopausa.

TEMA VISUAL: acolhedor, calmo, moderno — não clínico/hospitalar, não infantil. Paleta terrosa/quente (

tons de terracota, bege quente, verde-sálvia) com um acento coral ou dourado suave. Fonte legível e hu

mana (system-ui). Cards com cantos arredondados generosos, sombra suave, sem excesso de ícone médico.

CONCEITO DO PRODUTO — duas partes centrais:

1. RELATÓRIO PERSONALIZADO (não é texto genérico igual pra todo mundo): onboarding com perguntas — ida

de, fase (perimenopausa / menopausa / pós-menopausa), data da última menstruação (se souber), sintomas

 predominantes (selecionar múltiplos: calorão, insônia, mudança de humor, dor articular, ressecamento,

 ganho de peso, etc). Com base nas respostas, gera um relatório individualizado (texto montado a parti

r de blocos de conteúdo por fase+sintoma, não IA generativa em tempo real) explicando o que está acont

ecendo no corpo dela, o que esperar, e recomendações por sintoma.

2. DIÁRIO DE SINTOMAS (rastreamento contínuo — o motivo dela abrir o app de novo): tela pra registrar,

 quando quiser, como foi o dia — calorão (sim/não/intensidade), qualidade do sono, humor, energia. Iss

o vira um gráfico simples de evolução ao longo do tempo, e o relatório da tela principal deve refletir

/comentar padrões recentes (ex: "seus calorões pioraram nas últimas 2 semanas").

MODELO DE ACESSO — importante, implemente exatamente assim:

- Pagamento único (SEM assinatura, sem mensalidade) dá acesso vitalício ao relatório completo e ao diá

rio de sintomas.

- MAS o histórico do diário de sintomas visível/consultável é limitado a 6 meses corridos — dados mais

 antigos que isso continuam sendo salvos no banco (não descarte), mas a tela mostra um estado de "bloq

ueado" tipo "Histórico completo e análise de tendência de longo prazo — em breve" no lugar de exibir.

Isso é proposital: é o gancho reservado pra um upsell futuro, não construa a tela de upsell agora, só

deixe esse limite implementado.

MODELO DE DADOS (Supabase):

- profiles (id, email, idade, fase_menopausa, sintomas_predominantes jsonb, created_at)

- entitlements (user_id, produto, ativo, origem_kiwify_order_id) — vitalício, sem campo de expiração

- registros_diario (id, user_id, data, calorao boolean, intensidade_calorao int, sono int, humor int,

energia int, created_at)

RLS: cada usuário só lê/escreve os próprios dados (user_id = auth.uid()); entitlements só gravável por

 service role (Edge Function de webhook).

TELAS:

/ — landing pública: hero, explicação do relatório personalizado, teaser grátis (responde 2-3 pergunta

s rápidas e vê um pedacinho do relatório), CTA pro checkout externo (Kiwify)

/entrar — login via magic link (Supabase Auth, sem senha)

/comecar — onboarding: idade, fase, sintomas predominantes, grava em profiles

/app — dashboard: resumo do relatório + atalho pro diário de hoje

/app/relatorio — relatório completo personalizado, organizado por seção (o que está acontecendo, por s

intoma, recomendações)

/app/diario — registrar o dia + ver histórico dos últimos 6 meses em gráfico simples (linha ou barras

por semana)

Ainda não crie a Edge Function do webhook Kiwify nem o conteúdo real dos textos do relatório — comece

só pelo setup do projeto, schema do Supabase, e as telas com dados mockados. Eu volto com o conteúdo d

epois.

```

**Pendência aberta:** o conteúdo real dos textos do relatório (por fase + sintoma) ainda não existe —

precisa ser escrito/curado com cuidado (não é fórmula matemática como numerologia, é conteúdo de saúde

, cuidado redobrado com fonte confiável, não alucinar conselho médico).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://my-phase-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4d8f8e28-ec5e-486f-acca-9bfe090440b8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
