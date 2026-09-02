export type KithDefinition = {
  id: string;
  name: string;
  skill: string;
  description: string;
  blessing: string;
  source: string;
  page: number;
};

const kith = (name:string, skill:string, description:string, blessing:string, source:string, page:number):KithDefinition => ({
  id: name.toLocaleLowerCase("en-US").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""), name, skill, description, blessing, source, page,
});

export const KITHS: KithDefinition[] = [
  kith("Absinthial","Ofícios","Fadas verdes que destilam as bebidas oníricas de Arcádia.","Uma vez por cena, gaste Glamour e teste Presença + Ofícios contra Compostura + Tolerância Sobrenatural para incapacitar alguém com a névoa dos sonhos.","Kith & Kin",88),
  kith("Airtouched","Atletismo","Changelings desconectados do restante do mundo, que viveram nos céus de Arcádia.","Gaste Glamour para reduzir muito seu peso efetivo, tornando possíveis feitos impossíveis de equilíbrio.","Kith & Kin",107),
  kith("Antiquarian","Empatia","Guardiões de segredos e repositórios vivos de conhecimento.","Gaste Glamour e teste Inteligência + Compostura para buscar dentro de si a resposta para uma pergunta.","Dark Eras 2",69),
  kith("Apoptosome","Diversas","Perdidos obrigados a lutar e morrer repetidamente em isolamento.","Ao enfrentar quem já o derrotou, gaste Glamour para causar um ponto de dano agravado; quando ferido, pode causar um ponto agravado adicional tanto em si quanto nos oponentes.","Kith & Kin",116),
  kith("Artist","Ofícios","Criadores cujos corpos se tornaram um só com seu meio artístico.","Gaste Glamour para manifestar ferramentas de uma Especialização de Ofícios, usando seu Fado como bônus de equipamento.","Changeling the Lost",51),
  kith("Asclepian","Medicina","Curandeiros que trabalham com peças improvisadas.","Gaste Glamour e teste Inteligência + Medicina para realizar cirurgias impossíveis com objetos comuns, ocultados pela Máscara.","Kith & Kin",103),
  kith("Bearskin","Intimidação ou Armas Brancas","Soldados de Arcádia dedicados às causas que consideram importantes.","Gaste Glamour para substituir uma Aspiração de um oponente derrotado ou acuado por uma de suas próprias Aspirações.","Kith & Kin",111),
  kith("Beastcaller","Empatia com Animais","Perdidos ligados às feras goblin.","Gaste Glamour e obtenha sucesso em Presença + Empatia com Animais + Fado para dominar o corpo de uma fera goblin, sofrendo os mesmos ferimentos que ela.","Kith & Kin",112),
  kith("Becquerel","Furtividade","Perdidos radioativos.","Durante uma manobra de agarrar, gaste Glamour para queimar o alvo com radiação e impor as Complicações Atordoado ou Envenenado enquanto mantiver a manobra.","Kith & Kin",117),
  kith("Blightbent","Doença ou Veneno","Perdidos permanentemente maculados por venenos e poluição.","Gaste Glamour para impor a Complicação Envenenado ao obter sucesso numa manobra de agarrar.","Kith & Kin",117),
  kith("Bricoleur","Ofícios ou Expressão","Manipuladores engenhosos de símbolos e conexões.","Com um objeto apropriado, gaste Glamour e teste Raciocínio + Persuasão para alterar uma verdade central sobre si por um número de dias igual ao Fado.","Kith & Kin",98),
  kith("Bridgeguard","Intimidação","Changelings que lutam contra probabilidades impossíveis e se destacam quando estão em menor número.","Quando estiver em menor número, gaste Glamour para somar Compostura + Intimidação à Defesa e ignorar a penalidade por múltiplos ataques.","Kith & Kin",104),
  kith("Bright One","Socialização","Radiantes e luminosos, acesos pela chama interior de suas paixões.","Sua luz é ocultada pela Máscara. Gaste Glamour para emitir um clarão que causa dano contundente e impõe −2 em ações Físicas e Mentais por um turno.","Changeling the Lost",52),
  kith("Chalomot","Empatia","Batedores da Gentry nas Estradas dos Sonhos, especialistas em invadir Bastiões.","Gaste Glamour para somar metade do Fado aos testes de tecelagem onírica; Glamour adicional estende a bênção a outros sonhadores.","Kith & Kin",107),
  kith("Chatelaine","Empatia","Produtos de treinamento interminável em protocolo e serviço doméstico.","Gaste Glamour e teste Manipulação + Socialização para empregar Méritos Sociais de outro personagem, de modo que ele se recorde das ações como se fossem suas.","Changeling the Lost",52),
  kith("Chevalier","Persuasão ou Intimidação","Changelings conectados à própria montaria, animal ou veículo.","Gaste Glamour para criar um vínculo com veículo ou montaria; gaste outro ponto para chamar reflexivamente seu Nobre Corcel.","Kith & Kin",107),
  kith("Chimera","Subterfúgio","Changelings animalescos costurados com partes de muitas feras de Arcádia.","Escolha um Contrato Goblin a cada história; usá-lo não gera Débito Goblin.","Changeling the Lost Jumpstart / Dark Eras 2",47),
  kith("Cleverquick","Ocultismo","Trapaceiros cuja Duração aperfeiçoou astúcia e intriga.","Gaste Glamour para intuir fragilidade, interdição ou perdição de um inimigo; por três pontos, imponha uma delas temporariamente ao inimigo e a si mesmo.","Dark Eras 2",368),
  kith("Climacteric","Investigação","Relógios climáticos e meteorologistas que aprisionaram o tempo nos elementos.","No início da Iniciativa, gaste Glamour para fazer outra pessoa agir antes de todos.","Kith & Kin",88),
  kith("Cloakskin","Social","Perdidos solitários com Máscara invisível.","Gaste Glamour e obtenha sucesso em Presença + Furtividade + Fado para também tornar sua Aparência feérica invisível.","Kith & Kin",98),
  kith("Concubus","Empatia","Companheiros noturnos e tecelões de sonhos que cuidavam das mentes dos Outros.","Cure Condições mentais de um sonhador por meio de uma série de mudanças de paradigma oníricas.","Kith & Kin",89),
  kith("Cyclopean","Investigação","Perdidos transformados em gigantes ou estruturas magníficas, muitas vezes marcados por deficiência.","Gaste Glamour para descobrir pontos fracos, reduzir penalidades contra alvos definidos e elevar o dano para letal.","Kith & Kin",112),
  kith("Delver","Investigação","Mineradores de coisas preciosas.","Gaste Glamour para enviar uma mensagem a qualquer número de pessoas a até Fado milhas, ou para decodificar mensagens assim enviadas.","Kith & Kin",93),
  kith("Doppelganger","Empatia","Ladrões de traços familiares.","Gaste Glamour para roubar temporariamente traços visuais ou auditivos de alguém e incorporá-los à sua Máscara.","Kith & Kin",99),
  kith("Draconic","Briga ou Armas Brancas","Changelings que evoluíram em grandiosas feras guardiãs.","Gaste Glamour para voar por Fado turnos ou, com a Máscara despida, assustar outros e fazê-los fugir.","Kith & Kin",90),
  kith("Dryad","Sobrevivência","Aqueles que passaram a Duração como criaturas de jardins e vegetação.","Escondido entre folhagens, gaste Glamour para somar Fado à Furtividade; permanecendo imóvel, pode desaparecer.","Dark Eras 2",70),
  kith("Enkrateia","Empatia, Persuasão ou Subterfúgio","Vozes da razão para seus Guardiões, conselheiros e mediadores de Arcádia.","Em investigações, só começa a perder dados no terceiro teste.","Kith & Kin",118),
  kith("Farwalker","Sobrevivência","Patrulheiros do ermo, perfeitamente à vontade na natureza.","Na natureza, gaste Glamour para criar temporariamente um Local Seguro que abriga metade do Fado em pessoas; Glamour adicional amplia a capacidade.","Kith & Kin",108),
  kith("Flowering","Socialização","Perdidos que viveram entre a flora de Arcádia e assimilaram seu fascínio passivo.","Gaste Glamour e teste Presença + Empatia para liberar perfume; presentes resistem com Compostura + Tolerância Sobrenatural ou ficam vulneráveis à sua influência.","Kith & Kin",90),
  kith("Flickerflash","Atletismo","Perdidos feitos para correr depressa demais.","Gaste Glamour para triplicar seu Deslocamento.","Kith & Kin",110),
  kith("Ghostheart","Percepção","Psicopompos e coveiros enviados para cuidar dos mortos.","Receba três pontos de Aliados fantasmagóricos, com Numina escolhidas.","Kith & Kin",91),
  kith("Glimmerwisp","Persuasão","Névoas de Faerie que encobrem atos vergonhosos e monstruosos.","Gaste Glamour para criar névoa perfumada; presentes resistem a Manipulação + Persuasão + Fado com Perseverança + Compostura ou deixam de perceber atos vergonhosos e pontos de ruptura.","Kith & Kin",94),
  kith("Gravewight","Empatia ou Intimidação","Perdidos ligados à morte.","Gaste Glamour para ver e ouvir fantasmas no Crepúsculo; fantasmas aparecem com mais frequência perto de você.","Kith & Kin",119),
  kith("Gremlin","Ofícios","Perfeccionistas que destroem impulsivamente criações defeituosas.","Uma vez por cena, gaste Glamour para tornar instantânea uma ação prolongada de desmontar ou destruir algo.","Kith & Kin",94),
  kith("Gristlegrinder","Briga","Monstros consumidos pela fome e assombrados pelo gosto de carne.","Morda causando dano letal sem agarrar; gaste Glamour e teste Vigor + Sobrevivência para engolir inteiro algo ou alguém de Tamanho menor.","Changeling the Lost",53),
  kith("Helldiver","Furto","Espiões e exploradores presos a Faerie por um cordão de prata.","Gaste Glamour e teste Destreza + Ocultismo para transitar gradualmente entre a matéria e o estado efêmero de um fantasma da Sebe.","Changeling the Lost",53),
  kith("Hunterheart","Investigação","Caçadores que escaparam de uma Duração de predação sangrenta.","Gaste Glamour e confronte Presença + Fado contra Compostura + Tolerância Sobrenatural para paralisar ou afugentar alguém com o olhar.","Changeling the Lost",54),
  kith("Leechfinger","Medicina","Parasitas secretos que drenam a força vital alheia.","Em contato físico, gaste Glamour para causar dano contundente e rebaixar dano próprio; contra changelings, ambos os efeitos podem valer dois pontos.","Changeling the Lost",55),
  kith("Lethipomp","Empatia","Coletores sem emoção de lembranças dolorosas.","Gaste Glamour e confronte Compostura + Empatia + Fado para absorver as emoções de uma lembrança, recebendo uma Condição relacionada e podendo incitar outros a revivê-la.","Kith & Kin",99),
  kith("Levinquick","Computação","Batedores e mensageiros inquietos de paisagens digitais.","Gaste Glamour e teste Raciocínio + Atletismo + Fado para viajar por redes conectadas por terra a até Fado milhas; Glamour adicional leva companheiros.","Kith & Kin",110),
  kith("Librorum","Intimidação","Defensores de bibliotecas e do conhecimento.","Gaste Glamour e teste Inteligência + Ocultismo + Fado para meditar e recordar conhecimentos da biblioteca de seu Guardião.","Kith & Kin",104),
  kith("Liminal","Sobrevivência ou Manha","Defensores de limiares.","Ao declarar uma condição diante de um limiar, gaste Glamour para impor a Condição Perdido a quem a desobedecer.","Kith & Kin",105),
  kith("Lullescent","Furtividade","Ouvintes silenciosos de audição extraordinária.","Gaste Glamour para usar ecolocalização; Raciocínio + Ocultismo + Fado pode até revelar o que magia esconde.","Kith & Kin",100),
  kith("Manikin","Socialização","Telas vivas para a arte da Gentry.","Gaste Glamour e teste Presença + Ofícios para elevar a qualidade aparente de objetos em ações sociais e fazer qualquer traje parecer adequado.","Kith & Kin",95),
  kith("Mirrorskin","Furtividade","Perdidos que aprenderam a esvaziar a própria natureza e tornar-se qualquer pessoa ou ninguém.","Gaste Glamour e teste Raciocínio + Subterfúgio + Fado para remodelar Máscara e Aparência feérica.","Changeling the Lost",55),
  kith("Moonborn","Empatia ou Intimidação","Perdidos instigados a paixões selvagens para divertir seus Guardiões.","Uma vez por capítulo, incite o Desvario sem gastar Força de Vontade, substituindo Fado por Expressão.","Kith & Kin",92),
  kith("Muse","Manto","Changelings cuja influência se manifesta por sua beleza.","Gaste Glamour e faça uma ação Social adequada para conceder bônus à obra de arte ou arquitetura de um humano.","Dark Eras 2",70),
  kith("Nightsinger","Expressão","Sereias e vocalistas cujas canções moviam a própria terra de Faerie.","Gaste Glamour e confronte Presença + Expressão + Fado contra Compostura + Tolerância Sobrenatural para deixar a plateia imóvel e extasiada.","Changeling the Lost",56),
  kith("Notary","Política","Humanos usados como documentos vivos para os juramentos da Gentry.","Uma vez por sessão, presida uma promessa para anular seu custo em Glamour e memorizar perfeitamente seus termos.","Changeling the Lost",57),
  kith("Nymph","Atletismo","Changelings que habitavam os oceanos e cursos d’água de Faerie.","Respire debaixo d’água e mova-se nela com o dobro do Deslocamento.","Dark Eras 2",70),
  kith("Oculus","Persuasão","Diplomatas e negociadores capazes de fazer outros enxergarem sua perspectiva.","Gaste Glamour e confronte Presença + Persuasão + Fado contra Perseverança + Tolerância Sobrenatural para tornar seu caminho a única opção percebida.","Kith & Kin",95),
  kith("Playmate","Persuasão","Amigos, bichos de estimação e brinquedos que sobreviviam por amor e confiança.","Gaste Glamour para curar dano não agravado de alguém, assumindo-o como dano de Lucidez.","Changeling the Lost",57),
  kith("Plaguesmith","Medicina","Perdidos moldados como armas biológicas.","Ao tocar um alvo, gaste Glamour para infectá-lo com uma Praga Arcadiana cujos sintomas refletem os Títulos do Guardião.","Kith & Kin",113),
  kith("Polychromatic","Empatia","Perdidos coloridos e chamativos, hábeis em agitar e acalmar emoções.","Uma vez por capítulo, gaste Glamour para criar cores hipnóticas que impõem Enfeitiçado e penalizam tentativas de resistir à sua Empatia.","Kith & Kin",96),
  kith("Razorhand","Briga","Perdidos cujas mãos foram substituídas ou equipadas com lâminas.","Gaste Glamour para transformar uma mão numa faca 1L usada com Briga; outro ponto transforma ambas.","Kith & Kin",114),
  kith("Reborn","Ocultismo","Changelings mortos e trazidos de volta repetidamente.","Quando ferido, gaste Glamour e teste Inteligência + Ocultismo para redistribuir pontos de Perícias por uma cena; um ponto de Força de Vontade torna a mudança permanente.","Kith & Kin",105),
  kith("Riddleseeker","Investigação","Mestres de enigmas.","Gaste Glamour e teste Raciocínio + Expressão + Fado para convencer um alvo a resolver uma discussão ou conflito por meio de um enigma.","Kith & Kin",100),
  kith("Sandharrowed","Sobrevivência","Perdidos que sobreviveram aos desertos de Arcádia.","Antes de atacar com Briga ou Armas Brancas, gaste Glamour para prender o oponente numa coluna de areia, impondo Imobilizado e fornecendo cobertura.","Kith & Kin",115),
  kith("Shadowsoul","Subterfúgio","Perdidos ligados às estrelas e à noite.","Receba afinidade com a Regalia Espelho; um sucesso excepcional em um ataque impõe Cegueira temporária.","Kith & Kin",119),
  kith("Sideromancer","Ocultismo","Adivinhos do Fado.","Gaste Glamour e teste Raciocínio + Ocultismo + Fado para prever resultados de juramentos, promessas e dívidas nesta cena.","Kith & Kin",101),
  kith("Snowskin","Subterfúgio","Aqueles que escaparam de Faerie apagando o próprio calor e congelando-se.","Gaste Glamour e confronte Presença + Intimidação + Fado contra Compostura + Tolerância Sobrenatural para impor Abalado e afastar alguém da sociedade feérica.","Changeling the Lost",58),
  kith("Spiegelbild","Persuasão","Conselheiros que habitam espelhos.","Gaste Glamour para entrar e esconder-se num espelho, ficando obrigado a responder com a verdade enquanto estiver dentro.","Kith & Kin",102),
  kith("Stoneflesh","Intimidação","Changelings duráveis de determinação e pele endurecidas.","Gaste Glamour e teste Vigor + Atletismo + Fado para aumentar Armadura, Perseverança e/ou Compostura.","Kith & Kin",106),
  kith("Swarmflight","Furtividade","Perdidos capazes de dissolver-se em um enxame de animais, objetos ou fenômenos.","Gaste Glamour para dissolver seu corpo na forma de enxame.","Kith & Kin",110),
  kith("Swimmerskin","Briga","Sereias e seus semelhantes.","Respire ar e água naturalmente; gaste Glamour para fundir as pernas numa cauda, dobrar o Deslocamento aquático e ignorar penalidades submersas.","Kith & Kin",111),
  kith("Telluric","Condução ou Manha","Corpos celestes e estrelas sobre Arcádia.","Gaste Glamour para arremessar fogo estelar com Destreza + Atletismo, causando dano como uma chama pequena de grande calor.","Kith & Kin",120),
  kith("Uttervoice","Intimidação","Changelings cuja frustração afiou a voz como uma lâmina.","Gaste Glamour e confronte Presença + Fado contra Compostura + Tolerância Sobrenatural para causar dano contundente e estilhaçar vidro apenas com a voz.","Kith & Kin",92),
  kith("Valkyrie","Persuasão ou Intimidação","Perdidos obrigados a decidir quem vive ou morre nos campos de batalha de Arcádia.","Gaste Glamour e teste Raciocínio + Ocultismo + Fado contra Perseverança + Tolerância Sobrenatural para amaldiçoar inimigos ou abençoar aliados com Condições apropriadas.","Kith & Kin",115),
  kith("Veneficus","Sobrevivência","Herbalistas e cozinheiros de Faerie.","Gaste Glamour para tornar comestível uma planta tóxica ou tornar tóxica uma planta comestível.","Kith & Kin",97),
  kith("Venombite","Briga","Perdidos tornados venenosos por ressentimentos mesquinhos.","Antes de atacar com Briga, gaste Glamour para causar dano letal e impor a Complicação grave Envenenado em caso de sucesso.","Kith & Kin",116),
  kith("Whisperwisp","Mentiras","Espiões e sabotadores.","Some o Fado e receba 9-de-novo em testes de Furtividade ou Persuasão.","Kith & Kin",120),
  kith("Wisewitch","Persuasão","Changelings permanentemente tocados pelo Título de um Guardião.","Pode firmar promessas com espíritos e anjos.","Kith & Kin",106),
  kith("Witchtooth","Intimidação","Eremitas reclusos que conhecem o poder da terra.","Gaste Glamour e teste Perseverança + Intimidação para remodelar a terra e penalizar testes de Sobrevivência.","Kith & Kin",97),
];

export function findKith(name:unknown) {
  const wanted=String(name??"").trim().toLocaleLowerCase("en-US");
  return KITHS.find((item)=>item.name.toLocaleLowerCase("en-US")===wanted);
}
