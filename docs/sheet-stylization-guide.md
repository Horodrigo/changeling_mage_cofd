# Guia de estilização visual das fichas por linha

Este guia registra o processo usado na branch `changeling-style` para aproximar
a ficha de Changeling: The Lost de uma folha oficial ilustrada. Ele deve ser
usado como roteiro quando a mesma abordagem for aplicada a Mage ou a outra
linha, sem copiar mecanicamente a identidade visual ou as mecânicas de
Changeling.

O resultado adotado é híbrido:

- arte orgânica, letras ilustradas, desgaste e texturas permanecem raster;
- linhas retas e trechos que precisam crescer são desenhados em CSS;
- ornamentos pequenos são reutilizados por espelhamento e rotação;
- texto funcional permanece HTML selecionável, localizável e acessível;
- cada linha recebe CSS e assets próprios, escopados pela classe da linha.

## 1. Histórico da implementação de Changeling

O trabalho foi desenvolvido em quatro lotes, todos posteriores à `main` que
serviu de base para a branch:

| Commit | Papel no resultado |
| --- | --- |
| `1b24a07` — `feat: add changeling paper texture` | Introduziu a textura repetível de papel, combinou-a com o degradê lateral já existente e incluiu o arquivo no cache offline. |
| `f76d4cb` — `style(changeling): organiza CSS do título e cabeçalho` | Criou a camada CSS exclusiva de Changeling, fontes, pipelines de assets, moldura botânica, título raster, cabeçalho, abas, primeiro sistema de divisores e referência visual versionada. |
| `53b48c4` — `style(changeling): recompõe divisores da ficha` | Substituiu divisores monolíticos por peças, reutilizou um único terminal espelhado, eliminou assets redundantes e corrigiu a organização de Court e Aspirations na Main. |
| `be0bcea` — `feat(changeling): refina conteúdo e ornamento de perícia de kith` | Tornou Court colapsável na Main, definiu Summary como entrada mobile, simplificou Experience e substituiu o stamp fixo de Skill de Kith por uma moldura segmentada e medida em runtime. |

O plano e a análise visual originais continuam em `Estilizacao.md`. A imagem de
comparação usada no início do trabalho está em
`docs/visual-references/changeling-main.png`.

## 2. Alterações realizadas

### 2.1 Isolamento por linha

As regras específicas foram concentradas em `app/css/changeling-sheet.css` e todas
partem de `.ctl-sheet`. O arquivo é importado por `app/layout.tsx` depois de
`css/globals.css`, permitindo que a linha especialize as primitivas comuns sem
alterar intencionalmente Mage.

A classe da linha já é aplicada por `CharacterPaperShell`:

- Changeling: `.cod-sheet.ctl-sheet`;
- Mage: `.cod-sheet.mta-sheet`.

Para outra linha, use o mesmo padrão de escopo. Não coloque a paleta, a fonte ou
os ornamentos novos em seletores globais apenas porque a estrutura HTML é
compartilhada.

### 2.2 Papel, paleta e dimensão da folha

Changeling passou a usar:

- tinta principal `#173823`;
- tinta suave e regras derivadas da mesma cor com transparência;
- papel-base `#eee6d2`;
- textura repetível de 1024 × 1024 px;
- degradê verde lateral sobre a textura;
- sombra externa suave e sombra interna esverdeada.

Os tokens estão no primeiro bloco `.ctl-sheet` de
`app/css/changeling-sheet.css`. Esse é o lugar correto para calibrar cor, opacidade,
padding e geometria da moldura.

O contêiner comum `.cod-sheet`, em `app/css/globals.css`, foi ajustado para a
proporção de trabalho adotada durante o fine tuning: `min-width: 900px` e
`min-height: 1059px`. A largura deixa de ser rígida abaixo de 850 px, quando as
regras responsivas assumem o layout. Como esse seletor é compartilhado, uma
adaptação futura deve confirmar visualmente as duas linhas antes de alterar
esses valores novamente.

### 2.3 Tipografia

