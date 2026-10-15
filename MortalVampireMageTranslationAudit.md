# Auditoria de tradução — pendências

## Escolhas e regras faltantes

- **Lithopedia:** implementar a escolha do rito gratuito no primeiro ponto e dos ritos posteriores condicionados a Status na Bloodline (*Strange Shades* p. 28), em criação, Experience, ficha e estorno. Avisar o usuário antes de acrescentar esse subsistema; não inferir concessões em compras antigas.
- **Order Archive:** adequar a seleção de pontuação ao tipo de arquivo em *Signs of Sorcery* p. 97: arquivos de Ordens sem Nome, cultos e Legados têm máximo de três pontos; repositórios antigos de ruínas ou coleções recuperadas não têm máximo, mas somente recursos classificados como *Caucus Assets* existem neles. A redação anterior da auditoria invertia essa última regra. O catálogo atual oferece 1–5 para todos e a configuração não registra o tipo de arquivo.
- **Rapidity:** a fonte original confirma os preços e restringe alvos que exigem mais de uma palavra ou ações físicas complexas, com avaliação individual pelo Storyteller. O filtro de compra atual verifica ação instantânea e preço, mas não consegue identificar esses procedimentos pelo catálogo. Definir e aplicar uma restrição explícita aos alvos incompatíveis sem inferir pelo nome ou pelo texto traduzido.

## Verificação final

- Fazer a conferência manual de criação, edição, importação, exportação, reabertura e troca EN/PT nas cinco linhas. Novos JSONs devem usar identidades canônicas em inglês; texto escrito pelo usuário permanece como foi escrito. Preservar IDs, compras, Experience e estornos nas mudanças desta auditoria. Os 50 testes automatizados de persistência e Experience passaram em 15/10/2026; eles não substituem essa conferência das telas.
- Não criar migração nem testes de regressão para fichas antigas com valores de catálogo em português: ainda não há usuários da aplicação.
