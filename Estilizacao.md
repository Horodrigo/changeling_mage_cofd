# Estilização de Changeling

Este documento define o trabalho necessário para aproximar a ficha de Changeling da direção visual entregue no pacote `changeling-stylization.zip`, tomando `design/visual-reference.png` como referência principal. A referência tem 1086 × 1448 pixels e representa a aba **Main** em inglês, em um estado específico de personagem.

O objetivo não é transformar o screenshot em uma imagem estática dentro do aplicativo. A ficha deve continuar funcional, selecionável, editável, responsiva, bilíngue e alimentada pelos dados reais do personagem.

## Conclusão da análise

A direção visual é viável. Com os assets fornecidos e restauração vetorial complementar, é realista alcançar:

| Superfície | Fidelidade visual realista | Observação |
| --- | --- | --- |
| Aba Main no tamanho da referência | 92–97% | Comparação direta é possível com um personagem-fixture e viewport de 1086 × 1448. |
| Aba Main em larguras desktop diferentes | 88–94% | Espaçamentos e comprimentos de linha precisam se adaptar ao conteúdo. |
| Português e inglês | 85–93% | Alguns títulos e valores têm comprimentos muito diferentes. |
| Mobile | 75–85% | A referência não mostra uma versão móvel; será uma adaptação da linguagem visual, não uma cópia. |
| Details, Combat e páginas opcionais | 80–90% de coerência com Main | Não há referência visual dessas páginas; fidelidade exata não é mensurável sem novos exemplos. |

Chegar a 100% em todos os estados não é uma meta realista: a referência é uma imagem rasterizada e estática, enquanto a ficha muda com idioma, número de Méritos, valores de Traits, Condições, Entitlements, companheiros e tamanho da tela. No viewport e no conteúdo exatos da referência, entretanto, uma reprodução muito próxima é tecnicamente possível.

## Estado da implementação

Primeira passagem implementada na branch `changeling-style`:

- referência visual preservada em `docs/visual-references/changeling-main.png`;
- Regular, Italic e Small Caps integradas como WOFF2, com fontes-base e OFL preservadas;
- pipelines reproduzíveis em `scripts/build-changeling-fonts.py` e `scripts/build-changeling-style-assets.py`;
- tokens e regras visuais isolados em `app/changeling-sheet.css` sob `.ctl-sheet`;
- fundo de papel aprovado ligeiramente aquecido, mantendo o degradê verde existente;
- moldura botânica responsiva, cabeçalho, abas, tipografia, grids, recursos e painéis aplicados à ficha Changeling;
- ornamentos SVG da primeira tentativa descartados após inspeção visual;
- cantos, estrela, título, divisores, regras verticais e nós de painel substituídos por WebP em alta resolução;
- textura orgânica fornecida aplicada à aba selecionada, com cobertura interna e separadores completos;
- divisor especial de Attributes implementado com terminais, medalhões laterais e ramos centrais sem deslocar o texto;
- PNGs-fonte preservados em `assets/changeling-style/source/`;
- assets incluídos no shell offline com atualização da versão do cache;
- primeiro smoke funcional da aba Main concluído em inglês.

A captura confirmou que a estratégia raster híbrida é mais fiel que a vetorização simplificada: folhas, estrelas e floreios permanecem raster; somente os trechos retos extensíveis são desenhados por CSS. Ainda faltam calibração nos demais viewports, português, Details, Combat, estados opcionais e a validação final completa.

## Escala de esforço usada

As estimativas consideram um desenvolvedor front-end familiarizado com o projeto, preservando toda a funcionalidade existente e validando as duas localidades.

| Classificação | Tempo aproximado |
| --- | --- |
| Baixo | 2–6 horas |
| Médio | 1–2 dias úteis |
| Alto | 3–5 dias úteis |
| Muito alto | Mais de 5 dias úteis ou participação de especialista visual/tipográfico |

As faixas não incluem uma fonte totalmente autoral desenhada glifo por glifo. Esse cenário é estimado separadamente.

## Auditoria do material recebido

### `design/visual-reference.png`

É a especificação visual mais completa e deve ser tratada como alvo de desktop para a aba Main. Ela define:

