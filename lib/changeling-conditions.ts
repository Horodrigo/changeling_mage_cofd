export type ChangelingCondition = {
  id: string;
  name: string;
  originalName: string;
  category: "Mental" | "Physical" | "Física" | "Social" | "Supernatural" | "Sobrenatural" | "Changeling";
  description: string;
  penalty?: string;
  resolution?: string;
  beat?: string;
  persistent?: boolean;
  source: string;
  sourceCode: string;
  page: number;
};

type PortugueseConditionPresentation = Partial<Pick<ChangelingCondition, "name" | "category" | "description" | "penalty" | "resolution" | "beat">>;

// Canonical rules data is English-first. Portuguese copy is presentation-only
// and remains untouched pending its own editorial pass.
export const CHANGELING_CONDITIONS: ChangelingCondition[] = [
  {
    "id": "contemptuous",
    "name": "Contemptuous",
    "originalName": "Contemptuous",
    "category": "Social",
    "description": "You cannot stand a specified rival and enjoy opportunities to work against them.",
    "penalty": "Gain +2 on rolls that adversely affect the specified character. Their Social maneuvering treats their impression one level lower, to Hostile. Multiple instances may name different rivals.",
    "resolution": "Harm the rival in a way that puts you or your allies in danger.",
    "source": "Book of Courts",
    "sourceCode": "BoC",
    "page": 112
  },
  {
    "id": "amnesia",
    "name": "Amnesia",
    "originalName": "Amnesia",
    "category": "Mental",
    "description": "An important part of the character's memory is missing, creating complications when forgotten people, enemies, or obligations return.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 288,
    "resolution": "Regain the missing memories and learn the truth; depending on the circumstances, this may constitute a breaking point.",
    "beat": "A forgotten problem, such as an arrest warrant or old enemy, resurfaces."
  },
  {
    "id": "broken",
    "name": "Broken",
    "originalName": "Broken",
    "category": "Mental",
    "description": "The character has lost the ability to withstand emotional pressure and retreats from confrontation.",
    "penalty": "−2 to Social and Resolve rolls; −5 to Intimidation.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 288,
    "resolution": "Gain or lose a dot of Integrity, achieve an exceptional success on a breaking point, increase maximum Clarity, or achieve an exceptional success while contesting a fae power.",
    "beat": "Back down from a confrontation or fail a roll because of this Condition."
  },
  {
    "id": "deprived",
    "name": "Deprived",
    "originalName": "Deprived",
    "category": "Mental",
    "description": "Withdrawal from an addiction prevents the character from concentrating or controlling themself.",
    "penalty": "−1 die to Stamina, Resolve, and Composure pools.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 288,
    "resolution": "Indulge the addiction; if the Condition came from reaching Glamour 0, regain any Glamour instead."
  },
  {
    "id": "dissociation",
    "name": "Dissociation",
    "originalName": "Dissociation",
    "category": "Mental",
    "description": "Reality feels distant, and the changeling experiences their own actions as a passenger in their body.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 336,
    "resolution": "Choose to fail a roll because the character cannot bring themself to care about its outcome."
  },
  {
    "id": "fixated",
    "name": "Fixated",
    "originalName": "Fixated",
    "category": "Mental",
    "description": "A single thought or command dominates the character's attention until it is fulfilled.",
    "penalty": "−2 to all actions until the command is fulfilled or the scene ends.",
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 150,
    "resolution": "Satisfy the command.",
    "beat": "Act against the character's Virtue to fulfill the fixation."
  },
  {
    "id": "fugue",
    "name": "Fugue",
    "originalName": "Fugue",
    "category": "Mental",
    "description": "Trauma causes blackouts; similar situations may give the Storyteller control of the character for a scene.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 289,
    "resolution": "Gain or lose a dot of Integrity, achieve an exceptional success on a breaking point, increase maximum Clarity, or achieve an exceptional success while contesting a fae power.",
    "beat": "Enter a fugue state as described by the Condition."
  },
  {
    "id": "guilty",
    "name": "Guilty",
    "originalName": "Guilty",
    "category": "Mental",
    "description": "Profound remorse leaves the character emotionally vulnerable.",
    "penalty": "−2 to Resolve or Composure when defending against Subterfuge, Empathy, or Intimidation.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 289,
    "resolution": "Confess the wrongdoing and make restitution."
  },
  {
    "id": "informed",
    "name": "Informed",
    "originalName": "Informed",
    "category": "Mental",
    "description": "Research provides decisive information about a subject. Resolve this Condition to turn a failure into a success, or a success into an exceptional success.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 289,
    "resolution": "Use the research to gain information on a relevant Skill roll."
  },
  {
    "id": "inspired",
    "name": "Inspired",
    "originalName": "Inspired",
    "category": "Mental",
    "description": "Inspiration guides the character's action. Resolve this Condition to achieve an exceptional success with three successes and recover Willpower.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 289,
    "resolution": "Spend the inspiration to spur a related action to greater success."
  },
  {
    "id": "lost",
    "name": "Lost",
    "originalName": "Lost",
    "category": "Mental",
    "description": "The character does not know where they are or how to reach their destination and must reorient before making progress.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 289,
    "resolution": "Abandon the destination or successfully navigate to it."
  },
  {
    "id": "madness",
    "name": "Madness",
    "originalName": "Madness",
    "category": "Mental",
    "description": "Supernatural horrors have fractured the character's grasp on reality; once per chapter, the Storyteller may impose a negative modifier.",
    "penalty": "Up to −(10 − current Clarity) on one Mental or Social roll, once per chapter.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 289,
    "resolution": "Gain or lose a dot of Integrity, achieve an exceptional success on a breaking point, increase maximum Clarity, or achieve an exceptional success while contesting a fae power.",
    "beat": "Fail a roll because of this Condition."
  },
  {
    "id": "oblivious",
    "name": "Oblivious",
    "originalName": "Oblivious",
    "category": "Mental",
    "description": "The character is distracted and processes none of their surroundings; all Perception rolls are reduced to a chance die.",
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 150,
    "resolution": "Be alerted by a loud noise or attacked."
  },
  {
    "id": "obsession",
    "name": "Obsession",
    "originalName": "Obsession",
    "category": "Mental",
    "description": "An obsession dominates the character's attention and favors only actions directly related to it.",
    "penalty": "9-again while pursuing the obsession; lose 10-again on unrelated actions.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 290,
    "resolution": "Shed or purge the fixation.",
    "beat": "Fail to fulfill an obligation because of pursuing the obsession."
  },
  {
    "id": "reckless",
    "name": "Reckless",
    "originalName": "Reckless",
    "category": "Mental",
    "description": "The character ignores consequences and seeks danger for the thrill of acting.",
    "penalty": "−2 to Perception and other Composure rolls made to notice something.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 344,
    "resolution": "The character or an ally suffers harm or a major setback because of an ill-considered risk the character took."
  },
  {
    "id": "shaken",
    "name": "Shaken",
    "originalName": "Shaken",
    "category": "Mental",
    "description": "Severe fear interferes with the character's actions. The player may choose to fail an action impaired by that fear to resolve the Condition.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 290,
    "resolution": "Give in to the fear and choose to fail a relevant roll."
  },
  {
    "id": "sleepwalking",
    "name": "Sleepwalking",
    "originalName": "Sleepwalking",
    "category": "Mental",
    "description": "Dream and waking blur together, causing lost time, false memories of completed tasks, and neglected obligations.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 344,
    "resolution": "Achieve an exceptional success on an oneiromancy roll or during an extended action.",
    "beat": "Fail to complete an obligation because the character believed it was already done."
  },
  {
    "id": "spooked",
    "name": "Spooked",
    "originalName": "Spooked",
    "category": "Mental",
    "description": "Contact with the supernatural fascinates and frightens the character until they complicate the situation because of it.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 291,
    "resolution": "Let fear or fascination cause an action that hinders the group or complicates the situation."
  },
  {
    "id": "steadfast",
    "name": "Steadfast",
    "originalName": "Steadfast",
    "category": "Mental",
    "description": "Resolve this Condition after failing an action to convert that result into a single success.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 291,
    "resolution": "Let the character's confidence carry the failed action through, applying the Condition's benefit."
  },
  {
    "id": "stoic",
    "name": "Stoic",
    "originalName": "Stoic",
    "category": "Mental",
    "description": "The character shuts down emotionally, concealing trauma while blocking Clarity healing and sincere expression.",
    "penalty": "+2 to Subterfuge rolls to conceal emotions; no untrained Subterfuge penalty; −2 to Hedgespinning; cannot heal Clarity or spend Willpower on actions that reveal true feelings.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 345,
    "resolution": "Choose to fail a roll resisting Empathy or a supernatural effect that reads emotions or mental state, or enact a paradigm shift while Hedgespinning."
  },
  {
    "id": "swooned",
    "name": "Swooned",
    "originalName": "Swooned",
    "category": "Mental",
    "description": "Attraction to a specified person makes the character vulnerable to influence and reluctant to harm them.",
    "penalty": "−2 to actions that would harm the person; that person gains +2 to Social rolls against the character.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 291,
    "resolution": "Do something for the love interest that puts the character in danger, or choose to fail a roll to resist that person's Social action."
  },
  {
    "id": "withdrawn",
    "name": "Withdrawn",
    "originalName": "Withdrawn",
    "category": "Mental",
    "description": "Doubt and insecurity drive the character to seek isolation and safety.",
    "penalty": "−2 to all rolls that require interacting with other people.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 346,
    "resolution": "Regain Willpower through the character's Thread."
  },
  {
    "id": "arm-disability",
    "name": "Arm Disability",
    "originalName": "Arm Disability",
    "category": "Physical",
    "description": "One or both arms do not function without appropriate treatment or assistive technology.",
    "penalty": "One arm: off-hand penalty; both arms: chance die for manual dexterity and −3 to other Physical actions.",
    "persistent": true,
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 57,
    "resolution": "Receive appropriate medical or supernatural treatment; a suitable prosthesis can treat the Condition.",
    "beat": "The Condition prevents an action or causes a penalized roll to fail."
  },
  {
    "id": "blind",
    "name": "Blind",
    "originalName": "Blind",
    "category": "Physical",
    "description": "The character cannot see and must replace that sense or contend with total darkness.",
    "penalty": "Chance die on actions that require sight; −3 when another sense can substitute.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 288,
    "resolution": "Regain sight.",
    "beat": "Encounter a limitation or difficulty caused by blindness."
  },
  {
    "id": "chronic-agony",
    "name": "Chronic Agony",
    "originalName": "Chronic Agony",
    "category": "Physical",
    "description": "Disabling pain returns after stress or physical exertion and inflicts the Stunned Tilt.",
    "penalty": "Stunned: lose the next action and Defense until the character can act again.",
    "persistent": true,
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 57,
    "resolution": "Receive appropriate medical or supernatural treatment; tailored painkillers may suppress an episode but can cause Addicted.",
    "beat": "Fail a roll penalized by the Condition or be prevented from acting."
  },
  {
    "id": "chronic-sickness",
    "name": "Chronic Sickness",
    "originalName": "Chronic Sickness",
    "category": "Physical",
    "description": "A disease or toxin persists and worsens during exertion and stress.",
    "penalty": "−1 to all actions, increasing by −1 every two turns to a maximum of −5.",
    "persistent": true,
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 57,
    "resolution": "Receive appropriate medical or supernatural treatment, or allow the sickness to fade when appropriate; medication may treat it.",
    "beat": "Fail a roll while in the throes of the sickness."
  },
  {
    "id": "deaf",
    "name": "Deaf",
    "originalName": "Deaf",
    "category": "Physical",
    "description": "Hearing in one or both ears is severely impaired.",
    "penalty": "One ear: −3 to Perception; both ears: chance die for auditory Perception and −2 in combat.",
    "persistent": true,
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 58,
    "resolution": "Receive appropriate medical or supernatural treatment; a hearing aid, cochlear implant, or similar device may assist.",
    "beat": "Fail a Perception roll because of deafness."
  },
  {
    "id": "disabled",
    "name": "Disabled",
    "originalName": "Disabled",
    "category": "Physical",
    "description": "The character cannot walk effectively without a wheelchair or another mobility aid.",
    "penalty": "Effective Speed 1; a manual wheelchair uses Strength, while a powered chair has Speed 3.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 288,
    "resolution": "Cure the disability through mundane or supernatural means.",
    "beat": "Limited mobility inconveniences the character or makes them slow to respond."
  },
  {
    "id": "fragile",
    "name": "Fragile",
    "originalName": "Fragile",
    "category": "Physical",
    "description": "Improvised or damaged equipment has lost integrity and may fall apart during use.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 102,
    "resolution": "The equipment falls apart. If this represented a plan, each involved player gains one Beat."
  },
  {
    "id": "leg-disability",
    "name": "Leg Disability",
    "originalName": "Leg Disability",
    "category": "Physical",
    "description": "One leg does not function properly without appropriate treatment or a prosthesis.",
    "penalty": "Half Speed and −2 to Physical actions involving movement.",
    "persistent": true,
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 58,
    "resolution": "Receive appropriate medical or supernatural treatment; a suitable prosthesis can treat the Condition.",
    "beat": "Fail a penalized Physical roll or suffer another disadvantage because of the Condition."
  },
  {
    "id": "lethargic",
    "name": "Lethargic",
    "originalName": "Lethargic",
    "category": "Physical",
    "description": "Extreme exhaustion weighs on the character until they get a full night's sleep.",
    "penalty": "Cannot spend Willpower; cumulative −1 to all actions for every six hours without sleep.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 342,
    "resolution": "Sleep for a full night."
  },
  {
    "id": "mute",
    "name": "Mute",
    "originalName": "Mute",
    "category": "Physical",
    "description": "The character cannot speak and must communicate through writing, gestures, or sign language.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 290,
    "resolution": "Regain the character's voice through mundane or supernatural means.",
    "beat": "Suffer a communication limitation that heightens immediate danger."
  },
  {
    "id": "numb",
    "name": "Numb",
    "originalName": "Numb",
    "category": "Physical",
    "description": "Trauma leaves the body numb and mundane actions imprecise, while magic seems to ease the symptoms.",
    "penalty": "−2 to all mundane Physical actions.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 343,
    "resolution": "Achieve an exceptional success on a mundane Physical action, spend a week without magical contact, or regain all Willpower through the character's Needle.",
    "beat": "Fail a mundane Physical action."
  },
  {
    "id": "volatile",
    "name": "Volatile",
    "originalName": "Volatile",
    "category": "Physical",
    "description": "A piece of equipment or a plan is on the verge of catastrophic failure.",
    "penalty": "Any failure while using the equipment becomes a dramatic failure.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 102,
    "resolution": "Suffer a dramatic failure while using the equipment. If this represented a plan, each involved player gains one Beat."
  },
  {
    "id": "bonded",
    "name": "Bonded",
    "originalName": "Bonded",
    "category": "Social",
    "description": "A deep bond with an animal strengthens influence, trust, and resistance to fear.",
    "penalty": "+2 to influence the animal; it may use the character's Animal Ken against fear or coercion.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 288,
    "resolution": "The bonded animal dies."
  },
  {
    "id": "connected",
    "name": "Connected",
    "originalName": "Connected",
    "category": "Social",
    "description": "The character has established useful relationships within a specified group.",
    "penalty": "+2 to rolls involving the group; resolve to gain an automatic exceptional success when influencing it.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 288,
    "resolution": "Lose membership or standing with the specified group.",
    "beat": "The group asks for a favor that inconveniences the character."
  },
  {
    "id": "embarrassing-secret",
    "name": "Embarrassing Secret",
    "originalName": "Embarrassing Secret",
    "category": "Social",
    "description": "A secret could cause ostracism, blackmail, or legal consequences if revealed.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 289,
    "resolution": "The secret becomes public, or the character ensures it can never come to light."
  },
  {
    "id": "hunted",
    "name": "Hunted",
    "originalName": "Hunted",
    "category": "Social",
    "description": "A serious enemy pursues the character to harm or torment them.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 342,
    "resolution": "Stop the persecutors through direct action or by denying them access; freeing a Huntsman from the True Fae also qualifies.",
    "beat": "The persecutors find the character."
  },
  {
    "id": "leveraged",
    "name": "Leveraged",
    "originalName": "Leveraged",
    "category": "Social",
    "description": "Someone holds enough leverage, blackmail material, or influence to demand a favor without resistance.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 289,
    "resolution": "Comply with the request, or gain equivalent leverage over the specified character."
  },
  {
    "id": "notoriety",
    "name": "Notoriety",
    "originalName": "Notoriety",
    "category": "Social",
    "description": "A bad reputation causes revulsion and ostracism among those who know it.",
    "penalty": "−2 to Social rolls with anyone who knows the reputation; add one Door in Social maneuvering.",
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 290,
    "resolution": "Debunk the story or clear the character's name."
  },
  {
    "id": "reluctant-aggressor",
    "name": "Reluctant Aggressor",
    "originalName": "Reluctant Aggressor",
    "category": "Social",
    "description": "The character was compelled to harm someone against their will and must spend 1 Willpower each turn to attack that victim.",
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 150,
    "resolution": "Avoid the victim and their associates for a chapter, or have the victim become the aggressor against the character or their allies. Fading after a chapter grants no Beat."
  },
  {
    "id": "surveilled",
    "name": "Surveilled",
    "originalName": "Surveilled",
    "category": "Social",
    "description": "A person or organization monitors the character's movements and gathers information. The Storyteller rolls the source's successes each chapter and resolves the Condition at ten accumulated successes.",
    "source": "Hurt Locker",
    "sourceCode": "HL",
    "page": 150,
    "resolution": "The Storyteller's surveillance pool reaches ten successes, or the character exposes or actively stops the surveillance."
  },
  {
    "id": "goblin-queen",
    "name": "Goblin Queen",
    "originalName": "Goblin Queen",
    "category": "Supernatural",
    "description": "A fragmented goblin nature binds the character to the Hedge and attracts hobgoblin followers.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 339,
    "resolution": "Abandon a human child to inherit the Condition; return to the character's former nature; or work off five Goblin Debt and regain Hedge Denizen.",
    "beat": "Collect Goblin Debt from another character through a sold Contract or another hobgoblin bargain."
  },
  {
    "id": "hedge-denizen",
    "name": "Hedge Denizen",
    "originalName": "Hedge Denizen",
    "category": "Supernatural",
    "description": "Debts and bargains have transformed the character into a goblin, changing their Contracts, Court, and relationship with the Hedge.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 340,
    "resolution": "Work off at least one Goblin Debt, perform the creditor's task, and heal Clarity to return to the former self; or suffer qualifying Clarity damage and lose a Touchstone to become a Goblin Queen.",
    "beat": "Work off Goblin Debt but decline or fail to complete the full return to the former self."
  },
  {
    "id": "soulless",
    "name": "Soulless",
    "originalName": "Soulless",
    "category": "Supernatural",
    "description": "The loss of the soul slowly erodes will, identity, and the ability to resist degeneration.",
    "persistent": true,
    "source": "Chronicles of Darkness",
    "sourceCode": "CofD",
    "page": 290,
    "resolution": "Regain a soul.",
    "beat": "Lose Integrity or Clarity because the character indulged their Vice or equivalent anchor."
  },
  {
    "id": "ravaged",
    "name": "Ravaged",
    "originalName": "Ravaged",
    "category": "Supernatural",
    "description": "Faerie predation has destroyed dreams or emotions, leaving the character empty and unable to rest.",
    "penalty": "−2 to all rolls; cannot recover Willpower through sleep.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 344,
    "resolution": "Regain full Willpower."
  },
  {
    "id": "behind-your-eyes",
    "name": "Behind Your Eyes",
    "originalName": "Behind Your Eyes",
    "category": "Changeling",
    "description": "A Hedge ghost, hobgoblin, or True Fae shares the changeling's senses and may uncover their secrets.",
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 140,
    "resolution": "Regain Clarity or reveal an important secret to the visitor. If severe Clarity damage caused it, revealing a secret is the only resolution."
  },
  {
    "id": "comatose",
    "name": "Comatose",
    "originalName": "Comatose",
    "category": "Changeling",
    "description": "At Clarity zero, the changeling retreats into a continuous dream they believe is reality.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 334,
    "resolution": "Regain Clarity, or realize the state is a dream and awaken. If caused by severe Clarity damage, another character must enter the dream and help the changeling recognize it."
  },
  {
    "id": "cursed",
    "name": "Cursed",
    "originalName": "Cursed",
    "category": "Changeling",
    "description": "A curse imposed by another changeling persists while the victim maintains its specified routine or requirement.",
    "persistent": true,
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 140,
    "resolution": "The changeling who placed the curse fails to maintain its required state or perform its specified action.",
    "beat": "Suffer a significant setback directly because of the curse."
  },
  {
    "id": "deep-kenning",
    "name": "Deep Kenning",
    "originalName": "Deep Kenning",
    "category": "Changeling",
    "description": "Restored Clarity grants a flash of insight into nearby supernatural phenomena.",
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 140,
    "resolution": "Shed the Condition to ken nearby supernatural phenomena with successes equal to half maximum Clarity and allow a Clash of Wills against magical concealment."
  },
  {
    "id": "dream-assailant",
    "name": "Dream Assailant",
    "originalName": "Dream Assailant",
    "category": "Changeling",
    "description": "Excessive alterations have made the dream's eidolons hostile and resistant to further changes.",
    "penalty": "−5 to peaceful interaction or remaining unnoticed; paradigm shifts cost +2 successes.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 336,
    "resolution": "Leave the dream for one week; reintegrate through meaningful actions equal to the dreamer's Resolve without shifting, downgrading to Dream Intruder; or meaningfully influence an important eidolon, dream self, or prop toward the desired waking change."
  },
  {
    "id": "dream-infiltrator",
    "name": "Dream Infiltrator",
    "originalName": "Dream Infiltrator",
    "category": "Changeling",
    "description": "A significant alteration has made the dream's eidolons suspicious of the character.",
    "penalty": "−2 to peaceful interaction; −3 to remain unnoticed; subtle shifts cost +1 success.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 337,
    "resolution": "Upgrade to another Shift Condition; leave until the dreamer wakes and sleeps again; reintegrate through meaningful actions equal to Resolve without shifting; or meaningfully influence an important eidolon, dream self, or prop toward the desired waking change."
  },
  {
    "id": "dream-intruder",
    "name": "Dream Intruder",
    "originalName": "Dream Intruder",
    "category": "Changeling",
    "description": "Multiple alterations have made the dream and its eidolons uncomfortable with the character's presence.",
    "penalty": "−3 to peaceful interaction and −4 to remain unnoticed.",
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 338,
    "resolution": "Upgrade to another Shift Condition; leave until the dreamer completes two wake-and-sleep cycles; reintegrate through meaningful actions equal to Resolve without shifting, downgrading to Dream Infiltrator; or meaningfully influence an important eidolon, dream self, or prop toward the desired waking change."
  },
  {
    "id": "egomaniac",
    "name": "Egomaniac",
    "originalName": "Egomaniac",
    "category": "Changeling",
    "description": "Without Clarity, the changeling imitates the boundless ego of the True Fae and ignores other people's needs.",
    "penalty": "Failures on Social rolls become dramatic failures without granting a Beat.",
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 141,
    "resolution": "Regain Clarity or seriously harm an ally through these actions. If severe Clarity damage caused it, harming an ally is the only resolution."
  },
  {
    "id": "enchanted-obligation",
    "name": "Enchanted Obligation",
    "originalName": "Enchanted Obligation",
    "category": "Changeling",
    "description": "An enchanted bargain protects the changeling while granting a mortal sight through the Mask and access to fae assistance.",
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 141,
    "resolution": "The mortal completes or escapes the bargained task, or either party fails to uphold the bargain; both players gain a Beat."
  },
  {
    "id": "glamour-addicted",
    "name": "Glamour Addicted",
    "originalName": "Glamour Addicted",
    "category": "Changeling",
    "description": "The character's body deteriorates when they do not regularly consume enough Glamour.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 339,
    "resolution": "Achieve an exceptional success while harvesting Glamour.",
    "beat": "Take damage because the character cannot harvest Glamour."
  },
  {
    "id": "hexed",
    "name": "Hexed",
    "originalName": "Hexed",
    "category": "Changeling",
    "description": "A changeling has imposed a temporary inconvenience that ends only when the specified action or mission is completed.",
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 141,
    "resolution": "Take the action specified when the hex was placed."
  },
  {
    "id": "icon-shard",
    "name": "Icon Shard",
    "originalName": "Icon Shard",
    "category": "Changeling",
    "description": "A broken oath has given malicious life to a fragment of the Icon, which now torments the changeling.",
    "persistent": true,
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 141,
    "resolution": "Kill the Icon shard or make amends for breaking the word, fulfilling a vow or reconciling the oath with its participants or the Wyrd.",
    "beat": "The shard harms the changeling or someone she values, or prevents Willpower recovery through Needle or Thread."
  },
  {
    "id": "indebted",
    "name": "Indebted",
    "originalName": "Indebted",
    "category": "Changeling",
    "description": "The character owes a service to a fae being and may repay it by accepting damage, a detrimental Condition, or a Personal Tilt.",
    "persistent": true,
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 142,
    "resolution": "Repay the debt by accepting the entire harm meant for the debtor; a Persistent debt requires a major service.",
    "beat": "While Persistent, fulfill the debtor's request or demand without rolling to resist."
  },
  {
    "id": "kithseeker",
    "name": "Kithseeker",
    "originalName": "Kithseeker",
    "category": "Changeling",
    "description": "The changeling must face five trials in the Hedge to find a Kith matching the call of their soul.",
    "persistent": true,
    "source": "Kith and Kin",
    "sourceCode": "Kith",
    "page": 142,
    "resolution": "Overcome five trials and gain a new Kith.",
    "beat": "Endure significant adversity or learn something new about yourself during a trial."
  },
  {
    "id": "oathbreaker",
    "name": "Oathbreaker",
    "originalName": "Oathbreaker",
    "category": "Changeling",
    "description": "The Wyrd marks an oathbreaker and inspires distrust among changelings.",
    "penalty": "−1 to Social actions with changelings; cannot seal statements with Glamour.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 343,
    "resolution": "Sincerely seek restitution from every oath participant, complete the task they assign, and earn forgiveness from the Wyrd."
  },
  {
    "id": "obliged",
    "name": "Obliged",
    "originalName": "Obliged",
    "category": "Changeling",
    "description": "A service bargain with a mortal protects the changeling from Huntsmen and Wyrd-bound pursuers.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 343,
    "resolution": "Either party breaks the bargain by failing its terms, ending all protections it provided."
  },
  {
    "id": "hedge-addiction",
    "name": "Hedge Addiction",
    "originalName": "Hedge Addiction",
    "category": "Changeling",
    "description": "The Hedge calls to and tempts the character, making it difficult to remain away from its paths and dangers.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 340,
    "resolution": "Avoid entering the Hedge for a full story; entering it again later restores this Condition.",
    "beat": "Enter the Hedge, whether willingly or after failing to resist its pull."
  },
  {
    "id": "arcadian-dreams",
    "name": "Arcadian Dreams",
    "originalName": "Arcadian Dreams",
    "category": "Changeling",
    "description": "Visions of a ward trapped in Arcadia distract the character but also reveal the ward's direction within the Hedge.",
    "penalty": "+1 to navigate the Hedge toward the ward; the player may choose to fail to represent the visions.",
    "persistent": true,
    "source": "Changeling the Lost",
    "sourceCode": "CTL 2e",
    "page": 333,
    "resolution": "Reunite with the promise-bound character, or learn immediately that they died before rescue.",
    "beat": "Choose to fail a roll because of distracting shared suffering or a reminder of the visions."
  }
];

