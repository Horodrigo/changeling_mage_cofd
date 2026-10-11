# Lodge de Werewolf: The Forsaken — plano de implementação

**Status:** plano de produto e arquitetura; não implementa ainda a aba nem altera as regras atuais de escopo de Werewolf.

## Objetivo

Adicionar uma aba **Lodge** à ficha de Werewolf que permita consultar Lodges publicadas, registrar que o personagem entrou ou saiu de uma Lodge e criar Lodges Homebrew. A experiência deve aproveitar os padrões das páginas de Bloodline, Entitlement e Legacy, mantendo conteúdo, regras, persistência e interface sob responsabilidade de `game-lines/werewolf/`.

O catálogo, a interface e os registros do personagem precisam funcionar em inglês e português brasileiro. IDs, escolhas e regras permanecem canônicos e não mudam com o idioma.

## Fontes verificadas

As fontes foram localizadas em `pdfSources/Werewolf/`. A extração foi usada para localizar o conteúdo; as páginas relevantes foram separadas por coluna e conferidas em imagens renderizadas, com a paginação impressa confirmada visualmente.

| Fonte | Páginas impressas | Uso no plano |
|---|---:|---|
| *Werewolf: The Forsaken*, 2ª edição | 51–53 | Conceito e exemplos de Lodge: Einherjar, Hundred Days, Hook Hand, Shield, Roman Ritual, Chronicle e Gargoyles. |
| *The Pack*, 2ª edição | 73–81 | Relação entre Lodge e sociedade Uratha, adesão, iniciação, totem, vínculos e benefícios. |
| *The Pack*, 2ª edição | 82–91 | Exemplos desenvolvidos: Garm, Thousand Steel Teeth, Screaming Moon, Temple of Apollo e Eaters of the Dead. |
| *Night Horrors: Shunned by the Moon*, 2ª edição | — | A busca pelo texto de Lodge não encontrou uma seção ou entrada específica pertinente ao catálogo planejado. |

O catálogo local do Codex of Darkness foi usado somente como índice. A autoridade para a redação e os campos das Lodges é o texto dos livros elegíveis de segunda edição. Não se deve preencher lacunas com material de primeira edição, *Werewolf: The Apocalypse* ou resumos do Codex.

### Regras confirmadas que orientam o desenho

- Uma Lodge é uma sociedade/culto ligado a uma finalidade de caça e a um espírito totem, e não é sinônimo de Pack ou Tribe.
- A adesão passa por encontrar um membro e pedir admissão; as provações, o período de aprendizagem e a aprovação dependem de cada Lodge. A iniciação envolve o encontro com o totem e estabelece o vínculo.
- O livro apresenta um totem de pelo menos Rank 2 e descreve efeitos do vínculo. Cada Lodge define sua própria Blessing, Aspiration, Ban, Sacred Hunt e eventuais recursos/acessos.
- A adesão pode ser perigosa e sair de uma Lodge não é trivial. Isso não autoriza a aplicação automática de uma penalidade universal ao remover o registro.
- Benefícios e acesso a Rites, Merits e outros recursos são próprios de cada Lodge. A página de Lodge não deve conceder compras, XP, Traits ou poderes automaticamente.
- Algumas descrições apresentam restrições explícitas de admissão; outras apenas dizem que certo grupo é o principal público ou recrutamento. Só as primeiras devem ser marcadas como requisito rígido. Preferências narrativas não viram bloqueios de regra.
- Nos trechos elegíveis consultados não foi identificada uma regra geral que limite todo personagem a uma única Lodge. Não codificar exclusividade global sem evidência adicional; incompatibilidades específicas devem ser tratadas pela fonte da Lodge e pela decisão da mesa.

As regras acima resumem o material para orientar o plano; não substituem os livros nem são texto de catálogo para copiar literalmente.

## Experiência proposta

### Aba Lodge

Criar uma superfície Werewolf própria, compartilhada conceitualmente entre Desktop e Mobile, que:

