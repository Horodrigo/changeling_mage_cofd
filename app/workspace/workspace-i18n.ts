import type { Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";

export const WORKSPACE_EN:Record<string,string>={
  "Nome":"Name","Jogador":"Player","Crônica":"Chronicle","Conceito":"Concept","Agulha":"Needle","Fio":"Thread","Feição":"Seeming","Frátria":"Kith","Corte":"Court",
  "Vício":"Vice","Virtude":"Virtue","Nome das Sombras":"Shadow Name","Caminho":"Path","Ordem":"Order","Legado":"Legacy",
  "Resumo":"Summary","Principal":"Main","Atributos":"Attributes","Perícias":"Skills","Detalhes":"Details","Poderes":"Powers","Combate":"Combat","Companheiros":"Companions","Anotações":"Notes",
  "Experiência":"Experience","Feitiço":"Spell","Méritos":"Merits","Méritos Expandidos":"Expanded Merits","Aspirações":"Aspirations","Obsessões":"Obsessions","Fragilidades":"Frailties","Pedras de Contato":"Touchstones","Lucidez":"Clarity","Condições":"Conditions","Nimbus":"Nimbus","Sabedoria":"Wisdom","Feitiços Ativos":"Active Spells",
  "Regalias Favorecidas":"Favored Regalia","Contratos":"Contracts","Débito Goblin":"Goblin Debt","Juramentos":"Oaths","Arcanos":"Arcana","Rotas":"Rotes","Práxis":"Praxes","Attainments":"Attainments","Ferramentas Mágicas":"Magical Tools","Inclinação do Nimbus":"Nimbus Tilt","Itens Encantados":"Enchanted Items","Condições do Paradoxo":"Paradox Conditions",
  "Vitalidade":"Health","Força de Vontade":"Willpower","Características da Linha":"Line Traits","Outras Características":"Other Traits","Escolhas dos Méritos":"Merit Choices","Armadura":"Armor","Armas":"Weapons","Equipamentos":"Equipment","Veículos":"Vehicles",
  "Modificador":"Modifier","Tamanho":"Size","Durabilidade":"Durability","Estrutura":"Structure","Velocidade":"Speed","Iniciativa":"Initiative","Defesa":"Defense","Deslocamento":"Speed","Armadura geral":"General Armor","Armadura balística":"Ballistic Armor","Presença":"Presence","Manipulação":"Manipulation","Compostura":"Composure","Inteligência":"Intelligence","Raciocínio":"Wits","Perseverança":"Resolve","Força":"Strength","Destreza":"Dexterity","Vigor":"Stamina",
  "Bênção da Fratria":"Kith Blessing","Bênção da Feição":"Seeming Blessing","Maldição da Feição":"Seeming Curse","Benefícios da Corte":"Court Benefits","Perícias de Ordem":"Order Skills",
  "Contrato":"Contract","Benefício de Contrato":"Contract Benefit","Rota":"Rote","Todas":"All","Todos":"All",
  "Nenhum registro.":"No entries.","Nenhum Mérito selecionado":"No Merit selected","Nenhum Mérito Expandido adquirido.":"No Expanded Merit acquired.",
};
export const workspaceTerm=(value:string,locale:Locale)=>locale==="en-US"?(WORKSPACE_EN[value]??systemTerm(value,locale)):value;