- papel marfim texturizado;
- tinta verde-escura com desgaste sutil;
- moldura botânica em todo o perímetro;
- cabeçalho ornamental com título, subtítulo e marca do sistema;
- abas retangulares, com Main preenchida em verde texturizado;
- grid principal em três colunas com separadores verticais discretos;
- títulos de seção centralizados entre linhas e folhas;
- tipografia regular, itálica e small caps com funções distintas;
- controles com aparência impressa, mas ainda claramente interativos;
- caixas de Line Traits e Beats and Experience com cantos ornamentais;
- caveira central usada como marca-d'água;
- baixa presença de branco puro, bordas arredondadas ou aparência de componentes genéricos.

### Fontes

O pacote inclui:

- `Changeling-Prototype-Regular` em TTF e WOFF2;
- `Changeling-Prototype-Italic` em TTF e WOFF2;
- `Changeling-Prototype-AIISC` em TTF e WOFF2;
- os arquivos-base `EBGaramond12-Regular.ttf`, `EBGaramond12-Italic.ttf` e `EBGaramond12-AllSC.ttf`.

As três fontes de protótipo cobrem A–Z, a–z, números e os caracteres acentuados necessários para português e inglês. Os metadados confirmam que são derivados de EB Garamond e apontam para a SIL Open Font License.

Problemas que precisam ser resolvidos antes da integração:

1. O pacote não contém o texto da licença. O arquivo oficial da licença e os avisos de copyright devem acompanhar qualquer redistribuição no repositório.
2. `AIISC` parece ser uma grafia incorreta de `AllSC`. O nome interno, o nome do arquivo e o uso em CSS precisam ser normalizados para evitar uma família opaca ou difícil de manter.
3. `web/changeling.css` declara apenas a variante Regular. Italic e All Small Caps ainda não estão disponíveis por `@font-face`.
4. `tools/build_font.py` só reproduz a variante Regular, embora o diretório `dist` contenha três variantes. A geração atual não é integralmente reproduzível.
5. O README afirma que os binários não estão incluídos, mas eles estão presentes no ZIP.
6. O README menciona `assets/ornament-divider.svg`, arquivo que não existe; o pacote contém três divisores com outros nomes.

Conclusão: as fontes são utilizáveis como **protótipo de produção**, mas o pipeline e a documentação precisam ser corrigidos antes de incorporá-las definitivamente.

### Textura de tinta

A primeira textura pontilhada foi descartada por apresentar pontos claros demais.
A aba selecionada agora usa a textura orgânica verde fornecida, convertida para
WebP de alta qualidade. O título `CHANGELING` deixou de depender de
`background-clip: text`: usa uma arte transparente própria, enquanto o mesmo
texto permanece no DOM para acessibilidade. Textos funcionais pequenos continuam
com cor sólida para preservar legibilidade, seleção, impressão e alto contraste.

### Divisores SVG recebidos

O pacote contém:

- `divider-component-top.svg`;
- `divider-component-bottom.svg`;
- `divider-section.svg`.

Eles são vetoriais, têm `viewBox` largo e usam a paleta `#173823`/`#e7eadf`. Servem como matéria-prima, mas não podem ser apenas esticados atrás dos títulos:

- `divider-section.svg` não reserva um espaço variável para o texto central;
- as folhas e flores deformariam se o SVG inteiro fosse redimensionado livremente;
- os títulos possuem comprimentos diferentes em português e inglês;
- os ornamentos presentes no screenshot são mais variados que os três assets fornecidos.

A tentativa inicial de redesenhá-los como SVG responsivos ficou excessivamente esquemática e foi rejeitada durante o smoke visual. A implementação passou a usar floreios raster transparentes de tamanho fixo, espelhados sem deformação, combinados com linhas elásticas em CSS.

### Recortes da moldura botânica

Também foram fornecidos recortes adicionais da própria referência:

- quatro cantos em versões normal e `*_transparent.png`;
- estrelas centrais superior e inferior;
- bordas verticais esquerda e direita.

Esses arquivos ajudam bastante porque preservam proporções, posição e desenho dos ornamentos. As versões transparentes têm canal alfa real, mas ainda não estão prontas para produção:

