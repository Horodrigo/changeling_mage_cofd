# Revisão editorial — em andamento

## Critério confirmado pelo usuário

Resumos mecânicos, não tradução integral da narrativa. Contratos com jogada de
invocação: Sucesso, Sucesso Excepcional, Falha e Falha Dramática. Sem jogada de
invocação: somente Efeito. Manter custos, duração, limites, opções, Brecha e
benefícios específicos. Testes posteriores de ataque/perícia não transformam um
Contrato de ativação automática em um Contrato com jogada de invocação.

## Cobertura desta etapa

- 73 Frátrias: bênçãos reescritas com benefícios, custos e limites. IDs, nomes
  originais e nomes localizados preservados. Descrições narrativas mantidas curtas.
- Fontes das Frátrias: Changeling the Lost pp. 51–59; Kith and Kin pp. 88–121;
  DE:CtL pp. 23–24 e 222–223. Seis referências antigas a Dark Eras 2 corrigidas
  para a edição efetivamente fornecida pelo usuário.
- Livro básico: 110 Contratos, com verificação dos resumos e preenchimento dos
  quatro resultados dos 55 Contratos com jogada de invocação (pp. 128–164).
- Contratos dos suplementos: há ajustes de redação e reconexão de resultados
  existentes, mas a revisão mecânica completa dos 144 restantes NÃO terminou.
- 7 nomes de Contratos ajustados com aliases para referências antigas.
- Removida a duplicação de resumo + resultado na ficha, seleção e tooltip.
- Adicionados os campos Falha e Falha Dramática ao editor de Contratos homebrew.
- Frátrias oficiais em fichas antigas usam os textos atuais do catálogo;
  Frátrias personalizadas preservam o conteúdo do jogador.

## Extração e ambiguidades

Fontes locais em E:/Downloads. Texto extraído por coluna, respeitando a mudança
de posição da medianiz em páginas pares/ímpares. Sidebars não são regras do
Contrato/Frátria: exemplos conferidos visualmente incluem core p. 129 e Kith and
Kin p. 114 (Mass Trauma Events). Quebras de páginas conferidas, incluindo Reborn
pp. 105–106 e Snowskin pp. 58–59. Nenhuma importação automática de texto bruto.

Kith and Kin contém inconsistências no próprio original: Oculus/Beastcaller usam
“Charisma”, atributo inexistente neste sistema; foi preservada a correspondência
já adotada no aplicativo, Presença. Lethipomp exige teste disputado sem informar
a parada oposta; o resumo explicita a omissão, sem inventar uma resistência.

## Próxima etapa pendente

Revisar os 144 Contratos de Kith and Kin (55), DE:CtL (1), Oak, Ash, and Thorn
(4), Beyond the Hedge (37), Book of Courts (40) e Book of Seemings (7). Conferir
todos os resultados, especialmente Falhas Dramáticas ainda ausentes; não usar
um resultado genérico para preencher uma lacuna da fonte. Revisar as Brechas e
benefícios em contract-details, ainda fora da conferência completa desta etapa.
Os textos legados de alguns suplementos ainda são vagos ou descrevem outro efeito.

As seções de resultados omitem campos ainda não cadastrados: isso NÃO significa
que o suplemento não possua aquele resultado. O teste de completude por enquanto
abrange o livro básico. O usuário autorizou publicar esta revisão parcial; isso
não significa que o catálogo inteiro já tenha sido revisado.

## Validação

33 testes direcionados passaram, incluindo cinco testes editoriais e dois de ordenação.
Build de produção passou. Typecheck isolado apresenta somente as três falhas
ambientais conhecidas: cloudflare:workers, Fetcher e D1Database.

Seletores e listas de escolha ordenados pelo rótulo em português, preservando
a ordem de Atributos e Perícias e a progressão numérica dos níveis.

## Auditoria rápida para a próxima etapa (2026-09-03)

Esta contagem mede presença estrutural, não fidelidade ao PDF. Um campo preenchido
ainda pode conter tradução literal, concordância ruim ou regra incorreta.

- Livro básico: 110 Contratos (55 com jogada e 55 automáticos). Todos têm tipo de
  ativação determinado e todos os Contratos com jogada têm Sucesso, Sucesso
  Excepcional, Falha e Falha Dramática. Há uma Brecha ausente: `last-harvest`.
- Os 10 Contratos básicos sem entrada em `contract-details`/`contract-results` são
  Contratos Goblin definidos diretamente em `contracts.ts`; não são lacunas por si.
- Suplementos: 144 Contratos (89 com jogada e 55 automáticos). Todos os 89 com
  jogada ainda precisam da conferência/preenchimento de Falha e Falha Dramática;
  15 também não têm Sucesso Excepcional cadastrado.
- Há 16 Contratos suplementares sem entrada em `contract-results`: 14 de Beyond
  the Hedge e 2 de Book of Courts.
- Há seis Brechas suplementares ausentes: `cracked-mirror`, `peacemakers-draw`,
  `principle`, `celestial-might`, `weaponize-mob` e `red-sky-at-morning`.

### Ordem recomendada

1. Fechar o livro básico: conferir a Brecha de `last-harvest`; depois auditar
   sistematicamente Brechas, benefícios de Feição, custo, ação e duração dos 110.
2. Revisar suplementos por fonte, sem misturar livros: Dark Eras Changeling (1),
   Oak, Ash, and Thorn (4), Book of Seemings (7), Beyond the Hedge (37), Book of
   Courts (40) e Kith and Kin (55).
3. Em cada página, extrair as duas colunas separadamente e conferir visualmente
   cabeçalhos, continuação na página seguinte e sidebars antes de editar o catálogo.
4. Para cada Contrato, fechar uma ficha de controle: nome, resumo mecânico, custo,
   ação, parada, duração, Sucesso, Sucesso Excepcional, Falha, Falha Dramática,
   Brecha, opções e benefícios. Marcar explicitamente “não existe na fonte” em vez
   de confundir ausência editorial com campo esquecido.
5. Executar testes de completude por livro e só então fazer a revisão transversal
   de terminologia e concordância.

## Internacionalização em paralelo

- Idiomas de apresentação: `pt-BR` e `en-US`, com preferência global do dispositivo.
- IDs e valores internos das fichas permanecem invariáveis; somente rótulos e textos
  apresentados são localizados.
- Cada regra aprovada na revisão deve receber, no mesmo passo, o resumo mecânico em
  português e em inglês sob o mesmo ID. Não retraduzir automaticamente o texto PT.
- Nomes originais já preservados: 254 Contratos, 73 Frátrias, 328 Magias, 382 Méritos
  e Condições. Os demais campos ingleses devem vir das fontes e ser resumidos.
- Conteúdo Homebrew do jogador permanece no idioma em que foi escrito.
- Busca considera nomes nos dois idiomas; ordenação usa os rótulos do idioma ativo.
- Enquanto uma entrada inglesa não estiver revisada, o fallback para português deve
  ser explícito e testável, nunca uma tradução inventada em tempo de execução.
