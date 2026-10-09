# Werewolf: distribuição Mobile

Implementado em 9 de outubro de 2026. Referência visual; `AGENTS.md` e o código são a autoridade de arquitetura.

Changeling separa o conteúdo Mobile por tarefa, usa a navegação compartilhada com gestos e marca a aba ativa com textura. Werewolf reutiliza esse mecanismo, com estilo próprio em `game-lines/werewolf/styles/mobile.css`: papel e ferrugem, sete abas visíveis em duas linhas, alvos de pelo menos 44px e rótulos que se adaptam à largura. Nenhuma regra ou estilo de Changeling é importado.

| Aba Mobile | Conteúdo |
| --- | --- |
| Resumo | Identidade, Beats and Experience, Aspirations |
| Traços | Atributos em Hishu, perícias e especialidades |
| Detalhes | Renown, Merits, Blood/Bone, Harmony e Conditions |
| Formas | Forma atual, características e regras expansíveis; Body of the Wolf |
| Poderes | Primal Urge, Essence, Gifts, Rites, Fetishes e Totem |
| Combate | Health, Willpower, características derivadas e equipamentos |
| Notas | Texto livre |

No Desktop, a nova aba Formas contém a comparação das cinco formas e Body of the Wolf. Details retém âncoras e poderes. Aspirations usa o slot compartilhado abaixo de Experience, somente em Werewolf; Harmony usa o slot central da linha, antes de Conditions.

A seleção de forma no Mobile continua alterando a forma atual, compartilhada com Health/Combat, através do mecanismo existente de preservação de dano. Trocar de aba não altera recursos ou personagem. Regras longas continuam em disclosures nativos.

Validação: 114 testes de Werewolf e arquitetura; TypeScript, build e lint dos arquivos alterados. Prévia com personagem sintético, Desktop 1280px e Mobile 320/390px, EN/PT; todas as abas, seleção de Gauru e sincronização com Combat. Impressão e suíte completa não foram repetidas.