- os cantos medem aproximadamente 185 × 175 px no topo e 185 × 208 px embaixo;
- as estrelas medem 135 × 62 px e 135 × 73 px;
- as bordas verticais medem cerca de 45 × 1120 px;
- os cantos ainda contêm fragmentos do título, abas, campos, textos ou controles da captura original;
- as bordas verticais e as versões não transparentes ainda têm o papel incorporado;
- algumas bordas semitransparentes podem produzir halos sobre a textura atual;
- nenhum dos recortes fornece, isoladamente, os trechos horizontais completos.

Portanto, os recortes devem ser tratados como **fontes para restauração**, não como assets finais. Após comparar a primeira vetorização com a referência, adotou-se a alternativa raster: gerar e restaurar PNGs em resolução muito superior à de exibição, convertê-los para WebP lossless transparente e deixar apenas as linhas retas sob responsabilidade do CSS. Isso preservou melhor a riqueza orgânica das folhas sem esticar os ornamentos.

### Assets ainda ausentes ou incompletos

Mesmo com os novos recortes, será necessário reconstruir:

- segmentos horizontais elásticos entre cantos e estrelas;
- encontros limpos entre cantos e linhas;
- variações simplificadas da arte do título para viewports excepcionalmente estreitos, se a validação final indicar necessidade;
- pequenos nós ornamentais usados nos cantos dos painéis;
- algumas variações de folhas usadas nos títulos internos;
- versões simplificadas para tablet e mobile.

Recortar esses elementos diretamente do PNG sem restauração produziria halos, fundo incorporado e baixa qualidade em zoom.

## Restrições e decisões de arquitetura

1. Todas as regras novas devem ficar sob `.ctl-sheet` ou uma variante explicitamente Changeling. Mage não deve herdar fonte, textura de tinta, ornamentos, espaçamentos ou moldura.
2. Conteúdo e comportamento permanecem dinâmicos. Nenhum texto ou número da referência será codificado como imagem.
3. Ornamentos são decorativos: devem ser ignorados por leitores de tela, não podem interceptar cliques e não entram na ordem de foco.
4. A ficha precisa continuar operável por teclado e toque.
5. A moldura deve se adaptar à altura real do conteúdo; não pode depender de um PNG único com altura fixa.
6. A aparência desktop da referência não deve ser comprimida para mobile. Em telas estreitas, a ornamentação será simplificada e as colunas continuarão empilhadas.
7. A referência exige reintroduzir uma moldura ornamental na ficha de Changeling. Isso substitui, para Changeling, a regra atual que remove todas as bordas das fichas. Mage permanece sem essa moldura.

## Plano de trabalho

### 0. Fixar a referência e os critérios de comparação

**Esforço: médio — 0,5 a 1 dia.**

- Criar um fixture de personagem com os mesmos dados de `visual-reference.png`.
- Registrar captura-base no viewport de 1086 × 1448.
- Definir capturas adicionais em 1440 px, 1024 px, 768 px e 390 px de largura.
- Comparar sempre com fonte carregada, cache atualizado e zoom de 100%.
- Separar critérios de geometria, tipografia, cor, textura e comportamento.

Sem um fixture estável, pequenas diferenças nos dados parecem regressões visuais e tornam a calibração imprecisa.

**Fidelidade possível nesta etapa:** não altera o visual, mas torna a meta verificável.

### 1. Higienizar e importar os assets

**Status: primeira passagem implementada.**

**Esforço: médio — 1 a 2 dias.**

- Validar origem e licença da EB Garamond e adicionar o arquivo de licença correspondente.
- Manter apenas os formatos necessários em runtime, preferencialmente WOFF2.
- Decidir se TTF e fontes-base ficam em uma pasta de fontes-fonte, em tooling ou fora do bundle público.
- Renomear `AIISC` para uma identificação clara de All Small Caps, inclusive nos metadados internos.
- Tornar o script de build capaz de gerar Regular, Italic e All Small Caps de forma reproduzível.
- Corrigir o README do pacote antes de incorporá-lo ao projeto.
- Otimizar a textura de tinta e confirmar repetição sem emendas visíveis.
- Descartar os SVGs esquemáticos como arte final e manter a tinta raster alinhada aos tokens de Changeling.
- Restaurar ou gerar novamente os ornamentos da moldura removendo papel, texto, controles e halos.
- Preservar cópias-fonte dos recortes sem servi-las diretamente ao navegador.

