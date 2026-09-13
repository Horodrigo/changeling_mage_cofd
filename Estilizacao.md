# Estilização de Changeling

Este documento descreve o esforço estimado para aproximar a interface de Changeling da estética da prévia botânica apresentada. As estimativas são relativas e consideram uma implementação cuidadosa, responsiva e compatível com os dois idiomas atuais. Não incluem novas ilustrações extensas nem revisão editorial de todo o conteúdo.

## 1. Fonte estilizada para Changeling

### Escopo

Criar uma fonte serifada decorativa própria para Changeling, contendo:

- letras maiúsculas de A a Z;
- letras minúsculas de a a z;
- números de 0 a 9;
- pontuação padrão.
- versões acentuadas usando agudo (`´`), circunflexo (`^`), grave (`` ` ``), trema (`¨`) e til (`~`);
- suporte às letras acentuadas necessárias para português e inglês;
- nenhuma exigência inicial para símbolos adicionais.

O ideal é criar os acentos como marcas combináveis, com posicionamento por âncoras. Isso reduz a quantidade de desenhos independentes e facilita a manutenção. Ainda assim, será necessário testar caracteres pré-compostos como `á`, `ã`, `ê`, `ç` e suas versões maiúsculas para garantir compatibilidade em navegadores e ferramentas de exportação.

### Esforço

**Alto.** A imagem de referência é rasterizada e não contém um alfabeto completo. Não seria suficiente aplicar OCR ou vetorizar automaticamente as poucas letras disponíveis: cada glifo precisaria ser redesenhado ou corrigido para manter consistência de espessura, serifas, curvas, altura e proporção.

O trabalho inclui:

1. definir a anatomia das letras e as regras visuais da família;
2. desenhar as 52 letras-base;
3. desenhar ou configurar as marcas de acento;
4. ajustar largura, espaçamento lateral e altura de cada glifo;
5. revisar pares problemáticos, especialmente quando letras acentuadas aparecem juntas;
6. gerar e testar o arquivo `.otf` ou `.woff2` em tamanhos diferentes;
7. integrar a fonte com `@font-face` e definir uma fonte de fallback.

Uma primeira versão visualmente consistente pode ser feita com as letras-base e os acentos mais usados. Uma versão tipograficamente refinada exigirá várias rodadas de revisão. A complexidade aumenta bastante se a fonte precisar funcionar como uma família completa, com pesos diferentes, itálico ou ampla cobertura Unicode.

### Observações

As vinhas e folhas não devem fazer parte dos glifos. Elas devem continuar sendo uma camada visual separada, pois incorporá-las às letras prejudicaria legibilidade, espaçamento e adaptação a diferentes palavras.

## 2. Textura de fundo com degradê verde nas bordas

### Escopo

Substituir ou complementar a textura atual do fundo pela textura de papel da imagem de referência, preservando o degradê verde nas bordas que já existe.

### Esforço

**Baixo a médio.** O trabalho principal é preparar a textura como um asset leve e combiná-la com o degradê existente usando camadas de CSS.

Uma solução provável seria:

- textura de papel em WebP ou outra imagem otimizada;
- textura aplicada como camada de fundo;
- degradê verde mantido em uma camada separada acima ou abaixo;
- fallback de cor sólida para carregamento lento, impressão ou falha do asset;
- testes em telas largas, móveis e diferentes níveis de zoom.

O risco principal é a textura ficar forte demais atrás de textos e controles. Será necessário ajustar escala, repetição, opacidade e contraste sem perder a aparência de papel.

## 3. Divisores atuais com estilo esverdeado

### Escopo

Converter as linhas horizontais simples usadas atualmente como divisores para uma versão fina, verde e coerente com a moldura botânica.

### Esforço

**Baixo.** Se os divisores continuarem sendo linhas simples, a alteração pode ser feita principalmente com CSS:

- nova cor derivada da paleta verde de Changeling;
- espessura e opacidade ajustadas;
- eventual textura ou dupla linha discreta;
- preservação do contraste sobre o fundo texturizado.

Essa etapa não exige uma fonte nova nem uma imagem complexa. O cuidado principal é não aplicar o tratamento aos divisores de Mage, que devem manter a identidade visual própria da linha.

## 4. Divisores de categoria com ornamentação no início e no fim

### Escopo

Substituir o divisor de categoria atual por uma composição parecida com a linha da seção `SOCIAL`: uma linha esverdeada com ornamentos nas duas extremidades, dimensionada de acordo com o título da categoria.

### Esforço

**Médio a alto.** O desafio não é desenhar uma linha estática, mas fazê-la funcionar com títulos de tamanhos diferentes, idiomas diferentes e diferentes larguras de tela.

É necessário decidir entre:

- **CSS com pseudo-elementos:** adequado para linhas, folhas simples e ornamentos pequenos;
- **SVG responsivo:** oferece melhor controle geométrico e permite preservar proporções com `viewBox`;
- **asset raster com regiões preservadas:** possível, mas exige cuidado para não distorcer as extremidades ao alongar o centro.

A implementação precisa calcular ou acomodar:

- largura disponível antes e depois do título;
- títulos curtos e longos;
- quebra ou redução tipográfica em telas estreitas;
- alinhamento vertical do ornamento com a linha;
- estados de acessibilidade, sem transformar o ornamento em conteúdo semântico.

O melhor caminho tende a ser um ornamento SVG ou CSS dividido em extremidades fixas e centro elástico. Assim, as folhas das pontas mantêm a proporção enquanto somente o trecho linear se expande.

## Ordem recomendada

1. Ajustar textura e degradê do fundo.
2. Converter os divisores simples para a paleta verde.
3. Implementar os divisores ornamentados de categoria.
4. Criar e integrar a fonte estilizada.

A fonte deve ficar por último porque depende de uma decisão visual mais definitiva. Os três primeiros itens podem estabelecer a identidade de Changeling sem bloquear o uso de uma fonte serifada provisória.

## Resumo de esforço

| Item | Esforço relativo | Principal risco |
| --- | --- | --- |
| Fonte maiúscula, minúscula e acentuada | Alto | Consistência tipográfica e cobertura de caracteres |
| Textura de fundo com bordas verdes | Baixo a médio | Contraste, desempenho e excesso de textura |
| Divisores simples esverdeados | Baixo | Contraste e separação entre linhas de jogo |
| Divisores de categoria ornamentados | Médio a alto | Responsividade e preservação das proporções |

Nenhuma alteração de código ou asset é realizada por este documento; ele serve apenas como avaliação e planejamento visual.