Foram criadas três faces WOFF2 exclusivas da ficha de Changeling:

| Arquivo | Família CSS | Uso |
| --- | --- | --- |
| `changeling-regular.woff2` | `Changeling Sheet` | Traits, títulos, conteúdo editorial e controles. |
| `changeling-italic.woff2` | `Changeling Sheet` em itálico | Valores de identidade, inputs, placeholders e conteúdo manuscrito. |
| `changeling-small-caps.woff2` | `Changeling Sheet Small Caps` | Labels, categorias e títulos curtos. |

As fontes são builds levemente condensadas de EB Garamond 12. Os TTF-fonte e a
SIL Open Font License ficam em `assets/fonts/changeling/`; somente WOFF2 é
servido por `public/fonts/changeling/`. O script
`scripts/build-changeling-fonts.py` renomeia os metadados, condensa os contornos
e gera as três faces de modo reproduzível.

O título `CHANGELING` não usa essa fonte: ele é lettering raster transparente.
O texto real continua no DOM e é ocultado apenas visualmente por tamanho de
fonte zero, preservando semântica e acessibilidade.

### 2.4 Moldura externa

`app/workspace/character-paper-shell.tsx` adiciona uma camada decorativa somente
quando `line === "CtL"`. Ela é `aria-hidden`, não recebe eventos e contém:

- quatro trechos de linha externos;
- duas estrelas centrais, superior e inferior;
- quatro pequenos ornamentos adjacentes às estrelas;
- quatro cantos botânicos.

A composição evita uma imagem de página inteira:

- um único canto é espelhado com `scaleX`, `scaleY` ou `scale(-1)`;
- uma única estrela central é girada 180° na borda inferior;
- um único ornamento lateral da estrela é espelhado e girado nas quatro posições;
- as linhas horizontais são gradientes CSS interrompidos antes da estrela;
- as linhas verticais são gradientes CSS entre os cantos;
- nenhuma linha está incorporada ao canto botânico ou passa atrás da estrela.

As variáveis `--ctl-frame-*` controlam o encontro entre esses elementos. Existem
conjuntos menores nos breakpoints de 980 px e 720 px, inclusive largura e altura
responsivas da estrela central.

### 2.5 Cabeçalho e abas

O cabeçalho foi recomposto com três elementos independentes:

- `changeling-title.webp` para o lettering principal;
- `THE LOST`/`OS PERDIDOS` como texto HTML posicionado ao lado do título;
- `CHRONICLES OF DARKNESS`/`CRÔNICAS DAS TREVAS` como texto HTML independente.

O divisor inferior do cabeçalho usa `divider-terminal.webp` em cada extremidade
e duas linhas CSS. O mesmo terminal é espelhado no lado direito; não são
necessários arquivos `left` e `right`.

As abas formam uma caixa contínua com cantos arredondados, divisores verticais
de altura total e `overflow: hidden`. A aba ativa recebe um inset de 4 px e a
textura orgânica `selected-tab-texture.webp`, mantendo uma pequena margem entre
o preenchimento e a borda externa.

### 2.6 Divisores internos

Há dois sistemas distintos.

O divisor comum de seção, usado por Skills, Merits, Health, Willpower, Line
Traits, Court, Favored Regalia, Frailties, Clarity, Touchstones, Conditions,
Aspirations e Notes, usa:

- uma linha CSS flexível em cada lado do texto;
- `divider-terminal.webp` no extremo interno;
- o mesmo pseudo-elemento espelhado no lado direito;
- uma única linha para títulos secundários, em vez de imagens largas rígidas.

O divisor de Attributes é mais ornamentado e usa, em cada metade, esta ordem:

```text
corner — middle — leaf — Attributes — leaf espelhada — middle espelhado — corner espelhado
```

Cada metade é uma sobreposição de três WebPs e uma linha CSS. O texto permanece
centralizado e acima da decoração. Os três assets possuem função própria e não
devem ser fundidos novamente em uma imagem de largura fixa.