**Fidelidade possível:** 100% dos materiais fornecidos preservados; os ornamentos restaurados ainda dependem de calibração no app.

### 2. Criar uma camada de estilo exclusiva de Changeling

**Status: implementado; calibração continua nas etapas posteriores.**

**Esforço: médio — 0,5 a 1 dia.**

- Extrair ou organizar as regras específicas hoje concentradas em `app/globals.css`.
- Criar tokens para tinta, papel, linhas, preenchimento ativo, desgaste, opacidade de marca-d'água e escala ornamental.
- Escopar todas as alterações por `.ctl-sheet`.
- Evitar alterar as primitivas compartilhadas de Mage sem uma variante explícita.
- Definir fallbacks quando fonte ou imagem ainda não tiverem carregado.

Tokens iniciais do pacote:

- tinta principal: `#173823`;
- papel de referência: `#f3efe2`;
- preenchimento claro dos ornamentos: `#e7eadf`.

Os valores finais devem ser calibrados contra a captura, não copiados cegamente, porque transparência e textura alteram a cor percebida.

**Fidelidade possível:** 95–100% da paleta no cenário de referência.

### 3. Consolidar o fundo de papel

**Status atual: implementado e aprovado visualmente.**

**Esforço restante: baixo — 2 a 4 horas.**

A ficha já usa `public/changeling-paper-texture.webp` sob o degradê verde existente. Restam apenas:

- recalibrar temperatura e contraste depois da inclusão da moldura e da nova tinta;
- verificar se a repetição continua invisível em fichas mais longas;
- criar regra de impressão com contraste controlado;
- confirmar que a textura nunca afeta Mage;
- manter o asset no shell offline e atualizar o versionamento quando necessário.

Não é recomendado substituir o fundo aprovado pelo fundo rasterizado da referência. O asset atual é leve, repetível e independente da resolução.

**Fidelidade possível:** 90–96% da sensação de papel, preservando desempenho e legibilidade.

### 4. Integrar e calibrar a tipografia

**Status: pipeline e aplicação inicial implementados; QA bilíngue e ajuste fino pendentes.**

**Esforço com o protótipo fornecido: alto — 2 a 4 dias.**

Trabalho necessário:

- declarar Regular, Italic e All Small Caps com `@font-face` correto;
- aplicar Regular a nomes de Traits e texto editorial da ficha;
- aplicar Italic a valores, placeholders, specialties e linhas editáveis;
- aplicar small caps a labels como Name, Player, Needle e aos subtítulos do cabeçalho;
- ajustar métricas, `font-size`, `line-height`, tracking e kerning por função;
- verificar todos os acentos em português, inclusive maiúsculas;
- prevenir salto de layout durante o carregamento da WOFF2;
- definir fallback serifado com métricas próximas;
- limitar a textura recortada à marca e aos títulos em que ela permanece legível;
- testar seleção de texto, copy/paste, placeholders, inputs e impressão.

O protótipo atual é uma EB Garamond levemente condensada, não uma família desenhada do zero. Ele chega perto da anatomia da referência, mas não reproduz todas as peculiaridades do lettering de `CHANGELING`.

**Fidelidade possível com o protótipo:** 88–94%.

**Alternativa de fonte autoral:** redesenhar A–Z, a–z, números, acentos e kerning. Esforço adicional de **15 a 30 dias de design tipográfico**, mais 2–4 dias de integração e QA. Fidelidade tipográfica estimada de 95–98%, ainda sujeita à interpretação de letras que não aparecem na referência.

### 5. Restaurar e modularizar a moldura botânica

**Status: primeira passagem raster implementada e aprovada como direção.**

**Esforço: alto — 2 a 4 dias.**

Os novos recortes reduzem o esforço em relação a redesenhar a moldura do zero, mas ainda exigem restauração. O trabalho deve resultar em:

- quatro cantos botânicos limpos e transparentes;
- segmentos horizontais e verticais elásticos;
- estrelas centrais superior e inferior;
- encontros discretos entre segmentos;
- conjunto vegetal do masthead separado do texto;
- variante simplificada para larguras pequenas.

Implementação adotada:

- usar os PNGs como guia de composição, proporção e posicionamento;
- gerar ou restaurar folhas, caules e estrelas como raster transparente em alta resolução;
- converter os resultados para WebP lossless e preservar os PNGs-fonte fora do bundle público;
- usar uma camada decorativa dentro de `CharacterPaperShell`, ativada apenas para `line="CtL"`;
- montar a moldura com elementos coordenados e linhas elásticas em CSS;
- aplicar `pointer-events: none` e `aria-hidden="true"`;
- nunca esticar folhas, flores ou estrelas; espelhar os cantos é permitido;
- vincular as laterais à altura real da ficha.

O script `scripts/build-changeling-style-assets.py` recorta transparência, remove o quadriculado acidental do divisor por extração da tinta verde e gera os assets públicos em dimensões adequadas para downscale.

**Fidelidade possível com os rasters em alta definição e linhas CSS:** 90–97%, dependendo principalmente da calibração de escala.

### 6. Recriar o cabeçalho e as abas

**Status: cabeçalho e abas implementados; calibração estética final delegada à comparação do usuário.**

**Esforço: médio — 1 a 2 dias.**

- Ajustar `CharacterPaperShell` para o alinhamento e as proporções do masthead.
- Integrar a arte transparente do título preservando o texto equivalente no DOM para acessibilidade.
- Reproduzir a linha superior, a posição de `THE LOST` e `CHRONICLES OF DARKNESS`.
- Transformar a lista de abas em segmentos visuais contínuos.
- Aplicar à aba ativa tinta verde texturizada, borda interna clara e foco acessível.
- Preservar abas opcionais, como Entitlement e Companions, sem quebrar a composição.
- Em mobile, manter rolagem horizontal e alvos de toque adequados, reduzindo apenas a ornamentação.

O screenshot mostra exatamente três abas. Como o aplicativo pode mostrar mais, a implementação deve aceitar quatro ou cinco itens sem assumir larguras fixas.

**Fidelidade possível com três abas:** 95–98%.

**Com abas opcionais:** 85–93%, mantendo a mesma linguagem em vez da mesma geometria.

### 7. Criar um sistema de divisores ornamentais

**Status: sistema raster híbrido implementado, incluindo variante dedicada de Attributes e regras verticais extraídas de tinta real.**

**Esforço: alto — 2 a 4 dias.**

São necessários pelo menos três níveis:

1. divisor estrutural longo do cabeçalho;
2. título de seção principal, como Attributes, Skills, Merits ou Health;
3. título de categoria, como Mental, Physical e Social.

O componente de título deve usar:

- uma região central de largura determinada pelo texto real;
- linhas flexíveis à esquerda e à direita;
- ornamentos terminais com tamanho fixo;
- variantes compactas quando o espaço for insuficiente;
- texto sempre selecionável e localizado;
- decoração fora da árvore de acessibilidade.

O floreio raster usa tamanho fixo e é recortado quando falta espaço; somente a linha CSS se expande. Não se alongam folhas junto com a linha.

Arquiteturalmente, `SheetHeading` deve receber uma variante visual ou detectar o contexto Changeling sem alterar o resultado de Mage.

**Fidelidade possível:** 92–97% em desktop e 80–90% em mobile.

### 8. Ajustar a geometria e a densidade da aba Main

**Esforço: alto — 2 a 4 dias.**

A estrutura atual já possui os blocos corretos e uma grid próxima da referência, mas requer calibração:

- identidade em três colunas, com labels small caps e valores itálicos;
- Attributes em três colunas equilibradas;
- corpo principal próximo da proporção atual `1.08 / 0.94 / 0.98`;
- separadores verticais entre Skills, centro e recursos;
- alinhamento consistente entre nomes, specialties e pontos;
- espaçamento vertical menor e ritmo tipográfico mais uniforme;
- bottom grid com Conditions, Aspirations e Notes em três colunas;
- altura natural: conteúdo adicional pode alongar a folha sem deformar a moldura;
- evitar cortes de nomes longos em português sempre que houver espaço disponível.

A referência é densa, mas a ficha real não deve depender de fonte ilegivelmente pequena para caber em uma altura fixa. Quando o conteúdo crescer, o layout cresce.

**Fidelidade possível no fixture de referência:** 93–98%.