1. Mostre as Lodges nas quais o personagem já está registrado.
2. Permita procurar e consultar Lodges oficiais e Homebrew ativas, com descrição, fonte, possíveis restrições de ingresso, totem, vínculo, Blessing, Aspiration, Ban, Sacred Hunt e benefícios publicados quando disponíveis.
3. Permita iniciar o ingresso em uma Lodge existente. O jogador consulta os passos e requisitos apresentados, realiza a história com o Storyteller e só registra a adesão quando confirmar que a iniciação foi concluída.
4. Permita sair de uma Lodge após confirmação, explicando que a saída é um acontecimento narrativo importante.
5. Permita abrir a criação de uma Lodge Homebrew, salvá-la no inventário Homebrew de Werewolf e, em seguida, registrá-la como Lodge do personagem.

O fluxo de entrada pode apresentar, como orientação e não como uma máquina de regras, etapas como **encontrar um membro**, **passar pelas provações/aprendizagem** e **concluir a iniciação com o totem**. Não presumir uma rolagem, custo de XP, prazo, mérito ou resultado universal. A página registra a decisão; a mesa determina como a história se desenrola.

### Entrada, saída e consequências

- A ação de entrada deve exigir confirmação explícita do jogador após a admissão narrativa. Uma incompatibilidade com requisito impresso deve ser sinalizada; se a história tiver uma exceção aprovada pelo Storyteller, a UI não deve alterar silenciosamente o requisito publicado.
- O formulário pode guardar uma nota autoral sobre mentor, provação ou cerimônia. Essa nota não é traduzida nem interpretada como mecânica.
- Sair remove apenas a associação de membro daquela Lodge. Não apaga Merits, Rites, XP, histórico, dados Homebrew ou escolhas adquiridas, não reembolsa XP e não impõe automaticamente Ban Condition nem outra consequência.
- Blessing, Ban, Sacred Hunt e os efeitos do totem devem ficar consultáveis na página. A ficha não deve automatizar posse, dano, condições, alterações de Traits ou decisões narrativas nesta primeira entrega.
- A estrutura aceita mais de uma associação para não impor um limite não confirmado. A mesa continua responsável por aprovar a compatibilidade entre Lodges.

## Conteúdo, identidade e localização

### Catálogo oficial

Manter o conteúdo estático em arquivos próprios de Werewolf, por exemplo:

- `public/game-lines/werewolf/data/lodges.json`
- `public/game-lines/werewolf/data/lodges-pt.json`

O arquivo em inglês é a referência canônica. O arquivo português associa apresentação pelo mesmo ID; conteúdo sem tradução explícita recua para inglês. Seguir o padrão id-keyed já usado pelas referências de Werewolf, sem duplicar mecânicas nem guardar texto localizado como identidade.

Cada registro deve manter, conforme o material realmente publicado:

- ID estável, nome canônico, fonte e página;
- resumo e descrição;
- critérios de admissão, diferenciando restrições explícitas de tendências narrativas;
- totem e detalhes do vínculo, quando descritos;
- Blessing, Aspiration, Ban e Sacred Hunt;
- acesso a Merits, Rites ou outros recursos, referenciados por identidade canônica sempre que disponível;
- texto de apresentação em pt-BR correspondente ao registro pelo ID.

Campos mecânicos só entram quando a fonte os fornece. Flavor não deve ser convertido em requisito, efeito, benefício ou dado derivado. Entradas com apenas menção nominal devem ser identificadas como referências breves, não receber uma ficha mecânica inventada.

### Lodges Homebrew

Criar um inventário e editor **de propriedade de Werewolf**, integrado ao shell compartilhado de Homebrew e aos mecanismos existentes de preferências, ativação e transferência de dados:

