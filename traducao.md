# Política de conteúdo bilíngue do Arquivo das Trevas

## Objetivo

O Arquivo das Trevas deve oferecer toda a interface e todo o conteúdo oficial em Inglês dos Estados Unidos (`en-US`) e Português do Brasil (`pt-BR`).

O Inglês é a base editorial e mecânica dos catálogos. Novas regras oficiais devem ser importadas primeiro em Inglês, conferidas contra as fontes e testadas. A tradução para Português ocorre depois, sem modificar a identidade do item nem sua mecânica.

Esse fluxo substitui o plano anterior de usar o catálogo português existente como base e preencher o Inglês por sobreposições parciais. O objetivo agora é eliminar gradualmente dados herdados inconsistentes, em vez de preservá-los por retrocompatibilidade. Enquanto não houver usuários, não há obrigação de migrar formatos antigos de catálogo ou fichas.

## Idiomas e comportamento da aplicação

- Os idiomas suportados são `en-US` e `pt-BR`.
- A escolha é geral para a aplicação e persiste no dispositivo.
- O seletor mostra a bandeira correspondente ao idioma ativo.
- Trocar o idioma altera interface e apresentação dos catálogos, mas nunca regras, escolhas, custos ou histórico de Experiência.
- Conteúdo oficial sem tradução portuguesa validada permanece disponível em Inglês. A aplicação não deve inventar traduções nem confundir texto ausente com texto traduzido.
- Nomes de livros e suplementos permanecem no idioma original.
- Conteúdo livre e homebrew é exibido como foi escrito e não é traduzido automaticamente.

## Modelo editorial: English-first

Cada entidade oficial deve ter um ID interno estável, independente do texto exibido. Inglês é o registro canônico; Português é uma apresentação localizada associada ao mesmo ID.

```ts
{
  id: "ctl:kith-and-kin:burning-ambition",
  sourceId: "kith-and-kin",
  page: 44,
  en: { name: "Burning Ambition", summary: "...", effect: "..." },
  "pt-BR": { name: "Ambição Ardente", summary: "...", effect: "..." }
}
```

A implementação física pode manter o Inglês no objeto principal e o Português em um catálogo ou overlay, desde que:

- um único ID represente o mesmo item nos dois idiomas;
- campos mecânicos equivalentes permaneçam associados;
- a ausência de tradução seja explícita e use Inglês como fallback;
- nomes exibidos nunca sejam usados como chave primária;
- seletores, histórico e fichas persistam IDs ou valores canônicos estáveis.

## Fontes e autoridade dos dados

### Índice offline do Codex of Darkness

A cópia offline do site é usada para enumerar os itens e obter nome original, livro, página, custo e Dice Pool dos Contratos. Ela funciona como índice de localização e conferência, não como autoridade final para textos extensos ou casos excepcionais.

### PDFs dos livros

Os PDFs definidos como fontes do projeto são a autoridade para Summary, Effect, Action, Duration, Options genuínas, resultados de rolagem, Loopholes, benefícios, pré-requisitos e exceções. Somente conteúdo pertencente a essas fontes entra no catálogo oficial.

Os livros normalmente usam duas colunas por página. A extração deve respeitar cada coluna separadamente e ser comparada visualmente ou contextualmente com a página original. É proibido importar texto bruto sem revisão: quebras de página, cabeçalhos, rodapés, sidebars e a coluna vizinha podem contaminar o resultado.

Não é necessário reproduzir toda a prosa do livro. O aplicativo deve trazer resumos fiéis dos efeitos mecânicos, preservando condições, modificadores, escolhas, limitações e consequências relevantes.

## Processo de reconstrução

Cada catálogo deve ser tratado em lotes pequenos e verificáveis, normalmente por livro e categoria.

1. Gerar a lista completa pelo índice offline.
2. Limitar a lista às fontes adotadas.
3. Comparar nomes, fontes e páginas com os PDFs.
4. Registrar discrepâncias antes da importação e consultar o usuário quando as fontes não permitirem conclusão segura.
5. Remover ou substituir registros herdados do escopo reconstruído, sem combinar silenciosamente texto antigo e novo.
6. Importar o conteúdo canônico integralmente em Inglês.
7. Validar quantidade, IDs, fontes, páginas e campos obrigatórios por testes.
8. Revisar a apresentação em Inglês.
9. Somente então criar e revisar a tradução portuguesa.
10. Validar Português sem alterar o registro canônico.

Uma categoria só está completa quando todos os itens de suas fontes foram conciliados e cada campo mecânico exigido foi conferido.

## Padrão de Contratos

### Com Dice Pool e resultados

1. Name e classificação (`Royal`, `Common` ou `Goblin`)
2. Regalia ou Court e Source
3. Summary
4. Dice Pool
5. Cost
6. Action / Duration
7. Options, somente quando genuínas e não repetidas
8. Success
9. Exceptional Success
10. Failure
11. Dramatic Failure
12. Loophole
13. Benefits

