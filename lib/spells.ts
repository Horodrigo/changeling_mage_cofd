export interface SpellDefinition { id:string; name:string; originalName:string; requirements:Record<string,number>; practice:string; primaryFactor:string; withstand:string; roteSkills:string[]; description?:string; sourceId:string; source:string; page:number }
export const SPELLS: SpellDefinition[] = [
  {
    "id": "mta-2ed:initiate-of-death-ectoplasmic-shaping",
    "name": "Moldagem Ectoplásmica do Iniciado da Morte",
    "originalName": "Initiate of Death Ectoplasmic Shaping",
    "requirements": {
      "Death": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Furto"
    ],
    "description": "O mago pode moldar uma manifestação ectoplasmática, seja conjurada por outro mago ou por um fantasma Materializado, embora a pessoa ou fantasma que controla o ectoplasma possa Resistir à formação. Após uma conjuração bem-sucedida, o mago molda o ectoplasma na forma que desejar. O ectoplasma permanece na nova forma durante a duração do feitiço. Ele pode usá-lo para criar um espelho que reflete fantasmas e outras estruturas no Crepúsculo fantasmagórico em uma determinada área. Além disso, o mago pode usar o ectoplasma para criar a Condição Aberta em um objeto ou local para um fantasma se manifestar. Fantasmas perdem a Condição Manifestada quando a Duração do feitiço termina.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129
  },
  {
    "id": "mta-2ed:deepen-shadows",
    "name": "Aprofundar sombras",
    "originalName": "Deepen Shadows",
    "requirements": {
      "Death": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Intimidação",
      "Expressão"
    ],
    "description": "O mago pode influenciar as sombras na área de efeito do feitiço, aprofundando a escuridão e tornando a área quase completamente escura. A área é afetada pela Inclinação Ambiental de Luz Fraca durante a duração do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129
  },
  {
    "id": "mta-2ed:forensic-gaze",
    "name": "Olhar Forense",
    "originalName": "Forensic Gaze",
    "requirements": {
      "Death": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Investigação",
      "Expressão"
    ],
    "description": "O mago pode determinar o estado de um cadáver. Ela determina o método exato de sua morte, bem como exatamente quando ele morreu. Para cada nível de Potência, o mago revela fatores que contribuem para a causa da morte. Por exemplo, um homem encontrado queimado em um carro pode ter morrido por asfixia, mas pode ter ficado assim porque estava inconsciente devido a um ferimento na cabeça ao bater o carro em uma árvore enquanto dirigia bêbado.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129
  },
  {
    "id": "mta-2ed:shadow-sculpting",
    "name": "Escultura de Sombra",
    "originalName": "Shadow Sculpting",
    "requirements": {
      "Death": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ciência",
      "Expressão"
    ],
    "description": "O mago pode moldar e moldar as sombras na área de efeito. Ele pode moldar as sombras em qualquer semelhança de sua escolha. A área deve ter sombras presentes para que o mago possa moldá-las.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129
  },
  {
    "id": "mta-2ed:soul-marks",
    "name": "Marcas da Alma",
    "originalName": "Soul Marks",
    "requirements": {
      "Death": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Medicamento",
      "Ocultismo",
      "Empatia"
    ],
    "description": "O mago pode determinar a saúde da alma de uma pessoa. Ela pode determinar uma marca de alma por Potência do feitiço lançado. Ele pode discernir a presença de Condições Persistentes, se o alvo estiver Desperto, se o alvo for um ser sobrenatural, se o alvo tiver criado uma pedra da alma (veja \"Pedras da Alma\" p. 98), se o alvo tiver sua alma adulterada, se o alvo estiver Possuído, a presença de qualquer Gnose 5+ Conquistas de Legado, se o alvo tiver comido ou consumido a alma de outra pessoa, ou se o alvo estiver sofrendo de uma Condição de Paradoxo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129
  },
  {
    "id": "mta-2ed:speak-with-the-dead",
    "name": "Fale com os mortos",
    "originalName": "Speak with the Dead",
    "requirements": {
      "Death": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Socializar",
      "Expressão",
      "Investigação"
    ],
    "description": "O mago é capaz de sentir e se comunicar com fantasmas em Crepúsculo. Ela pode sentir todos os fantasmas dentro da área de efeito e é capaz de se comunicar com eles simplesmente falando, desde que o fantasma seja capaz de entender o idioma que ela fala. Ela pode sentir âncoras na área sem usar a Visão do Mago da Morte. Ela pode se concentrar em um único fantasma dentro",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129
  },
  {
    "id": "mta-2ed:apprentice-of-death-corpse-mask",
    "name": "Máscara de Cadáver do Aprendiz da Morte",
    "originalName": "Apprentice of Death Corpse Mask",
    "requirements": {
      "Death": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Subterfúgio",
      "Ofícios",
      "Medicamento"
    ],
    "description": "O mago altera a aparência de um corpo para torná-lo diferente, mesmo sob exame minucioso. Ela pode lançar o feitiço em um cadáver, modificando completamente seus ferimentos, o tempo aparente e a causa da morte. Ela pode fazer com que um cadáver carbonizado pareça ter morrido de ataque cardíaco, ou uma pessoa que morreu em um acidente de carro pareça ter sido vítima de uma facada.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130
  },
  {
    "id": "mta-2ed:decay",
    "name": "Decadência",
    "originalName": "Decay",
    "requirements": {
      "Death": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Subterfúgio",
      "Ciência",
      "Ocultismo"
    ],
    "description": "O mago degrada um objeto material, fazendo com que ele envelheça em questão de momentos. A Durabilidade do objeto é reduzida em –1 para cada Potência lançada pelo feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130
  },
  {
    "id": "mta-2ed:ectoplasm",
    "name": "Ectoplasma",
    "originalName": "Ectoplasm",
    "requirements": {
      "Death": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Expressão",
      "Acadêmicos"
    ],
    "description": "O mago pode criar ectoplasma (veja Modelagem Ectoplasmática, acima) a partir de um de seus próprios orifícios, ou do orifício de um cadáver – normalmente o nariz ou a boca, mas às vezes os canais lacrimais ou as orelhas. O mago pode moldar o ectoplasma na forma que desejar. O ectoplasma mantém sua forma durante a duração do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130
  },
  {
    "id": "mta-2ed:ghost-shield",
    "name": "Escudo Fantasma",
    "originalName": "Ghost Shield",
    "requirements": {
      "Death": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Manha",
      "Subterfúgio",
      "Sobrevivência"
    ],
    "description": "O lançador cria um escudo que protege seu alvo de Numina fantasmagórica, Influências, Manifestações, feitiços de Morte e quaisquer poderes relacionados à morte de outras criaturas sobrenaturais. Qualquer poder que tente perfurar o escudo provoca um teste de Confronto de Vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130
  },
  {
    "id": "mta-2ed:shape-ephemera",
    "name": "Forma Efêmera",
    "originalName": "Shape Ephemera",
    "requirements": {
      "Death": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "Vigor",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ciência"
    ],
    "description": "O lançador pode remodelar coisas efêmeras sintonizadas com a Morte de um objeto em um objeto inteiramente novo. Esta coisa efêmera pode ser de um fantasma ou outra entidade em Crepúsculo, mas eles têm a habilidade de Resistir ao feitiço, e serem remodelados não danificam o Corpus da entidade. O objeto ganha Durabilidade 2. Se for uma arma, ele ganha uma classificação de arma 2; se for uma armadura, ele ganha uma classificação de armadura de 2. Objetos feitos de coisas efêmeras só são úteis contra outros objetos ou seres feitos de coisas efêmeras ou dentro do Crepúsculo. Objetos feitos desta forma podem ser usados ​​por qualquer entidade efêmera em Crepúsculo, incluindo fantasmas ou um mago que se transformou em coisas efêmeras (Veja “Ghost Gate” p. 130).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130
  },
  {
    "id": "mta-2ed:soul-armor",
    "name": "Armadura de Alma",
    "originalName": "Soul Armor",
    "requirements": {
      "Death": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "Este feitiço protege a alma do alvo contra todos que possam profaná-la. Qualquer feitiço ou efeito que possa remover, manipular ou ferir a alma do alvo deve primeiro vencer um Confronto de Vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130
  },
  {
    "id": "mta-2ed:soul-jar",
    "name": "Jarra de Alma",
    "originalName": "Soul Jar",
    "requirements": {
      "Death": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Persuasão"
    ],
    "description": "O mago cria um receptáculo para uma alma deslocada. O frasco da alma pode ser qualquer coisa projetada para conter e selar um líquido, desde uma lata de tinta até uma garrafa de água. Uma alma colocada no jarro de almas não pode escapar e está protegida de ataques externos. Se o jarro for aberto ou quebrado antes do término da duração do feitiço, a alma será liberada. + 1",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130
  },
  {
    "id": "mta-2ed:suppress-life",
    "name": "Suprimir Vida",
    "originalName": "Suppress Life",
    "requirements": {
      "Death": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Subterfúgio",
      "Medicamento",
      "Acadêmicos"
    ],
    "description": "O mago pode suprimir os sinais de vida do alvo; o sujeito aparece para todos os efeitos como se estivesse morto. Todos os sintomas físicos da morte parecem se instalar e a alma parece ausente do corpo para os sentidos mágicos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131
  },
  {
    "id": "mta-2ed:touch-of-the-grave",
    "name": "Toque do Túmulo",
    "originalName": "Touch of the Grave",
    "requirements": {
      "Death": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Sobrevivência",
      "Ofícios",
      "Persuasão"
    ],
    "description": "O mago pode interagir fisicamente com fantasmas e outras coisas em Crepúsculo sintonizado com a Morte. Ela pode “puxar” itens de Twilight, tornando-os visíveis e sólidos; esses itens têm durabilidade 1 e se dissipam em coisas efêmeras se quebrados ou após o término da duração do feitiço. Itens retirados de Crepúsculo funcionam como suas contrapartes materiais, concedendo os mesmos bônus de equipamento.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131
  },
  {
    "id": "mta-2ed:without-a-trace",
    "name": "Sem deixar vestígios",
    "originalName": "Without a Trace",
    "requirements": {
      "Death": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ciência",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "As pessoas constantemente perdem pele morta, cabelos e outras pequenas evidências de si mesmas à medida que passam pelo mundo. O mago esconde todas as evidências físicas da observação casual. Durante a duração do feitiço, o alvo não deixa impressões digitais, pegadas, vestígios de sangue ou qualquer outra evidência forense de si mesmo. Usar a Visão do Mago da Morte para procurar tais sinais provoca um Confronto de Vontades. •••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131
  },
  {
    "id": "mta-2ed:disciple-of-death-cold-snap",
    "name": "Discípulo da Morte Onda de Frio",
    "originalName": "Disciple of Death Cold Snap",
    "requirements": {
      "Death": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Sobrevivência",
      "Intimidação",
      "Ciência"
    ],
    "description": "O mago dissipa o calor na área de efeito do feitiço, causando a formação de geada e gelo no chão e nas superfícies expostas. Durante a duração do feitiço, todas as superfícies na área estarão sob os efeitos da Inclinação de Gelo (pág. 321). + 1",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131
  },
  {
    "id": "mta-2ed:damage-ghost",
    "name": "Dano Fantasma",
    "originalName": "Damage Ghost",
    "requirements": {
      "Death": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Intimidação",
      "Briga"
    ],
    "description": "O mago pode causar dor a um fantasma. Ela causa um ferimento contundente no Corpus do fantasma por Potência do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131
  },
  {
    "id": "mta-2ed:devouring-the-slain",
    "name": "Devorando os mortos",
    "originalName": "Devouring the Slain",
    "requirements": {
      "Death": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Intimidação",
      "Medicamento",
      "Persuasão"
    ],
    "description": "O mago pode atrair para si a energia do sofrimento do alvo. O mago escolhe, no momento da conjuração, colher Força de Vontade ou destruir o Padrão do alvo em busca de Mana. O alvo deve ter pelo menos uma caixa de Saúde preenchida com dano letal ou agravado. Para cada nível de Potência, o mago pode pegar um ponto de Força de Vontade (até os pontos de Força de Vontade restantes do alvo), ou ele pode Examinar o Padrão do alvo em busca de um ponto de Mana, causando um de dano letal no processo, fazendo com que as feridas existentes se abram e apodreçam. Usar este feitiço conta para o limite de vezes por dia que um mago pode ganhar Mana através da Limpeza. + 1",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131
  },
  {
    "id": "mta-2ed:ghost-gate",
    "name": "Portão Fantasma",
    "originalName": "Ghost Gate",
    "requirements": {
      "Death": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Acadêmicos",
      "Expressão"
    ],
    "description": "O mago cria um plano bidimensional que funciona como um portal, convertendo qualquer coisa que se mova através dele em Crepúsculo. Enquanto estiver em Crepúsculo, a pessoa pode interagir e ver objetos e seres efêmeros sintonizados com a Morte. Os itens podem ser transportados através do portão, mas isso destrói suas formas materiais, embora possam ser recuperados mais tarde com \"Touch of the Grave\".",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131
  },
  {
    "id": "mta-2ed:ghost-summons",
    "name": "Invocação de Fantasmas",
    "originalName": "Ghost Summons",
    "requirements": {
      "Death": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "Classificação",
    "roteSkills": [
      "Persuasão",
      "Socializar",
      "Ocultismo"
    ],
    "description": "O mago envia um chamado para o fantasma mais próximo dentro de seu alcance sensorial. Alternativamente, ela pode invocar fantasmas que conhece pessoalmente. Ela pode enviar uma chamada geral e o fantasma mais próximo atenderá, ou pode especificar o tipo de fantasma, como uma criança ou uma mulher. O fantasma não pode viajar além do permitido pela sua Âncora. O feitiço não funciona em fantasmas acima do Rank 5.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132
  },
  {
    "id": "mta-2ed:quicken-corpse",
    "name": "Acelerar Cadáver",
    "originalName": "Quicken Corpse",
    "requirements": {
      "Death": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Ofícios",
      "Persuasão"
    ],
    "description": "O lançador pode animar um cadáver, criando um servo zumbi leal. Um zumbi tem capacidade mental limitada e pode entender comandos simples de uma ou duas palavras e nada mais. É uma construção estúpida e sem alma, imune ao medo, à dor, à exaustão, à intimidação ou à coerção, e segue as ordens do criador sem se importar consigo mesmo. As capacidades físicas do cadáver ficam prejudicadas, tornando-o lento e desajeitado em comparação com uma pessoa viva. Os construtos não são adequados para combate (e não possuem Defesa), mas contam como Lacaios valendo pontos iguais à Potência do feitiço com um “campo” relacionado aos comandos do mago. Os zumbis têm tanta saúde quanto a criatura viva de onde veio o cadáver, mas sofrem danos como se estivessem sob os efeitos da Armadura do Mago da Morte. Eles não ficam inconscientes devido a danos, nem sangram quando recebem dano letal, e só são destruídos quando sua última caixa de Saúde é preenchida com dano agravado.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132
  },
  {
    "id": "mta-2ed:quicken-ghost",
    "name": "Acelerar Fantasma",
    "originalName": "Quicken Ghost",
    "requirements": {
      "Death": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Persuasão",
      "Socializar",
      "Medicamento"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132
  },
  {
    "id": "mta-2ed:rotting-flesh",
    "name": "Carne Apodrecendo",
    "originalName": "Rotting Flesh",
    "requirements": {
      "Death": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Empatia"
    ],
    "description": "O toque do mago apodrece em seu alvo, fazendo com que sua carne e ossos murchem e se deteriorem. Cada nível de Potência causa um ponto de dano contundente ao alvo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133
  },
  {
    "id": "mta-2ed:sever-soul",
    "name": "Cortar Alma",
    "originalName": "Sever Soul",
    "requirements": {
      "Death": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Intimidação",
      "Atletismo",
      "Expressão"
    ],
    "description": "O mago arranca a alma de um Adormecido, lançando-o no Crepúsculo. Enquanto estiver sem alma, o sujeito sofre da Condição Sem Alma (p. 318). Quando a Duração do feitiço termina, a alma do Adormecido retorna para ele, a menos que seja impedido de escapar, como no caso de ficar preso em um jarro de alma ou dentro de outro corpo (veja \"Jarro de Alma\" p. 129). Se este feitiço for lançado em um alvo que já esteja sob os efeitos da Condição Sem Alma, ele será elevado à Condição Enervado (pág. 315) – embora o mago não obtenha acesso imediato à sua alma, uma vez que ela já está desaparecida.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133
  },
  {
    "id": "mta-2ed:shadow-crafting",
    "name": "Criação de sombras",
    "originalName": "Shadow Crafting",
    "requirements": {
      "Death": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Intimidação",
      "Ocultismo"
    ],
    "description": "O lançador pode moldar e endurecer sombras em formas sólidas e tridimensionais. O objeto ganha Durabilidade 2. Se for uma arma, ele ganha uma classificação de arma 2; se for armadura, ganha uma classificação de armadura 2; caso contrário, o objeto ganha +2 de bônus de equipamento. Objetos feitos de sombra mantêm uma aparência sombria e não projetam sombra própria. ••••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133
  },
  {
    "id": "mta-2ed:adept-of-death-enervation",
    "name": "Adepto da Enervação da Morte",
    "originalName": "Adept of Death Enervation",
    "requirements": {
      "Death": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "Vigor",
    "roteSkills": [
      "Ocultismo",
      "Intimidação",
      "Subterfúgio"
    ],
    "description": "O mago faz com que os músculos do alvo parem de funcionar, quebrando as conexões entre músculos, ligamentos e tendões. O feitiço impõe a inclinação Leg Wrack ou a inclinação Arm Wrack ao alvo enquanto o feitiço permanece ativo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133
  },
  {
    "id": "mta-2ed:exorcism",
    "name": "Exorcismo",
    "originalName": "Exorcism",
    "requirements": {
      "Death": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "Classificação",
    "roteSkills": [
      "Briga",
      "Expressão",
      "Ocultismo"
    ],
    "description": "Este feitiço destrói o domínio de um fantasma sobre o mundo. Este feitiço retira um número de Condições de Manifestação do fantasma (ou de seu hospedeiro) igual à Potência do feitiço. O efeito é Duradouro, mas o espírito pode usar suas Influências e Manifestações para restabelecer as Condições normais. Adicionar Mente ou Espírito ••••: Os efeitos do feitiço se estendem a Goetia ou Espíritos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133
  },
  {
    "id": "mta-2ed:revenant",
    "name": "Regressado",
    "originalName": "Revenant",
    "requirements": {
      "Death": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Classificação",
    "roteSkills": [
      "Ofícios",
      "Briga",
      "Intimidação"
    ],
    "description": "O mago pode conceder a um fantasma uma Condição de Manifestação (veja p. 258). O mago pode conceder um número de Condições igual à Potência do feitiço e também deve criar quaisquer Condições de pré-requisito, se elas ainda não estiverem presentes. A entidade entra imediatamente na Manifestação de escolha do mago e não pode sair dela enquanto o feitiço permanecer em vigor. Magos costumam usar esse feitiço para permitir que fantasmas possuam seus próprios cadáveres, criando seres mortos-vivos chamados revenants. Adicionar Mente ou Espírito ••••: Os efeitos do feitiço se estendem a Goetia ou Espíritos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133
  },
  {
    "id": "mta-2ed:shadow-flesh",
    "name": "Carne Sombria",
    "originalName": "Shadow Flesh",
    "requirements": {
      "Death": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Vigor",
    "roteSkills": [
      "Ocultismo",
      "Medicamento",
      "Subterfúgio"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133
  },
  {
    "id": "mta-2ed:withering",
    "name": "Murchando",
    "originalName": "Withering",
    "requirements": {
      "Death": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Intimidação",
      "Medicamento",
      "Ciência"
    ],
    "description": "O mago faz com que o corpo do alvo murche e atrofie em instantes, causando um ponto de dano letal por nível de Potência do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 134
  },
  {
    "id": "mta-2ed:master-of-death-create-anchor",
    "name": "Mestre da Morte Cria Âncora",
    "originalName": "Master of Death Create Anchor",
    "requirements": {
      "Death": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Persuasão"
    ],
    "description": "O mago aplica uma versão universalmente aplicável da Condição Âncora a um alvo, utilizável por qualquer fantasma. Se o mago também tiver um fantasma como alvo adicional, esse fantasma se torna ancorado na nova Âncora, assim como na sua própria.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 134
  },
  {
    "id": "mta-2ed:create-avernian-gate",
    "name": "Criar Portão Averno",
    "originalName": "Create Avernian Gate",
    "requirements": {
      "Death": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Ofícios",
      "Persuasão"
    ],
    "description": "O mago abre o mundo material para o Submundo, criando uma Íris entre o mundo material e as camadas superiores do Submundo dentro da área de efeito. Abrir o portão faz com que a área ganhe uma Ressonância da Morte e a Condição de Portal durante a duração do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 134
  },
  {
    "id": "mta-2ed:create-ghost",
    "name": "Criar Fantasma",
    "originalName": "Create Ghost",
    "requirements": {
      "Death": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Expressão",
      "Acadêmicos"
    ],
    "description": "O mago cria um fantasma em Twilight. Ela pode moldar o fantasma como um eco de outra pessoa, viva ou morta, embora o fantasma não seja a pessoa real. O fantasma é criado no Rank 1 e permanece durante a duração do feitiço como o servo leal do mago, e ele é capaz de direcioná-lo para realizar ações sem o uso de quaisquer feitiços adicionais.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 134
  },
  {
    "id": "mta-2ed:deny-the-reaper",
    "name": "Negar o Ceifador",
    "originalName": "Deny the Reaper",
    "requirements": {
      "Death": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "O mago é capaz de reverter os efeitos da entropia em seu alvo, até mesmo trazendo os mortos de volta à vida. O mago reverte os efeitos da decadência, restaurando o alvo ao seu estado físico anterior até um mês por Potência do feitiço. Em um sujeito vivo, o feitiço pode restaurar a visão, o uso dos membros, revertendo danos irreparáveis ​​e restaurando todas as funções corporais. Em assuntos inanimados, o feitiço pode restaurar fotos destruídas pelo tempo, tornar livros antigos imaculados ou devolver aparelhos eletrônicos antigos ao funcionamento.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 134
  },
  {
    "id": "mta-2ed:empty-presence",
    "name": "Presença Vazia",
    "originalName": "Empty Presence",
    "requirements": {
      "Death": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Subterfúgio",
      "Persuasão",
      "Furtividade"
    ],
    "description": "O mago destrói a presença do alvo no mundo, removendo qualquer evidência de sua vida ou existência. Qualquer tentativa de ver o sujeito através de meios mundanos de detecção ou observação falha completamente. Ela não apenas é invisível a olho nu, mas as evidências de sua vida são apagadas. Todas as portas que ela possa ter aberto durante interações sociais com outras pessoas, seja para si mesma ou para outra pessoa, são removidas. Todas as suas Condições, e todas as Condições aplicáveis ​​a ela (exceto as Condições Paradoxo), são resolvidas sem conceder Batidas. Enquanto estiver invisível, o alvo não pode realizar ações violentas e evidentes sem quebrar a ilusão da magia. Danificar ou quebrar objetos fisicamente, ou atacar alguém, faz com que o feitiço termine imediatamente. Magos que usam Visão de Mago Ativa fazem um teste de Confronto de Vontades contra o alvo, e o uso de Visão de Mago Focada a revela ao mago que a usa. As condições não retornam quando o feitiço termina, mas as Portas retornam aos seus estados anteriores.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 134
  },
  {
    "id": "mta-2ed:sever-the-awakened-soul",
    "name": "Cortar a Alma Desperta",
    "originalName": "Sever the Awakened Soul",
    "requirements": {
      "Death": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Ofícios",
      "Intimidação",
      "Medicamento"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 134
  },
  {
    "id": "mta-2ed:initiate-of-fate-interconnections",
    "name": "Iniciado das Interconexões do Destino",
    "originalName": "Initiate of Fate Interconnections",
    "requirements": {
      "Fate": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Empatia",
      "Investigação",
      "Medicamento"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 135
  },
  {
    "id": "mta-2ed:oaths-fulfilled",
    "name": "Juramentos cumpridos",
    "originalName": "Oaths Fulfilled",
    "requirements": {
      "Fate": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Política",
      "Investigação"
    ],
    "description": "Nos contos populares, as bruxas sempre parecem saber quando seus súditos cumprem (ou violam) os termos de um acordo. Esta magia notifica o mago quando um destino específico se abate sobre seu alvo – seja o alvo a vítima ou o ator. Este evento desencadeador deve ser algo que o mago poderia perceber se estivesse presente (por exemplo, o alvo sofre um ferimento, vai ao banheiro, quebra sua palavra, fala o nome do mago, etc.).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136
  },
  {
    "id": "mta-2ed:quantum-flux",
    "name": "Fluxo Quântico",
    "originalName": "Quantum Flux",
    "requirements": {
      "Fate": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Armas de fogo",
      "Ocultismo"
    ],
    "description": "O mago lê probabilidades e compensa fatores deletérios, atraindo pequenos momentos de boa sorte para negar obstáculos infelizes que estejam em seu caminho. Isto nega penalidades a qualquer uma das ações do alvo igual à Potência por um número de ações durante a Duração igual à Potência. Além disso, o alvo pode passar um turno durante a Duração do feitiço visando uma ação. O alvo perde qualquer Defesa e deve permanecer imóvel enquanto mira. Um turno gasto com mira concede um bônus para a próxima ação igual à Potência. Esses efeitos só podem ser aplicados a ações instantâneas mundanas; ações estendidas e testes de conjuração não se beneficiam.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136
  },
  {
    "id": "mta-2ed:reading-the-outmost-eddies",
    "name": "Lendo os redemoinhos extremos",
    "originalName": "Reading the Outmost Eddies",
    "requirements": {
      "Fate": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Computador",
      "Persuasão",
      "Subterfúgio"
    ],
    "description": "Este feitiço concede uma pequena bênção ou maldição que atrai boa ou má sorte ao seu alvo. Enquanto o feitiço permanecer ativo, o alvo experimentará um evento nas próximas 24 horas, como encontrar US$ 20 ou deixar cair sua carteira em uma poça. O mago pode exercer controle limitado sobre a natureza da fortuna (ou infortúnio), mas em última análise o destino decide os detalhes. Aplicações hostis deste feitiço são Resistidas pela Compostura.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136
  },
  {
    "id": "mta-2ed:serendipity",
    "name": "Serendipidade",
    "originalName": "Serendipity",
    "requirements": {
      "Fate": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ofícios",
      "Sobrevivência"
    ],
    "description": "Este feitiço concede ao mago um vislumbre momentâneo de todos os caminhos potenciais que seu destino pode seguir até o destino desejado, o que permite ao mago identificar o próximo passo que ele deve dar para cumprir um objetivo declarado. Ao conjurar, o mago recebe um presságio claro que sugere um curso de ação que o levará mais perto de seu objetivo. Isto raramente garante sucesso imediato, especialmente se a tarefa que tem pela frente for complicada, mas pode proporcionar um avanço importante.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136
  },
  {
    "id": "mta-2ed:apprentice-of-fate-exceptional-luck",
    "name": "Aprendiz do Destino Sorte Excepcional",
    "originalName": "Apprentice of Fate Exceptional Luck",
    "requirements": {
      "Fate": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Socializar"
    ],
    "description": "O mago abençoa os esforços do alvo ou o amaldiçoa com infortúnio. Seja boa ou ruim, a sorte do sujeito é verdadeiramente excepcional. Este feitiço concede uma bênção ou inflige um feitiço no alvo (veja pág. 134). O alvo pode Resistir a um feitiço com Compostura.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136
  },
  {
    "id": "mta-2ed:fabricate-fortune",
    "name": "Fabricar Fortuna",
    "originalName": "Fabricate Fortune",
    "requirements": {
      "Fate": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Furto",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Às vezes, um mago deseja esconder um filho do destino daqueles que abusariam de seu dom. Outras vezes, ele deseja convencer os observadores de que um sujeito tem um destino que não tem. Este feitiço esconde ou falsifica destinos e Destino. Ele pode ser usado para \"enganar\" durações condicionais ou feitiços com gatilhos condicionais para que ignorem um evento que atenda à condição definida ou para que ajam como se o evento estipulado tivesse acontecido. Pode criar falsos presságios em relação ao alvo quando ele é examinado pela magia do Destino. Todos estes enganos provocam um choque de vontades contra aqueles que tentam superar as suas protecções.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137
  },
  {
    "id": "mta-2ed:fools-rush-in",
    "name": "Os tolos correm",
    "originalName": "Fools Rush In",
    "requirements": {
      "Fate": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Socializar",
      "Manha"
    ],
    "description": "De acordo com a velha sabedoria, o destino favorece as crianças e os tolos, e este feitiço torna verdadeiro o velho ditado. Contanto que o alvo tenha pouco ou nenhum conhecimento detalhado sobre uma situação antes de entrar nela, a magia permite que ele aja com graça e timing perfeitos. Um ou dois turnos de estudo da cena antes de agir são aceitáveis, mas um reconhecimento extensivo ou um briefing detalhado não permite o grau necessário de aleatoriedade que esta magia exige. O alvo não sofre penalidades se não for treinado durante a duração do feitiço. Ao entrar em uma situação social desconhecida, o nível de impressão do sujeito também melhora em um.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137
  },
  {
    "id": "mta-2ed:lucky-number",
    "name": "Número da sorte",
    "originalName": "Lucky Number",
    "requirements": {
      "Fate": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Furto",
      "Ciência"
    ],
    "description": "A probabilidade de adivinhar corretamente um número de telefone, uma senha ou uma combinação de cadeado na primeira tentativa é mínima, mas não impossível. Este feitiço permite ao mago fazer exatamente isso simplesmente inserindo dados em um dispositivo apropriado (um campo de senha, um telefone, uma combinação segura, etc.). Além de quaisquer benefícios da história, o mago ganha a Condição Informado no próximo lançamento relevante que se beneficia do conhecimento adquirido através deste feitiço. Esta magia usa o dispositivo de entrada como alvo, e o mago se concentra no que está tentando realizar. Não requer simpatia nem mesmo para aplicações como adivinhar o número de telefone de uma determinada pessoa; a mágica se aplica às probabilidades de entrada aleatória, em vez de localizar um alvo. Embora ligue para o telefone disponível mais próximo da pessoa que o mago está tentando alcançar, o feitiço não informa ao conjurador onde esse telefone está.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137
  },
  {
    "id": "mta-2ed:shifting-the-odds",
    "name": "Mudando as probabilidades",
    "originalName": "Shifting the Odds",
    "requirements": {
      "Fate": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Política",
      "Subterfúgio"
    ],
    "description": "Um Aprendiz do Destino sempre tem acesso ao que precisa no momento. O mago se concentra em localizar um determinado tipo de pessoa, lugar ou coisa, e esta magia direciona seus passos para lá de forma infalível o mais rápido possível nas próximas 24 horas, desde que a magia permaneça ativa. Lançar o feitiço procurando por um tipo de pessoa no meio de uma multidão ou um item em qualquer lugar onde ele possa aparecer geralmente é suficiente para ter sucesso imediato. A magia pode encontrar alguém com uma Característica, ocupação ou qualidade específica do contexto (por exemplo, “policial corrupto”), mas apenas localiza o sujeito mais próximo ou mais disponível que corresponda à descrição fornecida pelo mago, nunca uma pessoa ou objeto específico (embora o destino às vezes reúna rostos familiares). Alternativamente, o mago ganha acesso temporário a certas Qualidades Sociais (Aliado, Contatos, Mentor, Recursos ou Retentor) com um nível não superior a Potência. O destino a guia para dinheiro perdido, itens mundanos abandonados ou estranhos úteis que ela pode facilmente convencer a lhe fazer um favor rápido. O mago pode se beneficiar desta Qualidade um número de vezes não maior que a Potência, após o que o dinheiro acaba ou o aliado da conveniência segue seu próprio caminho, a menos que o personagem do mago gaste Experiências para comprar a Qualidade.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137
  },
  {
    "id": "mta-2ed:warding-gesture",
    "name": "Gesto de proteção",
    "originalName": "Warding Gesture",
    "requirements": {
      "Fate": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Briga",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "O mago cria uma proteção protegendo o alvo contra efeitos sobrenaturais que manipulam seu destino — um geas, uma compulsão sobrenatural para agir contra sua vontade ou ter seu destino manipulado pela magia do Destino ou efeitos sobrenaturais similares. Cada tentativa de mudar o destino do alvo provoca um Confronto de Vontades com o mago. Este feitiço não tem efeito sobre alterações pré-existentes no destino do alvo. Além disso, o mago pode excluir seletivamente o alvo de qualquer magia de efeito de área que ele lançar. Se lançada em múltiplos alvos, esta magia permite ao mago excluir cada alvo válido caso a caso. + 1",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137
  },
  {
    "id": "mta-2ed:disciple-of-fate-grave-misfortune",
    "name": "Discípulo do Destino Grave Infortúnio",
    "originalName": "Disciple of Fate Grave Misfortune",
    "requirements": {
      "Fate": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Armamento"
    ],
    "description": "Este feitiço atrai infortúnio para o alvo ou torna uma situação já prejudicial consideravelmente pior. Na próxima vez que o alvo sofrer pelo menos um ponto de dano durante a Duração deste feitiço, aumente o dano que ele sofre pela Potência do feitiço. Em vez disso, um golpe de raspão esmaga um osso, por exemplo. O tipo de dano é o mesmo da fonte original do dano. Isso afeta um número máximo de ataques igual à Potência durante a duração do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138
  },
  {
    "id": "mta-2ed:monkey-s-paw",
    "name": "Pata de Macaco",
    "originalName": "Monkey's Paw",
    "requirements": {
      "Fate": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Dirigir",
      "Ofícios",
      "Ciência"
    ],
    "description": "O mago interage com um objeto sem vida, trazendo a sorte para ele e tornando-o uma ferramenta do destino. O mago abençoa ou amaldiçoa o objeto. O bônus de equipamento do objeto é aumentado ou diminuído pela Potência do feitiço, o que pode fazer com que ele se torne uma penalidade de dados se movido abaixo de zero. O feitiço não pode fazer com que o bônus ou penalidade exceda cinco dados.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138
  },
  {
    "id": "mta-2ed:shared-fate",
    "name": "Destino Compartilhado",
    "originalName": "Shared Fate",
    "requirements": {
      "Fate": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Medicamento",
      "Persuasão",
      "Política"
    ],
    "description": "O destino é um instrumento de justiça e punição. Este feitiço entrelaça os destinos de dois sujeitos. O que quer que aconteça a um assunto afeta o outro. Sempre que um alvo sofre dano, uma Inclinação ou uma Condição indesejada, quaisquer outros também sofrem. Se a Escala não for aumentada ao lançar este feitiço, o próprio mago será tratado como um alvo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138
  },
  {
    "id": "mta-2ed:superlative-luck",
    "name": "Sorte Superlativa",
    "originalName": "Superlative Luck",
    "requirements": {
      "Fate": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Ofícios",
      "Ocultismo"
    ],
    "description": "O mago pode garantir sucesso em praticamente qualquer tarefa que se proponha realizar. O alvo ganha a qualidade mecânica em um número de jogadas de dados mundanos igual à Potência. O jogador do sujeito pode escolher quais de seus lançamentos serão afetados (declarados antes dos dados serem lançados).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138
  },
  {
    "id": "mta-2ed:sworn-oaths",
    "name": "Juramentos juramentados",
    "originalName": "Sworn Oaths",
    "requirements": {
      "Fate": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Ocultismo",
      "Política"
    ],
    "description": "O mago pode testemunhar um juramento e garantir que o próprio Destino imponha a adesão do sujeito ao seu voto. O sujeito faz uma promessa e declara as consequências para si mesmo se violar o acordo. Ninguém pode ser forçado a fazer tal juramento, embora um sujeito possa ser colocado sob juramento involuntariamente se ele voluntariamente fizer um voto e concordar verbalmente com uma consequência específica, mesmo que ele não perceba que o mago pode fazer cumprir o juramento sobrenaturalmente. Contanto que o sujeito cumpra o juramento, ele receberá uma bênção (ver p. 134). Se um poder sobrenatural forçar o alvo a violar seu juramento – seja por ação ou inação – o mago pode fazer um Confronto de Vontades contra o efeito. Se o alvo quebrar o juramento (intencionalmente ou não), ele sofre o feitiço (ver p. 134) com o qual concordou no momento em que fez o juramento. Um alvo que declara “Eu guardarei seus segredos ou posso ficar cego” sofrerá a Inclinação Cega pela duração restante do feitiço se ele falhar em guardar esses segredos, por exemplo. Uma vez que o alvo tenha quebrado um juramento, futuras violações de seus termos não impõem feitiços adicionais. Se lançado em vários assuntos, cada sujeito pode fazer seu próprio juramento; isso é frequentemente usado para criar contratos entre duas ou mais partes.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138
  },
  {
    "id": "mta-2ed:adept-of-fate-atonement",
    "name": "Adepto da Expiação do Destino",
    "originalName": "Adept of Fate Atonement",
    "requirements": {
      "Fate": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "Potência do efeito do sujeito",
    "roteSkills": [
      "Acadêmicos",
      "Empatia",
      "Sobrevivência"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138
  },
  {
    "id": "mta-2ed:chaos-mastery",
    "name": "Maestria do Caos",
    "originalName": "Chaos Mastery",
    "requirements": {
      "Fate": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Ocultismo",
      "Ciência"
    ],
    "description": "O mago pode Padronizar o Destino para manipular probabilidades complexas dentro do objeto ou área de efeito da magia. Este feitiço permite ao mago ditar qualquer resultado fisicamente possível dentro dos limites do alvo do feitiço, não importa quão improvável seja. O feitiço não pode criar efeitos sobrenaturais, mas dentro dos limites da improbabilidade o mago pode causar uma série de efeitos iguais à Potência, tais como: • Criar um efeito narrativo como controlar como os veículos se comportam em um acidente com vários carros. • Ao direcionar alterações bioquímicas antes aleatórias em um sujeito, causa convulsões, alucinações e eventos físicos, impondo Condições adequadas, como Cegueira ou Deficiência. • O mago reduz a próxima ação do alvo a um dado de sorte. • Atacar um alvo direcionando o acaso ao seu redor ou proteger um alvo de circunstâncias perigosas; este não é um feitiço de ataque direto e deve usar quaisquer regras para o perigo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 139
  },
  {
    "id": "mta-2ed:divine-intervention",
    "name": "Intervenção Divina",
    "originalName": "Divine Intervention",
    "requirements": {
      "Fate": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "O mago lança uma maldição poderosa que encoraja o alvo a atingir um objetivo especificado pelo mago quando ele lança esta magia, ou que frustra todas as tentativas do alvo de perseguir tal objetivo. O alvo deve, entretanto, estar ciente do objetivo, e o mago não pode impor tarefas impossíveis. Uma das Aspirações do sujeito é substituída pela meta. Como um aguilhão, o sujeito sofre azar, exceto quando toma medidas construtivas para aproximá-lo do objetivo declarado. Se o alvo não tiver perseguido o objetivo do feitiço de forma significativa nas últimas 24 horas, ele sofrerá um feitiço (veja pág. 134). Como banimento, o sujeito sofre azar sempre que tenta atingir o objetivo proibido. Durante a duração do feitiço, o alvo sofre um feitiço se se esforçar ativamente para alcançá-lo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 139
  },
  {
    "id": "mta-2ed:strings-of-fate",
    "name": "Cordas do Destino",
    "originalName": "Strings of Fate",
    "requirements": {
      "Fate": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Acadêmicos",
      "Persuasão",
      "Furtividade"
    ],
    "description": "As estradas do destino se bifurcam e convergem, governando a probabilidade dos acontecimentos. Um adepto do Destino pode re-tecer as cordas do Destino em um alvo, encorajando (se não garantindo) que um evento específico acontecerá enquanto o feitiço permanecer ativo. O mago especifica um evento que ele deseja que aconteça ao alvo. Se o evento for possível sem magia ou qualquer esforço por parte do alvo, ele ocorrerá assim que as circunstâncias permitirem, enquanto a Duração da magia estiver em vigor. Se o evento exigir a participação do alvo ou não puder ocorrer sem uma mudança nas circunstâncias, a magia introduz oportunidades para trabalhar em direção ao evento, pelo menos uma vez por semana enquanto a magia permanecer no alvo. Se o evento for simplesmente impossível, o feitiço não terá efeito. Por exemplo, se um mago lançar o feitiço sobre si mesmo e especificar que se encontrará com seu mentor enquanto ambos estiverem na mesma cidade, eles se cruzarão “aleatoriamente” na primeira oportunidade. Se ela lançar em um aliado Sonâmbulo e especificar que ele irá recuperar um artefato roubado (quando, sem ela saber, ele foi movido), ele encontrará passagens para a nova localização do artefato, pistas apontando para lá ou razões para viajar para lá. Se ela lançar isso sobre um estudante e especificar que ele se tornará médico, as circunstâncias",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 139
  },
  {
    "id": "mta-2ed:sever-oaths",
    "name": "Sever Juramentos",
    "originalName": "Sever Oaths",
    "requirements": {
      "Fate": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Duração",
    "withstand": "Compostura ===== PDF PÁGINA 140 ===== 139destino",
    "roteSkills": [
      "Ocultismo",
      "Subterfúgio",
      "Armamento"
    ],
    "description": "Para um Adepto do Destino, todos os grilhões do livre arbítrio de um ser são, em última análise, quebráveis ​​e os juramentos podem ser renegociados. O mago pode aplicar um número dos seguintes efeitos igual à Potência: • Libertar uma entidade ou alma efêmera aprisionada. • Alterar os efeitos de um benefício ou hexágono ativo. • Modificar ou negar um juramento ou outro acordo sobrenatural reforçado pelos ditames do Destino. • Alterar ou dissipar um gatilho condicional. • Modifique a Perdição de um alvo com a Qualidade Destino.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 139
  },
  {
    "id": "mta-2ed:master-of-fate-forge-destiny",
    "name": "Mestre do Destino Forja o Destino",
    "originalName": "Master of Fate Forge Destiny",
    "requirements": {
      "Fate": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Persuasão"
    ],
    "description": "Se um Mestre do Destino não tiver um herói do destino à mão, ele pode simplesmente criar um. Ele tem vários meios de fazer isso à sua disposição e pode aplicar um dos seguintes efeitos: • O mago concede ao alvo uma Qualidade Sobrenatural para a qual ele se qualifica com um nível máximo igual à Potência do feitiço. A Santidade dos Méritos (ver p. 99) não se aplica à perda deste Mérito. • O mago aumenta ou diminui o nível de Qualidade Sobrenatural do alvo em pontos iguais à Potência. • O mago impõe Aspirações e Obsessões ao alvo iguais à Potência, substituindo aquelas escolhidas pelo Narrador. • O mago escolhe a Perdição do alvo (pág. 100). Isso pode afetar indivíduos que não possuem a Qualidade Destino.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 140
  },
  {
    "id": "mta-2ed:pariah",
    "name": "Pária",
    "originalName": "Pariah",
    "requirements": {
      "Fate": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Investigação",
      "Medicamento",
      "Política"
    ],
    "description": "Uma das maldições mais terríveis do arsenal de um Mestre do Destino, esse feitiço vira o mundo contra a vítima. • Qualquer pessoa que encontre o alvo instintivamente se sente desconfortável perto dele, sentindo intuitivamente a maldição. A maioria das pessoas o trata, na melhor das hipóteses, com indiferença – se não com hostilidade aberta. Se o sujeito estiver usando o sistema de manobra social (ver p. 215), o nível de impressão cai em um (de bom para médio, por exemplo). Caso contrário, o sujeito assume um",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 140
  },
  {
    "id": "mta-2ed:miracle",
    "name": "Milagre",
    "originalName": "Miracle",
    "requirements": {
      "Fate": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Persuasão",
      "Subterfúgio"
    ],
    "description": "Este feitiço faz com que os eventos se desenrolem de acordo com os ditames do mago. O mago recebe um número de Intercessões igual à Potência, que ele pode usar como uma ação reflexiva durante a Duração do feitiço. Gastar uma Intercessão pode alcançar o seguinte, afetando um único alvo dentro do alcance sensorial: • Aumentar em um o número de sucessos em um lançamento após os dados serem lançados. • Diminua o número de sucessos em um lançamento em um depois que os dados forem lançados. Se isso reduzir o número de sucessos para menos de zero, o resultado será um fracasso dramático. • Fazer com que um evento razoavelmente provável aconteça de forma imediata e conveniente para o mago. Um velho sofre um ataque cardíaco. Um carro atropela um pedestre na calçada.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141
  },
  {
    "id": "mta-2ed:swarm-of-locusts",
    "name": "Enxame de Gafanhotos",
    "originalName": "Swarm of Locusts",
    "requirements": {
      "Fate": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Ciência"
    ],
    "description": "O mago cria condições caóticas: chuvas de sapos, enxames de gafanhotos, eclipses solares totais não programados e outras ocorrências similarmente “Forteanas”. Este evento aterrorizante e obviamente sobrenatural causa estragos na área, criando inclinações ambientais à escolha do jogador. A maioria dos Adormecidos sofre um Ponto de Ruptura imediato quando testemunha esse feitiço. Esfera das Forças: Eletricidade, gravidade, radiação, som, luz, calor, fogo, clima, movimento O Arcano bruto do Éter governa as energias mais poderosas do Mundo Decaído. Inúmeras lendas de magos conjurando raios para atingir seus inimigos, dançando entre pilares de chamas não naturais, voando e dirigindo tempestades contra seus inimigos falam da presença do poder bruto que as Forças representam. Com ele, um mago pode alterar e controlar a luz, o som, o fogo e a eletricidade – até mesmo a gravidade, a radiação e os padrões climáticos. Forças raramente são sutis, mas magos inteligentes encontram maneiras de usá-las: ouvindo um som vindo do outro lado da sala, amortecendo o barulho que o lançamento de feitiços faz ou vendo grandes distâncias. Praticantes habilidosos das Forças também podem desencadear tornados, terremotos e rajadas de fogo devastadoras quando a sutileza dá lugar à raiva rápida. •",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141
  },
  {
    "id": "mta-2ed:initiate-of-forces-influence-electricity",
    "name": "Iniciado das Forças Influenciam a Eletricidade",
    "originalName": "Initiate of Forces Influence Electricity",
    "requirements": {
      "Forces": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Computadores",
      "Ofícios",
      "Ciência"
    ],
    "description": "O mago pode operar ou desligar dispositivos elétricos com magia. Com este feitiço, ela só pode fazer com que os dispositivos existentes funcionem como normalmente funcionariam quando ligados ou quando a energia é desligada. Por exemplo, ela poderia fazer uma \"ligação direta\" em um carro sem realmente precisar tocar em nenhum fio, desligar e ligar as luzes e fazer com que máquinas industriais ligassem ou desligassem. Este feitiço não dá a ela maior controle sobre esses dispositivos, mas permite que ela acione ou desligue dispositivos que poderiam exigir senhas ou chaves eletrônicas.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141
  },
  {
    "id": "mta-2ed:influence-fire",
    "name": "Influenciar o Fogo",
    "originalName": "Influence Fire",
    "requirements": {
      "Forces": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Lendas de magos que controlam o fogo começam com este feitiço, que permite ao mago guiar o caminho das chamas existentes. Isso permite que ela faça com que as chamas se formem ou se estiquem, comande-as a queimar ao longo de um caminho específico (ou impeça-as de seguir outro), ou até mesmo formar formas de fogo específicas. Neste nível o mago não pode aumentar",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141
  },
  {
    "id": "mta-2ed:kinetic-efficiency",
    "name": "Eficiência Cinética",
    "originalName": "Kinetic Efficiency",
    "requirements": {
      "Forces": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Com um feitiço simples, o mago pode “empurrar” as forças cinéticas, melhorando o movimento do alvo. Este feitiço permite ao alvo correr um pouco mais rápido, pular um pouco mais longe ou levantar um pouco mais, não alterando forças, mas maximizando o uso de energia cinética do alvo. Isto tem os seguintes benefícios: • O alvo ganha um bônus em testes para resistir à fadiga igual à Potência. As ações são menos extenuantes quando se movem com tanta eficiência. • Adicione os pontos de Forças do lançador à distância total (em metros) percorrida em um salto, à Velocidade de natação e corrida do alvo e a quaisquer testes de escalada.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142
  },
  {
    "id": "mta-2ed:influence-heat",
    "name": "Influenciar o Calor",
    "originalName": "Influence Heat",
    "requirements": {
      "Forces": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Os iniciados podem orientar a direção das forças existentes. Com este feitiço, o mago pode controlar o fluxo de calor na área. Embora ele não possa aumentar ou criar calor, o mago pode direcionar o calor de um radiador do outro lado da sala para ela, ou puxar qualquer calor ambiente emitido por motores de carros, corpos humanos ou fontes ambientais. Isso pode mantê-lo aquecido em climas frios ou fresco em climas quentes, evitando danos e condições relacionados ao calor ou ao frio causados ​​por Ambientes Extremos até o Nível 2 (veja Ambientes Extremos, p. 224).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142
  },
  {
    "id": "mta-2ed:nightvision",
    "name": "Visão noturna",
    "originalName": "Nightvision",
    "requirements": {
      "Forces": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Ciência",
      "Furtividade"
    ],
    "description": "Apesar do nome, o feitiço Visão Noturna aumenta a luz ambiente, ajusta o sentido do mago para vibrações e mudanças térmicas e concede a ele o poder de ver os espectros infravermelho e ultravioleta. Ela se torna capaz de sentir e ver intuitivamente formas de radiação eletromagnética, som e energias cinéticas, permitindo-lhe navegar sem penalidades na escuridão completa. Ela ainda consegue ver e distinguir detalhes, mesmo no escuro, embora as cores sejam um tanto suaves. Este feitiço tem o efeito colateral de tornar o lançador muito mais vulnerável à luz; enquanto estiver em vigor, ele não sofre penalidades por penumbra ou mesmo nenhuma iluminação, mas sofre penalidades por luzes brilhantes como normalmente sofreria por escuridão. Luzes brilhantes e sons extremamente altos podem desorientar ou até mesmo infligir a Condição Cega nela durante a duração do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142
  },
  {
    "id": "mta-2ed:receiver",
    "name": "Receptor",
    "originalName": "Receiver",
    "requirements": {
      "Forces": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Investigação",
      "Ciência"
    ],
    "description": "Lançar este feitiço permite ao mago ouvir frequências de infra-som e ultra-som além do que os ouvidos humanos normalmente podem perceber. Enquanto ativa, ela pode ouvir sons fora da frequência normal, desde alta frequência (assobios de cães, sonar) até baixa frequência (o ronco distante dos motores a diesel, sons industriais normalmente perdidos para os humanos no ruído). Aplique a Potência da magia como um bônus de dados em paradas de dados relevantes, como jogadas para evitar emboscadas.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142
  },
  {
    "id": "mta-2ed:tune-in",
    "name": "Sintonize",
    "originalName": "Tune In",
    "requirements": {
      "Forces": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Computadores",
      "Empatia",
      "Ciência"
    ],
    "description": "Um mago com esta magia pode ouvir transmissões de dados flutuantes, como aquelas transmitidas por rádios, telefones celulares, modems sem fio e muito mais. A magia traduz esse ruído eletromagnético em algo que ela possa entender, embora preserve a linguagem de transmissão original. Com este feitiço, o mago não precisa de receptor para ouvir ou mesmo ver sinais. Os cabos de transmissão brilham diante de seus olhos com fluxos de dados, enquanto ela pode ver um brilho ou até mesmo vislumbres fugazes de imagens no ar. Internet via satélite e programação de TV, walkie-talkies fechados, transmissões CB e transmissões de rádio tornam-se abertos aos seus sentidos, bem como às comunicações sem fio.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142
  },
  {
    "id": "mta-2ed:apprentice-of-forces-control-electricity",
    "name": "Aprendiz de Eletricidade de Controle de Forças",
    "originalName": "Apprentice of Forces Control Electricity",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Computadores",
      "Ciência"
    ],
    "description": "O mago pode alterar o fluxo de eletricidade, bem como diminuir sua corrente. Ela não pode aumentar a corrente sem algum dispositivo capaz de gerá-la, pois não pode criar eletricidade do nada. Por exemplo, o mago pode direcionar a eletricidade de um edifício para uma ou várias tomadas, cortar a energia ou dividir a energia que vai para uma tomada para muitas outras fontes. Isto requer um método de condução, como fiação existente ou metal. Ela também pode causar arcos de correntes elétricas existentes (como atingir um alvo próximo a uma tomada) ou redirecioná-lo para longe de um dispositivo específico. Causar um curto-circuito ou usar a corrente elétrica para atacar um alvo geralmente queima os disjuntores ou causa um curto-circuito no dispositivo posteriormente, a menos que seja feito para suportar o estresse das flutuações de energia. O dano causado por este feitiço usa as regras de dano elétrico da pág. 224. Ao direcionar o fluxo para longe de um alvo, ela subtrai a Potência do feitiço do dano de uma fonte elétrica. Cada nível de Potência do feitiço permite ao mago controlar uma linha de poder. Se ele o desviar para outro lugar, o Narrador determina o que ocorre – uma tomada ou dispositivo pode sobrecarregar, ou se o mago for cuidadoso, ele pode evitar danificar componentes e simplesmente mudar o curso do poder. Se em vez disso ela quiser diminuir",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143
  },
  {
    "id": "mta-2ed:control-fire",
    "name": "Controle de Fogo",
    "originalName": "Control Fire",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O mago pode exercer controle sobre um incêndio, alimentando-o para aumentar seu tamanho e intensidade ou privando-o de combustível para apagá-lo. Ela só pode controlar as chamas existentes neste nível, mas pode transformar uma pequena fogueira em um inferno estrondoso ou reduzir até mesmo um fogo fora de controle a níveis administráveis. Para cada nível de Potência, o mago escolhe um dos seguintes efeitos (veja Transformar Energia, abaixo): • Aumentar ou diminuir o calor do fogo em um nível. • Aumentar ou diminuir o tamanho do incêndio em um nível. Se o calor ou o tamanho do fogo forem reduzidos a menos de um, ele será extinto. A menos que seja extinto, uma vez que a duração do feitiço termine, um fogo reduzido eventualmente se espalhará ao longo do combustível disponível.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143
  },
  {
    "id": "mta-2ed:control-gravity",
    "name": "Controle a gravidade",
    "originalName": "Control Gravity",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Ocultismo",
      "Ciência"
    ],
    "description": "O mago pode redirecionar a força da gravidade em uma área. Ela pode alterar a direção de sua atração, fazendo com que os objetos afetados \"caiam\" para cima ou horizontalmente. Ela não pode fazer mais do que mudar sua direção neste nível, mas pode tornar quase impossível aproximar-se de um objeto ou área específica sem algum meio de superar a gravidade, como vôo ou equipamento de escalada. Qualquer pessoa e qualquer coisa afetada pelo feitiço que não esteja protegida “cai” na direção escolhida pelo lançador. As vítimas podem sofrer danos se colidirem com objetos. Alguém preso em uma área onde a gravidade o impulsiona para cima pode ficar preso, caindo até a borda do raio da magia, e então descer novamente quando a gravidade normal assumir o controle, apenas para cair novamente quando ele entrar na área da magia. Uma pessoa ou criatura capaz de ação pode fazer um teste para escapar, a critério do Narrador, agarrando-se a um objeto próximo ou encontrando meios de controlar sua posição.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143
  },
  {
    "id": "mta-2ed:control-heat",
    "name": "Controle de calor",
    "originalName": "Control Heat",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O mago agora pode aumentar ou diminuir a temperatura de uma área. Cada nível de Potência permite uma mudança de 1 nível de Ambiente Extremo para produzir calor ou frio, contando uma temperatura ambiente temperada como “zero”. Por exemplo, com Potência 3, um mago poderia transformar um Ambiente Extremo de Nível 1 baseado no frio em um Ambiente de Nível 2 baseado no calor.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143
  },
  {
    "id": "mta-2ed:control-light",
    "name": "Luz de controle",
    "originalName": "Control Light",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Investigação",
      "Ciência"
    ],
    "description": "O mago pode diminuir ou intensificar a luz existente na área de efeito do feitiço, seja de uma fonte artificial ou natural. Isso pode fazer com que uma lâmpada de 40 watts brilhe tão intensamente quanto um holofote ou faça com que a luz do sol em um dia nublado seja como uma manhã clara de verão. A magia modifica a luz emitida pela fonte, e não a fonte ou a emissão em si, então isso não fará com que uma lâmpada queime ou aumente o calor da luz solar sem outros feitiços. Cada nível de Potência do feitiço dobra ou reduz pela metade a incandescência da luz. O feitiço permite ao mago focar ou dispersar a luz e até mesmo alterar seu comprimento de onda no espectro. Ela poderia transformar uma tocha em uma luz negra, focar os raios de uma lâmpada em um laser, dividir suas luzes em um espectro de arco-íris como se fosse visto através de um prisma, ou causar um efeito de refração como olhar para algo em águas rasas. Esses efeitos causam inclinação de luz fraca na área afetada.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143
  },
  {
    "id": "mta-2ed:control-sound",
    "name": "Controle de som",
    "originalName": "Control Sound",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração ===== PDF PÁGINA 144 ===== 143 forças",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Furtividade",
      "Ciência"
    ],
    "description": "Este feitiço permite que um mago amplifique ou enfraqueça o volume do som na área de efeito do feitiço. Ela pode transformar um alto-falante em uma explosão estrondosa ou em um guincho quase inaudível. Cada nível de Potência dobra ou reduz pela metade o volume do som na área alvo, criando uma zona de som alterado. Por exemplo, lançar este feitiço em um pódio na frente da sala afeta os sons de qualquer pessoa que esteja no pódio. O mago também pode influenciar a direção dos sons existentes. Ela pode focar ondas sonoras do outro lado da sala para ouvir uma conversa sussurrada, garantir que sua própria voz não alcance ninguém além do alvo pretendido ou fazer com que ruídos emanem de locais próximos em vez de suas fontes originais. O fator Escala determina a área que ela pode afetar. Sons altos o suficiente podem causar a inclinação surda em combate. Ao direcionar seu som para longe de um alvo que possa notá-lo, o mago inflige uma penalidade igual aos seus pontos de Arcano nos testes de Percepção do alvo para ouvi-lo se aproximar. • Focar as ondas sonoras em um ponto específico significa que qualquer pessoa fora do alvo escolhido (conforme determinado pela tabela Tamanho do alvo) não poderá ouvir os sons escolhidos. • Ouvir sons em uma área usa o fator Escala de Área de Efeito, determinando a distância em que o mago pode ouvir",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143
  },
  {
    "id": "mta-2ed:control-weather",
    "name": "Controlar o clima",
    "originalName": "Control Weather",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O mago pode controlar os padrões climáticos existentes. Ela pode forçar uma chuva leve a se tornar uma tempestade, criar neblina em uma manhã clara, transformar um dia quente em um dia insuportavelmente quente ou evocar uma brisa refrescante. Mudanças drásticas no clima existente exigem Alcance, conforme observado abaixo. O clima começa a mudar imediatamente após o lançamento do feitiço, com novos sistemas tomando forma em poucos minutos. Este feitiço permite ao mago alterar ou criar Ambientes Extremos baseados no clima até o Nível 4, bem como causar uma grande variedade de Inclinações ambientais. A Potência determina a quantidade máxima pela qual um Ambiente Extremo pode mudar, até um máximo de Nível 4 (e um mínimo de nível 0). Listado abaixo está um conjunto de exemplos de inclinações possíveis para padrões climáticos, mas não é de forma alguma exaustivo. Observe que sem mais magias, o mago não estará imune aos efeitos climáticos que ele criar. • Nevasca • Frio Extremo • Calor Extremo • Chuva Forte • Ventos Fortes",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144
  },
  {
    "id": "mta-2ed:clearing-a-blizzard-into-a-cool-but-clear-evening-environmental-shield",
    "name": "Limpando uma nevasca em uma noite fria, mas clara, Escudo Ambiental",
    "originalName": "Clearing a blizzard into a cool but clear evening Environmental Shield",
    "requirements": {
      "Forces": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O mago pode proteger-se contra condições ambientais prejudiciais. Este feitiço fornece resistência completa a quaisquer Condições ou Inclinações causadas por ambientes, até um nível de Ambiente Extremo da Potência do feitiço. O feitiço protege apenas contra danos indiretos, como calor e frio, e perigos menores como granizo. O mago ainda pode se afogar ou ser esmagado pelas ondas. Embora o feitiço não a protegesse contra raios se algo o forçasse a atingi-la, ela não atrairia naturalmente o raio. O feitiço requer um Confronto de Vontades para funcionar contra os efeitos mágicos do clima.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144
  },
  {
    "id": "mta-2ed:invisibility",
    "name": "Invisibilidade",
    "originalName": "Invisibility",
    "requirements": {
      "Forces": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Furto",
      "Ciência",
      "Furtividade"
    ],
    "description": "Este feitiço pode tornar seu alvo completamente invisível, mascarando-o de todas as formas de luz. Mesmo as câmeras não conseguem detectar o objeto, independentemente do tipo de filtro ou lente que usem. Este feitiço não mascara os sons que um objeto faz, embora quando combinado com \"Control Sound\" (veja acima), o alvo possa ficar invisível e silencioso.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144
  },
  {
    "id": "mta-2ed:kinetic-blow",
    "name": "Golpe Cinético",
    "originalName": "Kinetic Blow",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Briga",
      "Ciência"
    ],
    "description": "O mago concentra a força cinética dos ataques de concussão a tal ponto que eles causam danos como armas perfurantes.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144
  },
  {
    "id": "mta-2ed:transmission",
    "name": "Transmissão",
    "originalName": "Transmission",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ciência"
    ],
    "description": "O mago pode sequestrar sinais existentes e alterar os dados transmitidos ou seu destino. Ela pode encurtar ou prolongar a transmissão, e até alterar a frequência, como transformar uma transmissão wifi em sinal de televisão. Neste nível, ela ainda deve trabalhar com um sinal já presente. Imitar sons ou informações específicas requer um teste de Perícia ou acesso aos dados a serem transmitidos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145
  },
  {
    "id": "mta-2ed:zoom-in",
    "name": "Ampliar",
    "originalName": "Zoom In",
    "requirements": {
      "Forces": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O mago focaliza a luz que entra nos sentidos do alvo, ampliando enormemente a visão. Sem um feitiço de Revelação como \"Visão Noturna\" (p.141), o feitiço só pode afetar comprimentos de onda visíveis. Por exemplo, um mago usando este feitiço em si mesmo poderia olhar atentamente para um pássaro circulando no alto, ou ampliar detalhadamente para examinar uma camada de poeira em um objeto, mas ele não poderia ver coisas que só apareceriam sob uma luz negra. Se um personagem amplia a visão para focar em ocorrências de pequena escala, o Narrador pode solicitar testes de Inteligência + Ciência para entender o que está vendo. Cada nível de Potência dobra a distância que o mago pode ver claramente antes de sofrer penalidades, embora as condições atmosféricas ainda possam obscurecer sua visão. Adicione Potência às jogadas de dados para perceber pequenos detalhes.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145
  },
  {
    "id": "mta-2ed:disciple-of-forces-call-lightning",
    "name": "Discípulo das Forças Chama o Relâmpago",
    "originalName": "Disciple of Forces Call Lightning",
    "requirements": {
      "Forces": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Armas de fogo",
      "Ciência"
    ],
    "description": "Com um gesto o mago pode conjurar relâmpagos de um céu tempestuoso para atingir seus inimigos. Ele deve usar este feitiço com uma tempestade existente ou com uma que ela acione com “Controle do Clima” (veja pág. 143), já que ele não pode criar relâmpagos do nada neste nível. Embora o raio em si seja quase inevitável, o aumento crepitante da energia dá um aviso ao alvo. O raio só pode atingir um alvo que possa realmente atingir, portanto o alvo deve ser exposto de alguma forma. Com vários assuntos, o raio se bifurca, atingindo cada um deles simultaneamente. Causa danos de acordo com as regras de eletricidade na pág. 224.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145
  },
  {
    "id": "mta-2ed:gravitic-supremacy",
    "name": "Supremacia Gravítica",
    "originalName": "Gravitic Supremacy",
    "requirements": {
      "Forces": 3
    },
    "practice": "Desgastando ou Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O mago pode aumentar ou diminuir a gravidade. Se aumentá-lo, cada nível de Potência subtrai 3 de Velocidade de todos os alvos, além de penalizar as jogadas de salto, subtraindo uma distância igual à Potência do sucesso obtido. Se a Potência exceder a Força de um animal capturado na área, o alvo sofre –1 em todas as paradas de dados Físicos para cada ponto de diferença. As criaturas voadoras devem ter sucesso em um teste de Força + Atletismo a cada turno ou cairão para baixo com uma Velocidade igual à Potência. Anular a gravidade aumenta a Velocidade de qualquer pessoa dentro da área de efeito pela Potência do feitiço. Aumenta a distância do salto por sucesso obtido pela Potência do feitiço. Além disso, o mago pode fazer com que objetos caiam em qualquer direção que ele escolher quando criar o feitiço,",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145
  },
  {
    "id": "mta-2ed:telekinesis",
    "name": "Telecinese",
    "originalName": "Telekinesis",
    "requirements": {
      "Forces": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Briga",
      "Ciência"
    ],
    "description": "O mago pode conjurar força telecinética para levantar ou manipular um objeto remotamente. Aplique a Potência do feitiço a uma das Forças (poder bruto de levantar/empurrar), Destreza (manipulação fina) ou Velocidade da força. Os outros dois são padronizados como 1. Mover objetos usando Telecinese requer concentração como uma ação instantânea a cada turno; se o mago não conseguir se concentrar em mover a força, ele simplesmente fica suspenso, segurando quaisquer objetos que segurava antes, mas não mais empurrando ou puxando (ou manipulando objetos, se usado para isso). O mago pode então retomar o direcionamento da força telecinética até que a Duração do feitiço expire.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145
  },
  {
    "id": "mta-2ed:telekinetic-strike",
    "name": "Ataque Telecinético",
    "originalName": "Telekinetic Strike",
    "requirements": {
      "Forces": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Armas de fogo",
      "Ciência"
    ],
    "description": "O mago manipula forças cinéticas para esmagar alvos ou formar uma “bola” de ar altamente pressurizado e energia cinética que ele pode lançar contra os inimigos. O feitiço inflige dano contundente igual à sua Potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146
  },
  {
    "id": "mta-2ed:turn-momentum",
    "name": "Momento de mudança",
    "originalName": "Turn Momentum",
    "requirements": {
      "Forces": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Armas de fogo",
      "Ciência"
    ],
    "description": "Este feitiço permite ao mago redirecionar o impulso do alvo. Geralmente isso forma um escudo contra projéteis, mas também pode ser usado em objetos maiores. Quando um mago puder usar sua Defesa contra um objeto, ele poderá usar esta magia para redirecioná-lo como uma ação instantânea. Se conjurado com uma Duração prolongada, o mago pode realizar uma ação de Esquiva a cada turno e usar esta magia em vez de receber os benefícios normais de Esquiva. O feitiço permite ao mago transformar vários objetos em movimento em Potência. Ela não tem controle preciso sobre onde cada objeto é desviado, e o feitiço não pode fazer os objetos inverterem totalmente a direção, apenas desviarem do alvo. O Tamanho máximo de um objeto redirecionado é determinado pelo fator de Escala do feitiço. Como o feitiço atua sobre o impulso de um objeto e não sobre o objeto em si, o peso e a velocidade são irrelevantes para o efeito deste feitiço; se o mago puder usar o feitiço, a magia irá frustrar qualquer objeto dentro de seus parâmetros. O objeto redirecionado mantém todo o seu impulso original. Por padrão, o Narrador determina uma direção aleatória para o objeto viajar quando redirecionado.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146
  },
  {
    "id": "mta-2ed:velocity-control",
    "name": "Controle de velocidade",
    "originalName": "Velocity Control",
    "requirements": {
      "Forces": 3
    },
    "practice": "Desgastando ou Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Dirigir",
      "Ciência"
    ],
    "description": "O mago pode aumentar ou diminuir bastante a velocidade de um objeto. Sua velocidade dobra ou diminui pela metade para cada nível de Potência do feitiço. Por exemplo, um carro viajando a 50 MPH é aumentado para 200 MPH com Potência 2, ou incríveis 800 MPH com Potência 4. Da mesma forma, se o mago reduzir sua velocidade, o mesmo carro diminuiria para cerca de 13 MPH com Potência 2, ou cerca de 4 MPH com Potência 4. O mago deve ser capaz de afetar todo o tamanho do alvo para afetá-lo com este feitiço; ela não pode mirar apenas no pneu dianteiro de um veículo de 18 rodas com seu trailer (tamanho 30) e pará-lo. A mudança de velocidade afeta os danos com base nas colisões. Ele também adiciona ou subtrai um ponto de dano de ataques de projéteis e pode reduzi-los a 0. O feitiço não pode reduzir a velocidade de um objeto em movimento a 0 (isso exigiria um feitiço Desfazer). ••••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146
  },
  {
    "id": "mta-2ed:adept-of-forces-electromagnetic-pulse",
    "name": "Adepto das Forças Pulso Eletromagnético",
    "originalName": "Adept of Forces Electromagnetic Pulse",
    "requirements": {
      "Forces": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Computadores",
      "Ciência"
    ],
    "description": "O mago degrada a energia eletromagnética do alvo do feitiço, destruindo dispositivos eletrônicos. O feitiço é capaz de apagar dispositivos elétricos mundanos, embora alguns dispositivos de nível militar sejam blindados, exigindo Potência igual ao seu nível de endurecimento. Encurtar dispositivos mágicos requer um Confronto de Vontades. Quando usado contra um ser vivo, o dano ao sistema nervoso atua como um feitiço de dano direto, infligindo Potência em dano letal.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146
  },
  {
    "id": "mta-2ed:levitation",
    "name": "Levitação",
    "originalName": "Levitation",
    "requirements": {
      "Forces": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Vigor",
    "roteSkills": [
      "Atletismo",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O sujeito flutua no ar usando força telecinética. Sua velocidade no ar é igual à Potência do feitiço. Os sujeitos podem usar sua Defesa contra ataques, se aplicável. Sujeitos relutantes Resistem ao feitiço com Vigor. O mago pode direcionar a levitação do alvo a cada turno como uma ação instantânea. Se ela não fizer isso, o objeto simplesmente permanecerá flutuando no ar, parando onde estava quando ela parou de movê-lo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146
  },
  {
    "id": "mta-2ed:rend-friction",
    "name": "Rend Fricção",
    "originalName": "Rend Friction",
    "requirements": {
      "Forces": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Dirigir",
      "Ciência"
    ],
    "description": "O mago altera o nível de fricção sobre um alvo. Ela pode aumentá-lo até o ponto em que a simples fricção do ar corta o alvo em pedaços, ou diminuí-lo tanto que um objeto pode continuar se movendo quase indefinidamente.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146
  },
  {
    "id": "mta-2ed:thunderbolt",
    "name": "Raio",
    "originalName": "Thunderbolt",
    "requirements": {
      "Forces": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Armas de fogo",
      "Ciência"
    ],
    "description": "O mago canaliza as energias ambientais como uma arma, despejando-as em seu alvo. Este feitiço causa dano letal igual à sua Potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 147
  },
  {
    "id": "mta-2ed:transform-energy",
    "name": "Transformar Energia",
    "originalName": "Transform Energy",
    "requirements": {
      "Forces": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Ciência"
    ],
    "description": "Toda energia compartilha simpatia, nascida talvez da mesma fonte cósmica no mesmo instante. Um Adepto das Forças pode usar essa simpatia para transformar um tipo de energia em outro. A tabela abaixo serve como um gráfico aproximado de equivalência para diferentes tipos de energia. Ela pode transformar uma sala cheia de luz em calor, transformando-a imediatamente em um forno escuro como breu. Ela também poderia transformar o rugido estrondoso de uma cachoeira em eletricidade, muito mais eficiente do que qualquer represa hidrelétrica. O feitiço pode afetar a energia de um nível igual à Potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 147
  },
  {
    "id": "mta-2ed:master-of-forces-adverse-weather",
    "name": "Mestre das Forças Tempo Adverso",
    "originalName": "Master of Forces Adverse Weather",
    "requirements": {
      "Forces": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Ciência"
    ],
    "description": "O mago invoca um grande sistema climático tão severo quanto um tornado, tsunami, monção ou furacão. Os efeitos climáticos duram minutos e se dissipam imediatamente quando o feitiço expira. Isso permite ao mago criar Ambientes Extremos de praticamente qualquer tipo até o Nível 4, conforme Controle do Clima (veja acima), mas sem limitações. Ela não precisa evocar desastres; ela pode fazer uma tempestade aparecer em um céu azul sem nuvens, se desejar.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 147
  },
  {
    "id": "mta-2ed:create-energy",
    "name": "Criar Energia",
    "originalName": "Create Energy",
    "requirements": {
      "Forces": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Ciência"
    ],
    "description": "O mago cria energia a partir de algo dentro de um alvo ou área de efeito. Ela pode criar luz (incluindo luz solar), fogo, radiação, som e eletricidade. Use o gráfico acima em Energia de Transformação como um exemplo dos níveis que ela pode criar na área afetada. Para o fogo, suponha que o calor seja +1 para Potência 1–2, +2 para Potência 3–4 e +3 para Potência 5+. Depois de criar a energia, ela pode modificá-la com feitiços de Controle. A criação de radiação também cria um ambiente extremo perigoso para os seres vivos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 147
  },
  {
    "id": "mta-2ed:eradicate-energy",
    "name": "Erradicar Energia",
    "originalName": "Eradicate Energy",
    "requirements": {
      "Forces": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Intimidação",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Em vez de criar energia, o mago extingue energias dentro de um alvo ou área (veja o gráfico “Transformar Energia”, acima, para saber a Potência exigida por diferentes níveis de energia). A destruição é espetacular, espalhando explosivamente as energias afetadas em partículas. Se usado em uma criatura, este feitiço é instantaneamente fatal, mas resistido por Vigor.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 147
  },
  {
    "id": "mta-2ed:earthquake",
    "name": "Terremoto",
    "originalName": "Earthquake",
    "requirements": {
      "Forces": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O mago desencadeia um terremoto para rachar o chão. Este feitiço inflige dano igual à sua Potência a todas as estruturas dentro da área afetada. A maioria dos edifícios modernos são construídos para suportar bem os terremotos e subtrair sua durabilidade dos danos normalmente. Estruturas menores ou mais frágeis não aplicam Durabilidade ao dano. Os seres vivos podem fazer um teste de Destreza + Atletismo para manter o equilíbrio enquanto o chão se inclina e se eleva abaixo deles. Uma falha significa que o personagem sofre dano contundente ao cair no chão e ser arremessado violentamente, a menos que a queda o faça cair escada abaixo ou sobre uma saliência. O desabamento de edifícios pode causar danos muito mais catastróficos ou deixar as vítimas presas sob toneladas de escombros.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 148
  },
  {
    "id": "mta-2ed:cleanse-the-body",
    "name": "Limpe o corpo",
    "originalName": "Cleanse the Body",
    "requirements": {
      "Life": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Medicamento",
      "Sobrevivência"
    ],
    "description": "O mago pode usar esta magia para ajudar o corpo do alvo a combater os efeitos de qualquer toxina em seu sistema, ou até mesmo eliminá-los completamente. Sua magia permite a ela um bônus igual à Potência em seu próximo teste para resistir aos efeitos da toxina.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149
  },
  {
    "id": "mta-2ed:heightened-senses",
    "name": "Sentidos aguçados",
    "originalName": "Heightened Senses",
    "requirements": {
      "Life": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Investigação",
      "Sobrevivência"
    ],
    "description": "Embora este feitiço não possa conceder novos sentidos ao mago, ele pode aumentar os já existentes, incluindo o tato. Como resultado, este é um feitiço popular entre magos hedonistas, bem como entre aqueles que desejam revitalizar os sentidos entorpecidos pela vida na cidade. Afinal, a força de um mago reside em sua preparação e conhecimento, e seus sentidos aguçados transmitem maiores informações sobre o mundo. O feitiço concede um bônus nas jogadas de Percepção igual à sua Potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149
  },
  {
    "id": "mta-2ed:web-of-life",
    "name": "Teia da Vida",
    "originalName": "Web of Life",
    "requirements": {
      "Life": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Medicamento",
      "Sobrevivência"
    ],
    "description": "Ao aproveitar a pulsação do mundo vivo, o mago torna-se profundamente consciente de quaisquer seres vivos próximos. Ela sente a presença deles pelo peso que exercem sobre a Tapeçaria, uma gravidade da força vital que conecta todas as criaturas ao mesmo grande ciclo. Como a percepção não filtrada de toda a vida pode fornecer uma sobrecarga sensorial, a maioria dos magos especifica certos tipos de vida para detectar, como “humanos, insetos e pássaros” ou “apenas cães”. Depois de lançar este feitiço com sucesso, o mago pode detectar todos os tipos especificados de organismos dentro da Escala de área do feitiço, ou que entram na área do feitiço enquanto ele permanece em efeito. Ao lançar em um alvo ou alvos individuais, o feitiço pode ser usado para escaneá-los em busca de parasitas, bactérias ou gravidez. ••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149
  },
  {
    "id": "mta-2ed:apprentice-of-life-body-control",
    "name": "Aprendiz do Controle Corporal da Vida",
    "originalName": "Apprentice of Life Body Control",
    "requirements": {
      "Life": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Medicamento",
      "Sobrevivência"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149
  },
  {
    "id": "mta-2ed:mutable-mask",
    "name": "Máscara Mutável",
    "originalName": "Mutable Mask",
    "requirements": {
      "Life": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "Vigor",
    "roteSkills": [
      "Medicamento",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "O mago pode alterar as características aparentes do alvo, ainda que apenas estética e temporariamente. Ela pode alterar os pigmentos da pele, as características fenotípicas, o sexo aparente ou a cor e textura do cabelo; adicionar ou subtrair pequenos depósitos de gordura; ou alterar o som da voz do sujeito. Características distintivas como cicatrizes e manchas podem ser adicionadas ou removidas. Mesmo em sua forma mais extrema, as mudanças provocadas por este feitiço ainda deixam o alvo um pouco parecido com sua forma original. Se alguém comparasse as aparências mascaradas e regulares lado a lado, poderia notar uma semelhança quase familiar (mesmo que as duas fossem de raças obviamente diferentes), mas as mudanças são suficientes para enganar dispositivos de reconhecimento facial, desenhistas ou até mesmo mudar o cheiro do sujeito o suficiente para despistar animais rastreadores. Alguns dispositivos biométricos, como leitores de impressão digital, ainda detectarão a diferença. Ela não pode imitar pessoas específicas com este feitiço básico. As mudanças provocadas por este feitiço são ilusórias, e alguns poderes sobrenaturais (incluindo Visão do Mago da Vida) podem ver através delas com um Confronto de Vontades bem-sucedido.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 150
  },
  {
    "id": "mta-2ed:disciple-of-life-bruise-flesh",
    "name": "Discípulo da Vida Contusão Carne",
    "originalName": "Disciple of Life Bruise Flesh",
    "requirements": {
      "Life": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Briga",
      "Intimidação",
      "Medicamento"
    ],
    "description": "Um mago pode usar a magia da Vida para simplesmente machucar e espancar uma criatura viva. Este é um feitiço de ataque, infligindo dano contundente igual à Potência do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 151
  },
  {
    "id": "mta-2ed:degrading-the-form",
    "name": "Degradando o Formulário",
    "originalName": "Degrading the Form",
    "requirements": {
      "Life": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Duração",
    "withstand": "Vigor",
    "roteSkills": [
      "Briga",
      "Medicamento",
      "Sobrevivência"
    ],
    "description": "Os seres vivos ficam fracos quando atingidos por lesões, doenças ou defeitos genéticos. Este feitiço replica esses efeitos, prejudicando os Atributos Físicos do alvo. Cada nível de Potência reduz Força, Destreza ou Vigor em um, escolhido quando o feitiço é lançado, até um mínimo de 1.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 151
  },
  {
    "id": "mta-2ed:honing-the-form",
    "name": "Aprimorando o formulário",
    "originalName": "Honing the Form",
    "requirements": {
      "Life": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Medicamento",
      "Sobrevivência"
    ],
    "description": "O mago pode melhorar os Atributos Físicos do alvo. O feitiço aumenta Força, Destreza ou Vigor (escolhido quando o feitiço é lançado) de acordo com sua Potência. Este aumento afeta quaisquer Vantagens ou outras características derivadas do nível do Atributo. Os efeitos são sutis na aparência; o alvo afetado não cresce nem ganha massa muscular óbvia, mas os observadores podem detectar até mesmo indícios sutis de mudanças no equilíbrio, força ou resistência. O Atributo afetado não pode ser elevado acima dos pontos máximos de Atributo do alvo (5 para seres humanos normais).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 151
  },
  {
    "id": "mta-2ed:knit",
    "name": "Tricotar",
    "originalName": "Knit",
    "requirements": {
      "Life": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Medicamento",
      "Sobrevivência"
    ],
    "description": "O mago pode curar o corpo de seu alvo de ferimentos que seria capaz de curar a si mesmo com o tempo e reparar danos causados ​​por toxinas ou privação (embora tais danos continuem a acumular normalmente, a menos que sejam evitados por outros meios). Cada nível de Potência cura duas caixas de dano contundente.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 151
  },
  {
    "id": "mta-2ed:many-faces",
    "name": "Muitas Faces",
    "originalName": "Many Faces",
    "requirements": {
      "Life": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Vigor",
    "roteSkills": [
      "Medicamento",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "O mago pode alterar o corpo do alvo de qualquer forma, dentro dos limites da espécie e da idade. Em vez de uma ilusão como acontece com \"Máscara Mutável\", a transformação causada por este feitiço é inteiramente física e funcional - os indivíduos podem se tornar férteis em suas novas formas, receber peso e aptidão radicalmente alterados e ter visão deficiente ou outros sentidos corrigidos. Se faltarem órgãos ou membros ao sujeito, entretanto, eles permanecerão na nova forma e os ferimentos serão transferidos de uma forma para a próxima. O mago pode reorganizar os pontos de Potência em Atributos Físicos do feitiço, por exemplo, movendo um ponto de Força para Vigor, mas não pode alterar o número total de pontos, trazê-los para 0 ou aumentá-los acima do limite do alvo. Adicionar Tempo •••: O mago também pode alterar a idade física do alvo. Transformar Vida (Vida •••) Prática: Tecelagem Fator Primário: Potência Resistência: Vigor Perícias Rotinas Sugeridas: Conhecimento Animal, Ciência, Sobrevivência O mago pode transformar a vida dando-lhe características normalmente exibidas por outros organismos. Ela pode conceder garras ou guelras, transformar um herbívoro inofensivo em um assassino cuspidor de veneno ou conceder membros e pulmões que respiram ar a um tubarão, entre outras mudanças. Ela pode conceder uma característica por nível de Potência. Um alvo transformado sabe instintivamente como usar seus n",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 151
  },
  {
    "id": "mta-2ed:life-force-assault",
    "name": "Ataque de força vital",
    "originalName": "Life-Force Assault",
    "requirements": {
      "Life": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Briga",
      "Intimidação",
      "Medicamento"
    ],
    "description": "O mago ataca as próprias energias vitais que sustentam um Padrão vivo. Isso envolve rasgar esse Padrão, causando feridas internas terrivelmente dolorosas e danos inespecíficos aos tecidos. Este é um feitiço de ataque que causa dano letal igual à sua Potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 153
  },
  {
    "id": "mta-2ed:mend",
    "name": "Consertar",
    "originalName": "Mend",
    "requirements": {
      "Life": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Medicamento",
      "Sobrevivência"
    ],
    "description": "Adeptos da Vida podem curar até mesmo as feridas mais graves, reescrevendo o corpo do alvo para selar as feridas. Cada nível de Potência cura dois danos letais.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 153
  },
  {
    "id": "mta-2ed:master-of-life-create-life",
    "name": "Mestre da Vida Cria Vida",
    "originalName": "Master of Life Create Life",
    "requirements": {
      "Life": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Um Mestre da Vida pode criar um novo organismo vivo de quase qualquer variedade: planta, fungo, animal, até mesmo organismos complexos como humanos e cetáceos. O ser criado não tem mente sem o uso conjuntivo do Arcano da Mente para lhe dar inteligência, agindo puramente por instinto. Será uma criatura simples, mesmo para sua espécie, mas totalmente funcional e até capaz de procriar. O que um mago pode criar é limitado por pouco mais que sua imaginação, embora criaturas verdadeiramente fantásticas estejam além do escopo desta magia. Ela não pode criar um dragão alado, por exemplo, e esperar que ele voe desafiando a física. O fator Tamanho da Escala do Alvo determina o Tamanho máximo do organismo criado. A criação possui todas as características básicas de um organismo desse tipo; o mago não precisa transmitir a habilidade de procriar ou se mover de maneira normal para aquela espécie. Quando a Duração do feitiço expira, o organismo criado também expira, o que pode contar como um Ato de Arrogância contra a Sabedoria Iluminada. Simplesmente criar a criatura viva sabendo disso também pode contar como um ato de arrogância. Alguns magos usam esse feitiço para criar corpos que podem possuir ou alterar com outras magias de Vida, usar para subornar espíritos em busca de um corpo hospedeiro ou criar um companheiro (geralmente feito com duração indefinida). Criado",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 154
  },
  {
    "id": "mta-2ed:contagion",
    "name": "Contágio",
    "originalName": "Contagion",
    "requirements": {
      "Life": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Ocultismo",
      "Ciência"
    ],
    "description": "Life Masters podem lançar pragas horríveis sobre seus inimigos. O mago pode criar doenças menores ou doenças potencialmente fatais. A Gravidade da doença é igual à Potência. Se o mago tiver algo em que possa armazenar a doença, ele poderá criá-la dentro desse equipamento, ou então deverá ter como alvo alguma forma de portador, dependendo dos métodos de transmissão da doença (água, comida, hospedeiros vivos). É contagioso assim que o mago o cria, exigindo um teste reflexivo de Vigor + Perseverança, modificado pela Severidade, para resistir a contraí-lo. A falha significa que a vítima contrai a doença e sofre seus efeitos normais.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 154
  },
  {
    "id": "mta-2ed:salt-the-earth",
    "name": "Salgue a Terra",
    "originalName": "Salt the Earth",
    "requirements": {
      "Life": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Este feitiço destrutivo arranca a própria força vital de uma área ou de um indivíduo, tornando-o incapaz de sustentar a vida. Plantas, animais e até fungos da região morrem. O uso deste feitiço interrompe temporariamente a decomposição em uma área baseada na decomposição microbiana de células mortas, pois também mata todos os organismos microscópicos. Finalmente, o feitiço impede que qualquer coisa afetada seja fertilizada, embora as gestações existentes permaneçam se o organismo sobreviver. O feitiço cria um efeito de Ambiente Extremo igual à Potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 154
  },
  {
    "id": "mta-2ed:initiate-of-matter-craftsman-s-eye",
    "name": "Olho do Artesão Iniciado na Matéria",
    "originalName": "Initiate of Matter Craftsman's Eye",
    "requirements": {
      "Matter": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Investigação",
      "Ciência"
    ],
    "description": "Sob o olhar do artesão, nenhuma ferramenta é misteriosa. Ao estudar um objeto por um turno, o sujeito ganha uma compreensão completa da função pretendida do objeto. Desde uma ferramenta tão simples como um martelo até uma caixa de quebra-cabeça complexa, a finalidade do item é fácil de ver. Se o objeto não tiver propósito (por exemplo, uma simples pedra), a magia também revela isso. Da mesma forma, se algo impede o objeto de cumprir seu propósito (por exemplo, um carro sem velas de ignição não pode dirigir), o feitiço revela a natureza do problema.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 155
  },
  {
    "id": "mta-2ed:detect-substance",
    "name": "Detectar substância",
    "originalName": "Detect Substance",
    "requirements": {
      "Matter": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Investigação",
      "Ciência"
    ],
    "description": "O mago escolhe um número de substâncias ou objetos que estão sob o alcance da Matéria igual à Potência do feitiço. Enquanto este feitiço estiver ativo, o alvo fica automaticamente ciente da presença e localização da substância escolhida dentro da área de efeito. A substância escolhida pode ser tão ampla ou tão específica quanto o mago desejar (“metal ferroso”, “aço inoxidável”, “uma faca” e “minha faca de caça” são opções válidas). Adicionar Tempo •: O alvo pode detectar se a substância escolhida esteve na área dentro de um período de tempo igual à Duração do feitiço. Adicionar forças •: O sujeito pode pesquisar tipos específicos de informação eletrônica, como áudio digital, fotografias ou documentos de texto. O feitiço não apenas revelará quais dispositivos possuem o tipo de arquivo escolhido, mas se ele estiver realmente usando o dispositivo, o mago saberá onde os arquivos estão armazenados.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 155
  },
  {
    "id": "mta-2ed:discern-composition",
    "name": "Discernir Composição",
    "originalName": "Discern Composition",
    "requirements": {
      "Matter": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Investigação",
      "Ciência"
    ],
    "description": "O sujeito toma consciência da composição precisa de um objeto: seu peso e densidade, bem como os elementos precisos que o compõem.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 155
  },
  {
    "id": "mta-2ed:lodestone",
    "name": "Magnetita",
    "originalName": "Lodestone",
    "requirements": {
      "Matter": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Furto",
      "Ciência"
    ],
    "description": "O mago escolhe uma substância ou tipo de objeto. Enquanto a magia permanecer ativa, os objetos dentro da Área da magia serão atraídos para o alvo da magia: moedas caídas saltam em sua direção, a água flui em sua direção enquanto ela estiver na correnteza, e assim por diante. A menos que o objeto seja capaz de se mover por seu próprio poder, esta magia só pode empurrar o objeto quando uma força externa é aplicada sobre ele: uma bola pode rolar pelo chão, mas um livro pesado não voará da mesa e cairá nas mãos do alvo. (No entanto, ele poderia tombar e cair de uma prateleira se estivesse precariamente equilibrado para começar.)",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 155
  },
  {
    "id": "mta-2ed:remote-control",
    "name": "Controle remoto",
    "originalName": "Remote Control",
    "requirements": {
      "Matter": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Dirigir",
      "Intimidar"
    ],
    "description": "Com o poder de comando da Stygia, o sujeito pode controlar qualquer objeto mecânico, fazendo-o cumprir sua função. Ela pode apertar um interruptor de luz, fazer uma prensa industrial bater para baixo ou engatar a marcha de um carro. Qualquer coisa que esteja dentro dos limites de uma única ação instantânea e que o dispositivo em questão seja capaz de executar é um jogo justo. Caso a ação exija um teste de Perícia, trate a Potência do feitiço como seus sucessos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 156
  },
  {
    "id": "mta-2ed:apprentice-of-matter-alchemist-s-touch",
    "name": "Aprendiz da Matéria Toque do Alquimista",
    "originalName": "Apprentice of Matter Alchemist's Touch",
    "requirements": {
      "Matter": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Sobrevivência",
      "Persuasão"
    ],
    "description": "Envolto nas mortalhas de chumbo da Stygia, o alvo pode lidar sem medo até mesmo com as substâncias mais perigosas. Quando o feitiço é lançado, o mago escolhe uma forma particular de matéria: o alvo é amplamente imune aos seus efeitos deletérios. O material não pode infligir dano contundente a ela, e ela reduz o dano de fontes letais de dano pela Potência do feitiço. O feitiço não tem efeito sobre dano agravado. Este feitiço apenas protege o mago de danos causados ​​por uma propriedade intrínseca do material. O dano de uma arma ou espada, por exemplo, vem da força por trás do impacto e, portanto, não é reduzido por este feitiço. Entretanto, um mago sob a proteção desta magia pode manusear substâncias radioativas ou cáusticas ou caminhar através de uma nuvem de gás cloro sem efeitos nocivos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 156
  },
  {
    "id": "mta-2ed:hidden-hoard",
    "name": "Tesouro Escondido",
    "originalName": "Hidden Hoard",
    "requirements": {
      "Matter": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Furto",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Este feitiço torna a Matéria difícil de detectar. Não é precisamente invisibilidade; em vez disso, o feitiço oculta a conexão do alvo com as verdades Supernas, fazendo com que pareça insignificante e invisível. Tentativas mundanas de detectar o alvo falham automaticamente. Feitiços e poderes que detectariam o objeto velado estão sujeitos a um Confronto de Vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157
  },
  {
    "id": "mta-2ed:machine-invisibility",
    "name": "Invisibilidade da Máquina",
    "originalName": "Machine Invisibility",
    "requirements": {
      "Matter": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Furto",
      "Ciência",
      "Furtividade"
    ],
    "description": "Por meio deste feitiço, o mago cega os olhos e ouvidos da matéria inerte para a presença do alvo: as câmeras se recusam a vê-la, os microfones se recusam a ouvir sua voz e assim por diante. Objetos sobrenaturais (como artefatos de visão remota ou talvez uma câmera assombrada por fantasmas) provocam um choque de vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157
  },
  {
    "id": "mta-2ed:shaping",
    "name": "Moldar",
    "originalName": "Shaping",
    "requirements": {
      "Matter": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Durabilidade",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Persuasão"
    ],
    "description": "Líquidos, gases e sólidos amorfos são os brinquedos do mago neste feitiço. Ela pode moldá-los em qualquer forma que desejar, manipulando-os desafiando a gravidade, enquanto o feitiço durar. Este feitiço não pode alterar o estado da matéria (por exemplo, de sólido para líquido), mas substâncias que foram temporariamente transformadas em estados moldáveis ​​por magia podem ser afetadas. Formas particularmente complexas podem exigir um teste reflexivo de Raciocínio + Ofícios, a critério do Narrador.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157
  },
  {
    "id": "mta-2ed:disciple-of-matter-aegis",
    "name": "Égide do Discípulo da Matéria",
    "originalName": "Disciple of Matter Aegis",
    "requirements": {
      "Matter": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Ofícios",
      "Ciência"
    ],
    "description": "Ao ajustar as propriedades da matéria, o mago pode tornar camisas de seda à prova de balas ou rasgar trajes de choque volumosos com as próprias mãos. O feitiço é lançado sobre um objeto vestível (dar armadura aos seres vivos é uma função da Vida). Para cada nível de Potência, o jogador escolhe um dos seguintes efeitos: • Aumentar ou diminuir a classificação de Armadura balística em 1 • Aumentar ou diminuir a classificação de Armadura geral em 1 • Aumentar ou diminuir a penalidade de Defesa em 1",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157
  },
  {
    "id": "mta-2ed:alter-conductivity",
    "name": "Alterar condutividade",
    "originalName": "Alter Conductivity",
    "requirements": {
      "Matter": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Computadores",
      "Ciência",
      "Subterfúgio"
    ],
    "description": "Com este feitiço, o mago altera as propriedades básicas de um alvo, mudando a maneira como ele conduz eletricidade. Este feitiço pode desligar automaticamente qualquer dispositivo elétrico cuja potência não seja grande o suficiente para causar danos, ou pode aumentar ou diminuir a quantidade de eletricidade que pode fluir através do objeto. Para cada nível de Potência, o feitiço permite que o objeto conduza dois pontos de dano elétrico ou reduza o dano elétrico em dois. O objeto ainda deve estar em contato com uma fonte apropriada de eletricidade para causar esse dano; mesmo um feitiço de Potência 6 não permitirá que a energia de uma tomada doméstica inflija mais de quatro pontos de dano contundente (veja Eletricidade na pág. 224). Reduzir os danos elétricos a zero também desliga dispositivos elétricos – por exemplo, eliminar completamente a condutividade de um trilho de metrô desliga os trens.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157
  },
  {
    "id": "mta-2ed:alter-integrity",
    "name": "Alterar integridade",
    "originalName": "Alter Integrity",
    "requirements": {
      "Matter": 3
    },
    "practice": "Desgastando ou Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "Durabilidade",
    "roteSkills": [
      "Ofícios",
      "Medicamento",
      "Subterfúgio"
    ],
    "description": "Ao girar a ressonância de um objeto para dentro ou para fora do alinhamento com as verdades Stygian, o mago pode fortalecer ou enfraquecer seu material.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157
  },
  {
    "id": "mta-2ed:reach-the-effect-is-lasting-crucible",
    "name": "Alcance: O efeito é Crisol Duradouro",
    "originalName": "Reach: The effect is Lasting Crucible",
    "requirements": {
      "Matter": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Ciência"
    ],
    "description": "Com este feitiço, um objeto adquire um brilho de pureza Superna. Se seu propósito principal for como ferramenta, ele concede 8-Again em um número de jogadas igual à Potência do feitiço. Objetos valiosos, como ouro ou diamantes, tornam-se incrivelmente puros e bonitos. Adicione a Potência do feitiço ao índice de Disponibilidade do objeto para determinar seu valor aumentado. Este feitiço não pode aumentar a Disponibilidade de um objeto para mais que o dobro de sua classificação original.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158
  },
  {
    "id": "mta-2ed:nigredo-and-albedo",
    "name": "Nigredo e Albedo",
    "originalName": "Nigredo and Albedo",
    "requirements": {
      "Matter": 3
    },
    "practice": "Desgastando ou Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Briga",
      "Medicamento"
    ],
    "description": "Toda matéria contém dentro de si a Verdade Suprema de sua própria perfeição – ou de sua aniquilação. Este feitiço permite ao mago reparar ou destruir objetos, restaurando Estrutura perdida ou infligindo dano igual à Potência do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158
  },
  {
    "id": "mta-2ed:shrink-and-grow",
    "name": "Encolher e crescer",
    "originalName": "Shrink and Grow",
    "requirements": {
      "Matter": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "Durabilidade",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ciência"
    ],
    "description": "Por meio deste feitiço, o mago pode aproximar o reflexo Supernal de um objeto do mundo ou afastá-lo. Isso, por sua vez, faz com que o Supernal lance uma sombra maior ou menor no Mundo Decaído, efetivamente fazendo o objeto crescer ou encolher. Cada nível de Potência adiciona ou subtrai um do Tamanho do alvo. Objetos de tamanho 0 podem ser reduzidos até aproximadamente o tamanho de uma moeda de dez centavos. Adicionar Vida •••: O feitiço pode afetar alvos vivos. Indivíduos relutantes podem resistir com resistência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158
  },
  {
    "id": "mta-2ed:state-change",
    "name": "Mudança de estado",
    "originalName": "State Change",
    "requirements": {
      "Matter": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Durabilidade",
    "roteSkills": [
      "Ofícios",
      "Persuasão",
      "Ciência"
    ],
    "description": "O mago pode transmutar qualquer material inorgânico em um “passo” no caminho do sólido para o líquido e para o gasoso. Esta mudança de estado induzida magicamente não altera a temperatura do material: o aço liquefeito permanece tão frio ao toque como se fosse sólido, e o gelo vaporizado ainda está gelado. Transformar um líquido ou gás em sólido dá ao novo objeto uma Durabilidade igual à Potência do feitiço; A estrutura é determinada como Durabilidade + Tamanho. Quando a Duração passa, a substância retorna ao seu estado natural, mas mantém a forma que manteve durante o estado alterado. (No caso de materiais transformados em gás, isso geralmente significa uma chuva fina ou neve de composição incomum.) Adicionar Forças •••: O mago pode transmutar matéria em plasma.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158
  },
  {
    "id": "mta-2ed:windstrike",
    "name": "Golpe de vento",
    "originalName": "Windstrike",
    "requirements": {
      "Matter": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Briga",
      "Ofícios"
    ],
    "description": "O próprio ar (ou outra matéria fluida) ataca os inimigos do mago. O vento sopra e golpeia como um punho, ou a água ataca como um chicote. Este é um feitiço de ataque; sua taxa de dano é igual à Potência do feitiço e inflige dano contundente.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158
  },
  {
    "id": "mta-2ed:wonderful-machine",
    "name": "Máquina Maravilhosa",
    "originalName": "Wonderful Machine",
    "requirements": {
      "Matter": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Política",
      "Ciência"
    ],
    "description": "Este feitiço permite que um mago sobreponha rapidamente pedaços de vários objetos uns nos outros, de modo a produzir o resultado desejado. Com este feitiço, um mago poderia, por exemplo, integrar uma pistola de pregos e uma espingarda para produzir uma arma que dispara uma saraivada de pregos a cada puxada do gatilho. Para cada nível de Potência, o mago pode transpor uma qualidade (como a geração de calor de uma churrasqueira ou sua habilidade de girar outro objeto dentro dela) de um determinado objeto mecânico para outro objeto mecânico. No caso de combinação de armas de fogo com outras armas de fogo, uma característica da arma pode ser trocada por outra (criando uma pistola, por exemplo, que utiliza cartuchos de espingarda como munição). Uma arma de fogo também pode ser incorporada totalmente em outro dispositivo, disfarçando efetivamente a arma até que ela seja usada pela primeira vez (ou seja submetida a uma inspeção mística ou mundana).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158
  },
  {
    "id": "mta-2ed:adept-of-matter-ghostwall",
    "name": "Adepto da Matéria Ghostwall",
    "originalName": "Adept of Matter Ghostwall",
    "requirements": {
      "Matter": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Ocultismo",
      "Furtividade"
    ],
    "description": "Toda Matéria Caída é apenas uma sombra da verdade Superna, e este feitiço revela a verdade desse axioma. O mago torna um volume de matéria inerte total ou parcialmente insubstancial, não mais “real” do que uma ilusão. Objetos insubstanciais permanecem onde estavam quando foram transfigurados (ou seja, não caem no centro da Terra nem voam para o espaço). Objetos tornados insubstanciais por este feitiço não estão em Crepúsculo, eles simplesmente não são registrados como “reais”. Adicione Morte •••, Mente ••• ou Espírito •••: O objeto insubstancial pode ser transferido para Crepúsculo, sintonizado com o Arcano usado.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:golem",
    "name": "Golem",
    "originalName": "Golem",
    "requirements": {
      "Matter": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ocultismo"
    ],
    "description": "Este feitiço anima uma estátua ou outro objeto, permitindo que ele se mova e aja quase como se estivesse vivo. Cada nível de Potência efetivamente concede ao mago um ponto de Mérito Retentor. O “campo” do Golem inclui trabalho físico simples, combate e outras tarefas descomplicadas. O golem é completamente estúpido e só pode executar qualquer ordem que o lançador lhe deu por último. Os pedidos devem ser muito simples. Se atacado, o golem não tem Defesa, mas tem Durabilidade apropriada à sua composição (veja Objetos na pág. 223) e Estrutura igual a Durabilidade + Tamanho. Adicione Morte •••• ou Espírito ••••: Vincule um fantasma ou espírito ao golem para servir como uma inteligência animadora. O golem ainda usa seu nível de Retentor para determinar as paradas de dados, mas o ser efêmero pode usar qualquer um de seus poderes, e o “campo” do golem é aquilo de que a entidade é capaz. Adicionar Mente •••••: Crie uma inteligência do nada que guiará o golem e informará seu “campo”. Veja \"Gênesis Psíquica\" na pág. 165 para criar uma mente do zero.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:piercing-earth",
    "name": "Perfurando a Terra",
    "originalName": "Piercing Earth",
    "requirements": {
      "Matter": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Briga",
      "Ofícios"
    ],
    "description": "Muito parecido com Windstrike (veja pág. 157), este feitiço faz com que matéria inanimada atinja o alvo. Mas onde Windstrike ataca com ar e água, este feitiço faz com que a própria Terra se levante e esmague o alvo. Este é um feitiço de ataque; sua taxa de dano é igual à Potência do feitiço e inflige dano letal.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:transubstantiation",
    "name": "Transubstanciação",
    "originalName": "Transubstantiation",
    "requirements": {
      "Matter": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Empatia",
      "Ciência"
    ],
    "description": "O mago pode transmutar qualquer matéria inerte em qualquer outra forma de matéria inerte: chumbo em ouro, água em vinho, madeira em cloro gasoso, etc. A pureza e qualidade da matéria transmutada são determinadas pela Potência do feitiço: trate a Potência como um bônus de equipamento ou pontos de Mérito de Recursos equivalentes para uma única compra, o que for apropriado. Tanto a substância inicial como a substância transubstanciada devem ser relativamente puras: a madeira pode ser transformada em ouro, mas não em ouro cravejado de prata. (Os Mistérios Estígios ensinam que “pureza” é um conceito perceptual – assim, por exemplo, embora “vinho” e “aço” sejam compostos de numerosos compostos, eles são concretos o suficiente como conceitos para serem transmutados). Adicionar Vida ••••: Transforma matéria em coisas vivas, ou transforma um ser vivo em matéria inerte (mas veja p.127 para regras sobre transformar permanentemente alguém com magia). A menos que o mago também adicione Mente •••••, qualquer organismo criado é estúpido, movido puramente pelo instinto.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:master-of-matter-annihilate-matter",
    "name": "Mestre da Matéria Aniquilar Matéria",
    "originalName": "Master of Matter Annihilate Matter",
    "requirements": {
      "Matter": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "Durabilidade",
    "roteSkills": [
      "Atletismo",
      "Intimidação",
      "Ciência"
    ],
    "description": "O mago pode destruir matéria inerte, reduzindo-a ao nada e dissolvendo completamente sua estrutura atômica. Na verdade, ele faz com que deixe de existir. Enquanto os objetos destruídos por Nigredo e Albedo (ver pág. 157) se estilhaçam ou desintegram conforme apropriado, a matéria destruída por este feitiço é aniquilada; nada resta disso. Objetos e materiais mágicos, como tass ou artefatos, normalmente não podem ser destruídos com este feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:ex-nihilo",
    "name": "Ex Nihilo",
    "originalName": "Ex Nihilo",
    "requirements": {
      "Matter": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência ===== PDF PÁGINA 160 ===== 159mente",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ciência"
    ],
    "description": "O mago cria um objeto do nada. O objeto pode ser qualquer ferramenta simples ou máquina relativamente simples (um revólver é adequado, mas uma arma automática é muito complexa). O tamanho do objeto é determinado pelo fator Escala. A Potência do feitiço pode ser alocada conforme o mago desejar entre Durabilidade ou bônus de equipamento.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:self-repairing-machine",
    "name": "Máquina auto-reparável",
    "originalName": "Self-Repairing Machine",
    "requirements": {
      "Matter": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Medicamento",
      "Ocultismo"
    ],
    "description": "Este feitiço confere a um objeto uma pequena aparência de vida – especificamente, a habilidade de se reparar. Enquanto o feitiço durar, o objeto cura a Estrutura (Potência) todos os dias.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:initiate-of-mind-know-nature",
    "name": "Iniciado da Mente Conheça a Natureza",
    "originalName": "Initiate of Mind Know Nature",
    "requirements": {
      "Mind": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Ciência",
      "Subterfúgio"
    ],
    "description": "Ao observar seu alvo, o mago pode determinar sua Virtude, Vício e quantos pontos em Atributos Mentais e Sociais ele possui.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:mental-scan",
    "name": "Varredura Mental",
    "originalName": "Mental Scan",
    "requirements": {
      "Mind": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Empatia",
      "Investigação",
      "Ocultismo"
    ],
    "description": "Ao examinar rapidamente a superfície dos pensamentos de um alvo, o mago é capaz de discernir seu estado mental e emocional. Para cada nível de Potência, o mago pode fazer uma única pergunta ao Narrador para obter informações sobre o estado mental ou emocional do alvo. Esta informação vem como flashes de percepção dos pensamentos do sujeito, então o Narrador deve ter certeza de representar suas respostas como tal. Exemplos de perguntas • Qual é o humor atual do sujeito? Flashes de estar preso no trânsito ou esperando em uma longa fila do lado de fora de uma loja. A ideia de um pôr do sol sereno na praia. • Quão inteligente é o sujeito? Flashes simples de imagens aparentemente não relacionadas. Uma imagem de uma teoria matemática complexa ou uma citação de uma peça de literatura conhecida. • O assunto é sobrenatural? Pensamentos de beber a força vital dos outros. As formas básicas das imagens passando rapidamente. Pensamentos que oscilam entre animalescos e humanos. • O que o sujeito mais deseja? Imagens de dinheiro, o rosto de uma pessoa passando ou um carro chamativo. • De que tipo de psicose o sujeito sofre, se houver? Pensamentos que parecem provir de muitas fontes. Medo paralisante associado a um pensamento específico.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:one-mind-two-thoughts",
    "name": "Uma mente, dois pensamentos",
    "originalName": "One Mind, Two Thoughts",
    "requirements": {
      "Mind": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Ciência"
    ],
    "description": "O sujeito pode ter duas linhas de pensamento individuais e totalmente distintas ao mesmo tempo, desde que nenhuma delas seja fisicamente exigente. Ela pode realizar duas tarefas estendidas Mentais ou Sociais separadas ao mesmo tempo. Nenhuma das tarefas pode ser puramente física, mas o sujeito pode manter uma conversa enquanto compõe um soneto ou escrever um poema enquanto pesquisa descobertas científicas.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:perfect-recall",
    "name": "Recordação perfeita",
    "originalName": "Perfect Recall",
    "requirements": {
      "Mind": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Investigação"
    ],
    "description": "O sujeito é capaz de relembrar coisas de seu passado com detalhes vívidos. Para cada nível de Potência do feitiço, o alvo pode recordar uma memória com perfeita precisão. Ela consegue se lembrar do tamanho exato, do cheiro, do peso e das palavras escritas em um pedaço de papel. Ela consegue se lembrar dos detalhes exatos de uma conversa, incluindo partes nas quais não estava se concentrando conscientemente, como o tipo de terno que alguém estava usando ou o cheiro de sua colônia. ••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:apprentice-of-mind-alter-mental-pattern",
    "name": "Aprendiz da Mente Altera Padrão Mental",
    "originalName": "Apprentice of Mind Alter Mental Pattern",
    "requirements": {
      "Mind": 2
    },
    "practice": "Véu",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ciência",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "O mago pode alterar o fluxo mental básico do alvo, mudando seus pensamentos subconscientes e emanações superficiais para refletir qualquer estado mental ou emocional que o mago desejar. O feitiço na verdade não altera o estado de espírito do alvo, mas em vez disso altera a forma como ele se projeta, protegendo-o de poderes sobrenaturais que leriam seus pensamentos ou tentariam perfurar seu véu normal de mentiras e desorientações. Adicione a Potência do feitiço aos testes relevantes de Subterfúgio. Poderes sobrenaturais que leem os pensamentos ou emoções superficiais do alvo provocam um Confronto de Vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:dream-reaching",
    "name": "Alcançando Sonhos",
    "originalName": "Dream Reaching",
    "requirements": {
      "Mind": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Empatia",
      "Medicamento",
      "Persuasão"
    ],
    "description": "O mago pode entrar e compartilhar os sonhos de um sujeito adormecido. O mago testemunha o sonho e pode influenciar sua direção, embora não faça parte diretamente do sonho. Lançar este feitiço em si mesma garante que o mago se lembre de seus sonhos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:emotional-urging",
    "name": "Urgência Emocional",
    "originalName": "Emotional Urging",
    "requirements": {
      "Mind": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Empatia",
      "Intimidação",
      "Subterfúgio"
    ],
    "description": "O mago pode projetar um estado emocional em seu alvo, incutindo emoções que lubrificam as rodas sociais ou criam barreiras entre as pessoas. O mago escolhe no lançamento projetar uma emoção positiva ou negativa em seu alvo, o que lhe permite abrir ou fechar uma Porta. A abertura de uma Porta geralmente ocorre antes de uma tentativa de manobra Social, e a influência da abertura da Porta não precisa beneficiar o mago, mas pode beneficiar qualquer um que lide com o assunto durante a Duração do feitiço. O mago pode fechar Portas previamente abertas com o alvo, tornando mais difícil para outros atingirem seus objetivos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:first-impressions",
    "name": "Primeiras impressões",
    "originalName": "First Impressions",
    "requirements": {
      "Mind": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Ofícios",
      "Socializar",
      "Subterfúgio"
    ],
    "description": "O mago pode ditar como um alvo reagirá a uma interação social, tornando-o mais ou menos inclinado a ouvir uma discussão. O feitiço afeta a próxima tentativa de manobra Social feita contra o alvo, aumentando ou diminuindo a primeira impressão em níveis iguais à Potência. Presença Incógnita (Mente ••) Prática: Velar Fator Primário: Duração Resistência: Perseverança Custo: 1 Mana Habilidades Rotinas Sugeridas: Empatia, Furtividade, Subterfúgio O mago esconde a presença psíquica do alvo, fazendo com que os espectadores a ignorem. Quando as pessoas olham para ela, elas querem desviar os olhos ou mal notá-la. As pessoas não conseguem se lembrar de tê-la visto quando não estão mais olhando em sua direção. Seres que usam habilidades sobrenaturais para se concentrar nela, incluindo Active Mage Sight, provocam um Confronto de Vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:memory-hole",
    "name": "Buraco de memória",
    "originalName": "Memory Hole",
    "requirements": {
      "Mind": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Medicamento",
      "Subterfúgio"
    ],
    "description": "O mago compartimenta os pensamentos do alvo, colocando memórias em áreas que ele não consegue acessar ou lembrar. O mago pode compartimentar uma memória por Potência, fazendo com que o alvo as esqueça completamente durante a Duração do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:mental-shield",
    "name": "Escudo Mental",
    "originalName": "Mental Shield",
    "requirements": {
      "Mind": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Intimidação",
      "Sobrevivência"
    ],
    "description": "O mago ergue um escudo mental que protege o alvo de ataques mentais. O escudo provoca um Confronto de Vontades contra qualquer Goetia Numina, Influências ou Manifestações visando o",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:psychic-domination",
    "name": "Dominação Psíquica",
    "originalName": "Psychic Domination",
    "requirements": {
      "Mind": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Expressão",
      "Intimidação",
      "Subterfúgio"
    ],
    "description": "O mago emprega projeções telepáticas limitadas. Ela pode enviar comandos simples por meio de pensamentos e emoções ao sujeito por meio de um link mental, mas não frases completas ou ideias complexas. As ideias formam impulsos e desejos dentro do sujeito que ele é compelido a agir mesmo contra sua vontade enquanto o feitiço permanecer ativo. Os comandos devem ser simples, com uma palavra – como dormir, comer, sentar ou defender. A intenção do comando é enviada ao sujeito junto com os pensamentos e emoções. O sujeito sabe que as ideias não se originam dele mesmo, embora não saiba necessariamente de onde elas vêm. Essas comunicações podem ser usadas para projetar emoções com \"Instância Emocional\" p. 160.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:telepathy",
    "name": "Telepatia",
    "originalName": "Telepathy",
    "requirements": {
      "Mind": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Ofícios",
      "Empatia",
      "Socializar"
    ],
    "description": "O mago sincroniza os pensamentos superficiais de seus súditos, fazendo com que os pensamentos superficiais de um deles se manifestem na mente dos outros. Aplique a Potência do feitiço como um bônus ou penalidade em testes de Habilidades relevantes (como Empatia ou Subterfúgio) entre os alvos. Indivíduos que pensam cuidadosamente em uma mensagem podem usar o efeito para se comunicarem telepaticamente através do link; isso pode exigir um teste de Compostura + Empatia para indivíduos não acostumados com a sensação.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:disciple-of-mind-augment-mind",
    "name": "Discípulo da Mente Aumenta a Mente",
    "originalName": "Disciple of Mind Augment Mind",
    "requirements": {
      "Mind": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Sobrevivência"
    ],
    "description": "O mago é capaz de aumentar a capacidade mental ou social do sujeito. O mago pode aumentar um dos Atributos Mentais ou Sociais do alvo em um ponto por nível de Potência do feitiço. Este aumento afeta quaisquer Vantagens ou outras características derivadas do nível do Atributo. O feitiço não pode aumentar o Atributo do alvo acima do máximo normal permitido por sua Gnose. Os benefícios deste feitiço não são óbvios para um observador casual, mas aqueles que conhecem o assunto podem notar um aumento em seu intelecto ou natureza carismática. +1 Alcance O mago pode aumentar um Atributo adicional com a magia para cada Alcance adicional, dividindo a Potência da magia entre eles. Por exemplo, o mago pode gastar +2 de Alcance com uma magia de Potência 4 e aumentar a Inteligência do alvo em +1, a Perseverança em +2 e o Raciocínio em +1. +2 de Alcance Ao gastar um ponto de Mana, o mago pode aumentar os Atributos Mentais ou Sociais de seu alvo acima do máximo normal permitido.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:befuddle",
    "name": "Confundir",
    "originalName": "Befuddle",
    "requirements": {
      "Mind": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "Compostura ou resolução",
    "roteSkills": [
      "Intimidação",
      "Persuasão",
      "Ciência"
    ],
    "description": "O mago reduz um dos Atributos Mentais ou Sociais do alvo. Cada nível de Potência reduz um dos Atributos Sociais ou Mentais do sujeito em um ponto, até um mínimo de 1. Reduzir Atributos também reduz quaisquer Vantagens derivadas, como Força de Vontade ou Iniciativa.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:clear-thoughts",
    "name": "Pensamentos claros",
    "originalName": "Clear Thoughts",
    "requirements": {
      "Mind": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Empatia",
      "Intimidação",
      "Persuasão"
    ],
    "description": "O mago suaviza pensamentos perturbadores e amortece emoções, fazendo o alvo pensar com clareza. O feitiço suprime uma Condição Mental ou Inclinação por nível de Potência durante sua Duração. Embora o feitiço seja frequentemente usado para tratar doenças mentais, ele também pode ser usado contra Condições positivas, suprimindo a euforia e a inspiração tão facilmente quanto o desespero e a fuga. O feitiço não pode afetar as Condições criadas pelo Paradoxo, e aquelas impostas por meios sobrenaturais provocam um Confronto de Vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:enhance-skill",
    "name": "Melhorar a habilidade",
    "originalName": "Enhance Skill",
    "requirements": {
      "Mind": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Sobrevivência"
    ],
    "description": "O mago é capaz de aumentar temporariamente uma das Habilidades de seu alvo. Ela pode aumentar uma Habilidade na qual o alvo já tenha pelo menos uma graduação em um ponto por nível de Potência do feitiço. O feitiço não pode aumentar a Habilidade do alvo acima do máximo normal.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-2ed:goetic-summons",
    "name": "Invocação Goética",
    "originalName": "Goetic Summons",
    "requirements": {
      "Mind": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "Classificação",
    "roteSkills": [
      "Persuasão",
      "Socializar",
      "Ocultismo"
    ],
    "description": "O mago envia uma chamada para a Goetia mais próxima dentro de seu alcance sensorial. Por outro lado, ela pode invocar Goetia que ela conhece pessoalmente. Ela pode enviar uma chamada geral e a Goetia mais próxima atenderá, ou pode especificar o tipo de entidade pela sua Ressonância. O feitiço não funciona em Goetia acima do Rank 5. Adicionar Espírito •• ou Morte ••: A entidade ganha a Condição Materializada pela Duração do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-2ed:imposter",
    "name": "Impostor",
    "originalName": "Imposter",
    "requirements": {
      "Mind": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Persuasão",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "O mago confunde os sentidos do alvo, fazendo-o acreditar que ela é outra pessoa. Ela pode inventar uma aparência ou imitar a aparência, o som e o cheiro exatos de qualquer indivíduo que conheça. A menos que o mago tenha interagido extensivamente com a pessoa que ele está personificando, ele deve fazer um teste de Manipulação + Subterfúgio quando começar a interagir com seu alvo e a cada minuto que continuar interagindo com ele. O feitiço não pode imitar Qualidades Sociais específicas que concedem bônus de dados em testes Sociais. Se o mago abrir qualquer Porta ou causar novas primeiras impressões, o benefício do progresso irá para a pessoa que ele está personificando, não para si mesmo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-2ed:psychic-assault",
    "name": "Ataque Psíquico",
    "originalName": "Psychic Assault",
    "requirements": {
      "Mind": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Intimidação",
      "Medicamento"
    ],
    "description": "Uma mente viva é algo delicado, facilmente quebrado. Este feitiço força o cérebro do alvo a um estado perigosamente hiperativo, imitando os efeitos de um derrame. O alvo sofre dano contundente igual à Potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-2ed:sleep-of-the-just",
    "name": "Sono dos Justos",
    "originalName": "Sleep of the Just",
    "requirements": {
      "Mind": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Acadêmicos",
      "Atletismo",
      "Ocultismo"
    ],
    "description": "O mago controla o ciclo de sono do alvo, permitindo que ele permaneça acordado sem efeitos nocivos ou dormindo sem ser acordado durante a duração do feitiço. O mago também pode controlar o que sonha ou criar um estado de sonho lúcido onde o alvo tem controle. Qualquer tentativa de entrar ou influenciar o estado de sonho provoca um Confronto de Vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-2ed:read-the-depths",
    "name": "Leia as profundezas",
    "originalName": "Read the Depths",
    "requirements": {
      "Mind": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Empatia",
      "Investigação",
      "Medicamento"
    ],
    "description": "O mago pode entrar telepaticamente no subconsciente do alvo. Ela pode extrair memórias e ideias do subconsciente do sujeito, em vez de apenas ler pensamentos superficiais (veja \"Telepatia\"). + 1",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-2ed:universal-language",
    "name": "Língua universal",
    "originalName": "Universal Language",
    "requirements": {
      "Mind": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Investigação",
      "Persuasão"
    ],
    "description": "O alvo da magia é capaz de compreender e traduzir qualquer idioma. Isto é verdade para a palavra falada, a linguagem escrita, os símbolos, os sinais codificados, a linguagem corporal, os símbolos manuais e os conceitos que só existem como pensamento. Ela deve ser capaz de perceber a linguagem para entendê-la (por exemplo, usando telepatia para pensamentos na mente de outra pessoa). Este feitiço não permite que personagens não Despertos entendam a Fala Superior. ••••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:adept-of-mind-gain-skill",
    "name": "Adepto da Mente ganha habilidade",
    "originalName": "Adept of Mind Gain Skill",
    "requirements": {
      "Mind": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ciência"
    ],
    "description": "O mago é capaz de conceder temporariamente uma Habilidade ao alvo, concedendo um número de pontos em uma Habilidade por nível de Potência do feitiço. O feitiço não pode aumentar a Habilidade do alvo acima do máximo normal. +1 Alcance O mago pode conceder uma Habilidade adicional com o feitiço para cada Alcance adicional gasto, dividindo a Potência do feitiço entre eles. Por exemplo, um mago pode gastar +2 de Alcance com um feitiço de Potência 4 para ganhar a Habilidade Subterfúgio com um ponto, a Habilidade Intimidar com dois pontos e a Habilidade Empatia com um ponto.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:hallucination",
    "name": "Alucinação",
    "originalName": "Hallucination",
    "requirements": {
      "Mind": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Acadêmicos",
      "Persuasão",
      "Subterfúgio"
    ],
    "description": "O mago cria informações sensoriais falsas em seu alvo, enganando seus sentidos e criando uma alucinação. O mago cria uma única ilusão que parece completamente real para o seu alvo. Ela afeta o som, o olfato, o paladar e a visão com a ilusão, embora seja incapaz de tornar a ilusão tátil para o alvo. + 1",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:mind-flay",
    "name": "Esfolar a mente",
    "originalName": "Mind Flay",
    "requirements": {
      "Mind": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Intimidação",
      "Ciência"
    ],
    "description": "O mago separa a mente consciente e subconsciente do alvo, causando dano ao fazê-lo. O alvo sofre um ponto de dano letal para cada nível de Potência do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:possession",
    "name": "Posse",
    "originalName": "Possession",
    "requirements": {
      "Mind": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Medicamento",
      "Persuasão",
      "Subterfúgio"
    ],
    "description": "O mago pode enviar sua consciência para o alvo e tomar posse de seu corpo. O mago assume o controle do alvo, impondo a Condição de Possuído (veja p. 261). Enquanto estiver possuindo o alvo, o mago usa as regras para posse como uma entidade efêmera, com as seguintes alterações. Ele pode usar qualquer um de seus feitiços Mentais no alvo para ler sua mente, e pode gastar um ponto de Mana para usar seus próprios Atributos Mentais e Sociais em vez dos Atributos do hospedeiro. Ela deve sempre usar os Atributos Físicos de seu alvo, mas pode gastar um ponto de Mana para reduzir a penalidade de –3 em ações Físicas para 0. Enquanto possui o alvo, seu corpo fica em coma como em \"Projeção Psíquica\", abaixo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:psychic-projection",
    "name": "Projeção Psíquica",
    "originalName": "Psychic Projection",
    "requirements": {
      "Mind": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Socializar"
    ],
    "description": "O mago pode projetar a consciência do alvo em um estado de Crepúsculo ou nos sonhos de outra pessoa. A projeção mental usa as regras para Formas Oníricas no Capítulo Seis (p. 249). Não tem corpo efêmero, mas sim uma imagem mental incorpórea e intangível. Enquanto estiver em Crepúsculo, o alvo não pode interagir fisicamente com o ambiente e deve usar magia para afetar qualquer coisa. Ela é imune a ataques físicos, mas ainda é suscetível a habilidades sobrenaturais que afetam a mente. Embora mentalmente projetado, seu corpo fica em estado de coma, e ela não tem como saber sua saúde ou estado sem retornar ou usar outra magia. Se sua projeção morrer, ela retorna ao seu corpo com a condição Soul Shocked. Adicionar Espírito ••: O mago pode projetar a consciência do alvo além da Película para o Reino das Sombras. O feitiço também é Resistido pela classificação Gauntlet (pág. 179).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:psychic-reprogramming",
    "name": "Reprogramação Psíquica",
    "originalName": "Psychic Reprogramming",
    "requirements": {
      "Mind": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Intimidação",
      "Medicamento",
      "Persuasão"
    ],
    "description": "O mago reescreve a personalidade do alvo, mudando a própria essência de quem ele é. O mago pode mudar um dos seguintes aspectos do alvo para cada Potência do feitiço: Virtude, Vício, Aspiração de Curto Prazo, Aspiração de Longo Prazo, Obsessão, uma Condição Persistente não Física, ou pode mover um ponto entre duas Habilidades Sociais, ou entre duas Habilidades Mentais.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:terrorize",
    "name": "Aterrorizar",
    "originalName": "Terrorize",
    "requirements": {
      "Mind": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Expressão",
      "Intimidação",
      "Medicamento"
    ],
    "description": "O feitiço provoca uma sensação avassaladora de medo e pavor em seu alvo, drenando sua força e vontade de viver. O alvo sofre a Inclinação Insensata durante a duração do feitiço, ou até que a Inclinação seja resolvida (por exemplo, ao ser atacado).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:master-of-mind-amorality",
    "name": "Mestre da Mente Amoralidade",
    "originalName": "Master of Mind Amorality",
    "requirements": {
      "Mind": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Ofícios",
      "Empatia",
      "Expressão"
    ],
    "description": "O mago rompe os laços do alvo com seus impulsos orientadores, removendo completamente sua Virtude ou seu Vício. Enquanto não tiver uma Virtude, o alvo fica mais propenso a ceder ao seu Vício e ganha dois pontos de Força de Vontade sempre que normalmente ganharia um. Enquanto não tiver um Vício, o personagem age de maneira completamente consistente com sua Virtude e é incapaz de se envolver ativamente em atividades que possam constituir um ponto de ruptura ou Ato de Arrogância. Testemunhar atos hediondos ou horríveis ainda causa pontos de ruptura para personagens Adormecidos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:no-exit",
    "name": "Sem saída",
    "originalName": "No Exit",
    "requirements": {
      "Mind": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Expressão",
      "Persuasão",
      "Ciência"
    ],
    "description": "O mago cria um ciclo de pensamento mental para o alvo, prendendo-o em sua própria mente. Durante a duração do feitiço,",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:mind-wipe",
    "name": "Limpeza mental",
    "originalName": "Mind Wipe",
    "requirements": {
      "Mind": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Acadêmicos",
      "Intimidação",
      "Ocultismo"
    ],
    "description": "O mago remove uma grande parte das memórias do alvo. A vítima sofre da Condição de Amnésia durante a duração do feitiço, incapaz de recordar um mês por nível de Potência. O mago pode especificar qual parte da vida do alvo foi esquecida.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:psychic-genesis",
    "name": "Gênesis Psíquica",
    "originalName": "Psychic Genesis",
    "requirements": {
      "Mind": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Ciência"
    ],
    "description": "O mago cria uma consciência como uma inteligência autoconsciente com presença de Crepúsculo. A consciência ganha características de Goetia de Rank 1. A consciência permanece durante a duração do feitiço como o servo leal do mago, e ela é capaz de direcioná-lo para completar tarefas sem o uso de quaisquer feitiços adicionais.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:social-networking",
    "name": "Redes Sociais",
    "originalName": "Social Networking",
    "requirements": {
      "Mind": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Persuasão",
      "Política",
      "Socializar"
    ],
    "description": "O mago cria redes sociais onde antes não existiam. Para cada nível de Potência, o alvo ganha um ponto em uma das seguintes Qualidades: Aliados, Contatos ou Status. Esfera Primordial: Magia, o Mundo Superno, Nimbus, verdade, Yantras, Mana, Relíquias, tass, ressonância, revelação Assim como uma linguagem deve ter palavras para se descrever, o Supernal também deve ter um Arcano que o defina. Prime, o Arcano sutil que rege o Éter, é esse Arcano. Sua competência é a manipulação da própria magia: Mana e tass, o Nimbus e as Relíquias, a Alta Fala e as runas dos antigos mestres. Através do Prime, um mago torna-se sintonizado com a Verdade Superna, capaz de perfurar ilusões e evocar imagens aperfeiçoadas dos seres-símbolos do Éter. Os Obrimos arrogantes às vezes afirmam que isso faz do Prime o maior dos Arcanos, mas isso é uma simplificação exagerada. Prime é o Arcano através do qual o Superno se conhece, mas sem os outros Arcanos, é tão vazio quanto uma linguagem cujo único vocabulário são partes do discurso. •",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:initiate-of-prime-dispel-magic",
    "name": "Iniciado de Prime Dispel Magic",
    "originalName": "Initiate of Prime Dispel Magic",
    "requirements": {
      "Prime": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "Classificação Arcana do lançador do feitiço em questão",
    "roteSkills": [
      "Atletismo",
      "Intimidação",
      "Ocultismo"
    ],
    "description": "Toda magia Desperta contém a capacidade de acabar, de permitir que as leis do Mundo Decaído se reafirmem. Ao compelir essas falhas em um feitiço existente, o mago pode suprimi-lo temporariamente – ou até mesmo destruí-lo completamente. Este feitiço não é potente o suficiente para dissipar os feitiços de um arquimago e só funciona contra magia Desperta. Além disso, o mago deve incluir todos os Arcanos envolvidos na conjuração da magia em questão em um ponto. Um lançamento bem sucedido suprime o feitiço pela Duração de Dissipar Magia. Adicionar Destino •: O mago pode suprimir o feitiço alvo seletivamente, por um número de alvos igual ao fator de escala de Dissipar Magia.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:pierce-deception",
    "name": "Perfurar Decepção",
    "originalName": "Pierce Deception",
    "requirements": {
      "Prime": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Medicamento",
      "Ocultismo"
    ],
    "description": "Prime é o Arcanum da pura Verdade, e nenhuma falsidade pode estar diante dele. Por meio desse feitiço, o sujeito vê ilusões, fantasmas e mentiras pelo que são. O feitiço vê através de falsidades mundanas o sujeito percebe automaticamente; ilusão mágica ou engano provoca automaticamente um Clash of Wills. Este feitiço só revela inverdades \"ativas\": o sujeito veria que alguém com cabelo tingido não é realmente uma loira, ou reconheceria uma mentira quando a ouvisse, mas não saberia que um executivo de Wall Street vem cometendo fraude fiscal há anos apenas olhando para ele. No entanto, se ela visse a declaração de imposto dele, veria que era uma falsidade.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:supernal-vision",
    "name": "Visão Superna",
    "originalName": "Supernal Vision",
    "requirements": {
      "Prime": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "Ao abrir o terceiro olho de seu alvo, o mago revela a seus companheiros as fontes de poder Superno que são. Ao estudar uma pessoa, lugar ou local por um turno, o sujeito sabe automaticamente se ele está conectado ao Supernal (por exemplo, se uma pessoa é um mago, um Sonâmbulo, um Proximus ou um Adormecido; se um lugar é um Domínio ou Fronteira; se um objeto é Imbuído, Aprimorado ou um Artefato), e pode fazer um número das seguintes perguntas igual à Potência do feitiço: • Quanta Mana o alvo tem em seu Padrão? • Com qual Mundo Superno o alvo está mais alinhado? • Qual é o Arcano de maior valor do alvo?* • Quão adepto é o alvo em seu Arcano de maior valor? • Quantos Arcanos o sujeito conhece? • Qual é o Nimbus do alvo? • Qual é a Gnose do alvo? * A pergunta subsequente revela o segundo, terceiro, etc. Arcanos mais elevados do alvo. O sujeito percebe as respostas como símbolos e visões Supernas que se desdobram em torno do alvo. Se o alvo desejar mais informações sobre um fenômeno específico, ele poderá estudá-lo por vários turnos, enquanto durar a Duração da magia. Efeitos que ocultariam a natureza do alvo provocam um Confronto de Vontades normalmente.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 167
  },
  {
    "id": "mta-2ed:sacred-geometry",
    "name": "Geometria Sagrada",
    "originalName": "Sacred Geometry",
    "requirements": {
      "Prime": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "Enquanto seus sentidos estiverem abertos para este feitiço, o alvo pode perceber claramente linhas ley e nós. Dependendo da Trilha e do Nimbus do conjurador, ele pode vê-los como raios de luz dourada encontrando-se em sólidos platônicos brilhantes, rios azuis elétricos formando lagos ou acordes de música formando uma poderosa sinfonia. Se não houver linhas ley ou nós dentro do alcance sensorial, o sujeito sente uma sensação de puxão em direção ao ley ou nó mais próximo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 167
  },
  {
    "id": "mta-2ed:scribe-grimoire",
    "name": "Escriba Grimório",
    "originalName": "Scribe Grimoire",
    "requirements": {
      "Prime": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "Total de pontos de Arcano de todos os Arcanos usados ​​no feitiço que está sendo escrito.",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ocultismo"
    ],
    "description": "Por meio deste feitiço, o mago dá forma física aos mudras de uma Rotina específica, criando um Grimório (ver pág. 101). Este feitiço tem duas aplicações ligeiramente diferentes, embora relacionadas: o mago pode inscrever uma Rotina que ele conhece ou pode copiar uma Rotina de outro Grimório que tenha em mãos. Apenas um único Rote pode ser inscrito por lançamento deste feitiço, mas um determinado Grimório pode conter vários Rotes ao mesmo tempo: um livro grande pode conter de 10 a 15 Rotes, enquanto uma pedra esculpida do tamanho de um punho pode conter apenas um ou dois, e um banco de dados de computador pode conter um número teoricamente ilimitado. Quando a Duração do feitiço expira, as Rotes inscritas desaparecem e não podem ser recuperadas.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 167
  },
  {
    "id": "mta-2ed:word-of-command",
    "name": "Palavra de Comando",
    "originalName": "Word of Command",
    "requirements": {
      "Prime": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Arte",
      "Ocultismo",
      "Persuasão"
    ],
    "description": "Objetos encantados e feitiços de longa duração geralmente têm gatilhos ou condições específicas que devem ser cumpridas antes de liberarem sua magia. Com este feitiço, um mago pode contornar essas condições, liberando a magia para fazer o que quiser. O objeto ou feitiço é ativado imediatamente, exatamente como se tivesse sido ativado por qualquer coisa que normalmente desencadeia o efeito. Se normalmente for necessária uma jogada de ativação, trate a Potência da magia como sucessos obtidos. Se a magia em questão requer Mana para ser ativada, o mago deve gastá-la de sua própria reserva. Sem Arcanos adicionais, este feitiço só pode ativar feitiços Supernos e objetos vinculados ao Mundo Superno, como Artefatos e Itens Imbuídos. Adicione Qualquer Outro Arcano •: Ao adicionar o Arcano relevante, um mago pode ativar efeitos mágicos e objetos criados por outras fontes de poder – Espírito para ativar um fetiche, Destino para desencadear uma maldição de uma fada, e assim por diante. Se este objeto requer energia mística (Essência ou substâncias estranhas) para ser ativado, o mago pode gastar Mana no lugar da fonte de energia normal. ••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 167
  },
  {
    "id": "mta-2ed:apprentice-of-prime-as-above-so-below",
    "name": "Aprendiz do Prime As Above, So Below",
    "originalName": "Apprentice of Prime As Above, So Below",
    "requirements": {
      "Prime": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Política"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 167
  },
  {
    "id": "mta-2ed:cloak-nimbus",
    "name": "Capa Nimbus",
    "originalName": "Cloak Nimbus",
    "requirements": {
      "Prime": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Política",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "Este feitiço protege o Nimbus do alvo de feitiços e efeitos que o leriam, como Visão Superna ou a habilidade de certos médiuns de ler estados emocionais em auras. Qualquer efeito desse tipo está sujeito a um Confronto de Vontades (veja p. 117). Qualquer efeito que não consiga perfurar o véu registra o alvo como um Adormecido comum. Feitiços lançados sob a influência deste feitiço não fazem com que o Nimbus Imediato do lançador (veja p. 89) se incendeie, a menos que ele queira. Além disso, enquanto este feitiço estiver ativo, o Signature Nimbus do alvo (veja pág. 89) é silenciado; qualquer tentativa de examiná-lo com a Visão de Mago provoca um Confronto de Vontades. Se o mago examinador falhar, ele não conseguirá encontrar nenhuma característica identificável no Signature Nimbus. Se o alvo realizar qualquer ação que faça com que seu Nimbus se incendeie, como permitir que isso aconteça ao lançar um feitiço ou imprimir seu Nimbus Assinado em um objeto, este feitiço termina imediatamente.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-2ed:invisible-runes",
    "name": "Runas Invisíveis",
    "originalName": "Invisible Runes",
    "requirements": {
      "Prime": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Intimidação",
      "Persuasão"
    ],
    "description": "Os Despertos fazem uso de sinais que outros não podem ver. Este feitiço desenha uma mensagem curta em Alta Fala, visível apenas para a Visão do Mago, sobre o alvo. A tentativa de alterar as marcas, substituindo-as, provoca um choque de vontades. Os magos usam esses sinais para marcar a propriedade e o território de sua cabala, ou deixar avisos uns para os outros, como qualquer forma de Visão Ativa do Mago os revela.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-2ed:supernal-veil",
    "name": "Véu Celestial",
    "originalName": "Supernal Veil",
    "requirements": {
      "Prime": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Subterfúgio",
      "Sobrevivência"
    ],
    "description": "Às vezes, até mesmo o maior mágico deve esconder sua luz debaixo do alqueire. Esta magia protege seu alvo, que pode ser uma magia, objeto, mago, criatura sobrenatural ou qualquer outro fenômeno mágico ativo, da detecção. Habilidades passivas (como Visão Periférica do Mago) falham automaticamente em detectar o fenômeno velado, enquanto tentativas ativas provocam um Confronto de Vontades.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:wards-and-signs",
    "name": "Alas e Sinais",
    "originalName": "Wards and Signs",
    "requirements": {
      "Prime": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "Ao ocultar seu alvo com símbolos etéricos de vitória e indomabilidade, o mago protege o alvo dos efeitos da magia hostil. Quando o alvo é alvo de uma magia, essa magia é Resistida com a Potência de Proteções e Sinais. Somente feitiços que tenham como alvo direto o alvo podem ser Resistidos; um feitiço que transforma o ar ao seu redor em fogo não pode ser resistido. Da mesma forma, se o alvo for um entre muitos assuntos, Proteções e Sinais apenas Resistirão ao feitiço em relação a ele. Outros sujeitos sofrem todos os efeitos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:words-of-truth",
    "name": "Palavras de verdade",
    "originalName": "Words of Truth",
    "requirements": {
      "Prime": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Expressão",
      "Intimidação",
      "Persuasão"
    ],
    "description": "O mago fala com línguas de fogo, e o mundo ouve. Enquanto as palavras que o mago fala são objetivamente verdadeiras e o mago sabe que são verdadeiras, todos os sujeitos deste feitiço podem ouvi-la e compreendê-la claramente, independentemente da distância, ruído ou barreiras linguísticas. Além disso, todos os sujeitos sabem, em um nível profundo da alma, que o que o mago diz é verdade. O feitiço só funciona em declarações que o mago sabe ser verdade: Ela não pode usá-lo para confirmar ou rejeitar teorias. Também não necessariamente obriga os alvos a agir sobre a informação de qualquer forma em particular, mas ignorar ou refutar esta verdade Supernal pode ser motivo para um ponto de ruptura. Em uma ação de manobra social, este feitiço pode remover uma porta ou melhorar o nível de impressão por um passo por ponto de potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:disciple-of-prime-aetheric-winds",
    "name": "Discípulo dos Ventos Etéricos Primordiais",
    "originalName": "Disciple of Prime Aetheric Winds",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Expressão",
      "Ocultismo"
    ],
    "description": "O mago invoca uma pequena fração da fúria uivante do Éter, varrendo seu alvo com ventos estridentes. Este é um feitiço de ataque que causa dano contundente igual à Potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:channel-mana",
    "name": "Canal Mana",
    "originalName": "Channel Mana",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "Compostura (ou classificação para entidades supernas)",
    "roteSkills": [
      "Ocultismo",
      "Política",
      "Socializar"
    ],
    "description": "Os fluxos de energia Supernal são os magos para manipular. Este feitiço permite ao mago mover uma quantidade de Mana igual à potência do feitiço entre um ou mais vasos que ela pode tocar, incluindo outros magos, ela mesma, Hallows, Artifacts, e outros. Ela deve, no entanto, respeitar seu limite de Gnosis-derivado Mana por turno.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:cleanse-pattern",
    "name": "Padrão de limpeza",
    "originalName": "Cleanse Pattern",
    "requirements": {
      "Prime": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Ocultismo",
      "Furtividade"
    ],
    "description": "As Formas que compõem o Padrão Superno de um alvo são marcadas pelo toque da magia. Com este feitiço, um mago remove os sinais reveladores de interferência dos Despertos. O feitiço remove o efeito dramático de falha de uma Revelação da Visão do Mago Focada (p. 92) de um alvo. Se o alvo do feitiço possuir o Nimbus de Assinatura de um mago, o feitiço o remove.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:display-of-power",
    "name": "Exibição de poder",
    "originalName": "Display of Power",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Briga",
      "Ocultismo",
      "Socializar"
    ],
    "description": "A magia em si cai sob a alçada de Prime, até mesmo suas funções mais privadas. Ao usar este feitiço, um mago agita o Mundo Supernal, fazendo-o responder aos magos dentro da área do feitiço. Em vez de ser totalmente interno, os Ímagos formados por magos dentro do efeito do feitiço tornam-se visíveis no Mundo Supernal para todas as formas de Visão Maga Ativa, exibidos como runas mágicas e flashes de símbolos pairando em torno do mago. Mages usar este feitiço como um",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:ephemeral-enchantment",
    "name": "Encantamento Efêmero",
    "originalName": "Ephemeral Enchantment",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Armamento"
    ],
    "description": "As formas de símbolo do Éter são reais o suficiente para cortar todas as camadas da realidade. Este feitiço encanta o sujeito a ser tão sólido às entidades Twilight quanto à matéria física. Este feitiço é igualmente eficaz contra todas as formas de Twilight; o assunto pode interagir com fantasmas, espíritos, anjos e coisas estranhas com facilidade igual.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:geomancy",
    "name": "Geomancia",
    "originalName": "Geomancy",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Ocultismo"
    ],
    "description": "Ao impor sua vontade sobre o fluxo natural de energia da Terra, o mago pode redirecionar linhas de ley dentro da área de efeito, remodelando nós e alterando a ressonância livremente. Ela pode mover as linhas de Ley, e portanto os Nodes criaram onde as linhas de Ley se cruzam, \"fixando\" uma linha a um ponto dentro da área de efeito do feitiço. Ela também pode mudar a palavra chave de ressonância de um nó para o que ela quiser.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:platonic-form",
    "name": "Forma platônica",
    "originalName": "Platonic Form",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ofícios",
      "Expressão"
    ],
    "description": "O mago pode fazer com que Mana se comporte como se comporta dentro da tass, criando um objeto mágico formado pela pura Mana. O objeto deve ser um objeto ou ferramenta simples (espadas e pedras preciosas são permissíveis, armas e carros não são). É obviamente mágico para espectadores, tem uma Durabilidade padrão de 1 e consiste em um ponto de Mana (que o mago deve pagar como parte do elenco). A potência pode ser atribuída aos seguintes efeitos: • Incr facilidade Durabilidade por +1 • Incr facilidade capacidade Mana por +1 (o mago pode preencher esta capacidade Mana gastando Mana como parte do elenco ou deixar o objeto parcialmente vazio) • Se o objeto pode ser usado como um tool ou arma, adicione +1 bônus de equipamento ou dano arma. Cada ação usando o construto como uma ferramenta ou arma usa até 1 Mana de sua fonte. Quando todo o Mana é retirado do objeto, ele desmorona para nada. Um mago pode \"reenchi-lo\" com o feitiço do Canal Mana ou efeitos semelhantes. Quando a Duração do feitiço se esgota, qualquer Mana não utilizado sublima de volta ao mundo e é perdido. Adicione Forças •••: O objeto não é obviamente mágico.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:stealing-fire",
    "name": "Roubar Fogo",
    "originalName": "Stealing Fire",
    "requirements": {
      "Prime": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Expressão",
      "Furto",
      "Persuasão"
    ],
    "description": "Prometeu trouxe fogo do Olimpo para o reino mortal. Por meio deste feitiço, o mago traz um pequeno fragmento de fogo Supernal para as massas adormecidas, mesmo que por algum tempo. O sujeito deste feitiço, que deve ser um dorminhoco, temporariamente torna-se um Sleepwalker (ver p. 303) com tudo o que implica. Qualquer ponto de ruptura devido a testemunhar magia e efeitos de Quiescência que o sujeito normalmente sofreria são mantidos em suspensão até que a Duração do feitiço expira, apenas para cair tudo de uma vez quando o feitiço termina. ••••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:adept-of-prime-apocalypse",
    "name": "Adepto do Apocalipse Prime",
    "originalName": "Adept of Prime Apocalypse",
    "requirements": {
      "Prime": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Ocultismo",
      "Persuasão",
      "Socializar"
    ],
    "description": "O sujeito deste feitiço tem as escamas da mentira removidas de seus olhos. Qualquer pessoa sujeita a este feitiço — mago, dorminhoco ou outro ser sobrenatural — ganha a visão de mago sintonizada com o Caminho do lançador. Juntamente com este dom vem imunidade temporária para a maldição Quiescence. No entanto, não prepara o alvo para interpretar as visões recebidas sob a Mage Sight, e os não iniciados são propensos a enfrentar pontos de ruptura devido ao trauma da Visão. Enquanto os sujeitos acordados podem controlar a nova visão como se fosse a sua própria, focando-a e empurrando-a de volta para a Periferia como a sua própria, outros sujeitos ganham Visão Mage Active e não podem desligar a visão — ela dura até que a Duração do feitiço expira, mas ainda aplica penalidades de jogo de dados e custos de Willpower conforme Mage Sight (ver p. 90). Se o sujeito ficar sem pontos de força de vontade e o feitiço ainda estiver ativo, ele ganha a Condição Cega enquanto a visão Supernal queima seus olhos. (A critério do contador de histórias, isso pode ser substituído por Sured ou uma Condição semelhante se o sujeito experimenta Mage Sight com outros sentidos).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:celestial-fire",
    "name": "Fogo Celestial",
    "originalName": "Celestial Fire",
    "requirements": {
      "Prime": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Expressão",
      "Ocultismo"
    ],
    "description": "O mago convoca os fogos supernais do Éter para ferir seus inimigos. Isto não é base, chama caída, mas sim a expressão pura da vontade despertada. Este é um feitiço de ataque; sua classificação de danos é igual à potência do feitiço, e inflige danos letais. O feitiço afecta as entidades Twilight.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:destroy-tass",
    "name": "Destruir o Tass",
    "originalName": "Destroy Tass",
    "requirements": {
      "Prime": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "Durabilidade",
    "roteSkills": [
      "Briga",
      "Intimidação",
      "Ocultismo"
    ],
    "description": "Por capricho do mago, as construções de Mana são varridas pelos ventos de Éter. Um elenco bem sucedido destrói o tass. O Mana mantido dentro dele não é destruído, mas sublima-se ao mundo e provavelmente retorna ao Hallow mais próximo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:hallow-dance",
    "name": "Santa Dança",
    "originalName": "Hallow Dance",
    "requirements": {
      "Prime": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Classificação Hallow",
    "roteSkills": [
      "Expressão",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "As marés de Éter se dissipam e fluem, despertando lugares sagrados e enviando-os para dormir mais uma vez no ciclo das eras. Este feitiço permite ao mago dobrar esse ciclo à sua vontade. O mago pode suprimir um Hallow ativo ou acordar um adormecido com este feitiço. Despertar um Hallow adormecido requer uma potência igual à classificação do Hallow, enquanto amortecer um Hallow reduz a sua classificação de pontos eficaz em um por ponto de potência. Se o Hallow é suprimido a zero pontos ou menos, ele cai dormente. Ver p. 241 para mais informações sobre Hallows.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:supernal-dispellation",
    "name": "Dispelação Supernal",
    "originalName": "Supernal Dispellation",
    "requirements": {
      "Prime": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "Classificação Arcana do lançador do feitiço em questão",
    "roteSkills": [
      "Atletismo",
      "Intimidação",
      "Ocultismo"
    ],
    "description": "Verdades supernais nunca podem ser realmente desfeitas, mas com este feitiço o mago pode jogá-las de volta através do Abismo, efetivamente apagando qualquer feitiço que ela encontrar. Este feitiço não é potente o suficiente para dissipar os feitiços dos arcos. Um elenco bem sucedido suprime o feitiço para a Duração da Dispelação Supernal. Adicionar destino •: O mago pode suprimir o feitiço do sujeito seletivamente, para um número de sujeitos iguais ao fator Escala Dispel.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:master-of-prime-blasphemy",
    "name": "Mestre da Blasfêmia Prime",
    "originalName": "Master of Prime Blasphemy",
    "requirements": {
      "Prime": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "Hallow Rating, se aplicável",
    "roteSkills": [
      "Atletismo",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "Ao definir todas as verdades, o Supernal inclui os meios de sua própria eliminação. Este feitiço corta a conexão do mundo com o Supernal, criando uma \"zona morta\" na qual as energias da vida simplesmente deixam de existir. O feitiço tem os seguintes efeitos: • Linhas de Ley dentro da área secam e morrem. Os nós também deixam de funcionar. • Hallows cuja classificação é inferior à potência do feitiço cair dormente. • Os dorminhocos que passam mais de um dia dentro da área ganham a condição Energizada (embora isso não seja perda de alma e as vítimas não progridam para a condição Thrall, ver p. 315). • Qualquer tentativa de despertar um Hallow dentro da área adiciona a potência deste feitiço à classificação de pontos do Hallow para fins de suportar o efeito.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:create-truth",
    "name": "Criar a Verdade",
    "originalName": "Create Truth",
    "requirements": {
      "Prime": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "Hallow Classificação do desejado Hallow",
    "roteSkills": [
      "Expressão",
      "Ocultismo",
      "Persuasão"
    ],
    "description": "O Despertado fala, e os céus se reformulam. Este feitiço sobrepõe as condições da Realidade Caída dentro da área, criando um Hallow com uma classificação de pontos igual à potência do feitiço. Este Hallow tem ressonância apropriada à sua localização",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:eidolon",
    "name": "Eidolon",
    "originalName": "Eidolon",
    "requirements": {
      "Prime": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ofícios",
      "Ocultismo"
    ],
    "description": "Onde adeptos de Prime podem criar objetos platônicos forçando Mana no padrão que ele usa dentro do tass, um mestre pode criar os complexos padrões Prime dentro dos seres vivos e do ambiente. Quando alimentado com Mana, este feitiço cria uma construção obviamente mágica como a Forma Platônica, exceto que a construção não se limita a objetos físicos únicos. Eidolons podem imitar fogo, nevoeiro, e até mesmo ambientes inteiros, mas a maioria dos mestres usam-no para criar construções \"vivas\". Eidolons ainda são feitos de Mana solidificado, e têm Durabilidade e Estrutura em vez de Cura , e quando mimetizando riscos ambientais não infligir danos como eles fazem (o fogo Eidolon não queima, por exemplo.) Eles seguem as regras de potência para Forma Platônica (p.169), mas a potência também pode ser atribuída para conceder pontos do Mérito do Retentor. Embora animado, a construção é sem mente. Se usado como Retentor, o \"campo\" do Eidolon inclui simples trabalho físico, combate e outras tarefas não complicadas. O Eidolon só pode executar a ordem que o lançador lhe deu. As ordens devem ser muito simples. Se for atacado, o Eidolon não tem defesa. Ao contrário das formas platônicas, os Eidolons não se desfazem quando toda Mana é retirada. Um mago pode \"reencher\" o construto com o feitiço Channel Mana (p. 168) ou efeitos semelhantes. Quando o feitiço",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 172
  },
  {
    "id": "mta-2ed:forge-purpose",
    "name": "Finalidade da Forja",
    "originalName": "Forge Purpose",
    "requirements": {
      "Prime": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Empatia",
      "Expressão",
      "Medicamento"
    ],
    "description": "O mago transmite uma missão sagrada sobre o seu assunto. Para a duração do feitiço, o sujeito ganha uma das Obsessões do mago como sua própria. Se o sujeito é um mago que já tem o número máximo de Obsessões permitidas por sua Gnose, este feitiço desencadeia um Clash of Wills. Se o caster for bem sucedido, ela substitui a Obsessão mais recente do sujeito por sua própria. Até os dorminhocos, que normalmente só têm aspirações, ganham uma Obsessão. Embora geralmente não possam gastar Experiências Arcanas, ainda as acumulam e podem gastar as Experiências se alguma vez acordarem. Alguns magos acreditam que os dorminhocos que experimentaram os Mistérios são mais propensos a acordar — evidência empírica, porém, sugere que a doença mental é mais provável.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 172
  },
  {
    "id": "mta-2ed:word-of-unmaking",
    "name": "Palavra de Desfazer",
    "originalName": "Word of Unmaking",
    "requirements": {
      "Prime": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "Classificação de mérito do objeto mágico visado, ou Durabilidade se não medido em pontos de mérito",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Armamento"
    ],
    "description": "As tempestades etéricas vasculham e destroem tanto quanto revitalizam. Com este feitiço, o mago chama para baixo o poder destrutivo do Supernal para destruir um item mágico. Os artefactos supernais não podem ser destruídos por este feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 172
  },
  {
    "id": "mta-2ed:initiate-of-space-correspondence",
    "name": "Iniciar a Correspondência Espacial",
    "originalName": "Initiate of Space Correspondence",
    "requirements": {
      "Space": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Empatia",
      "Medicamento"
    ],
    "description": "Todos nós somos definidos por nossas conexões, e através deste feitiço um mago aprende essas definições. Para cada nível de potência, o mago aprende uma das ligações simpáticas do sujeito. O feitiço revela os laços mais antigos e mais fortes do sujeito primeiro. Ela entende essas conexões da mesma maneira que o sujeito pensa neles (por exemplo, \"meu lar de infância\", não \"1414 Willowbrook Drive, Columbus, OH\"). Se a outra metade do",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 173
  },
  {
    "id": "mta-2ed:ground-eater",
    "name": "Comer em terra",
    "originalName": "Ground-Eater",
    "requirements": {
      "Space": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "Vigor",
    "roteSkills": [
      "Atletismo",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O espaço é mais flexível do que muitos acreditam. Por beliscar sutilmente ou esticar o espaço em torno de seu sujeito, o mago permite que ela cubra muito mais terreno a cada passo do que é facilmente aparente. O mago adiciona a potência do feitiço à velocidade do sujeito. Observar alguém sob a influência deste feitiço é alarmante. É difícil para o olho rastreá-la, pois cada passo a leva mais longe do que deveria, e em cada piscar de olhos ou olhar momentâneo ela parece saltar mais longe do que deveria ser possível em tão pouco tempo. Este feitiço também pode reduzir a velocidade de um sujeito por sua potência (embora não abaixo de 1). Aqueles que experimentaram este efeito o comparam a um pesadelo em que, não importa o quão rápido você corra, você nunca chega mais perto de seu objetivo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 174
  },
  {
    "id": "mta-2ed:isolation",
    "name": "Isolamento",
    "originalName": "Isolation",
    "requirements": {
      "Space": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "Compostura",
    "roteSkills": [
      "Acadêmicos",
      "Intimidação",
      "Subterfúgio"
    ],
    "description": "Limites e barreiras são uma mentira, mas às vezes é útil mentir. Este feitiço deforma subtilmente o espaço e a distância em torno do sujeito, fazendo com que os espaços vazios pareçam maiores e mais antecipados. Multidões de pessoas parecem apertadas, uma parede impenetrável da humanidade. Qualquer tentativa do sujeito para interagir com outras pessoas custa 1 Vontade. Mesmo assim, qualquer conjunto de dados é penalizado pela potência do feitiço. A exposição prolongada a este feitiço (aproximadamente um dia por ponto da Compostura do indivíduo) pode provocar pontos de ruptura ou condições adversas como Shaken ou Spooked.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 174
  },
  {
    "id": "mta-2ed:locate-object",
    "name": "Localizar objeto",
    "originalName": "Locate Object",
    "requirements": {
      "Space": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Ocultismo",
      "Ciência"
    ],
    "description": "Toda a distância é uma ilusão. Uma vez que esta verdade é entendida, todas as coisas estão no mesmo lugar que o mago, e como se pode perder o controle de si mesma? Enquanto o assunto deste feitiço estiver dentro",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 174
  },
  {
    "id": "mta-2ed:the-outward-and-inward-eye",
    "name": "O Olho Para Fora e Para Dentro",
    "originalName": "The Outward and Inward Eye",
    "requirements": {
      "Space": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Armas de fogo",
      "Investigação",
      "Ocultismo"
    ],
    "description": "Se todos os locais são um, deve seguir que todas as direções são um também. Enquanto este feitiço é ativo, o sujeito pode ver e ouvir em todas as direções e de todos os pontos dentro de seu alcance sensorial simultaneamente. Ela consegue ver o que está a acontecer atrás dela, no lado oposto de uma porta, ou debaixo dos pés. Ela não consegue perceber as coisas mais longe do que as suas percepções normais podem permitir, nem pode ver através da escuridão. Em essência, é como se tudo o que acontecia à sua volta estivesse espalhado numa planície plana, despojado de obstrução. Isto permite-lhe lançar feitiços sensoriais em assuntos que ela pode normalmente não ser capaz de perceber. O assunto também é quase impossível de emboscar ou surpreender — sem camuflagem excepcional ou uma tremenda distração para chamar sua atenção, todas essas tentativas são reduzidas a uma chance de morrer. Finalmente, o assunto pode reduzir quaisquer penalidades devido ao alcance, cobertura ou ocultação (mas não escuridão ou visibilidade ruim semelhante) pela potência do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 175
  },
  {
    "id": "mta-2ed:apprentice-of-space-borrow-threads",
    "name": "Aprendiz de Tópicos de Emprestação de Espaço",
    "originalName": "Apprentice of Space Borrow Threads",
    "requirements": {
      "Space": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "Ligação",
    "roteSkills": [
      "Furto",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Ao mudar a conexão com os outros, muda-se a si mesmo. Este feitiço permite que o mago transfira uma série de conexões simpáticas iguais à potência do feitiço entre si e os sujeitos como determinado pela Escala do feitiço. Ela pode roubar links de seus alvos ou dar seus próprios a outros. Se o mago transfere um link para alguém que já tem uma conexão com a mesma coisa, a nova conexão substitui a antiga para a Duração do feitiço. O mago tem que estar ciente de uma conexão ( quer através da magia ou apenas conhecendo o sujeito) para manipulá-lo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 175
  },
  {
    "id": "mta-2ed:break-boundary",
    "name": "Quebrar Limite",
    "originalName": "Break Boundary",
    "requirements": {
      "Space": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Furto",
      "Persuasão"
    ],
    "description": "Reprimir um trabalhador é tentar enlaçar alguém numa mentira em que não acredita. Este feitiço permite ao mago contornar um único obstáculo restringindo o movimento de seu sujeito: uma porta trancada, um par de algemas, uma janela barrada, etc. O sujeito \"pisca\" através da porta, ou suas mãos parecem passar através das algemas, ou efeitos semelhantes. Este feitiço só pode contornar um obstáculo físico obstruindo um caminho real. O mago pode, por exemplo, deslizar através de um fogo rugindo que bloqueia a estrada à frente ou através de um abismo muito largo para saltar, mas não pode piscar através de uma parede sólida. Se lançado em um objeto inanimado, o mago ou um aliado ainda deve carregar ou empurrar o sujeito através do obstáculo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 175
  },
  {
    "id": "mta-2ed:lying-maps",
    "name": "Mapas mentirosos",
    "originalName": "Lying Maps",
    "requirements": {
      "Space": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Acadêmicos",
      "Política",
      "Sobrevivência"
    ],
    "description": "Saber como ir daqui até lá é aceitar tacitamente a Mentira. Por meio desse feitiço, o mago torce o senso de direção do sujeito, fazendo-o ter certeza de que o melhor caminho de onde ele está para outro lugar é um dos desejos do mago. Ela poderia, por exemplo, convencer o sujeito de que o caminho para um perigoso Verge é realmente o caminho para a casa de sua mãe, ou que o santuário do mago está em outra parte da cidade. Se o assunto ativamente, navega com cuidado usando um mapa ou GPS ou algo parecido, o rolo de navegação é uma única chance de morrer, e mesmo em um sucesso que parece errado. (\"O mapa diz esquerda, mas eu juro que está certo!\")",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 175
  },
  {
    "id": "mta-2ed:scrying",
    "name": "Scriking",
    "originalName": "Scrying",
    "requirements": {
      "Space": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Computadores",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Por meio deste feitiço, o mago parte a cortina da Mentira e revela um local distante aos seus sentidos. Ela cria uma \"janela\" que lhe permite perceber o assunto, muito parecido com uma tela de televisão. Quando ela lança o feitiço, ela pode escolher se o feitiço é uma maneira, ou se as pessoas no local podem ver de volta através da janela. Ao lançar este feitiço com simpatia, exatamente o que o mago vê depende do Yantra simpático que ela emprega. Simpatia com um local mostra-lhe uma ampla visão geral da área, análoga a uma fotografia cinematográfica ampla, mas que permanece estática. Simpatia",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 175
  },
  {
    "id": "mta-2ed:secret-door",
    "name": "Porta Secreta",
    "originalName": "Secret Door",
    "requirements": {
      "Space": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "Portais, estradas e portais representam um ponto liminar entre dois locais distintos — mas se a distância é uma ilusão, não pode haver \"localidades distintas\". Este feitiço camufla uma porta, intersecção, ou abertura semelhante entre dois locais, de modo que as percepções mundanas de uma pessoa simplesmente deslizam por ela. Todas as tentativas mágicas de descobrir a porta provocam um Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 176
  },
  {
    "id": "mta-2ed:veil-sympathy",
    "name": "Simpatia Veil",
    "originalName": "Veil Sympathy",
    "requirements": {
      "Space": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "Simpatia (Conexão)",
    "roteSkills": [
      "Política",
      "Subterfúgio",
      "Sobrevivência"
    ],
    "description": "As ligações simpáticas de um mágico permitem-lhe ir além de si mesma, mas também são uma avenida pela qual seus inimigos podem atacá-la. Este feitiço esconde uma das ligações simpáticas do sujeito, escolhida pelo mago daqueles que ela conhece. Qualquer tentativa de descobrir ou usar o link provoca um Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 176
  },
  {
    "id": "mta-2ed:ward",
    "name": "Ward",
    "originalName": "Ward",
    "requirements": {
      "Space": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Subterfúgio",
      "Armamento"
    ],
    "description": "O espaço é mutável, até que um mágico queira o contrário. Lançado sobre uma área ou indivíduos individuais, este feitiço bloqueia o seu sujeito, impedindo que o espaço interior seja manipulado. Magia que usa a simpatia de indivíduos alagados ou tentativas de distorcer áreas alagadas provoca um Clash of Wills. O mago sabe quando uma das suas divisões é atacada.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:disciple-of-space-ban",
    "name": "Discípulo da Proscrição do Espaço",
    "originalName": "Disciple of Space Ban",
    "requirements": {
      "Space": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Intimidação",
      "Ciência",
      "Furtividade"
    ],
    "description": "Na busca do autoconhecimento, às vezes é útil afastar-se do mundo exterior para que se possa compreender que o mundo está contido no interior. Por meio deste feitiço, o mago inverte uma área do espaço, de modo que nada dentro do espaço pode sair e nada fora do espaço pode entrar. Tente entrar e você se encontra no outro lado, levado em um único passo. Tenta sair e voltas a entrar. Magia que manipula o espaço, como um poder de teletransporte ou a capacidade de passar de um mundo para outro, provoca um confronto de vontades para permitir a entrada ou saída. Mesmo luz e ar não podem passar: Do lado de fora, o espaço parece \"lens\" à medida que o observador se aproxima, à medida que a luz salta diretamente através da Ban. De dentro, é uma ilha de luz num vasto mar de escuridão. Adicione Qualquer Arcanum ••: Ou exclua um ou mais fenômenos sob a alçada do Arcanum do feitiço (por exemplo, para deixar passar ar ou luz) ou crie uma Proibição que apenas proíba fenômenos sob a alçada desse Arcanum.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:co-location",
    "name": "Co- Localização",
    "originalName": "Co-Location",
    "requirements": {
      "Space": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Armas de fogo",
      "Ciência"
    ],
    "description": "Onde feitiços menores simplesmente distorcem a mentira de que todas as coisas estão separadas, este feitiço ataca-a diretamente. O mago mancha a distância entre um número de locais iguais ao feitiço desde que sabemos que você está pensando... O ser humano adulto em repouso consome cerca de um metro cúbico de ar respirável a cada quatro minutos. Diverte-te. Potência, fazendo com que se sobreponham temporariamente. O mago deve empregar o Ampatético Range Attainment para sobrepor locais fora do seu alcance sensorial. Apenas os mages que usam o Active Mage Sight com o Espaço podem perceber a sobreposição, vendo-a como um emaranhado confuso de imagens translúcidas interpenetrando-se constantemente; para os outros dentro das áreas afetadas tudo parece normal. O fator Escala do feitiço determina o tamanho de cada área sobreposta. Cada volta, como uma ação reflexiva, qualquer um capaz de perceber a sobreposição pode \"mover\" um objeto, pessoa, ou outro ser que ela está tocando (incluindo ela mesma, se desejado) de um local para outro, efetivamente teletransportando-o de lugar para lugar. Aqueles capazes de ver a sobreposição podem tocar as coisas em qualquer uma das áreas co-localizadas, mas só podem interagir com o local em que estão fisicamente. O outro local conta como sendo visto remotamente para fins de posterior spellcasting, e indivíduos m",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:perfect-sympathy",
    "name": "Simpatia Perfeita",
    "originalName": "Perfect Sympathy",
    "requirements": {
      "Space": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Empatia",
      "Furto"
    ],
    "description": "Possuir a verdadeira Simpatia para com algo é quase indistinguível dela. Com este feitiço, o sujeito torna-se tão parecido com aqueles com quem ela tem simpatia que ela acha trivial prognosticá-los. Quando o sujeito toma uma ação cujo sujeito é uma de suas fortes conexões simpáticas (por exemplo, social",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:warp",
    "name": "Warp",
    "originalName": "Warp",
    "requirements": {
      "Space": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Briga",
      "Medicamento"
    ],
    "description": "O mago torce o espaço que seu sujeito ocupa, torque as articulações, contusões na carne e ruptura muscular. Este é um feitiço de ataque; sua classificação de danos é igual à potência do feitiço, e ele inflige danos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:web-weaver",
    "name": "Web-Weaver",
    "originalName": "Web-Weaver",
    "requirements": {
      "Space": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Ofícios",
      "Empatia",
      "Persuasão"
    ],
    "description": "Todos deixamos pequenas e imperceptíveis teias de simpatia para trás de nós onde quer que vamos. Com este feitiço, o mago pode reforçar tal teia em um útil link simpático. Cada nível de potência reforça uma única conexão simpática por um \"passo\", de Fraco a Médio, Médio a Forte. O mago pode intensificar uma conexão inexistente com um fraco, mas somente se o sujeito do feitiço estiver em contato com o foco desejado na última volta. Por exemplo, uma pessoa provavelmente não tem nenhuma conexão simpática com o copo de refrigerante de seu almoço, mas enquanto estiver em sua mão, o mago pode usar a simpatia fraca criada pelo contato físico para fazer o copo uma conexão simpática. Adicionar tempo ••: O mago pode empregar a Simpatia Temporal (p. 193) para reforçar as ligações inexistentes a tudo o que o sujeito tocou no tempo-alvo. •••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:adept-of-space-alter-direction",
    "name": "Adepto do Espaço Alter Direction",
    "originalName": "Adept of Space Alter Direction",
    "requirements": {
      "Space": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Armas de fogo",
      "Persuasão"
    ],
    "description": "\"Direção\" não é nada mais do que um vetor entre dois pontos. Com esse feitiço, o mago sobrepõe esse conceito, deixando-a definir seu caminho como qualquer coisa que deseja. Quando lançado em uma área, este feitiço permite que ela mude uma série de direções absolutas (por exemplo, norte, sul, para cima, para baixo) igual à potência do feitiço. Ela pode redefinir \"down\" como \"up\", fazendo com que qualquer coisa não enraizada ao chão caia no céu, ou redefinir \"norte\" como \"sul por sudoeste\", fazendo com que bússolas apontem para o caminho errado. Objetos que entram na área à velocidade encontram sua direção de viagem e momento abruptamente alterados, o que pode exigir um Dexterity + Athletics ou Drive Roll para manter o controle. Esta mudança não é necessariamente recíproca; se o mago decreta que o norte é sul, isso não significa que o sul é norte — mas, é impossível para qualquer um na área ir para norte. Alternativamente, o mago pode lançar este feitiço sobre um assunto específico e mudar uma direção relativa a esse assunto. Ela pode redefinir seu próprio \"down\" pessoal como \"a direção que meus pés estão apontando\", permitindo que ela caminhe em paredes ou tetos, ou redefinir o \"avançamento\" de um atacante como \"para a pessoa segurando a arma\" antes de atirar nela.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:collapse",
    "name": "Recolher",
    "originalName": "Collapse",
    "requirements": {
      "Space": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Armas de fogo",
      "Intimidação"
    ],
    "description": "Embora a magia menor possa desfocar a distinção entre locais, este feitiço pode destruí-los completamente. O mago obriga-a a ocupar momentaneamente o mesmo espaço que outro objeto, com efeitos catastróficos. Este é um feitiço de ataque; sua classificação de danos é igual à potência do feitiço, e inflige danos letais. Colapso de múltiplos indivíduos uns nos outros, danificando-os todos, é uma aplicação de fator sujeito aumentado.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:cut-threads",
    "name": "Cortar tópicos",
    "originalName": "Cut Threads",
    "requirements": {
      "Space": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "Simpatia (Conexão)",
    "roteSkills": [
      "Persuasão",
      "Política",
      "Armamento"
    ],
    "description": "O isolamento é o início da compreensão. Este feitiço destrói uma das ligações simpáticas do sujeito (conexões adicionais podem ser cortadas aumentando o número de sujeitos com o fator Escala). Este efeito é duradouro, mas as interações normais podem restaurar os links no tempo, como descrito em p. 172.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:secret-room",
    "name": "Quarto secreto",
    "originalName": "Secret Room",
    "requirements": {
      "Space": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Volume é um produto de dimensão, e dimensão é apenas uma expressão de distância em três dimensões. Este feitiço permite ao mago manipular esses eixos, tornando um espaço muito maior ou menor do que deveria ser possível. Um apartamento de estúdio apertado pode tornar-se um loft espaçoso, ou uma praça da cidade pode ser feita do tamanho de um armário. Indivíduos esmagados por um espaço encolhido muito pequeno para eles sofrem danos letais iguais à potência do feitiço e são expulsos à força do espaço. O fator feitiço Scale deve abranger a área como existe antes do feitiço agir. O volume do espaço do sujeito é aumentado ou diminuído um número de passos ao longo da tabela de fatores da Escala de Área igual à potência do feitiço. Qualquer pessoa ou qualquer coisa dentro do espaço expandido quando o feitiço se esgota simplesmente aparece fora do espaço original, inalterado.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 179
  },
  {
    "id": "mta-2ed:teleportation",
    "name": "Teletransporte",
    "originalName": "Teleportation",
    "requirements": {
      "Space": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Furto",
      "Persuasão",
      "Ciência"
    ],
    "description": "Por meio desse feitiço, o mago transforma a localização atual do sujeito, efetivamente movendo-o de ponto a ponto sem cruzar o espaço interveniente. Ela pode, por exemplo, convocar um assunto para ela de qualquer lugar do mundo, banir alguém para os confins exteriores da Sibéria, ou teletransportar-se. Por padrão, a localização e o destino atuais do sujeito devem estar dentro do alcance sensorial, mas o mago pode empregar o Simpático Range Attainment em um deles.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 179
  },
  {
    "id": "mta-2ed:master-of-space-create-sympathy",
    "name": "Mestre do Espaço Crie Simpatia",
    "originalName": "Master of Space Create Sympathy",
    "requirements": {
      "Space": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência",
    "withstand": "Ligação da ligação desejada",
    "roteSkills": [
      "Empatia",
      "Persuasão",
      "Política"
    ],
    "description": "Para um Mestre do Espaço, conexões poderosas são forjadas tão facilmente quanto estalar os dedos. Com este feitiço, o mago cria uma nova ligação simpática sobre o assunto. Essas novas conexões são duradouras, mas podem desaparecer com o tempo como descrito em p. 172.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 179
  },
  {
    "id": "mta-2ed:forge-no-chains",
    "name": "Forjar Sem Correntes",
    "originalName": "Forge No Chains",
    "requirements": {
      "Space": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Subterfúgio",
      "Sobrevivência"
    ],
    "description": "Deixar para trás apegos é o verdadeiro sinal de liberdade. Para a duração deste feitiço, o sujeito não deixa vestígios de simpatia para trás. Ela não pode forjar conexões simpáticas, e até mesmo sangue, cabelo e coisas semelhantes derramadas durante a Duração do feitiço não se ligam a ela. Os feitiços espaciais dela não deixam ondulações na Tapeçaria. Qualquer tentativa de examinar sua magia espacial ou conexões simpáticas previamente criadas com Mage Sight (ver p. 92) adiciona a potência do feitiço à opacidade do mistério.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 179
  },
  {
    "id": "mta-2ed:pocket-dimension",
    "name": "Dimensão do Bolso",
    "originalName": "Pocket Dimension",
    "requirements": {
      "Space": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Sobrevivência"
    ],
    "description": "O mago cria um espaço fora do espaço, ideal para servir como santuário — ou prisão. Sem a adição de outros Arcana, este espaço é desprovido de quaisquer características identificáveis, dimensões ou limites. Não tem tempo, então qualquer coisa dentro dele é realizada em estase, sem envelhecimento (mas também sem cura e nunca crescendo ou melhorando). Não tem morte ou espírito, então Twilight não existe dentro dele. É, em essência, um espaço cuja única definição é que é um espaço. Alguém dentro da dimensão pode andar para sempre em qualquer direção, mas quando ela volta ela só se encontra até o limite do fator de área do feitiço. A Dimensão do Bolso está divorciada da realidade física; a menos que o mago opte por ancorar o reino a um ponto do mundo, a única maneira de alcançá-lo é teletransportar-se para lá. Feitiços lançados dentro da Dimensão do Pocket não incorrem em Paradox, a menos que sejam lançados com simpatia em alguém fora da Dimensão do Pocket. O mago conta como um Yantra material simpático para sua própria dimensão de bolso. Se a Dimensão do Bolso é alguma vez destruída, ou se a sua Duração expira, tudo dentro reaparece no mundo no local exato do qual ele ou eles entraram na Dimensão.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 179
  },
  {
    "id": "mta-2ed:quarantine",
    "name": "Quarentena",
    "originalName": "Quarantine",
    "requirements": {
      "Space": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Furto",
      "Socializar"
    ],
    "description": "Este feitiço retira um sujeito do Espaço completamente, removendo todos os caminhos dele para o resto do mundo e vice-versa. Para todos os efeitos, o sujeito simplesmente deixa de existir e a realidade \"preenche\" para se ajustar. Uma casa Quarantined não deixa para trás um lote vazio; em vez disso, suas duas casas vizinhas encontram-se subitamente adjacentes. Um edifício com um 12o andar Quarantined parece ter apenas 11 andares — embora o elevador tenha um botão \"12\", ele não faz nada. Os que estão dentro do Quarantined descobrem que não podem sair — qualquer tentativa de fazê-lo simplesmente volta através de qualquer porta que passaram. Eles são, de fato, em uma Dimensão de Bolso — embora um que, porque é realmente um pedaço excisado do Mundo Caído, possui seu próprio Tempo, Twilight, e assim por diante.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 180
  },
  {
    "id": "mta-2ed:initiate-of-spirit-coaxing-the-spirits",
    "name": "Iniciação do Espírito Convencendo os Espíritos",
    "originalName": "Initiate of Spirit Coaxing the Spirits",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "Compostura ou Rank",
    "roteSkills": [
      "Política",
      "Atletismo",
      "Expressão"
    ],
    "description": "Embora a maioria dos espíritos sejam apenas motes adormecidos que não têm vontade ou sapiência, o mago pode persuadi-los a breve atividade de acordo com suas naturezas. Ela pode obrigar o espírito (ou sua representação física) a tomar uma única ação instantânea de acordo com sua natureza. Um animal assustado pode atacar ou fugir, um carro pode começar, ou um penhasco pode iniciar uma pequena avalanche. O feitiço é resistido pelo Rank do espírito persuadido ou a Compostura de uma representação viva, o que for maior.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:exorcist-s-eye",
    "name": "Olho do Exorcista",
    "originalName": "Exorcist's Eye",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Sobrevivência",
      "Socializar"
    ],
    "description": "O primeiro feitiço que a maioria dos magos do Espírito aprende, este feitiço permite que o mago perceba e fale com os espíritos no mundo físico, quer estejam vagando livremente em Twilight, dormindo dentro de um objeto (incluindo espíritos descorporados em hibernação), ou possuindo um ser vivo. Ela também pode sentir quaisquer condições de manifestação relacionadas com o espírito na área. Finalmente, ela pode ver o conduíte de qualquer espírito com a Manifestação de Alcançar, mas não pode se comunicar através da Gauntlet.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:gremlins",
    "name": "Gremlins",
    "originalName": "Gremlins",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Furto",
      "Política",
      "Subterfúgio"
    ],
    "description": "Assim como o espírito de um objeto pode ser persuadido a ajudar, ele também pode ser persuadido a impedir. Quando um personagem falha usando o objeto deste feitiço como equipamento, o feitiço converte a falha em uma falha dramática. O feitiço converte uma série de falhas iguais à sua potência. Se o usuário do objeto é o personagem de um jogador, o jogador ganha uma batida como normal.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:invoke-bane",
    "name": "Invocar o Bane",
    "originalName": "Invoke Bane",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "Classificação",
    "roteSkills": [
      "Briga",
      "Intimidação",
      "Ocultismo"
    ],
    "description": "Os Espíritos sabem o que lhes causa dor, e evitam a todo custo. Este feitiço força um espírito a evitar o seu Bane ainda mais assíduo do que o normal. O espírito deve gastar um ponto de força de vontade para mesmo entrar na área de influência de seu Bane (descrito pelo fator Área do feitiço), e não pode tocá-lo em tudo. Se o espírito já está dentro da área proscrita e falha o rolo, deve fugir imediatamente. Este feitiço não afeta os espíritos acima da Classe 5.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:know-spirit",
    "name": "Conhecer o Espírito",
    "originalName": "Know Spirit",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "Classificação",
    "roteSkills": [
      "Acadêmicos",
      "Briga",
      "Socializar"
    ],
    "description": "Para comandar os espíritos, é preciso primeiro entendê-los. Este feitiço permite ao mago colher uma série dos seguintes fatos sobre um espírito igual à potência do feitiço: • Qual é o nome do espírito? • Qual é o seu Rank? • Que Manifestações possui? • Que Numina possui? • Quais são as suas influências e quão fortes são? • Qual é a sua proibição ou bane? • •",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:apprentice-of-spirit-cap-the-well",
    "name": "Aprendiz de Espírito Cobre o Poço",
    "originalName": "Apprentice of Spirit Cap the Well",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Política",
      "Sobrevivência",
      "Persuasão"
    ],
    "description": "Qualquer criatura torna-se mais flexível quando sua fonte de alimento é controlada. Este feitiço protege uma fonte de Essência, tornando difícil para os espíritos alimentar-se dele — mas não mais difícil de sentir. Qualquer tentativa de um espírito para alimentar-se da Essência (ou um mago, lobisomem, ou outro ser para sifonar a Essência) provoca um Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:channel-essence",
    "name": "Essência do Canal",
    "originalName": "Channel Essence",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Persuasão",
      "Sobrevivência"
    ],
    "description": "Um mestre sábio sabe que às vezes ela deve recompensar em vez de punir. Este feitiço permite que o mago atraia Essência em seu Padrão de uma Condição Ressonante ou canal Essence para um espírito ou recipiente adequado. O mago pode transferir uma quantidade de Essência igual à potência do feitiço. No entanto, ela",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:command-spirit",
    "name": "Espírito de comando",
    "originalName": "Command Spirit",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Classificação",
    "roteSkills": [
      "Medicamento",
      "Atletismo",
      "Persuasão"
    ],
    "description": "Às vezes, a abordagem suave deve dar lugar ao domínio bruto. Este feitiço permite ao mago comandar um espírito para empreender uma série de ações iguais à Potência do feitiço. Esta compulsão só dura enquanto a duração do feitiço, para que o espírito possa abandonar uma ação indefinida ou estendida quando a duração do feitiço passar. Comandos que vão contra o interesse próprio do espírito (incluindo abandonar um hospedeiro ou Fetter) provocam um Clash of Wills. Este feitiço não tem efeito sobre espíritos acima da Classe 5. Escudo Efémero (Espírito ••) Prática: Blindagem Fator primário: Duração Habilidades Rotas Sugeridas: Ken Animal, Medicina, Stealth Para dominar o mundo espiritual, não se deve mostrar vulnerabilidade. Este feitiço protege o sujeito contra os Numina, Influências, e Manifestações de espíritos, feitiços Espírito, e quaisquer poderes espirituais de outras criaturas sobrenaturais, tais como lobisomens. Tais ataques devem ser bem sucedidos em um confronto de vontades para prejudicar o sujeito.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:gossamer-touch",
    "name": "Gossamer Touch",
    "originalName": "Gossamer Touch",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Briga",
      "Ofícios",
      "Intimidação"
    ],
    "description": "Às vezes, a única maneira de comandar um espírito é com força bruta e bruta. Este feitiço torna a carne do sujeito sólida aos espíritos em Twilight, permitindo-lhe interagir fisicamente com eles. Adicionar Morte •• ou Mente ••: Estes benefícios estendem-se a fantasmas ou Goetia, respectivamente.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:opener-of-the-way",
    "name": "Abridor do Caminho",
    "originalName": "Opener of the Way",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Computadores",
      "Socializar"
    ],
    "description": "O xamã não é apenas intercessor, mas também porteiro. Este feitiço permite que o mago mude a Condição Ressonante sobre o assunto para a Condição Aberta, ou vice-versa.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:shadow-walk",
    "name": "Passeio das Sombras",
    "originalName": "Shadow Walk",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Furtividade",
      "Manha"
    ],
    "description": "Às vezes, os senhores das sombras devem andar invisíveis entre as suas presas. Este feitiço encobre o sujeito do conhecimento dos espíritos e da magia do Espírito. Qualquer efeito sobrenatural que a detecte provoca um Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:slumber",
    "name": "Alumínio",
    "originalName": "Slumber",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "Classificação",
    "roteSkills": [
      "Expressão",
      "Ocultismo",
      "Armamento"
    ],
    "description": "O tolo se esgota tentando matar o que não pode morrer; melhor é enviar espíritos hostis para um sono profundo. Este feitiço reduz a frequência com que um espírito que hiberna após ser destruído (ver p. 257) recupera a Essência. Em vez de recuperar um ponto de Essência por dia, ele recupera um ponto de Essência cada (Potency) dias; mas o efeito ainda termina quando a duração do feitiço expira. •••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:disciple-of-spirit-bolster-spirit",
    "name": "Discípulo de espírito encorajador",
    "originalName": "Disciple of Spirit Bolster Spirit",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Ocultismo",
      "Expressão"
    ],
    "description": "O rato que arranca o espinho é muitas vezes mais respeitado do que o leão que ruge. Cada nível de potência deste feitiço cura um espírito de duas caixas de danos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:erode-resonance",
    "name": "Erode Ressonância",
    "originalName": "Erode Resonance",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Briga",
      "Intimidação"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:howl-from-beyond",
    "name": "Uivar de Além",
    "originalName": "Howl From Beyond",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Armas de fogo",
      "Medicamento"
    ],
    "description": "Com este feitiço, o mago chama uma torrente de Essência do mundo espiritual, que esbofeteia seus inimigos e os deixa drenados em corpo e alma. Este é um feitiço de ataque; sua classificação de danos é igual à potência do feitiço, e ele inflige danos. Este feitiço pode atingir seres físicos ou espíritos em Twilight.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:place-of-power",
    "name": "Local de Poder",
    "originalName": "Place of Power",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Desgastando ou Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "Força da luva",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Sobrevivência"
    ],
    "description": "Mesmo o xamã mais poderoso precisa de um lugar para dormir em segurança, e um lugar para fazer o seu trabalho onde a parede entre mundos é fina. Este feitiço permite que o mago levante ou baixe a Força de Gauntlet local por uma quantidade igual à Potência do feitiço dentro da Área do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:reaching",
    "name": "Alcançar",
    "originalName": "Reaching",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Força da luva",
    "roteSkills": [
      "Atletismo",
      "Medicamento",
      "Socializar"
    ],
    "description": "O mago espiritual é um ser de dois mundos. Com este feitiço, o mago pode interagir física e magicamente com as coisas do outro lado da Gauntlet, seja qual for o reino em que ela estiver.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:rouse-spirit",
    "name": "Espírito de despertar",
    "originalName": "Rouse Spirit",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "Classificação",
    "roteSkills": [
      "Atletismo",
      "Expressão",
      "Investigação"
    ],
    "description": "O que os adormecidos podem sempre ser acordados. Este feitiço também pode despertar um espírito hibernante prematuramente. A potência necessária para este efeito é a diferença entre a Essência atual do espírito e seu Corpus total. O espírito desperta imediatamente, com apenas a caixa de Corpus mais à direita limpa.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:spirit-summons",
    "name": "Invoca o Espírito",
    "originalName": "Spirit Summons",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "Classificação",
    "roteSkills": [
      "Persuasão",
      "Socializar",
      "Ocultismo"
    ],
    "description": "O mago envia uma chamada para o espírito mais próximo dentro do seu alcance sensorial. Por outro lado, ela pode invocar espíritos que conhece pessoalmente. Ela pode enviar uma chamada geral e o espírito mais próximo irá responder, ou ela pode especificar o tipo de espírito por Ressonância. O feitiço não funciona em espíritos acima da Classe 5. +1 Alcance O feitiço também cria a condição aberta na área, mesmo que não corresponda à ressonância do espírito.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:adept-of-spirit-banishment",
    "name": "Adepto do Banimento do Espírito",
    "originalName": "Adept of Spirit Banishment",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "Classificação",
    "roteSkills": [
      "Briga",
      "Expressão",
      "Ocultismo"
    ],
    "description": "Este feitiço despoja um espírito da sua capacidade de agir no mundo, lembrando-lhe o seu lugar. Este feitiço retira uma série de Condições de Manifestação do espírito (ou seu hospedeiro) igual à potência do feitiço. O efeito é duradouro, mas o espírito pode usar suas influências e manifestações para restabelecer as Condições como normais. Este feitiço não funciona em espíritos acima da Classe 5. Adicione Morte ou Mente •••: Os efeitos do feitiço estendem-se a fantasmas ou Goetia.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:bind-spirit",
    "name": "Espírito de ligação",
    "originalName": "Bind Spirit",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Classificação",
    "roteSkills": [
      "Ofícios",
      "Briga",
      "Intimidação"
    ],
    "description": "O que mostra mais domínio do que uma coleira? Com este feitiço, o mago pode ligar um espírito ao mundo, concedendo-lhe uma condição de manifestação (ver p. 258). O mago pode conceder uma série de Condições iguais à potência do feitiço, e deve criar qualquer pré-requisito Condições também, se eles não estão já presentes. A entidade entra imediatamente na Manifestação da escolha do mago, e pode não deixá-la enquanto o feitiço permanece em vigor. Este feitiço não funciona em espíritos acima da Classe 5. Adicione Morte ou Mente •••: Os efeitos do feitiço estendem-se a fantasmas ou Goetia.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:craft-fetish",
    "name": "Ofícios Fetish",
    "originalName": "Craft Fetish",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Classificação",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Persuasão"
    ],
    "description": "Um inimigo derrotado pode ser uma ferramenta útil. Este feitiço permite que o mago ligue um espírito hibernante a um fetiche, uma espécie de item mágico. Fetishes funciona como um Itens Imbued, exceto que um fetiche é alimentado por Essence e, em vez de segurar um feitiço Supernal, ele detém uma das influências do espírito ligado e, possivelmente, algumas de suas Numina. Criar um fetiche requer que o feitiço tenha uma potência por ponto de influência que o objeto possuirá, mais uma potência por Numen. Um fetiche não tem de receber todas as capacidades do espírito. Ativar os poderes dentro do fetiche é uma ação instantânea e usa o pool de dados do espírito. O fetiche tem o seu espírito adormecido piscina Essence e pode recarregar Essence em um local Resonant como um espírito hibernante, ou pode receber Essence de outro espírito ou através do Canal Essence (ver p. 180) ou magia semelhante. O usuário do fetiche pode pagar Essência fora da piscina do fetiche para alimentar suas habilidades. Se o espírito ligado alguma vez adquire Essência igual ao seu Corpus, no entanto, o feitiço termina imediatamente. O mago também pode criar um fetiche muito mais simples que não abriga espírito, mas pode segurar Essência. Tal fetiche possui 10 Essence, mais um número de Essence igual à potência do feitiço. Disparar o Ban do espírito ligado ou Bane imediatamente destrói o fetiche.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:familiar",
    "name": "Familiar",
    "originalName": "Familiar",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Expressão",
      "Intimidar"
    ],
    "description": "O mago cria um vínculo familiar entre um espírito e um mago, que devem ser ambos sujeitos do feitiço. O espírito não pode ser maior do que o Rank 2. O mago ganha o Mérito Familiar e o espírito a Condição de Manifestação Familiar para a Duração do feitiço. Ambas as partes devem estar dispostas, e podem terminar o vínculo sempre que desejarem. Substituir a morte •••• ou a mente ••••: O mago pode ligar um fantasma ou um Goetia como um familiar.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:shadow-scream",
    "name": "Grita Sombra",
    "originalName": "Shadow Scream",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Armas de fogo",
      "Medicamento"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:shape-spirit",
    "name": "Espírito de Forma",
    "originalName": "Shape Spirit",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Classificação",
    "roteSkills": [
      "Ofícios",
      "Medicamento",
      "Persuasão"
    ],
    "description": "Quando nenhuma ferramenta está pronta para a mão, o xamã forma uma a partir do que está disponível. Este feitiço permite que o mago remodele a natureza fundamental de um espírito. Ela pode invocar uma série dos seguintes efeitos iguais à potência do feitiço: • Mudar a natureza fundamental do espírito; por exemplo, tornar um espírito de rato em um espírito de má sorte e travessura. • Redistribua os pontos de atributos do espírito. • Curar uma caixa de danos letais do Corpus do espírito. • Redefinir e redistribuir as influências do espírito. • Adicionar, remover ou substituir uma Manifestação. • Adicionar, remover ou substituir um Numen. • Reescrever Ban e Bane do espírito. Ela também pode alterar o tamanho, a forma e a aparência do espírito como ela achar melhor, dentro dos limites do fator Escala do feitiço. Os novos traços do espírito devem permanecer dentro dos seus máximos derivados do Rank. Quando a Duração do feitiço expira, o espírito retorna à sua forma e capacidades originais.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 185
  },
  {
    "id": "mta-2ed:twilit-body",
    "name": "Corpo Twilit",
    "originalName": "Twilit Body",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Subterfúgio",
      "Sobrevivência"
    ],
    "description": "Para passar despercebido, o tigre às vezes deve mudar suas listras. Este feitiço faz com que o sujeito (e qualquer coisa que ela está vestindo ou carregando, se aplicável) se transforme em efêmera sintonizada com o Espírito, colocando-a no Twilight.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 185
  },
  {
    "id": "mta-2ed:world-walker",
    "name": "World Walker",
    "originalName": "World Walker",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Força da luva",
    "roteSkills": [
      "Atletismo",
      "Persuasão",
      "Sobrevivência"
    ],
    "description": "O xamã vai onde tem de encontrar sabedoria e poder. Este feitiço permite que o mago traga um sujeito diretamente através da Gauntlet, para ou a partir da Sombra, sem a necessidade de um portal. Se o sujeito é um espírito ou objeto efêmero, ele aparece em Twilight.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 185
  },
  {
    "id": "mta-2ed:master-of-spirit-annihilate-spirit",
    "name": "Mestre do Espírito Aniquilar o Espírito",
    "originalName": "Master of Spirit Annihilate Spirit",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "Classificação",
    "roteSkills": [
      "Intimidação",
      "Ciência",
      "Armamento"
    ],
    "description": "O feitiço mais temível do arsenal da maioria dos xamãs, esta magia terrível destrói totalmente um espírito. O espírito alvo pode gastar uma Essência para rolar Power + Finesse em um Clash of Wills, uma última tentativa de reafirmar sua existência através de suas influências. Se o feitiço é lançado com sucesso, o espírito é instantaneamente e totalmente destruído — mesmo que ainda tenha Essência, não se retira para hibernação, simplesmente se foi. A menos que seja arquimestral, este feitiço não pode afetar os espíritos da Classe 6 ou superior.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 185
  },
  {
    "id": "mta-2ed:birth-spirit",
    "name": "Espírito de nascimento",
    "originalName": "Birth Spirit",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Medicamento",
      "Expressão"
    ],
    "description": "Por meio desse feitiço, o mago pode coaxar a Essência adormecida para a vida, despertando-a como Espírito de Classe 1. Este espírito não está sob o controle particular do mago, mas a maioria dos espíritos recém-nascidos sente uma espécie de respeito ou gratidão pelo seu criador. Muitos magos então usam o Espírito Bolster e o Espírito Forma para melhorar as capacidades de sua criação efêmera.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 185
  },
  {
    "id": "mta-2ed:create-locus",
    "name": "Criar Locus",
    "originalName": "Create Locus",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "Força da luva",
    "roteSkills": [
      "Ofícios",
      "Empatia",
      "Sobrevivência"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 185
  },
  {
    "id": "mta-2ed:essence-fountain",
    "name": "Fonte da Essência",
    "originalName": "Essence Fountain",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Expressão",
      "Ocultismo"
    ],
    "description": "O xamã alimenta os seus filhos espirituais. Este feitiço gera uma quantidade de Essência igual à potência do feitiço dentro do Padrão do sujeito. A Essência tem uma ressonância da escolha do mago, desde que a tenha encontrado antes.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 186
  },
  {
    "id": "mta-2ed:spirit-manse",
    "name": "Manse do Espírito",
    "originalName": "Spirit Manse",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Sobrevivência"
    ],
    "description": "O mestre vive entre seus irmãos sombra em um palácio de sua vontade. Este feitiço esculpe um espaço extradimensional na Sombra, um dos famosos \"Lugares que Não São\" que não mapeia para qualquer localização no mundo físico. O Espírito Manse pode tomar qualquer forma que o mago deseje, mas sua aparência é fortemente colorida por seu Caminho e seu Nimbus. Enquanto a Duração do feitiço durar, o mago ganha o Mérito de Lugar Seguro a uma classificação igual à Potência do feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 186
  },
  {
    "id": "mta-2ed:initiate-of-time-divination",
    "name": "Iniciar a adivinhação do tempo",
    "originalName": "Initiate of Time Divination",
    "requirements": {
      "Time": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Empatia",
      "Investigação"
    ],
    "description": "O mago pode ver o futuro do seu suspeito. Sem Trincheira, o mago só pode ver generalidades: \"Vou encontrar Anna novamente em breve?\" é uma pergunta válida, enquanto \"a que horas chegará a polícia?\" é muito específica para responder. Este feitiço pode ver muito no futuro, como dizer ao mago que um jovem caixa pode eventualmente tornar-se um governador do estado, ou que um prodígio infantil pode tornar-se uma super estrela, mas olhando muito longe do presente aumenta a probabilidade de a resposta ser substituída pelo ponto em que o futuro se torna o presente. O contador de histórias deve decidir o que o futuro reserva, levando em conta a natureza da história, bem como pistas das perguntas do mago. O lançador pode fazer uma pergunta geral por nível de potência, recebendo respostas de \"Sim\", \"Não\" ou \"Irrelevante\". Simpatia Temporal Simpatia Temporal Description Withstand (Connection) Withstand (Simpatia Temporal) Inaltered O assunto não mudou com o tempo. Um quarto selado deixado intocado, um diamante no mesmo ambiente, uma pessoa que não falou com ninguém ou esteve em nenhum lugar desde a hora do alvo. A conexão é inatacável sem a magia Unmaking e fundição usando a simpatia não é resistido. 5* 0 Forte O assunto não se alterou significativamente; uma pessoa dias depois que não tem",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 187
  },
  {
    "id": "mta-2ed:red-light",
    "name": "Luz Vermelha",
    "originalName": "Red Light",
    "requirements": {
      "Time": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Computador",
      "Furto",
      "Subterfúgio"
    ],
    "description": "O mago pode manipular os sincronismos sutis dos eventos, suavizando ou obstruindo o progresso de seu sujeito. Elenco positivamente, o sujeito encontra elevadores e táxis chegam exatamente como ele precisa deles, parar luzes ficar verde, e ele chega a tempo para reuniões. Lançar negativamente, qualquer coisa que possa atrasar o assunto irá atrasá-lo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:momentary-flux",
    "name": "Fluxo momentâneo",
    "originalName": "Momentary Flux",
    "requirements": {
      "Time": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Manha",
      "Sobrevivência"
    ],
    "description": "O mago pode sentir se um assunto se mostrará benéfico ou cruel no futuro mais provável. O mago pode ver se o estranho que atravessa a rua para se aproximar dela à noite é tão ameaçador quanto parece, ou se veio dar conselhos, por exemplo. O feitiço em si não diz ao mago exatamente o que vai acontecer, só se ele vai ser bom ou ruim para ela. O estranho pode augúrio como mau presságio para ela; isso pode ser devido à sua intenção maliciosa — ou talvez ele esteja fugindo de algum perigo, ou mesmo carregando um resfriado. Embora muitas vezes usado para avaliar perigos potenciais, os magos podem lançar este feitiço consigo mesmos como o único sujeito, avaliando se suas próprias ações irão ajudá-los ou prejudicá-los. Mages with Time •• pode usar a Simpatia Temporal para lançar este feitiço em um assunto no passado, mas o feitiço ainda revela resultados positivos ou negativos para o futuro. O feitiço é tolerado pela simpatia temporal.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:perfect-timing",
    "name": "Tempo perfeito",
    "originalName": "Perfect Timing",
    "requirements": {
      "Time": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Socializar",
      "Manha"
    ],
    "description": "O mago sabe exatamente o momento perfeito para agir, seja com uma palavra gentil (ou condenando), um soco, ou mesmo simplesmente escorregando para fora de uma porta na hora certa. Este feitiço não altera diretamente o tempo ou afeta os outros, mas concede ao sujeito uma avaliação temporal perfeita da situação. Outros podem descrevê-la como \"na zona\", confundindo seu senso preternatural de tempo para um foco incrível. O sujeito pode passar um turno durante a duração do feitiço planejando uma ação. O sujeito perde qualquer defesa e deve permanecer imóvel enquanto planeja. Uma volta de planejamento gasto concede um bônus para a próxima ação igual à potência. Este bônus só pode ser aplicado a ações instantâneas mundanas; ações estendidas e rolos ortográficos não se beneficiam dele.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:postcognition",
    "name": "Pós-cognição",
    "originalName": "Postcognition",
    "requirements": {
      "Time": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Empatia",
      "Investigação"
    ],
    "description": "O mago pode ver o passado de um assunto, presenciando eventos como se estivesse fisicamente presente para vê - los. Por padrão, o lançador só pode ver assuntos imutáveis, mas com o Tempo •• ela pode ver o passado mais distante, nesse caso o feitiço é resistido pela simpatia temporal. O mago vê o assunto em \"tempo real\" a partir de um momento declarado quando a fundição até a Duração da Pós-cognição expira. Ao ver o passado, o mago perde toda a defesa e pode não tomar quaisquer ações ou lançar mais feitiços.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:apprentice-of-time-choose-the-thread",
    "name": "Aprendiz do tempo Escolha o tópico",
    "originalName": "Apprentice of Time Choose the Thread",
    "requirements": {
      "Time": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Ocultismo",
      "Ciência",
      "Subterfúgio"
    ],
    "description": "Reluzindo os muitos futuros potenciais de seu assunto, o mago seleciona o curso ideal. O jogador do assunto rola duas vezes para seu próximo rolo de dados mundano, e o jogador do mago seleciona qual rolo de dados faz efeito.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:constant-presence",
    "name": "Presença Constante",
    "originalName": "Constant Presence",
    "requirements": {
      "Time": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Persuasão",
      "Sobrevivência"
    ],
    "description": "Os magos versados no Tempo conhecem os sinais reveladores de perturbação dos Padrões de Viajantes do Tempo, e poucos Despertados estão dispostos a confiar que um viajante tem intenções honrosas. Este feitiço preserva seu sujeito contra alterações na linha do tempo. Qualquer alteração à história através da ação da viagem no tempo provoca um Clash of Wills. Se o mago vencer, o assunto é tratado como se ela estivesse voltando de uma viagem ao passado quando a história se resolve, protegendo-a contra ser reescrita. Hung Spell (Tempo • •) Prática: Governação Fator primário: Duração",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:shield-of-chronos",
    "name": "Escudo de Chronos",
    "originalName": "Shield of Chronos",
    "requirements": {
      "Time": 2
    },
    "practice": "Véu",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "O mago protege um sujeito contra os sentidos temporais. Enquanto sob a proteção deste feitiço, qualquer magia que veja o assunto através do tempo ( quer olhando para a duração protegida do futuro, ou prevendo o futuro do sujeito enquanto no presente) provoca um Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 189
  },
  {
    "id": "mta-2ed:tipping-the-hourglass",
    "name": "Tipping the Ampulheta",
    "originalName": "Tipping the Hourglass",
    "requirements": {
      "Time": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Atletismo",
      "Ofícios",
      "Investigação"
    ],
    "description": "O mago pode momentaneamente alterar o fluxo do Tempo, fazendo-o acelerar ou abrandar para um sujeito, mas não drasticamente. Enquanto o feitiço pode permitir que o sujeito tempo extra para esquivar-se de um carro que se aproxima ou lento movimentos de um inimigo como se ele estivesse bêbado, ele não vai deixá-la voltar no tempo para evitar o carro ou o agressor irritado completamente. O lançador pode adicionar ou subtrair potência da Iniciativa do sujeito. Os sujeitos que já agiram por sua vez antes de lançarem este feitiço sobre eles não agem novamente na sua nova classificação de Iniciativa.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 189
  },
  {
    "id": "mta-2ed:veil-of-moments",
    "name": "Vela de Momentos",
    "originalName": "Veil of Moments",
    "requirements": {
      "Time": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Investigação",
      "Subterfúgio"
    ],
    "description": "O mago pode afastar os efeitos deletérios do avanço do tempo em seu assunto. Este feitiço não pode desfazer os efeitos, mas pode criar um buffer suficiente entre o sujeito e a marcha interminável do Tempo para comprar o que um mago mais precisa — tempo para pensar. Enquanto este feitiço é ativo, o sujeito torna-se imune a coisas que pioram com o tempo. Ela não vai sangrar pelas feridas, e venenos e toxinas efetivamente param sua duração, assim como a progressão da doença. Novas Condições e Inclinações não podem ser impostas sobre o assunto enquanto o feitiço permanece em vigor. Poderes sobrenaturais que impõem efeitos provocam um confronto de vontades. O lado negativo da proteção do feitiço é que o sujeito já não cura naturalmente durante a duração do feitiço. Efeitos mais dramáticos, tais como Restauração de padrões ou magia de vida ainda pode curá-la. Mais importante, o sujeito não pode recuperar a força de vontade ou Mana, ou passar experiências enquanto sob o efeito do feitiço. O sujeito cessa o envelhecimento durante o uso desse feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 189
  },
  {
    "id": "mta-2ed:disciple-of-time-acceleration",
    "name": "Aceleração Discípula do Tempo",
    "originalName": "Disciple of Time Acceleration",
    "requirements": {
      "Time": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Dirigir",
      "Furtividade"
    ],
    "description": "O mago pode acelerar muito o movimento temporal do seu sujeito. Do ponto de vista dos espectadores, ela se torna um borrão como se se movesse em movimento rápido, agindo com velocidade impossível. Em níveis elevados o suficiente, criaturas mundanas simplesmente não podem percebê-la em tudo, exceto talvez para a elevação de cabelo no pescoço ou uma sensação de intestino que algo não está bem. Multiplique a velocidade por potência do sujeito. Enquanto sob o efeito do feitiço, o sujeito sempre vai primeiro em uma vez, a menos que ele opta por atrasar sua ação, caso em que ele pode interromper a vez de qualquer outro personagem com a sua própria como uma ação reflexiva, em seguida, voltar para a frente da fila Iniciativa no próximo turno. Outros personagens usando poderes preemptivos provocam um Clash of Wills. Agindo em tal tempo acelerado torna o assunto muito difícil de atingir, mas apenas enquanto ele é capaz de se concentrar; sua defesa não muda, mas adiciona potência à defesa antes de duplicar para Dodge ações (p. 217). Ele pode empregar defesa (e Dodges) contra armas de fogo.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 189
  },
  {
    "id": "mta-2ed:chronos-curse",
    "name": "Maldição de Chronos",
    "originalName": "Chronos' Curse",
    "requirements": {
      "Time": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "Vigor",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Intimidação"
    ],
    "description": "O mago atrasa a experiência de seu sujeito de tempo para um rastejar. Para o assunto, tudo parece mover-se em velocidades deslumbrantes, enquanto ela sente que está presa em um sonho, incapaz de correr ou soco ou mover-se corretamente. Ela nem consegue falar normalmente com os outros enquanto está afetada — enquanto, da sua perspectiva, as suas palavras são suficientemente claras, para todos os outros, são um som longo e impossivelmente desenhado. Dividir a velocidade do sujeito por potência, arredondando para baixo. Se a velocidade chegar a 0, o sujeito está efetivamente se movendo tão lentamente que ela parece enraizada até o ponto. Enquanto sob o efeito do feitiço, o sujeito sempre vai por último. A defesa do sujeito também é reduzida pela potência.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 190
  },
  {
    "id": "mta-2ed:shifting-sands",
    "name": "Mudando areias",
    "originalName": "Shifting Sands",
    "requirements": {
      "Time": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "O mago pode retroceder pelo tempo a uma curta distância, desfazendo alguns segundos preciosos. Este feitiço envia o sujeito de volta através do tempo uma série de voltas iguais a potência. O sujeito retém quaisquer ferimentos e condições ganhos nas voltas desfeitas, e Mana gasto e força de vontade não retornam. Feitiços lançados em sua pessoa no tempo desfeito permanecem enquanto ela lançou-los. Todos os outros feitiços que ela pode ter lançado ou tinha lançado sobre ela no intervalo são cancelados. Até que o sujeito alcance o presente, a distorção causada por este feitiço é visível sob a visão do mago do tempo ativo. Uma vez que ela faz isso, qualquer mudança que ela fez na história torna-se duradoura.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 190
  },
  {
    "id": "mta-2ed:temporal-summoning",
    "name": "Invocação Temporal",
    "originalName": "Temporal Summoning",
    "requirements": {
      "Time": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Investigação",
      "Persuasão"
    ],
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 190
  },
  {
    "id": "mta-2ed:weight-of-years",
    "name": "Peso dos Anos",
    "originalName": "Weight of Years",
    "requirements": {
      "Time": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Intimidação",
      "Medicamento"
    ],
    "description": "Estruturas decaem, corpos envelhecem. As toxinas se acumulam nos músculos, e os materiais se tornam frágeis. O mago pode infligir esses processos, aperfeiçoando a passagem do tempo sobre seu assunto. Este é um feitiço de ataque, infligindo sua potência em danos a objetos e estruturas. Este dano afeta diretamente a Estrutura do objeto e reduz sua Durabilidade em 1 para cada 2 pontos de Estrutura perdidos. Quando usado contra seres vivos, o feitiço causa danos iguais a potência. À discrição do Storyteller, criaturas imortais como vampiros podem ser imunes às propriedades prejudiciais deste feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:adept-of-time-present-as-past",
    "name": "Adepto do tempo presente como passado",
    "originalName": "Adept of Time Present as Past",
    "requirements": {
      "Time": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Investigação",
      "Manha"
    ],
    "description": "Tecendo entre os muitos futuros potenciais imediatos, o mago pode ler os futuros imediatos de seus súditos e reagir de acordo com os seus planos. Em combate, enquanto este feitiço está em vigor, o jogador pode exigir que cada personagem afetado pelo feitiço declare sua ação no início de cada turno. O jogador não precisa declarar sua própria ação, mas em vez disso pode optar por agir livremente em qualquer ponto dentro da ordem Iniciativa. Isso supera todos os outros efeitos sobrenaturais da Iniciativa, exceto aqueles criados pelo Arcanum do Tempo, que requer um Clash of Wills. Em situações sociais, o mago acrescenta Portas iguais à Potência quando o alvo da manobra social por seu sujeito, ou as remove de um sujeito que ela está manobrando contra.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:prophecy",
    "name": "Profecia",
    "originalName": "Prophecy",
    "requirements": {
      "Time": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Investigação"
    ],
    "description": "O mago faz com que o futuro se adapte às suas expectativas, construindo um cenário hipotético que poderá então examinar para saber como alterar drasticamente o futuro, seja para garantir ou evitar um evento específico. Isso funciona como \"Divinação\", p. 186, mas o mago pode fazer perguntas específicas e também obter respostas sobre coisas que podem acontecer, dependendo de variáveis como escolha ou chance externa. Por exemplo, ela poderia perguntar se ligar para seu ex vai levar à reconciliação se ela faz a tentativa, ou se matar um homem pode colocar seu filho no caminho para se vingar. Ela pode fazer uma tal pergunta por nível de potência e receber uma resposta detalhada que explica eventos hipotéticos. Outros mages usando Divination sobre o mesmo assunto, enquanto Prophecy é na verdade ver o resultado mais provável do cenário definido por este feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:rend-lifespan",
    "name": "Rend Lifespan",
    "originalName": "Rend Lifespan",
    "requirements": {
      "Time": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Atletismo",
      "Medicamento",
      "Intimidação"
    ],
    "description": "O mago pode fazer com que partes do corpo de um alvo envelheçam rapidamente e outros regridam no desenvolvimento. Os efeitos são temporários, mas devastadores, infligindo danos letais iguais à potência do feitiço. Alvos mortos por este feitiço muitas vezes parecem ter \"morredo de velhice\", apesar de sua idade aparente. À discrição do contador de histórias, seres mortos-vivos como vampiros e fantasmas podem ser imunes a este feitiço.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:rewrite-history",
    "name": "Reescrever o Histórico",
    "originalName": "Rewrite History",
    "requirements": {
      "Time": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Perseverança",
    "roteSkills": [
      "Expressão",
      "Investigação",
      "Persuasão"
    ],
    "description": "Voltando através do tempo, o mago deforma a linha do tempo do seu sujeito, tornando-a presente como se a sua vida tivesse um rumo muito diferente. Este feitiço permite ao mago reescrever a história de um sujeito, escolhendo um ponto de divergência em sua linha do tempo e especificando mudanças a partir daí. Sem Simpatia Temporal, apenas decisões e mudanças recentes podem ser reescritas, mas enquanto o sujeito estiver imutável no ponto de divergência, o mago pode fazer alterações como quiser. Com a Simpatia Temporal, o feitiço é capaz de mudar cada detalhe da história de um sujeito, embora a falsa linha do tempo criada ainda deve ser possível. Uma vez expirada a Duração, o assunto reverte instantaneamente para o seu histórico original. Memórias do tempo gasto \"reescrito\" will",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:temporal-stutter",
    "name": "Stutter Temporal",
    "originalName": "Temporal Stutter",
    "requirements": {
      "Time": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Vigor",
    "roteSkills": [
      "Intimidação",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Ao redefinir como o Padrão de Tempo de um sujeito interage com o presente, o mago lança esse sujeito para frente através do tempo, aguardando o momento em que o presente o alcança. O assunto desaparece completamente do Mundo Caído, e reaparece inalterado quando a Duração do feitiço termina. O sujeito experimenta um momentâneo descuido em suas percepções, e, de repente, encontra seu entorno alterado por meio de eventos intervenientes. O sujeito permanece no mesmo local e mantém o ímpeto se estivesse em movimento. Se algo agora ocupa o espaço em que o sujeito reaparece, aplique a inclinação derrubada para baixo a qualquer que tenha o menor Tamanho. Adicionar espaço ••: Ao usar o Ampatético Alcance Attainment ligado a um destino, o feitiço traz o sujeito de volta para esse destino em vez de no ponto em que ele partiu. ••••",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 192
  },
  {
    "id": "mta-2ed:master-of-time-blink-of-an-eye",
    "name": "Mestre do Tempo Blink de um olho",
    "originalName": "Master of Time Blink of an Eye",
    "requirements": {
      "Time": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ofícios",
      "Ocultismo"
    ],
    "description": "Ao desmoronar o tempo em torno de um sujeito, o mago permite que ela realize em segundos o que levaria horas. Este feitiço transforma a próxima ação estendida tomada pelo sujeito em uma ação instantânea, absorvendo rolos iguais a potência em um único turno. Não afeta intervalos de lançamento ritual para mages.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 192
  },
  {
    "id": "mta-2ed:corridors-of-time",
    "name": "Corredores do Tempo",
    "originalName": "Corridors of Time",
    "requirements": {
      "Time": 5
    },
    "practice": "Desfazendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Investigação",
      "Persuasão"
    ],
    "description": "Quando menos avançado Os magos do tempo só podem desfazer as ações que conduzem diretamente ao presente, um Mestre pode escolher a qualquer momento na linha do tempo de seu sujeito e destruir tudo depois dele, enviando o eu presente do sujeito de volta no tempo para o momento da escolha do mago. O sujeito chega ao passado no tempo especificado, habitando seu próprio corpo passado e é livre de agir, mudando a história por suas ações, embora as distorções de sua linha do tempo sejam visíveis sob a Visão de Magia do Tempo Ativo. Ele permanece no passado por um tempo igual ao fator Corredores da Duração do Tempo, ou até que ele \"chega\" até o presente. Uma vez no presente, os novos conjuntos de linha do tempo e quaisquer mudanças que o sujeito fez para a história tornam-se duradouros. Sem simpatia temporal, o sujeito só pode ser enviado de volta para um período com uma simpatia temporal inalterada para o presente. Usando a simpatia temporal, o mago pode permitir que seu sujeito revisite decisões antigas e faça escolhas diferentes. O sujeito chega em qualquer local em que estava na época escolhida. Ao incluir o Ampatético Range Attainment, o mago pode mandá-lo para outro lugar, mas os indivíduos não podem ser enviados de volta para períodos fora de sua própria vida. Tais viagens no tempo sem restrições são coisas de lendas, íris temporais e sussurros sobre os poderes dos arqueamentos.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 192
  },
  {
    "id": "mta-2ed:temporal-pocket",
    "name": "Bolso Temporal",
    "originalName": "Temporal Pocket",
    "requirements": {
      "Time": 5
    },
    "practice": "Fazendo",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ocultismo",
      "Ciência",
      "Furtividade"
    ],
    "description": "O mago concede a ela um presente de horas, ganhando tempo extra em sua linha do tempo. Para o sujeito, todo o mundo parece parar, congelado no tempo. Após o fator de duração subjetiva do feitiço, o sujeito volta à linha do tempo do Mundo Caído e, para ele, o universo começa imediatamente a se mover novamente. Enquanto sob os efeitos de um Pocket Temporal, o sujeito envelhece normalmente, quaisquer condições que mudam com o tempo continuam, feridas continuam a sangrar, ele deve dormir a quantidade habitual, e assim por diante. Ele pode mover-se livremente, examinar objetos, tomar quaisquer ações mentais, curar, tocar coisas, e até mesmo lançar feitiços consigo mesmo como o sujeito, mas não fisicamente mover, consumir, ou ferir qualquer coisa — qualquer tentativa de fazê-lo imediatamente termina o feitiço, mas retorna o sujeito à linha do tempo tendo acabado de completar a ação que ele tentou.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 192
  },
  {
    "id": "mta-signs:camera-obscura",
    "name": "Obscura da Câmera",
    "originalName": "Camera Obscura",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Arte",
      "Expressão",
      "Ciência"
    ],
    "description": "Mistérios tendem a surgir em lugares inconvenientes ou até mesmo perigosos. Este feitiço encanta uma câmera, gravador de vídeo, ou dispositivo similar, permitindo-lhe gravar energias Supernal. Isso permite que um mago estude as gravações feitas enquanto o feitiço está ativo com a Active ou Focused Mage Sight como se ela estivesse presente no local da gravação. A magia desvanece-se das gravações quando expira a Duração do feitiço, e apenas uma gravação (uma única foto, uma gravação de vídeo contínua, etc.) por potência pode reter a informação Supernal, e apenas a imagem original mantém a informação. O feitiço tem duas desvantagens em comparação com estudar um mistério em pessoa. Primeiro, a potência do feitiço tampa o jogo de dados base do mago para Revelação ou Escrutínio'. Em segundo lugar, em vez de Nimbus do mago observar contaminando o próprio Mistério, rola em excesso da Gnose + Arcanum do mago reduzir a Potência do feitiço em metade de sua Gnose. Se a potência é reduzida para 0, o registro estudado torna-se inútil. Esta redução de potência aplica-se apenas ao registo específico estudado; não afecta outros ainda não revistos.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 29
  },
  {
    "id": "mta-signs:light-under-a-bushel",
    "name": "Luz sob uma Bushel",
    "originalName": "Light Under a Bushel",
    "requirements": {
      "Prime": 2
    },
    "practice": "Blindagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Investigação",
      "Subterfúgio"
    ],
    "description": "Contar um Mistério com o próprio Nimbus é um perigo sempre presente quando se escrutina. Por meio desse feitiço, o mago amortece Nimbus e lhe dá mais tempo para estudar o Mistério. Adicione a potência deste feitiço ao número de rolos permitidos antes que Nimbus vaze para o Mistério (Mage, p. 93). Se a Duração desse feitiço expirar enquanto o assunto ainda está escrutinando, aplique imediatamente todas as penalidades acumuladas aos rolos de verificação do sujeito.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 29
  },
  {
    "id": "mta-signs:path-to-jerusalem",
    "name": "Caminho para Jerusalém",
    "originalName": "Path to Jerusalem",
    "requirements": {
      "Prime": 2
    },
    "practice": "Véu",
    "primaryFactor": "Potência",
    "withstand": "Opacidade",
    "roteSkills": [
      "Expressão",
      "Furto",
      "Subterfúgio"
    ],
    "description": "Este feitiço, nomeado pelo labirinto na Catedral de Chartres, tem sido a escolha de magos por razões distintas, incluindo tentar esconder seu envolvimento em atividades ilícitas, enquadrar seus rivais, ou simplesmente impedir outros investigadores ocultos. Adicione a potência do feitiço à opacidade do mistério do assunto.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 29
  },
  {
    "id": "mta-signs:shared-sight",
    "name": "Visão Partilhada",
    "originalName": "Shared Sight",
    "requirements": {
      "Prime": 1
    },
    "practice": "Revelação",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Expressão",
      "Investigação",
      "Ocultismo"
    ],
    "description": "Poucos magos têm até mesmo uma compreensão rudimentar de todos os Mistérios Supernais, mas os magos muitas vezes acham útil reunir seus esforços investigativos. Este feitiço concede ao sujeito, que deve ser um mago ou sob a influência do Prime •••• soletrar Apocalipse (Mage, p. 169), Primeiro mago Visão. Mages ainda percebe Arcana concedida sob seu próprio Caminho, não o Caminho do lançador. Este feitiço custa 1 Mana por Arcanum por sujeito, a menos que o Arcanum adicional seja um dos Arcanum's Ruling Arcana. Adicionar qualquer outro Arcanum •: Em vez de ou bem como Prime Sight, o feitiço pode conceder Mage Sight no Arcanum incluído. Incluindo vários Arcana permite que o feitiço conceda Mage Sight em um número de Arcana igual à potência do feitiço, desde que qualquer custo Mana é pago. Tradução Supernal (Mente •••, Prime •••) Prática: Tecelagem Fator primário: Duração Habilidades Rotas Sugeridas: Empatia, Expressão, Ocultismo Este feitiço permite que o sujeito compreenda o Alto Discurso, traduzindo qualquer um que ouve ou lê como se tivesse Visão de Magos Periférica. Ela não transmite, no entanto, a capacidade de falar ou escrever High Speech de volta, ou oferecer qualquer proteção contra Quiescência ou Dissonância se eles encontram High Speech usado como um feitiço Yantra, falado por uma entidade Supernal, ou como um Mistério espontâneo. Por esta razão, o",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 29
  },
  {
    "id": "mta-signs:ritual-focus",
    "name": "Foco Ritual",
    "originalName": "Ritual Focus",
    "requirements": {
      "Mind": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Empatia",
      "Liderança",
      "Persuasão"
    ],
    "description": "Uma variante sobre Telepatia, este feitiço liga as mentes do mago e seus súditos, permitindo-lhe guiá-los como eles trabalham em uníssono em um feitiço particular (ver \"Teamwork\", Mage p. 119). O mago deve lançar o feitiço com escala suficiente para afetar qualquer participante acordado no ritual. Atores secundários no ritual adicionam a potência do feitiço ao seu pool de dados. Impressão Nimbus Nimbus de um mago deixa sua marca sobre o assunto de cada feitiço que lança, mas grandes gastos de poder também podem marcar o espaço ritual do místico — especialmente quando o próprio espaço é parte do simbolismo trabalhado em seu feitiço Imago. Quando um mago leva mais tempo do que ela precisa para lançar um feitiço ritual, sua assinatura Nimbus queima na área ao seu redor — quer queira quer não.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 56
  },
  {
    "id": "mta-signs:hone-the-perfected-form",
    "name": "Hone a forma perfeita",
    "originalName": "Hone the Perfected Form",
    "requirements": {
      "Matter": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Persuasão",
      "Ciência"
    ],
    "description": "O mago pega um pedaço de metal comum — ferro, ouro, prata, mercúrio, cobre, estanho ou chumbo — e o transmuta em seu",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 62
  },
  {
    "id": "mta-signs:forge-thaumium",
    "name": "Forja de Thaumium",
    "originalName": "Forge Thaumium",
    "requirements": {
      "Matter": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "Este feitiço combina metais perfeitos em um único metal que é resistente à magia. Chamado de \"thaumium\" (da palavra grega para \"maravilha\" ou \"marvel\"), este material é forjado a partir de uma liga de orícalco, lunar e hermium. O objeto criado por este feitiço é Durabilidade 1 e pode segurar um ponto de Mana, que ele gasta para proteger contra magia. A potência pode ser atribuída, um por um, ao aumento da Durabilidade ou da capacidade Mana. Para fins do fator Escala do feitiço, a liga tem o mesmo Tamanho que os metais de três componentes combinados. Enquanto um item de thaumium tem Mana armazenado nele, ele protege seu empunhador de magia Supernal. Qualquer feitiço lançado no empunhador provoca um Clash of Wills, a menos que o empunhador escolha permitir o feitiço. O pool de dados para o Clash of Wills é igual ao Gnosis + Matter do criador do item no momento do lançamento deste feitiço. Sempre que usado para Clash, o objeto gasta 1 Mana. O Mages pode reabastecer a fonte Mana usando o feitiço Prime \"Canal Mana\". (Mage, p. 168.)",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 63
  },
  {
    "id": "mta-signs:forge-sophis",
    "name": "Forge Sophis",
    "originalName": "Forge Sophis",
    "requirements": {
      "Matter": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Ciência"
    ],
    "description": "Este feitiço combina metais perfeitos em um único metal que escava Mana. Chamado \"sophis\" (da palavra grega para \"sabedoria\"), este material é forjado a partir de uma liga de apeiron, brontium e hermium. O objeto criado por este feitiço é Durabilidade 1 e pode segurar um ponto de Mana. A potência pode ser atribuída, um por um, ao aumento da Durabilidade ou da capacidade Mana. Para fins do fator Escala do feitiço, a liga tem o mesmo Tamanho que os metais de três componentes combinados. A primeira vez que alguém segurando o objeto forjado com sophis gasta Mana em uma cena, o item absorve um ponto de Mana gasto. Isso não muda os custos de Mana, mas, em vez disso, limpa o Mana gasto antes que ele se dissipa. Mages pode absorver a fonte Mana do item usando o feitiço Prime \"Canal Mana\".",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 63
  },
  {
    "id": "mta-signs:forge-dumanium",
    "name": "Forge Dumanium",
    "originalName": "Forge Dumanium",
    "requirements": {
      "Matter": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Persuasão"
    ],
    "description": "Este feitiço combina metais perfeitos em um único metal que escava Mana. Chamado \"dumanium\" (da palavra grega para \"poder\" ou \"força\"), este material é forjado a partir de uma liga de kassiterum e siderite. O objeto criado por este feitiço é Durabilidade 1 e tem a capacidade de segurar um ponto de Mana. A potência pode ser atribuída, uma por uma, ao aumento da Durabilidade, capacidade Mana, ou bônus de equipamento (até um máximo de +5). Para fins do fator Escala do feitiço, a liga tem o mesmo Tamanho que os metais de três componentes combinados. Se o objeto dumânio é uma arma, o manequim pode usar o Mana armazenado para agravar o dano da arma por um único ataque. Esta é uma acção reflexiva que exige um Mana das lojas de armas de dumânio. Dumanium deve ser tamanho 3 ou mais para atuar como armadura eficaz. O mago pode alocar potência em armadura feita desta forma para 1/1 armadura, em vez de bônus de equipamento (a um máximo de 5/5). Mages pode absorver a fonte Mana do item usando o feitiço Prime \"Canal Mana\".",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 63
  },
  {
    "id": "mta-signs:death-touched-item",
    "name": "Item Tocado da Morte",
    "originalName": "Death Touched Item",
    "requirements": {
      "Death": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Este feitiço transforma um objeto comum em um capaz de afetar objetos de efêmera e sombra sintonizadas com a morte. Após o lançamento, o objeto é simultaneamente um item do mundo material, do Crepúsculo Ajustado à Morte e das sombras lançadas da ausência de luz. Ele pode interagir com qualquer coisa no Crepúsculo Ajustado à Morte ou mesmo com itens criados de sombras através do Arcanum da Morte. Ele pode lidar com danos ao Corpus de um fantasma ou à Estrutura de um item sombra ou evitar danos ao usuário de tais coisas. O item mantém seus bônus de equipamento normal. Se o item é trazido para o Twilight, ele não perde sua forma material enquanto sob os efeitos deste feitiço.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 65
  },
  {
    "id": "mta-signs:the-right-tool",
    "name": "A Ferramenta Direita",
    "originalName": "The Right Tool",
    "requirements": {
      "Fate": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Furtividade"
    ],
    "description": "Aqueles que entendem as complexidades do destino sabem que muito do cumprimento de um destino envolve estar no lugar certo no momento certo. Outro fator bem conhecido é ter disponível",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 65
  },
  {
    "id": "mta-signs:perpetual-motion",
    "name": "Movimento Perpétuo",
    "originalName": "Perpetual Motion",
    "requirements": {
      "Forces": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "Aqueles que têm conhecimento do Éter sabem que as leis da física só se aplicam aos mundanos e não iniciados. O sujeito pode funcionar para a duração do feitiço sem a necessidade de entrada de energia. Se o dispositivo tiver baterias instaladas ou estiver ligado a uma tomada eléctrica, não retira energia destas fontes enquanto funciona sob os auspícios deste feitiço.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 66
  },
  {
    "id": "mta-signs:data-hog",
    "name": "Porco de Dados",
    "originalName": "Data Hog",
    "requirements": {
      "Forces": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Computador",
      "Furto",
      "Persuasão"
    ],
    "description": "O mago altera a capacidade de um dispositivo computadorizado para processar, aceitar e transferir dados. Para cada nível de potência do feitiço, o bônus do equipamento do sujeito é aumentado em +1 ou diminuído em -1.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 66
  },
  {
    "id": "mta-signs:contact-high",
    "name": "Contacto Alto",
    "originalName": "Contact High",
    "requirements": {
      "Life": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Medicamento",
      "Ocultismo",
      "Ciência"
    ],
    "description": "Este feitiço faz com que o seu sujeito extruda uma droga poderosa que visa o sistema nervoso de qualquer um que o toque. Qualquer pessoa cuja pele entra em contato com o sujeito é afetada pela droga para uma cena. O mago que lança este feitiço determina se a droga é um potenciador do sistema nervoso, que concede um bónus à Iniciativa igual à Potência, ou um antagonista do sistema nervoso, que inflige uma penalidade à Iniciativa igual à Potência. A droga afeta um sujeito vivo, bem como qualquer pessoa que a toque.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 66
  },
  {
    "id": "mta-signs:three-the-crafter-s-trade-endless-bounty",
    "name": "TRÊS: COMÉRCIO DO CRAFTER COMERCIAL Endless Bounty",
    "originalName": "THREE: THE CRAFTER'S TRADE Endless Bounty",
    "requirements": {
      "Matter": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Ciência",
      "Manha"
    ],
    "description": "O mago pode garantir que ela nunca fique sem pequenos itens dispensáveis. Ela encanta um único item que contém um item dispensável menor, como um clipe de bala com munição dentro ou uma viga de singles. Para a duração do feitiço, o item nunca se esgota. O valor do item dispensável pode ser até o que poderia ser obtido com recursos iguais à potência do feitiço, de modo que um mago poderia ter uma oferta infinita de notas de cem dólares em sua carteira. O objeto deve ter pelo menos uma unidade do item dispensável dentro dele quando o feitiço é lançado para funcionar corretamente. A mala dela tem sempre dólares, a pistola tem sempre balas e o tanque do carro tem sempre gasolina.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 67
  },
  {
    "id": "mta-signs:give-me-that",
    "name": "Dá-me isso.",
    "originalName": "Give Me That",
    "requirements": {
      "Mind": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Ofícios",
      "Empatia",
      "Persuasão"
    ],
    "description": "O conceito de posse e propriedade pode desencadear emoções poderosas nas pessoas. Este feitiço tece uma aura emocional em torno de um item que evoca o conceito de propriedade em quem o vê. Qualquer um que encontra o objeto e não resiste ao feitiço ganha a Condição Persistente: Obsessão, com o objeto como seu foco. Adicionar espaço •••: Indivíduos com a Condição Obcecada associada ao objeto ganham uma forte ligação simpática a ele para a Duração do feitiço.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 67
  },
  {
    "id": "mta-signs:optimal-container",
    "name": "Recipiente Optimal",
    "originalName": "Optimal Container",
    "requirements": {
      "Space": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Furto",
      "Ciência",
      "Subterfúgio"
    ],
    "description": "Este feitiço expande as dimensões de um recipiente tornando-o capaz de segurar objetos maiores do que normalmente faria. O sujeito deve ter algum tipo de bolso ou espaço interno. O mago aumenta o assunto para ser capaz de conter objetos de um tamanho total combinado igual ao seu próprio tamanho mais potência.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 67
  },
  {
    "id": "mta-signs:spiritual-tool",
    "name": "Ferramenta Espiritual",
    "originalName": "Spiritual Tool",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Aperfeiçoando",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Ocultismo",
      "Sobrevivência"
    ],
    "description": "O mago aumenta um objeto para ser mais sintonizado com a Sombra e espíritos em geral. O objeto torna-se simultaneamente um item do mundo material e da Sombra, capaz de interagir com espíritos tanto na Sombra como na Twilight. O item mantém seus bônus de equipamento normal. Se o objeto é levado para qualquer outro reino, ele mantém sua forma material quando o objeto retorna ao reino material enquanto sob os efeitos deste feitiço. A Natureza dos Melhorias Um aprimoramento em um item mágico é mais complexo do que apenas um item com um feitiço lançado nele. Embora o resultado seja funcionalmente o mesmo, o item tem sua essência e realidade fundamental alterada pelo feitiço de realce. Alguns itens aceitam estas melhorias melhor do que outros, e alguns objetos raros exibem melhor do que propriedades mundanas por conta própria. Mages estão cientes das formas aperfeiçoadas de materiais de base e compostos, e objetos feitos desses metais exibem propriedades aprimoradas que o material normalmente não tem. Alguns itens mundanos não aperfeiçoados através de propriedades de exposição mágica que os tornam extremamente receptivos a certos tipos de magia. Mages referiu-se a estes como itens melhorados que ocorrem naturalmente porque são tão fáceis de trabalhar com e são altamente valorizados. Naturalmente ocorrendo itens melhorados nunca parecem começar aver",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 67
  },
  {
    "id": "mta-signs:building-a-mystery-expanded-unliving-vessel",
    "name": "Construindo um Mistério: Um Vaso Vivo Expandido",
    "originalName": "Building a Mystery: Expanded Unliving Vessel",
    "requirements": {
      "Death": 3,
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Resistência",
    "roteSkills": [
      "Ofícios",
      "Ocultismo",
      "Expressão"
    ],
    "description": "Este feitiço prepara um assunto sob a alçada da Morte para o Imbue Item Attainment. O mago pode usar o Attainment para imbuir assuntos encontrados no Ghostly Twilight. Isso inclui os itens fantasmagóricos encontrados no Twilight, bem como os próprios fantasmas, que automaticamente suportam o elenco do feitiço. Ela também pode imbuir itens feitos de ectoplasma, como aqueles criados com Shaping Ectoplasmático, ou cadáveres. Para lançar um fantasma, ele deve estar no fantasma Crepúsculo, ou Manifestado. Um mago pode invocar um fantasma com o Arcano da Morte.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 70
  },
  {
    "id": "mta-signs:rapid-access-memory",
    "name": "Memória de acesso rápido",
    "originalName": "Rapid Access Memory",
    "requirements": {
      "Forces": 3,
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Furto",
      "Ciência"
    ],
    "description": "O mago pode imbuir um feitiço em software que pode mais tarde ativar em um computador. O caster imbues o software em item que pode interface com um computador (um disco rígido externo, um pendrive de memória USB, ou mesmo apenas um dongle) por normal. Uma vez imbuído, o software pode desencadear o feitiço através da interface com um computador, com base em critérios definidos pelo mago no momento da fundição. Isso pode incluir uma senha, ou um conjunto específico de condições de interface de software. O software usa o Mana armazenado no objeto para lançar o feitiço, como qualquer um pode usar o item. Se o objeto ficar sem lojas Mana, o software não pode lançar o feitiço.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 70
  },
  {
    "id": "mta-signs:living-vessel",
    "name": "Navio Vivo",
    "originalName": "Living Vessel",
    "requirements": {
      "Life": 3,
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Vigor",
    "roteSkills": [
      "Acadêmicos",
      "Medicamento",
      "Persuasão"
    ],
    "description": "Este feitiço prepara um sujeito sob a alçada da Vida para o Imbue Item Attainment. O mago pode usar a propriedade para imbuir qualquer sujeito vivo.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 70
  },
  {
    "id": "mta-signs:imbue-room",
    "name": "Sala de Imbue",
    "originalName": "Imbue Room",
    "requirements": {
      "Prime": 3,
      "Space": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Furto",
      "Ocultismo",
      "Ciência"
    ],
    "description": "Este feitiço permite que um mago prepare uma sala ou espaço para o Imbue Item Attainment. O mago deve aplicar o correto Fator de Feitiço de Área ao seu elenco enquanto imbui o quarto. Qualquer pessoa dentro da área definida é afetada por um efeito persistente ou pode ativar o feitiço se ela conhece o gatilho. Ao contrário de um objeto, o espaço não detém Mana, e qualquer Mana necessário para lançar o feitiço imbuído deve ser gasto pelo usuário.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 70
  },
  {
    "id": "mta-signs:spirit-vessel",
    "name": "Navio-espírito",
    "originalName": "Spirit Vessel",
    "requirements": {
      "Prime": 3,
      "Spirit": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Resistência",
    "roteSkills": [
      "Acadêmicos",
      "Intimidação",
      "Ocultismo"
    ],
    "description": "Este feitiço prepara um espírito para o Imbue Item Attainment. O mago deve ser capaz de lançar seu feitiço através da Gauntlet, ou o espírito que ela está imbuindo deve ser Manifestado. O sujeito automaticamente Retira o elenco. O mago pode invocar um espírito para ela ou ajudar alguém a se manifestar antes de lançar este feitiço. Itens de Uso Limitado Pesquisa sobre a natureza dos Itens Imbued levou a algumas descobertas sobre como fazê-lo por um curto período de tempo, ou para um único uso. Os efeitos utilizam o conceito por trás de imbuir um feitiço em um item. Quando o feitiço dispara, ele é lançado uma vez, e o item não é mais imbuído. A função destes feitiços está relacionada com o destino •• Attainment, exceto que a Duração Condicional não termina os efeitos do feitiço, mas permite que o feitiço seja lançado. Os pesquisadores de Memias descobriram que a combinação do processo de imbuição com o spellcasting simples levou a resultados interessantes. Criar tais itens é menos intensivo que imbuir permanentemente um item, mas por natureza os itens não duram. Como tal, o processo foca na eficácia do feitiço no imediato, sem qualquer consideração à longevidade. Cabalas muitas vezes fazem com que esses itens passem para seus membros dando acesso temporário a Arcana desconhecida.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 70
  },
  {
    "id": "mta-signs:energize-object",
    "name": "Energizar objeto",
    "originalName": "Energize Object",
    "requirements": {
      "Forces": 3,
      "Prime": 2
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Furto",
      "Ciência"
    ],
    "description": "Este feitiço prime um objeto com o potencial de ativação para segurar um feitiço. O mago lança este feitiço sobre um sujeito que o altera de uma forma que lhe permite segurar um feitiço até que uma força cinética seja aplicada. Uma vez que o objeto é preparado, um mago pode gastar um Mana para lançar qualquer outro feitiço sobre o objeto, que não se ativa até que uma força adequada necessária para a ativação seja aplicada. A força adequada é determinada pelo tipo de objeto: Uma bala deve ser disparada de uma arma, um objeto estacionário deve ser atirado, uma arma deve ser balançada com força de golpe, e um interruptor deve ser rodado do off para a posição ativa. Energizar Objeto pode armazenar até sua potência em feitiços no sujeito, que permanece no controle de seu lançador, mas não faz efeito até ativado. Qualquer um pode lançar o feitiço ativando o objeto. Se o mago controlador cancelar Energize Object, ou a sua Duração terminar, qualquer feitiço armazenado termina.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 70
  },
  {
    "id": "mta-signs:three-the-crafter-s-trade-spell-potion",
    "name": "TRÊS: A POÇÃO OBJECTIVA COMERCIAL DA CRAFTER",
    "originalName": "THREE: THE CRAFTER'S TRADE Spell Potion",
    "requirements": {
      "Matter": 3,
      "Prime": 2
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Medicamento",
      "Subterfúgio"
    ],
    "description": "Este feitiço altera magicamente um item ingerido, fazendo-o agir como um recipiente de armazenamento para outro feitiço. O mago lança este feitiço em um item ingestível, que muda o item de alimento mundano ou bebida para uma poção mágica, preparado para segurar e armazenar outro feitiço. Uma vez que o item tem o feitiço Spell Potion lançado sobre ele, um mago pode gastar um Mana para lançar qualquer outro feitiço sobre o item se ele usa toque / auto intervalo. O feitiço não produz efeito até que o item seja ingerido. Se o assunto deste feitiço for ingerido antes de outro feitiço ter sido armazenado nele, não tem valor nutricional e a Poção Feiticeira não tem outro efeito. Spell Potion pode armazenar até sua potência em feitiços no assunto, que permanece no controle de seu lançador, mas não faz efeito até ingerido. Qualquer um pode ativar os feitiços armazenados ingerindo o assunto, mas são então usados como objeto dos feitiços armazenados. Se o mago controlador cancelar a Poção Ortográfica, ou sua Duração terminar, os feitiços contidos terminam.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 71
  },
  {
    "id": "mta-signs:stored-spell",
    "name": "Feitiço Armazenado",
    "originalName": "Stored Spell",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Com este feitiço, o mago pode fazer um item capaz de segurar um feitiço até mais tarde ativação, assim como o Prime Attainment, Imbue Item. Uma vez que este feitiço esteja em vigor, um mago pode gastar um Mana para usar o Soluço Armazenado ao lançar outro feitiço com alcance de toque/ auto, que está contido, não activado. O feitiço armazenado pode imbuir até sua potência em feitiços no objeto, que permanecem no controle de seu lançador, mas não fazem efeito até que um mago passe um ponto de Mana enquanto toca no item. Qualquer um que possa fazer isso pode gastar um ponto de Mana para liberar o feitiço do item enquanto ela está tocando. Feitiços liberados de Stored Spell usam a pessoa tocando o item como seu assunto. Se o mago controlador cancelar o feitiço armazenado, ou a sua duração terminar, qualquer feitiço contido termina. Baterias Mana Ao imbuir um objeto, um mago pode armazenar Mana dentro dele, bem como o feitiço. Normalmente, este Mana é reservado para lançar o feitiço imbuído, mas nem sempre. Qualquer pessoa segurando o item pode puxar sobre a reserva Mana para qualquer fundição, desde que o item ainda contém Mana. Mais tarde, o mago pode reabastecer a reserva Mana até sua capacidade usando o Arcanum Prime. A capacidade de tirar Mana de um item a qualquer momento é um recurso inestimável para muitos magos, especialmente aqueles incapazes de canalizar Mana por conta própria. O i",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 71
  },
  {
    "id": "mta-signs:mana-battery",
    "name": "Bateria Mana",
    "originalName": "Mana Battery",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "O mago prime um item para segurar Mana, que ela pode então acessar ou reabastecer como ela deseja. O mago lança este feitiço em um assunto antes de usar o Item Prime Attainment, Imbue. O sujeito está preparado para aceitar uma piscina Mana, mas não um feitiço. O número de sucessos necessários para imbuir o item é igual ao pool Mana imbuído no item. Um item criado através da bateria Mana não contém um feitiço como um item imbuído, mas pode armazenar Mana de forma similar. O item pode armazenar até a potência deste feitiço em Mana. Qualquer um que possa utilizar Mana pode puxar Mana para o seu padrão tocando no item. Alternativamente, enquanto em contato com o item, ela pode usar o Mana armazenado no item em vez de seu próprio para lançar feitiços. Um mago pode usar o Canal Mana (Mage: The Awakening Second Edition, p.168) para reabastecer suas lojas. Deixar ir: Abandonar o controle ortográfico A magia colocada em um item ou criatura não é o único tipo de magia que um mago pode querer para durar indefinidamente. Ela pode muito bem querer preservar as alas que colocou no lugar para proteger sua casa ou manter um feitiço para manter o controle de seus bens. Lançar qualquer feitiço para durar indefinidamente requer muito esforço da parte do mago, e muitas vezes leva bastante tempo. A não ser que tenham abandonado estes feitiços.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 71
  },
  {
    "id": "mta-signs:primal-transfer",
    "name": "Transferência Primal",
    "originalName": "Primal Transfer",
    "requirements": {
      "Prime": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Ofícios",
      "Empatia",
      "Subterfúgio"
    ],
    "description": "Este feitiço permite que um mago transfira o controle de um feitiço que ela já lançou para outro mago. Este feitiço transfere para a sua potência em feitiços do caster para o seu sujeito. Quando os feitiços estiverem sob o controlo do novo mago, ela pode fazer com eles o que quiser. Uma vez que a duração deste feitiço termina, o controle dos feitiços transferidos retorna ao elenco original.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 72
  },
  {
    "id": "mta-signs:time-limit",
    "name": "Prazo",
    "originalName": "Time Limit",
    "requirements": {
      "Time": 3,
      "Prime": 2
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Ciência",
      "Sobrevivência"
    ],
    "description": "O mago instila um limite de tempo nos efeitos de um feitiço imbuído enquanto ela o abandona. O assunto é um mago que então utiliza deliberadamente os efeitos deste feitiço enquanto lança o Item Prime Attainment: Imbue. No final do implante, este feitiço abandona o Item Imbuído do controle do lançador. O feitiço abandonado tem uma duração finita em que funciona para um usuário, e então deixa de funcionar. Se um novo usuário tenta usar o feitiço, ele funciona novamente, mas apenas por um período de tempo como ditado por este feitiço. O tempo limite do feitiço é de uma semana por nível de potência do feitiço. A duração do prazo deve durar para a totalidade do processo de imbuição, ou não produz efeitos.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 72
  },
  {
    "id": "mta-signs:three-the-crafter-s-trade-steal-life-force",
    "name": "TRÊS: O COMÉRCIO DO CRAFTER Rouba a Força de Vida",
    "originalName": "THREE: THE CRAFTER'S TRADE Steal Life Force",
    "requirements": {
      "Life": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Ofícios",
      "Medicamento",
      "Persuasão"
    ],
    "description": "Este feitiço é lançado em um mago e altera seu processo de imbuição, fazendo com que o item resultante danifique o usuário. Se um mago usa o Prime Attainment, Imbue Item, antes que a Duração de Roubar Força de Vida termine, o Item resultante é amaldiçoado. O Item parece funcionar como um Item Imbued normal, exceto que requer força de vida para funcionar. O Item rouba a força vital do usuário que lida com um dano letal para cada ponto de Mana que é gasto para lançar o feitiço imbuído. Se o Item ficar sem Mana, ele se reabastece automaticamente, infligindo um ponto de dano letal a quem entrar em contato com ele.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 73
  },
  {
    "id": "mta-signs:primary-subject",
    "name": "Assunto primário",
    "originalName": "Primary Subject",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Perseverança",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Este feitiço altera o processo de imbuição, criando um Item que sempre visa o usuário. O tema do feitiço deve ser um mago. Se o sujeito usa o Item Prime Attainment, Imbue, antes que a Duração do feitiço termine, o Assunto Primário faz com que o sujeito do feitiço imbuído seja sempre o usuário do Item. Ou seja, qualquer um que tente acionar ou usar o Item Imbuído é o objeto do feitiço imbuído, independentemente de quem ou o que o empunhador tenta atingir.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 73
  },
  {
    "id": "mta-signs:steal-mana",
    "name": "Roubar Mana",
    "originalName": "Steal Mana",
    "requirements": {
      "Prime": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Duração",
    "withstand": "Vigor",
    "roteSkills": [
      "Expressão",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Este feitiço deve ser lançado num mago para alterar o seu processo de imbuição, resultando num Item que desvia Mana de quem quer que esteja em contacto com ele. Quando o mago sob os efeitos de Steal Mana imbue um item com o Prime Attainment, ela lhe dá uma capacidade Mana. Em vez de infundir o item com Mana, o item rouba tanto Mana de quem estiver em contato com ele. Sempre que o feitiço do Item é lançado, ele imediatamente retira Mana do usuário. Se o Mana o trouxesse acima de sua capacidade normal de armazenamento, o Mana se dissiparia na atmosfera. Se o usuário não tem tanto Mana quanto o Item tenta sifão, ele causa dano ao Bashing para cada Mana que não pode sifão.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 73
  },
  {
    "id": "mta-signs:forced-sympathy",
    "name": "Simpatia Forçada",
    "originalName": "Forced Sympathy",
    "requirements": {
      "Space": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Empatia",
      "Furtividade",
      "Subterfúgio"
    ],
    "description": "Este feitiço deve ser lançado em um mago para alterar seu processo de imbuição resultando em um Item que sempre visa um assunto com simpatia ao usuário. Este feitiço deve ser lançado em conjunto com o Espaço, Alcance Simpático. Sempre que o assunto deste feitiço usa o Prime Attainment, Item Imbue, Simpatia Forçada automaticamente imbui o item com alcance simpático. Sempre que um usuário lança o feitiço imbuído do item, ele sempre visa o assunto com a maior simpatia ao usuário. A simpatia mais próxima é determinada pelo melhor Yantra simpático sobre o usuário no momento do casting. Se o usuário tem vários itens que podem ser usados como um Yantra Simpático, o efeito do feitiço ocorre sobre o que está na faixa física mais próxima. No mínimo, o feitiço visa a pessoa mais próxima que o usuário conhece pelo nome. Renúncias alternativas Mages de mão esquerda raramente se preocupam em abandonar seus feitiços de forma segura, especialmente os Rapt e Banishers. Outros grupos cuidam de ter seus itens por longos períodos e, assim, pagar os custos para renunciar ao feitiço de forma segura. Como Mages Ordem, estes mages desenvolveram maneiras de reduzir o custo para si mesmos através do uso de feitiços. Estes feitiços tendem a colocar o ônus dos gastos com outros mantendo o custo para o mago baixo.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 74
  },
  {
    "id": "mta-signs:sacrificial-relinquishment",
    "name": "Renúncia Sacrificial",
    "originalName": "Sacrificial Relinquishment",
    "requirements": {
      "Death": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Intimidação",
      "Medicamento",
      "Manha"
    ],
    "description": "Este feitiço permite ao mago sacrificar uma vida em vez de um ponto da sua própria força de vontade para renunciar a um feitiço com segurança. A próxima vez que o sujeito renuncia a um feitiço enquanto este feitiço permanece ativo, ela pode fazer um sacrifício de sangue para renunciar ao feitiço como se ela gastasse um ponto Willpower. Para trabalhar corretamente o sacrifício deve ser valioso, como dezenas de pequenas criaturas não inteligentes, alguns animais inteligentes, ou um único sacrifício humano deve ser feito para satisfazer as exigências do feitiço.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 74
  },
  {
    "id": "mta-signs:broken-relinquishment",
    "name": "Renúncia Quebrada",
    "originalName": "Broken Relinquishment",
    "requirements": {
      "Mind": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Duração",
    "withstand": "Compostura",
    "roteSkills": [
      "Intimidação",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "Este feitiço cria um ponto de ruptura para o sujeito como forma de um mago renunciar ao seu feitiço. O próximo ato de arrogância, ponto de ruptura, ou rolo similar por um sujeito deste feitiço sofre uma penalidade igual à potência deste feitiço, em que o próximo assunto (que pode ser o mesmo assunto, mas não necessariamente tem que ser) que renuncia a um feitiço faz isso com segurança como se ela gastou um ponto de força de vontade.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 74
  },
  {
    "id": "mta-signs:reaping-relinquishment",
    "name": "Abdicar da Renúncia",
    "originalName": "Reaping Relinquishment",
    "requirements": {
      "Death": 3
    },
    "practice": "Desgastando",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Intimidação",
      "Medicamento",
      "Ocultismo"
    ],
    "description": "O mago destrói uma alma para abandonar um feitiço em segurança. A próxima vez que o assunto deste feitiço destruir uma alma — seja em seu poder através de um feitiço de morte diferente ou contido em um Jarro de Alma — ela pode renunciar a outro feitiço com segurança como se ela gastasse um ponto de força de vontade. Adicionar Prime ••: O caster pode destruir uma pedra de alma em vez disso para o mesmo efeito. A sociedade de papel mago do Crafter tem opiniões mistas sobre itens mágicos. São inegavelmente úteis, e os magos recolhem e os usam tanto quanto possível. Ao mesmo tempo, alguns itens podem ser poderosos e perigosos nas mãos erradas e certos magos querem destruí - los ou escondê - los. Perigoso ou não, a maioria dos mages quer acesso a itens mágicos e ter uma grande quantidade é impressionante e um sinal de sucesso e poder. Aqueles que criam tais itens são tidos na mais alta consideração e estima, a menos que de alguma forma tenham ganho uma má reputação. Reputação Criando um item mágico é um processo demorado e exigente. Enquanto qualquer mago com o Arcanum Prime ou Matter pode criar um item com magia, muitos preferem deixar alguém fazer o trabalho. Alguns mages estão contentes em simplesmente usar um item já na posse de sua cabala ou uma ordem dela tem para empréstimo. Outros têm requisitos específicos e querem o item criado novo. Um mago com o desejo de trabalhar pode",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 74
  },
  {
    "id": "mta-signs:reveal-marks",
    "name": "Revelar Marcas",
    "originalName": "Reveal Marks",
    "requirements": {
      "Prime": 3,
      "Time": 2
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Investigação"
    ],
    "description": "Um mago pode discernir todas as assinaturas Nimbuses associadas ao assunto. Este feitiço reduz a dificuldade de Focused Mage Sight para examinar o assunto para uma assinatura Nimbus e revela todos os Nimbus sempre associados com o assunto. O feitiço adiciona um bônus igual à potência ao rolo para revelá-los. Se mais de uma assinatura Nimbus está associada com o assunto, quer porque um mago infundiu seu Nimbus no item, ou por causa de um feitiço, o mago pode determinar a idade de cada Nimbus.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 75
  },
  {
    "id": "mta-signs:new-spells-fracture-grimoire",
    "name": "New Spells Fracture Grimoire",
    "originalName": "New Spells Fracture Grimoire",
    "requirements": {
      "Prime": 2
    },
    "practice": "Decisão",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Ofícios",
      "Investigação",
      "Ocultismo"
    ],
    "description": "O mago copia um Grimoire inteiro em duas ou mais partes díspares que individualmente não significam nada. Só alguém que reúne todas as partes pode lançar ou aprender quaisquer rotes, mesmo que uma parte parece conter rotes dentro de si. Usar as peças em conjunto requer Escrutínio com Visão de Mago Focado; adicione a Potência do feitiço à Opacidade do Mistério. Por padrão, o Grimoire pode ser dividido em vários pedaços iguais à potência do feitiço. Mages usa o Attainment Duração Condicional para especificar um ritual para executar, um quebra-cabeça para resolver, ou um jogo para ganhar que termina o feitiço e remonta o Grimoire.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 85
  },
  {
    "id": "mta-signs:scribe-palimpsest",
    "name": "Scribe Palimpsest",
    "originalName": "Scribe Palimpsest",
    "requirements": {
      "Prime": 3
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "Total de pontos Arcanum utilizados na rotação + 1",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ocultismo"
    ],
    "description": "Como \"Scribe Grimoire\", este feitiço dá forma física aos símbolos de uma única rotação. Um mago pode lançá - lo várias vezes para encher um vaso com muitas rotações. Ela faz isso usando um Grimoire previamente escrito com seu conteúdo apagado, esfregado, rabiscado, pintado sobre, ou de outra forma feito ilegível. O contador de histórias escolhe um Arcanum quando o personagem lança este feitiço. Sempre que um personagem mais tarde lança o rote do Grimoire completo, ele age como se incorporasse pontos do Arcanum escolhido igual à potência deste feitiço, criando efeitos misturados imprevisíveis. Se o contador de histórias escolheu um Arcanum já incluído no rote, conceda ao elenco um Reach livre em vez disso. Rotes aprendeu com Experiences de um palimpsest carregam estes efeitos Arcana extra com eles.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 85
  },
  {
    "id": "mta-signs:new-spells-astral-grimoire",
    "name": "Novos Feitiços Astral Grimoire",
    "originalName": "New Spells Astral Grimoire",
    "requirements": {
      "Mind": 3,
      "Prime": 1
    },
    "practice": "Tecelagem",
    "primaryFactor": "Potência",
    "withstand": "Total de pontos Arcanum utilizados na rotação",
    "roteSkills": [
      "Ofícios",
      "Expressão",
      "Ocultismo"
    ],
    "description": "Escribar um Grimoire Astral é muito parecido com escribar um Grimoire terrestre, exceto que o vaso que detém os símbolos existe apenas nos Oneiros do sujeito. Um sujeito acordado pode lançar os rotes do Grimoire sem ter que meditar no Astral, mas se ela fizer o elenco com a representação Astral do Grimoire na mão, ele concede um bônus de dois-moedas Equipamentos para todos os rolos de fundição. Invocar o Goetia que representa o Grimoire tem o mesmo efeito.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 86
  },
  {
    "id": "mta-signs:living-grimoire",
    "name": "Grimório Vivo",
    "originalName": "Living Grimoire",
    "requirements": {
      "Life": 4,
      "Prime": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Total de pontos Arcanum utilizados na rotação e na resistência",
    "roteSkills": [
      "Ofícios",
      "Medicamento",
      "Ocultismo"
    ],
    "description": "O mago escriba uma única rota por lançamento deste feitiço em um ser vivo, seja de memória ou copiado de outro Grimoire. Os símbolos poderiam ser representados como tatuagens que cobriam o corpo, marcas queimadas em carne, runas esculpidas em ossos a serem descobertas após a morte, ou qualquer outro método que o mago idealiza",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 86
  },
  {
    "id": "mta-signs:haunted-grimoire",
    "name": "Grimório Assombrado",
    "originalName": "Haunted Grimoire",
    "requirements": {
      "Spirit": 4,
      "Prime": 1
    },
    "practice": "Padronização",
    "primaryFactor": "Potência",
    "withstand": "Total de pontos Arcanum utilizados na rotação e classificação",
    "roteSkills": [
      "Ofícios",
      "Intimidação",
      "Ocultismo"
    ],
    "description": "O mago liga um espírito a um Grimoire, escrevendo sua Essência no Padrão do vaso. Ao contrário de um fetiche, um Grimoire assombrado não hospeda a Numina do espírito ou influências, nem tem uma piscina Essence. Em vez disso, o espírito é uma parte das palavras e runas, presos dentro dos símbolos Supernais. O Grimoire ganha as Condições Ressonantes e Abertas para esse espírito, que é um efeito duradouro do feitiço até resolvido como de costume. Sempre que alguém lança um rote do Grimoire, ela automaticamente aumenta o fator principal do rote pelo rank do espírito em vez de pela sua própria classificação Arcanum menos um, mas o espírito tem a chance de escapar montando Mana do navio para o mundo. Ele roda seu Power + Finesse em um confronto de vontades contra o lançador. Se o espírito tiver sucesso, o feitiço termina, e o espírito é liberado no Twilight, embora vários espíritos possam ser presos em um Grimoire com peças separadas desse feitiço. Sempre que alguém memoriza um rote do Grimoire, o espírito tem uma oportunidade de possuí-la, novamente Rolling Power + Finesse em um Clash of Wills. O mago aprende a rotação independentemente, mas se o espírito for bem sucedido, transfere as Condições Ressonantes e Abertas do Grimoire para o mago e pode usar imediatamente a Manifestação de Posse, mesmo que",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 87
  },
  {
    "id": "mta-signs:new-spells-supernal-signature",
    "name": "Nova Assinatura Supernal de Feitiços",
    "originalName": "New Spells Supernal Signature",
    "requirements": {
      "Prime": 1
    },
    "practice": "Atraente",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Expressão",
      "Intimidação",
      "Política"
    ],
    "description": "O mago acende seu Nimbus Imediato para imprimir sua assinatura sobre um assunto — uma pessoa, lugar, objeto ou fenômeno — mais fortemente do que o normal. A assinatura reflete seu nome de sombra e dura para a duração do feitiço. Qualquer pessoa que usa Focused Mage Sight para estudar sua assinatura Nimbus sobre o assunto não só pode sentir os detalhes do Nimbus, mas ver uma visão idealizada da identidade Supernal do elenco. Ver essa visão move qualquer impressão que o espectador teve do mago para cima um nível no gráfico de Manobras Sociais, a menos que o espectador tenha sucesso em Perseverança + Compostura, penalizado pela Potência deste feitiço. Sustentar Nimbus (Primo • • + Tempo •) Prática: Governar Fator Primário: Duração Habilidades Rotas Sugeridas: Expressão, Investigação, Sobrevivência O mago lança este feitiço em uma assinatura Nimbus que ele estudou com Focused Mage Sight. Em vez de desaparecer ao seu ritmo habitual, o Nimbus persiste durante a duração deste feitiço. Após o feitiço expirar, o Nimbus volta a desaparecer à sua taxa habitual. Mages usa este feitiço em conjunto com \"Invocação Temporal\" (Mage: The Awakening Second Edition , pp. 189-190) para restaurar um feitiço sujeito a um estado anterior antes de sua assinatura Nimbus desbotado e, em seguida, manter o Nimbus de fazê-lo.",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 94
  },
  {
    "id": "mta-signs:nimbus-tuning",
    "name": "Nimbus Tuning",
    "originalName": "Nimbus Tuning",
    "requirements": {
      "Prime": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Empatia",
      "Investigação",
      "Ocultismo"
    ],
    "description": "O Willworker pode sintonizar mais atentamente qualquer assinatura Nimbus que ele escrutina com Focused Mage Sight. Para cada nível de potência, ele aprende uma das seguintes informações adicionais sobre o proprietário do Nimbus: • Gnosis • Sabedoria • Virtude ou Vício • Um Ato de Hubris que resultou da magia que deixou o Nimbus para trás • Uma Obsessão relacionada com a magia que deixou o Nimbus para trás • Se a magia resultou em Paradox e se foi contido ou liberado Unnaming (Espaço • • • • • • • •) Prática: Unmaking Primary Factor: Duration Withstand: Composure Sugestãod Rote Skills: Empatia, Expressão, Ocultismo O mago apaga o nome simpático do sujeito da existência. O nome excisado é imediatamente substituído por um que corresponde ao que a maioria dos dorminhocos usaria para se referir a ela. Todas as conexões simpáticas que o sujeito teve com base na identidade ou nome deixam de existir também. Quem tenta lançar ao alcance simpático sobre o assunto leva a pena por não ter um nome simpático até que ela aprenda o novo. Adicionar Prime •••••: O feitiço pode apagar o nome de sombra de um sujeito acordado e Nimbus em vez disso. O Nome da Sombra não é substituído imediatamente; o sujeito precisa reconstruir uma nova identidade Supernal do zero. O jogador do sujeito deve formar um novo Nimbus para o personagem e",
    "sourceId": "mta-signs",
    "source": "Signs of Sorcery",
    "page": 95
  },
  {
    "id": "mta-pentacle:memento",
    "name": "Memento",
    "originalName": "Memento",
    "requirements": {
      "Matter": 2,
      "Mind": 4
    },
    "practice": "Padronização",
    "primaryFactor": "Duração",
    "withstand": "",
    "roteSkills": [
      "Acadêmicos",
      "Expressão",
      "Intimidação"
    ],
    "description": "Em vez de usar \"Leia as Profundidades\" para compartilhar memórias diretamente, este feitiço permite que um mago guarde suas próprias lembranças dentro de objetos externos para uso posterior. O sujeito deve ser um objeto sem mente, que o feitiço encanta para manter a memória até o fim de sua Duração. O sujeito não é visível para a Visão de Magia Ativa usando apenas a Mente • como não é um ser pensante, mas a Mente •• Atinção \"Olho da Mente\" mostra-o como uma projeção astral fragmentária enquanto o feitiço está ativo. Até que a duração do feitiço acabe, a memória pode ser acessada usando \"Leia as Profundidades\" lançadas com o objeto como seu sujeito ou com outros poderes de leitura de memória. Feitiços e poderes sobrenaturais que trabalham em pensamentos de nível superficial falham, pois o objeto não tem nenhum.",
    "sourceId": "mta-pentacle",
    "source": "Tome of the Pentacle",
    "page": 20
  },
  {
    "id": "mta-pentacle:read-history",
    "name": "Ler o Histórico",
    "originalName": "Read History",
    "requirements": {
      "Time": 1
    },
    "practice": "Sabendo",
    "primaryFactor": "Potência",
    "withstand": "",
    "roteSkills": [
      "Investigação",
      "Ocultismo",
      "Empatia"
    ],
    "description": "Normalmente lançado em preparação antes de \"Postcognition\" ou magia semelhante, este feitiço básico avalia a linha do tempo do sujeito, revelando sua idade exata. Isso é revelado como o comprimento da linha do tempo que o sujeito experimentou no Mundo Caído, não uma data, o que significa que os sujeitos que viajaram no tempo podem produzir resultados confusos. O lançador também pode buscar o tempo decorrido desde um evento especificado em que o sujeito estava presente, caso em que o feitiço se torna resistido pela simpatia temporal do sujeito a esse evento.",
    "sourceId": "mta-pentacle",
    "source": "Tome of the Pentacle",
    "page": 20
  },
  {
    "id": "mta-pentacle:lacuna",
    "name": "Lacuna",
    "originalName": "Lacuna",
    "requirements": {
      "Time": 4
    },
    "practice": "Desvendando",
    "primaryFactor": "Potência",
    "withstand": "Compaixão temporal (Conexão)",
    "roteSkills": [
      "Acadêmicos",
      "Ocultismo",
      "Subterfúgio"
    ],
    "description": "O mago agarra a simpatia temporal do sujeito em um ponto desejado e o destrói, criando uma lacuna e impedindo para sempre o uso da simpatia temporal para acessar qualquer coisa além dela. O feitiço é resistido pelo nível de conexão do ponto que agora será a lacuna, e o efeito é a duração. Memórias de Partilha Como adição às opções de Trincheira listadas para \"Leia as Profundidades\" (Mage, p. 162), para +1 Alcançar um mago pode copiar uma de suas próprias memórias ou uma de um segundo sujeito para a mente do primeiro sujeito sem escondê-la como uma das próprias do sujeito ou alterar as suas existentes. O resultado não é natural para o sujeito e é obviamente mágico quando lançado em um Sleeper. Historiadores do Pentacle da linha do tempo dividem a história humana em três épocas amplas, ou Yuga, dependendo da existência do diamante ou Pentacle, e subdividem aqueles em 12 idades ou períodos principais, com 11 eventos históricos que marcam as mudanças entre eles. As idades são termos acadêmicos aplicados com retrospectiva — ninguém acordou em 1101 e declarou que agora viviam na Era Dracônica, mas em 1150 o Diamante reconheceu a diferença. Da mesma forma, os eventos utilizados como pontos marcadores entre as idades não são sem controvérsia e discordância entre especialistas, alguns tanto que as datas alternadas são utilizadas por diffe",
    "sourceId": "mta-pentacle",
    "source": "Tome of the Pentacle",
    "page": 20
  }
];

const PRACTICE_TRANSLATIONS: Record<string,string> = {
  "Atraente":"Compelir", "Compelling":"Compelir", "Sabendo":"Conhecer", "Knowing":"Conhecer",
  "Revelação":"Revelar", "Unveiling":"Revelar", "Véu":"Velar", "Veiling":"Velar",
  "Decisão":"Governar", "Governação":"Governar", "Ruling":"Governar", "Blindagem":"Proteger", "Shielding":"Proteger",
  "Tecelagem":"Tecer", "Weaving":"Tecer", "Aperfeiçoando":"Aperfeiçoar", "Perfecting":"Aperfeiçoar",
  "Desgastando":"Enfraquecer", "Fraying":"Enfraquecer", "Desvendando":"Desmantelar", "Unraveling":"Desmantelar",
  "Padronização":"Padronizar", "Patterning":"Padronizar", "Fazendo":"Criar", "Making":"Criar", "Desfazendo":"Destruir", "Unmaking":"Destruir"
};
const TRAIT_TRANSLATIONS: Record<string,string> = {
  Academics:"Erudição", AnimalKen:"Empatia com Animais", Athletics:"Atletismo", Brawl:"Briga", Crafts:"Ofícios", Drive:"Condução", Firearms:"Armas de Fogo", Investigation:"Investigação", Larceny:"Furto", Medicine:"Medicina", Occult:"Ocultismo", Persuasion:"Persuasão", Politics:"Política", Science:"Ciência", Socialize:"Socialização", Stealth:"Furtividade", Streetwise:"Manha", Subterfuge:"Subterfúgio", Survival:"Sobrevivência", Weaponry:"Armas Brancas", Expression:"Expressão", Empathy:"Empatia", Intimidation:"Intimidação", Perseverança:"Perseverança", Composure:"Compostura", Stamina:"Vigor"
};
export const SPELL_NAME_CORRECTIONS: Record<string,{originalName:string;name:string}> = {
  "Initiate of Death Ectoplasmic Shaping": {originalName:"Ectoplasmic Shaping",name:"Moldagem Ectoplásmica"},
  "Apprentice of Death Corpse Mask": {originalName:"Corpse Mask",name:"Máscara de Cadáver"},
  "Disciple of Death Cold Snap": {originalName:"Cold Snap",name:"Onda de Frio"},
  "Adept of Death Enervation": {originalName:"Enervation",name:"Enervação"},
  "Master of Death Create Anchor": {originalName:"Create Anchor",name:"Criar Âncora"},
  "Initiate of Fate Interconnections": {originalName:"Interconnections",name:"Interconexões"},
  "Apprentice of Fate Exceptional Luck": {originalName:"Exceptional Luck",name:"Sorte Excepcional"},
  "Disciple of Fate Grave Misfortune": {originalName:"Grave Misfortune",name:"Grave Infortúnio"},
  "Adept of Fate Atonement": {originalName:"Atonement",name:"Expiação"},
  "Master of Fate Forge Destiny": {originalName:"Forge Destiny",name:"Forjar Destino"},
  "Initiate of Forces Influence Electricity": {originalName:"Influence Electricity",name:"Influenciar Eletricidade"},
  "Apprentice of Forces Control Electricity": {originalName:"Control Electricity",name:"Controlar Eletricidade"},
  "Disciple of Forces Call Lightning": {originalName:"Call Lightning",name:"Invocar Relâmpago"},
  "Adept of Forces Electromagnetic Pulse": {originalName:"Electromagnetic Pulse",name:"Pulso Eletromagnético"},
  "Master of Forces Adverse Weather": {originalName:"Adverse Weather",name:"Clima Adverso"},
  "Apprentice of Life Body Control": {originalName:"Body Control",name:"Controle Corporal"},
  "Disciple of Life Bruise Flesh": {originalName:"Bruise Flesh",name:"Ferir Carne"},
  "Master of Life Create Life": {originalName:"Create Life",name:"Criar Vida"},
  "Initiate of Matter Craftsman's Eye": {originalName:"Craftsmen's Eye",name:"Olho do Artesão"},
  "Apprentice of Matter Alchemist's Touch": {originalName:"Alchemist's Touch",name:"Toque do Alquimista"},
  "Disciple of Matter Aegis": {originalName:"Aegis",name:"Égide"},
  "Adept of Matter Ghostwall": {originalName:"Ghostwall",name:"Muro Fantasma"},
  "Master of Matter Annihilate Matter": {originalName:"Annihilate Matter",name:"Aniquilar Matéria"},
  "Initiate of Mind Know Nature": {originalName:"Know Nature",name:"Conhecer Natureza"},
  "Apprentice of Mind Alter Mental Pattern": {originalName:"Alter Mental Pattern",name:"Alterar Padrão Mental"},
  "Disciple of Mind Augment Mind": {originalName:"Augment Mind",name:"Ampliar Mente"},
  "Adept of Mind Gain Skill": {originalName:"Gain Skill",name:"Adquirir Perícia"},
  "Master of Mind Amorality": {originalName:"Amorality",name:"Amoralidade"},
  "Initiate of Prime Dispel Magic": {originalName:"Dispel Magic",name:"Dissipar Magia"},
  "Apprentice of Prime As Above, So Below": {originalName:"As Above, So Below",name:"Assim Acima, Assim Abaixo"},
  "Disciple of Prime Aetheric Winds": {originalName:"Aetheric Winds",name:"Ventos Etéreos"},
  "Adept of Prime Apocalypse": {originalName:"Apocalypse",name:"Apocalipse"},
  "Master of Prime Blasphemy": {originalName:"Blasphemy",name:"Blasfêmia"},
  "Initiate of Space Correspondence": {originalName:"Correspondence",name:"Correspondência"},
  "Apprentice of Space Borrow Threads": {originalName:"Borrow Threads",name:"Tomar Fios Emprestados"},
  "Disciple of Space Ban": {originalName:"Ban",name:"Interdição"},
  "Adept of Space Alter Direction": {originalName:"Alter Direction",name:"Alterar Direção"},
  "Master of Space Create Sympathy": {originalName:"Create Sympathy",name:"Criar Simpatia"},
  "Initiate of Spirit Coaxing the Spirits": {originalName:"Coaxing the Spirits",name:"Persuadir os Espíritos"},
  "Apprentice of Spirit Cap the Well": {originalName:"Cap the Well",name:"Tampar o Poço"},
  "Disciple of Spirit Bolster Spirit": {originalName:"Bolster Spirit",name:"Fortalecer Espírito"},
  "Adept of Spirit Banishment": {originalName:"Banishment",name:"Banimento"},
  "Master of Spirit Annihilate Spirit": {originalName:"Annihilate Spirit",name:"Aniquilar Espírito"},
  "Initiate of Time Divination": {originalName:"Divination",name:"Adivinhação"},
  "Apprentice of Time Choose the Thread": {originalName:"Choose the Thread",name:"Escolher o Fio"},
  "Disciple of Time Acceleration": {originalName:"Acceleration",name:"Aceleração"},
  "Adept of Time Present as Past": {originalName:"Present as Past",name:"Presente como Passado"},
  "Master of Time Blink of an Eye": {originalName:"Blink of an Eye",name:"Num Piscar de Olhos"},
};
for (const spell of SPELLS) {
  const corrected=SPELL_NAME_CORRECTIONS[spell.originalName];
  if(corrected){spell.originalName=corrected.originalName;spell.name=corrected.name;}
  spell.practice=PRACTICE_TRANSLATIONS[spell.practice]??spell.practice;
  spell.roteSkills=spell.roteSkills.map(skill=>TRAIT_TRANSLATIONS[skill.replace(/\s/g,"")]??TRAIT_TRANSLATIONS[skill]??skill);
  spell.withstand=spell.withstand.split(/\s*\+\s*/).map(trait=>TRAIT_TRANSLATIONS[trait]??trait).join(" + ");
}