Os antigos `attributes-divider.webp`, `divider-arm.webp` e `panel-node.webp`
foram removidos porque duplicavam funções ou não se adaptavam à largura real.
Painéis de recursos e Experience passaram a reutilizar
`frame-star-side.webp` nos quatro cantos.

### 2.7 Linhas verticais e grid

Os separadores entre Attributes, Skills, conteúdo central, recursos e blocos
inferiores deixaram de usar bordas CSS perfeitamente uniformes. Eles usam
`vertical-rule.webp`, um trecho estreito de tinta escaneada repetido em Y.

A ficha mantém três colunas em desktop e remove padding nas extremidades
externas para aproveitar melhor a área útil. Em mobile, as grids são empilhadas
e as regras verticais deixam de separar colunas.

### 2.8 Ajustes de conteúdo e interação

Além da decoração, o trabalho corrigiu detalhes necessários para que a Main
correspondesse à estrutura da referência:

- removeu a lista duplicada de Aspirations que aparecia abaixo de Frailties;
- restaurou Court abaixo de Merits;
- transformou Court na Main em um `<details>` colapsável;
- mostrou o nome da Court sem o prefixo `MANTLE:` na Main;
- exibiu emoção, níveis de Mantle 1–5 e fonte da Court quando expandida;
- manteve níveis ainda não alcançados visíveis com opacidade reduzida;
- preservou a apresentação anterior de Court fora da Main;
- removeu o badge redundante `XP available` do cabeçalho de Experience;
- manteve o XP disponível editável ao lado de Total XP e XP Spent;
- centralizou `Beats and Experience` e seu subtítulo;
- trocou o ícone genérico da compra de característica por uma folha;
- aumentou labels de Experience e reduziu a altura mínima de Notes durante o
  ajuste da folha;
- fez uma ficha recém-selecionada abrir em Summary no mobile, associando o
  estado da aba ao ID do personagem.

### 2.9 Moldura dinâmica da Skill de Kith

O antigo `kith-skill-stamp.webp` era esticado como uma imagem única e foi
removido. O substituto possui quatro peças:

```text
left + right
left + middle-1 + right
left + middle-1 + middle-2 + middle-1 + middle-2 + ... + right
```

`KithSkillName`, em `app/workspace/sheet-primitives.tsx`, mede a largura real do
nome localizado com `getBoundingClientRect()`. Um `ResizeObserver` recalcula a
moldura quando a métrica muda. No estado atual:

```text
altura renderizada = 38 px
largura fixa = (471 + 760) × 38 / 552
largura de um segmento = 260 × 38 / 552
largura requerida = largura do texto + 20 px
segmentos = max(0, ceil((largura requerida - largura fixa) / largura do segmento))
```

A folga contínua já faz parte de `largura requerida`. Por isso, nomes curtos
como Brawl, Drive e Crafts usam somente `left + right`; um segmento central só
é adicionado quando a largura medida realmente ultrapassa a capacidade das duas
extremidades. Os segmentos centrais alternam entre as versões 1 e 2 para evitar
repetição visual evidente. O posicionamento final calibrado está em
`.kith-skill-frame`.

Para ajustar esse efeito no futuro:

- altere `height` no CSS para mudar toda a escala;
- altere `top` e `left` para posicionar sem afetar a medição;
- altere os `20 px` no TypeScript para mudar a folga contínua em torno do texto;
- não acrescente um segmento fixo depois do `ceil`: isso faz nomes curtos
  escaparem para a esquerda;
- mantenha as proporções originais nas fórmulas de largura;
- não recorte individualmente essas quatro peças depois de prontas, pois isso
  pode quebrar os encaixes entre elas.

### 2.10 Prévia e saída A4 de impressão

A prévia e o documento enviado ao driver de impressão compartilham a mesma
estrutura `.ctl-print-document`, mas não o mesmo nó nem os mesmos ancestrais.
Ao imprimir, `CharacterPrintDialog` cria um clone novo dentro de
`.character-print-surface`, um filho direto de `body`, e o descarta quando
`window.print()` termina. O clone é pré-layoutado fora da tela antes da troca
para a mídia impressa.

