# Werewolf: tema e proposta de fontes

Análise de 9 de outubro de 2026. Este documento registra decisões visuais; `AGENTS.md` e o código atual continuam sendo a referência de arquitetura.

## Comparação com Changeling

As duas fichas usam `CharacterPaperShell` e `MainSheet`. Changeling acrescenta papel, marca d'água, moldura botânica, título ilustrado, abas texturizadas, divisórias e botão de Experiência ilustrado. Werewolf tinha apenas cores marrons, fundo plano, título textual e a imagem das formas.

O tema Werewolf acompanha essas categorias visuais sem copiar a botânica ou a geometria de Changeling: papel claro, tinta carvão/ferrugem, lua, garras e floresta. Os quatro cantos ficam ancorados na folha, com tamanho menor no Mobile; o fundo permanece discreto para preservar a leitura. O ornamento de título acompanha texto real e traduzível. Abas ativas mantêm rótulos claros, alvos de 44px e rolagem Mobile. Diálogos portados recebem a textura e paleta da linha. As decorações não capturam eventos nem entram na árvore de acessibilidade.

Mortal, Mage, Vampire e Werewolf recebem um WebP próprio no botão de compra de Experiência. O texto, a ação e as regras de compra permanecem os existentes. Changeling mantém seu ícone.

## Assets e geração

Gerados com a ferramenta integrada ImageGen, sem API/CLI adicional. Os arquivos finais ficam em `public/game-lines/<linha>/images/experience-purchase-icon.webp` para mortal, mage, vampire e werewolf. Os demais ficam em `public/game-lines/werewolf/images/`: `paper-texture.webp`, `tab-texture.webp`, `frame-corner.webp`, `section-divider.webp`, `title.webp` e `background-werewolf.webp`. A otimização para WebP preserva o canal alfa das ilustrações; as duas texturas são opacas. Não há fontes novas embutidas nas imagens.

Prompts enviados (transparência solicitada em todos, exceto as duas texturas):

- Mortal: “Create a single UI experience purchase icon for Chronicles of Darkness mortal character sheet. Small readable antique key with an eye-shaped bow, engraved ink illustration in slate blue #315e7a. Square composition, only one symbol, no text, no border, true transparent background. Restrained gothic urban mystery, crisp silhouette legible at 24px. Save output.”

Os nove prompts abaixo receberam o prefixo “Use case: stylized-concept. Production web UI asset.” e o sufixo “Isolated artwork, no mockup, no watermark.”:

- Mage: “One small symbolic engraved silver-blue #264e70 occult pentacle enclosing an open eye, crisp silhouette for a 24px experience purchase button. No text.”
- Vampire: “One small engraved burgundy #702b3c blood drop cradled by two sharp thorn tendrils, elegant gothic ink silhouette readable at 24px for experience purchase button. No text.”
- Werewolf / ícone: “One small rust-brown #713c31 crescent moon crossed by three claw slashes, rough woodcut ink silhouette readable at 24px for experience purchase button. No text.”
- Papel: “Uniform seamless pale warm bone paper texture, extremely subtle natural fibers and faint gray aging, flat evenly lit all over, light #faf7f0 palette for readable black text overlay. No objects, symbols, border, shadows or text.”
- Abas: “Seamless dark rusty umber #713c31 printed ink on rough paper texture, low contrast fine grain, uniform evenly lit all over for white navigation labels. No objects, text, border or symbols.”
- Moldura: “A single L-shaped top-left corner ornament for a Werewolf the Forsaken inspired character sheet, raw scratched charcoal and rust-brown ink #713c31 woodcut, angular claw-like strokes and a small crescent moon at the bend. Both arms extend equal length along top and left edges, open center completely transparent, restrained thin line work, no text, no rectangle, no other corners.”
- Divisória: “A single very wide thin horizontal decorative divider in rust brown #713c31 ink woodcut. Thin distressed straight line with angular claw-scratch terminals at both ends and a tiny diamond at center. Wide 3:1 canvas with plenty transparent space. No text or other objects.”
- Título: “Single horizontal ornamental emblem, silver moon disc held between two angular wolf silhouettes facing outward, rough dark charcoal and rust brown #713c31 woodcut ink, symmetrical, wide compact composition. This is a decorative header mark above a live text title for a Werewolf character sheet. Absolutely no letters or text.”
- Fundo: “Single atmospheric woodcut illustration of a dark pine forest beneath a full moon, wolf silhouette standing on a rocky ridge in foreground. Charcoal and muted rust-brown ink only, sparse etching with organic fading outer edges into true transparency. Intended as low-opacity watermark behind readable character sheet content. No text, no border.”

