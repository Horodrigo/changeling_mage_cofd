# Internacionalização do Arquivo das Trevas

## Objetivo

Planejar a disponibilização do sistema em Português do Brasil (`pt-BR`) e Inglês (`en`) sem alterar a compatibilidade das fichas existentes e sem traduzir nomes de livros ou outras fontes bibliográficas.

Nenhuma implementação está prevista nesta etapa. Este documento registra a direção técnica para análise futura.

## Complexidade estimada

A complexidade geral é **média-alta**.

A internacionalização da interface — menus, botões, mensagens, títulos e validações — é relativamente simples. A maior parte do trabalho está no grande volume de conteúdo dos catálogos, incluindo:

- Méritos e Méritos Expandidos;
- Contratos e Regalias;
- Feitiços, Rotes, Praxis e Attainments;
- Condições;
- Feições e Fratrias;
- armas, armaduras, veículos e equipamentos;
- companheiros e demais regras descritivas.

A estrutura técnica e a interface podem ser internacionalizadas em alguns dias. A revisão completa dos catálogos nos dois idiomas exigirá mais tempo, principalmente para garantir consistência terminológica e fidelidade às fontes.

## Princípios arquiteturais

### IDs internos estáveis

Entidades de regras não devem ser identificadas pelo nome exibido ao jogador. Cada item deve possuir um identificador interno estável e independente do idioma.

Exemplo conceitual:

```ts
{
  id: "core-2ed:fast-reflexes",
  sourceId: "core-2ed",
  page: 54,
  dots: [1, 2, 3],
  translations: {
    "pt-BR": {
      name: "Reflexos Rápidos",
      description: "..."
    },
    en: {
      name: "Fast Reflexes",
      description: "..."
    }
  }
}
```

As fichas devem armazenar o `id` e os dados escolhidos pelo jogador, nunca o nome traduzido como referência principal. Assim, trocar o idioma não exige migrar fichas existentes.

### Textos da interface por chave

Todo texto fixo da interface deve ser substituído por uma chave estável, resolvida pelo idioma ativo.

```ts
t("character.actions.edit")
t("character.tabs.combat")
t("validation.skills.incomplete")
```

Os arquivos de idioma podem ser organizados inicialmente como:

```text
locales/
  pt-BR/
    interface.ts
    rules.ts
  en/
    interface.ts
    rules.ts
```

O sistema deve possuir um idioma padrão e um fallback. A recomendação inicial é usar `pt-BR` como padrão e como fallback enquanto o catálogo em inglês estiver incompleto.

### Idioma persistente

O seletor de idioma deve persistir a escolha no navegador. A preferência é uma configuração da aplicação, e não parte de cada personagem.

Ordem sugerida para determinar o idioma:

1. preferência salva pelo usuário;
2. idioma do navegador, caso seja suportado;
3. fallback para `pt-BR`.

### Fontes bibliográficas

Nomes de livros, suplementos e outras fontes devem permanecer no idioma original, independentemente do idioma selecionado para a interface.

Exemplos:

- `Changeling: The Lost Second Edition`;
- `Mage: The Awakening Second Edition`;
- `Chronicles of Darkness`;
- `Kith & Kin`;
- `Book of Seemings`.

Os identificadores das fontes também devem permanecer estáveis e separados dos respectivos nomes de exibição.

### Conteúdo criado pelo jogador

Conteúdo livre criado pelo jogador não será traduzido automaticamente. Isso inclui:

- nomes de personagens, Cortes, Ordens, Recantos e companheiros;
- Aspirações, Obsessões, Fragilidades, Juramentos e Anotações;
- especializações e benefícios personalizados;
- nomes ou descrições personalizados de Méritos;
- qualquer texto livre gravado na ficha.

Esse conteúdo deve ser exibido exatamente como foi escrito, independentemente do idioma atual da aplicação.

## Textos dinâmicos