**Com conteúdo arbitrário:** 85–93% mantendo hierarquia e proporções.

### 9. Padronizar Traits, pontos e linhas editáveis

**Esforço: médio — 1 a 2 dias.**

- Ajustar diâmetro, contorno e preenchimento dos pontos para a nova tinta.
- Calibrar Health, Clarity, Willpower, Wyrd, Glamour e Beats como uma família coerente.
- Manter áreas clicáveis maiores que o desenho aparente para acessibilidade.
- Tornar linhas de texto e inputs visualmente semelhantes à impressão da referência.
- Garantir que o stamp de Skill favorecida pelo Kith não desloque texto ou pontos.
- Preservar o tratamento distinto de Rote Skills de Mage.
- Testar valores acima de cinco pontos e quebras em múltiplas linhas quando previstas pelas regras.

**Fidelidade possível:** 95–98% no estado estático; 90–95% incluindo hover, foco e edição.

### 10. Reestilizar painéis e ações internas

**Esforço: alto — 2 a 4 dias.**

A referência reduz a aparência de UI genérica. É necessário revisar, dentro da ficha de Changeling:

- Line Traits;
- Beats and Experience;
- Purchase trait;
- Gain Clarity e Lose WP;
- Experience Expenses;
- Select Condition;
- Notes;
- cards e controles equivalentes nas outras abas.

Trabalho esperado:

- painéis com fundo quase transparente sobre o papel;
- bordas finas e pequenos nós ornamentais;
- botões compactos com recortes ou extremidades inspiradas no screenshot;
- estados de hover, foco, pressed e disabled inequívocos;
- tipografia funcional legível, mesmo quando o ornamento for reduzido;
- nenhuma mudança de lógica ou posição sem necessidade visual.

Os nós ornamentais dos painéis foram derivados da estrela central e exportados como WebP transparente.

**Fidelidade possível na Main:** 90–96%.

### 11. Integrar marcas-d'água e stamps existentes

**Esforço: baixo a médio — 0,5 a 1 dia.**

- Recalibrar escala, posição e opacidade da caveira após a mudança de tipografia e grid.
- Manter a caveira centralizada e sem interferir no contraste.
- Preservar o stamp botânico da Skill favorecida pelo Kith.
- Verificar sobreposição com linhas, especialidades e divisores verticais.
- Impedir que qualquer asset decorativo altere largura, alinhamento ou hit area dos controles.

**Fidelidade possível:** 95–100% para os assets já existentes.

### 12. Adaptar Details, Combat e páginas opcionais

**Esforço: alto — 2 a 4 dias.**

Não existe referência específica para essas páginas. O trabalho consiste em aplicar o mesmo sistema, sem tentar forçar a geometria da Main:

- masthead, moldura, fundo, fonte e abas compartilhados;
- divisores ornamentais nos títulos;
- cards de Contracts, Merits, Conditions, Tilts, Entitlements e companheiros com superfícies compatíveis;
- modais e seletores mantendo legibilidade e dimensões funcionais;
- grids próprios para o conteúdo de cada página;
- ausência total de vazamento visual para Mage.

Para superar 90% de fidelidade percebida nessas páginas, seriam necessárias referências próprias de Details, Combat e estados com conteúdo expandido.

### 13. Responsividade e mobile

**Esforço: alto — 2 a 4 dias.**

Estratégia recomendada:

- desktop largo: reprodução completa da referência;
- tablet: moldura completa com ornamentos menores e grids reduzidas quando couberem;
- mobile: cantos simplificados, linhas mais curtas, conteúdo empilhado e abas roláveis;
- nunca reduzir texto e alvos interativos abaixo dos limites de legibilidade e toque;
- testar títulos longos em português e strings de fallback;
- impedir scroll horizontal causado por SVGs, stamps e fontes.

Mobile deve parecer uma versão legítima da mesma ficha, não uma miniatura da folha desktop.

**Fidelidade possível:** 75–85% em relação à imagem desktop; 90% ou mais de coerência visual com uma referência móvel futura.

### 14. Acessibilidade, impressão, desempenho e offline

**Esforço: médio — 1 a 2 dias.**