## Fontes: proposta, sem aplicação

Inspeção dos nomes internos, mapas de caracteres e amostras renderizadas dos arquivos locais. Cobertura PT significa os 26 caracteres acentuados testados, não uma auditoria de todos os idiomas.

| Linha / arquivo | Observação | Uso proposto |
| --- | --- | --- |
| Werewolf — `ArnovaITCTT.ttf` | ArnovaITC TT Regular; 124 KiB; traço caligráfico áspero; cobre os acentos testados. | Título e cabeçalhos de seção em tamanho confortável. Manter texto de regras, campos e números na fonte legível atual. |
| Mortal — `VTSMU___.TTF` | VTSmithUpright Regular; 168 KiB; máquina de escrever desgastada; cobre os acentos testados. | Cabeçalhos, nomes e pequenos rótulos com estética de dossiê. Evitar regras longas em tamanho pequeno. |
| Mortal — `youmurdererbb_reg.otf` | YouMurderer BB Regular; 418 KiB; escrita de horror; faltam 24 dos 26 acentos testados. | Apenas marca/título curto com caracteres previamente conferidos. Não usar em navegação ou rótulos traduzidos. |
| Mage — `Skrec___.ttf` | Skreech Caps; 56 KiB; capitais estreitas e ornamentais; faltam todos os 26 acentos testados. | Título decorativo fixo, se aprovado. Não serve como fonte geral dos títulos PT sem fallback visualmente irregular. |
| Mage — `Magean.ttf` | Magean Regular; 24 KiB; mapa de caracteres amplo, mas as letras são símbolos na amostra. | Somente sigilos decorativos, com `aria-hidden`; nunca nomes, regras, números ou controles. |
| Changeling — três `.woff2` | Changeling Sheet Regular/Italic e Small Caps; cobertura PT presente. Família já usada na ficha. | Manter regular para leitura, itálico para destaques e versaletes para hierarquia. Nenhuma nova conversão. |
| Vampire | Nenhum arquivo de fonte encontrado na pasta da linha. | Manter a tipografia atual até existir um arquivo a avaliar. |

### Conversão futura

TTF/OTF não precisam ser convertidos apenas para funcionar como webfonts. Recomendo distribuir WOFF2 ao implementá-los: o formato foi feito para reduzir transferência e manter descompressão rápida, inclusive no Mobile ([W3C](https://www.w3.org/news/2024/updated-w3c-recommendation-woff-file-format-2-0/)). Preservar os originais, carregar somente a família da linha ativa e usar `font-display: swap`. Não converter as fontes de Changeling novamente. Conversão não acrescenta glifos ausentes nem transforma os símbolos de Magean em letras.

Os metadados encontrados não bastam para confirmar a licença de distribuição web dos novos arquivos: Arnova registra `fsType=4`, Magean `8`, VTSmithUpright/Skreech `1` (bit reservado), YouMurderer `0` com referência ao site Blambot; os WOFF2 de Changeling incluem SIL OFL. O campo descreve permissões de incorporação e não substitui a licença do fornecedor ([especificação OpenType](https://learn.microsoft.com/en-us/typography/opentype/spec/os2)). Conferir a licença correspondente antes de publicar versões convertidas. Nenhuma fonte foi alterada, convertida ou aplicada nesta mudança.

## Verificação

- Lint sem erros; um aviso preexistente em `tests/conditions-tilts-audit.test.mjs`.
- TypeScript e build aprovados.
- 118 testes de assets, arquitetura, fundação e integração Werewolf aprovados. A primeira execução isolada encontrou erros de permissão ao ler React; a repetição fora do isolamento passou.
- Prévia com componentes reais, catálogos reais e personagem sintético em origem local separada: Desktop 1440px e Mobile 390px; inglês/português; Main/Resumo, Características, Detalhes, Combate, Anotações e diálogo de Experiência. Corrigidos o recorte da primeira aba Mobile, a distribuição Desktop e as cores genéricas de controles.
- Arquivos WebP conferidos quanto a dimensões e transparência. Os outros três novos ícones receberam verificação dos arquivos/referências; suas fichas completas não passaram por uma nova rodada de navegação.
- Sem mudança de regras, persistência, fontes ou superfícies de impressão. Não foi executada a suíte completa do repositório.
