# Histórico da impressão dos temas de Changeling

## 15/10/2026 — cabeçalho e ornamentos

| Problema observado | Causa encontrada | Correção |
| --- | --- | --- |
| A arte do título Elemental saía pequena; Fairest e Wizened também perdiam a escala usada na tela. | As regras de impressão definiam somente largura e proporção, sem `scale`. | Reaplicadas as escalas de tela: Elemental 1,5, Fairest 1,4 e Wizened 1,1. A largura base de Elemental foi ajustada para a arte ampliada caber na página A4. |
| Ornamentos logo abaixo do título apareciam com outro asset, frequentemente o divisor de atributos/seção. | O cabeçalho impresso usava `section-divider` para todos os temas; a versão em tela usa `frame-side` em Elemental e Grimm e elementos laterais próprios em Beast, Darkling, Ogre e Wizened. Além disso, uma regra posterior de Elemental substituía o ornamento do cabeçalho por `section-divider`. | O cabeçalho passa a escolher o asset conforme o tema e a renderizar os dois ornamentos laterais onde a ficha em tela já os usa. A regra posterior de Elemental ficou restrita aos divisores de seção. Fairest mantém o divisor de seção da versão em tela. |
| Ajustes dos quatro ornamentos ao redor do centro da moldura não apareciam na impressão. | As regras da moldura impressa copiavam dimensões, mas não as translações/rotações de Elemental, Fairest e Ogre. | Aplicados à impressão os deslocamentos e rotações equivalentes aos da ficha desktop. Mantidos os ajustes manuais já existentes de Darkling e os de Wizened. Beast e Grimm não tinham ajustes adicionais de posição na ficha desktop. |
| `title p` ficava pequeno ou desalinhado em vários temas. | A impressão usava 6,5 pt e tinha posições específicas para apenas quatro dos sete temas. | Aumentado para 10 pt, equivalente aos 13 px da ficha desktop, e definidos deslocamentos para todos os temas. O `strong` continua invisível nos temas. |

Arquivos envolvidos: `game-lines/changeling/print-sheet.tsx`, `game-lines/changeling/styles/print-sheet.css` e `game-lines/changeling/styles/print-theme-sheet.css`. A correção vale para todas as páginas de impressão de Changeling que usam `PrintPage`, inclusive páginas adicionais de companion. O tema Default conserva o cabeçalho original.

Conferência visual pendente pelo usuário: prévia de impressão A4 dos sete temas (Beast, Darkling, Elemental, Fairest, Grimm, Ogre e Wizened), observando título, legenda e ornamentos nas páginas principal e adicionais. Registrar novos achados abaixo com data, causa e correção.

## 15/10/2026 — organização dos estilos de impressão

As regras gerais de impressão saíram de `sheet.css` para `styles/print-sheet.css`. As configurações específicas dos sete temas saíram para `styles/print-theme-sheet.css`, carregado depois das regras gerais por `app/layout.tsx` para preservar a disponibilidade anterior dos estilos. As regras da ficha exibida em tela permanecem em `sheet.css`.

## 15/10/2026 — organização por tema para ajuste manual

`print-theme-sheet.css` agora reúne as regras em sete blocos, um por tema. No início, `title p` recebeu `opacity: 0` para todos os temas; Default não foi alterado. Os blocos `AJUSTAR` expõem os valores atuais dos elementos relatados abaixo, sem corrigir suas posições ou proporções:

- Beast: ornamentos da moldura e linhas horizontais próximas.
- Darkling: ornamentos abaixo do título e linhas do cabeçalho.
- Elemental: divisores de atributos (`attributes-divider-leaf.webp` e `attributes-divider.webp`).
- Fairest: título, ornamentos da moldura e linhas próximas.
- Grimm: título.
- Ogre: título, ornamentos da moldura e linhas próximas.
- Wizened: ornamentos da moldura, linhas horizontais e verticais e textura de papel.

Esses pontos continuam pendentes de ajuste visual pelo usuário.