const CONDITION_PRESENTATION_PT: Record<string, PortugueseConditionPresentation> = {
  "contemptuous": {
    "name": "Contemptuous",
    "category": "Social",
    "description": "You cannot stand a specified rival and enjoy opportunities to work against them.",
    "penalty": "Gain +2 on rolls that adversely affect the specified character. Their Social maneuvering treats their impression one level lower, to Hostile. Multiple instances may name different rivals.",
    "resolution": "Harm the rival in a way that puts you or your allies in danger."
  },
  "amnesia": {
    "name": "Amnésia",
    "category": "Mental",
    "description": "Uma parte importante da memória desapareceu, trazendo dificuldades quando pessoas, inimigos ou obrigações esquecidas retornam."
  },
  "broken": {
    "name": "Quebrado",
    "category": "Mental",
    "description": "O personagem perdeu a capacidade de enfrentar pressão emocional e recua diante de confrontos.",
    "penalty": "−2 em testes Sociais e com Perseverança; −5 em Intimidação."
  },
  "deprived": {
    "name": "Privado",
    "category": "Mental",
    "description": "A abstinência de um vício impede o personagem de se concentrar e se controlar.",
    "penalty": "−1 dado em paradas de Vigor, Perseverança e Compostura."
  },
  "dissociation": {
    "name": "Dissociação",
    "category": "Mental",
    "description": "A realidade parece distante e o changeling observa as próprias ações como um passageiro em seu corpo."
  },
  "fixated": {
    "name": "Fixado",
    "category": "Mental",
    "description": "Um único pensamento ou comando domina a atenção até ser cumprido.",
    "penalty": "−2 em todas as ações até cumprir o comando ou a cena terminar."
  },
  "fugue": {
    "name": "Fuga",
    "category": "Mental",
    "description": "Trauma provoca apagões; situações semelhantes podem entregar o controle do personagem ao Narrador por uma cena."
  },
  "guilty": {
    "name": "Culpado",
    "category": "Mental",
    "description": "Remorso profundo torna o personagem emocionalmente vulnerável.",
    "penalty": "−2 para defender-se com Perseverança ou Compostura contra Subterfúgio, Empatia ou Intimidação."
  },
  "informed": {
    "name": "Informado",
    "category": "Mental",
    "description": "Pesquisa fornece informação decisiva sobre um assunto; ao resolver, uma falha vira sucesso e um sucesso vira sucesso excepcional."
  },
  "inspired": {
    "name": "Inspirado",
    "category": "Mental",
    "description": "Uma inspiração guia a ação; ao resolver, três sucessos bastam para um sucesso excepcional e o personagem recupera Força de Vontade."
  },
  "lost": {
    "name": "Perdido",
    "category": "Mental",
    "description": "O personagem não sabe onde está nem como alcançar seu destino e precisa se orientar antes de progredir."
  },
  "madness": {
    "name": "Loucura",
    "category": "Mental",
    "description": "Horrores sobrenaturais romperam sua compreensão da realidade; o Narrador pode impor um modificador negativo uma vez por capítulo.",
    "penalty": "Até −(10 − Lucidez atual) em um teste Mental ou Social, uma vez por capítulo."
  },
  "oblivious": {
    "name": "Alheio",
    "category": "Mental",
    "description": "O personagem está ausente e deixa de perceber o que acontece ao redor.",
    "penalty": "−2 em testes de Percepção."
  },
  "obsession": {
    "name": "Obsessão",
    "category": "Mental",
    "description": "Uma obsessão domina a atenção e favorece apenas ações diretamente relacionadas a ela.",
    "penalty": "9-novamente ao perseguir a obsessão; perde 10-novamente em ações não relacionadas."
  },
  "reckless": {
    "name": "Imprudente",
    "category": "Mental",
    "description": "O personagem ignora consequências e procura riscos pelo prazer da ação.",
    "penalty": "−2 em Percepção e outros testes de Compostura para notar algo."
  },
  "shaken": {
    "name": "Abalado",
    "category": "Mental",
    "description": "Um medo severo interfere nas ações; o jogador pode optar por falhar numa ação prejudicada pelo medo para resolver a Condition."
  },
  "sleepwalking": {
    "name": "Sonambulismo",
    "category": "Mental",
    "description": "Sonho e vigília se confundem, causando tempo perdido, falsas lembranças de tarefas e obrigações não cumpridas."
  },
  "spooked": {
    "name": "Assombrado",
    "category": "Mental",
    "description": "O contato com o sobrenatural fascina e assusta até o personagem complicar a situação por causa disso."
  },
  "steadfast": {
    "name": "Resoluto",
    "category": "Mental",
    "description": "A determinação permite resolver a Condition após uma falha para transformar o resultado em um sucesso simples."
  },
  "stoic": {
    "name": "Estoico",
    "category": "Mental",
    "description": "O personagem fecha-se emocionalmente, ocultando traumas mas bloqueando cura de Lucidez e expressão sincera.",
    "penalty": "+2 em Subterfúgio para ocultar emoções; −2 em Hedgespinning; não cura Lucidez enquanto persistir."
  },
  "swooned": {
    "name": "Enamorado",
    "category": "Mental",
    "description": "A atração por uma pessoa torna o personagem vulnerável à influência e relutante em prejudicá-la.",
    "penalty": "−2 em ações que prejudiquem a pessoa; ela recebe +2 em testes Sociais contra o personagem."
  },
  "withdrawn": {
    "name": "Retraído",
    "category": "Mental",
    "description": "Dúvida e insegurança levam o personagem a buscar isolamento e segurança.",
    "penalty": "−2 em todos os testes que exijam interação com outras pessoas."
  },
  "arm-disability": {
    "name": "Deficiência no Braço",
    "category": "Física",
    "description": "Um ou ambos os braços não funcionam sem tratamento ou tecnologia assistiva apropriada.",
    "penalty": "Um braço: penalidade de mão inábil; ambos: dado de sorte em destreza manual e −3 em outras ações Físicas."
  },
  "blind": {
    "name": "Cego",
    "category": "Física",
    "description": "O personagem perdeu a visão e precisa substituir esse sentido ou lidar com a escuridão total.",
    "penalty": "Dado de sorte em ações que exigem visão; −3 quando outro sentido puder substituí-la."
  },
  "chronic-agony": {
    "name": "Agonia Crônica",
    "category": "Física",
    "description": "Dores incapacitantes retornam após estresse ou esforço físico e impõem os efeitos de Atordoado.",
    "penalty": "Atordoado: perde a próxima ação e a Defesa até voltar a agir."
  },
  "chronic-sickness": {
    "name": "Doença Crônica",
    "category": "Física",
    "description": "Doença ou toxina persiste e piora durante esforço e estresse.",
    "penalty": "−1 em todas as ações, aumentando em −1 a cada dois turnos, até −5."
  },
  "deaf": {
    "name": "Surdo",
    "category": "Física",
    "description": "A audição de um ou ambos os ouvidos está severamente comprometida.",
    "penalty": "Um ouvido: −3 em Percepção; ambos: dado de sorte em Percepção e −2 em combate."
  },
  "disabled": {
    "name": "Incapacitado",
    "category": "Física",
    "description": "O personagem não consegue caminhar de modo eficaz sem cadeira de rodas ou outro auxílio.",
    "penalty": "Deslocamento efetivo 1; cadeira manual usa Força, cadeira elétrica possui Deslocamento 3."
  },
  "fragile": {
    "name": "Frágil",
    "category": "Física",
    "description": "Equipamento improvisado ou danificado perde resistência e pode se desfazer durante o uso."
  },
  "leg-disability": {
    "name": "Deficiência na Perna",
    "category": "Física",
    "description": "Uma perna não funciona adequadamente sem tratamento ou prótese apropriada.",
    "penalty": "Metade do Deslocamento e −2 em ações Físicas relacionadas a movimento."
  },
  "lethargic": {
    "name": "Letárgico",
    "category": "Física",
    "description": "Exaustão extrema pesa sobre o personagem até que ele durma uma noite inteira.",
    "penalty": "Não pode gastar Força de Vontade; −1 cumulativo em todas as ações a cada seis horas sem dormir."
  },
  "mute": {
    "name": "Mudo",
    "category": "Física",
    "description": "O personagem não consegue falar e precisa se comunicar por escrita, gestos ou sinais."
  },
  "numb": {
    "name": "Entorpecido",
    "category": "Física",
    "description": "Trauma deixa o corpo dormente e torna ações mundanas imprecisas, enquanto a magia parece aliviar os sintomas.",
    "penalty": "−2 em todas as ações físicas mundanas."
  },
  "volatile": {
    "name": "Volátil",
    "category": "Física",
    "description": "Equipamento ou plano está prestes a falhar de modo catastrófico.",
    "penalty": "Qualquer falha ao usar o equipamento torna-se falha dramática."
  },
  "bonded": {
    "name": "Vinculado",
    "category": "Social",
    "description": "Um vínculo profundo com um animal fortalece influência, confiança e resistência ao medo.",
    "penalty": "+2 para influenciar o animal; ele pode usar Trato com Animais do personagem contra medo ou coerção."
  },
  "connected": {
    "name": "Conectado",
    "category": "Social",
    "description": "O personagem estabeleceu relações úteis dentro de um grupo específico.",
    "penalty": "+2 em testes relacionados ao grupo; pode resolver para obter um sucesso excepcional automático ao influenciá-lo."
  },
  "embarrassing-secret": {
    "name": "Segredo Constrangedor",
    "category": "Social",
    "description": "Um segredo pode provocar ostracismo, chantagem ou consequências legais caso se torne público."
  },
  "hunted": {
    "name": "Caçado",
    "category": "Social",
    "description": "Um inimigo sério persegue o personagem para feri-lo ou atormentá-lo."
  },
  "leveraged": {
    "name": "Coagido",
    "category": "Social",
    "description": "Alguém possui influência, chantagem ou vantagem suficiente para exigir um favor sem resistência."
  },
  "notoriety": {
    "name": "Notoriedade",
    "category": "Social",
    "description": "Má fama provoca repulsa e ostracismo entre aqueles que a conhecem.",
    "penalty": "−2 em testes Sociais com quem conhece a fama; uma Porta adicional em Manobra Social."
  },
  "reluctant-aggressor": {
    "name": "Agressor Relutante",
    "category": "Social",
    "description": "O personagem foi levado a ferir alguém contra sua vontade e hesita diante da vítima.",
    "penalty": "−2 em ataques contra a vítima designada."
  },
  "surveilled": {
    "name": "Vigiado",
    "category": "Social",
    "description": "Uma pessoa ou organização acompanha os movimentos do personagem e reúne informações sobre ele."
  },
  "goblin-queen": {
    "name": "Rainha Goblin",
    "category": "Sobrenatural",
    "description": "A natureza goblin fragmentada prende o personagem na Sebe e atrai seguidores hobgoblins."
  },
  "hedge-denizen": {
    "name": "Habitante da Sebe",
    "category": "Sobrenatural",
    "description": "Dívidas e pactos transformaram o personagem em goblin, mudando Contratos, Corte e sua relação com a Sebe."
  },
  "soulless": {
    "name": "Sem Alma",
    "category": "Sobrenatural",
    "description": "A perda da alma corrói lentamente a vontade, a identidade e a capacidade de resistir à degeneração."
  },
  "ravaged": {
    "name": "Devastado",
    "category": "Sobrenatural",
    "description": "Predação feérica destruiu sonhos ou emoções, deixando o personagem vazio e incapaz de descansar.",
    "penalty": "−2 em todos os testes; não recupera Força de Vontade dormindo."
  },
  "behind-your-eyes": {
    "name": "Atrás de Seus Olhos",
    "category": "Changeling",
    "description": "Um fantasma da Sebe, hobgoblin ou Fae Verdadeiro compartilha os sentidos do changeling e pode descobrir seus segredos."
  },
  "comatose": {
    "name": "Comatose",
    "category": "Changeling",
    "description": "Com Lucidez zero, o changeling recua para um sonho contínuo que acredita ser realidade."
  },
  "cursed": {
    "name": "Amaldiçoado",
    "category": "Changeling",
    "description": "Uma maldição imposta por outro changeling persiste enquanto ele mantiver a rotina ou exigência definida."
  },
  "deep-kenning": {
    "name": "Kenning Profundo",
    "category": "Changeling",
    "description": "Lucidez restaurada concede um lampejo de conhecimento sobre fenômenos sobrenaturais próximos."
  },
  "dream-assailant": {
    "name": "Agressor dos Sonhos",
    "category": "Changeling",
    "description": "Mudanças excessivas tornaram os eidolons hostis e resistentes a novas alterações do sonho.",
    "penalty": "−5 para interação pacífica ou agir despercebido; mudanças de paradigma custam +2 sucessos."
  },
  "dream-infiltrator": {
    "name": "Infiltrador dos Sonhos",
    "category": "Changeling",
    "description": "Uma mudança significativa tornou os eidolons desconfiados do personagem.",
    "penalty": "−2 para interação pacífica; −3 para agir despercebido; mudanças sutis custam +1 sucesso."
  },
  "dream-intruder": {
    "name": "Intruso dos Sonhos",
    "category": "Changeling",
    "description": "Múltiplas alterações deixaram o sonho e seus eidolons desconfortáveis com a presença do personagem.",
    "penalty": "−3 para interação pacífica e −4 para agir despercebido."
  },
  "egomaniac": {
    "name": "Egomaníaco",
    "category": "Changeling",
    "description": "Sem Lucidez, o changeling imita o ego ilimitado dos Fae Verdadeiros e ignora as necessidades alheias.",
    "penalty": "Falhas em testes Sociais tornam-se falhas dramáticas sem conceder Beat."
  },
  "enchanted-obligation": {
    "name": "Obrigação Encantada",
    "category": "Changeling",
    "description": "Uma barganha encantada protege o changeling enquanto concede ao mortal visão através da Máscara e acesso a sua ajuda feérica."
  },
  "glamour-addicted": {
    "name": "Viciado em Glamour",
    "category": "Changeling",
    "description": "O corpo definha quando o personagem não se alimenta regularmente de Glamour suficiente."
  },
  "hexed": {
    "name": "Enfeitiçado",
    "category": "Changeling",
    "description": "Um changeling impôs um inconveniente temporário que termina apenas quando a ação ou missão especificada é cumprida."
  },
  "icon-shard": {
    "name": "Fragmento de Ícone",
    "category": "Changeling",
    "description": "Um juramento rompido deu vida maliciosa a um fragmento do Ícone, que passa a atormentar o changeling."
  },
  "indebted": {
    "name": "Endividado",
    "category": "Changeling",
    "description": "O personagem deve um serviço a um ser feérico e pode pagar aceitando dano, uma Condition prejudicial ou uma Inclinação pessoal."
  },
  "kithseeker": {
    "name": "Buscador de Fratria",
    "category": "Changeling",
    "description": "O changeling enfrenta cinco provações na Sebe para encontrar uma Fratria que corresponda ao chamado de sua alma."
  },
  "oathbreaker": {
    "name": "Quebrador de Juramento",
    "category": "Changeling",
    "description": "O Wyrd marca quem violou um juramento e desperta desconfiança entre os changelings.",
    "penalty": "−1 em ações Sociais com changelings; não pode selar declarações com Glamour."
  },
  "obliged": {
    "name": "Obrigado",
    "category": "Changeling",
    "description": "Uma barganha de serviço com um mortal protege o changeling contra Caçadores e perseguidores vinculados ao Wyrd."
  },
  "hedge-addiction": {
    "name": "Vício na Sebe",
    "category": "Changeling",
    "description": "A Sebe chama e tenta o personagem, tornando difícil permanecer longe de seus caminhos e perigos."
  },
  "arcadian-dreams": {
    "name": "Sonhos Arcadianos",
    "category": "Changeling",
    "description": "Visões do protegido preso em Arcádia distraem o personagem, mas também indicam sua direção dentro da Sebe.",
    "penalty": "+1 para navegar pela Sebe em direção ao protegido; o jogador pode escolher falhar para representar as visões."
  }
};

export function findChangelingCondition(id: string) {
  return CHANGELING_CONDITIONS.find((condition) => condition.id === id);
}

export function changelingConditionPresentation(condition: ChangelingCondition, locale: "pt-BR" | "en-US"): ChangelingCondition {
  if (locale === "en-US") return condition;
  return { ...condition, ...CONDITION_PRESENTATION_PT[condition.id] };
}
