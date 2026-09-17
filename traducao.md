# Auditoria de traduções

## Escopo e critério

Esta auditoria considera texto apresentado ao jogador — conteúdo de JSX, rótulos, `aria-label`, `placeholder`, mensagens de validação, notificações, diálogos e texto produzido para a ficha/impressão. Identificadores persistidos, nomes provenientes de catálogos e mensagens exclusivamente internas de desenvolvimento não são classificados como texto de interface, salvo quando a aplicação os exibe diretamente.

Classificações usadas:

- **A — centralizado por chave:** `t("chave")`, consultando `messages` em `lib/i18n.tsx`.
- **B — hardcoded:** literal exibido sem seleção de locale.
- **C — abordagem local/mista:** `tr("pt", "en")`, condicional por `locale`, dicionário local, ou interpolação/concatenação que combina texto localizado e literal.

## Discrepâncias encontradas durante o levantamento

| Arquivo:linha | Trecho relevante | Abordagem | Divergência |
| --- | --- | --- | --- |
| `lib/i18n.tsx:8-12` | `const messages = { ... };` e `t:(key:MessageKey)` | A | É o único catálogo central de mensagens, mas cobre só uma pequena parcela da interface. Portanto não é a fonte única de textos de produto. |
| `app/workspace.tsx:250` | `titleKey ? t(titleKey) : "Characters of the Darkness"` | C (A + B) | O título usa chave quando existe, mas recorre a inglês hardcoded no mesmo ponto. O fallback não pode ser localizado pelo catálogo. |
| `game-lines/vampire/sheet-view.tsx:83` | `label={tr("Clã", "Clan")}` | C (`tr` inline) | A tradução fica acoplada ao componente, em vez de ter uma chave estável no catálogo central. O mesmo padrão aparece em muitos componentes. |
| `game-lines/vampire/sheet-view.tsx:82` | `label="Mask"` | B | Rótulo exibido somente em inglês, sem depender do locale, ao lado de campos traduzidos com `tr`. |
| `game-lines/vampire/sheet-view.tsx:213` | `locale === "pt-BR" ? "Outros Poderes" : "Other Powers"` | C (condicional inline) | Duplica a responsabilidade de tradução fora de `lib/i18n.tsx`; não fornece chave reutilizável ou verificável. |
| `app/workspace/workspace-i18n.ts:4-17` | `export const WORKSPACE_EN: Record<string,string> = {...}` | C (dicionário secundário por texto-fonte) | Cria um segundo catálogo, indexado pelo literal em português em vez de uma chave semântica. Ele concorre com `messages` e falha silenciosamente para termos ausentes. |
| `game-lines/mage/builder-eligibility.ts:22-35` | `locale === "en-US" ? \`...\` : \`...\`` | C (templates/condicionais inline) | Mensagens dinâmicas de validação ficam no módulo de regra, com gramática e interpolação duplicadas, em vez de uma API de mensagens parametrizadas central. |

O levantamento está confirmando que o uso dominante não é o catálogo central: há 1.312 chamadas de tr(...) em 40 arquivos, contra 15 chamadas de t(...) concentradas em um único arquivo.