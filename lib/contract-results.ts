export interface ContractResultDetail {
  action?: string;
  duration?: string;
  success?: string;
  exceptionalSuccess?: string;
  page?: number;
}
export const CONTRACT_RESULTS: Record<string, ContractResultDetail> = {
  "ctl-2ed:hostile-takeover": {
    action: "Instantânea",
    duration: "",
    success:
      "Ignora sistemas de segurança mundanos; portas se abrem automaticamente, e animais ou sentinelas hobgoblins não impedem a passagem. Estende o efeito a até Presença companheiros na linha de visão. Habitações sobrenaturais exigem Confronto de Vontades com o proprietário ou residente principal. Não funciona se esse personagem também conhecer Aquisição Hostil.",
    exceptionalSuccess: "",
    page: 128,
  },
  "ctl-2ed:mask-of-superiority": {
    action: "Instantânea",
    duration: "",
    success:
      "Quem vê o changeling acredita que ele possui Status na organização do alvo igual à Presença. Se afetar várias pessoas, todas o associam à mesma organização, definida pelo alvo principal. Agir de modo incompatível exige Presença + Subterfúgio, disputado por Raciocínio + Empatia, para manter o disfarce.",
    exceptionalSuccess:
      "Também é tratado como aliado confiável, como se possuísse Aliados igual à Presença. Só precisa do teste para manter o disfarce ao fazer algo realmente absurdo.",
    page: 128,
  },
  "ctl-2ed:paralyzing-presence": {
    action: "Disputada",
    duration: "",
    success:
      "O alvo sofre a Inclinação Insensato.",
    exceptionalSuccess: "O alvo também recebe a Condição Acovardado.",
    page: 129,
  },
  "ctl-2ed:summon-the-loyal-servant": {
    action: "Instantânea",
    duration: "",
    success:
      "Cria um servo de uma substância escolhida, com Poder 1, Finesse 3 e Resistência 1; usa traços derivados de um fantasma da Sebe. Tem apenas ferro como Fraqueza, não possui Influências nem Numina, e tem Tamanho 1–7. Recebe vantagens naturais do material, entende ordens simples e percebe ameaças. Dura uma cena ou até ser destruído.",
    exceptionalSuccess: "",
    page: 129,
  },
  "ctl-2ed:tumult": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Revela se o alvo possui Desorientado, Culpado, Perdido, Paranoico, Obsessão, Assustado, Estoico ou Retirado. Para cada sucesso além do primeiro, pode infligir uma dessas Condições ou definir um gatilho que adie sua aplicação.",
    exceptionalSuccess: "Inflige um efeito adicional.",
    page: 129,
  },
  "ctl-2ed:discreet-summons": {
    action: "Instantânea (objeto) ou Disputada (hobgoblin)",
    duration: "",
    success:
      "Retira de um recipiente pequeno um objeto de Tamanho 1 já visto ou manuseado; ele é básico, funcional e de Disponibilidade até 3. Alternativamente, convoca por uma porta um hobgoblin de Fado até 3, que executa uma tarefa.",
    exceptionalSuccess:
      "O objeto pode ter Tamanho e Disponibilidade até 5. O hobgoblin tenta cumprir a intenção da tarefa e alerta o changeling sobre perigos relevantes.",
    page: 130,
  },
  "ctl-2ed:mastermind-s-gambit": {
    action: "Instantânea",
    duration: "Um Capítulo",
    success:
      "Após pelo menos cinco minutos descrevendo um plano ou objetivo, cria um plano como equipamento com bônus +5. Dura até o fim do capítulo ou até o plano ter sucesso ou falhar definitivamente.",
    exceptionalSuccess: "",
    page: 130,
  },
  "ctl-2ed:pipes-of-the-beastcaller": {
    action: "Instantânea (disposto) ou Disputada (hostil)",
    duration: "",
    success:
      "Convoca todos os animais de uma espécie escolhida em um raio igual a Empatia com Animais em milhas. Eles entendem ordens verbais simples, transmitem as instruções aos mais distantes e retornam ao concluir a tarefa ou encontrar obstáculo insuperável. Animais hostis podem contestar o Contrato.",
    exceptionalSuccess:
      "Controla os animais por um dia e uma noite e pode emitir novas ordens ao falar com eles. Maus-tratos ou ordens impossíveis permitem novo teste de Perseverança + Autocontrole para contestar.",
    page: 131,
  },
  "ctl-2ed:the-royal-court": {
    action: "Instantânea",
    duration: "",
    success:
      "Impede que pessoas reunidas causem dano corporal umas às outras. Coerção sobrenatural para cometer violência provoca Confronto de Vontades. Não interrompe violência que já tenha começado.",
    exceptionalSuccess: "",
    page: 131,
  },
  "ctl-2ed:spinning-wheel": {
    action: "Prolongada (cada teste leva 10 minutos; sucessos necessários = maior entre Fado ou Perseverança do alvo)",
    duration: "Até o fim do mês lunar ou até o evento ocorrer",
    success:
      "Define para o alvo uma experiência razoavelmente provável e não excessivamente específica para ocorrer no próximo mês. Testes que conduzam ao evento recebem bônus igual aos sucessos da ativação; testes que o impeçam sofrem a mesma penalidade, máximo ±5. O Contrato determina apenas que o evento ocorra, não seu resultado. Pode manter até Fado ativações simultâneas.",
    exceptionalSuccess: "Pode definir uma ação que o alvo possa realizar quebrar o efeito; ao realizá-la, o Contrato termina imediatamente.",
    page: 132,
  },
  "ctl-2ed:blessing-of-perfection": {
    action: "Instantânea",
    duration: "Uma ação",
    success:
      "Em um objeto, substitui o bônus de equipamento pelo Fado do changeling. Em uma ação de Artesanato, Medicina ou Informática de outra pessoa, substitui a Habilidade usada pelo Fado do changeling.",
    exceptionalSuccess: "",
    page: 132,
  },
  "ctl-2ed:changing-fortunes": {
    action: "Instantânea",
    duration: "Uma ação",
    success:
      "Por sucesso obtido, adiciona ou subtrai 2 dados do próximo teste do alvo, ou aumenta/reduz em 1 seu limiar de sucesso excepcional. O limiar não pode ficar abaixo de 1 sucesso, e um Dado de Chance nunca gera sucesso excepcional. Pode afetar a si mesmo. Um mesmo alvo só pode ser afetado uma vez por capítulo.",
    exceptionalSuccess:
      "Em vez do próximo teste, pode vincular o efeito a um gatilho. Se o gatilho não ocorrer até o fim da cena, o efeito termina.",
    page: 132,
  },
  "ctl-2ed:light-shy": {
    action: "Instantânea",
    duration: "",
    success:
      "Torna-se imperceptível a todos os sentidos, mas ainda pode ser registrado por tecnologia. O efeito termina ao realizar uma ação agressiva ou causar dano ou efeito sobrenatural a alguém.",
    exceptionalSuccess: "",
    page: 133,
  },
  "ctl-2ed:murkblur": {
    action: "Disputada",
    duration: "Um turno",
    success:
      "O alvo sofre a Inclinação Cego em ambos os olhos.",
    exceptionalSuccess:
      "O alvo também sofre a Inclinação Surdo em ambos os ouvidos.",
    page: 133,
  },
  "ctl-2ed:trivial-reworking": {
    action: "Instantânea",
    duration: "",
    success:
      "Oculta na Máscara um item mundano de até Tamanho 3 e altera sua aparência. A forma básica não muda e todas as regras da Máscara continuam valendo.",
    exceptionalSuccess: "",
    page: 133,
  },
  "ctl-2ed:changeling-hours": {
    action: "Instantânea",
    duration: "Um capítulo",
    success:
      "Escolhe um efeito sobre um objeto. Rebobinar: repara 1 Estrutura por turno e repõe partes ausentes, até Artesanato pontos de Estrutura. Acelerar: causa 1 dano por turno ignorando Durabilidade, até Artesanato pontos de dano. Congelar: fixa o objeto no tempo e espaço, impedindo movimento e tornando-o imune a dano ou alterações.",
    exceptionalSuccess: "",
    page: 134,
  },
  "ctl-2ed:dance-of-the-toys": {
    action: "Instantânea",
    duration: "",
    success:
      "Anima um dispositivo para cumprir um comando simples. Para alterar sua ação, é preciso obter mais sucessos em Força + Perseverança do que os obtidos na ativação. O dispositivo não excede seu alcance normal de movimento. Se seu movimento puder causar dano, usa os sucessos da ativação como parada de dados de ataque. Afeta dispositivos visíveis a até Fado × 10 metros.",
    exceptionalSuccess:
      "Pode adquirir o dispositivo como Retentor •, tornando a animação permanente; caso contrário, termina após um capítulo.",
    page: 134,
  },
  "ctl-2ed:hidden-reality": {
    action: "Instantânea",
    duration: "",
    success:
      "Altera uma característica dos arredores, desde que ela plausivelmente pudesse sempre ter sido assim. A alteração não pode contradizer algo já observado por outra pessoa.",
    exceptionalSuccess: "",
    page: 134,
  },
  "ctl-2ed:stealing-the-solid-reflection": {
    action: "Instantânea",
    duration: "",
    success:
      "Retira de uma superfície reflexiva o reflexo sólido de um objeto que caiba através dela. O objeto é uma versão espelhada, sem propriedades sobrenaturais. Enquanto durar, nem o original nem a cópia possuem reflexo.",
    exceptionalSuccess:
      "O reflexo permanece sólido até o sol cruzar o horizonte.",
    page: 135,
  },
  "ctl-2ed:tatterdemalion-s-workshop": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Executa uma ação de improvisação de equipamento normalmente, mas qualquer equipamento mundano de até Tamanho 5 pode ser construído em um único turno, sem componentes ou ferramentas adequados. Reduz pela metade do Fado, arredondado para cima, a penalidade aplicada ao bônus ou benefício do equipamento. A construção deve parecer vagamente possível.",
    exceptionalSuccess: "",
    page: 135,
  },
  "ctl-2ed:glimpse-of-a-distant-mirror": {
    action: "Instantânea",
    duration: "",
    success:
      "Transforma uma superfície reflexiva em uma janela para outra superfície reflexiva que já tenha refletido o rosto do changeling. Qualquer pessoa pode ver através dela; a nitidez depende das superfícies.",
    exceptionalSuccess: "",
    page: 136,
  },
  "ctl-2ed:know-the-competition": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Após pelo menos 10 minutos jogando contra o alvo, descobre sua Virtude e Vício, ou Âncoras equivalentes, e uma Aspiração.",
    exceptionalSuccess: "Também descobre uma segunda Aspiração.",
    page: 136,
  },
  "ctl-2ed:portents-and-visions": {
    action: "Disputada (leva pelo menos 1 minuto)",
    duration: "Instantânea",
    success:
      "Escolhe passado ou futuro e deve ver o alvo; pode usar em si olhando para um espelho.",
    exceptionalSuccess: "Pode provocar no alvo uma emoção associada ao evento, concedendo uma Condição apropriada.",
    page: 137,
  },
  "ctl-2ed:read-lucidity": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Descobre os níveis máximo e atual de Lucidez do alvo em termos relativos e todas as Condições de Lucidez que ele possui.",
    exceptionalSuccess:
      "Também descobre as circunstâncias do dano de Lucidez mais recente.",
    page: 137,
  },
  "ctl-2ed:walls-have-ears": {
    action: "Instantânea",
    duration: "",
    success:
      "",
    exceptionalSuccess: "",
    page: 138,
  },
  "ctl-2ed:props-and-scenery": {
    action: "Instantânea",
    duration: "",
    success:
      "Transforma-se em objeto inanimado de Tamanho até o próprio, com os traços normais do tipo escolhido. Por sucesso na ativação, escolhe um benefício: +1 Durabilidade; mobilidade limitada; +1 ou -1 Tamanho; ou outro efeito aprovado pelo Narrador. Benefícios repetíveis podem ser escolhidos várias vezes.",
    exceptionalSuccess:
      "Pode comprar a forma permanentemente por 3 Experiências. Depois, pode assumi-la reflexivamente por 1 Glamour, ainda realizando o teste e contando como 1 sucesso; assim não pode usar a Brecha.",
    page: 138,
  },
  "ctl-2ed:reflections-of-the-past": {
    action: "Instantânea",
    duration: "",
    success:
      "Em uma superfície reflexiva, escolhe um momento ou evento e vê até uma cena como foi refletida originalmente. Custa 1 Glamour para até uma semana no passado, 2 para um mês, 3 para uma estação, 4 para um ano e 5 para uma década. Deve indicar ao menos a data e dia/noite, ou um evento cujos detalhes conheça. Outros também podem assistir.",
    exceptionalSuccess: "Pode observar além dos limites normais do reflexo e obter detalhes fora do ângulo originalmente refletido.",
    page: 138,
  },
  "ctl-2ed:riddle-kith": {
    action: "Instantânea ou Disputada",
    duration: "",
    success:
      "Altera o mien feérico do alvo para aparentar outro kith, sem conceder suas bênçãos. Características gerais e Seeming permanecem. Alvo involuntário pode contestar; impor a mudança também causa um ponto de ruptura com parada de 3 dados. Não pode copiar o mien de um changeling específico.",
    exceptionalSuccess:
      "Se o próprio changeling for o alvo, pode gastar 1 Força de Vontade para tornar a duração indefinida.",
    page: 139,
  },
  "ctl-2ed:skinmask": {
    action: "Instantânea",
    duration: "",
    success:
      "Copia a aparência externa de um alvo que já encontrou fisicamente; se o alvo for changeling, copia Máscara e mien. Imitar comportamento ainda exige testes Sociais. Se copiar alguém que represente como seria sua aparência humana atual, recupera 1 Força de Vontade.",
    exceptionalSuccess: "",
    page: 139,
  },
  "ctl-2ed:unravel-the-tapestry": {
    action: "Reflexiva",
    duration: "Instantânea",
    success:
      "Repete os últimos 10 segundos ou retorna ao topo da Iniciativa do turno anterior. Pode mudar as próprias ações; os demais repetem as ações originais, salvo quem usou poder semelhante. Se morrer e puder pagar o custo, ativa automaticamente; se sobreviver, recebe a Condição Assustado. A ativação automática só ocorre uma vez por história.",
    exceptionalSuccess: "Recebe 8-de-novo em todos os testes feitos durante o tempo repetido.",
    page: 140,
  },
  "ctl-2ed:cloak-of-night": {
    action: "Instantânea",
    duration: "",
    success:
      "Só pode ser ativado em iluminação que imponha penalidade à Percepção visual. Afeta até Destreza companheiros dispostos. Um único teste de Furtividade do changeling, com bônus igual à metade do Fado arredondada para cima, oculta todo o grupo enquanto ninguém chamar atenção. O grupo pode realizar ações baseadas em Furtividade reflexivamente uma vez por turno.",
    exceptionalSuccess: "",
    page: 140,
  },
  "ctl-2ed:fae-cunning": {
    action: "Reflexiva",
    duration: "",
    success:
      "Aplica Defesa contra ataques com armas de fogo e nunca perde Defesa por surpresa ou distração. Poder sobrenatural que negue Defesa exige Confronto de Vontades. Ao Esquivar com sucesso, pode redirecionar o ataque para outro alvo válido; ele acerta automaticamente com sucessos iguais à Presença.",
    exceptionalSuccess: "",
    page: 140,
  },
  "ctl-2ed:shared-burden": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Para cada 1 ponto de dano letal que inflige em si, cura 2 pontos de dano do alvo, primeiro contundente e depois letal. Não cura dano agravado. Dano autoinfligido por este Contrato não pode ser curado por magia.",
    exceptionalSuccess: "",
    page: 140,
  },
  "ctl-2ed:thorns-and-brambles": {
    action: "Instantânea",
    duration: "",
    success:
      "Cria sarças em raio igual ao Fado em metros, que acompanham o changeling fora da Sebe. Escolhe um efeito: Leechweed — quem se move acima de Velocidade 2 perde 1 Glamour por turno, até Fado por vítima; Briarpatch — quem falhar em Destreza + Atletismo reflexivo ao se mover recebe Imobilizado, e as sarças têm Durabilidade igual ao Fado; Field of Thorns — atacam quem tenta atravessar com parada igual ao Fado, arma perfurante +0L, no máximo uma vez por turno por personagem. Na Sebe, não acompanham o changeling e também o ameaçam.",
    exceptionalSuccess: "",
    page: 141,
  },
  "ctl-2ed:trapdoor-spider-s-trick": {
    action: "Instantânea",
    duration: "Uma cena; até o próximo nascer ou pôr do sol se gastar +1 Força de Vontade",
    success:
      "Ao atravessar uma abertura, cria uma ilusão visual que a faz parecer intransponível ou inexistente. Percepção sobrenatural pode atravessá-la visualmente mediante Confronto de Vontades.",
    exceptionalSuccess: "",
    page: 142,
  },
  "ctl-2ed:fortifying-presence": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Exige uma cena inteira de interação e o alvo não pode abrir mão da disputa. Cura 2 pontos de dano leve de Lucidez ou 1 ponto de dano grave; não remove Condições de Lucidez.",
    exceptionalSuccess:
      "Também se torna Touchstone temporário do alvo até depois do próximo ataque de Lucidez que ele sofrer.",
    page: 142,
  },
  "ctl-2ed:hedgewall": {
    action:
      "Prolongada (5 sucessos; cada teste representa 1 turno)",
    duration: "",
    success:
      "Cria uma fortificação de sarças com diâmetro de 10 metros por ponto de Fado. Concede cobertura substancial contra ataques à distância externos. Cada parede tem Durabilidade 3 e Tamanho 8 e impede passagem até ser removida; escalá-la sem proteção causa 1 dano letal por turno. O changeling define o layout, mas passagens devem comportar facilmente Tamanho 4.",
    exceptionalSuccess:
      "Adiciona gratuitamente um dos efeitos de Thorns and Brambles à fortificação.",
    page: 142,
  },
  "ctl-2ed:pure-clarity": {
    action: "Instantânea",
    duration: "",
    success:
      "Pode realizar uma ação nesta cena que normalmente causaria ponto de ruptura sem sofrê-lo. Termina após essa ação ou no fim da cena e só pode ser usado uma vez por cena. Pode ser ativado retroativamente para uma ação própria realizada na mesma cena.",
    exceptionalSuccess:
      "Recebe Armadura 2 contra o próximo ataque de Lucidez; permanece até ser usada mesmo após o Contrato terminar.",
    page: 143,
  },
  "ctl-2ed:vow-of-no-compromise": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Com toque e promessa verbal, reduz 1 ponto de dano agravado do alvo para letal e recebe a Condição Estoico. Pode usar em si.",
    exceptionalSuccess: "",
    page: 143,
  },
  "ctl-2ed:whispers-of-morning": {
    action: "Instantânea",
    duration: "",
    success:
      "Torna o corpo e tudo que carrega intangíveis e sem peso. Não pode tocar, atacar ou ser tocado/atacado fisicamente, salvo por magia, e atravessa barreiras físicas. Pode ver e interagir com criaturas e objetos feéricos incorpóreos, mas não com seres comuns em Crepúsculo.",
    exceptionalSuccess: "",
    page: 143,
  },
  "ctl-2ed:boon-of-the-scuttling-spider": {
    action: "Instantânea",
    duration: "",
    success:
      "Move-se normalmente por paredes, tetos, superfícies escorregadias ou outras superfícies sólidas capazes de sustentar seu peso. Mantém Velocidade normal e age sem impedimento.",
    exceptionalSuccess: "",
    page: 144,
  },
  "ctl-2ed:dreamsteps": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Ao tocar um alvo adormecido, entra no Bastião do sonhador pelo Portão de Marfim, em vez de entrar no próprio.",
    exceptionalSuccess:
      "O Bastião do alvo sofre -1 Fortificação até ele acordar.",
    page: 144,
  },
  "ctl-2ed:nevertread": {
    action: "Instantânea",
    duration: "",
    success:
      "Altera todas as próprias pegadas de uma maneira escolhida. Torna impossível rastreá-lo por meios mundanos; rastreamento sobrenatural exige Confronto de Vontades. Pegadas já alteradas permanecem assim após o término.",
    exceptionalSuccess: "",
    page: 144,
  },
  "ctl-2ed:pathfinder": {
    action: "Instantânea",
    duration: "",
    success:
      "Descobre instintivamente distância e direção até a característica geral da Sebe mais próxima do tipo escolhido, como Mercado Goblin, Recanto, frutos goblins ou entrada do Portão de Chifre. Não revela criaturas.",
    exceptionalSuccess: "",
    page: 144,
  },
  "ctl-2ed:seven-league-leap": {
    action: "Reflexiva",
    duration: "Um turno",
    success:
      "Ao realizar um teste de salto (Força + Atletismo), pode percorrer uma trajetória de até 10 metros por ponto de Fado.",
    exceptionalSuccess: "",
    page: 145,
  },
  "ctl-2ed:chrysalis": {
    action: "Instantânea",
    duration: "",
    success:
      "Ao adquirir o Contrato, escolhe dois animais já vistos, inclusive por representação fiel, de Tamanho 1–7. Ao ativar, assume uma dessas formas e copia Atributos Físicos, Tamanho, Velocidade, Vitalidade, sentidos mundanos e modos de locomoção. Pode comunicar-se com animais da espécie assumida. Formas míticas não concedem poderes sobrenaturais.",
    exceptionalSuccess: "",
    page: 145,
  },
  "ctl-2ed:flickering-hours": {
    action: "Instantânea",
    duration: "Até sair da Sebe",
    success:
      "Pode afetar quem viaja consigo, inclusive perseguidores próximos. Para cada alvo, reduz o fluxo do tempo à metade ou o dobra. Até o sol cruzar o horizonte, alvos acelerados também recebem Pés Ligeiros com pontos efetivos iguais ao Fado, máximo 3, e sempre têm a Vantagem em perseguições. Alvo involuntário pode escapar vencendo Perseverança + Fado contra Raciocínio + Ocultismo + Fado.",
    exceptionalSuccess: "",
    page: 146,
  },
  "ctl-2ed:leaping-toward-nightfall": {
    action: "Instantânea ou Disputada",
    duration: "Especial",
    success:
      "Envia um objeto de até Tamanho 10 ou personagem para o futuro. O alvo desaparece e reaparece no mesmo local após até um número de dias igual aos sucessos da ativação, conservando o momento; se o espaço estiver ocupado, aparece ao lado. Para o alvo, nenhum tempo passa. Seres sencientes podem contestar. Não pode encerrar o efeito antes do prazo.",
    exceptionalSuccess:
      "Também pode fazer o alvo reaparecer junto de alguém a quem o changeling deva uma dívida; escolhe a pessoa, não o local.",
    page: 146,
  },
  "ctl-2ed:mirror-walk": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Abre passagem por uma superfície reflexiva para outra que já tenha tocado. Entrada e saída devem ser grandes o suficiente para a parte do corpo que atravessa. Pode atravessar com companheiros de mãos dadas ou apenas alcançar e pegar um objeto do outro lado.",
    exceptionalSuccess:
      "Os espelhos permanecem portais durante a cena; com permissão do changeling, qualquer pessoa pode atravessar livremente em ambas as direções, sem dar as mãos.",
    page: 146,
  },
  "ctl-2ed:talon-and-wing": {
    action: "Instantânea",
    duration: "",
    success:
      "Por 1 Glamour por efeito, cumulativamente: recebe modo de locomoção animal e +10 Velocidade; recebe sentidos animais, +3 dados em Percepção e ignora penalidades de pouca luz/escuridão; ou recebe garras, tornando ataques desarmados de Briga +0L, ou agravados se já causavam letal.",
    exceptionalSuccess: "",
    page: 147,
  },
  "ctl-2ed:elemental-weapon": {
    action: "Instantânea",
    duration: "",
    success:
      "Transforma um elemento próximo em uma arma arcaica com traços normais. Distribui sucessos, máximo 3 por opção, para: +1 modificador de arma por sucesso; reduzir em 1 a penalidade de Iniciativa por sucesso; ou aumentar alcance em +20/40/80 por sucesso.",
    exceptionalSuccess: "Concede benefícios adicionais usando as mesmas opções.",
    page: 147,
  },
  "ctl-2ed:might-of-the-terrible-brute": {
    action: "Reflexiva",
    duration: "",
    success:
      "Sempre que vencer um teste disputado de agarrão, pode reduzir a Força do oponente em 1 e adicioná-la à própria. Alvo reduzido a Força 0 recebe Imobilizado e não consegue realizar ações Físicas efetivamente. O bônus de Força é limitado a +5, mas pode exceder o limite derivado de Fado.",
    exceptionalSuccess: "",
    page: 148,
  },
  "ctl-2ed:overpowering-dread": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Inflige a Condição Assustado no alvo.",
    exceptionalSuccess:
      "Na próxima vez que encontrar o alvo após o término, pode usar este Contrato contra ele sem custo de Glamour.",
    page: 148,
  },
  "ctl-2ed:primal-glory": {
    action: "Instantânea",
    duration: "",
    success:
      "Escolhe um elemento tocado. Fica imune a dano de fontes mundanas desse elemento e sofre metade do dano, arredondado para baixo, de fontes mágicas. Recebe Armadura 1/1 e quem entrar em combate corpo a corpo contra o changeling sofre 1 dano letal por turno.",
    exceptionalSuccess: "",
    page: 148,
  },
  "ctl-2ed:touch-of-wrath": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Ao tocar um objeto, causa 1 ponto de dano por sucesso obtido.",
    exceptionalSuccess: "O dano ignora Durabilidade.",
    page: 148,
  },
  "ctl-2ed:elemental-fury": {
    action: "Instantânea",
    duration: "",
    success:
      "Por ponto de Glamour gasto, impõe uma Inclinação Ambiental escolhida em área de 20 metros ao redor do changeling; ele é imune. Cada Glamour adicional também pode ampliar o raio em 20 metros.",
    exceptionalSuccess: "",
    page: 149,
  },
  "ctl-2ed:oathbreaker-s-punishment": {
    action: "Instantânea",
    duration: "Duas semanas ou até ser usado",
    success:
      "Descobre a promessa mais grave quebrada pelo alvo e ainda não reparada. Por sucesso, cria um pesadelo em vigília ligado à promessa, utilizável nas próximas duas semanas. Cada pesadelo dura uma cena, pode ser alvo de oniromancia e cria um Bastião por uma Estrada dos Sonhos mesmo com o alvo acordado.",
    exceptionalSuccess:
      "Descobre todas as promessas quebradas e não reparadas do alvo e pode basear os pesadelos em qualquer uma ou em combinações delas.",
    page: 149,
  },
  "ctl-2ed:red-revenge": {
    action: "Instantânea",
    duration: "",
    success:
      "Recebe +3 em Iniciativa, Intimidação e em todos os Atributos Físicos, aumentando também os traços derivados. Recebe Armadura 3/3 e a Condição Berserk.",
    exceptionalSuccess: "",
    page: 149,
  },
  "ctl-2ed:relentless-pursuit": {
    action: "Instantânea",
    duration: "Até o sol cruzar o horizonte",
    success:
      "Sabe instintivamente a direção e a distância aproximada do alvo. Se ele estiver em outro reino, sabe qual. Se o alvo usar meios sobrenaturais para evitar perseguidores, ocorre um Confronto de Vontades.",
    exceptionalSuccess: "",
    page: 150,
  },
  "ctl-2ed:thief-of-reason": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Usa os sucessos da ativação como parada de dados para atacar a Lucidez do alvo. Se causar dano de Lucidez, o alvo também perde 1 Força de Vontade. Contra não-changelings, o dano ao traço equivalente é temporário e desaparece ao fim da cena. Causar dano de Lucidez com este Contrato é ponto de ruptura com parada de 4 dados.",
    exceptionalSuccess: "O ataque de Lucidez recebe os dados adicionais decorrentes dos sucessos excedentes.",
    page: 150,
  },
  "ctl-2ed:cupid-s-arrow": {
    action: "Disputada",
    duration: "",
    success:
      "Descobre o desejo mais intenso do alvo e quaisquer Condições ou Inclinações ligadas a ele, mesmo que seja inconsciente. Pode substituir o objeto desse desejo por outro durante uma cena, transferindo para o novo desejo as Condições e Inclinações associadas.",
    exceptionalSuccess:
      "Também descobre quaisquer obstáculos entre o alvo e seu desejo.",
    page: 151,
  },
  "ctl-2ed:dreams-of-the-earth": {
    action: "Disputada",
    duration: "Minutos iguais aos sucessos obtidos",
    success:
      "O alvo, que deve estar na linha de visão, cai em sono mágico. Apenas dano letal pode acordá-lo. Quando o Contrato termina, ele continua dormindo normalmente.",
    exceptionalSuccess: "O sono mágico dura toda a cena.",
    page: 151,
  },
  "ctl-2ed:gift-of-warm-breath": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Em alvo disposto tocado, remove todas as penalidades de fadiga, Inclinações relacionadas à fadiga, doenças temporárias como Doente ou Envenenado, e todo dano contundente.",
    exceptionalSuccess: "",
    page: 151,
  },
  "ctl-2ed:spring-s-kiss": {
    action: "Instantânea",
    duration: "",
    success:
      "Faz chover como desejar em uma área de até Manto milhas. Pode impor Chuva Pesada; por +1 Glamour, também pode impor Inundado.",
    exceptionalSuccess: "",
    page: 151,
  },
  "ctl-2ed:wyrd-faced-stranger": {
    action: "Disputada",
    duration: "",
    success:
      "Assume a aparência de quem o alvo mais deseja ver, inclusive alguém que ele não conheça. Pode afetar um grupo escolhendo um alvo principal; a maior Autocontrole do grupo contesta. Todos veem a mesma pessoa. Se agir fora do personagem copiado, testes Sociais podem ser exigidos, com Manto dados bônus.",
    exceptionalSuccess: "O disfarce dura até o próximo amanhecer.",
    page: 152,
  },
  "ctl-2ed:blessing-of-spring": {
    action: "Instantânea ou Disputada",
    duration: "",
    success:
      "O alvo amadurece alguns meses. Plantas florescem e produzem frutos de primavera. Pessoas e animais curam todas as feridas e doenças ou venenos que desapareceriam com o tempo. Changelings removem 1 Condição temporária de Lucidez e curam 1 dano de Lucidez, sem ganhar Beats. Tudo retorna ao fim da cena, inclusive dano e Condições; frutos goblins não usados desaparecem. Depois, o alvo deve consumir imediatamente três dias de sustento. O alvo não pode abrir mão do teste disputado.",
    exceptionalSuccess:
      "O alvo amadurece um ano. Plantas produzem mais frutos e sementes. Regenera membros perdidos. Changelings removem 1 Condição Persistente de Lucidez e curam 2 danos de Lucidez, sem Beats. Acelera em 12 meses a gestação de animais e humanos dispostos. Descendentes deixam de ser afetados ao se separarem do alvo; nascimento ocorrido durante a cena é permanente.",
    page: 152,
  },
  "ctl-2ed:gift-of-warm-blood": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Cada sucesso reduz um ferimento em um grau: agravado para letal, letal para contundente ou contundente para curado.",
    exceptionalSuccess:
      "Também cura todo dano contundente restante.",
    page: 152,
  },
  "ctl-2ed:pandora-s-gift": {
    action: "Instantânea",
    duration: "Até o sol cruzar o horizonte",
    success:
      "Após o alvo tocar uma ferramenta, material ou o próprio changeling, cria um objeto moldado pelos desejos do alvo usando as regras de Construção de Equipamento, começando em até 1 hora. Reduz pela metade o tempo normal de construção. O objeto permanece até o sol cruzar o horizonte. Se usado como suborno ou moeda de troca, concede +3 dados ao teste Social; em caso de sucesso, recupera 1 Glamour gasto neste Contrato.",
    exceptionalSuccess: "",
    page: 152,
  },
  "ctl-2ed:prince-of-ivy": {
    action: "Instantânea",
    duration: "",
    success:
      "Durante a duração, pode fazer 1 nova tentativa de agarrão por turno contra qualquer alvo a até 3 metros de uma planta, em vez de se mover, além da ação instantânea. Pode sacrificar a ação para uma segunda tentativa e a Defesa até o próximo turno para uma terceira. Testes disputados de agarrões já em curso são reflexivos. As plantas usam parada de 3 + sucessos da ativação e acompanham o changeling.",
    exceptionalSuccess:
      "No início de cada novo turno da Iniciativa, as plantas causam automaticamente 1 dano contundente a todos os alvos agarrados.",
    page: 153,
  },
  "ctl-2ed:waking-the-inner-fae": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "O alvo recebe a Condição Wanton. Uma vez por cena pelo restante da história atual, quando o changeling conseguir tentá-lo a fazer algo, recupera 1 Força de Vontade. Só pode ter um alvo designado para esse benefício por vez.",
    exceptionalSuccess:
      "O alvo também recebe a Condição Persistente Obsessão em relação ao seu maior desejo atual.",
    page: 153,
  },
  "ctl-2ed:baleful-sense": {
    action: "Disputada",
    duration: "",
    success:
      "Descobre a maior fonte de ira do alvo e quaisquer Condições ou Inclinações ligadas a ela, mesmo que ele negue a própria raiva. Pode substituir o objeto dessa ira por outro durante uma cena, transferindo para o novo alvo as Condições e Inclinações associadas.",
    exceptionalSuccess: "Também descobre a origem da ira e o que impede o alvo de destruir sua fonte. Pode induzi-lo a atacar fisicamente essa fonte sem teste, desde que ele não considere o ataque suicida.",
    page: 153,
  },
  "ctl-2ed:child-of-the-hearth": {
    action: "Instantânea",
    duration: "",
    success:
      "Impõe Calor Extremo ou Frio Extremo Ambiental em uma área do tamanho de uma sala grande; o changeling é imune. Ao mesmo tempo, remove de si Calor Extremo ou Frio Extremo Pessoal. Funciona mesmo em ambientes fechados ou à noite.",
    exceptionalSuccess: "",
    page: 154,
  },
  "ctl-2ed:helios-light": {
    action: "Instantânea",
    duration: "",
    success:
      "Emite luz solar verdadeira em uma área de até Manto × 20 metros de diâmetro. Quem olhar diretamente para o changeling recebe Cego em ambos os olhos. Criaturas feridas por luz solar sofrem metade do dano normal, arredondado para baixo.",
    exceptionalSuccess: "",
    page: 154,
  },
  "ctl-2ed:high-summer-s-zeal": {
    action: "Reflexiva e Disputada",
    duration: "",
    success:
      "Quando um inimigo tenta fugir de um conflito violento já iniciado, deve gastar 1 Força de Vontade; caso contrário, precisa continuar o confronto até isso se tornar impossível. Pode recuar para atacar à distância, mas não realizar ações que não contribuam para vencer. Não pode sofrer a Inclinação Derrotado durante a duração.",
    exceptionalSuccess:
      "Não pode nem recuar para atacar à distância e deve permanecer a até 5 metros do changeling.",
    page: 155,
  },
  "ctl-2ed:vigilance-of-ares": {
    action: "Reflexiva",
    duration: "",
    success:
      "Detecta automaticamente emboscadas, armadilhas ocultas e ataques-surpresa. Recebe bônus na Iniciativa igual ao Manto.",
    exceptionalSuccess: "",
    page: 155,
  },
  "ctl-2ed:fiery-tongue": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Causa dano contundente igual aos sucessos obtidos, ou letal contra seres feéricos. Também remove 2 Portas em Manobra Social, mas torna imediatamente Hostil a Impressão do alvo.",
    exceptionalSuccess:
      "Causa dano letal, ou agravado contra seres feéricos.",
    page: 155,
  },
  "ctl-2ed:flames-of-summer": {
    action: "Instantânea",
    duration: "",
    success:
      "Recebe +2 dados em todos os testes Físicos durante a duração, ignora penalidades por ferimentos e não precisa testar Vigor para permanecer consciente quando a última caixa de Vitalidade for preenchida.",
    exceptionalSuccess:
      "Ataques desarmados recebem +1L adicional no modificador de arma.",
    page: 155,
  },
  "ctl-2ed:helios-judgment": {
    action: "Instantânea",
    duration: "",
    success:
      "Cria um raio solar como arma de arremesso: Dano (Manto)L, alcance 10/30/50 metros, penalidade de Iniciativa -2, Força mínima 2 e Tamanho 4. Se gastar também 1 Força de Vontade, o dano é agravado. O raio retorna à mão no início de cada turno e conta como luz solar verdadeira.",
    exceptionalSuccess:
      "Um acerto também inflige a Inclinação Derrubado.",
    page: 155,
  },
  "ctl-2ed:solstice-revelation": {
    action: "Instantânea",
    duration: "",
    success:
      "Ilumina um raio de 30 metros. Personagens escondidos ou disfarçados por meios mundanos testam Manipulação + Fado com penalidade igual ao Manto ou perdem a ocultação; novas tentativas de se esconder são impossíveis. Ocultação sobrenatural exige Confronto de Vontades. Qualquer pessoa pode testar Raciocínio + Autocontrole para ver através da Máscara.",
    exceptionalSuccess: "",
    page: 156,
  },
  "ctl-2ed:sunburnt-heart": {
    action: "Disputada",
    duration: "",
    success:
      "Inflige a Condição Berserk e concede Manto dados bônus para redirecionar a fúria do alvo contra alguém que não seja o changeling.",
    exceptionalSuccess:
      "Pode afetar um segundo alvo; cada um contesta separadamente.",
    page: 156,
  },
  "ctl-2ed:autumn-s-fury": {
    action: "Instantânea",
    duration: "",
    success:
      "Por 2 Glamour, cria uma tempestade que impõe Chuva Pesada e Vento Forte em área de até Manto × 20 metros, movendo-se com o changeling, que é imune. Por +1 Glamour, no início do turno de cada alvo na área, faz reflexivamente Presença + Ocultismo − Defesa como ataque de relâmpago com modificador +1L.",
    exceptionalSuccess: "",
    page: 156,
  },
  "ctl-2ed:last-harvest": {
    action: "Instantânea",
    duration: "Uma tentativa de colheita",
    success:
      "Recebe 9-de-novo no próximo teste para colher Glamour do alvo, ou 8-de-novo se a emoção ressoar com sua Corte. Só pode usar este Contrato uma vez por capítulo.",
    exceptionalSuccess: "",
    page: 156,
  },
  "ctl-2ed:tale-of-the-baba-yaga": {
    action: "Disputada",
    duration: "",
    success:
      "Inflige a Condição Abalado em um, alguns ou todos os alvos escolhidos que mantenham contato visual.",
    exceptionalSuccess:
      "Alvos afetados também devem gastar 1 Força de Vontade para agir contra o changeling durante a duração.",
    page: 157,
  },
  "ctl-2ed:twilight-s-harbinger": {
    action: "Instantânea",
    duration:
      "Até o mês lunar terminar ou o desfecho ocorrer, o que vier primeiro",
    success:
      "Escolhe uma circunstância ou evento existente. Treze minutos antes de terminar — ou três turnos em uma cena de ação — recebe um aviso sobrenatural, independentemente de onde esteja.",
    exceptionalSuccess: "",
    page: 157,
  },
  "ctl-2ed:witches-intuition": {
    action: "Disputada",
    duration: "",
    success:
      "Descobre o maior medo do alvo e Condições ou Inclinações ligadas a ele, mesmo que seja subconsciente. Pode substituir esse medo por outro durante uma cena, transferindo para o novo medo as Condições e Inclinações associadas.",
    exceptionalSuccess:
      "Também descobre o que originou o medo e o que poderia agravá-lo ou reduzi-lo.",
    page: 157,
  },
  "ctl-2ed:famine-s-bulwark": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Por sucesso na ativação, faz ao Narrador uma pergunta de sim ou não sobre a situação atual. Todas as respostas são verdadeiras, exceto uma; se houver apenas 1 sucesso, a única resposta é falsa.",
    exceptionalSuccess:
      "Todas as respostas são verdadeiras. Também percebe o caminho até o fenômeno ou ser sobrenatural não-fae mais próximo, desde que faça a viagem na mesma cena.",
    page: 157,
  },
  "ctl-2ed:mien-of-the-baba-yaga": {
    action: "Disputada",
    duration: "",
    success:
      "Quando entra na linha de visão do alvo, aparece como seu maior medo. O alvo recebe imediatamente a Condição Assustado e deve gastar 1 Força de Vontade para realizar qualquer ação que exija dados durante a duração. Changelings podem sofrer ataque de Lucidez, conforme o medo evocado. O changeling pode permitir que observadores também vejam essa forma.",
    exceptionalSuccess:
      "O alvo também recebe Imobilizado por um número de turnos igual ao Manto.",
    page: 158,
  },
  "ctl-2ed:riding-the-falling-leaves": {
    action: "Instantânea",
    duration: "",
    success:
      "Pode Esquivar reflexivamente uma vez por turno, exceto contra ataques capazes de ferir uma pilha de folhas. Se a Esquiva tiver sucesso, pode gastar 1 Glamour para infligir Assustado no atacante. Voa a Velocidade -3, atravessa pequenas aberturas e não pode manipular objetos nem atacar fisicamente.",
    exceptionalSuccess:
      "Voa à Velocidade total e pode carregar pelo ar até Manto objetos, cada um de no máximo Tamanho 1.",
    page: 158,
  },
  "ctl-2ed:sorcerer-s-rebuke": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "O alvo perde Glamour, ou recurso sobrenatural equivalente, igual aos sucessos obtidos na ativação.",
    exceptionalSuccess:
      "Também recebe a Condição Acovardado em relação ao changeling.",
    page: 158,
  },
  "ctl-2ed:tasting-the-harvest": {
    action: "Instantânea",
    duration: "",
    success:
      "Alvos ficam imunes ao medo natural e recebem Manto dados bônus para contestar medo sobrenatural. Pode direcionar a coragem contra uma fonte de medo, concedendo +1 dado em ações contra ela.",
    exceptionalSuccess:
      "Ao contestar efeitos sobrenaturais de medo, obtêm sucesso excepcional com 3 sucessos em vez de 5.",
    page: 158,
  },
  "ctl-2ed:the-dragon-knows": {
    action: "Disputada",
    duration: "",
    success:
      "Descobre o arrependimento mais profundo do alvo e Condições ou Inclinações ligadas a ele, mesmo que seja subconsciente ou esquecido. Pode substituir o foco desse arrependimento por outro durante uma cena, transferindo as Condições e Inclinações associadas.",
    exceptionalSuccess:
      "Recebe +2 dados em testes Sociais para destruir as esperanças do alvo durante a duração.",
    page: 159,
  },
  "ctl-2ed:heart-of-ice": {
    action: "Reflexiva",
    duration: "",
    success:
      "Fica imune a frio mundano e sobrenatural, a Inclinações ambientais que não sejam baseadas em calor e a dano composto apenas por gelo ou frio. Também fica imune a ataques que tenham o coração como alvo específico e não pode receber Condições emocionais.",
    exceptionalSuccess: "",
    page: 159,
  },
  "ctl-2ed:ice-queen-s-call": {
    action: "Instantânea",
    duration: "",
    success:
      "Cria uma zona de frio com raio de Manto × 20 metros, que sofre a Inclinação Nevasca. O changeling é imune.",
    exceptionalSuccess: "",
    page: 159,
  },
  "ctl-2ed:slipknot-dreams": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Remove a carga emocional dos arrependimentos do alvo sem apagar suas memórias. O alvo recebe a Condição Enamorado em relação ao changeling.",
    exceptionalSuccess: "",
    page: 159,
  },
  "ctl-2ed:touch-of-winter": {
    action: "Instantânea",
    duration: "",
    success:
      "Congela uma área de 5 metros de diâmetro ao redor do changeling. Enquanto mantiver contato, o diâmetro aumenta em 5 metros por turno. A superfície congelada suporta até Manto pessoas. O gelo derrete normalmente quando o Contrato termina.",
    exceptionalSuccess:
      "Pode restaurar o líquido congelado à forma original ou impor a Inclinação Gelo; o changeling não é afetado por ela.",
    page: 160,
  },
  "ctl-2ed:ermine-s-winter-coat": {
    action: "Instantânea",
    duration: "",
    success:
      "Recebe +3 em Furtividade e impõe -3 a ataques contra si. Na presença de ao menos alguns seres não-feéricos, considera o Fado reduzido à metade, arredondado para baixo, para bônus de outros feéricos ao rastreá-lo/encontrá-lo, e recebe +3 em Confrontos de Vontades para parecer mortal ao fortalecer a Máscara. O Contrato termina imediatamente se a Máscara cair.",
    exceptionalSuccess: "",
    page: 160,
  },
  "ctl-2ed:fallow-fields": {
    action: "Disputada",
    duration: "Dias iguais ao Manto do changeling",
    success:
      "O alvo não pode recuperar Força de Vontade por Virtude/Vício ou Âncoras equivalentes e recebe a Condição Quebrado.",
    exceptionalSuccess:
      "Em algum momento da mesma história, o changeling pode fazê-lo sentir novamente a perda e recuperar a Condição Quebrado com uma única palavra.",
    page: 161,
  },
  "ctl-2ed:field-of-regret": {
    action: "Instantânea",
    duration: "",
    success:
      "Fantasmas atravessam os alvos escolhidos. Cada alvo sofre dano letal igual aos sucessos da ativação e perde 1 Força de Vontade.",
    exceptionalSuccess: "Cada alvo perde 2 Força de Vontade em vez de 1.",
    page: 161,
  },
  "ctl-2ed:mantle-of-frost": {
    action: "Instantânea",
    duration: "",
    success:
      "Cria uma aura de Frio Extremo de 20 metros de diâmetro, centrada no changeling e movendo-se com ele. Dentro dela, todos sofrem -1 dado cumulativo por turno, até -5; depois disso, sofrem 1 dano letal por turno. A penalidade desaparece ao sair, mas retorna no valor atual ao reentrar. O changeling é imune. Quem sofrer dano superior ao próprio Vigor recebe a Inclinação Imobilizado.",
    exceptionalSuccess: "",
    page: 161,
  },
  "ctl-2ed:winter-s-curse": {
    action: "Disputada",
    duration: "",
    success:
      "O alvo não pode participar de ações de trabalho em equipe, gastar ou recuperar Força de Vontade por Thread/Virtude ou Âncora equivalente, nem sofrer pontos de ruptura durante a duração. Abandona aliados e Aspirações. Sua Impressão fica Média e não pode ser alterada, salvo por Confronto de Vontades; o changeling pode melhorá-la normalmente e recebe Manto dados bônus em testes Sociais contra ele. Pontos de ruptura adiados ocorrem quando o efeito termina.",
    exceptionalSuccess:
      "Pode escolher outro personagem presente: a Impressão desse personagem com o alvo torna-se Hostil, e ele sofre penalidade igual ao Manto em testes Sociais contra o alvo.",
    page: 161,
  },
  "ctl-kith-kin:filling-the-cup": {
    action: "Instantânea",
    duration:
      "Uma cena ou até recuperar Glamour, o que ocorrer primeiro",
    success:
      "Detecta pessoas sob emoções intensas em raio de Fado × 40 metros, sabendo direção e distância aproximada no momento da ativação e se a emoção é positiva ou negativa. Se alguém provocar Bedlam dentro do alcance durante a duração, identifica automaticamente o fenômeno como Bedlam.",
    exceptionalSuccess: "",
    page: 35,
  },
  "ctl-kith-kin:sleep-s-sweet-embrace": {
    action: "Instantânea ou Resistida",
    duration: "Número de dias igual aos sucessos",
    success:
      "Enquanto o alvo dormir durante a duração, não sonha e cura 1 dano letal por hora de sono, mas não recupera Força de Vontade pelo descanso. Não possui Bastião enquanto dorme e não pode ser alvo de oniromancia ou magia que afete sonhos/sonhadores. Se durar mais de 2 dias, recebe Dissociação, que não pode ser resolvida até recuperar toda a Força de Vontade após o término. Só é resistido por alvo involuntário. Pode usar em si, mas não pode encerrar antes.",
    exceptionalSuccess:
      "Dissociação só ocorre se o efeito durar mais de 3 dias.",
    page: 36,
  },
  "ctl-kith-kin:curse-s-cure": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Cria antídoto para uma vítima. Ao beber uma dose completa, ela cura um veneno em metade do tempo normal ou, se seria fatal, sobrevive. Condições causadas pelo veneno desaparecem sem resolução. Veneno sobrenatural exige Confronto de Vontades.",
    exceptionalSuccess: "Cura o veneno completamente e de forma imediata.",
    page: 37,
  },
  "ctl-kith-kin:dreamer-s-phalanx": {
    action: "Instantânea",
    duration: "Um capítulo ou até todos acordarem",
    success:
      "Liga os Bastiões de todos os participantes dispostos, incluindo o changeling, em um sonho compartilhado. Cada Bastião mantém entrada e saída próprias, mas conta como um único Bastião para oniromancia e navegação. Cada Bastião recebe +1 Fortificação por sonhador, máximo +5, contra oniropompos externos. Ações de trabalho em equipe entre participantes dentro dos Bastiões recebem 8-de-novo. Mudanças de localização podem mover afetados entre Bastiões. Se um participante acordar naturalmente, seu Bastião desaparece; se for despertado à força por magia, todos os Bastiões compartilhados são destruídos.",
    exceptionalSuccess: "",
    page: 37,
  },
  "ctl-kith-kin:closing-death-s-door": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Revive um personagem morto há no máximo um capítulo. Ele retorna com todas as caixas de Vitalidade preenchidas por dano agravado, exceto a última à direita, intacta. O changeling recebe Dívida Goblin igual às horas desde a morte, mínimo 1, respeitando o limite normal; pode tornar-se Habitante da Sebe se a Dívida resultante exceder 9.",
    exceptionalSuccess:
      "Pode reviver alguém morto em qualquer momento da história atual, não apenas no capítulo.",
    page: 37,
  },
  "ctl-kith-kin:feast-of-plenty": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Cria alimento, bebida ou remédio suficiente para todos presentes. Quem participar voluntariamente remove 1 Condição física não Persistente ou 1 Inclinação pessoal física e recupera Força de Vontade igual à metade dos sucessos, arredondado para cima. O changeling não recebe esses benefícios. Todos os beneficiados recebem a Condição Endividado em relação ao changeling. Forçar alguém a consumir falha automaticamente.",
    exceptionalSuccess: "A Condição Endividado torna-se Persistente.",
    page: 38,
  },
  "ctl-kith-kin:still-waters-run-deep": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Suprime um número de Condições emocionais do alvo igual aos sucessos. Condições suprimidas não têm efeito, não podem ser resolvidas nem gerar Beats durante a cena, e o alvo não pode receber novas Condições emocionais. Durante o efeito, não pode fazer Hedgespinning, tecer sonhos, provocar Bedlam nem colher Glamour de seres vivos, embora ainda possa ceifá-lo.",
    exceptionalSuccess: "Sucessos adicionais são sua própria recompensa.",
    page: 39,
  },
  "ctl-kith-kin:poison-the-well": {
    action: "Disputada",
    duration: "Um capítulo",
    success:
      "Remove temporariamente o acesso do alvo a um Mérito Social mundano; seus Aliados, Contatos, Mentor ou equivalente passam a agir contra ele. Na Sebe, pode afetar Méritos de Changeling ligados a seres feéricos, locais ou recursos: o alvo ainda pode usá-los, mas recebe Dívida Goblin igual aos pontos do Mérito a cada uso.",
    exceptionalSuccess:
      "O alvo também recebe a Condição Notoriedade.",
    page: 39,
  },
  "ctl-kith-kin:shared-cup": {
    action: "Instantânea ou Disputada",
    duration: "Um capítulo",
    success:
      "Liga até um número de participantes igual aos sucessos; o changeling deve participar. Alvos involuntários podem contestar. Impressões entre participantes melhoram um nível e eles sofrem -3 para contestar ações Sociais de outros participantes. Hedgespinning e Bedlam obtêm sucesso excepcional com 3 sucessos. Participantes sentem estados emocionais uns dos outros; Condições emocionais e Inclinações pessoais se propagam a todos. Recuperação de Força de Vontade ou Glamour também se replica; quem não possui Fado recebe Inspirado em vez de Glamour.",
    exceptionalSuccess:
      "Sucessos adicionais aumentam apenas o número máximo de participantes.",
    page: 39,
  },
  "ctl-kith-kin:book-of-black-and-red": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Descobre as cinco dívidas e obrigações juradas mais significativas de um alvo visível, mundanas ou mágicas, além de quantos pontos de Dívida Goblin ele possui. Se usar essas informações no mesmo capítulo para influenciar o alvo ou quitar tais dívidas, recebe +2 dados e o alvo recebe Alavancado em relação ao changeling.",
    exceptionalSuccess:
      "Também descobre detalhes das dívidas relevantes, como credor, origem e motivo que impede o pagamento.",
    page: 40,
  },
  "ctl-kith-kin:give-and-take": {
    action: "Instantânea",
    duration: "Instantânea, ou uma cena para Méritos",
    success:
      "Troca com alvo consentindo até metade do Fado em pontos de Glamour, Força de Vontade, moeda social ou pontos de um Mérito pessoal por quantidade igual de outra categoria que ele possua. Méritos trocados duram uma cena; o dono original perde seus benefícios e o receptor deve cumprir os pré-requisitos. Não permite trocar dentro da mesma categoria nem Méritos que afetem o mundo externo, como Recursos ou Aliados.",
    exceptionalSuccess: "",
    page: 41,
  },
  "ctl-kith-kin:beggar-knight": {
    action: "Instantânea",
    duration: "Um capítulo por sucesso",
    success:
      "Amaldiçoa alvo que ouça e compreenda o changeling. Ele perde acesso aos próprios Recursos e não pode obter benefício material do trabalho, riqueza ou Recursos de terceiros enquanto a maldição durar; bens ou recursos dos quais participe também podem ficar indisponíveis a outros enquanto sua participação continuar.",
    exceptionalSuccess:
      "O jogador do changeling também pode rolar seus sucessos no teste de invocação deste Contrato como um ataque imediato Lucidez contra a vítima. Se ele não tem Lucidez, seu jogador lança um ponto de ruptura com uma penalidade de dados igual ao sucesso da invocação em vez disso.",
    page: 41,
  },
  "ctl-kith-kin:coin-mark": {
    action: "Instantânea",
    duration: "Uma história",
    success:
      "Encanta um objeto. Sabe sua localização em relação à própria e percebe toda mudança de propriedade, identificando o novo dono e o preço da transação, se houver. Ao interagir com o dono atual, pode gastar +1 Glamour para infligir Avareza.",
    exceptionalSuccess: "",
    page: 42,
  },
  "ctl-kith-kin:grease-the-wheels": {
    action: "Instantânea",
    duration: "",
    success:
      "Ao tratar diretamente com membro de uma organização ou burocracia para finalidade administrativa, o processo se resolve a seu favor em um décimo do tempo normal, ignorando burocracia e escrutínio excessivo. Só funciona para resultados que a organização normalmente poderia fornecer.",
    exceptionalSuccess: "O processo se resolve imediatamente e de forma favorável, mesmo que isso seja extremamente improvável.",
    page: 41,
  },
  "ctl-kith-kin:blood-debt": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Sempre que outro personagem causar ao changeling dano letal/agravado ou dano leve/grave de Lucidez, sofre 1 dano letal que ignora Armadura. Aumenta em +1 para cada ocorrência simultânea: o ataque faz o changeling perder Força de Vontade; perder Glamour; ou receber Condição/Inclinação.",
    exceptionalSuccess: "",
    page: 43,
  },
  "ctl-kith-kin:exchange-of-gilded-contracts": {
    action: "Instantânea",
    duration: "Até um capítulo",
    success:
      "Com consentimento de outro changeling, toma emprestado um Contrato Comum conhecido por ele. Usa apenas bônus de Seeming aos quais normalmente teria acesso e não pode usar a Brecha. O alvo perde acesso ao Contrato emprestado e recebe temporariamente Exchange of Gilded Contracts apenas para encerrar reflexivamente a troca, devolvendo ambos os Contratos.",
    exceptionalSuccess: "",
    page: 43,
  },
  "ctl-kith-kin:golden-promise": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Reduz a Disponibilidade de um serviço em número igual aos sucessos. O serviço ainda deve estar disponível na situação. Pode reduzir a Disponibilidade a 0 e usar o Contrato repetidamente no mesmo serviço durante a cena.",
    exceptionalSuccess: "Além da redução adicional, recebe a Condição Conectado ligada ao prestador do serviço.",
    page: 43,
  },
  "ctl-kith-kin:grand-revel-of-the-harvest": {
    action: "Instantânea",
    duration: "Um capítulo",
    success:
      "Durante a cena, participantes que deliberadamente celebrem ou festejem obtêm sucesso excepcional com 3 sucessos em testes Sociais e melhoram a atitude em um nível para Manobra Social. Até o fim do Contrato, quando recuperam Força de Vontade recebem +1; quando curam dano de Vitalidade ou Lucidez, curam +1 do mesmo tipo; ganhos de riqueza recebem +1 no bônus de equipamento para adquiri-los.",
    exceptionalSuccess: "",
    page: 44,
  },
  "ctl-kith-kin:thirty-pieces": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      'O changeling planta uma semente de traição dentro da mente de um único alvo que consegue ver. Ela escolhe uma única ação que constitui uma traição aos aliados, amigos ou causa do alvo, como revelar informações condenatórias ou atacá-los diretamente. Isso pode acontecer imediatamente ou confiar em um gatilho específico que ocorre antes do fim da história atual (como "tiro meu aliado quando eles pegarem esta caixa"). O alvo toma a ação especificada quando apropriado, ganhando a Condição Culpada posteriormente. Esse poder não pode compelir atos não-traiçoeiros, nem pode causar o alvo a se prejudicar diretamente. Um caractere só pode estar sob os efeitos de uma invocação de Trinta Peças de cada vez; usando o Contrato em um alvo que ainda tem que atender ao gatilho de uma instância existente substitui-lo.',
    exceptionalSuccess:
      "Após a traição, o alvo também recebe Fuga.",
    page: 45,
  },
  "ctl-kith-kin:burning-ambition": {
    action: "Instantânea",
    duration: "Até cumprir a Aspiração",
    success:
      "Recebe uma Aspiração adicional que funciona como craving de um Verdadeiro Fae e deve representar o que mais deseja, desde que não esteja coberto por Aspiração atual. Ao cumpri-la, recupera Força de Vontade igual à metade do Fado, recebe 1 Beat e a Condição Competitivo.",
    exceptionalSuccess: "",
    page: 45,
  },
  "ctl-kith-kin:jealous-vengeance": {
    action: "Disputada",
    duration: "Um capítulo",
    success:
      "O alvo deve abandonar definitivamente a posição ou situação que obstrui o changeling. Se não fizer tudo ao alcance para obedecer durante o capítulo, recebe uma Condição escolhida: Cego temporário, Bestial, Segredo Embaraçoso, Culpado, Alavancado, Letárgico, Paranoico, Devastado, Imprudente ou Assustado. Não pode resolvê-la até vencer o changeling em ação disputada.",
    exceptionalSuccess: "Inflige duas Condições da lista.",
    page: 45,
  },
  "ctl-kith-kin:litany-of-rivals": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Escolhe uma Aspiração própria. Por sucesso, descobre uma informação ainda desconhecida sobre a pessoa mais imediata ou ameaçadora que possa impedir seu cumprimento: nome; rosto; localização atual; uma fragilidade ou fraqueza; ou nome/rosto de um aliado próximo. Pode escolher cada informação sucessivamente e alternar entre pessoas.",
    exceptionalSuccess: "Sucessos adicionais apenas concedem mais informações.",
    page: 46,
  },
  "ctl-kith-kin:knight-s-oath": {
    action: "Instantânea",
    duration: "Um capítulo",
    success:
      "Concede cavalaria a um não-changeling disposto. Enquanto ele puder perceber o changeling, recebe bônus em Iniciativa e Defesa igual à metade do Fado e o mesmo bônus em ações Sociais feitas em nome dele. Se desobedecer ou trair, recebe Acovardado e o changeling sabe imediatamente o que ocorreu, sem detalhes das circunstâncias.",
    exceptionalSuccess: "",
    page: 46,
  },
  "ctl-kith-kin:unmask-the-dark-horse": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Descobre uma Aspiração de curto prazo do alvo e inflige Competitivo, que só pode ser resolvido após ele vencer o changeling em teste disputado, luta ou outra competição. Por +1 Glamour, pode trocar imediatamente uma Aspiração própria por outra que se oponha diretamente à do alvo.",
    exceptionalSuccess:
      "Descobre todas as Aspirações do alvo.",
    page: 47,
  },
  "ctl-kith-kin:a-benevolent-hand": {
    action: "Instantânea",
    duration: "Um capítulo",
    success:
      "Após realizar um gesto que beneficie outra pessoa sem benefício próprio direto ou indireto, sua Impressão melhora em um nível, até Perfeita, com qualquer pessoa que conhecer pela primeira vez durante o capítulo. Ao obter sucesso em uma ação Social contra alguém afetado, pode receber temporariamente 1 ponto de Aliados representando essa pessoa e uma organização/grupo ao qual pertença, máximo 5 pontos obtidos assim. Os pontos desaparecem ao fim do Contrato.",
    exceptionalSuccess: "",
    page: 47,
  },
  "ctl-kith-kin:tempter-s-quest": {
    action: "Disputada",
    duration: "Uma história",
    success:
      "Define uma tarefa clara, finita e plausível de ser concluída pelo alvo na história. Descobre sua Aspiração mais importante e promete uma recompensa que contribua diretamente para cumpri-la. O alvo recebe Obsessão Persistente pela missão e substitui uma Aspiração por concluí-la. Se não realizar ao menos uma ação significativa em direção à missão por capítulo, não pode recuperar Força de Vontade por suas Âncoras até fazê-lo. Se concluir a missão e o changeling não entregar a recompensa antes do fim da história, o changeling recebe Alavancado e conta como quebrador de juramento até resolver a Condição.",
    exceptionalSuccess:
      "Se o alvo não avançar em direção à missão ao menos uma vez por sessão, também recebe Letárgico.",
    page: 48,
  },
  "ctl-kith-kin:curse-of-hidden-strings": {
    action: "Disputada",
    duration: "Uma cena",
    success:
      "Escolhe uma obrigação conhecida do alvo que possua prova ou registro, inclusive juramento imposto pelo Fado. O alvo esquece completamente sua participação nessa obrigação, embora ela continue válida e suas consequências permaneçam. Define uma ação plausível, ligada à obrigação e benéfica ao alvo, que encerra a maldição antecipadamente; ao realizá-la, ele recupera a memória e identifica quem causou a perda. Se o efeito terminar normalmente, não descobre o responsável.",
    exceptionalSuccess: "A duração passa a um capítulo.",
    page: 49,
  },
  "ctl-kith-kin:spare-not-the-rod": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Cria um cetro sólido de Glamour, sempre utilizável com uma mão e sem Força mínima. Corpo a corpo: modificador 0B, sem penalidade de Iniciativa. Por 1 Glamour por ataque, pode atacar à distância com 0L, alcance 30 metros, sem alcance médio/longo e sem penalidade de Iniciativa. Um ataque ou ação de Intimidação bem-sucedido também inflige Desmoralizado. Se largado ou desarmado, permanece até o fim do Contrato e pode ser usado por outros; quem não possui Fado não pode usar o ataque à distância.",
    exceptionalSuccess: "",
    page: 49,
  },
  "ctl-kith-kin:pole-star": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Indica continuamente a direção de uma pessoa, lugar ou objeto nomeado. Pode orientar-se, localizar norte verdadeiro ou apontar para alvo específico de localização desconhecida; não revela distância nem posição exata. Se o alvo estiver oculto sobrenaturalmente, exige Confronto de Vontades. Só funciona no mundo mundano.",
    exceptionalSuccess: "",
    page: 50,
  },
  "ctl-kith-kin:cynosure": {
    action: "Disputada",
    duration: "Uma cena",
    success:
      "O alvo revela uma Aspiração escolhida por ele. O changeling descobre um evento ou oportunidade no próximo capítulo, para Aspiração de curto prazo, ou na história, para Aspiração de longo prazo, que ajude a cumpri-la.",
    exceptionalSuccess: "Também descobre alguém com quem já tenha uma relação estabelecida e que seria especialmente útil aos objetivos do alvo.",
    page: 50,
  },
  "ctl-kith-kin:shooting-star": {
    action: "Instantânea",
    duration: "Um capítulo",
    success:
      "Um criador ou artista recebe 1 ponto temporário de Fama. Se isso elevar Fama acima de 3, recebe +1 dado ao bônus Social de Fama em vez disso. Changelings que colham Glamour de pessoas afetadas pela Fama do alvo recebem +1 no teste de colheita.",
    exceptionalSuccess: "",
    page: 51,
  },
  "ctl-kith-kin:retrograde": {
    action: "Disputada",
    duration: "Um capítulo",
    success:
      "Assuntos rotineiros do alvo que normalmente não exigiriam teste dão errado, especialmente comunicação, finanças e viagens.",
    exceptionalSuccess:
      "Além dos contratempos rotineiros, o alvo realiza cada teste duas vezes e usa o pior resultado.",
    page: 51,
  },
  "ctl-kith-kin:frozen-star": {
    action: "Disputada",
    duration: "Até o próximo nascer do sol ou até o alvo tocar o destino",
    success:
      "Nomeia um sujeito que possa perceber e traça uma pessoa, lugar ou objeto como destino. O sujeito abandona o que estiver fazendo e viaja até o destino, que deve ser alcançável antes do próximo nascer do sol e não pode ter sido escolhido expressamente para feri-lo. O efeito termina ao primeiro contato ou no nascer do sol; depois, o sujeito recebe Abalado.",
    exceptionalSuccess:
      "O efeito não termina no primeiro contato. O sujeito recebe Dependência Persistente em relação ao destino; pode resolvê-la normalmente, mas ela desaparece sem resolução no próximo nascer do sol.",
    page: 51,
  },
  "ctl-kith-kin:light-of-ancient-stars": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Sobre um evento passado ao qual tenha conexão pessoal, ou ocorrido em local que já visitou fisicamente, pode fazer ao Narrador um número de perguntas igual ao Fado; as respostas devem ser verdadeiras.",
    exceptionalSuccess: "",
    page: 52,
  },
  "ctl-kith-kin:star-light-star-bright": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Por 1 Glamour, descobre um desejo que o alvo fez no último mês; sem alvo específico, descobre o desejo de uma pessoa aleatória a até 1 milha. Deve realizar o desejo até o fim da história ou recebe Quebrador de Juramento Persistente. Por +1 Glamour, pode anexar uma consequência negativa ao desejo. A forma de realizá-lo é limitada pelas capacidades do changeling.",
    exceptionalSuccess: "",
    page: 51,
  },
  "ctl-kith-kin:pinch-of-stardust": {
    action: "Instantânea (alvo disposto) ou Disputada (hostil)",
    duration: "Um capítulo ou até Delirante ser resolvida",
    success:
      "Cria uma criatura semelhante a um fetch com Ecos em número igual ao Fado e a vincula como Touchstone do alvo. Se o alvo não usar Touchstones, torna-se mentor, amigo próximo ou vínculo equivalente. O alvo recebe Delirante Persistente em relação à criatura. O changeling pode afetar a si mesmo, mas esquece que criou o simulacro. Ao fim do capítulo, a criatura se desfaz e a perda do Touchstone provoca as consequências normais. Usar este Contrato é ponto de ruptura com 3 dados, ou 4 se o alvo for changeling.",
    exceptionalSuccess:
      "A criatura também se integra às memórias dos amigos e entes queridos mais próximos do alvo, embora eles não recebam Delirante.",
    page: 53,
  },
  "ctl-kith-kin:briar-s-herald": {
    action: "Instantânea",
    duration: "Um capítulo",
    success:
      "Enquanto o alvo estiver a até 100 metros do changeling, perde 10-de-novo em todos os testes e toda falha se torna falha dramática sem conceder Beats. O changeling sabe sempre que o alvo falha em um teste, mesmo fora do alcance, mas não recebe detalhes.",
    exceptionalSuccess:
      "Sempre que o alvo falhar em um teste dentro do alcance, também sofre 1 dano letal.",
    page: 54,
  },
  "ctl-kith-kin:by-the-pricking-of-my-thumbs": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Estende audição, visão, olfato e tato para qualquer planta viva que possa perceber, ocupando uma planta por vez. Pode alternar entre plantas e o próprio corpo com ação Instantânea. Continua percebendo o corpo e pode agir, mas sofre -3 em ações não relacionadas à percepção pela planta, Defesa e Iniciativa enquanto seus sentidos estiverem estendidos.",
    exceptionalSuccess: "",
    page: 55,
  },
  "ctl-kith-kin:thistle-s-rebuke": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Espinhos aumentam a Armadura geral da roupa ou armadura em +2. Quem tocar o changeling ou enfrentá-lo em corpo a corpo sofre 1 dano letal; em agarrão, sofre 2 dano letal por turno além de outros danos. Pode disparar os espinhos contra alvo a até 50 metros como arma à distância 2L, mas perde os demais benefícios do Contrato naquele turno.",
    exceptionalSuccess: "",
    page: 55,
  },
  "ctl-kith-kin:the-gouging-curse": {
    action: "Instantânea",
    duration: "Um capítulo",
    success:
      "Proíbe uma ação específica que o alvo poderia realizar em uma única ação Instantânea. Se ele a realizar antes do fim do capítulo, recebe uma Inclinação escolhida: Braço Arruinado em um braço, Cego em um olho, Surdo em um ouvido ou Perna Arruinada em uma perna. A Inclinação dura até o fim do Contrato.",
    exceptionalSuccess:
      "Ao ativar a maldição, o alvo também recebe Culpado.",
    page: 55,
  },
  "ctl-kith-kin:embrace-of-nettles": {
    action: "Reflexiva",
    duration: "Instantânea",
    success:
      "Na Sebe, em resposta a uma mudança de Hedgespinning da própria Sebe, escolhe um efeito. Desviar: muda o alvo de uma única mudança observada. Adiar: anula até metade do Fado, arredondado para baixo, em sucessos da mudança; eles são adicionados à próxima mudança bem-sucedida da Sebe, que fica imune a este Contrato. Dobrar a aposta: adiciona até metade do Fado em sucessos à mudança da Sebe e recebe o mesmo número de sucessos extras no próximo Hedgespinning bem-sucedido na cena. Não pode repetir uma opção na mesma cena até usar as outras duas.",
    exceptionalSuccess: "",
    page: 56,
  },
  "ctl-kith-kin:acantha-s-fury": {
    action: "Disputada",
    duration: "Uma cena",
    success:
      "Transforma gradualmente o alvo em planta espinhosa de Tamanho 4–12 ao longo de 8 minutos, um estágio por minuto. A cada estágio, oferece uma tarefa possível, segura e concluível em uma cena; se o alvo prometer cumpri-la, regride um estágio por minuto. Se não cumprir até o fim do capítulo, a transformação recomeça. Estágios: -2 em ações não reflexivas, Velocidade, Defesa e Iniciativa fora de luz solar direta; -2 Vigor, mínimo 1, ajustando Vitalidade; quatro estágios tornam um membro por vez Braço/Perna Arruinado; depois Imobilizado por raízes; por fim, transformação completa, sem movimento, fala ou ações além de ações Mentais sem movimento. É ponto de ruptura com 4 dados.",
    exceptionalSuccess: "Quando o alvo cumpre uma promessa feita durante a transformação, o changeling recupera 1 Força de Vontade.",
    page: 56,
  },
  "ctl-kith-kin:awaken-portal": {
    action: "Instantânea",
    duration: "Um capítulo",
    success:
      "Concede senciência temporária a uma entrada, passagem, Hedgeway dormente ou acesso a Bastião/Recanto. O portal não se move nem realiza ações físicas ou que exijam fala, mas percebe como o changeling e pode comunicar-se mentalmente com ele a qualquer distância. O changeling pode usar Kenning pela perspectiva do portal, deixando de perceber o próprio ambiente enquanto o faz. O portal tem Inteligência 2, Raciocínio 2, Perseverança 5; Presença 2, Manipulação 1, Autocontrole 2; Ocultismo 2, Intimidação 3; Fado 2; Glamour 7/2 por turno; Força de Vontade 7; Iniciativa 3; Defesa 0; Armadura 3/3; Velocidade 0; Vitalidade 10; fraqueza apenas a ferro frio; Overpowering Dread, Thorns and Brambles; Influência (Sarças) 2 e Know Soul.",
    exceptionalSuccess: "",
    page: 57,
  },
  "ctl-kith-kin:crown-of-thorns": {
    action: "Disputada",
    duration: "Uma história",
    success:
      "Proíbe uma ação Instantânea específica. Se o alvo a realizar durante a história, sofre 1 dano letal e recebe Comatoso. Não-changelings só podem resolver Comatoso se alguém entrar em seus sonhos e convencê-los de que estão sonhando, ou se outro poder sobrenatural os despertar vencendo Confronto de Vontades. Se permanecer Comatoso até o fim da história, acorda e a Condição desaparece sem resolução nem Beat.",
    exceptionalSuccess:
      "Comatoso deve ser resolvido normalmente e não desaparece ao fim da história.",
    page: 58,
  },
  "ctl-kith-kin:shrike-s-larder": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Por 1 Glamour por efeito, até 3 Glamour no mesmo alvo, acumula: • em perseguições, -2 em testes de movimento e não pode ter a Vantagem; pode gastar 1 Força de Vontade para ignorar por 1 turno; • -3 em Iniciativa; • reduz Velocidade à metade, arredondada para baixo; pode sofrer voluntariamente 1 dano contundente para ignorar este efeito por 1 turno.",
    exceptionalSuccess: "",
    page: 58,
  },
  "ctl-kith-kin:witch-s-brambles": {
    action: "Reflexiva",
    duration: "Instantânea",
    success:
      "Por 2 Glamour, ao realizar uma ação mundana com objeto perfurante de Tamanho 1 ou menor, sofre -3 no teste e pode gastar sucessos excedentes em mudanças sutis como Hedgespinning. Não aplica os demais efeitos ou consequências normais de Hedgespinning. Se obtiver sucesso excepcional, pode pagar +1 Glamour para realizar uma mudança de paradigma. Não funciona na Sebe ou em outros reinos sobrenaturais.",
    exceptionalSuccess: "",
    page: 59,
  },
  "ctl-kith-kin:coming-darkness": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Cria escuridão total em raio de Fado × 5 metros centrado no changeling. Quem estiver na área ao surgir deve passar em Raciocínio + Autocontrole ou receber Atordoado, salvo se enxergar claramente no escuro. Quem permanecer ou entrar recebe Cego em ambos os olhos até sair ou o efeito terminar. Luz mundana não atravessa; luz mágica exige Confronto de Vontades. O changeling é imune. Durante o efeito fica sem sombra; se terminar fora da área, deve recuperá-la na Sebe com mudança sutil de Hedgespinning de 4 sucessos.",
    exceptionalSuccess: "",
    page: 59,
  },
  "ctl-kith-kin:pomp-and-circumstance": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Define área de até Fado × 10 metros de raio com limites físicos claros. Não convidados não podem entrar, salvo se convidados por alguém dentro. Espionagem mundana e rastreamento de pessoas dentro falham automaticamente; tentativas sobrenaturais exigem Confronto de Vontades. Por +1 Força de Vontade, Caçadores e Verdadeiros Fae não conseguem encontrar a área. Define até Fado regras específicas que todos dentro compreendem automaticamente; se alguém quebrar uma regra, o Contrato termina e todos na área recebem Desmoralizado.",
    exceptionalSuccess: "",
    page: 60,
  },
  "ctl-kith-kin:shadow-puppet": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Cria uma criatura de sombra com forma escolhida. Funciona como Retentor com pontos iguais à metade do Fado e inteligência básica, usando uma Especialização do changeling como área de expertise. Recebe 1 Poder de Pavor goblin, Fado 1, Glamour máximo 6 e 1 caixa de Vitalidade. Age no turno e Iniciativa do changeling e segue suas ordens. Se sofrer dano letal ou agravado suficiente para preencher a Vitalidade, é destruída e leva consigo a parte correspondente da sombra do changeling; recuperar sombra perdida exige mudança sutil de Hedgespinning de 4 sucessos na Sebe.",
    exceptionalSuccess: "",
    page: 60,
  },
  "ctl-kith-kin:dread-companion": {
    action: "Disputada",
    duration: "Um capítulo",
    success:
      "Vincula-se a um fantasma da Sebe e torna-se uma Thread adicional dele. Pedidos do changeling contam como afirmar essa Thread. Pode pedir uso de poderes, Numina ou Influências; o fantasma pode gastar 1 Glamour para recusar. Ambos devem permanecer a até Fado × 10 metros. O fantasma pode retirar Glamour do changeling à distância para poderes usados em seu benefício, e o changeling pode usar o Glamour do fantasma em ações que beneficiem ambos. No mundo mundano, o fantasma não sofre efeitos adversos por estar fora da Sebe e pode receber a Máscara do changeling.",
    exceptionalSuccess:
      "O fantasma não pode recusar pedidos, salvo se eles o colocarem em perigo.",
    page: 61,
  },
  "ctl-kith-kin:cracked-mirror": {
    action: "Disputada",
    duration: "Uma cena ou até trocar de lugar",
    success:
      "Por 1 Glamour, usa um espelho para observar e ouvir o próprio fetch como se estivesse próximo dele durante a cena; o fetch sempre sabe que houve tentativa de espionagem, mesmo em falha. Por +1 Força de Vontade, troca imediatamente de lugar com o fetch através do espaço dos espelhos e o Contrato termina. Fetch disposto não precisa contestar.",
    exceptionalSuccess:
      "A troca ou espionagem também inflige Confuso ao fetch.",
    page: 61,
  },
  "ctl-kith-kin:listen-with-the-wind-s-ears": {
    action: "Instantânea",
    duration: "Uma cena ou até usar o teleporte",
    success:
      "Quando seu nome verdadeiro é pronunciado a até Fado × 2 milhas, percebe isso e pode testar Raciocínio + Investigação + Fado contra Autocontrole + Fado do falante para ouvir a conversa por 1 turno. Enquanto escuta, não ouve fala ao seu redor. Proteções sobrenaturais contra espionagem exigem Confronto de Vontades. Em sucesso excepcional, escuta por turnos iguais aos sucessos excedentes. Enquanto estiver ouvindo com sucesso, pode gastar +1 Glamour e 1 Força de Vontade para se teleportar instantaneamente até a conversa; o Contrato então termina.",
    exceptionalSuccess: "",
    page: 62,
  },
  "ctl-kith-kin:momentary-respite": {
    action: "Instantânea",
    duration: "Uma cena; pode estender por 1 Força de Vontade por cena",
    success:
      "Por sucesso, escolhe um efeito: encerra 1 Inclinação pessoal; ignora penalidades de ferimentos; protege a caixa de Vitalidade não protegida mais à direita contra dano agravado; ignora 1 toxina ou doença; ou ignora 1 Condição Persistente, que não pode resolver nem gerar Beats durante o efeito. Opções repetíveis podem ser escolhidas várias vezes quando aplicável. Dano agravado já presente em caixa protegida é ignorado, não curado. Enquanto durar, não cura naturalmente, não recupera Força de Vontade por descanso, não recupera Lucidez por Touchstones, não gasta Experiências e não envelhece. Após a primeira cena consecutiva de uso, sofre ponto de ruptura ao final de cada cena com parada de 1 + número de cenas consecutivas. Pode estender o efeito pagando 1 Força de Vontade ao fim de cada cena.",
    exceptionalSuccess: "Sucessos adicionais apenas concedem mais escolhas.",
    page: 62,
  },
  "ctl-kith-kin:steal-influence": {
    action: "Disputada",
    duration: "Uma cena",
    success:
      "Ao tocar criatura com Influência, rouba 1 ponto dessa Influência por Glamour gasto. Se possuir várias Influências, escolhe uma e não pode dividir o custo entre elas. O alvo não pode usar os pontos roubados. O changeling pode usar a Influência no nível roubado pagando Glamour, mesmo que normalmente exigisse outro recurso.",
    exceptionalSuccess:
      "Pode comprar permanentemente os pontos roubados por 2 Experiências cada, até o total roubado. Mantém-os após retornarem ao alvo. Limite permanente: metade do Fado em pontos de uma mesma Influência.",
    page: 63,
  },
  "ctl-kith-kin:earth-s-gentle-movements": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Remodela terreno aberto centrado no changeling em área de 1 metro quadrado por sucesso. Não afeta áreas com estruturas, pavimentação ou construções artificiais. Pode elevar, afundar ou modelar terra, mudar sua consistência entre solo, areia ou lama, mas não pedra, e expelir materiais misturados. Quem estiver na área testa Destreza + Atletismo ou recebe Derrubado. As mudanças são permanentes.",
    exceptionalSuccess: "Pode dividir os sucessos para criar dois efeitos diferentes dentro da área.",
    page: 64,
  },
  "ctl-kith-kin:earth-s-impenetrable-walls": {
    action: "Instantânea (leva 5 turnos ou 30 segundos para concluir)",
    duration: "Um capítulo",
    success:
      "Em terreno aberto sem construções artificiais, cria fortaleza de pedra de Tamanho Fado × 10. Durante a construção, a área sofre Terremoto e o changeling é imune. A fortaleza conta como Lugar Seguro com pontos iguais à metade do Fado, arredondada para baixo, e paredes com Durabilidade 2. Por sucesso além do primeiro, escolhe: +1 Durabilidade, repetível; +10 Tamanho, repetível; imunidade da estrutura a Inclinações Ambientais naturais, com Confronto de Vontades contra sobrenaturais; provisões suficientes para todos dentro; ou, se na Sebe, também conta como Recanto com pontos iguais à metade do Fado, arredondada para baixo.",
    exceptionalSuccess: "Sucessos adicionais apenas concedem mais benefícios.",
    page: 65,
  },
  "ctl-dark-eras:draw-likeness": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Nomeia um criminoso específico, um crime específico ou um tipo geral de crime. Cria em uma superfície plana uma imagem do alvo; testes para reconhecer o alvo a partir dela recebem qualidade rote. Quem examina a imagem pela primeira vez recebe 1 Pista gratuita sobre paradeiro ou atividade recente. Se nomear crime geral, o alvo é o perpetrador mais próximo que o cometeu no último mês lunar; se não houver, o Contrato falha.",
    exceptionalSuccess: "Quem vê a imagem recorda imediatamente quando e onde viu o criminoso pela última vez, sujeito a Confronto de Vontades contra efeitos que bloqueiem a memória, e recebe Informado sobre o criminoso.",
    page: 241,
  },
  "ctl-dark-eras:peacemaker-s-dra-w": {
    action: "Reflexiva e Disputada",
    duration: "Instantânea",
    success:
      "Pode ser ativado em qualquer ponto da ordem de Iniciativa, inclusive interrompendo outro turno. Se não tiver arma à distância pronta, pode sacá-la reflexivamente; se não tiver nenhuma, cria uma arma padrão de Glamour. Pode usar várias vezes no mesmo turno, inclusive contra o mesmo alvo. Cada ativação conta como ataque, consome munição e ignora cobertura. Em sucesso, desarma um item na mão ou no corpo do alvo sem causar dano, exigindo ação Instantânea para recuperar, ou impõe uma Inclinação Pessoal apropriada, removível com ação Instantânea. O alvo recebe Alavancado em relação a testemunhas, exceto o changeling.",
    exceptionalSuccess:
      "Escolhe onde o item desarmado cai, inclusive na própria mão. Inclinações impostas duram a cena.",
    page: 241,
  },
  "ctl-oak-ash-thorn:donning-the-grand-mantle": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Recebe Manto 5 durante a cena. Para cada ponto de Manto que já possuía, recupera 1 Glamour gasto e recebe +1 em testes alinhados diretamente aos temas do Manto, inclusive seus Contratos de Corte. Usar este Contrato mais de uma vez por história causa Alavancado em relação ao patrono; não pode usá-lo novamente enquanto estiver Alavancado.",
    exceptionalSuccess:
      "Esta ativação não conta para o limite seguro de uma vez por história.",
    page: 23,
  },
  "ctl-oak-ash-thorn:hidden-protocol": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Usando qualquer dispositivo eletrônico com entrada de usuário, envia pelo BriarNet uma mensagem de até 20 palavras a uma pessoa cujo nome conheça, sem precisar de contato, sinal ou rede. O destinatário não precisa de dispositivo; a mensagem chega por coincidência. Tentativas de rastrear ou interceptar tratam o teste de ativação como oposto.",
    exceptionalSuccess: "",
    page: 24,
  },
  "ctl-oak-ash-thorn:autonomous-payload": {
    action: "Disputada",
    duration: "",
    success:
      "Em um trod do BriarNet, abre Hedgeway digital para um repositório eletrônico e transforma o changeling e acompanhantes em dados. Cada repositório funciona como Bastião com Fortificação baseada na segurança; proteção sobrenatural adiciona metade da Tolerância Sobrenatural do usuário, arredondada para cima. Pode ler Fortificação usando Informática no lugar de Empatia, fortalecer repositório conhecido como próprio Bastião, e usar Hedgespinning para atravessar segurança e alterar dados, programas e configurações. Ao terminar, pode reativar para continuar em forma digital; caso contrário, todos emergem fisicamente do dispositivo. Pode viajar pela representação BriarNet de redes conectadas e reativar o Contrato para alcançar outro repositório conectado.",
    exceptionalSuccess: "",
    page: 25,
  },
  "ctl-oak-ash-thorn:full-fathom-five": {
    action: "Instantânea",
    duration: "Fado turnos em cena de ação ou Fado minutos fora dela",
    success:
      "A partir do turno seguinte, percebe perfeitamente o espaço físico em raio de Fado × 10 metros. Atravessa automaticamente ocultação e surpresa mundanas e recebe Manto dados para contestar versões sobrenaturais. Ignora penalidades de escuridão/baixa visibilidade, é imune a Cego e Surdo e anula até Manto dados de penalidades circunstanciais em ataques à distância. Recebe +Manto em Iniciativa e +metade do Manto, arredondada para cima, em Defesa, salvo contra alvos fora do alcance ou emboscadas bem-sucedidas. Barreira à prova de som bloqueia o efeito. Ruído alto dentro do alcance exige Raciocínio + Autocontrole + Manto para manter o Contrato.",
    exceptionalSuccess: "",
    page: 27,
  },
  "ctl-oak-ash-thorn:the-widening-gyre": {
    action: "Disputada",
    duration: "",
    success:
      "Cria vórtice em raio de Fado × 10 metros. Cada personagem no alcance contesta separadamente; pode excluir alvos percebidos por +1 Glamour cada. Alvos afetados devem usar seu movimento normal de cada turno para avançar Velocidade total em direção ao changeling, salvo se gastarem 1 Força de Vontade naquele turno para se ancorar. Ainda podem usar a ação Instantânea para mover novamente. Quem chegar ao alcance corpo a corpo recebe Derrubado. O vórtice acompanha o changeling; quem entrar depois também contesta.",
    exceptionalSuccess: "Quem ficar caído dentro do alcance corpo a corpo também recebe Imobilizado.",
    page: 28,
  },
  "ctl-oak-ash-thorn:principle": {
    action: "Disputada",
    duration: "Instantânea",
    success:
      "Exige prova, evidência ou confissão de que outro changeling traiu, enganou ou praticou conduta empresarial desonesta/antiética contra o usuário ou membro da Casa de In, ou pretende fazê-lo, e exige apertar sua mão. Inflige versão temporária de Quebrador de Juramento que não requer perdão adicional do Fado para ser resolvida; a Condição altera perceptivelmente o mien do alvo de acordo com a transgressão.",
    exceptionalSuccess:
      "O alvo também não consegue dizer nada que não acredite ser verdade até o fim do capítulo.",
    page: 30,
  },
  "ctl-oak-ash-thorn:ancestors-wisdom": {
    action: "Instantânea (leva 10 minutos)",
    duration: "Uma cena",
    success:
      "Após cerimônia de pelo menos 10 minutos, convoca o fantasma de um membro falecido da Casa de In, escolhido pelo Narrador. O fantasma conserva as memórias que possuía em vida e permanece até o fim da cena; convencê-lo a cooperar normalmente exige interação.",
    exceptionalSuccess: "O fantasma já está disposto a cooperar e não precisa ser convencido.",
    page: 29,
  },
  "h-beyond-hedge:crown-envoy-s-splendid-defense": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Revela o mien feérico sem causar perda de Lucidez. Recebe o equivalente a Aparência Marcante ••••, cumulativo com o Mérito existente. Enquanto não empunhar arma nem tentar ferir alguém, humanos comuns não podem atacá-lo diretamente. Seres sobrenaturais precisam passar em Perseverança + Autocontrole reflexivo antes de cada ataque. Atacar ou empunhar arma de forma ameaçadora encerra o Contrato. Câmeras e dispositivos eletrônicos não registram sua forma verdadeira; após o efeito, humanos racionalizam ou esquecem seus aspectos inumanos.",
    exceptionalSuccess:
      "Dura até o próximo nascer ou pôr do sol, o que ocorrer primeiro.",
    page: 125,
  },
  "h-beyond-hedge:sweet-nothings": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Um alvo adormecido responde honestamente a uma pergunta por sucesso, conforme seu conhecimento. Se não souber a resposta, informa que não sabe.",
    exceptionalSuccess:
      "Também pode impor ao alvo uma destas Condições em relação ao changeling ou a outro alvo apropriado: Amnésia, Confuso, Acovardado, Desorientado ou Distraído.",
    page: 126,
  },
  "h-beyond-hedge:jewels-the-perfect-talent": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Changeling e alvo precisam possuir ao menos 1 ponto na Habilidade escolhida. Para cada 2 sucessos, o alvo recebe +1 ponto nessa Habilidade, até seu máximo permitido. O aumento afeta todas as paradas baseadas nela.",
    exceptionalSuccess:
      "O changeling também recebe +1 na Habilidade, podendo exceder seu máximo normal.",
    page: 127,
  },
  "h-beyond-hedge:mirror-babel-s-tower": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Pode falar, ler e escrever qualquer idioma não mágico ao qual seja exposto. Identifica o idioma usado em códigos, mas não decifra automaticamente a cifra.",
    exceptionalSuccess: "",
    page: 128,
  },
  "h-beyond-hedge:turing-s-enigma": {
    action: "Instantânea ou Disputada",
    duration: "",
    success:
      "Para codificar, disfarça magicamente a mensagem; quebrar a cifra exige Confronto de Vontades, enquanto o destinatário pretendido pode gastar 1 Glamour para lê-la normalmente. Para decodificar, cifras mundanas são quebradas automaticamente; criptografia mágica exige Confronto de Vontades e +1 Força de Vontade além do custo de Glamour.",
    exceptionalSuccess: "Ao decodificar, também recebe a Condição Informado sobre o assunto da mensagem.",
    page: 128,
  },
  "h-beyond-hedge:shield-bar-the-door": {
    action: "Instantânea (Confronto de Vontades para forçar o portal)",
    duration: "Uma cena ou 24 horas",
    success:
      "Tranca magicamente um portal que possua meio mundano de fechamento. Forçá-lo exige Confronto de Vontades contra Manipulação + Furto + Fado do changeling. Gastar +1 Força de Vontade aumenta a duração para 24 horas.",
    exceptionalSuccess: "",
    page: 130,
  },
  "h-beyond-hedge:foul-is-fair": {
    action: "Disputada",
    duration: "",
    success:
      "Remove de si ou de outro alvo uma Condição não Persistente e a transfere para outro alvo válido, inclusive sua fonte original. Exige Confronto de Vontades; a Condição permanece até ser resolvida normalmente.",
    exceptionalSuccess:
      "Pode impor a Condição também a um segundo alvo válido.",
    page: 130,
  },
  "h-beyond-hedge:whisperward": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Cria uma zona protegida equivalente a uma sala de 3 × 3 m por ponto de Fado. Conversas dentro dela não podem ser compreendidas por meios mundanos, eletrônicos ou mágicos. Espionagem sobrenatural exige Confronto de Vontades, inclusive poderes de compartilhamento de sentidos.",
    exceptionalSuccess: "",
    page: 131,
  },
  "h-beyond-hedge:steed-waylaid-traveler": {
    action: "Instantânea",
    duration: "Manto × 2 horas",
    success:
      "Se obtiver ao menos 1 sucesso após subtrair a maior Autocontrole dos perseguidores, eles ficam incapazes de seguir o changeling na Sebe ou no mundo mortal. Também pode afetar alguém na linha de visão, impedindo-o de alcançar um destino escolhido durante a duração. O efeito não força o alvo a entrar deliberadamente em perigos evidentes.",
    exceptionalSuccess:
      "O alvo esquece a perseguição e não a retoma por 24 horas.",
    page: 132,
  },
  "h-beyond-hedge:wildwalking": {
    action: "Reflexiva",
    duration: "Uma cena",
    success:
      "Ignora penalidades de ambiente ou natureza em quantidade igual à metade do Fado, arredondada para baixo, como penalidades de Percepção por névoa, fumaça ou vento e de movimento por vegetação, gelo, chuva ou ventos fortes. Não pode transformar penalidades em bônus; penalidades severas podem ser apenas reduzidas.",
    exceptionalSuccess: "",
    page: 133,
  },
  "h-beyond-hedge:name-smoke-stepping": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Como ação de movimento, teleporta-se entre pontos dentro da mesma fumaça ou névoa a até Fado × 5 metros. Pode surgir em qualquer direção e surpreender oponentes sem sentidos ou Méritos capazes de detectar emboscadas.",
    exceptionalSuccess: "",
    page: 134,
  },
  "h-beyond-hedge:spring-doorway-to-desire": {
    action: "Instantânea",
    duration: "Varia",
    success: "Abre um portal para qualquer local da Sebe que o changeling já tenha visitado. O portal permanece aberto até que ele o feche, permitindo que outras pessoas o atravessem.",
    exceptionalSuccess: "",
    page: 135,
  },
  "h-beyond-hedge:faerie-feast": {
    action: "Disputada",
    duration: "",
    success:
      "Quem consumir a comida ou bebida encantada sofre a Condição Enamorado em relação ao changeling.",
    exceptionalSuccess:
      "O alvo também sofre a Condição Devasso em relação ao changeling.",
    page: 135,
  },
  "h-beyond-hedge:name-in-vino-veritas": {
    action: "Instantânea e Disputada",
    duration: "Até o próximo nascer ou pôr do sol",
    success:
      "Encanta uma bebida alcoólica. A próxima pessoa que beber dela faz o teste disputado; se não resistir, fica compelida a dizer a verdade até o próximo nascer ou pôr do sol.",
    exceptionalSuccess:
      "Se não resistir, o alvo também sofre a Condição Confuso durante o efeito.",
    page: 136,
  },
  "h-beyond-hedge:memory-of-stone": {
    action: "Reflexiva",
    duration: "Uma cena ou 24 horas",
    success:
      "Recebe o Mérito Memória Eidética por uma cena. Gastando também 1 Força de Vontade, mantém o Mérito por 24 horas.",
    exceptionalSuccess: "",
    page: 136,
  },
  "h-beyond-hedge:memory-of-trees": {
    action: "Instantânea e Prolongada",
    duration: "Enquanto mantiver contato",
    success:
      "Ao tocar uma árvore, acessa imagens mentais de acontecimentos em sua proximidade, aproximadamente 30 m de raio por 3 m de altura da árvore. Pode retroceder 1 dia por turno de contato e percorrer as imagens para frente ou para trás. Árvores da Sebe produzem resultados imprevisíveis.",
    exceptionalSuccess: "",
    page: 136,
  },
  "h-beyond-hedge:merry-meet": {
    action: "Instantânea e Disputada",
    duration: "Uma cena",
    success:
      "Se obtiver mais sucessos que o alvo, recebe +3 dados em todos os testes sociais posteriores contra ele pelo restante da cena.",
    exceptionalSuccess:
      "O alvo também sofre a Condição Enamorado em relação ao changeling até resolvê-la.",
    page: 137,
  },
  "h-beyond-hedge:name-mantle-of-terrible-beauty": {
    action: "Disputada",
    duration: "Uma cena",
    success:
      "Afeta todos a até Fado × 3 metros, exceto changelings ligados ao personagem por juramento de motley. Quem obtiver menos sucessos foge aterrorizado; se não puder fugir, sofre -2 dados em todas as ações. Quem igualar ou superar o changeling não foge, mas sofre -2 em ataques contra ele. O changeling recebe +2 em testes posteriores de Intimidação. Novos alvos que entrarem na área também são afetados.",
    exceptionalSuccess:
      "Quem falhar em resistir sofre a Condição Assustado pela cena; quem empatar na resistência sofre a Condição Acovardado pela cena.",
    page: 138,
  },
  "h-beyond-hedge:summer-sunflash": {
    action: "Reflexiva",
    duration: "Dois turnos",
    success:
      "Um clarão cega quem estiver olhando para o changeling no turno atual e no seguinte. No turno seguinte, o changeling soma Manto à Iniciativa e pode se esconder ou usar efeitos que exijam não estar sendo observado.",
    exceptionalSuccess: "",
    page: 139,
  },
  "h-beyond-hedge:my-anger-is-my-armor": {
    action: "Reflexiva",
    duration: "Uma cena",
    success:
      "Aceita a Condição Berserk pela cena e recebe Armadura igual ao Manto contra todos os tipos de dano. Não acumula com armadura mundana. Encerrar antecipadamente custa 1 Força de Vontade; remover a Condição também remove a armadura.",
    exceptionalSuccess: "",
    page: 139,
  },
  "h-beyond-hedge:name-solstice-revelations": {
    action: "Instantânea",
    duration: "Um turno por sucesso",
    success:
      "Luz preenche um raio de aproximadamente 30 m. Esconder-se ou disfarçar-se na área fica reduzido a teste de sorte; quem já estava oculto ou disfarçado também precisa passar nesse teste para não ser revelado. Ocultação sobrenatural exige Furtividade + Fado, ou característica sobrenatural equivalente, com -5. A Máscara enfraquece, permitindo que quem normalmente poderia enxergá-la faça um teste comum de Percepção.",
    exceptionalSuccess:
      "A luz dura dois turnos por sucesso e pode ser encerrada antes pelo changeling.",
    page: 140,
  },
  "h-beyond-hedge:autumn-babel-s-curse": {
    action: "Instantânea",
    duration: "Um turno por sucesso ou uma cena",
    success:
      "O alvo não consegue transmitir informação de forma verbal, escrita, gestual ou sobrenatural por um turno por sucesso. Gastando também 1 Força de Vontade, a duração passa a uma cena. Expressões muito básicas ainda funcionam, mas mensagens complexas perdem completamente o significado.",
    exceptionalSuccess:
      "O alvo também sofre a Condição Sinestesia durante o efeito.",
    page: 140,
  },
  "h-beyond-hedge:dead-men-s-tales": {
    action: "Prolongada",
    duration: "Uma cena",
    success:
      "Invoca um eco não senciente de uma pessoa morta. Ele responde precisa e honestamente a uma pergunta por sucesso, mas não oferece informações além do que foi perguntado.",
    exceptionalSuccess:
      "O eco também fornece informações importantes que o changeling não sabia que deveria perguntar.",
    page: 141,
  },
  "h-beyond-hedge:ghostly-presence": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Pode ver, ouvir, falar, tocar e interagir fisicamente com fantasmas e outros seres em Crepúsculo na área, inclusive atacá-los. Eles também podem interagir normalmente com o changeling.",
    exceptionalSuccess: "",
    page: 141,
  },
  "h-beyond-hedge:persephone-s-doorway": {
    action: "Instantânea",
    duration: "Uma noite por sucesso",
    success:
      "Cria um portal bidirecional entre o mundo dos vivos e o mundo dos mortos. Pode ser atravessado nos dois sentidos enquanto durar; quando o efeito termina, o portal fecha.",
    exceptionalSuccess: "Pode proteger o portal com uma senha ou frase, exigida de qualquer pessoa que tente atravessá-lo em qualquer direção.",
    page: 141,
  },
  "h-beyond-hedge:banshee-s-wail": {
    action: "Disputada",
    duration: "",
    success:
      "Todos, aliados ou inimigos, a até Manto × 10 metros fazem a resistência reflexiva. Quem falhar sofre dano contundente igual ao Manto e as Condições Surdo e Assustado pelo restante da cena. Quem resistir ainda sofre Surdo por Manto turnos.",
    exceptionalSuccess:
      "Quem falhar em resistir também sofre a Condição Amaldiçoado por uma semana.",
    page: 142,
  },
  "h-beyond-hedge:bauble-of-the-mind": {
    action: "Disputada",
    duration: "Até a memória ser devolvida",
    success:
      "Remove uma memória específica e limitada, de no máximo algumas horas, e a armazena em um pequeno objeto. A vítima mantém apenas uma lembrança nebulosa. Outra pessoa pode experimentar a memória segurando o objeto e gastando 1 Glamour; se ela ressoar com a emoção da Corte, recupera 1 Força de Vontade. Destruir o objeto ou liberar a memória a devolve ao dono original.",
    exceptionalSuccess:
      "O changeling recupera o ponto de Força de Vontade gasto para invocar o Contrato.",
    page: 143,
  },
  "h-beyond-hedge:elfshot": {
    action: "Instantânea",
    duration: "",
    success:
      "Cria um dardo com Dano igual ao Manto em dano letal, alcance 10/20/40 m, penalidade de Iniciativa 0 e Tamanho 1. Gastando também 1 Força de Vontade, o dano torna-se agravado. O dardo retorna à mão do changeling no início de cada turno enquanto o Contrato durar.",
    exceptionalSuccess: "Um acerto também impõe a Inclinação Atordoado.",
    page: 143,
  },
  "h-beyond-hedge:name-haunted-house": {
    action: "Instantânea",
    duration: "Uma semana ou um mês",
    success:
      "Por 2 Glamour, assombra uma área de até uma casa grande, ou Fado × 10 m² ao ar livre, com fenômenos audiovisuais. Intrusos não designados resistem com Perseverança + Autocontrole contra Presença + Intimidação + Fado: a primeira falha causa Assustado, a segunda Abalado e a terceira Aterrorizado e força a fuga. Três sucessos de resistência tornam o intruso imune. Cada Glamour adicional impõe -1 à resistência, até -5. Dura uma semana no mundo mortal ou um mês na Sebe/Hollow.",
    exceptionalSuccess: "",
    page: 144,
  },
  "h-beyond-hedge:wake-the-dead": {
    action: "Instantânea",
    duration: "Três dias",
    success:
      "Anima um cadáver relativamente recente ou preservado como um zumbi sob controle do changeling. Cadáveres enterrados há mais de um mês estão deteriorados demais. O zumbi permanece ativo por três dias.",
    exceptionalSuccess:
      "O zumbi recebe +1 em Força, Vigor e Inteligência, tornando-se capaz de executar tarefas simples além de atacar.",
    page: 144,
  },
  "h-beyond-hedge:name-whispers-in-the-dark": {
    action: "Prolongada",
    duration: "Uma cena",
    success:
      "Cada teste representa um turno de escuta e impõe -2 dados às demais ações. Ao acumular a quantidade de sucessos definida pelo Narrador conforme a obscuridade da informação, o changeling obtém a informação procurada, podendo inclusive ouvir os sussurros originais. Conhecimento verdadeiramente antigo ou perdido também custa 1 Força de Vontade.",
    exceptionalSuccess:
      "Recebe por 24 horas um Mérito escolhido aleatoriamente ou pelo Narrador entre: Senso de Perigo, Memória Eidética, Conhecimento Enciclopédico, Olho para o Estranho, Indomável, Médium, Mente de um Louco, Sensibilidade a Presságios, Conhecimento Sobrenatural ou Tolerância à Biologia.",
    page: 146,
  },
  "h-beyond-hedge:withering-glare": {
    action: "Disputada",
    duration: "Uma cena",
    success:
      "Precisa enxergar o alvo. Se vencer, escolhe impor a Inclinação Braço Ferido ou Perna Ferida pela cena.",
    exceptionalSuccess: "O alvo também sofre a Inclinação Imobilizado pela cena.",
    page: 146,
  },
  "h-beyond-hedge:winter-mindveil": {
    action: "Reflexiva",
    duration: "Uma cena",
    success:
      "Soma Manto a todos os testes de resistência contra poderes que tentem ler ou controlar sua mente. Se resistir, leitores mentais percebem apenas escuridão e vento. Pode permitir seletivamente telepatia de aliados.",
    exceptionalSuccess: "",
    page: 147,
  },
  "h-beyond-hedge:veil-of-tears": {
    action: "Disputada",
    duration: "",
    success:
      "No turno seguinte, o changeling age antes do alvo independentemente da ordem original de Iniciativa.",
    exceptionalSuccess:
      "O alvo também sofre a Condição Letárgico.",
    page: 147,
  },
  "h-beyond-hedge:curse-of-fading": {
    action: "Instantânea e Disputada",
    duration: "Manto dias",
    success:
      "Se vencer o alvo, ele desaparece ao longo do turno seguinte e entra em um estado semelhante ao Crepúsculo por Manto dias. Não pode ser visto, ouvido ou tocado por meios normais no mundo mortal ou na Sebe, embora possa observar ambos sem conseguir afetá-los. Meios mágicos apropriados ainda podem percebê-lo.",
    exceptionalSuccess:
      "Ao retornar, o alvo sofre a Condição Fuga até resolvê-la.",
    page: 147,
  },
  "h-beyond-hedge:my-sorrow-is-my-armor": {
    action: "Reflexiva",
    duration: "Uma cena",
    success:
      "Aceita a Condição Entorpecido pela cena e ignora penalidades de ferimento em quantidade igual ao Manto. Continua agindo mesmo abaixo de Incapacitado enquanto o Contrato durar; quando termina, os ferimentos voltam a produzir todos os efeitos. Encerrar antecipadamente custa 1 Força de Vontade; remover a Condição também encerra a proteção.",
    exceptionalSuccess: "",
    page: 148,
  },
  "h-beyond-hedge:soul-rime": {
    action: "Disputada",
    duration: "Até resolvida",
    success:
      "O alvo que não resistir sofre a Condição Quebrado até resolvê-la.",
    exceptionalSuccess:
      "Além de Quebrado, o alvo sofre a Condição Persistente Loucura, focada em desespero, até ser resolvida.",
    page: 148,
  },
  "h-courts:celestial-summons": {
    action: "Instantânea",
    duration: "Especial",
    success:
      "O sujeito sabe que o changeling deseja sua presença e é compelido a chegar até ele. Ela não vai arriscar danos físicos ou outras consequências graves; No entanto, assim que puder razoavelmente fazê - lo, ela chegará lá. O sujeito deve estar dentro do mesmo espaço livre ou cidade que o changeling, e ela deve ter um meio viável (se não for razoável) de alcançá-lo. A compulsão dura até o final do capítulo ou até que o personagem atinja o changeling, o que ocorrer primeiro.",
    exceptionalSuccess:
      "Se o changeling conseguir excepcionalmente, ela pode adiar este efeito até que se mude, se desejar, mas ela deve fazê-lo antes do próximo nascer do sol.",
    page: 105,
  },
  "h-courts:climate-change": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-courts:celestial-m-ight": {
    action: "Instantânea",
    duration: "Turnos iguais ao Manto",
    success:
      "Ele vai lidar com seu bônus de dano arma como dano agravado (ou um mínimo de um ponto, se isso é normalmente zero) durante a duração, embora sucessos rolados apenas infligir o tipo de dano normal. Este poder só pode ser usado no momento apropriado para o tribunal da mudança de Ling (dia para o Sun Court, noite para o Moon Court), e ela deve estar ao ar livre.",
    exceptionalSuccess: "A ação é reflexiva.",
    page: 106,
  },
  "h-courts:celestial-shield": {
    action: "Instantânea",
    duration: "",
    success:
      "Ela pode transformá-lo em um pequeno escudo que pode ser mantido em uma mão, ou ela pode moldá-lo em uma barricada imóvel (Tamanho 6), que até três pessoas podem caber atrás. Como um objeto portátil, ele funciona como um escudo normal, mas também reduz qualquer dano ao empunhador em dois, independentemente da fonte (exceto para ferro frio). 186), com Durabilidade igual ao Manto do changeling, além do efeito de redução da idade da barragem. Sun: Se o changeling está usando a versão portátil, ela não sofre penalidade por usar um escudo. Lua: Se o changeling está usando a versão barricada, ela pode torná-lo opaco, escondendo-se e quaisquer aliados.",
    exceptionalSuccess: "",
    page: 106,
  },
  "h-courts:vigil-of-silver-and-gold": {
    action: "Instantânea",
    duration: "Até o próximo pôr ou nascer do sol",
    success:
      "O changeling traça um sol ou lua em quatro cantos de uma área de até trezentos metros quadrados. Durante a duração, pode sentir todos os que saem ou saem da área. Se ela os conhece pessoalmente, vai sentir quem é. Se não, ela tem um senso geral, como “um Ogre” ou “um motorista de caminhão”. “Um cadáver errante” pode ser um vam pire esboçado ou um zumbi sem mente, por exemplo. Pessoas ou criaturas supernaturalmente escondidas cruzando o limiar pro voke um Confronto de Vontades.",
    exceptionalSuccess: "",
    page: 106,
  },
  "h-courts:family-friendly-feud": {
    action: "Instantânea",
    duration: "",
    success:
      "Durante a duração, todo dano causado por violência nas proximidades do changeling é reduzido em um nível de letalidade: agravado torna-se letal, letal torna-se contundente e contundente é reduzido à metade, arredondando para cima. Aplica-se a todos os presentes, inclusive ao changeling.",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-courts:frozen-in-time": {
    action: "Disputada",
    duration: "Turnos iguais ao Fado",
    success:
      "O changeling fala com a vítima; a mente dela se prende a uma frase dita e entra em um ciclo de memória. Durante a duração, sofre a Inclinação Atordoado. O efeito termina antecipadamente se sofrer qualquer dano letal. A vítima precisa conseguir ouvir as palavras, mas não precisa compreendê-las.",
    exceptionalSuccess:
      "A vítima também sofre a Condição Abalado.",
    page: 108,
  },
  "h-courts:hearth-s-respite": {
    action: "Instantânea",
    duration: "Uma semana",
    success:
      "Após limpar ou redecorar um local que possui ou onde vive, o edifício transmite estabilidade e calma. Changelings convidados curam 1 nível de dano leve de Lucidez por hora passada ali. Quem consumir comida ou bebida no local aplica penalidade de 2 dados ao próximo ataque de Lucidez que sofrer ou recebe bônus de 2 dados no primeiro ponto de ruptura de Integridade durante a semana seguinte. Testes para agir agressiva ou violentamente no local perdem 10-again.",
    exceptionalSuccess:
      "Quem curar dano de Lucidez dessa forma também remove sua Condição de Lucidez mais antiga.",
    page: 108,
  },
  "h-courts:book-of-courts-protection-of-the-innocent": {
    action: "Instantânea",
    duration: "Um mês lunar",
    success:
      "Qualquer habilidade sobrenatural que tenha o mortal protegido como alvo sofre penalidade igual ao Manto do changeling no teste de ativação; se não houver teste, a habilidade simplesmente falha. O mortal recebe armadura geral igual ao Manto contra dano de fontes sobrenaturais. Ações mundanas de criaturas sobrenaturais que causariam dano físico ao mortal perdem 10-again.",
    exceptionalSuccess:
      "O mortal também recebe 1 ponto de armadura geral contra dano mundano.",
    page: 109,
  },
  "h-courts:shared-remem-brance": {
    action: "Disputada",
    duration:
      "Até uma hora ou a duração da memória, o que for menor",
    success:
      "O changeling vivencia uma memória pelos olhos do alvo. Pode escolher uma memória da qual tenha conhecimento por data/hora ou conteúdo, ou a memória emocionalmente intensa mais recente do alvo. Recebe 8-again em testes de Empatia envolvendo esse alvo pelo restante do capítulo.",
    exceptionalSuccess: "Pode observar até três horas de memória.",
    page: 109,
  },
  "h-courts:nothing-to-see-here": {
    action: "Instantânea",
    duration: "",
    success:
      "Uma névoa cobre uma área externa de Manto × 2 quilômetros e pode entrar em ambientes internos por aberturas. Ela impõe penalidade de Percepção igual ao Manto e bônus equivalente em ações mundanas de Furtividade. O changeling e até Manto indivíduos escolhidos ignoram a penalidade de Percepção. Contratos e outros efeitos sobrenaturais de ocultação ou disfarce recebem 9-again dentro da névoa. Mortais com Perseverança menor que o Manto racionalizam encontros sobrenaturais ocorridos nela como truques da mente.",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-courts:rain-of-terror": {
    action:
      "Disputada e Prolongada (cada 5 sucessos estende a tempestade por uma cena; cada teste representa dois turnos; máximo de testes igual ao Manto)",
    duration: "",
    success:
      "Convoca uma tempestade de fenômenos bizarros em raio de Manto × 2 quilômetros. Ela não causa dano físico por padrão. Todos, exceto o changeling, sofrem Distraído enquanto atuam na tempestade. Mortais não podem contestar o Contrato e, mesmo protegidos do clima, recebem Assustado, Arrepiado ou Abalado. Quem estiver diretamente exposto e perder a disputa também recebe Loucura. Quando a tempestade termina, as Condições associadas terminam sem serem resolvidas.",
    exceptionalSuccess:
      "Quem receber Loucura também recebe Delirante ou Fuga, à escolha do changeling; todos os afetados recebem a mesma Condição.",
    page: 111,
  },
  "h-courts:storm-of-the-century": {
    action:
      "Prolongada (meta de 5 sucessos; cada teste representa dois turnos; máximo de testes igual ao Manto)",
    duration: "Horas iguais ao Manto",
    success:
      "Ao ar livre, convoca clima violento em raio de Manto × 2 quilômetros. A tempestade afeta todos exceto o changeling, salvo proteção específica, e não pode terminar antecipadamente. Para cada sucesso, escolha um efeito: aumentar Ambiente Extremo em 1 até Manto − 1; impor uma Inclinação Ambiental apropriada; produzir trovões e relâmpagos (1 sucesso pode impor temporariamente Cego ou Surdo a personagens com Vigor menor que Manto; 2 fazem um alvo aleatório ser atingido a cada 6 − Manto turnos; 3 permitem escolher o alvo com uma ação; relâmpago causa Manto + Fado de dano contundente); tornar uma pessoa ou objeto imune; ou estender a duração por Manto horas.",
    exceptionalSuccess: "Dobra a duração da tempestade.",
    page: 111,
  },
  "h-courts:tempestuous-hearts": {
    action: "Instantânea",
    duration: "",
    success:
      "Pode incitar Bedlam usando as regras normais, com o custo já incluído na ativação, canalizando Glamour por uma tempestade, nevasca, névoa ou outra condição climática marcante. Quem testemunha o clima infundido de Glamour é afetado por Bedlam como se pudesse perceber o changeling. Em clima calmo, pode canalizar o efeito a até Manto × 2 quilômetros. Em tempestade, adiciona Manto ao teste para incitar Bedlam.",
    exceptionalSuccess: "",
    page: 112,
  },
  "h-courts:thunder-steed": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Deve estar ao ar livre e exposto a uma tempestade ou céu completamente nublado. Desaparece quando um raio atinge sua posição e reaparece com outro raio em qualquer ponto externo sob a mesma tempestade a até Manto × 2 quilômetros. Qualquer outro atingido pelo raio sofre Manto + Fado de dano contundente. Em clima calmo, pode levar até Manto pessoas que o estejam tocando, protegendo-as do raio. Em tempestade, partida e chegada produzem ondas de choque em Manto × 3 metros; quem não superar Manto em um teste reflexivo de Destreza + Esportes recebe Derrubado.",
    exceptionalSuccess: "",
    page: 112,
  },
  "h-courts:aether-crossing": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Tocando uma manifestação de fogo, terra, ar ou água grande o bastante para contê-lo, o changeling entra no elemento e reaparece do outro lado ou ao longo de sua extensão, até Manto metros, podendo atravessar barreiras se o elemento tiver continuidade até o outro lado. Fogo: por três turnos após sair de um grande fogo, incendeia tudo que tocar quando possível. Terra: pode fundir-se com minerais e metais manufaturados, como concreto e aço, tratando-os como contínuos com terra e pedra naturais. Ar: pode ser carregado pelo vento por Manto minutos antes de pousar em segurança. Água: pode sair do mesmo corpo d'água em qualquer ponto a até 2 × Manto quilômetros, estendendo a duração até o fim da cena.",
    exceptionalSuccess: "",
    page: 114,
  },
  "h-courts:book-of-courts-age-of-aquarius": {
    action: "Disputada",
    duration: "Uma semana ou um capítulo, o que for menor",
    success:
      "Nomeia uma categoria geral de pessoa para redefinir a identidade social do alvo. Outros o percebem como membro dessa categoria; mesmo amigos próximos precisam passar em Raciocínio + Autocontrole com penalidade igual ao Manto para reconhecê-lo. O mundo também acompanha a identidade alternativa: o alvo recebe temporariamente pontos de Méritos iguais a 2 × Manto para distribuir em Méritos apropriados à nova persona e perde acesso aos Méritos incompatíveis, podendo realocá-los temporariamente pela Santidade dos Méritos. O changeling e sua motley não são afetados e reconhecem o alvo normalmente.",
    exceptionalSuccess:
      "A identidade redefinida persiste por uma história ou uma semana, o que for maior. Em casos raros, partes desse destino alternativo podem tornar-se permanentes se o jogador adquirir os Méritos com Experiência ou a critério do Narrador.",
    page: 115,
  },
  "h-courts:assuming-the-stellar-m-antle": {
    action: "Instantânea",
    duration: "Uma semana",
    success:
      "O efeito depende do signo solar do alvo: fogo enfatiza paixão e aventura; ar, conversação e introspecção; terra, reserva e pragmatismo; água, sensibilidade aos outros. O alvo recebe três Especialidades temporárias de Habilidade adequadas ao signo. Em ações beneficiadas por uma dessas Especialidades, obtém sucesso excepcional com três sucessos. Um sucesso excepcional assim recupera 1 Força de Vontade; changelings podem recuperar 1 Glamour em vez disso.",
    exceptionalSuccess:
      "O Contrato dura até o zodíaco avançar para o próximo signo, ou para o seguinte caso a próxima mudança ocorra em menos de uma semana.",
    page: 115,
  },
  "h-courts:elemental-cycle": {
    action: "Instantânea",
    duration: "Permanente",
    success:
      "Com um movimento de varredura de sua mão, o changeling afeta uma área até seu Manto em Tamanho, transformando-o em um dos outros três elementos. Se isso faria com que algo caísse sobre alguém, como transformando o ar acima deles em água, isso infligiria dano igual ao seu Manto, a menos que a vítima conseguisse um teste de Dexteridade + Atletismo. A área afetada deve ser predominantemente composta de algo geralmente aceito como um dos quatro elementos (o Narrador é o árbitro final), e transforma-se em um exemplo não notável do novo material. Não pode transformar água em ouro, mas ela pode transformá-la em sujeira. Fogo: Se o changeling criar fogo com este Contrato, ele queimará pelo restante da cena, independentemente do combustível disponível ou tentativas de apagá-lo sem magia. Não se espalhará, embora possa iniciar incêndios por satélite tão susceptíveis de serem utilizados como qualquer incêndio regular. Terra: Se o changeling cria terra com este Contrato, pode ser qualquer mineral natural, não processado ou metal (exceto ferro, naturalmente) uma vez por história. Ar: Se o changeling cria ar com este Contrato, ela pode desencadeá-lo como um vento uivante, infligindo o Inclinação Derrubado em qualquer um pego na explosão. Água: Se o changeling cria água com este Contrato, triplica a área que pode transformar.",
    exceptionalSuccess: "",
    page: 116,
  },
  "h-courts:restringing-the-loom": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "Isto não pode sunder destinos inerentes ao assunto, apenas aqueles impostos sobre eles por magia exterior, como o Girando Roda e Horóscopo Contratos, ou habilidades estranhas, como bruxaria mago ou feitiços fantasmagóricos. Este tipi cally provoca um Confronto de Vontades, que o changeling adiciona seus pontos Manto. Fogo: Opondo-se ao Confronto de Vontades não se beneficia de truques de dados (por exemplo, a qualidade 10 novamente). Terra: Pode usar um dos seus Atributos de Resistência para calcular o seu Confronto de Wills em vez de um Atributos Finesse. Ar: O confronto de Wills do changeling se beneficia da qualidade 8 novamente. Água: Opondo-se ao Confronto de Vontades não adiciona nenhum bônus de duração ao rolo.",
    exceptionalSuccess: "",
    page: 116,
  },
  "h-courts:all-roads-closed": {
    action:
      "Prolongada (meta de 10 sucessos; cada teste representa um minuto)",
    duration: "Um capítulo",
    success:
      "À medida que acumula sucessos, o changeling impregna com Glamour uma área em raio de Manto × 2 quilômetros ao redor de um local que já tenha visitado. Estradas, trilhas e outros caminhos que conduzem ao local passam a apresentar obstáculos e perigos. Qualquer viajante que tente superá-los deve gastar 1 Força de Vontade apenas para tentar e sofre penalidade igual ao Manto do changeling nos testes relevantes. Ao fim da duração, mortais afetados esquecem ou racionalizam os acontecimentos. Na Sebe, trate o efeito como uma mudança de paradigma: o changeling pode realizar alterações sem gastar sucessos, até o número de sucessos obtidos na ativação.",
    exceptionalSuccess:
      "O changeling percebe qualquer pessoa dentro da área de efeito que esteja tentando encontrar ou atacar o local defendido. Sabe sua localização e progresso pelos obstáculos, mas não sua identidade.",
    page: 133,
  },
  "h-courts:cast-out": {
    action: "Disputada",
    duration: "",
    success:
      "O changeling força a Sebevia mais próxima da área imediata a se abrir e expulsa o oponente através dela, fazendo-o entrar ou sair da Sebe conforme apropriado. A Sebevia fecha imediatamente e não responde aos apelos ou ao Glamour da vítima durante a duração, deixando-a presa no outro reino. Se houver várias Sebevias na área, o changeling escolhe qual se abre.",
    exceptionalSuccess:
      "A expulsão é especialmente violenta; se desejar, o changeling causa dano contundente igual ao seu Manto à vítima.",
    page: 134,
  },
  "h-courts:create-path": {
    action:
      "Prolongada (10 sucessos; cada teste representa um turno de Moldagem da Sebe)",
    duration: "Especial",
    success:
      "A magia transforma a Sebe e cria uma nova trilha. A graduação da trilha é igual ao Manto do changeling e ela permanece até que ele conclua sua jornada. O changeling determina o destino ao ativar o Contrato. A trilha não fica oculta e outras criaturas podem utilizá-la. O changeling precisa estar na Sebe para invocar o Contrato.",
    exceptionalSuccess:
      "Pode definir quaisquer marcos ao longo da trilha, garantindo algum grau de segurança.",
    page: 134,
  },
  "h-courts:escape-route": {
    action: "Instantânea",
    duration: "",
    success:
      "Ao abrir um portal para entrar ou sair da Sebe por portalização, ele se abre sem exigir uma solicitação. Assim que o changeling atravessa, o portal se fecha, impedindo perseguição. Durante a duração, somente a Chave do portal pode abri-lo; Glamour não basta. Gastando 1 Força de Vontade, o changeling também pode determinar onde o portal se abrirá nessa ocasião, exceto em um local seguro onde não seja bem-vindo. Depois disso, a próxima pessoa que abrir o portal chegará ao destino normal dele.",
    exceptionalSuccess: "",
    page: 134,
  },
  "h-courts:labyrinth": {
    action: "Disputada",
    duration: "Turnos iguais ao Manto",
    success:
      "As percepções da vítima se transformam em um labirinto ilusório, prendendo-a temporariamente na própria mente. Ela não pode realizar ações Físicas nem recebe Defesa. Qualquer dano a liberta imediatamente. A cada turno subsequente, pode tentar escapar disputando Perseverança + Fado contra os sucessos obtidos pelo changeling na ativação; mesmo escapando assim, sofre a Inclinação Atordoado. Quando se liberta, se for changeling, sofre um ataque de Lucidez com dados iguais ao Manto do atacante; em seguida, o cortesão Direcional sofre seu próprio ataque de Lucidez com 3 dados.",
    exceptionalSuccess:
      "A vítima permanece presa pelo restante da cena e não pode escapar antecipadamente por conta própria; sofrer dano ainda a liberta normalmente.",
    page: 135,
  },
  "h-courts:harmony-enforced": {
    action: "Disputada",
    duration: "",
    success:
      "Todos em um raio de Fado × 10 do changeling recebem a Inclinação Derrotado durante a duração. Narrativamente, ficam menos hostis, mas o Contrato não resolve discussões ou conflitos em andamento; apenas impede a violência física. Se o changeling que causou a Inclinação cometer violência, Derrotado termina.",
    exceptionalSuccess:
      "Os participantes ficam mais dispostos a resolver o conflito. O changeling recebe +2 em testes Sociais para apaziguar a situação.",
    page: 137,
  },
  "h-courts:one-with-the-elements": {
    action: "Instantânea",
    duration: "",
    success: "O changeling torna-se imune às Inclinações Ambientais presentes no momento da ativação; novas Inclinações exigem uma nova ativação. Além disso, pode tentar redirecionar para outra pessoa o dano que o Contrato impediria. Sempre que sofreria dano de uma Inclinação, escolhe uma vítima em seu campo de visão e disputa Manipulação + Sobrevivência + Manto contra Vigor + Fado. Se vencer, a vítima sofre o dano que o changeling teria recebido.",
    exceptionalSuccess: "",
    page: 137,
  },
  "h-courts:shifting-balance": {
    action: "Instantânea",
    duration: "",
    success:
      "Para cada ponto de Manto + 1, o changeling pode transferir um ponto de Defesa, Iniciativa ou Velocidade de um personagem disposto para outro desses mesmos traços, inclusive os seus. Nenhum traço pode ser reduzido a zero, e um personagem só pode ser afetado uma vez por cena. O Contrato afeta apenas valores naturais, não bônus de drogas ou poderes sobrenaturais. Sociedade da Manhã: ao usá-lo em outra pessoa, aprende sua Agulha e Fio ou equivalente. Sociedade do Dia: também pode transferir pontos de Habilidades, mas apenas dentro da mesma categoria. Sociedade da Noite: também pode comprar armadura geral, ao custo de dois pontos transferidos por nível.",
    exceptionalSuccess: "",
    page: 138,
  },
  "h-courts:steal-harmony": {
    action: "Resistida",
    duration: "Ações iguais aos sucessos",
    success:
      "Escolha uma categoria de Habilidades da vítima: Mental, Física ou Social. Durante um número de ações igual aos sucessos obtidos, qualquer ação do alvo que utilize uma Habilidade dessa categoria sofre penalidade igual ao Manto do changeling.",
    exceptionalSuccess:
      "Pode escolher uma segunda categoria de Habilidades para ser afetada.",
    page: 138,
  },
  "h-courts:weaponize-m-ob": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling faz um discurso ou grito de mobilização que transforma uma pessoa ou organização da área imediata em alvo da ira coletiva, impondo a Inclinação Motim. O alvo principal sofre o dano normal da Inclinação; todos os demais sofrem metade desse dano. O changeling, porém, é a origem evidente do caos.",
    exceptionalSuccess: "A multidão entra em frenesi e o dano da Inclinação torna-se letal.",
    page: 138,
  },
  "h-courts:davy-jones-locker": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling transforma o ambiente em uma poderosa tempestade de ventos e ondas. Ela ameaça todos, exceto o próprio changeling e a embarcação em que estiver, dentro do corpo d'água ou de um raio de 100 × Manto metros, o que for menor. Por padrão, impõe Chuva Pesada. Por +1 Glamour, pode impor Inundado a uma embarcação ou estrutura; quem ficar completamente submerso passa a sofrer Afogamento. Por mais +1 Glamour, detritos causam dano contundente igual ao Manto a todos expostos a cada dois turnos; armadura e Durabilidade reduzem o dano, mas Defesa não.",
    exceptionalSuccess:
      "A tempestade também impõe Ambiente Extremo com graduação igual à metade do Manto, arredondada para cima.",
    page: 141,
  },
  "h-courts:dredge-the-depths": {
    action: "Instantânea",
    duration: "Instantânea",
    success:
      "A magia cobre uma área de até 100 × Manto metros. O changeling define o que conta como 'valioso' — por exemplo, suprimentos médicos, comida ou bens monetários — e descobre um tesouro mundano por sucesso, limitado pelo Manto. Os objetos tornam-se evidentes para ele e podem ser recuperados facilmente. Segurança mundana é automaticamente superada; segurança ou ocultação mágica provoca Confronto de Vontades.",
    exceptionalSuccess:
      "Descobre tesouros adicionais iguais à metade do Manto, arredondada para cima.",
    page: 142,
  },
  "h-courts:gone-by-the-board": {
    action: "Instantânea",
    duration: "Especial",
    success:
      "Um único objeto perdido, nomeado na ativação, começa a encontrar seu caminho de volta ao proprietário. O percurso pode ser indireto e estranho, mas o item retorna no máximo em uma semana. Maré Alta: em vez disso, pode dificultar que alguém encontre seu objeto perdido, impondo o Manto do changeling como penalidade em todos os testes para localizá-lo até a próxima maré alta.",
    exceptionalSuccess: "",
    page: 142,
  },
  "h-courts:red-sky-at-m-orning": {
    action: "Instantânea",
    duration: "Até o próximo nascer do sol",
    success:
      "O Contrato permanece adormecido até que o changeling esteja prestes a enfrentar uma ameaça iminente. Então, o céu ou teto fica vermelho vivo para quem consegue ver através da Máscara, avisando sobre o perigo com antecedência em minutos igual ao Manto, sem revelar sua natureza. Após o aviso, o changeling e até Manto outros Perdidos não podem ser surpreendidos e recebem +3 em Iniciativa e Defesa. Maré Alta: pode estender esses bônus a mais Manto changelings da Maré Alta em boa posição. Maré Vazante: permite que personagens incapazes de ver através da Máscara percebam o aviso e recebam os benefícios. Maré Baixa: por 1 Glamour, revela a natureza da ameaça. Maré de Enchente: o aviso ocorre uma cena inteira antes.",
    exceptionalSuccess: "",
    page: 143,
  },
  "h-courts:red-sky-at-night": {
    action: "Instantânea",
    duration: "",
    success:
      "O changeling oferece algum tipo de entretenimento, seja por seus próprios talentos ou fornecendo a ocasião. Até 2 × Manto participantes recuperam 1 ponto gasto de Força de Vontade e recebem a Condição Inspirado. Maré Alta: até Inspirado ser resolvido, o cortesão recebe +2 em testes para colher Glamour de um alvo. Maré Vazante: recupera dois pontos gastos de Força de Vontade dos participantes. Maré Baixa: aprende a Virtude/Fio ou equivalente de cada participante. Maré de Enchente: pode conceder Determinado em vez de Inspirado, escolhendo separadamente para cada alvo.",
    exceptionalSuccess: "",
    page: 143,
  },
  "h-courts:always-solvent": {
    action: "Instantânea",
    duration: "Especial",
    success:
      "O changeling coloca a mão em um bolso, bolsa ou outro recipiente que esteja carregando e retira a moeda apropriada ao comércio local. Em áreas mundanas, normalmente é dinheiro corrente; em economias de escambo, surge algo que a maioria dos presentes aceitaria em troca. Em um Mercado Goblin, surge o Lien usado naquele mercado; se o Lien for Glamour ou outra obrigação efêmera, o objeto criado é apenas sua representação e deve ser usado numa transação. O Contrato produz o bastante para uma compra significativa: em transações mundanas, Disponibilidade igual a Manto + 1, máximo 5; em Mercados Goblin, essa mesma quantidade de instâncias do Lien. Tudo que não for gasto se desfaz em folhas e detritos quando o changeling deixa a área.",
    exceptionalSuccess: "",
    page: 146,
  },
  "h-courts:cook-the-books": {
    action: "Reflexiva",
    duration: "",
    success:
      "O changeling só pode invocar este Contrato quando sua Dívida Goblin é cobrada. Ele pode negar a cobrança sem receber um ponto adicional de Dívida, e o Narrador não pode gastar Dívida contra ele novamente durante a duração. Se usar o Contrato mais de uma vez no mesmo capítulo, após pagar o custo role cumulativamente um dado para cada uso adicional; qualquer resultado 1 ou 10 faz o Contrato falhar e o Glamour gasto é perdido.",
    exceptionalSuccess: "",
    page: 146,
  },
  "h-courts:if-two-are-dead": {
    action: "Disputada",
    duration: "Uma história",
    success:
      "Os alvos não podem mais compartilhar detalhes do acordo com qualquer pessoa que não esteja envolvida nele; até meios incomuns de comunicação, como telepatia, falham. O efeito não pode ser encerrado antecipadamente. O changeling gasta 1 Glamour por pessoa afetada, todas devem estar presentes, uma delas deve ser o próprio changeling e todas precisam conhecer informações sobre o acordo. O jogador faz um único teste e compara seus sucessos aos de cada alvo; um alvo pode escolher não resistir.",
    exceptionalSuccess: "O changeling pode recuperar o ponto de Força de Vontade gasto para invocar o Contrato.",
    page: 146,
  },
  "h-courts:raise-the-band": {
    action: "Instantânea",
    duration: "Até o próximo nascer ou pôr do sol, o que ocorrer primeiro",
    success:
      "O changeling solta um grito de convocação que ecoa pela Sebe local. Ele recebe Dívida Goblin igual a 10 − Manto e aplica a Inclinação Ambiental Bando de Hobgoblins à área durante a duração. Os hobgoblins chegam em poucos turnos através de Sebevias próximas. O changeling precisa ter em mente um objetivo que envolva violência em defesa da fortaleza; caso contrário, o Contrato não produz efeito. O bando causa dano letal por turno igual ao Manto do changeling, distribuído entre os adversários; Defesa não se aplica, mas armadura funciona normalmente.",
    exceptionalSuccess: "",
    page: 147,
  },
  "h-courts:supply-and-demand": {
    action: "Disputada",
    duration: "",
    success:
      "O comerciante aceita algo pertencente ao changeling como pagamento por mercadorias à venda. Isso não impede que cobre caro, omita defeitos ou escolha como pagamento algo que o changeling preferiria não entregar. Em um Mercado Goblin, pressionar o comerciante dessa forma não viola as leis do mercado, mas concede ao changeling a Condição Notoriedade naquele mercado. Comerciantes não feéricos tendem a exigir pagamentos mais mundanos, embora isso não torne a troca necessariamente mais fácil.",
    exceptionalSuccess: "Além de aceitar o pagamento, o comerciante oferece as mercadorias com desconto.",
    page: 147,
  },
  "h-seemings:discreet-summons": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 103,
  },
  "h-seemings:m-astermind-s-gambit": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 103,
  },
  "h-seemings:pipes-of-the-beastcaller": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 103,
  },
  "h-seemings:the-royal-court": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 104,
  },
  "h-seemings:spinning-wheel": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 104,
  },
  "h-seemings:changeling-hours": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:dance-of-the-toys": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:hidden-reality": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:stealing-the-solid-reflection": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:tatterdemalion-s-workshop": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 105,
  },
  "h-seemings:book-of-seemings-props-and-scenery": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:reflections-of-the-past": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:riddle-kith": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:skinmask": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:unravel-the-tapestry": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 107,
  },
  "h-seemings:fortifying-presence": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:hedgewall": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:pure-clarity": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:vow-of-no-compromise": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:whispers-of-m-orning": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 108,
  },
  "h-seemings:chrysalis": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:flickering-hours": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:leaping-toward-nightfall": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:m-irror-walk": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:talon-and-wing": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 110,
  },
  "h-seemings:elemental-fury": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 111,
  },
  "h-seemings:oathbreaker-s-punishment": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 111,
  },
  "h-seemings:red-revenge": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 111,
  },
  "h-seemings:relentless-pursuit": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 112,
  },
  "h-seemings:thief-of-reason": {
    action: "",
    duration: "",
    success: "",
    exceptionalSuccess: "",
    page: 112,
  },
  "h-seemings:down-the-hatch": {
    action: "Instantânea",
    duration: "Um dia",
    success:
      "Engole e armazena sem dano um objeto sólido de Tamanho 1. Ao fim do efeito ou ao encerrá-lo, regurgita o objeto intacto. Objetos sobrenaturais ainda podem produzir efeitos a critério do Narrador.",
    exceptionalSuccess: "",
    page: 138,
  },
  "h-seemings:first-taste": {
    action: "Instantânea",
    duration: "Uma cena",
    success:
      "Requer ter provado o alvo. Testes para rastrear, perceber ou localizar o alvo recebem qualidade rote.",
    exceptionalSuccess: "O efeito dura um dia.",
    page: 138,
  },
  "h-seemings:gnawing-jaw": {
    action: "Instantânea",
    duration: "",
    success:
      "Os dentes ignoram a Durabilidade de objetos mordidos. Não aumenta o dano da mordida; combinado com Tearing Teeth, permite ignorar armadura mundana.",
    exceptionalSuccess: "",
    page: 139,
  },
  "h-seemings:hollow-guts": {
    action: "Instantânea",
    duration: "Um dia",
    success:
      "O alvo recebe a Condição Privado. Pode resolvê-la antecipadamente passando uma cena inteira comendo; se a duração terminar antes disso, a Condição desaparece sem conceder Beat. Criaturas com fome sobrenatural podem sofrer efeitos adicionais a critério do Narrador.",
    exceptionalSuccess: "O alvo não pode encerrar a Condição antecipadamente comendo.",
    page: 139,
  },
  "h-seemings:tearing-teeth": {
    action: "Reflexiva",
    duration: "",
    success:
      "Recebe uma mordida +1 letal, utilizável sem estabelecer agarrão.",
    exceptionalSuccess: "",
    page: 139,
  },
  "h-seemings:carrion-feast": {
    action: "Instantânea",
    duration: "",
    success: "Requer que o changeling e convidados consumam durante uma cena a carne de uma única criatura de Tamanho 2+. Cada participante cura dano igual ao Tamanho da criatura: primeiro rebaixa dano agravado para letal, depois letal para contundente e, por fim, cura completamente o dano contundente restante. Para cada convidado além do changeling, custa +1 Glamour e o Tamanho mínimo da criatura aumenta em 1.",
    exceptionalSuccess: "",
    page: 139,
  },
  "h-seemings:no-escape": {
    action: "Disputada",
    duration: "Um turno",
    success:
      "Cria um vórtice à frente por até Fado metros. Objetos soltos de Tamanho 1–2 são destruídos. Objetos até Tamanho 5 também são destruídos se os sucessos superarem sua Durabilidade; objetos de Tamanho 6+ sofrem dano à Estrutura igual à metade dos sucessos, arredondada para cima. Criaturas que perdem a disputa sofrem dano letal igual à diferença de sucessos; se o dano for igual ou maior que seu Tamanho, são puxadas para o vórtice. Um changeling nessa situação pode gastar 1 Glamour para portalizar para a Sebe. Mortos pelo Contrato contam como consumidos para outros Contratos de Maw; um Forgotten também recupera Glamour.",
    exceptionalSuccess:
      "Recupera 1 Força de Vontade.",
    page: 140,
  },
  "h-seemings:starvation-s-savagery": {
    action: "Disputada",
    duration: "",
    success: "O alvo recebe Berserk, +1 em paradas Físicas, 8-again em agarrões e ignora penalidades de ferimento. Permanece assim até o efeito terminar ou consumir Tamanho 2 de carne fresca. Pode usar em si mesmo sem teste de resistência. Criaturas com fomes sobrenaturais entram ou podem entrar em seus estados equivalentes, conforme suas regras.",
    exceptionalSuccess: "Para encerrar o efeito comendo, o alvo precisa consumir Tamanho 4 de carne.",
    page: 140,
  },
  "h-seemings:swallow-whole": {
    action: "Disputada",
    duration: "",
    success:
      "Requer estar agarrando um alvo de Tamanho igual ou menor. Engole o alvo, causando 5 de dano contundente. Enquanto engolido, ele fica cego, surdo e totalmente contido, sem sofrer dano adicional. O changeling sofre −1 Destreza e Defesa, só pode carregar um alvo e pode regurgitá-lo a qualquer momento, impondo Atordoado. Se sofrer no tronco dano superior ao próprio Vigor, regurgita o alvo e ambos ficam Atordoados. Um changeling engolido pode gastar Glamour para portalizar para a Sebe e escapar sem Atordoado.",
    exceptionalSuccess:
      "Pode transformar o dano inicial em letal.",
    page: 141,
  },
  "h-seemings:you-are-who-you-eat": {
    action: "Instantânea",
    duration: "Uma semana",
    success:
      "Requer carne reconhecível de alvo Tamanho 4+. O benefício depende da parte consumida: olho, +1 no maior Atributo Mental; mão ou pé, +1 no maior Atributo Físico; língua, +1 no maior Atributo Social; pele, a Máscara copia aparência e voz do alvo; cérebro, acessa suas memórias e recebe Memória Eidética para elas; coração, +1 Fado e, se o alvo for changeling, acesso a um Contrato Real dele escolhido pelo Narrador, ou, se for outro ser sobrenatural, um Mérito Sobrenatural apropriado. Méritos obtidos não recebem Santidade dos Méritos. Pode manter benefícios de partes diferentes simultaneamente, mas apenas um de cada tipo; nova ativação com a mesma parte substitui a anterior.",
    exceptionalSuccess: "",
    page: 142,
  },
  "h-seemings:find-the-cracks": {
    action: "Instantânea",
    duration: "",
    success:
      "Com um toque, identifica falhas do alvo. Em objeto: descobre Durabilidade, Estrutura, qualidade de fabricação e natureza real se estiver disfarçado; seus ataques contra ele ignoram Durabilidade igual ao Fado. Em changeling: descobre Agulha, Fio, dano atual de Lucidez, maior Fragilidade, um Touchstone escolhido pelo Narrador e se possui Dependência ou Obsessão, incluindo o objeto dessas Condições. Em outros seres, substitui por traços equivalentes.",
    exceptionalSuccess: "",
    page: 150,
  },
  "h-seemings:last-hope": {
    action:
      "Instantânea",
    duration: "",
    success: "Cria, dentro de uma zona de desastre, um bolsão de segurança de até Fado metros quadrados de diâmetro. Inclinações Ambientais e ambientes extremos ao redor ficam suprimidos dentro da área e sobre quem estiver nela. O caos externo abafa pedidos de socorro e dificulta enxergar para dentro ou para fora. Entrar ou sair sem permissão exige Vigor + Esportes contra Força + Fado do Disaster; cada tentativa, bem-sucedida ou não, causa 1 dano letal.",
    exceptionalSuccess: "",
    page: 145,
  },
  "h-seemings:killing-the-cat": {
    action: "Instantânea",
    duration: "Cenas iguais ao Fado",
    success:
      "Enquanto durar, quando um mortal invade o território do Stalker — definido por sua bênção, Lugar Seguro ou Mérito semelhante — ele recupera 1 Força de Vontade. Se o jogador aceitar, também recebe a Condição Arrepiado e o Stalker recupera 1 Força de Vontade. Esse ganho é adicional a outras recuperações de Força de Vontade.",
    exceptionalSuccess: "",
    page: 157,
  },
  "h-seemings:the-troll-toll": {
    action: "Instantânea",
    duration: "Indefinida",
    success:
      "Ao barrar uma travessia com um único ponto de entrada ou saída, impede viajantes que tentem cruzá-la de alcançar o destino declarado até derrotarem, enganarem, negociarem ou de outro modo superarem o Troll e cruzarem seu caminho. Podem viajar para outros destinos, mas voltar a buscar o destino bloqueado os conduz novamente ao Troll. Contratos ou poderes sobrenaturais usados para alcançar o destino provocam Confronto de Vontades contra Força + Fado do Troll; em falha, o viajante não pode tentar novamente com esse poder por um mês. O Troll pode encerrar o efeito a qualquer momento. Não funciona para barrar Caçadores.",
    exceptionalSuccess:
      "Cada vítima precisa gastar 1 Força de Vontade para conseguir deixar a travessia do Troll.",
    page: 160,
  },
};