Esse isolamento é obrigatório. Modais centralizados costumam usar `position:
fixed`, tradução e animação de escala; alguns drivers capturam essa camada
transformada e gravam a ficha em apenas parte da folha, mesmo quando a prévia
HTML parece correta. Na mídia `print`:

- `@page` define A4 retrato sem margens do navegador;
- somente `.character-print-surface` permanece visível;
- nenhuma regra posterior pode reexibir o modal ou sua prévia original, pois
  isso duplica as páginas no PDF;
- documento e páginas repetem explicitamente 210 × 297 mm;
- animações, transições, transformações e sombras externas são removidas;
- menus, modal, opções e controles do aplicativo não participam do layout.

Não valide impressão apenas pela prévia do aplicativo. Salve um PDF pelo driver
real, renderize todas as páginas e confirme: MediaBox A4, ocupação integral da
folha, ornamentos carregados, número de páginas e ausência de vazamento entre
páginas. A impressão de Mage deve reutilizar esse mecanismo neutro de saída,
mas manter sua composição e interpretação dos dados dentro da própria linha.

## 3. Inventário exato de imagens

### 3.1 Assets usados em runtime por Changeling

A implementação completa usa **16 imagens raster** quando a marca-d'água já
existente também é contada: 12 fundamentais e 4 específicas da moldura dinâmica
de Skill de Kith.

| Grupo | Asset público | Dimensão | Canal | Propósito |
| --- | --- | ---: | --- | --- |
| Papel | `public/paper-texture.webp` | 1024 × 1024 | RGB | Textura repetível do fundo da folha. |
| Moldura | `public/changeling/style/botanical-corner.webp` | 1229 × 1280 | RGBA | Um canto botânico reutilizado nas quatro quinas por transformação CSS. |
| Moldura | `public/changeling/style/frame-star-center.webp` | 232 × 314 | RGBA | Estrela central superior; rotacionada para a inferior. |
| Moldura | `public/changeling/style/frame-star-side.webp` | 120 × 103 | RGBA | Um ornamento lateral reutilizado ao redor das duas estrelas e nos cantos de painéis. |
| Cabeçalho | `public/changeling/style/changeling-title.webp` | 998 × 190 | RGBA | Lettering ilustrado da marca Changeling. |
| Abas | `public/changeling/style/selected-tab-texture.webp` | 1280 × 320 | RGB | Tinta orgânica da aba ativa; aplicada com `background-size: cover`. |
| Attributes | `public/changeling/style/attributes-divider.webp` | 1182 × 499 | RGBA | Medalhão/trecho intermediário do divisor. |
| Attributes | `public/changeling/style/attributes-divider-leaf.webp` | 1570 × 579 | RGBA | Ramo adjacente ao texto Attributes. |
| Seções | `public/changeling/style/divider-terminal.webp` | 514 × 403 | RGBA | Terminal único para divisores de cabeçalho e seções; o lado oposto é espelhado. |
| Grid | `public/changeling/style/vertical-rule.webp` | 13 × 880 | RGBA | Traço de tinta irregular repetido verticalmente. |
| Marca-d'água | `public/changeling-skull.png` | 534 × 500 | RGBA | Símbolo central muito translúcido, já existente antes da branch. |
| Skill de Kith | `public/changeling/style/skill-kith-left.webp` | 471 × 552 | RGBA | Início da moldura adaptável. |
| Skill de Kith | `public/changeling/style/skill-kith-middle-1.webp` | 260 × 552 | RGBA | Primeiro segmento repetível. |
| Skill de Kith | `public/changeling/style/skill-kith-middle-2.webp` | 260 × 552 | RGBA | Segundo segmento repetível, alternado com o primeiro. |
| Skill de Kith | `public/changeling/style/skill-kith-right.webp` | 760 × 552 | RGBA | Fechamento da moldura adaptável. |

