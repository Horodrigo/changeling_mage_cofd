# Auditoria visual — Mage e Vampire em relação a Changeling

Data da inspeção: 23 de setembro de 2026.

Escopo: fichas interativas Mobile e Desktop. Changeling é a referência visual correta. A análise descreve como os elementos aparecem na tela, sem usar coordenadas absolutas.

## Referência: Changeling

Changeling apresenta uma folha única e coesa. A moldura botânica coincide com a borda externa; os rulers horizontais encontram os ornamentos dos cantos e os rulers verticais continuam a partir deles. O título ocupa o cabeçalho sem parecer solto, as abas formam uma faixa compacta dentro da folha e os títulos de seção unem texto e ornamentos em uma linha contínua. Campos e blocos têm ritmo vertical regular. Botões usam baixo contraste e formato compacto, enquanto os popups mantêm fundo claro de papel, borda discreta, tipografia serifada e ações visualmente subordinadas ao conteúdo.

## Diferenças encontradas

| Elemento | Mage em relação a Changeling | Vampire em relação a Changeling |
| --- | --- | --- |
| Rulers horizontais — Mobile | As duas linhas do topo e da base estavam mais para dentro que os rulers verticais. Os cantos pareciam ornamentos independentes, não terminações da moldura. A moldura inferior estava ligada a um seletor exclusivo do Desktop e não acompanhava corretamente o conteúdo Mobile. | O topo e a base conservavam o recuo do Desktop, enquanto os lados já usavam recuo Mobile. O resultado era uma moldura quebrada: horizontais curtos e verticais próximos da borda. |
| Rulers verticais — Mobile | Os lados chegavam mais perto da borda que os horizontais e criavam uma segunda moldura interna por causa do `outline`. | Os lados estavam bem próximos da borda, mas começavam abaixo dos cantos em uma distância herdada do Desktop, deixando uma quebra visível entre espinhos e rails. |
| Rulers — Desktop | Os quatro rails formavam uma moldura interna, separada da extremidade da folha. O `outline` reforçava o efeito de moldura duplicada. Os ornamentos inferiores dependiam da classe Desktop das abas. | Já apresentava bom encaixe entre borda, espinhos, rulers e cantos. Foi preservado. |
| Borda da folha | Não havia borda externa real; havia um `outline` deslocado para dentro. | Borda externa reta, coerente com Changeling, embora mais escura e temática. |
| Título — Mobile | A marca era alta demais para o cabeçalho compacto e deixava uma faixa vazia ampla antes das abas. | O título se comportava bem, mas a moldura superior desalinhada fazia o cabeçalho parecer separado dos lados. |
| Título — Desktop | A marca e o subtítulo estavam corretos, mas pareciam flutuar dentro da moldura interna. | Já estava visualmente resolvido e foi preservado. |
| Espaçamento — Mobile | Excesso de respiro no topo e na base por causa dos offsets da moldura Desktop; abas largas ocultavam parte da navegação. | Abas largas demais faziam a última opção parecer cortada mesmo quando havia espaço útil na faixa. |
| Espaçamento — Desktop | Padding e `outline` criavam distância desigual entre a borda, os rails e o conteúdo. | Ritmo equivalente ao de Changeling, com variação temática apropriada. |
| Botões da ficha | Paleta azul coerente, mas alguns controles mantinham o aspecto genérico arredondado da biblioteca. | Paleta vinho coerente; ações principais e secundárias não tinham contraste temático consistente nos popups. |
| Popups | Fundo e cores acompanhavam Mage, mas bordas arredondadas, tipografia e botões ainda pareciam um componente genérico sobre a ficha. | A caixa já tinha papel, borda reta e tipografia temática; faltava hierarquia cromática clara entre ação principal e fechamento. |

## Correções executadas

### 1. Mobile

- Mage: os rails horizontais e verticais agora compartilham o mesmo encaixe na borda; a borda externa substitui o `outline` interno; os quatro cantos usam o contêiner de abas comum, inclusive no Mobile; o ornamento central inferior acompanha a página ativa; o cabeçalho e a marca ficaram mais compactos; as abas usam texto e padding menores.
- Vampire: os offsets Mobile agora cobrem topo, base, início dos rails verticais, centros e terminais; os cantos foram redimensionados para fechar os lados; as abas usam melhor a faixa e continuam acessíveis por rolagem horizontal nos viewports estreitos.
- Popups: Mage e Vampire receberam borda reta, papel e tipografia da própria linha, além de contraste explícito entre ação principal e ação secundária.

### 2. Desktop

- Mage: a moldura passa a coincidir com a borda externa da folha; os cantos superiores e inferiores são ancorados no contêiner compartilhado de abas; o ornamento inferior fica no final real da página ativa; o título permanece dentro da moldura sem a antiga borda duplicada.
- Vampire: nenhuma mudança estrutural no Desktop, pois a composição já estava correta. As únicas mudanças globais são a hierarquia cromática dos botões em popups.

## Verificação visual

- Mobile: verificados em viewport estreito de 390 px o cabeçalho, a moldura superior, os rails laterais, a moldura inferior e a faixa de abas; os popups de experiência também foram verificados em Mage e Vampire.
- Desktop: verificados topo e fim da folha de Mage; Vampire foi comparado e preservado.
- Changeling permaneceu como referência, sem alteração.
- Nenhum asset novo foi necessário; as correções reutilizam somente os assets existentes de cada linha.

## Plano executado

1. Inspecionar as três linhas no mesmo viewport Mobile e comparar com Changeling. — Concluído.
2. Corrigir rulers, borda, título, abas, botões e popups de Mage/Vampire no Mobile. — Concluído.
3. Repetir a inspeção em Desktop; corrigir Mage e preservar Vampire. — Concluído.
4. Recompilar, executar testes e confirmar que não houve regressão estrutural. — Concluído.

## Gates executados

- `npm run lint`: concluído sem erros; permaneceram três avisos preexistentes de i18n em `game-lines/changeling/contract-homebrew-editor.tsx`.
- `npm run build`: concluído.
- `node --test --test-concurrency=1 tests/*.test.mjs`: 231 testes aprovados.
- `npx tsc --noEmit`: concluído.
- `git diff --check`: concluído.
