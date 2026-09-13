export const ATTRIBUTES = {
  Mental: ["Inteligência", "Raciocínio", "Perseverança"],
  Físicos: ["Força", "Destreza", "Vigor"],
  Sociais: ["Presença", "Manipulação", "Compostura"],
} as const;

export const SKILLS = {
  Mentais: ["Erudição", "Computação", "Ofícios", "Investigação", "Medicina", "Ocultismo", "Política", "Ciência"],
  Físicas: ["Atletismo", "Briga", "Condução", "Armas de Fogo", "Furto", "Armas Brancas", "Furtividade", "Sobrevivência"],
  Sociais: ["Empatia com Animais", "Empatia", "Expressão", "Intimidação", "Persuasão", "Socialização", "Manha", "Subterfúgio"],
} as const;

export function canIncreaseCreationDots(used:number,budget:number|undefined,current:number,maximum=5) {
  return budget !== undefined && used < budget && current < maximum;
}