Há ainda **3 fontes WOFF2**, que não entram na contagem de imagens, em
`public/fonts/changeling/`.

### 3.2 Quantidade recomendada para uma nova linha

Para reproduzir a mesma profundidade visual em Mage, prepare primeiro **12
imagens fundamentais de runtime**:

1. uma textura de papel repetível;
2. um canto ornamental sem linhas incorporadas;
3. um ornamento central superior/inferior;
4. um pequeno ornamento adjacente ao centro, reutilizável por espelhamento;
5. um título ou logotipo transparente;
6. uma textura opaca para aba selecionada;
7. um terminal externo do divisor principal;
8. um elemento intermediário do divisor principal;
9. um ornamento interno adjacente ao título do divisor principal;
10. um terminal genérico de seção;
11. uma regra vertical de tinta repetível;
12. uma marca-d'água da linha.

Se a linha possuir um destaque que precise envolver texto de largura variável,
adicione **4 imagens segmentadas** — esquerda, centro A, centro B e direita —
chegando a **16 imagens**, como em Changeling. Não crie esse conjunto para Mage
apenas para imitar Kith: só o adote se houver um significado visual próprio,
como Rote, Ruling ou outro estado que realmente peça essa ornamentação.

O pacote-fonte atual de Changeling contém 14 arquivos em
`assets/changeling-style/source/`. A diferença de contagem ocorre porque
`frame-star.png` é um master do qual o pipeline extrai dois assets de runtime,
enquanto a marca-d'água já existia e não faz parte desse pacote-fonte.

## 4. Especificação dos arquivos visuais

### 4.1 Resolução e formato

- Entregue ornamentos em RGBA com fundo realmente transparente.
- Use resolução entre 2× e 4× o maior tamanho esperado no CSS; o navegador deve
  reduzir, nunca ampliar arte orgânica pequena.
- Use WebP lossless para tinta, folhas, letras e peças com alfa.
- Use WebP com qualidade alta para papel e textura de aba, que são opacos e
  fotográficos.
- Preserve um master não destrutivo em `assets/<linha>-style/source/` e gere a
  cópia otimizada em `public/<linha>/style/`.
- Não sirva os masters pesados ao navegador.

### 4.2 Recorte e margens transparentes

Recorte margens invisíveis antes de posicionar o asset. Margens grandes obrigam
compensações frágeis em `top`, `left` e `background-position`.

O pipeline de Changeling usa estes paddings de segurança:

- canto botânico e título: 8 px no master recortado;
- estrela central e ornamento lateral: 4 px;
- três peças de Attributes: 6 px e descarte de alfa abaixo de 16;
- terminal comum: 2 px;
- moldura segmentada de Skill: sem recorte automático, para preservar as emendas.

O recorte deve manter antialiasing e sombras intencionais. Antes de automatizar,
verifique se a suposta margem não contém um traço muito claro do desenho.

### 4.3 O que não deve estar incorporado às imagens

- linhas longas horizontais ou verticais;
- cor de papel atrás de arte que deveria ser transparente;
- fragmentos de texto, campos ou controles da referência;
- quadriculado de transparência exportado como pixels;
- variantes direita/esquerda que possam ser obtidas por espelhamento sem mudar o desenho;
- quatro cópias do mesmo canto;
- uma moldura de página inteira com altura fixa.

Linhas incorporadas foram a principal causa de descontinuidade milimétrica na
primeira passagem. Deixe pontos de encontro curtos nos ornamentos e conecte o
restante por CSS.

## 5. Pipeline de geração

### 5.1 Rasters

O script atual requer Pillow:

```text
python scripts/build-changeling-style-assets.py
```

Modos parciais:

```text
python scripts/build-changeling-style-assets.py --attributes-only
python scripts/build-changeling-style-assets.py --kith-skill-only
```

Ele executa, conforme o asset:

- conversão para RGBA;
- limpeza de pixels quase brancos no título;
- extração de tinta verde quando a fonte contém papel ou quadriculado;
- recorte pelo bounding box do alfa com padding controlado;
- redução por Lanczos;
- WebP lossless para transparências;
- WebP lossy de alta qualidade para texturas opacas.