Textos montados a partir de dados exigem tratamento específico. Não é suficiente traduzir palavras isoladas e concatená-las, pois a ordem e a concordância podem variar entre os idiomas.

Devem ser previstas mensagens parametrizadas:

```ts
t("experience.cost", { points: 3 })
t("merit.sourceReference", { source: "Kith & Kin", page: 42 })
```

A camada de tradução deverá tratar:

- singular e plural;
- números e pontuação;
- interpolação de nomes e valores;
- gênero gramatical quando necessário;
- textos de validação;
- nomes compostos gerados pelo sistema, como `Manto: Nome da Corte`;
- descrições resultantes de escolhas configuráveis.

## Compatibilidade e persistência

Antes de alterar os catálogos, será necessário verificar quais fichas ainda armazenam nomes em vez de IDs. Uma migração controlada pode ser necessária para normalizar registros antigos.

Requisitos de compatibilidade:

- uma ficha deve poder ser aberta em qualquer idioma suportado;
- trocar o idioma não pode alterar escolhas, custos ou histórico de Experiência;
- exportações e importações JSON devem usar IDs estáveis;
- valores antigos precisam de uma estratégia de resolução por aliases;
- traduções ausentes devem usar o fallback, sem ocultar conteúdo da ficha;
- regras e cálculos devem permanecer separados dos textos traduzidos.

## Estratégia recomendada

### Fase 1 — Fundação técnica

- inventariar textos fixos e textos dinâmicos;
- escolher ou implementar a camada de internacionalização;
- criar os arquivos `pt-BR` e `en`;
- implementar resolução de idioma e fallback;
- adicionar o seletor persistente;
- definir convenções de chaves e testes.

### Fase 2 — Interface

- migrar menus, botões, títulos e mensagens;
- migrar validações e diálogos;
- migrar criação, visualização, edição e impressão das fichas;
- verificar responsividade nos dois idiomas, pois textos em inglês podem ocupar espaços diferentes.

### Fase 3 — Modelo dos catálogos

- garantir IDs estáveis para todas as entidades;
- separar regras mecânicas de nomes e descrições;
- preparar aliases para dados legados;
- adaptar seletores, tooltips e Méritos Expandidos para resolver traduções por ID.

### Fase 4 — Conteúdo

- migrar cada catálogo para a estrutura multilíngue;
- revisar terminologia por linha de jogo;
- manter fontes no idioma original;
- conferir descrições, pré-requisitos, custos, rolagens, efeitos e demais campos;
- marcar traduções incompletas para usar o fallback de maneira explícita.

### Fase 5 — Validação

- testar fichas antigas nos dois idiomas;
- testar exportação e importação JSON;
- testar impressão e salvamento em PDF;
- conferir textos longos, pluralização e campos dinâmicos;
- validar que a mudança de idioma não altera dados nem cálculos;
- revisar terminologia de forma sistemática.

## Decisões pendentes

Antes da implementação, será necessário decidir:

1. Se o idioma inglês utilizará exclusivamente os termos originais dos livros ou permitirá adaptações editoriais.
2. Se exportações em PDF usarão o idioma ativo ou permitirão escolher um idioma específico no momento da exportação.
3. Se o JSON exportado incluirá apenas IDs ou também textos de exibição para facilitar leitura humana.
4. Como identificar visualmente itens cujo texto ainda esteja usando o idioma de fallback.
5. Se conteúdo personalizado poderá receber versões manuais em mais de um idioma no futuro.
6. Qual catálogo será migrado primeiro para validar a arquitetura antes da conversão completa.

## Recomendação inicial

Implementar primeiro a fundação técnica e a interface, mantendo o catálogo atual em `pt-BR` como fallback. Em seguida, migrar um catálogo pequeno como projeto-piloto. Depois de validar persistência, compatibilidade, seletores, impressão e textos dinâmicos, expandir o modelo para os catálogos maiores.

Essa abordagem permite adicionar Inglês e outros idiomas futuramente sem migrar novamente as fichas existentes ou duplicar a lógica das regras.
