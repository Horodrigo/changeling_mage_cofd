# Auditoria de tradução — pendências

## Prioridade 1 — concluir as traduções

- Conferir a apresentação EN/PT das traduções concluídas em criação, Experience e fichas Desktop/Mobile antes de passar às mudanças de regras.

## Prioridade 2 — escolhas e regras faltantes

- **Intendants of the Building:** no terceiro Attainment, *Tome of the Pentacle* p. 163 exige Primórdio 3 e **Ocultismo 3 com Especialização em Geomancia OU Furto 3**. O texto do catálogo agora informa a alternativa, mas a validação estruturada ainda aceita Ocultismo 3 sem a Especialização. Corrigir no avaliador de Legacy sem alterar IDs ou compras.
- **House of Ariadne:** a validação dos Attainments 3 e 5 conta os pontos canônicos de Contacts/Status, mas ainda não confere se os grupos de Contacts e a organização de Status pertencem à cidade sintonizada nem se esta é uma organização de Adormecidos (*Tome of the Pentacle* p. 154). Completar a elegibilidade ao tratar as regras, sem depender do nome de exibição dos Merits.
- **Lithopedia:** implementar a escolha do rito gratuito no primeiro ponto e dos ritos posteriores condicionados a Status na Bloodline (*Strange Shades* p. 28), em criação, Experience, ficha e estorno. Avisar o usuário antes de acrescentar esse subsistema; não inferir concessões em compras antigas.
- **Order Archive:** adequar a seleção de pontuação ao tipo de arquivo em *Signs of Sorcery* p. 97 (página conferida visualmente): arquivos de Ordens sem Nome, cultos e Legados têm máximo de três pontos; repositórios antigos de ruínas ou coleções recuperadas não têm máximo e não oferecem *Caucus Assets*. O catálogo atual oferece 1–5 para todos e a configuração não registra o tipo de arquivo. (Pesquise na web a respeito e me informe melhor)
- **Hidden Devotions:** conferir na fonte original Rapidity e Slow and Steady, especialmente preço e adequação de alvos com procedimentos ou falas complexas.
- **BFFs, Violent Coercion e Manic Depression:** conferir na fonte original a resistência de alvos sobrenaturais de outras linhas; o índice local e o catálogo divergem entre Composure + Tolerance e Composure + Blood Potency.

## Verificação final

- Testar criação, edição, importação, exportação, reabertura e troca EN/PT nas cinco linhas. Novos JSONs devem usar identidades canônicas em inglês; texto escrito pelo usuário permanece como foi escrito. Preservar IDs, compras, Experience e estornos nas mudanças desta auditoria.
- Não criar migração nem testes de regressão para fichas antigas com valores de catálogo em português: ainda não há usuários da aplicação.
