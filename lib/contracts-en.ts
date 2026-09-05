export type EnglishContractText = {
  description: string;
  summary?: string;
  options?: string[];
  success?: string;
  exceptionalSuccess?: string;
  failure?: string;
  dramaticFailure?: string;
};

// Concise source-language mechanics for the 110 core-book Contracts. Breaches and
// Seeming benefits intentionally remain outside this review pass.
export const CONTRACT_TEXT_EN: Readonly<Record<string, EnglishContractText>> = {
  "ctl-2ed:hostile-takeover": {
    "description": "The changeling declares her right to be on the premises, persuading the home that she belongs there. She may then bypass any mundane security systems - she does not show on cameras, for instance - and its doors automatically open for her. Animals and hobgoblin sentries stay out of her way. The changeling can extend this Contract’s benefits to a number of companions equal to her Presence, as long as they remain in her line of sight. Targeting a Hollow, or another supernatural dwelling, triggers a Clash of Wills with the owner or main resident. This Contract does not work if the building’s owner or main resident also knows Hostile Takeover, as he is another beneficiary of it."
  },
  "ctl-2ed:mask-of-superiority": {
    "summary": "Appear to be a respected member of an organization, gaining effective Status equal to Presence while maintaining the role.",
    "description": "People who see the character believe he is a respected member of an organization they belong to, as though he had dots in its Status Merit equal to his Presence. If the changeling affects multiple people, they all believe him to be a member of the same organization; the player chooses one target as his primary to determine which organization. If he acts out of character for a member or doesn’t know something a member would, his player rolls Presence + Subterfuge contested by the other characters’ Wits + Empathy to keep them from realizing he’s a fraud.",
    "success": "People who see the character believe he is a respected member of an organization they belong to, as though he had dots in its Status Merit equal to his Presence. If the changeling affects multiple people, they all believe him to be a member of the same organization; the player chooses one target as his primary to determine which organization. If he acts out of character for a member or doesn’t know something a member would, his player rolls Presence + Subterfuge contested by the other characters’ Wits + Empathy to keep them from realizing he’s a fraud.",
    "exceptionalSuccess": "The changeling instead convinces people he is a trusted ally come for a tour, as though he also had the Allies Merit equal to his Presence. He gets the same benefits as a member, but is given a pass if he doesn’t know all the inner workings of the organization, and the player only has to roll for the changeling to stay in character if he does something really absurd.",
    "failure": "The Contract fails.",
    "dramaticFailure": "Members of the organization take umbrage with the changeling’s obvious lies, and immediately become hostile toward him."
  },
  "ctl-2ed:paralyzing-presence": {
    "summary": "Overwhelm an attentive target with supernatural magnificence and inflict the Insensate Tilt.",
    "description": "The changeling grows larger, more beautiful and terrible, in the target’s mind and overwhelms her: She suffers the Insensate Tilt.",
    "success": "The changeling grows larger, more beautiful and terrible, in the target’s mind and overwhelms her: She suffers the Insensate Tilt.",
    "exceptionalSuccess": "The victim also suffers the Cowed Condition.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The target is supremely unimpressed, inflicting the Shaken Condition on the changeling."
  },
  "ctl-2ed:summon-the-loyal-servant": {
    "description": "The changeling cuts his hand and lets a droplet of blood fall onto the substance of his choice: The fire from a lit candle, the shadows hiding in the corner, and a pile of leaves and twigs are all valid targets. The substance animates into a small servant, which is as intelligent as a dog and can carry out simple commands. It’s also perceptive enough to notice threats to the changeling or itself. The servitor has Power 1, Finesse 3, and Resistance 1, with derivative traits as if it were a Hedge ghost (p. 247), but it only possesses iron as a frailty and doesn’t gain any Influences or Numina. The changeling chooses its shape, and a Size between 1 and 7. The servitor has natural advantages granted by its makeup; for example, a fire servitor cannot be burnt. It remains animate for one scene, or until it is destroyed."
  },
  "ctl-2ed:tumult": {
    "summary": "Read selected mental Conditions and spend invocation successes to inflict them immediately or after a chosen trigger.",
    "description": "The first fold reveals whether the target suffers from any of the following Conditions: Disoriented, Guilty, Lost, Paranoid, Obsession, Spooked, Stoic, or Withdrawn. As the changeling keeps folding, he may inflict one of these effects on the target per success rolled: • Inflict one of the temporary Conditions above on the target. • Delay the effect of this Contract until a specified trigger occurs; multiple successes may specify multiple separate triggers.",
    "success": "The first fold reveals whether the target suffers from any of the following Conditions: Disoriented, Guilty, Lost, Paranoid, Obsession, Spooked, Stoic, or Withdrawn. As the changeling keeps folding, he may inflict one of these effects on the target per success rolled: • Inflict one of the temporary Conditions above on the target. • Delay the effect of this Contract until a specified trigger occurs; multiple successes may specify multiple separate triggers.",
    "exceptionalSuccess": "Inflict one extra effect.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling gains one of the Conditions listed, of the player’s choice."
  },
  "ctl-2ed:discreet-summons": {
    "summary": "Produce a familiar mundane object or summon a hobgoblin to perform one task.",
    "description": "The character reaches into a small container, like a handbag or drawer, without looking, and pulls out an item of Size 1. This item can be anything the character has seen or handled before. The item is the most basic type of its kind, but fully functional and ready to use: A camera takes pictures, a smartphone can make calls and access a wireless connection, and a gun shoots bullets from its fully loaded magazine. The objects have no special qualifiers, nor Availability higher than 3. Alternatively, the changeling can open any door and loudly announce \"I have a guest!\" to find a hobgoblin standing there. The creature is a normal specimen of its kind (p. 252) with a Wyrd no higher than 3, and performs one task for the character to the best of its ability. The changeling may elaborate on his door-opening mantra to persuade the creature to come willingly, such as \"I have a guest, who is skilled as a barrister and whom I shall pay in fingernails!\" The Storyteller decides if the changeling indeed entices the hobgoblin in this manner, in which case the Contract roll is uncontested as the creature comes willingly. The object or hobgoblin vanishes at the end of the scene, when it leaves the character’s hands (for an object), or when the character stops paying attention to it, whichever comes first.",
    "success": "The character reaches into a small container, like a handbag or drawer, without looking, and pulls out an item of Size 1. This item can be anything the character has seen or handled before. The item is the most basic type of its kind, but fully functional and ready to use: A camera takes pictures, a smartphone can make calls and access a wireless connection, and a gun shoots bullets from its fully loaded magazine. The objects have no special qualifiers, nor Availability higher than 3. Alternatively, the changeling can open any door and loudly announce \"I have a guest!\" to find a hobgoblin standing there. The creature is a normal specimen of its kind (p. 252) with a Wyrd no higher than 3, and performs one task for the character to the best of its ability. The changeling may elaborate on his door-opening mantra to persuade the creature to come willingly, such as \"I have a guest, who is skilled as a barrister and whom I shall pay in fingernails!\" The Storyteller decides if the changeling indeed entices the hobgoblin in this manner, in which case the Contract roll is uncontested as the creature comes willingly. The object or hobgoblin vanishes at the end of the scene, when it leaves the character’s hands (for an object), or when the character stops paying attention to it, whichever comes first.",
    "exceptionalSuccess": "The item can be of Size 5 or smaller, and can have up to Availability 5. The hobgoblin likes the character and goes to great lengths to fulfill the spirit of his assignment, rather than the letter, and performs any follow-up tasks that ensure greater success. For example, if it was charged to steal something and discovers the object is cursed, it tells the changeling.",
    "failure": "The summons fails.",
    "dramaticFailure": "The character retrieves an item with the Volatile Condition, or a summoned hobgoblin means him ill, though it may conceal its enmity to lure him into a trap."
  },
  "ctl-2ed:masterminds-gambit": {
    "description": "The changeling speaks aloud to himself, revealing his darkest fears and desires to the air. He weaves a concrete goal into his monologue, such as \"embarrass the Duke of Barrington in front of the Court,\" or \"break into the Queen’s library,\" and his words turn into ideas and parchment. This instant action takes at least five minutes to complete. By the time he stops speaking, the changeling has created a plan or repository (p. 196) pertinent to his goal that counts as equipment granting a +5 bonus. It lasts until the end of the chapter or until the plan definitively succeeds or fails, whichever comes first."
  },
  "ctl-2ed:pipes-of-the-beastcaller": {
    "summary": "Summon and command every nearby animal of one chosen species.",
    "description": "The character sends out a call to all animals of one species, which he names when invoking the Contract, within a radius equal to his Animal Ken dots in miles. Any in range gather around him and he may give them simple commands, which they obey to the best of their abilities. The character must give his instructions verbally (the Contract ensures the creatures, regardless of intellect, understand him), though the first wave of arrivals will pass his instructions on to animals further away. Once the animals have completed their task, or face an insurmountable problem, they return to inform the changeling. Hostile animals may contest this Contract.",
    "success": "The character sends out a call to all animals of one species, which he names when invoking the Contract, within a radius equal to his Animal Ken dots in miles. Any in range gather around him and he may give them simple commands, which they obey to the best of their abilities. The character must give his instructions verbally (the Contract ensures the creatures, regardless of intellect, understand him), though the first wave of arrivals will pass his instructions on to animals further away. Once the animals have completed their task, or face an insurmountable problem, they return to inform the changeling. Hostile animals may contest this Contract.",
    "exceptionalSuccess": "The character controls the animals for a day and a night, and can give them new commands whenever he speaks with them. If he mistreats them, or makes impossible demands, the animals gain a new Resolve + Composure roll to contest the Contract.",
    "failure": "The summons fails.",
    "dramaticFailure": "The Contract summons one larger hostile animal (like a dog), or a swarm of small ones (like spiders), which attacks the changeling."
  },
  "ctl-2ed:the-royal-court": {
    "description": "Setting himself up as leader during a meeting, the changeling can prevent violence from breaking out. No matter how rowdy or hostile negotiations get - even if that assassin came here fully intending to kill him - none of the people gathered can inflict bodily harm on another. If anyone present is under a supernatural coercion to commit violence, the changeling and the force behind the coercion engage in a Clash of Wills. This Contract does not stop violence if it’s already started."
  },
  "ctl-2ed:spinning-wheel": {
    "summary": "Guide a target toward one reasonably probable experience within the next lunar month.",
    "description": "The changeling names an experience, which must be reasonably probable and not overly specific, for his target. Examples include \"meeting the Autumn Queen\" or \"getting hit by a car.\" All rolls leading to this event, made by the target or other characters, gain bonus dice equal to the successes rolled to invoke the Contract, while rolls obstructing the event suffer the same as a penalty, to a maximum of +/−5. This Contract only creates an event, not the outcome thereof. A changeling may have a number of instances of this Contract pending equal to his Wyrd rating.",
    "success": "The changeling names an experience, which must be reasonably probable and not overly specific, for his target. Examples include \"meeting the Autumn Queen\" or \"getting hit by a car.\" All rolls leading to this event, made by the target or other characters, gain bonus dice equal to the successes rolled to invoke the Contract, while rolls obstructing the event suffer the same as a penalty, to a maximum of +/−5. This Contract only creates an event, not the outcome thereof. A changeling may have a number of instances of this Contract pending equal to his Wyrd rating.",
    "exceptionalSuccess": "The changeling may also specify an action the target can take to prevent the chosen experience from coming to pass, which ends the Contract immediately.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling curses himself, leading to a dramatic failure on a crucial roll of the Storyteller’s choice over the next chapter."
  },
  "ctl-2ed:blessing-of-perfection": {
    "description": "The changeling lovingly caresses and speaks to an object. Her attention bestows a blessing on the object, which repays her by replacing its equipment bonus with her Wyrd rating. The changeling can instead target another person’s Crafts, Medicine, or Computer action by speaking words of encouragement while he works, replacing his Skill rating with her Wyrd."
  },
  "ctl-2ed:changing-fortunes": {
    "description": "The changeling whispers a story to the wind, of a strange turn of events that befell her in Arcadia. She may then add or subtract two dice from her target’s player’s next roll, or lower or raise his exceptional success threshold by one success, per success rolled. Exceptional success thresholds can’t drop below one success, nor can the target ever achieve exceptional success on a chance die. The changeling can target herself. Example: With two rolled successes, a player can add or subtract four dice from her target’s dice pool, or lower or raise his exceptional success threshold by two successes, or add or subtract two dice while also lowering or raising his exceptional threshold by one. Changing Fortunes can affect a given target only once per chapter. Attempting to use this Contract on the same target again results in the changeling cursing herself, as dramatic failure.",
    "success": "The changeling whispers a story to the wind, of a strange turn of events that befell her in Arcadia. She may then add or subtract two dice from her target’s player’s next roll, or lower or raise his exceptional success threshold by one success, per success rolled. Exceptional success thresholds can’t drop below one success, nor can the target ever achieve exceptional success on a chance die. The changeling can target herself. Example: With two rolled successes, a player can add or subtract four dice from her target’s dice pool, or lower or raise his exceptional success threshold by two successes, or add or subtract two dice while also lowering or raising his exceptional threshold by one. Changing Fortunes can affect a given target only once per chapter. Attempting to use this Contract on the same target again results in the changeling cursing herself, as dramatic failure.",
    "exceptionalSuccess": "Rather than affect the target’s next roll, the changeling may specify a trigger for the effect, such as \"if he tries to shoot me.\" If the trigger doesn’t happen before the end of the scene, the Contract simply ends.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The Contract turns against the changeling per success, with effects chosen by the Storyteller."
  },
  "ctl-2ed:light-shy": {
    "description": "The changeling becomes as elusive as a dream, and shadows cloak her in the obscurity of forgotten memories."
  },
  "ctl-2ed:murkblur": {
    "description": "The target sees the impossible beauty of Arcadia, not meant for lesser beings to behold, and suffers the Blinded Tilt (both eyes).",
    "success": "The target sees the impossible beauty of Arcadia, not meant for lesser beings to behold, and suffers the Blinded Tilt (both eyes).",
    "exceptionalSuccess": "As success, and the target suffers the Deafened Tilt (both ears).",
    "failure": "The Contract fails.",
    "dramaticFailure": "Light and color assail the changeling’s senses. She gains the Disoriented Condition."
  },
  "ctl-2ed:trivial-reworking": {
    "description": "The changeling recalls how her Keeper molded items to fit his whims, and mimics some of what he did. She cloaks a mundane item up to Size 3 in her Mask, and changes its visual aspects. The object’s basic shape remains the same, and all rules governing Mask apply. This effect is purely psychological: A dry leaf disguised as a $100 bill looks and feels exactly like a $100 bill to any mortal, but doesn’t stand up to counterfeit detection measures. Beings able to see through the Mask are immune to this power."
  },
  "ctl-2ed:changeling-hours": {
    "description": "The changeling moves her arms to \"draw\" a clock in the air between herself and the object. She then mimics turning the hands of the clock backward, forward, or halting them. This Contract can create three different effects. The changeling chooses which to use when she invokes the Contract. Rewind the clock: The item becomes as new. The Contract repairs one point of damage per turn and replaces missing parts, restoring up to her Crafts rating in Structure. Speed the clock: The item corrodes, suffering one point of damage per turn that ignores Durability, up to her Crafts rating in damage. Freeze the clock: The item freezes in time and place, rendering it impossible to move and immune to damage or change."
  },
  "ctl-2ed:dance-of-the-toys": {
    "description": "The changeling makes a mechanical device dance to her whims. She strikes it to inspire obedience through terror, or caresses it to engender loyalty born from love. Either way, the device comes alive to follow a single, simple command. A door closes and remains closed, a car drives away, or a gun shoots until it runs out of bullets. Anyone attempting to change its action must roll Strength + Resolve and achieve more successes than the changeling did to invoke the Contract. Devices cannot move outside their normal range of motion. If a device’s natural movement would inflict damage, like a car running someone over, it uses the successes rolled on this Contract as a dice pool for that attack. The changeling can control any device she can see within (10 x Wyrd) yards/meters.",
    "success": "The changeling makes a mechanical device dance to her whims. She strikes it to inspire obedience through terror, or caresses it to engender loyalty born from love. Either way, the device comes alive to follow a single, simple command. A door closes and remains closed, a car drives away, or a gun shoots until it runs out of bullets. Anyone attempting to change its action must roll Strength + Resolve and achieve more successes than the changeling did to invoke the Contract. Devices cannot move outside their normal range of motion. If a device’s natural movement would inflict damage, like a car running someone over, it uses the successes rolled on this Contract as a dice pool for that attack. The changeling can control any device she can see within (10 x Wyrd) yards/meters.",
    "exceptionalSuccess": "The player can purchase the device as a one-dot Retainer, in which case it remains permanently animated. If she does not, the enchantment expires after one chapter.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The device comes to life but turns against the changeling, capable of actively opposing her."
  },
  "ctl-2ed:hidden-reality": {
    "description": "The character imagines the world not as it is, but how it might be, and chooses one of the differences to become reality. She may alter a feature of her surroundings, as long as it could have always been this way. For example, she can create a hidden latch on a box, or a door on a wall, as long as no one else has seen that it wasn’t there Wonder yet during this scene. The change must be minor in scope and part of an existing object, which must be lifeless - she can’t grow a new branch on a tree - though it may be of any Size. Changes vanish at the end of the scene, or when no one pays attention to them, whichever comes first."
  },
  "ctl-2ed:stealing-the-solid-reflection": {
    "description": "The changeling reaches into a reflective surface, to the mirror world beyond, and pulls the desired object out of it. The surface must be clear enough to show some detail, and the object must fit through it. The stolen reflection is mirrored: a car with the steering wheel on the wrong side, or a book written in backwards text. The stolen object has no supernatural properties. Neither the stolen object nor the original has a reflection while this Contract lasts.",
    "success": "The changeling reaches into a reflective surface, to the mirror world beyond, and pulls the desired object out of it. The surface must be clear enough to show some detail, and the object must fit through it. The stolen reflection is mirrored: a car with the steering wheel on the wrong side, or a book written in backwards text. The stolen object has no supernatural properties. Neither the stolen object nor the original has a reflection while this Contract lasts.",
    "exceptionalSuccess": "The stolen reflection remains solid until the sun next passes the horizon.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The reflective surface shatters, and the original object sustains damage equal to the changeling’s Wyrd that bypasses Durability, as cracks erupt across it."
  },
  "ctl-2ed:tatterdemalions-workshop": {
    "description": "The changeling takes a jury rigging Build Equipment action (p. 197) as normal, but no mundane equipment up to Size 5 is ever too complex to build in a single turn, and she bypasses the need for proper components or tools. Reduce the usual penalty for equipment bonuses or benefits by half the character’s Wyrd, rounded up. The crafting process should look vaguely possible to the layman: She can create a rocket launcher out of a flare gun and a canister of compressed gas, or a portable Xerox machine from random bathroom supplies and a fountain pen. The device functions as well as its normal version would."
  },
  "ctl-2ed:glimpse-of-a-distant-mirror": {
    "description": "The changeling looks into any reflective surface, which becomes a window that looks out through another such surface that has reflected his face before. Anyone who looks into this window can see what’s on the other side. The view is only as clear as the surfaces allow - a muddy pool creates a muddy view. After the Contract ends, the changeling sees himself wrong in the surface for the rest of the scene, glimpsing hints of the mirror people on the other side."
  },
  "ctl-2ed:know-the-competition": {
    "description": "The changeling observes his opponent in a game against him, predicting her moves and how she uses her resources. He wins, and learns her Virtue and Vice (or equivalent anchors) and one of her Aspirations. Wonder",
    "success": "The changeling observes his opponent in a game against him, predicting her moves and how she uses her resources. He wins, and learns her Virtue and Vice (or equivalent anchors) and one of her Aspirations. Wonder",
    "exceptionalSuccess": "The changeling also learns a second Aspiration.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling misreads his opponent, who not only wins the game but also learns his Needle, Thread, and one Aspiration."
  },
  "ctl-2ed:portents-and-visions": {
    "summary": "Choose past or future to reveal a significant event or promise from the target's past, or an important event or agreement likely within the next few days. Future visions show possibilities, not immutable fate.",
    "description": "Past: The changeling sees a vision of the most important event, relevant to the changeling’s current interests, that has befallen the target. This is not contingent on the target’s memories: He might see a forgotten or suppressed event. Alternatively, the changeling may view the last promise or deal the target made. Future: The changeling sees the most important event, promise, or deal coming up for the target in the next few days. The future is not set in stone, and the changeling’s involvement can alter it. The changeling, and the target if he tells her, gains the Informed Condition.",
    "success": "Past: The changeling sees a vision of the most important event, relevant to the changeling’s current interests, that has befallen the target. This is not contingent on the target’s memories: He might see a forgotten or suppressed event. Alternatively, the changeling may view the last promise or deal the target made. Future: The changeling sees the most important event, promise, or deal coming up for the target in the next few days. The future is not set in stone, and the changeling’s involvement can alter it. The changeling, and the target if he tells her, gains the Informed Condition.",
    "exceptionalSuccess": "The changeling may evoke emotions associated with the event in his target: for example, if the event was a night of passion, he reminds the target of his lover. The target gains a Condition to represent this.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling sees a false event and with it, signs of the Gentry’s impending approach. He suffers the Paranoid Condition."
  },
  "ctl-2ed:read-lucidity": {
    "description": "The Storyteller tells the player the target’s maximum and current Clarity levels, though the character interprets this in relative terms (\"she’s more stable than I am\" or \"she’s very confused\"). The changeling also knows which Clarity Conditions his target suffers, if any.",
    "success": "The Storyteller tells the player the target’s maximum and current Clarity levels, though the character interprets this in relative terms (\"she’s more stable than I am\" or \"she’s very confused\"). The changeling also knows which Clarity Conditions his target suffers, if any.",
    "exceptionalSuccess": "The changeling also uncovers the circumstances of the target’s most recently suffered Clarity damage.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The character gleans the wrong Clarity levels, but doesn’t know this."
  },
  "ctl-2ed:walls-have-ears": {
    "description": "The changeling tells an object a secret from Arcadia and receives its secrets in return. Each selected option costs 1 Glamour.",
    "options": [
      "Learn how the object was made and its weak points: halve its Durability against the changeling's attacks and add Intelligence to rolls to repair or modify it.",
      "Learn how to use the object to best effect: gain 9-again on rolls to wield or use it.",
      "See the last person who handled or touched the object and the circumstances, including everyone within three yards/meters at the time."
    ]
  },
  "ctl-2ed:props-and-scenery": {
    "description": "Glamour shapes the changeling into the desired inanimate object, with standard traits for its kind, of a Size up to his own by default. The player chooses an additional benefit per success rolled to invoke this Contract, such as: • +1 Durability; can apply multiple times • Limited mobility (he rolls himself as a rock, or uses chair legs to walk) • +/−1 Size; can apply multiple times • Other effects with Storyteller approval",
    "success": "Glamour shapes the changeling into the desired inanimate object, with standard traits for its kind, of a Size up to his own by default. The player chooses an additional benefit per success rolled to invoke this Contract, such as: • +1 Durability; can apply multiple times • Limited mobility (he rolls himself as a rock, or uses chair legs to walk) • +/−1 Size; can apply multiple times • Other effects with Storyteller approval",
    "exceptionalSuccess": "The changeling may purchase the form permanently for 3 Experiences. If he does, he can adopt it reflexively for a single point of Glamour (but still must roll), but can’t benefit from this Contract’s Loophole that way. He changes as if he achieved one success. He may also still assume the same form using this Contract normally.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling briefly becomes a misshapen mass and suffers a Clarity attack with dice equal to half his Wyrd rating (rounded up)."
  },
  "ctl-2ed:reflections-of-the-past": {
    "description": "The changeling looks into a reflective surface, and states a specific time or event. The reflection then rewinds at impossible speed, compressing days or years into a single moment until it comes to the time he states. The changeling may then see the event as it happened, though only from the angle at which it was originally reflected in the surface. Anyone else watching sees the same vision. The vision can show up to one scene’s worth of events. The changeling can see moments further back in the past by spending more Glamour; one to go back up to a week, two for a month, three for a season, four for a year, and five for a decade. He must specify the time by at least date (either fixed or relative to the present), and whether it was day or night; or he can specify an event as long as he knows some of the details, such as \"when the Ogre beat up Jack.\" Wonder",
    "success": "The changeling looks into a reflective surface, and states a specific time or event. The reflection then rewinds at impossible speed, compressing days or years into a single moment until it comes to the time he states. The changeling may then see the event as it happened, though only from the angle at which it was originally reflected in the surface. Anyone else watching sees the same vision. The vision can show up to one scene’s worth of events. The changeling can see moments further back in the past by spending more Glamour; one to go back up to a week, two for a month, three for a season, four for a year, and five for a decade. He must specify the time by at least date (either fixed or relative to the present), and whether it was day or night; or he can specify an event as long as he knows some of the details, such as \"when the Ogre beat up Jack.\" Wonder",
    "exceptionalSuccess": "The changeling can look around the edges into the reflection, seeing more details. For example, if he looks into a shop window that reflects his friend Jack fighting off an Ogre, he can stick his head into the vision to peer around the edges of the reflection, to see the Darkling standing a little further away.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling sees a false event and with it, signs of the Gentry’s impending approach. He suffers the Paranoid Condition."
  },
  "ctl-2ed:riddle-kith": {
    "description": "Leaving the Mask and pulling only on the Glamour under the target’s skin, the changeling alters the target’s outward fae mien to emulate the trappings of a different kith, but not its blessings. The target’s general features remain: if he was a rotund Chatelaine, he is now a rotund Snowskin. Nothing about the target’s apparent seeming changes, so a Darkling Leechfinger now looks like a Darkling Helldiver, for instance. Forcing a new kith’s appearance upon an unwilling subject grants her a roll to contest it and constitutes a breaking point with a pool of three dice, as the changeling repeats the cruelty of the Gentry. This Contract cannot copy a specific changeling’s mien.",
    "success": "Leaving the Mask and pulling only on the Glamour under the target’s skin, the changeling alters the target’s outward fae mien to emulate the trappings of a different kith, but not its blessings. The target’s general features remain: if he was a rotund Chatelaine, he is now a rotund Snowskin. Nothing about the target’s apparent seeming changes, so a Darkling Leechfinger now looks like a Darkling Helldiver, for instance. Forcing a new kith’s appearance upon an unwilling subject grants her a roll to contest it and constitutes a breaking point with a pool of three dice, as the changeling repeats the cruelty of the Gentry. This Contract cannot copy a specific changeling’s mien.",
    "exceptionalSuccess": "The changeling can spend a point of Willpower to extend the Contract’s duration indefinitely, but only when he himself is the target.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The target fully sheds her own kith, but fails to assume another. She loses all kith benefits for the scene."
  },
  "ctl-2ed:skinmask": {
    "description": "The changeling recites three things he knows about his target, who may be a mortal or any creature with a Mask: She’s tall, takes sugar in her coffee, and wears a red coat. He then assumes her outward appearance. If his target is a changeling, he copies both Mask and mien. Mimicking the target’s behavior still requires successful Social rolls. While the changeling could copy the Mask of anyone he’s physically met, he often copies people who look like him - or rather, people he’d look like if not for being taken. Older, without the curse of youth imposed by his Keeper, with fewer scars and eyes that know peace. Pretending he’s like them eases the itching under his skin; if he does this, regain a Willpower point."
  },
  "ctl-2ed:unravel-the-tapestry": {
    "description": "Replay the last 10 seconds, or go back to the top of the Initiative roster one full turn ago in action timing. The changeling may change his actions. All other characters, except those who used a similar power, retake their original actions. For example, the character was hit with an axe and took damage, prompting him to invoke this Contract. This time, he successfully Dodges. His attacker still swings the axe (and misses), as she did not expect him to step back. This Contract activates automatically if the character dies and can pay its cost. If he lives this time, he gains the Spooked Condition as he remembers being dead. If he dies again, he’s out of luck - the Contract can only selfactivate once per story.",
    "success": "Replay the last 10 seconds, or go back to the top of the Initiative roster one full turn ago in action timing. The changeling may change his actions. All other characters, except those who used a similar power, retake their original actions. For example, the character was hit with an axe and took damage, prompting him to invoke this Contract. This time, he successfully Dodges. His attacker still swings the axe (and misses), as she did not expect him to step back. This Contract activates automatically if the character dies and can pay its cost. If he lives this time, he gains the Spooked Condition as he remembers being dead. If he dies again, he’s out of luck - the Contract can only selfactivate once per story.",
    "exceptionalSuccess": "The changeling’s player gains the 8-again quality on any rolls he makes during the replayed time.",
    "failure": "The Contract fails.",
    "dramaticFailure": "Reality and false visions bleed into each other, and the changeling gains the Insensate Tilt. If he acts again this scene in action timing, he automatically has the lowest Initiative."
  },
  "ctl-2ed:cloak-of-night": {
    "description": "The changeling must invoke this Contract while she and her allies are in dim or dark conditions; as long as they take a penalty to visual perception rolls, it’s dark enough. She drapes the darkness around a number of willing companions equal to her Dexterity rating. The player’s Stealth rolls, to which she adds half her character’s Wyrd (rounded up) in bonus dice, hide the entire group as long as no one does anything to attract undue attention, such as attacking or making loud noises. The changeling and her companions also take Stealth-based actions as reflexive actions, once per turn in action timing."
  },
  "ctl-2ed:fae-cunning": {
    "description": "The changeling moves with the grace of lightning or commands blades to pass her by, or perhaps her shadowy body simply splits in two to remain unharmed. She may apply her Defense to Firearms attacks and never loses her Defense even if she’s surprised or distracted. Supernatural powers that would deny her Defense prompt a Clash of Wills. If she successfully Dodges, she may redirect the attack to another valid target, which automatically hits with successes equal to the changeling’s Presence rating."
  },
  "ctl-2ed:shared-burden": {
    "description": "The changeling lets her blood flow onto her target’s body, as her Glamour knits his wounds closed. For every point of lethal damage she inflicts upon herself, the Contract heals two points of damage for her target. She heals bashing damage first, followed by lethal; this Contract can’t heal aggravated damage. No magic can alleviate damage a changeling inflicted upon herself by using Shared Burden - not even someone else’s."
  },
  "ctl-2ed:thorns-and-brambles": {
    "description": "Brambles grow around the changeling with a radius of yards/meters equal to her Wyrd rating, and follow her as she moves. They can produce three different effects, listed below. The changeling chooses one when she invokes this Contract. If she uses it in the Hedge, the brambles don’t follow her movements, and she must contend with their threat as well. Leechweed: The brambles prick anyone who moves through them more quickly than Speed 2, draining him of one point of Glamour per turn, up to the changeling’s Wyrd rating per victim. Briarpatch: The brambles entangle the changeling’s enemies, inflicting the Immobilized Tilt (p. 330) on anyone who fails a reflexive Dexterity + Athletics roll; they must make one each time they move within the area. The brambles have a Durability equal to the changeling’s Wyrd rating. Field of Thorns: The brambles attack anyone who tries to break through using the changeling’s Wyrd rating as a dice pool. They are piercing weapons with a modifier of +0L. The brambles attack any given character only once per turn. The changeling may make the Field of Thorns stay in place when she moves."
  },
  "ctl-2ed:trapdoor-spiders-trick": {
    "description": "The changeling steps through an opening (be it a door, a window, or a hole in the wall) and cloaks it with Glamour to make it seem impassable, or not even there at all. The illusion is visual only, and supernatural perception can pierce it visually with a successful Clash of Wills. The player may pay an additional point of Willpower when enacting this Contract to extend the effect until the next dawn or dusk, whichever comes first."
  },
  "ctl-2ed:fortifying-presence": {
    "description": "The changeling’s presence heals two points of the target’s mild Clarity damage, or one point of severe. This has no effect on the target’s Clarity Conditions.",
    "success": "The changeling’s presence heals two points of the target’s mild Clarity damage, or one point of severe. This has no effect on the target’s Clarity Conditions.",
    "exceptionalSuccess": "The changeling also acts as a temporary Touchstone for the target, until after the next Clarity attack he suffers.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling suffers a Clarity attack with a pool of two dice, as she only manages to make things worse."
  },
  "ctl-2ed:hedgewall": {
    "description": "A thorn castle forms around the changeling, with a diameter of 10 yards/meters per dot of Wyrd. It grants substantial concealment against outside ranged attacks. Each wall has Durability 3 and Size 8 and blocks passage until removed; climbing it without protection deals 1 lethal damage per turn. The changeling chooses the layout, but passages must easily fit a Size 4 character.",
    "success": "A thorn castle forms around the changeling, with a diameter of 10 yards/meters per dot of Wyrd. It grants substantial concealment against outside ranged attacks. Each wall has Durability 3 and Size 8 and blocks passage until removed; climbing it without protection deals 1 lethal damage per turn. The changeling chooses the layout, but passages must easily fit a Size 4 character.",
    "exceptionalSuccess": "Add one effect from Thorns and Brambles to the castle for free.",
    "failure": "The Contract fails. In the Hedge, treat this as a dramatic failure.",
    "dramaticFailure": "The maze inflicts the Lost Condition on the changeling and her allies. In the Hedge, it also alerts a hostile hobgoblin."
  },
  "ctl-2ed:pure-clarity": {
    "description": "The changeling can take any one action during this scene that would normally prompt a breaking point for her, without suffering one. The Contract ends once she does, or at the end of the scene, whichever comes first. She may only use it once per scene. The changeling can invoke this Contract retroactively for actions on her part (for example, if she accidentally kills someone) as long as she does so within the same scene.",
    "success": "The changeling can take any one action during this scene that would normally prompt a breaking point for her, without suffering one. The Contract ends once she does, or at the end of the scene, whichever comes first. She may only use it once per scene. The changeling can invoke this Contract retroactively for actions on her part (for example, if she accidentally kills someone) as long as she does so within the same scene.",
    "exceptionalSuccess": "The changeling gains an armor rating of 2 against the next Clarity attack she suffers. This boon remains until triggered, even if the Contract ends first.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling gains a Clarity Condition of the Storyteller’s choosing, which doesn’t heal Clarity damage when it resolves."
  },
  "ctl-2ed:vow-of-no-compromise": {
    "description": "With a touch and a spoken promise, the changeling downgrades one level of her target’s aggravated damage to lethal. In exchange, she gains the Stoic Condition (p. 345). She may target herself."
  },
  "ctl-2ed:whispers-of-morning": {
    "description": "The world, and indeed the laws of physics, forget about the changeling - stuck between being and not being, her body and everything on her person become intangible. She is weightless, can’t be touched or attacked (or touch or attack others) save by magical means, and can pass through all physical barriers at will.. She can see and interact with other incorporeal fae creatures and objects, such as other changelings using Whispers of Morning and Hedge ghosts. However, she exists on a different frequency than creatures in Twilight, such as spirits and regular ghosts. Helldivers using their Dive blessing exist on a tangency between the two: The Helldiver chooses whether the changeling can see him or not."
  },
  "ctl-2ed:boon-of-the-scuttling-spider": {
    "description": "The world flattens in the character’s eye, until all surfaces are equally horizontal and equally upside down. He can move along walls, ceilings, or slick surfaces normally too treacherous to cross, as long as they are strong enough to carry his weight. He can move at his normal Speed, and acts without hindrance while moving in this fashion."
  },
  "ctl-2ed:dreamsteps": {
    "description": "The changeling enters the dreamer’s Bastion through the Gate of Ivory (p. 215), rather than entering his own.",
    "success": "The changeling enters the dreamer’s Bastion through the Gate of Ivory (p. 215), rather than entering his own.",
    "exceptionalSuccess": "The dreamer’s Bastion suffers a −1 to Fortification until she wakes.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling enters the target’s dream, but suffers the Flesh Too Solid Tilt, and the dreamer’s Bastion gains +1 Fortification until she wakes."
  },
  "ctl-2ed:nevertread": {
    "description": "The changeling stops to cloak one of his footprints: He can drop leaves over it, erase it and leave a pebble in its stead, or sculpt the earth until it resembles a hoof track. He then continues on his way, and the Contract changes all his footprints accordingly for the duration. This makes him impossible to track save by supernatural means, triggering a Clash of Wills, and altered tracks remain so even after the Contract ends."
  },
  "ctl-2ed:pathfinder": {
    "description": "The changeling mingles some of his spit or blood with earth from the Hedge, and uses the mixture to draw a compass on his hand. He instinctively knows the distance and the direction of the nearest general Hedge feature of his choice - the nearest Goblin Market or Hollow, a patch of goblin fruit, or an entrance to the Gate of Wonder Horn, for instance. The Contract only reveals information about the Hedge itself, not about creatures lurking within."
  },
  "ctl-2ed:seven-league-leap": {
    "description": "The changeling hops up and down, regaling the air with stories of his athletic prowess. The player then makes a jumping roll (Strength + Athletics), and the character can clear a jumping trajectory of 10 yards/ meters per dot of Wyrd he possesses."
  },
  "ctl-2ed:chrysalis": {
    "description": "The changeling chooses two animals when the player purchases this power, and can transform into either one by invoking it. He must have seen the animal before (an accurate representation works), and it can’t be smaller than Size 1 or larger than Size 7. He can choose a mythical beast, though he gains none of its supernal powers - only the physical form: Physical Attributes, Size, Speed, and Health. He can also use the animal’s mundane senses and modes of movement; he can’t levitate, but as a winged dragon he could fly. If he transforms into an aquatic animal, he copies its gills and aquatic lungs. While in animal form, the character can communicate with other animals of the assumed species."
  },
  "ctl-2ed:flickering-hours": {
    "description": "The changeling can extend this Contract to anyone traveling with him at the moment he invokes it; hostile pursuers, if they’re close on his heels, included. He may slow time by half, or speed it up to pass twice as quickly, for any of the targets individually. Until the sun next crosses the horizon, anyone quickened also gains the Fleet of Foot Merit, with effective dots equal to the changeling’s Wyrd up to three, and always has the Edge in a chase. Unwilling targets may pull free of the effect by succeeding at a Resolve + Wyrd roll contested by the changeling’s Wits + Occult + Wyrd."
  },
  "ctl-2ed:leaping-toward-nightfall": {
    "description": "The changeling can send an object up to Size 10 or a character forward in time. The target instantly vanishes and reappears at the predetermined time in the same location, conserving momentum if it was moving. If something else occupies that spot, the target appears next to it instead. No time passes for the target. Sentient beings can contest this Contract. The changeling determines how far into the future he sends the target, to a maximum of days equal to successes rolled to invoke Leaping Toward Nightfall. The changeling cannot end this Contract prematurely.",
    "success": "The changeling can send an object up to Size 10 or a character forward in time. The target instantly vanishes and reappears at the predetermined time in the same location, conserving momentum if it was moving. If something else occupies that spot, the target appears next to it instead. No time passes for the target. Sentient beings can contest this Contract. The changeling determines how far into the future he sends the target, to a maximum of days equal to successes rolled to invoke Leaping Toward Nightfall. The changeling cannot end this Contract prematurely.",
    "exceptionalSuccess": "The changeling may also send the target to a new location occupied by someone to whom he owes a debt. He can’t choose the location itself, only the character who will receive the incoming target when it arrives in the future.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling sends a random target forward in time instead, chosen by the Storyteller, which could be himself. Upon arrival, the target suffers either the Volatile Condition (for objects) or the Spooked Condition (for characters)."
  },
  "ctl-2ed:mirror-walk": {
    "description": "The changeling touches a reflective surface. Once the way is open, the changeling can step through, bringing any companions he likes in a chain of linked hands, or simply reach his hand through to grab an object on the other side. The changeling must have touched the exiting mirror before, and both the entrance and exit must be large enough for him to physically pass his body or hand through.",
    "success": "The changeling touches a reflective surface. Once the way is open, the changeling can step through, bringing any companions he likes in a chain of linked hands, or simply reach his hand through to grab an object on the other side. The changeling must have touched the exiting mirror before, and both the entrance and exit must be large enough for him to physically pass his body or hand through.",
    "exceptionalSuccess": "The mirrors remain portals for the scene, and anyone may pass through freely with the changeling’s permission in either direction, without the need to link hands.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling becomes lost in mirror space, which is part of the Hedge, and gains the Lost Condition. If he was reaching for an object instead, he drops it in mirror space."
  },
  "ctl-2ed:talon-and-wing": {
    "description": "This Contract can grant three different effects, which a character can stack at a cost of one point of Glamour each. • The character gains the mode of transportation of a beast, increasing his Speed by 10. • The character gains the senses of a beast, giving his player a three-die bonus to perception rolls and eliminating penalties in dim lighting or darkness. • The character gains the claws of a beast, giving his unarmed Brawl attacks a weapon modifier of +0L. If his unarmed attacks already deal lethal damage, his claws become preternaturally sharp and deal aggravated damage instead."
  },
  "ctl-2ed:elemental-weapon": {
    "description": "The character grabs a nearby element - such as water from a pond, flames from a fireplace, a rose from its bush, or electricity from a wall socket - and shapes it into any archaic weapon of her choosing; for example, fiery gauntlets that enhance her Brawl attacks, a frozen sword to wield in melee, or thrown javelins of lightning. The weapon has normal traits for its kind (p. 323), to which the player can add any of the following: +1 weapon modifier per success spent, or decrease the Initiative penalty by one per success spent, or +20/40/80 range per success spent, to a maximum of three successes per option. She may mix and match successes among these options.",
    "success": "The character grabs a nearby element - such as water from a pond, flames from a fireplace, a rose from its bush, or electricity from a wall socket - and shapes it into any archaic weapon of her choosing; for example, fiery gauntlets that enhance her Brawl attacks, a frozen sword to wield in melee, or thrown javelins of lightning. The weapon has normal traits for its kind (p. 323), to which the player can add any of the following: +1 weapon modifier per success spent, or decrease the Initiative penalty by one per success spent, or +20/40/80 range per success spent, to a maximum of three successes per option. She may mix and match successes among these options.",
    "exceptionalSuccess": "The weapon gains additional bonuses, as above.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The element reacts in a wild and dangerous manner, inflicting an appropriate Tilt on the changeling."
  },
  "ctl-2ed:might-of-the-terrible-brute": {
    "description": "The character lets out a terrifying roar of fury and defiance, calling on the prowess that once served her Keeper and now serves only herself. Whenever the player wins a contested grapple roll, the changeling gains a new option for a move to enact: She may reduce her opponent’s Strength by one and add it to her own. Opponents reduced to Strength 0 this way gain the Immobilized Tilt, unable to effectively perform any Physical actions. She may not increase her Strength by more than +5, but it may exceed her Wyrd-derived limit."
  },
  "ctl-2ed:overpowering-dread": {
    "description": "Channeling her quiet destruction into her target, she curses him with the Frightened Condition (p. 339).",
    "success": "Channeling her quiet destruction into her target, she curses him with the Frightened Condition (p. 339).",
    "exceptionalSuccess": "Next time the changeling sees the target after the Contract ends, invoking it against him again costs no Glamour.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling’s Contract turns against her, giving her the Spooked Condition."
  },
  "ctl-2ed:primal-glory": {
    "description": "The character survived the scorching deserts and ice plains of Arcadia; mere mortal elements cannot harm her. She touches an element and it cows before her: She gains immunity to damage from mundane instances of the element, and suffers only half damage (rounded down) from magical sources. It also curls around her in a protective armor, like a dog eager to please its master, granting her an armor rating of 1/1. The armor hurts anyone who comes in close, dealing one point of lethal damage per turn to anyone who engages in melee against her."
  },
  "ctl-2ed:touch-of-wrath": {
    "description": "The changeling touches an object and, whispering sweet threats to it, sinks her nails into stone, or rends deep gashes in metal. She deals one point of damage to the object for each success rolled.",
    "success": "The changeling touches an object and, whispering sweet threats to it, sinks her nails into stone, or rends deep gashes in metal. She deals one point of damage to the object for each success rolled.",
    "exceptionalSuccess": "The changeling’s touch ignores Durability.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The Contract touches an unintended object, chosen by the Storyteller, and gives it the Volatile Condition."
  },
  "ctl-2ed:elemental-fury": {
    "description": "The character channels her fury outward, screaming to the sky, and inflicting one Environmental Tilt of her choice per point of Glamour she spends. The area extends 20 yards/meters around the character, though she herself is immune to its effects. She may also spend additional points of Glamour to extend the Tilt 20 more yards/meters per point spent."
  },
  "ctl-2ed:oathbreakers-punishment": {
    "description": "The changeling senses the most serious promise the target has broken for which he has not yet atoned, whether he broke an actual oath or just didn’t go to school when he told his parent he would. Atonement means a full confession to wronged parties, as well as repairing any harm. The changeling can sculpt one waking nightmare for each success rolled, to visit the target within the next fortnight. This nightmare must involve the broken promise in some way: A cheating spouse might have a sudden image of his husband murdering him during dinner, while the kid playing hooky might see his teacher (once he returns to school) as a monster. These waking nightmares are valid targets for oneiromancy while they’re happening and each lasts one scene, creating a Bastion along a Dreaming Road even though the target isn’t asleep.",
    "success": "The changeling senses the most serious promise the target has broken for which he has not yet atoned, whether he broke an actual oath or just didn’t go to school when he told his parent he would. Atonement means a full confession to wronged parties, as well as repairing any harm. The changeling can sculpt one waking nightmare for each success rolled, to visit the target within the next fortnight. This nightmare must involve the broken promise in some way: A cheating spouse might have a sudden image of his husband murdering him during dinner, while the kid playing hooky might see his teacher (once he returns to school) as a monster. These waking nightmares are valid targets for oneiromancy while they’re happening and each lasts one scene, creating a Bastion along a Dreaming Road even though the target isn’t asleep.",
    "exceptionalSuccess": "The changeling senses all broken vows for which her target has not yet atoned and can sculpt her nightmares around any (or a combination) of them.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The target immediately knows the most significant oath the changeling has broken or deal upon which she’s reneged."
  },
  "ctl-2ed:red-revenge": {
    "description": "The changeling raises her hands to the sky, calling to all the hatred and misery that exists in this wretched world. Her skin breaks open as the wrath flows in her, and a blood-red aura surrounds her. She gains +3 to her Initiative, Intimidation, and Physical Attribute ratings, which also increases derived traits. She gains 3/3 armor and the Berserk Condition, as well."
  },
  "ctl-2ed:relentless-pursuit": {
    "description": "The changeling sniffs the air, speaking her target’s name or a description of him, to follow the trail of his nightmares. She instinctively knows the direction and rough distance of her target. If he is in another realm, she knows which one. If the target is using supernatural means to evade pursuers, this Contract triggers a Clash of Wills."
  },
  "ctl-2ed:thief-of-reason": {
    "description": "Roll the successes achieved on the invocation roll as a dice pool to attack the target’s Clarity. If the target suffers Clarity damage as a result, he also loses a Willpower point from the sudden psychic shock. If this Contract targets a non-changeling, the \"damage\" to the target’s equivalent trait is temporary and vanishes at the end of the scene. Successfully dealing Clarity damage with Thief of Reason is a breaking point with a pool of four dice.",
    "success": "Roll the successes achieved on the invocation roll as a dice pool to attack the target’s Clarity. If the target suffers Clarity damage as a result, he also loses a Willpower point from the sudden psychic shock. If this Contract targets a non-changeling, the \"damage\" to the target’s equivalent trait is temporary and vanishes at the end of the scene. Successfully dealing Clarity damage with Thief of Reason is a breaking point with a pool of four dice.",
    "exceptionalSuccess": "The Clarity attack gains more dice, as above.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling gains the Dissociation Condition."
  },
  "ctl-2ed:cupids-arrow": {
    "description": "The changeling learns the subject’s most ardent desire, and any Conditions or Tilts connected to it. This desire can even be one the target is unaware of. He may replace this desire with one of his choice. The target’s passion for the original desire, along with any Conditions or Tilts it engendered, turns toward the new for the scene.",
    "success": "The changeling learns the subject’s most ardent desire, and any Conditions or Tilts connected to it. This desire can even be one the target is unaware of. He may replace this desire with one of his choice. The target’s passion for the original desire, along with any Conditions or Tilts it engendered, turns toward the new for the scene.",
    "exceptionalSuccess": "The changeling instinctively knows of any obstacles between his target and her desire.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling believes his target’s desire is something it’s not, chosen by the Storyteller or target’s player."
  },
  "ctl-2ed:dreams-of-the-earth": {
    "description": "A soft breeze carries the song to the changeling’s target, who must be within his line of sight. The target falls into magical slumber; nothing short of lethal damage can wake her. Once the Contract ends, the target continues sleeping normally.",
    "success": "A soft breeze carries the song to the changeling’s target, who must be within his line of sight. The target falls into magical slumber; nothing short of lethal damage can wake her. Once the Contract ends, the target continues sleeping normally.",
    "exceptionalSuccess": "The magical sleep lasts the entire scene.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling falls into a magical slumber for minutes equal to his Mantle rating."
  },
  "ctl-2ed:gift-of-warm-breath": {
    "description": "The changeling touches his target, who must be willing. His hands emit a soft glow, which spreads to her skin as his Spring Mantle softly draws her into an embrace. The target instantly sheds all fatigue penalties, Tilts relating to fatigue and temporary illnesses (such as Sick or Poisoned), and bashing wounds."
  },
  "ctl-2ed:springs-kiss": {
    "description": "Rain falls as the changeling wishes within (Mantle) miles, anything from a drizzle to a downpour. This may inflict the Heavy Rain Tilt by default, and the Flooded Tilt for an extra point of Glamour."
  },
  "ctl-2ed:wyrd-faced-stranger": {
    "description": "The changeling closes his eyes and lets his target’s dreams envelop him. When he opens his eyes, he looks like whomever his target most wants to see. He can use this Contract on a group and choose one person as the target, but the highest Composure among them opposes his roll. All observers see him as the same person. He can also appear as someone the target doesn’t know but desires to see, such as a dashing stranger. Convincing interaction may require a successful Social roll if the changeling acts out of character for the person he appears to be. He gains (Mantle) bonus dice on such rolls.",
    "success": "The changeling closes his eyes and lets his target’s dreams envelop him. When he opens his eyes, he looks like whomever his target most wants to see. He can use this Contract on a group and choose one person as the target, but the highest Composure among them opposes his roll. All observers see him as the same person. He can also appear as someone the target doesn’t know but desires to see, such as a dashing stranger. Convincing interaction may require a successful Social roll if the changeling acts out of character for the person he appears to be. He gains (Mantle) bonus dice on such rolls.",
    "exceptionalSuccess": "The deception lasts until the next dawn.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling appears as the person the target least wants to see, and doesn’t know this."
  },
  "ctl-2ed:blessing-of-spring": {
    "description": "The target who drinks the cordial matures, growing months in mere moments and looking as she would at the height of spring. Plants, including goblin-fruit trees, are in bloom, and yield spring fruits immediately. The Contract heals people and animals of all wounds, and cures any illnesses or poisons that would yield with time. Changeling targets also shed one temporary Clarity Condition, healing one point of Clarity damage but earning no Beats. These changes last for the scene, after which all the damage and Conditions return, and unused goblin fruits vanish. The target becomes ravenous and must consume three days’ worth of sustenance immediately after the Contract ends. No target may waive the contesting roll; fae magic must overcome stubborn reality.",
    "success": "The target who drinks the cordial matures, growing months in mere moments and looking as she would at the height of spring. Plants, including goblin-fruit trees, are in bloom, and yield spring fruits immediately. The Contract heals people and animals of all wounds, and cures any illnesses or poisons that would yield with time. Changeling targets also shed one temporary Clarity Condition, healing one point of Clarity damage but earning no Beats. These changes last for the scene, after which all the damage and Conditions return, and unused goblin fruits vanish. The target becomes ravenous and must consume three days’ worth of sustenance immediately after the Contract ends. No target may waive the contesting roll; fae magic must overcome stubborn reality.",
    "exceptionalSuccess": "The target matures a full year instead. Plants yield more fruits and seeds as they speed through the seasons. The Contract regrows any missing limbs on an animal or person, and changeling targets shed one Persistent Clarity Condition, healing two points of Clarity damage but earning no Beats. The Contract speeds the pregnancy of animals and willing human targets by 12 months - the patron of Spring refuses to enact this Contract on unwilling pregnant humans. Any offspring, be they seeds or creatures, are unaffected once they separate from the target. As with success, these changes last for the scene, although if a target gave birth within the scene, that change is permanent.",
    "failure": "The Contract fails.",
    "dramaticFailure": "Target creatures gain the Fatigued Condition, and plants wither."
  },
  "ctl-2ed:gift-of-warm-blood": {
    "description": "Each success on the invocation roll downgrades one of the target’s wounds: from aggravated to lethal, lethal to bashing, or bashing to fully healed.",
    "success": "Each success on the invocation roll downgrades one of the target’s wounds: from aggravated to lethal, lethal to bashing, or bashing to fully healed.",
    "exceptionalSuccess": "Any remaining points of bashing damage are also healed.",
    "failure": "The Contract fails.",
    "dramaticFailure": "One point of damage upgrades from bashing to lethal, or lethal to aggravated if all are already lethal. The changeling may pay an extra point of Willpower to prevent this, if the upgraded damage would kill his patient."
  },
  "ctl-2ed:pandoras-gift": {
    "description": "When the changeling pays the Contract’s cost, the target must touch a tool or material the changeling will use in the crafting, although it could be anything from an incidental brush to an attack. If he uses a power that negates the need for tools, the target must touch him instead. He then shapes his target’s desires into an object using the Build Equipment rules (p. 196), starting within one hour of the touch. The changeling may not know what he’s making, but his hands move by their own accord. The item can be anything from the key to a lover’s apartment to a weapon capable of slaying a Huntsman, and remains until the sun next crosses the horizon. Halve the usual time it would take to build the object. If the changeling uses the item as a bribe or bargaining chip, he gains three bonus dice on the Social roll; if successful, he regains one point of the Glamour spent on this Contract."
  },
  "ctl-2ed:prince-of-ivy": {
    "description": "Vines shoot out of the ground where the changeling spat, and all nearby plants grow similar tangles at an impossible rate, to ensnare his enemies. For the Contract’s duration, the character may make one new grapple attempt per turn on any target within three yards/meters of a plant instead of moving, in addition to his instant action. He may sacrifice his action to make a second new grapple attempt, and his Defense until his next turn for a third. His contested grapple rolls for ongoing grapples are reflexive. The plants use a dice pool of 3 + successes rolled to invoke this Contract. The effect follows the changeling as he moves.",
    "success": "Vines shoot out of the ground where the changeling spat, and all nearby plants grow similar tangles at an impossible rate, to ensnare his enemies. For the Contract’s duration, the character may make one new grapple attempt per turn on any target within three yards/meters of a plant instead of moving, in addition to his instant action. He may sacrifice his action to make a second new grapple attempt, and his Defense until his next turn for a third. His contested grapple rolls for ongoing grapples are reflexive. The plants use a dice pool of 3 + successes rolled to invoke this Contract. The effect follows the changeling as he moves.",
    "exceptionalSuccess": "Each time a new turn begins at the top of the Initiative order, the plants automatically inflict one point of bashing damage on all grappled targets.",
    "failure": "The Contract fails.",
    "dramaticFailure": "Plants turn against the changeling and his allies, attacking as below on their own Initiative count, for a number of turns equal to the changeling’s Mantle."
  },
  "ctl-2ed:waking-the-inner-fae": {
    "description": "The changeling presents the wreath as a gift to his target, who accepts it and puts it on. It immediately vanishes from sight, but the target gains the Wanton Condition. Once per scene for the rest of the current story, whenever the changeling successfully tempts the target into doing something, he regains a point of Willpower. He may only have one designated target from whom to gain Willpower at a time.",
    "success": "The changeling presents the wreath as a gift to his target, who accepts it and puts it on. It immediately vanishes from sight, but the target gains the Wanton Condition. Once per scene for the rest of the current story, whenever the changeling successfully tempts the target into doing something, he regains a point of Willpower. He may only have one designated target from whom to gain Willpower at a time.",
    "exceptionalSuccess": "The target also gains the Persistent Obsession Condition regarding her current greatest desire.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling cannot give up the crown and wears it himself, pursuing his own desires regardless of risk. He gains the Reckless Condition, and may not regain Willpower via his Thread for the rest of the scene."
  },
  "ctl-2ed:baleful-sense": {
    "description": "The changeling instinctively knows the target’s greatest wrath, and any Conditions or Tilts connected to it. The target may be in denial about his anger, but the changeling can still smell it. The changeling may replace the subject of the wrath with one of her choice. The target’s anger toward the original subject, along with any Conditions or Tilts it engendered, turns toward the new for the scene.",
    "success": "The changeling instinctively knows the target’s greatest wrath, and any Conditions or Tilts connected to it. The target may be in denial about his anger, but the changeling can still smell it. The changeling may replace the subject of the wrath with one of her choice. The target’s anger toward the original subject, along with any Conditions or Tilts it engendered, turns toward the new for the scene.",
    "exceptionalSuccess": "The changeling gleans the details of her target’s anger, such as its origins and what’s holding him back from destroying the source of it. She may coax him into physically attacking the source without a roll, as long as the target doesn’t believe such an attack is suicidal.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling becomes so angry she suffers a two-die penalty on the next (Mantle) rolls she makes."
  },
  "ctl-2ed:child-of-the-hearth": {
    "description": "At the changeling’s behest, the sun’s warmth either fills or withdraws from the area, inflicting the Environmental Extreme Heat or Extreme Cold Tilt on the area the size of a large room; the changeling is immune to the effects of either. At the same time, the sun’s rays bring the changeling’s own temperature up or down, removing the Personal Extreme Heat or Extreme Cold Tilt if the changeling suffers either. This Contract still works indoors, at night, or under other circumstances when the sun isn’t visible - the sun’s warmth still remains, after all, and even these fading sparks come to the changeling’s aid."
  },
  "ctl-2ed:helios-light": {
    "description": "The character declares herself a child of the sun - where she walks, so goes the heavenly body. At that, a light spreads from her sternum to envelop her body until she is painful to look at. The light illuminates an area around her with a diameter of up to (Mantle x 20) yards/meters, and anyone looking directly at her gains the Blinded Tilt (both eyes). The light is true sunlight, but channeling it through a body of flesh diminishes some of its power: Creatures harmed by sunlight take half the damage they normally would, rounded down."
  },
  "ctl-2ed:high-summers-zeal": {
    "description": "Whenever a foe tries to flee a violent conflict once it’s already begun, the changeling may invoke this Contract to force that foe to spend one Willpower first; otherwise, the target must continue to oppose her until it becomes impossible. He can still back off to make ranged attacks or similar, but can’t take any actions that don’t support trying to win. He can’t suffer the Beaten Down Tilt for the duration.",
    "success": "Whenever a foe tries to flee a violent conflict once it’s already begun, the changeling may invoke this Contract to force that foe to spend one Willpower first; otherwise, the target must continue to oppose her until it becomes impossible. He can still back off to make ranged attacks or similar, but can’t take any actions that don’t support trying to win. He can’t suffer the Beaten Down Tilt for the duration.",
    "exceptionalSuccess": "The target can’t back off even to make ranged attacks, and must stay within five yards/ meters of the changeling.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling’s challenge prompts Summer to back the underdog instead and prolong the fight; her target heals (the changeling’s Mantle) points of damage and gains +1 Initiative."
  },
  "ctl-2ed:vigilance-of-ares": {
    "description": "The changeling has sworn herself to Summer, and its relentless battle against the Gentry. She expects violence at every turn, automatically detecting ambushes, hidden traps, and surprise attacks. She gains a bonus to Initiative equal to her Mantle rating."
  },
  "ctl-2ed:fiery-tongue": {
    "description": "The power of the changeling’s rebuke inflicts her rolled successes as points of bashing damage, or lethal against fae beings. It also removes two Doors in Social maneuvering, but worsens the target’s impression of the character to hostile immediately.",
    "success": "The power of the changeling’s rebuke inflicts her rolled successes as points of bashing damage, or lethal against fae beings. It also removes two Doors in Social maneuvering, but worsens the target’s impression of the character to hostile immediately.",
    "exceptionalSuccess": "The changeling’s rebuke deals lethal damage instead, or aggravated to fae beings.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling’s tongue ties itself up in angry knots, and she gains the Mute Condition, which resolves at the end of the scene."
  },
  "ctl-2ed:flames-of-summer": {
    "description": "The changeling seems to grow in stature and wrath, and adds two bonus dice to all Physical rolls for the duration. She also ignores wound penalties, and need not roll Stamina to remain conscious if her last Health box fills with damage.",
    "success": "The changeling seems to grow in stature and wrath, and adds two bonus dice to all Physical rolls for the duration. She also ignores wound penalties, and need not roll Stamina to remain conscious if her last Health box fills with damage.",
    "exceptionalSuccess": "Flames surround the changeling, giving her unarmed attacks an additional +1L weapon modifier.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The Contract drains the target, leaving her at Strength 1 for (Mantle) turns."
  },
  "ctl-2ed:helios-judgment": {
    "description": "The sunbeam functions as a thrown weapon with the following traits: Damage (Mantle)L, Ranges 10/30/50 yards/meters, Initiative penalty −2, Strength minimum 2, Size 4. If the player also spends one point of Willpower, the damage is aggravated instead. The beam returns to her hand at the beginning of each turn for the Contract’s duration, and is true sunlight in all ways.",
    "success": "The sunbeam functions as a thrown weapon with the following traits: Damage (Mantle)L, Ranges 10/30/50 yards/meters, Initiative penalty −2, Strength minimum 2, Size 4. If the player also spends one point of Willpower, the damage is aggravated instead. The beam returns to her hand at the beginning of each turn for the Contract’s duration, and is true sunlight in all ways.",
    "exceptionalSuccess": "The beam also inflicts the Knocked Down Tilt on a successful hit.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling collects the sunbeam, and accidentally drops it to the ground, causing the Earthquake Tilt."
  },
  "ctl-2ed:solstice-revelation": {
    "description": "The changeling floods an area around her with a radius of 30 yards/meters with light. Any characters currently hidden or disguised through mundane means must succeed on a Manipulation + Wyrd roll with a dice penalty equal to the changeling’s Mantle, or lose their obfuscation. New attempts to hide are impossible under the bright light. Creatures using supernatural powers to hide trigger a Clash of Wills with the changeling. Even the Mask weakens, and anyone can make a perception roll with Wits + Composure to see through it."
  },
  "ctl-2ed:sunburnt-heart": {
    "description": "Inflict the Berserk Condition on the foe, and gain (the changeling’s Mantle) bonus dice to any attempt to direct his fury onto a target other than the changeling herself.",
    "success": "Inflict the Berserk Condition on the foe, and gain (the changeling’s Mantle) bonus dice to any attempt to direct his fury onto a target other than the changeling herself.",
    "exceptionalSuccess": "The changeling may affect a second target as well; each target contests the invocation roll separately.",
    "failure": "The Contract fails.",
    "dramaticFailure": "All the changeling accomplishes is pissing her opponent off the usual way; the target achieves exceptional success on three successes instead of five on the next action he takes against her."
  },
  "ctl-2ed:autumns-fury": {
    "description": "The changeling breathes out, and out, until a thunderstorm forms from his breath that inflicts the Heavy Rain and Heavy Wind Tilts, for 2 Glamour. For an extra point of Glamour, the storm also strikes foes with lightning; the changeling’s player reflexively rolls Presence + Occult − Defense as an attack against anyone (other than the changeling himself) caught in the area at the beginning of each of their turns. These attacks have a weapon modifier of 1L. The changeling can affect an area up to (Mantle x 20) yards/meters. Standing in the eye of the storm, he himself suffers no ill effects, and it moves as he does."
  },
  "ctl-2ed:last-harvest": {
    "description": "The character whispers to a target softly, telling her secrets he heard from the autumn wind. He gains the 9-again quality on his next roll to harvest Glamour from that target, or 8-again if it resonates with his court. He may only use this Contract once per chapter."
  },
  "ctl-2ed:tale-of-the-baba-yaga": {
    "description": "Making eye contact with his audience, the changeling inflicts the Shaken Condition on one, some, or all of them, at his option.",
    "success": "Making eye contact with his audience, the changeling inflicts the Shaken Condition on one, some, or all of them, at his option.",
    "exceptionalSuccess": "Anyone affected by this Contract also must spend a Willpower point to act against the changeling for the duration.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling scares himself and gains the Shaken Condition."
  },
  "ctl-2ed:twilights-harbinger": {
    "description": "The character chooses a currently extant circumstance or event when she invokes the Contract, such as another supernatural power, a meeting, an affair, or even a life. 13 minutes before the chosen circumstance or event ends, or three turns in an action scene, a creature of omens visits the changeling no matter where she is at the time to warn her. It might be a black cat or hound, a bat, a raven, an owl, or any other animal the changeling’s culture considers ominous."
  },
  "ctl-2ed:witches-intuition": {
    "description": "The changeling learns the subject’s greatest fear, and any Conditions or Tilts connected to it. This fear can even be subconscious. The changeling may choose to replace this fear with one of his choice. The target’s fright of the original subject, along with any Conditions or Tilts it engendered, turns toward the new one for the scene.",
    "success": "The changeling learns the subject’s greatest fear, and any Conditions or Tilts connected to it. This fear can even be subconscious. The changeling may choose to replace this fear with one of his choice. The target’s fright of the original subject, along with any Conditions or Tilts it engendered, turns toward the new one for the scene.",
    "exceptionalSuccess": "The Contract reveals the circumstances that caused the fear, and what would worsen or lessen it.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling tells the target one of his own fears that she didn’t know yet."
  },
  "ctl-2ed:famines-bulwark": {
    "description": "For each success on the invocation roll, the player may ask the Storyteller one yes-or-no question about the current situation and receive true answers to all but one of them - one answer is always false, unless he only rolls one success.",
    "success": "For each success on the invocation roll, the player may ask the Storyteller one yes-or-no question about the current situation and receive true answers to all but one of them - one answer is always false, unless he only rolls one success.",
    "exceptionalSuccess": "All of the answers are true. In addition, the changeling also gleans the path toward the nearest non-fae supernatural phenomenon or being. He doesn’t know its location, but his instincts take him there, as long as he makes the journey within the same scene that he invoked the Contract.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The Storyteller gives the player a false omen, about which the changeling gains the temporary Obsession Condition, which resolves when he lands himself or his allies in hot water pursuing the specious doom."
  },
  "ctl-2ed:mien-of-the-baba-yaga": {
    "description": "When the changeling comes into the target’s line of sight, she sees him as her greatest fear. She instantly gains the Frightened Condition, and must spend a point of Willpower to take any action that requires dice for the duration. Changeling targets may suffer an attack on their Clarity, at their players’ (or the Storyteller’s) discretion, depending on the fear evoked. The changeling may let observers also see him as the target’s greatest fear, and they react accordingly.",
    "success": "When the changeling comes into the target’s line of sight, she sees him as her greatest fear. She instantly gains the Frightened Condition, and must spend a point of Willpower to take any action that requires dice for the duration. Changeling targets may suffer an attack on their Clarity, at their players’ (or the Storyteller’s) discretion, depending on the fear evoked. The changeling may let observers also see him as the target’s greatest fear, and they react accordingly.",
    "exceptionalSuccess": "The target also gains the Immobilized Tilt for a number of turns equal to the changeling’s Mantle.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling believes the target is his greatest fear, and gains the Spooked Condition."
  },
  "ctl-2ed:riding-the-falling-leaves": {
    "description": "The changeling transforms into a spray of autumn leaves in all the colors of earth and fire. He is a single entity, and resistant to scattering. He may Dodge reflexively once per turn, except against attacks that could reasonably harm a pile of leaves, such as flames or supernatural winds. If he successfully Dodges an attack this way, he may spend another point of Glamour to inflict the Spooked Condition on his opponent. He can fly at his usual Speed −3, and can flatten his body to slip through small openings. He cannot manipulate objects or physically attack.",
    "success": "The changeling transforms into a spray of autumn leaves in all the colors of earth and fire. He is a single entity, and resistant to scattering. He may Dodge reflexively once per turn, except against attacks that could reasonably harm a pile of leaves, such as flames or supernatural winds. If he successfully Dodges an attack this way, he may spend another point of Glamour to inflict the Spooked Condition on his opponent. He can fly at his usual Speed −3, and can flatten his body to slip through small openings. He cannot manipulate objects or physically attack.",
    "exceptionalSuccess": "The character may fly at his full Speed. He can also \"pick up\" and carry through the air a number of objects equal to his Mantle, each no larger than Size 1.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling coughs up leaves, caught halfway to transformation, and suffers the Immobilized Tilt for (Mantle) turns."
  },
  "ctl-2ed:sorcerers-rebuke": {
    "description": "The target loses points of Glamour or another supernatural power source equal to successes rolled to invoke this Contract.",
    "success": "The target loses points of Glamour or another supernatural power source equal to successes rolled to invoke this Contract.",
    "exceptionalSuccess": "The changeling also inflicts the Cowed Condition on the target regarding himself.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling becomes overwhelmed by his foe’s power, gaining the Spooked Condition."
  },
  "ctl-2ed:tasting-the-harvest": {
    "description": "The targets become immune to natural fear, and gain the changeling’s Mantle rating in bonus dice to contest supernatural fear effects. He may direct their newfound courage against a thing that would scare them, and grant them one bonus die on actions against that target.",
    "success": "The targets become immune to natural fear, and gain the changeling’s Mantle rating in bonus dice to contest supernatural fear effects. He may direct their newfound courage against a thing that would scare them, and grant them one bonus die on actions against that target.",
    "exceptionalSuccess": "The targets achieve exceptional success on three successes rather than five when contesting supernatural fear effects. Their attacks, as directed by the changeling, increase their usual weapon modifiers by one.",
    "failure": "The Contract fails.",
    "dramaticFailure": "Each target gains the Shaken Condition."
  },
  "ctl-2ed:the-dragon-knows": {
    "description": "The changeling can taste the target’s sorrow and learns his deepest regret, and any Conditions or Tilts connected to it. This regret can even be subconscious or forgotten. The changeling may replace the subject of the regret with one of her choice. The target’s sorrow for the original loss, along with any Conditions or Tilts it engendered, turns toward the new subject for the scene.",
    "success": "The changeling can taste the target’s sorrow and learns his deepest regret, and any Conditions or Tilts connected to it. This regret can even be subconscious or forgotten. The changeling may replace the subject of the regret with one of her choice. The target’s sorrow for the original loss, along with any Conditions or Tilts it engendered, turns toward the new subject for the scene.",
    "exceptionalSuccess": "Gain a two-die bonus to any Social roll you make to shatter the target’s hopes for the Contract’s duration.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling suffers the Demoralized Condition."
  },
  "ctl-2ed:heart-of-ice": {
    "description": "The changeling’s skin takes on a pallid blue color, radiating out from her chest until she looks frozen. She becomes immune to all effects and expressions of cold, all Environmental Tilts except those based on heat, and damage that consists only of ice or cold with no other physical component. This Contract affects both mundane and supernatural cold. The changeling’s heart is literally frozen for the duration, making her immune to attacks that specifically target the heart (p. 184) as well. She can’t gain any emotional Conditions, such as Frightened, Inspired, Steadfast, or Swooned."
  },
  "ctl-2ed:ice-queens-call": {
    "description": "The changeling calls on Hedge ghosts of winter, shards of cold and souls frozen in eternal winterlands, and spits on the floor. Her spittle immediately freezes, becoming the center of a cold spot that grows in size until an area out to (Mantle x 20) yards/meters suffers the Blizzard Tilt. The changeling herself is immune to the effects. Mournful, indecipherable whispers sound through the air while this Contract is in effect."
  },
  "ctl-2ed:slipknot-dreams": {
    "description": "The changeling soothes her target’s regrets, though not the memory of their source. The target still knows his marriage failed, but now believes it was for the better. The target gains the Swooned Condition with regard to the changeling.",
    "success": "The changeling soothes her target’s regrets, though not the memory of their source. The target still knows his marriage failed, but now believes it was for the better. The target gains the Swooned Condition with regard to the changeling.",
    "exceptionalSuccess": "The changeling may also spend a point of Willpower to suppress or alter the memory of the event that caused regret, effectively erasing it from the target’s mind or changing it to have included her in it as a positive force. This effect is permanent unless reversed by other supernatural means.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The subject refuses to speak to the changeling willingly for a full chapter."
  },
  "ctl-2ed:touch-of-winter": {
    "description": "The changeling touches the surface of a body of water with her hand. Frost spreads out from her fingertips, flash freezing an area with a diameter of five yards/meters radiating from the changeling. The effect keeps spreading, adding five more yards/meters of diameter to the frozen area each turn, as long as the changeling maintains contact. The frozen surface can support a number of people equal to the changeling’s Mantle as they cross. The ice starts to melt naturally when the Contract ends.",
    "success": "The changeling touches the surface of a body of water with her hand. Frost spreads out from her fingertips, flash freezing an area with a diameter of five yards/meters radiating from the changeling. The effect keeps spreading, adding five more yards/meters of diameter to the frozen area each turn, as long as the changeling maintains contact. The frozen surface can support a number of people equal to the changeling’s Mantle as they cross. The ice starts to melt naturally when the Contract ends.",
    "exceptionalSuccess": "The character may either instantly return the frozen liquid to its original form at any time, or impose the Ice Tilt at any time, which doesn’t affect her.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The character suffers (Mantle) points of bashing damage due to frostbite."
  },
  "ctl-2ed:ermines-winter-coat": {
    "description": "The changeling blends in with whatever she’s near, becoming difficult to see clearly. She gains +3 to Stealth rolls and inflicts a −3 on attacks against her. As long as she’s in the company of at least a few non-fae beings, she halves her Wyrd rating (rounded down) for purposes of the bonus other fae beings gain to track or find her, and gains +3 to Clashes Wonder of Wills to seem mortal when she strengthens her Mask. This Contract immediately ends if she drops her Mask."
  },
  "ctl-2ed:fallow-fields": {
    "description": "The target suddenly can’t remember what love feels like. He becomes unable to regain Willpower through his Virtue or Vice (or equivalent traits), and gains the Broken Condition.",
    "success": "The target suddenly can’t remember what love feels like. He becomes unable to regain Willpower through his Virtue or Vice (or equivalent traits), and gains the Broken Condition.",
    "exceptionalSuccess": "The target feels the loss again at a time of the changeling’s choosing, within the same story, regaining the Broken Condition at a spoken word from her.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling gains the Broken Condition."
  },
  "ctl-2ed:field-of-regret": {
    "description": "The changeling directs the ghosts to any targets she can see. The dead assail the living by passing through them, infecting them with unbearable loneliness and inflicting the invocation roll’s successes as points of lethal damage. Each target also loses one Willpower point.",
    "success": "The changeling directs the ghosts to any targets she can see. The dead assail the living by passing through them, infecting them with unbearable loneliness and inflicting the invocation roll’s successes as points of lethal damage. Each target also loses one Willpower point.",
    "exceptionalSuccess": "The targets lose two Willpower points instead.",
    "failure": "The Contract fails.",
    "dramaticFailure": "Sorrow overwhelms the changeling, who gains the Disoriented Condition."
  },
  "ctl-2ed:mantle-of-frost": {
    "description": "The changeling wraps herself in Winter’s embrace to strike at her enemies."
  },
  "ctl-2ed:winters-curse": {
    "description": "The target’s heart is frozen solid. He can’t participate in teamwork actions, spend Willpower, gain Willpower through his Thread or Virtue (or equivalent anchor), or suffer breaking points. He cares nothing for his allies or his Aspirations, abandoning them immediately. All impressions are Average for purposes of Social maneuvering against him, and can’t be changed; supernatural powers that would do so prompt a Clash of Wills. The exception is the changeling herself, who can improve her impression in the usual ways and gains bonus dice equal to her Mantle on Social rolls against him. If the target would suffer a breaking point during the Contract’s duration, it catches up to him afterward.",
    "success": "The target’s heart is frozen solid. He can’t participate in teamwork actions, spend Willpower, gain Willpower through his Thread or Virtue (or equivalent anchor), or suffer breaking points. He cares nothing for his allies or his Aspirations, abandoning them immediately. All impressions are Average for purposes of Social maneuvering against him, and can’t be changed; supernatural powers that would do so prompt a Clash of Wills. The exception is the changeling herself, who can improve her impression in the usual ways and gains bonus dice equal to her Mantle on Social rolls against him. If the target would suffer a breaking point during the Contract’s duration, it catches up to him afterward.",
    "exceptionalSuccess": "The changeling may also choose one other character present in the scene, changing their impression with the target to Hostile and inflicting a penalty equal to her Mantle rating on that character’s Social rolls against the target.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling freezes her own heart instead, gaining the Stoic Condition."
  },
  "ctl-2ed:blessing-of-forgetfulness": {
    "description": "The changeling pulls away the memory of a single continuous incident, sticking to her fingers like cobwebs. The memory could be of a conversation, gunfight, or another event lasting no longer than one scene. The target’s mind creates a false, plausible, and harmless memory to replace the erased one. The changeling may make suggestions, such as \"you stayed in to watch TV,\" but ultimately the target’s own mind does the work. This Contract removes memories permanently, but conclusive evidence the event did happen can convince the target he forgot about it. The Storyteller determines what constitutes conclusive evidence.",
    "success": "The changeling pulls away the memory of a single continuous incident, sticking to her fingers like cobwebs. The memory could be of a conversation, gunfight, or another event lasting no longer than one scene. The target’s mind creates a false, plausible, and harmless memory to replace the erased one. The changeling may make suggestions, such as \"you stayed in to watch TV,\" but ultimately the target’s own mind does the work. This Contract removes memories permanently, but conclusive evidence the event did happen can convince the target he forgot about it. The Storyteller determines what constitutes conclusive evidence.",
    "exceptionalSuccess": "No amount of mundane persuasion or evidence can convince the target the event happened.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The Contract turns against the changeling, who forgets the last five minutes."
  },
  "ctl-2ed:glib-tongue": {
    "description": "The changeling didn’t have to buy deception from a goblin - he owned that already. Rather, he bought gullibility to wield against his targets. The changeling perfectly tells one lie to a mortal, who believes him as long Wonder as it’s not demonstrably false. Used against a supernatural target, this Contract adds the changeling’s Wyrd as bonus dice to the player’s Subterfuge roll, to a maximum of +5."
  },
  "ctl-2ed:goblins-eye": {
    "description": "The changeling’s kenning (p. 107) may now trigger Clashes of Wills to see through any magical concealment. Each concealed phenomenon requires its own Clash. The player can also ask her Storyteller one of the following questions per success rolled about any one supernatural subject the changeling uncovered via kenning: • What is the true nature of this magic? (as kenning exceptional success) • What is one weakness, bane, loophole, or catch this phenomenon possesses? (repeatable with more successes) • How do I activate this token or effect? • How long will this phenomenon last? • With which Regalia does this phenomenon most closely align? • What is the power level of the phenomenon relative to my Wyrd? • Is there a promise, debt, or oath directly associated with this phenomenon? (e.g. oath-forged tokens, magic performed for a price, Hedge denizens created via Goblin Debt, etc.)"
  },
  "ctl-2ed:goblins-luck": {
    "description": "The changeling bought a wishbone from a goblin. They broke it and the goblin got the bigger half, but even so he’s been exceptionally lucky since. He can make a random guess when a finite number of possibilities exists, and it pays off: He wins $25 on a scratch ticket, or picks the right street of four his quarry might have fled down. This Contract only grants small instances of luck."
  },
  "ctl-2ed:huntsmans-clarion": {
    "description": "The changeling automatically knows whenever a True Fae, a Huntsman, another kind of Arcadian denizen (not Hedge denizen), or her own fetch is within a number of miles equal to her Wyrd, though not where it is. Though she must invoke this Contract in the Hedge, she needn’t stay there for the duration.",
    "success": "The changeling automatically knows whenever a True Fae, a Huntsman, another kind of Arcadian denizen (not Hedge denizen), or her own fetch is within a number of miles equal to her Wyrd, though not where it is. Though she must invoke this Contract in the Hedge, she needn’t stay there for the duration.",
    "exceptionalSuccess": "The Contract lasts until the sun next crosses the horizon.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The changeling gains the Hunted Condition, pursued by an agent of the Fae - or perhaps even her own Keeper."
  },
  "ctl-2ed:lost-visage": {
    "description": "The changeling gave a piece of himself to a goblin in trade, and now he feels more and more pieces slipping away. Slipping away has its benefits though: The changeling can invoke this Contract immediately when a scene ends, to erase himself from any mortal memories of it. They forget what he looked like, and recall his name not even remotely right. This Contract even works on supernatural targets, if the changeling’s player beats them in a Clash of Wills. The True Fae and the Huntsmen are immune to this Contract."
  },
  "ctl-2ed:mantle-mask": {
    "description": "The changeling bought a piece of treachery from a goblin. She can dim her own Mantle and assume another court’s up to the rating of her true Mantle, or appear to have no Mantle at all. These changes are only cosmetic, making the changeling appear as a member of another court, or courtless."
  },
  "ctl-2ed:sight-of-truth-and-lies": {
    "description": "The changeling purchased the burden of truth from a goblin. He recognizes any mundane lie spoken in his presence, though the Contract does not reveal what the truth is. He can’t tell lies himself, but is under no compulsion to offer the truth either. If he does lie, the Contract ends. Supernatural deceptions prompt a Clash of Wills. For this Contract, what matters is whether or not the person saying the statement believes it is true."
  },
  "ctl-2ed:uncanny": {
    "description": "The changeling bought the luck of the hapless from a goblin. Her next mundane action that is neither resisted nor contested gains the rote quality - including single rolls within extended actions (though this doesn’t negate the time involved)."
  },
  "ctl-2ed:wayward-guide": {
    "description": "The changeling bought a bad sense of direction from a goblin. He can use it to alter signs in his path, inflicting the Lost Condition on one mortal per Glamour point spent. If he targets himself, supernatural creatures tracking him must beat his player in a Clash of Wills or lose the scent for the scene."
  },
  "ctl-kith-kin:frail-as-the-dying-word": {
    "description": "Inflict one of the changeling's minor frailties on the target. If the target already possesses it, it becomes major for the duration; if the target already possesses a major version, the Contract does not function.",
    "success": "The target gains one of the changeling's minor frailties; an existing instance becomes major for the duration. The changeling does not lose the frailty he inflicts.",
    "exceptionalSuccess": "Inflict one major frailty or two minor frailties instead; iron counts as a major frailty.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The Wyrd catches the forgery and inflicts a new major frailty on the changeling for the scene."
  },
  "ctl-kith-kin:fake-it-til-you-make-it": {
    "description": "Make a proclamation audible within 10 yards and temporarily change the mundane world as though Hedgespinning, provided the proclamation's emotional tenor matches the desired changes. Spend invocation successes on subtle shifts; shifts affecting Hedge navigation may also affect mundane actions.",
    "success": "Spend invocation successes on subtle shifts in reality. Gross alterations to people or carried objects are resisted, even by willing targets, and cannot instantly annihilate a character.",
    "exceptionalSuccess": "In addition to the successes rolled, gain 1 Glamour and 1 Willpower to spend on subtle or paradigm shifts.",
    "failure": "The Contract fails.",
    "dramaticFailure": "As with a Hedgespinning failure, the invocation incites Bedlam in everyone present, including the changeling."
  },
  "ctl-kith-kin:straight-on-til-morning": {
    "description": "Become tireless for the journey: go without rest or food and suffer no Environmental Tilts along the way. Navigation rolls on the Wishing Roads gain 8-again."
  },
  "ctl-kith-kin:star-light-star-bright": {
    "description": "For 1 Glamour, learn a wish the target made within the last month; without a target, learn a random person's wish within one mile. Fulfill it by the end of the story or gain the Persistent Oathbreaker Condition. The changeling may interpret the wish with artistic license but cannot exceed her own limitations. For 1 additional Glamour, attach a drawback to the granted wish."
  },
  "ctl-dark-eras:draw-likeness": {
    "description": "Name a specific or general crime and render the person sought on any flat surface. The likeness makes matching the face easier and grants a free Clue about the target's whereabouts or recent activity; for a general crime, it depicts the nearest person who committed it within the last lunar month.",
    "success": "Render the target's likeness. Rolls to match it to a face gain the rote quality, and anyone examining it for the first time gains a free Clue about the target's whereabouts or recent activity.",
    "exceptionalSuccess": "Anyone viewing the likeness immediately remembers when and where they last saw the target; supernatural interference prompts a Clash of Wills. The image also hints at the target's future whereabouts or activity and grants the Informed Condition regarding the criminal.",
    "failure": "The Contract fails.",
    "dramaticFailure": "The intended target realizes the changeling is hunting him and gains information about her as though she were the target of an exceptionally successful invocation."
  },
  "ctl-hedge:distill-the-hidden": {
    "description": "Turn a personally meaningful ephemeral experience, such as true love's kiss or a baby's first laugh, into a representative physical object. The target must have witnessed or participated in the event and must willingly participate in the Contract. The target loses the memory; other meaningful participants suffer Ravaged or another appropriate effect."
  },
  "ctl-hedge:wyrd-debt": {
    "description": "Inflict a Condition whose normal resolution is replaced by paying the debt: Amnesia, Bestial, Blinded, Delusional, Dream Assailant, Fatigued, Glamour Addicted, Hunted, Lethargic, Madness, Mute, or Paranoid."
  }
} as const;