Para Mage, copie a arquitetura do script, não os parâmetros cegamente. Cor de
tinta, faixas de recorte, limiares de alfa e dimensões máximas devem ser próprios
da arte de Mage.

### 5.2 Fontes

```text
python scripts/build-changeling-fonts.py
```

Dependências: `fonttools` e `brotli`. O argumento `--x-scale` aceita valores
entre 0.8 e 1.0 e usa 0.965 por padrão. Para outra linha:

- confirme a licença antes de versionar o arquivo;
- mantenha o texto integral da licença;
- use nomes internos exclusivos para evitar colisão com fontes instaladas;
- gere apenas formatos necessários em runtime;
- valide acentos de `pt-BR` e caracteres de `en-US`;
- não use a fonte da folha oficial sem direito de redistribuição.

## 6. Ordem recomendada para estilizar Mage ou outra ficha

### Etapa 1 — Fixar a referência

1. Escolha uma captura principal com viewport, zoom, idioma e personagem
   conhecidos.
2. Crie ou salve um personagem-fixture com o mesmo conteúdo.
3. Registre capturas adicionais em 1440, 1024, 768 e 390 px.
4. Separe observações de geometria, cor, textura, tipografia e conteúdo.

Sem conteúdo estável, uma linha maior ou um Merit adicional pode parecer um erro
de CSS.

### Etapa 2 — Auditar os assets

1. Liste tudo que pode ser reutilizado por espelhamento ou rotação.
2. Separe ornamentos fixos de trechos extensíveis.
3. Confirme transparência real e inspecione halos.
4. Recorte margens invisíveis.
5. Defina quais imagens são fundamentais e quais representam uma mecânica da
   linha.
6. Preserve origem, licença e masters.

Evite vetorizar automaticamente ilustrações orgânicas. A tentativa com SVGs
esquemáticos perdeu textura, irregularidade e peso. SVG continua adequado para
geometria limpa criada como vetor, mas não é automaticamente superior a um
raster restaurado.

### Etapa 3 — Criar a camada da linha

1. Crie `app/css/mage-sheet.css` ou o equivalente da nova linha.
2. Escopo obrigatório: `.mta-sheet` para Mage.
3. Importe a folha depois de `css/globals.css`.
4. Defina tokens de tinta, papel, regras, opacidades e geometria.
5. Mantenha os seletores compartilhados em `css/globals.css` neutros.

Não copie `.ctl-sheet` para `.mta-sheet` por busca e substituição. Use os mesmos
mecanismos somente onde a linguagem visual de Mage pedir o mesmo comportamento.

### Etapa 4 — Fundo e tipografia

1. Aplique primeiro o papel e a paleta, pois eles afetam a percepção de todas as
   cores.
2. Integre as fontes licenciadas antes de calibrar larguras e espaçamentos.
3. Defina papéis tipográficos: marca, títulos, labels, valores, texto editorial
   e controles.
4. Mantenha fallbacks próximos e `font-display: swap`.

### Etapa 5 — Moldura externa

1. Monte cantos e centros como elementos independentes.
2. Gere linhas com CSS entre pontos conhecidos.
3. Interrompa as linhas atrás de estrelas e ornamentos centrais.
4. Use variáveis CSS para cada distância importante.
5. Reduza estrela, cantos e offsets por breakpoint.
6. Marque a camada como decorativa e não interativa.

O shell compartilhado hoje contém a ativação explícita da moldura de Changeling.
Ao adicionar outra linha, prefira um componente decorativo pertencente à linha
ou um pequeno ponto de composição no shell. Não acumule toda a implementação de
Mage dentro de condicionais CtL/MtA no componente comum.

### Etapa 6 — Cabeçalho, abas e divisores

