# Plano: criação de Méritos Homebrew

Status: implementado como referência histórica. `AGENTS.md` e o código atual continuam sendo a autoridade arquitetural.

## Objetivo

Permitir criar, editar, ativar e excluir Méritos somente pela aba Homebrew de Core, Changeling, Mage e Vampire. A ficha e os fluxos de compra apenas consomem o catálogo resultante; eles não oferecem criação livre.

## Modelo

- Reutilizar `MeritDefinition`, com ID estável `homebrew:merit:<uuid>`, `sourceId` próprio da linha e persistência local separada das fichas.
- Guardar `ratings` como a lista exata de níveis permitidos, preservando intervalos descontínuos. Usar `unbounded` apenas quando o autor marcar explicitamente um Mérito sem limite.
- Guardar a categoria mecânica já existente em `category`. A categoria adicional `Homebrew` será derivada de `sourceId` por `homebrewCategoryKeys`, sem duplicar ou alterar a categoria original.
- Aplicar a mesma categoria adicional aos conteúdos já existentes cujos `sourceId` começam com `h-` ou `homebrew:`.
- Guardar uma única `description` para Méritos comuns. Para estilos ou Méritos expandidos, guardar `levels` somente nos ratings definidos, cada qual com nome e descrição próprios.
- Representar pré-requisitos selecionados de Atributos, Perícias e outros Méritos em `requirements`, usando apenas `trait`, `merit`, `all` e `any`. Manter o texto completo para apresentação em `prerequisites`; qualquer requisito fora desses três grupos será apenas descritivo e não bloqueará compras automaticamente.

## Editor e integração

1. Criar um formulário reutilizável com nome, ratings/limites, categoria existente, construtor de pré-requisitos, descrição e modo por rank.
2. Cada superfície Homebrew continua responsável por fornecer sua linha, categorias e catálogo de Méritos; o shell comum permanece apenas como navegação e carregamento lazy.
3. Normalizar todos os dados na fronteira de armazenamento, mesclar sem mutar snapshots estáticos e preservar nas fichas os dados já selecionados quando o item for desativado ou excluído.
4. Atualizar os seletores de criação e experiência para aceitar múltiplas chaves de filtro derivadas. Um Mérito Homebrew aparece no grupo de sua categoria original e também ao filtrar por `Homebrew`, sem ser duplicado na listagem.
5. Manter nomes e textos escritos pelo usuário sem tradução automática.

## Verificação

- Ratings descontínuos e limites sobrevivem ao round-trip local.
- Pré-requisitos estruturados bloqueiam apenas Atributos, Perícias e Méritos selecionados; texto narrativo não inventa regra.
- Estilos exibem apenas os benefícios dos ranks alcançados.
- Méritos antigos `h-*` e novos `homebrew:*` aparecem tanto na categoria original quanto no filtro Homebrew.
- Core e cada linha carregam somente seus próprios Méritos Homebrew; nenhuma linha importa a implementação de outra.
- Desativar ou excluir um item remove novas escolhas, sem apagar Méritos já persistidos em personagens.