- Campos para nome, apresentação, critérios, totem, vínculo, Blessing, Aspiration, Ban, Sacred Hunt e benefícios próprios.
- Texto em inglês canônico e campos de apresentação pt-BR que o autor queira fornecer. A aplicação não traduz automaticamente nomes, regras ou texto autoral; campos localizados ausentes usam o fallback estabelecido.
- Identificador estável e fonte Homebrew próprios. Ativar ou desativar conteúdo não muda o registro de membro já salvo no personagem.
- Importação, exportação, validação, edição e remoção permanecem na superfície Werewolf. Uma definição removida ou desativada não deve apagar do personagem um ID que não esteja disponível.
- Uma Lodge Homebrew não é apresentada como regra oficial e não herda automaticamente acesso, custos ou efeitos de outra Lodge com nome semelhante.

## Persistência e arquitetura

- Guardar associações dentro de `line_data` de Werewolf, como coleção de IDs canônicos de Lodge, com notas narrativas opcionais. Não acrescentar campos de Lodge ao modelo comum de Core.
- Preservar IDs desconhecidos durante normalização/importação; a ausência de uma definição no catálogo não autoriza descartá-los nem substituí-los por uma correspondência de nome.
- Expor o catálogo por um grupo lazy independente, por exemplo `werewolf-lodges`, solicitado apenas pelas superfícies Werewolf que precisam dele.
- Acrescentar a aba e a renderização à composição Werewolf existente, com configurações de layout Desktop e Mobile próprias. Não recriar regras ou mecânicas no shell compartilhado.
- O editor Homebrew e a página de consulta compartilham tipos e apresentação Werewolf, mas não alteram o catálogo estático nem criam um holder mutável global.
- A associação de Lodge registra pertencimento; a progressão de Merits, Rites, Facets e outras compras continua nos sistemas atuais e mantém suas transações/recibos.

## Fases sugeridas

1. **Inventário editorial:** reconciliar os oito exemplos do livro-base e os cinco de *The Pack* (Eaters of the Dead aparece em ambos), além dos registros breves e das restrições de admissão; confirmar IDs, fonte, paginação, campos e exceções contra os PDFs.
2. **Catálogo e tradução:** definir tipos, produzir os recursos EN/PT-BR e testar a paridade dos IDs e a integridade das referências.
3. **Persistência:** adicionar leitura/gravação line-owned de associações e notas, preservando dados desconhecidos no ciclo de importação, normalização e exportação.
4. **Consulta e adesão:** criar a aba e os fluxos de visualizar, registrar entrada e sair, usando conteúdo oficial e Homebrew ativo.
5. **Criação Homebrew:** integrar editor, inventário, ativação e transferência de Lodges à superfície de Homebrew de Werewolf.
6. **Acabamento e regressões:** revisar Desktop/Mobile e os dois idiomas; executar testes de arquitetura, catálogo lazy, validação, round-trip e comportamento de adesão/saída.

## Testes e critérios de aceite

- Cada Lodge publicada tem ID estável, fonte/página e conteúdo localizado correspondente; dados de regra ausentes não são inventados.
- Restrições rígidas e tendências de recrutamento têm comportamentos distintos na UI.
- Registrar, reabrir, exportar e importar um personagem preserva a associação e notas; uma definição indisponível não apaga o ID.
- Entrar ou sair não altera XP, Traits, dano, Merits, Rites, Facets, recursos ou recibos.
- Homebrews são ativáveis, editáveis, transferíveis e removíveis segundo os padrões da linha, sem alterar a fonte oficial ou o texto autoral.
- Trocar idioma só altera apresentação localizada, nunca IDs, elegibilidade, regras ou histórico.
- A aba funciona em Desktop e Mobile sem carregar catálogos de outras game lines.
- Testes devem explicitar quando validam regras de *Werewolf: The Forsaken* 2ª edição. A inspeção editorial dos PDFs complementa, mas não é substituída pelos testes.

**Fora deste plano:** implementar qualquer alteração automática de regras do totem, possessão, Ban Condition, Blessing, Sacred Hunt, gasto de XP ou acesso de compra; cadastrar material de primeira edição; modificar outras game lines; implementar superfícies de impressão/PDF.