- Confirmar contraste de texto pequeno sobre papel e tinta texturizada.
- Fornecer foco visível em todos os controles.
- Manter todos os assets decorativos fora da árvore semântica.
- Validar seleção e cópia de texto.
- Criar fallback sólido para `background-clip: text` e para imagens desabilitadas.
- Definir comportamento de impressão, inclusive opção de reduzir textura e remover sombras.
- Subsetar WOFF2 apenas se a cobertura necessária continuar garantida.
- Evitar carregar TTF no navegador quando WOFF2 for suficiente.
- Incluir novos assets no Service Worker e alterar a versão do cache.
- Verificar ausência de layout shift durante o carregamento da fonte.

### 15. Validação e regressão

**Esforço: médio a alto — 1,5 a 3 dias.**

- Build e lint pelos scripts normais.
- Suíte completa de testes.
- Smoke visual funcional em inglês e português.
- Capturas nos viewports definidos na etapa 0.
- Comparação por overlay com `visual-reference.png`.
- Testes com textos longos, muitos Méritos, Condições expandidas e abas opcionais.
- Verificação explícita de que Mage permanece visualmente inalterado.
- Teste offline após atualização do Service Worker.
- Revisão de teclado, foco e toque.

## Critérios de aceite

A estilização pode ser considerada concluída quando:

1. A captura desktop do fixture reproduzir a hierarquia, moldura, paleta, tipografia, densidade e ornamentos da referência sem discrepâncias dominantes.
2. Todo texto continuar sendo HTML selecionável e localizado.
3. A moldura acompanhar a altura do conteúdo sem esticar folhas ou flores.
4. Os títulos ornamentais aceitarem português e inglês sem colisões.
5. Inputs, dots, caixas e botões permanecerem claramente interativos.
6. Não houver overflow horizontal em 390, 768, 1024 e 1440 pixels.
7. A versão mobile preservar a identidade sem tentar manter as três colunas.
8. Mage não sofrer alterações visuais.
9. Fontes e assets tiverem licença, nomes e pipeline reproduzível documentados.
10. Build, lint e testes passarem, seguidos de smoke visual nos dois idiomas.

## Ordem recomendada de implementação

1. Referência reproduzível e auditoria de assets.
2. Tokens e isolamento do CSS de Changeling.
3. Pipeline tipográfico.
4. Sistema de divisores.
5. Moldura e masthead.
6. Geometria da Main.
7. Traits, recursos, painéis e ações.
8. Details, Combat e páginas opcionais.
9. Responsividade.
10. Acessibilidade, offline, testes e calibração final.

Essa ordem reduz retrabalho: layout e controles são calibrados somente depois que fonte, divisores e moldura já definem suas métricas reais.

## Estimativa consolidada

| Cenário | Esforço total | Fidelidade esperada |
| --- | --- | --- |
| Main desktop, usando fonte e materiais fornecidos, sem completar outras abas | 7–11 dias úteis | 90–96% no fixture de referência |
| Implementação completa, responsiva e bilíngue em toda a ficha de Changeling | 14–24 dias úteis | 88–95% na Main; 80–90% nas páginas sem referência |
| Implementação completa com fonte realmente autoral | 29–54 dias úteis combinados | 93–98% na Main, dependendo da revisão tipográfica |

Os recortes da moldura reduzem em aproximadamente um dia o cenário em que toda a ornamentação precisaria ser deduzida do screenshot, mas não eliminam a restauração. As maiores incertezas restantes são a decisão entre protótipo e fonte autoral e a falta de referências para outras páginas e mobile. O fundo de papel já aprovado e a estrutura funcional existente reduzem significativamente o risco geral.

## Recomendação final

Usar o pacote e os recortes adicionais como **kit de direção visual e fontes de restauração**, não como implementação pronta. A rota com melhor relação entre esforço e fidelidade é:

- preservar o fundo já aprovado;
- adotar e corrigir a família protótipo baseada em EB Garamond;
- usar ornamentos raster transparentes em alta definição e linhas extensíveis em CSS;
- criar componentes responsivos para moldura e divisores;
- calibrar primeiro a Main no fixture exato;
- depois propagar a linguagem visual às outras páginas.

Essa abordagem pode chegar muito perto de `visual-reference.png` sem sacrificar conteúdo dinâmico, tradução, acessibilidade ou manutenção futura.