1. Posicione marca, subtítulo e selo do sistema independentemente.
2. Preserve os textos no DOM mesmo quando a marca for uma imagem.
3. Faça linhas e abas responderem à largura disponível.
4. Use uma única imagem terminal espelhada sempre que possível.
5. Dê ao divisor principal peças próprias; títulos comuns devem usar a variante
   mais barata e flexível.

### Etapa 7 — Geometria e componentes

1. Calibre identity, Attributes e corpo principal antes dos detalhes menores.
2. Troque bordas verticais perfeitas por um repeat de tinta somente se isso fizer
   parte da referência.
3. Verifique textos longos em ambos os idiomas.
4. Não reduza áreas clicáveis para caber no desenho impresso.
5. Mantenha lógica e dados na implementação da linha; CSS compartilhado não deve
   adquirir mecânicas específicas.

### Etapa 8 — Estados especiais

Para um ornamento que envolve texto dinâmico:

1. separe esquerda, pelo menos dois centros alternáveis e direita;
2. mantenha a mesma altura e pontos de encaixe em todas as peças;
3. meça o texto depois da fonte carregar/renderizar;
4. calcule a quantidade mínima de centros mais uma folga explícita;
5. observe mudanças de tamanho;
6. mantenha a decoração fora da acessibilidade e dos eventos de ponteiro.

### Etapa 9 — Responsividade

- Desktop: composição completa e densidade próxima da referência.
- Tablet: ornamentos menores e linhas ainda contínuas.
- Mobile: conteúdo empilhado, abas utilizáveis e entrada em Summary.
- Alto contraste: fallback legível para lettering e linhas decorativas.

### Etapa 10 — Impressão

Implemente a impressão somente depois que o layout responsivo da linha estiver
estável. Use a superfície direta descrita na seção 2.10, preserve A4 também
quando o usuário abrir o aplicativo no celular e mantenha a composição impressa
sob responsabilidade da linha. A validação deve incluir um PDF realmente salvo
e renderizado; a prévia sozinha não é critério de aceite.

### Etapa 11 — Offline

Ao adicionar, substituir ou remover um asset público:

1. atualize a lista `SHELL` em `public/sw.js`;
2. remova URLs obsoletas;
3. altere a versão do cache;
4. confirme o contrato de `public/version.json` usado pela aplicação;
5. teste uma recarga offline depois que o novo Service Worker assumir o controle.

Esquecer essa etapa pode fazer uma correção parecer ausente devido a cache antigo
ou quebrar a instalação offline.

## 7. Pontos de fine tuning

| Resultado visual | Arquivo e seletor/parâmetro |
| --- | --- |
| Cor, textura, padding e sombra da folha | `app/css/changeling-sheet.css`: `.ctl-sheet` |
| Encontro das linhas externas | variáveis `--ctl-frame-rail-*`, `--ctl-frame-side-x`, `--ctl-frame-corner-depth` |
| Escala da estrela por viewport | `--ctl-frame-star-*` nos blocos base, 980 px e 720 px |
| Distância dos enfeites da estrela | `--ctl-frame-star-side-*` |
| Escala e posição dos cantos | `.ctl-frame-corner` e suas quatro transformações |
| Tamanho do lettering | `.ctl-title-mark` |
| Posição de THE LOST | `.cod-sheet-title strong` |
| Posição de CHRONICLES OF DARKNESS | `.cod-sheet-title p` |
| Linha sob o cabeçalho | `.cod-sheet-title::before` e `::after` |
| Caixa e inset da aba ativa | `.ctl-sheet-tab-list` e botão ativo `::before` |
| Divisores comuns | `.official-heading::before` e `::after` |
| Divisor de Attributes | `.ctl-attributes-heading` e seus pseudo-elementos |
| Linhas verticais | backgrounds de `.official-trait-grid`, `.official-sheet-body` e `.sheet-bottom-grid` |
| Moldura da Skill de Kith | `.kith-skill-frame`, fórmulas das peças e `KithSkillName` |
| Altura/largura global da folha | `.cod-sheet` em `app/css/globals.css` |