### Sem Dice Pool

1. Name e classificação
2. Regalia ou Court e Source
3. Summary
4. Cost
5. Action / Duration
6. Options, somente quando genuínas e não repetidas
7. Effect
8. Loophole
9. Benefits

### Regras de preenchimento

- A existência de Dice Pool não garante os quatro resultados tradicionais. Exceções seguem o livro e devem ser consultadas quando ainda não houver decisão.
- `Wyrd Debt`, `Hidden Protocol` e `Autonomous Payload` são exceções conhecidas: possuem Dice Pool, mas somente `Effect`.
- Se Action ou Duration não estiver na regra, no resumo ou no efeito, usar `Instant` e `One scene`.
- `Options` aparece imediatamente após `Action / Duration`.
- Não criar `Options` quando a escolha já estiver integralmente em `Effect` ou `Success`.
- Loophole ausente após conferência é `None`; nunca se inventa texto.
- Benefícios externos ao livro básico preservam a fonte correta; benefícios adicionais conhecidos podem vir de *Book of Seemings*.
- Regalias são armazenadas por identidade canônica e exibidas no idioma ativo. `Maw` corresponde a `Garganta`.
- Custos usam `●` para Glamour e `○` para Willpower.
- Nome, custo e Dice Pool vêm do índice offline; os demais campos são confrontados com o PDF indicado.

`Summary` descreve brevemente o que o Contrato faz e suas condições gerais. Ele nunca deve receber o conteúdo de `Success` por conveniência. Resultados, efeitos e benefícios permanecem em campos próprios.

## Tradução para Português

A tradução começa somente após o lote inglês estar estruturalmente completo. Ela deve:

- traduzir sentido e mecânica, não construções literais pouco naturais;
- padronizar Atributos, Perícias, Condições, Regalias, Seemings e ações;
- preservar números, custos, penalidades, bônus, durações e gatilhos;
- manter os campos separados como no original;
- respeitar concordância, gênero e sujeito da regra;
- distinguir corretamente personagem, jogador, changeling e alvo;
- manter nomes de fontes no original;
- não duplicar Options dentro de Success ou Effect;
- passar por revisão editorial além dos testes estruturais.

Traduções anteriores só podem ser reaproveitadas depois de comparadas com o registro inglês reconstruído. Texto português existente não é evidência de completude ou correção.

## Interface e textos dinâmicos

Textos fixos podem ser resolvidos por chaves ou pares localizados, conforme a estrutura atual. Frases complexas não devem ser montadas concatenando palavras traduzidas.

Mensagens variáveis devem considerar singular, plural, ordem, concordância, números, pontuação e termos de regras no idioma ativo. A responsividade deve ser verificada nos dois idiomas.

Listas e filtros são ordenados pelo texto efetivamente exibido, exceto Atributos e Perícias quando a regra exigir uma ordem específica.

## Persistência e homebrew

- A preferência de idioma pertence à aplicação, não à ficha.
- Fichas e histórico não duplicam dados por idioma.
- Exportações priorizam IDs e valores canônicos.
- Trocar idioma nunca recalcula nem altera uma ficha.
- Homebrews ficam separados da reconstrução oficial e não recebem tradução automática.
- Livros homebrew incluídos continuam sujeitos aos toggles geral e individual, sem entrar na auditoria dos livros oficiais.

## Validação obrigatória

Cada lote deve verificar:

- contagem por livro e categoria;
- IDs únicos e estáveis;
- fonte e página válidas;
- campos obrigatórios;
- estrutura correta de Contratos rolados e automáticos;
- exceções conhecidas;
- Loopholes e Benefits;
- ausência de dependência acidental de overlays antigos;
- alternância de idioma sem mudança de identidade;
- ordenação, busca e filtros nos dois idiomas.

Testes estruturais não substituem a conferência editorial com o PDF. Ambos são necessários.

## Ordem de trabalho atual

1. Reconstruir integralmente os Contratos oficiais de Changeling em Inglês.
2. Conciliar discrepâncias com o usuário.
3. Validar catálogo e interface inglesa.
4. Traduzir os Contratos revisados.
5. Aplicar o método a Frátrias, Méritos, Cortes e Seemings de Changeling.
6. Avançar depois para Mage e conteúdos gerais.

Até uma categoria terminar, uma publicação dessa branch é versão de teste e pode conter deliberadamente apenas os lotes auditados.

## Critério de conclusão

O suporte bilíngue estará completo quando toda a interface existir nos dois idiomas, todos os catálogos oficiais possuírem registro inglês auditado, todas as traduções portuguesas tiverem sido revisadas a partir dele, não houver campos híbridos e idioma, persistência, criação, Experiência, filtros, impressão e exportação funcionarem sem divergência mecânica.

Daqui em diante, funcionalidades e regras novas são implementadas primeiro em Inglês e recebem Português como etapa editorial posterior. Isso evita traduzir dados ainda instáveis e ter de reconstruir depois a língua original.