Concentre mudanças em tokens e seletores de alto nível. Compensações diferentes
para cada canto ou título normalmente indicam que o asset ainda tem margem
invisível ou que uma linha extensível foi incorporada à imagem.

## 8. Assets removidos e motivo

Não restaure estes arquivos sem uma nova necessidade comprovada:

| Asset removido | Motivo |
| --- | --- |
| `attributes-divider.webp` | Divisor monolítico não acomodava texto e largura variáveis. |
| `divider-arm.webp` | O mesmo resultado é obtido com terminal reutilizável e linha CSS. |
| `panel-node.webp` | Duplicava o papel do ornamento lateral da estrela. |
| `kith-skill-stamp.webp` | Distorcia e não acompanhava a largura real do nome localizado. |
| `attributes-divider.png` e `section-divider.png` nos masters | Substituídos pelas peças finais reutilizáveis. |
| variantes `divider-terminal-left/right` | Um único terminal pode ser espelhado. |

## 9. Validação obrigatória

Depois de cada lote significativo:

```text
npm run lint
npm run build
node --test --test-concurrency=1 tests/*.test.mjs
npx tsc --noEmit
git diff --check
```

Em Windows, os wrappers normais de lint/build podem depender de Bash e GNU
`timeout`. Se for necessário executar ferramentas equivalentes diretamente,
registre isso como diagnóstico e não afirme que o script normal passou.

Checklist visual:

- 1440, 1024, 768 e 390 px;
- zoom do navegador em 100% e um teste com zoom ampliado;
- `pt-BR` e `en-US`;
- textos curtos e longos;
- fontes totalmente carregadas;
- nenhuma linha passando sobre estrelas, terminais ou títulos;
- nenhum halo ou fundo falso nos WebPs transparentes;
- abas opcionais presentes e ausentes;
- conteúdo colapsado e expandido;
- teclado, foco, hover e toque;
- impressão;
- modo offline após atualização do cache;
- comparação explícita da ficha de outra linha para detectar vazamento de CSS.

## 10. Critérios de conclusão

Uma estilização por linha está pronta quando:

1. papel, paleta, tipografia e hierarquia correspondem à referência no fixture
   combinado;
2. linhas extensíveis encontram os ornamentos sem sobreposição ou descontinuidade;
3. arte orgânica não é deformada;
4. texto permanece selecionável, traduzível e legível;
5. controles continuam claramente interativos;
6. a moldura acompanha a altura real do conteúdo;
7. a versão mobile é uma adaptação coerente, não uma miniatura ilegível;
8. assets-fonte, licença, geração e arquivos públicos estão documentados;
9. o shell offline contém somente os assets em uso;
10. a linha estilizada não altera visual ou mecânica das demais;
11. os quality gates passam, com qualquer erro ambiental/baseline separado de
    regressões novas;
12. a comparação visual final é aprovada no viewport e no conteúdo acordados.

## 11. Resumo para iniciar Mage

Antes de escrever CSS de Mage, reúna:

- a referência desktop e, se possível, uma referência mobile;
- 12 imagens fundamentais conforme a seção 3.2;
- até 4 segmentos adicionais somente se Mage tiver um marcador adaptável;
- fontes licenciadas com variantes suficientes para os papéis tipográficos;
- um fixture bilíngue estável;
- uma pasta de masters, uma pasta pública e scripts de geração próprios.

Depois implemente em dois lotes obrigatoriamente sequenciais:

1. **Atualizar o layout de Mage:** papel e tokens, fontes, moldura, cabeçalho,
   abas, divisor principal, divisores comuns, grid, estados especiais, mobile e
   offline.
2. **Atualizar o layout de impressão de Mage:** composição A4 pertencente a
   Mage, reutilizando apenas o mecanismo neutro de saída isolada e paginação.

Não inicie a impressão de Mage antes de concluir e validar seu novo layout. Essa
sequência evita transportar métricas provisórias para o PDF e previne o mesmo
descompasso entre uma prévia visual correta e o arquivo efetivamente salvo.
