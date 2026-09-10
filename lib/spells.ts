// Generated from the offline Codex of Darkness Spells, All (2nd Edition) page.
// English is canonical; localization is intentionally deferred.
export interface SpellDefinition { id:string; name:string; originalName:string; requirements:Record<string,number>; practice:string; primaryFactor:string; withstand:string; roteSkills:string[]; description?:string; summary?:string; summaryReviewed?:boolean; sourceId:string; source:string; page:number; additionalSources?:Array<{sourceId:string;source:string;page:number}> }
export const SPELLS: SpellDefinition[] = [
  {
    "id": "mta-2ed:death-1-ectoplasmic-shaping",
    "name": "Ectoplasmic Shaping",
    "originalName": "Ectoplasmic Shaping",
    "requirements": {
      "Death": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Larceny"
    ],
    "description": "Reshape an ectoplasmic manifestation into any desired form for the Duration; its controller may Withstand. The ectoplasm can reflect ghosts and ghostly Twilight structures, or give an object or location the Open Condition for a ghost, which loses its Manifested Condition when the spell ends.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 128,
    "summaryReviewed": true,
    "summary": "Reshape an ectoplasmic manifestation into any desired form for the Duration; its controller may Withstand. The ectoplasm can reflect ghosts and ghostly Twilight structures, or give an object or location the Open Condition for a ghost, which loses its Manifested Condition when the spell ends."
  },
  {
    "id": "mta-2ed:death-1-deepen-shadows",
    "name": "Deepen Shadows",
    "originalName": "Deepen Shadows",
    "requirements": {
      "Death": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Intimidation",
      "Expression"
    ],
    "description": "Deepen existing shadows throughout the area, applying the Poor Light Tilt for the Duration. +1 Reach: Apply the Blinded Tilt instead.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 128,
    "summaryReviewed": true,
    "summary": "Deepen existing shadows throughout the area, applying the Poor Light Tilt for the Duration."
  },
  {
    "id": "mta-2ed:death-1-forensic-gaze",
    "name": "Forensic Gaze",
    "originalName": "Forensic Gaze",
    "requirements": {
      "Death": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Investigation",
      "Expression"
    ],
    "description": "Determine exactly how and when a corpse died, revealing one contributing factor per Potency. +1 Reach: Witness one minute per Potency of the corpse's final moments through its eyes.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 128,
    "summaryReviewed": true,
    "summary": "Determine exactly how and when a corpse died, revealing one contributing factor per Potency."
  },
  {
    "id": "mta-2ed:death-1-shadow-sculpting",
    "name": "Shadow Sculpting",
    "originalName": "Shadow Sculpting",
    "requirements": {
      "Death": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Science",
      "Expression"
    ],
    "description": "Mold existing shadows in the area into any chosen likeness. +1 Reach: Animate the shaped shadows, which move under the caster's direction at her Speed.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 128,
    "summaryReviewed": true,
    "summary": "Mold existing shadows in the area into any chosen likeness."
  },
  {
    "id": "mta-2ed:death-1-soul-marks",
    "name": "Soul Marks",
    "originalName": "Soul Marks",
    "requirements": {
      "Death": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Medicine",
      "Occult",
      "Empathy"
    ],
    "description": "Determine one fact about a subject's soul per Potency: Persistent or Paradox Conditions, Awakened or supernatural nature, soul stones, tampering, Possession, Gnosis 5+ Legacy Attainments, or consumption of another soul. +1 Reach: Examine an unattached soul and also detect its former host's Gnosis 1-4 Legacy Attainments.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 128,
    "summaryReviewed": true,
    "summary": "Determine one fact about a subject's soul per Potency: Persistent or Paradox Conditions, Awakened or supernatural nature, soul stones, tampering, Possession, Gnosis 5+ Legacy Attainments, or consumption of another soul."
  },
  {
    "id": "mta-2ed:death-1-speak-with-the-dead",
    "name": "Speak with the Dead",
    "originalName": "Speak with the Dead",
    "requirements": {
      "Death": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Socialize",
      "Expression",
      "Investigation"
    ],
    "description": "Sense and speak with ghosts in Twilight within the area, sense Anchors, and focus on one ghost to determine its Rank and number of Anchors. +1 Reach: Distinguish temporary from permanent Anchors. +1 Reach: Communicate across language barriers with Rank 2+ ghosts.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 128,
    "summaryReviewed": true,
    "summary": "Sense and speak with ghosts in Twilight within the area, sense Anchors, and focus on one ghost to determine its Rank and number of Anchors."
  },
  {
    "id": "mta-2ed:death-2-corpse-mask",
    "name": "Corpse Mask",
    "originalName": "Corpse Mask",
    "requirements": {
      "Death": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Subterfuge",
      "Crafts",
      "Medicine"
    ],
    "description": "Alter a corpse's wounds and apparent time and cause of death, even under scrutiny. +1 Reach: Disguise injuries on a living subject who has suffered Health damage. +1 Reach: Completely change a corpse's appearance, including apparent age and sex.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129,
    "summaryReviewed": true,
    "summary": "Alter a corpse's wounds and apparent time and cause of death, even under scrutiny."
  },
  {
    "id": "mta-2ed:death-2-decay",
    "name": "Decay",
    "originalName": "Decay",
    "requirements": {
      "Death": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Subterfuge",
      "Science",
      "Occult"
    ],
    "description": "Age a material object rapidly, reducing Durability by 1 per Potency. +1 Reach: Reduce Structure by Potency instead, potentially destroying it.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129,
    "summaryReviewed": true,
    "summary": "Age a material object rapidly, reducing Durability by 1 per Potency."
  },
  {
    "id": "mta-2ed:death-2-ectoplasm",
    "name": "Ectoplasm",
    "originalName": "Ectoplasm",
    "requirements": {
      "Death": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Expression",
      "Academics"
    ],
    "description": "Produce ectoplasm from the caster's or a corpse's orifice and shape it as desired; it retains that form for the Duration.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129,
    "summaryReviewed": true,
    "summary": "Produce ectoplasm from the caster's or a corpse's orifice and shape it as desired; it retains that form for the Duration."
  },
  {
    "id": "mta-2ed:death-2-ghost-shield",
    "name": "Ghost Shield",
    "originalName": "Ghost Shield",
    "requirements": {
      "Death": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Streetwise",
      "Subterfuge",
      "Survival"
    ],
    "description": "Protect the subject from ghostly Numina, Influences, Manifestations, Death spells, and comparable death-based supernatural powers; attempts to penetrate the shield trigger a Clash of Wills. +1 Reach: Extend protection to ghosts' physical attacks.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129,
    "summaryReviewed": true,
    "summary": "Protect the subject from ghostly Numina, Influences, Manifestations, Death spells, and comparable death-based supernatural powers; attempts to penetrate the shield trigger a Clash of Wills."
  },
  {
    "id": "mta-signs-of-sorcery:death-2-sacrificial-relinquishment",
    "name": "Sacrificial Relinquishment",
    "originalName": "Sacrificial Relinquishment",
    "requirements": {
      "Death": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Intimidation",
      "Medicine",
      "Streetwise"
    ],
    "description": "While the spell remains active, the subject may safely relinquish her next spell by making a valuable blood sacrifice instead of spending a Willpower dot: dozens of small unintelligent creatures, a few intelligent animals, or one human.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 73,
    "summaryReviewed": true,
    "summary": "While the spell remains active, the subject may safely relinquish her next spell by making a valuable blood sacrifice instead of spending a Willpower dot: dozens of small unintelligent creatures, a few intelligent animals, or one human."
  },
  {
    "id": "mta-2ed:death-2-shape-ephemera",
    "name": "Shape Ephemera",
    "originalName": "Shape Ephemera",
    "requirements": {
      "Death": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Science"
    ],
    "description": "Reshape Death-attuned ephemera into a new object; an entity providing the ephemera may Withstand, and reshaping does not damage its Corpus. The object has Durability 2 and either weapon rating 2 or armor 2, and functions only against ephemera or in Twilight.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129,
    "summaryReviewed": true,
    "summary": "Reshape Death-attuned ephemera into a new object; an entity providing the ephemera may Withstand, and reshaping does not damage its Corpus. The object has Durability 2 and either weapon rating 2 or armor 2, and functions only against ephemera or in Twilight."
  },
  {
    "id": "mta-2ed:death-2-soul-armor",
    "name": "Soul Armor",
    "originalName": "Soul Armor",
    "requirements": {
      "Death": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Occult",
      "Survival"
    ],
    "description": "Protect the subject's soul; any spell or effect that would remove, manipulate, or injure it must win a Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129,
    "summaryReviewed": true,
    "summary": "Protect the subject's soul; any spell or effect that would remove, manipulate, or injure it must win a Clash of Wills."
  },
  {
    "id": "mta-2ed:death-2-soul-jar",
    "name": "Soul Jar",
    "originalName": "Soul Jar",
    "requirements": {
      "Death": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Persuasion"
    ],
    "description": "Seal a displaced soul in a liquid-holding receptacle, protecting it from escape and outside attack until the jar opens, breaks, or the spell ends. +1 Reach: Bind it to the caster or a Soulless, Enervated, or Thrall subject; unwilling hosts Withstand. +2 Reach and 1 Mana: Make the binding Lasting.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129,
    "summaryReviewed": true,
    "summary": "Seal a displaced soul in a liquid-holding receptacle, protecting it from escape and outside attack until the jar opens, breaks, or the spell ends."
  },
  {
    "id": "mta-2ed:death-2-suppress-aura",
    "name": "Suppress Aura",
    "originalName": "Suppress Aura",
    "requirements": {
      "Death": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Subterfuge",
      "Intimidation",
      "Medicine"
    ],
    "description": "Suppress the subject's Nimbus and magical resonances, making her appear to be a Sleeper under Mage Sight and imposing -2 on Empathy and supernatural attempts to read her emotions or mind. Magical attempts to pierce the disguise trigger a Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 129,
    "summaryReviewed": true,
    "summary": "Suppress the subject's Nimbus and magical resonances, making her appear to be a Sleeper under Mage Sight and imposing -2 on Empathy and supernatural attempts to read her emotions or mind. Magical attempts to pierce the disguise trigger a Clash of Wills."
  },
  {
    "id": "mta-2ed:death-2-suppress-life",
    "name": "Suppress Life",
    "originalName": "Suppress Life",
    "requirements": {
      "Death": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Subterfuge",
      "Medicine",
      "Academics"
    ],
    "description": "Suppress all signs of life so the subject appears physically and magically dead, including an apparently absent soul. +2 Reach and 1 Mana: Cast reflexively in response to something that could reasonably cause the subject's death.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130,
    "summaryReviewed": true,
    "summary": "Suppress all signs of life so the subject appears physically and magically dead, including an apparently absent soul."
  },
  {
    "id": "mta-2ed:death-2-touch-of-the-grave",
    "name": "Touch of the Grave",
    "originalName": "Touch of the Grave",
    "requirements": {
      "Death": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Survival",
      "Crafts",
      "Persuasion"
    ],
    "description": "Physically interact with ghosts and Death-attuned Twilight. Pull Twilight objects into visibility and solidity with Durability 1 and their normal equipment bonuses; they return to ephemera if broken or when the spell ends.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130,
    "summaryReviewed": true,
    "summary": "Physically interact with ghosts and Death-attuned Twilight. Pull Twilight objects into visibility and solidity with Durability 1 and their normal equipment bonuses; they return to ephemera if broken or when the spell ends."
  },
  {
    "id": "mta-2ed:death-2-without-a-trace",
    "name": "Without a Trace",
    "originalName": "Without a Trace",
    "requirements": {
      "Death": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Science",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Prevent the subject from leaving fingerprints, footprints, blood, skin, hair, or other forensic evidence for the Duration. Searching for such traces with Death Mage Sight triggers a Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130,
    "summaryReviewed": true,
    "summary": "Prevent the subject from leaving fingerprints, footprints, blood, skin, hair, or other forensic evidence for the Duration. Searching for such traces with Death Mage Sight triggers a Clash of Wills."
  },
  {
    "id": "mta-2ed:death-3-cold-snap",
    "name": "Cold Snap",
    "originalName": "Cold Snap",
    "requirements": {
      "Death": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Survival",
      "Intimidation",
      "Science"
    ],
    "description": "Drain heat from the area and apply the Ice Tilt to all surfaces for the Duration. +1 Reach: Also apply the Extreme Cold Tilt.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130,
    "summaryReviewed": true,
    "summary": "Drain heat from the area and apply the Ice Tilt to all surfaces for the Duration."
  },
  {
    "id": "mta-2ed:death-3-damage-ghost",
    "name": "Damage Ghost",
    "originalName": "Damage Ghost",
    "requirements": {
      "Death": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Intimidation",
      "Brawl"
    ],
    "description": "Deal one bashing damage to a ghost's Corpus per Potency.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130,
    "summaryReviewed": true,
    "summary": "Deal one bashing damage to a ghost's Corpus per Potency."
  },
  {
    "id": "mta-signs-of-sorcery:death-3-death-touched-item",
    "name": "Death Touched Item",
    "originalName": "Death Touched Item",
    "requirements": {
      "Death": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Subterfuge"
    ],
    "description": "Make an ordinary object simultaneously material, Death-attuned Twilight ephemera, and shadow, allowing it to affect ghosts, Twilight objects, and magically crafted shadows while retaining its normal equipment bonuses. It keeps its material form if taken into Twilight for the Duration.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 64,
    "summaryReviewed": true,
    "summary": "Make an ordinary object simultaneously material, Death-attuned Twilight ephemera, and shadow, allowing it to affect ghosts, Twilight objects, and magically crafted shadows while retaining its normal equipment bonuses. It keeps its material form if taken into Twilight for the Duration."
  },
  {
    "id": "mta-2ed:death-3-devouring-the-slain",
    "name": "Devouring the Slain",
    "originalName": "Devouring the Slain",
    "requirements": {
      "Death": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Intimidation",
      "Medicine",
      "Persuasion"
    ],
    "description": "Drain one Willpower per Potency from an injured subject, or Scour one Mana per Potency while inflicting one lethal damage per Mana; choose one resource and obey the daily Scouring limit. +1 Reach: Affect a healthy subject. +1 Reach: Ignore the daily Scouring limit. +1 Reach: Affect a ghost's Corpus, taking only Willpower or only Mana.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130,
    "summaryReviewed": true,
    "summary": "Drain one Willpower per Potency from an injured subject, or Scour one Mana per Potency while inflicting one lethal damage per Mana; choose one resource and obey the daily Scouring limit."
  },
  {
    "id": "mta-2ed:death-3-ghost-gate",
    "name": "Ghost Gate",
    "originalName": "Ghost Gate",
    "requirements": {
      "Death": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Academics",
      "Expression"
    ],
    "description": "Create a two-dimensional gate that converts anything passing through it into Death-attuned Twilight; carried objects lose their material forms but can later be retrieved with Touch of the Grave. +1 Reach: Transform the subject and personal possessions directly without a gate.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 130,
    "summaryReviewed": true,
    "summary": "Create a two-dimensional gate that converts anything passing through it into Death-attuned Twilight; carried objects lose their material forms but can later be retrieved with Touch of the Grave."
  },
  {
    "id": "mta-2ed:death-3-ghost-summons",
    "name": "Ghost Summons",
    "originalName": "Ghost Summons",
    "requirements": {
      "Death": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "Rank",
    "roteSkills": [
      "Persuasion",
      "Socialize",
      "Occult"
    ],
    "description": "Call the nearest ghost in sensory range, a personally known ghost, or the nearest ghost matching a specified type; it cannot exceed Rank 5 or travel beyond its Anchor. +1 Reach: Create Open and make it Manifest. +1 Reach: Give a one-word command. +1 Reach near an Underworld Iris: Summon from its Underworld vicinity. +2 Reach: Give one complex task.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131,
    "summaryReviewed": true,
    "summary": "Call the nearest ghost in sensory range, a personally known ghost, or the nearest ghost matching a specified type; it cannot exceed Rank 5 or travel beyond its Anchor."
  },
  {
    "id": "mta-signs-of-sorcery:death-3-reaping-relinquishment",
    "name": "Reaping Relinquishment",
    "originalName": "Reaping Relinquishment",
    "requirements": {
      "Death": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Intimidation",
      "Medicine",
      "Occult"
    ],
    "description": "The next time the subject destroys a soul while this spell remains active, she may safely relinquish another spell as though she spent a Willpower dot. Add Prime 2: Destroy a soul stone instead.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 73,
    "summaryReviewed": true,
    "summary": "The next time the subject destroys a soul while this spell remains active, she may safely relinquish another spell as though she spent a Willpower dot. Add Prime 2: Destroy a soul stone instead."
  },
  {
    "id": "mta-2ed:death-3-quicken-corpse",
    "name": "Quicken Corpse",
    "originalName": "Quicken Corpse",
    "requirements": {
      "Death": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Crafts",
      "Persuasion"
    ],
    "description": "Animate a corpse as a loyal, mindless zombie that follows simple commands and functions as a Retainer with dots equal to Potency. It has its former Health, no Defense, uses Death Mage Armor damage rules, and is destroyed only when its final Health box is aggravated. +1 Reach: Combat form with attack pool equal to rating, Defense 3, Initiative 1, Speed 6. +2 Reach and 1 Mana: Defense 5, Initiative 3, Speed 8.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131,
    "summaryReviewed": true,
    "summary": "Animate a corpse as a loyal, mindless zombie that follows simple commands and functions as a Retainer with dots equal to Potency. It has its former Health, no Defense, uses Death Mage Armor damage rules, and is destroyed only when its final Health box is aggravated."
  },
  {
    "id": "mta-2ed:death-3-quicken-ghost",
    "name": "Quicken Ghost",
    "originalName": "Quicken Ghost",
    "requirements": {
      "Death": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Persuasion",
      "Socialize",
      "Medicine"
    ],
    "description": "Increase one ghost Attribute by 1 per Potency, up to its Rank limit, or heal one Corpus per Potency. +2 Reach and 1 Mana: Increase Rank by 1, raising limits and Essence and granting one new Numen.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 131,
    "summaryReviewed": true,
    "summary": "Increase one ghost Attribute by 1 per Potency, up to its Rank limit, or heal one Corpus per Potency."
  },
  {
    "id": "mta-2ed:death-3-rotting-flesh",
    "name": "Rotting Flesh",
    "originalName": "Rotting Flesh",
    "requirements": {
      "Death": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Empathy"
    ],
    "description": "Deal one bashing damage per Potency through rapid decay. +1 Reach: Also impose -1 per Potency, maximum -3, on Social rolls for the Duration due to the subject's horrific appearance.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132,
    "summaryReviewed": true,
    "summary": "Deal one bashing damage per Potency through rapid decay."
  },
  {
    "id": "mta-2ed:death-3-sever-soul",
    "name": "Sever Soul",
    "originalName": "Sever Soul",
    "requirements": {
      "Death": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Intimidation",
      "Athletics",
      "Expression"
    ],
    "description": "Rip a Sleeper's soul into Twilight, imposing Soulless until the spell ends and the soul can return; casting on an already Soulless subject advances it to Enervated. +1 Reach: Impose Enervated immediately. +1 additional Reach: Impose Thrall immediately.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132,
    "summaryReviewed": true,
    "summary": "Rip a Sleeper's soul into Twilight, imposing Soulless until the spell ends and the soul can return; casting on an already Soulless subject advances it to Enervated."
  },
  {
    "id": "mta-2ed:death-3-shadow-crafting",
    "name": "Shadow Crafting",
    "originalName": "Shadow Crafting",
    "requirements": {
      "Death": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Intimidation",
      "Occult"
    ],
    "description": "Harden shadows into a solid object with Durability 2 and either weapon rating 2, armor 2, or a +2 equipment bonus. The object remains visibly shadowy and casts no shadow of its own.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132,
    "summaryReviewed": true,
    "summary": "Harden shadows into a solid object with Durability 2 and either weapon rating 2, armor 2, or a +2 equipment bonus. The object remains visibly shadowy and casts no shadow of its own."
  },
  {
    "id": "mta-signs-of-sorcery:death-3-unliving-vessel",
    "name": "Unliving Vessel",
    "originalName": "Unliving Vessel",
    "requirements": {
      "Death": 3,
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "Resistance",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Expression"
    ],
    "description": "Prepare a Death-aligned subject for the Imbue Item Attainment: a ghostly Twilight object, ghost, ectoplasmic object, or corpse. Ghosts automatically Withstand and must be Manifested or reached in ghostly Twilight.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 69,
    "summaryReviewed": true,
    "summary": "Prepare a Death-aligned subject for the Imbue Item Attainment: a ghostly Twilight object, ghost, ectoplasmic object, or corpse. Ghosts automatically Withstand and must be Manifested or reached in ghostly Twilight."
  },
  {
    "id": "mta-2ed:death-4-enervation",
    "name": "Enervation",
    "originalName": "Enervation",
    "requirements": {
      "Death": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "Stamina",
    "roteSkills": [
      "Occult",
      "Intimidation",
      "Subterfuge"
    ],
    "description": "Disable the subject's muscles, applying Arm Wrack or Leg Wrack for the Duration. +1 Reach: Apply Immobilized instead.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132,
    "summaryReviewed": true,
    "summary": "Disable the subject's muscles, applying Arm Wrack or Leg Wrack for the Duration."
  },
  {
    "id": "mta-2ed:death-4-exorcism",
    "name": "Exorcism",
    "originalName": "Exorcism",
    "requirements": {
      "Death": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "Rank",
    "roteSkills": [
      "Brawl",
      "Expression",
      "Occult"
    ],
    "description": "Strip Manifestation Conditions equal to Potency from a ghost or its host; the Lasting removal may normally be reestablished. Add Mind or Spirit 4: Affect Goetia or spirits. +1 Reach: The target cannot recreate those Conditions on the same victim or location for the spell's Duration.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132,
    "summaryReviewed": true,
    "summary": "Strip Manifestation Conditions equal to Potency from a ghost or its host; the Lasting removal may normally be reestablished. Add Mind or Spirit 4: Affect Goetia or spirits."
  },
  {
    "id": "mta-signs-of-sorcery:death-4-goetic-evocation-death-substitute",
    "name": "Goetic Evocation (Death Substitute)",
    "originalName": "Goetic Evocation (Death Substitute)",
    "requirements": {
      "Death": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Rank of Entity",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Persuasion"
    ],
    "description": "From the soul stone of a dead mage, manifest a ghost in Twilight with Rank equal to half the creator's Gnosis and traits reflecting the creator's Path, Legacy, Shadow Name, recognizable personality, and selected memories. It can provide Legacy tutoring and is absorbed back into the stone when the spell ends; unlike the Mind version, it cannot be extracted into the caster's Oneiros.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 90,
    "summaryReviewed": true,
    "summary": "From the soul stone of a dead mage, manifest a ghost in Twilight with Rank equal to half the creator's Gnosis and traits reflecting the creator's Path, Legacy, Shadow Name, recognizable personality, and selected memories. It can provide Legacy tutoring and is absorbed back into the stone when the spell ends; unlike the Mind version, it cannot be extracted into the caster's Oneiros."
  },
  {
    "id": "mta-signs-of-sorcery:death-4-haunted-grimoire",
    "name": "Haunted Grimoire",
    "originalName": "Haunted Grimoire",
    "requirements": {
      "Death": 4,
      "Prime": 1
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Total Arcanum dots of Rote + Rank",
    "roteSkills": [
      "Crafts",
      "Intimidation",
      "Occult"
    ],
    "description": "Bind a ghost or unattached soul into a Grimoire, giving it Resonant and Open; the entity's Rank replaces the caster's Arcanum minus one when increasing a rote's Primary Factor. Whenever someone casts a rote, the ghost may escape through a Clash of Wills; when someone memorizes one, it may instead attempt Possession. Souls cannot possess readers or cause Conditions. This is an Act of Hubris against Understanding.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 86,
    "summaryReviewed": true,
    "summary": "Bind a ghost or unattached soul into a Grimoire, giving it Resonant and Open; the entity's Rank replaces the caster's Arcanum minus one when increasing a rote's Primary Factor. Whenever someone casts a rote, the ghost may escape through a Clash of Wills; when someone memorizes one, it may instead attempt Possession. Souls cannot possess readers or cause Conditions. This is an Act of Hubris against Understanding."
  },
  {
    "id": "mta-2ed:death-4-revenant",
    "name": "Revenant",
    "originalName": "Revenant",
    "requirements": {
      "Death": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Rank",
    "roteSkills": [
      "Crafts",
      "Brawl",
      "Intimidation"
    ],
    "description": "Grant a ghost Manifestation Conditions equal to Potency, including prerequisites; it immediately enters the chosen Manifestation and cannot leave it during the spell. This can let a ghost Possess its corpse. Add Mind or Spirit 4: Affect Goetia or spirits.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132,
    "summaryReviewed": true,
    "summary": "Grant a ghost Manifestation Conditions equal to Potency, including prerequisites; it immediately enters the chosen Manifestation and cannot leave it during the spell. This can let a ghost Possess its corpse. Add Mind or Spirit 4: Affect Goetia or spirits."
  },
  {
    "id": "mta-signs-of-sorcery:death-4-scribe-daimonomikon",
    "name": "Scribe Daimonomikon",
    "originalName": "Scribe Daimonomikon",
    "requirements": {
      "Death": 4,
      "Prime": 1
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Rank of Attainment + (10 - Caster's Gnosis)",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "Inscribe one Legacy Attainment per casting into a vessel; the first casting includes initiation, and one to five castings can contain any consecutive portion through the fifth Attainment. The caster must have Gnosis 2, meet the inscribed level's prerequisites, and possess Arcana required for optional effects. Initiation costs 1 Arcane Experience, later Attainments use untutored costs, and the book is a +2 sympathetic Yantra for members. +1 Reach and 1 Mana: Lasting.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 87,
    "summaryReviewed": true,
    "summary": "Inscribe one Legacy Attainment per casting into a vessel; the first casting includes initiation, and one to five castings can contain any consecutive portion through the fifth Attainment. The caster must have Gnosis 2, meet the inscribed level's prerequisites, and possess Arcana required for optional effects. Initiation costs 1 Arcane Experience, later Attainments use untutored costs, and the book is a +2 sympathetic Yantra for members."
  },
  {
    "id": "mta-2ed:death-4-shadow-flesh",
    "name": "Shadow Flesh",
    "originalName": "Shadow Flesh",
    "requirements": {
      "Death": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Occult",
      "Medicine",
      "Subterfuge"
    ],
    "description": "Transform the subject and personal possessions into a mass of animated shadow, either three-dimensional and insubstantial or two-dimensional and able to pass through cracks while remaining surface-bound. The subject retains traits, can move and cast but cannot take other physical actions, is immune to non-Supernal attacks, and is effectively invisible in darkness.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 132,
    "summaryReviewed": true,
    "summary": "Transform the subject and personal possessions into a mass of animated shadow, either three-dimensional and insubstantial or two-dimensional and able to pass through cracks while remaining surface-bound. The subject retains traits, can move and cast but cannot take other physical actions, is immune to non-Supernal attacks, and is effectively invisible in darkness."
  },
  {
    "id": "mta-signs-of-sorcery:death-4-soul-grafting",
    "name": "Soul Grafting",
    "originalName": "Soul Grafting",
    "requirements": {
      "Death": 4,
      "Prime": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Occult"
    ],
    "description": "Graft another mage's soul stone or unattached soul onto the subject's soul. It grants effective Gnosis +1/+2 for casting time, Aimed range, Clashes, Mana per turn, spell control, combined spells, and Yantras, but +2/+3 for Paradox and always risks Paradox; relevant Acts of Hubris affect either soul's owner. It is an Act of Hubris against Falling Wisdom.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 90,
    "summaryReviewed": true,
    "summary": "Graft another mage's soul stone or unattached soul onto the subject's soul. It grants effective Gnosis +1/+2 for casting time, Aimed range, Clashes, Mana per turn, spell control, combined spells, and Yantras, but +2/+3 for Paradox and always risks Paradox; relevant Acts of Hubris affect either soul's owner. It is an Act of Hubris against Falling Wisdom."
  },
  {
    "id": "mta-2ed:death-4-withering",
    "name": "Withering",
    "originalName": "Withering",
    "requirements": {
      "Death": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Intimidation",
      "Medicine",
      "Science"
    ],
    "description": "Deal one lethal damage per Potency through rapid bodily atrophy. +1 Reach and 1 Mana: Deal aggravated damage instead.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133,
    "summaryReviewed": true,
    "summary": "Deal one lethal damage per Potency through rapid bodily atrophy."
  },
  {
    "id": "mta-2ed:death-5-create-anchor",
    "name": "Create Anchor",
    "originalName": "Create Anchor",
    "requirements": {
      "Death": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Persuasion"
    ],
    "description": "Apply a universal Anchor Condition to a subject that any ghost may use. If a ghost is also targeted, it becomes anchored to this new Anchor in addition to its existing Anchors.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133,
    "summaryReviewed": true,
    "summary": "Apply a universal Anchor Condition to a subject that any ghost may use. If a ghost is also targeted, it becomes anchored to this new Anchor in addition to its existing Anchors."
  },
  {
    "id": "mta-2ed:death-5-create-avernian-gate",
    "name": "Create Avernian Gate",
    "originalName": "Create Avernian Gate",
    "requirements": {
      "Death": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Crafts",
      "Persuasion"
    ],
    "description": "Open an Iris between the material world and the upper Underworld, giving the area Death Resonance and the Gateway Condition for the Duration. +1 Reach: Lead to any Underworld location the caster has previously visited.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133,
    "summaryReviewed": true,
    "summary": "Open an Iris between the material world and the upper Underworld, giving the area Death Resonance and the Gateway Condition for the Duration."
  },
  {
    "id": "mta-2ed:death-5-create-ghost",
    "name": "Create Ghost",
    "originalName": "Create Ghost",
    "requirements": {
      "Death": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Expression",
      "Academics"
    ],
    "description": "Create a loyal Rank 1 ghost in Twilight, optionally fashioned as an echo of a living or dead person, and command it without further spells for the Duration. +1 Reach and 1 Mana: Create it at Rank 2.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133,
    "summaryReviewed": true,
    "summary": "Create a loyal Rank 1 ghost in Twilight, optionally fashioned as an echo of a living or dead person, and command it without further spells for the Duration."
  },
  {
    "id": "mta-2ed:death-5-deny-the-reaper",
    "name": "Deny the Reaper",
    "originalName": "Deny the Reaper",
    "requirements": {
      "Death": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Occult",
      "Subterfuge"
    ],
    "description": "Reverse up to one month of decay per Potency, restoring lost bodily functions and irreparable damage in living subjects or repairing age-ravaged objects. +1 Reach: Temporarily return the recently dead to life without their departed soul; they gain Soulless and die again when the spell ends.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133,
    "summaryReviewed": true,
    "summary": "Reverse up to one month of decay per Potency, restoring lost bodily functions and irreparable damage in living subjects or repairing age-ravaged objects."
  },
  {
    "id": "mta-2ed:death-5-empty-presence",
    "name": "Empty Presence",
    "originalName": "Empty Presence",
    "requirements": {
      "Death": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Subterfuge",
      "Persuasion",
      "Stealth"
    ],
    "description": "Erase the subject's observable presence and evidence of existence: mundane detection fails, she becomes invisible, Social Doors reset, and all non-Paradox Conditions on or belonging to her resolve without Beats. Violence or overt destruction ends the spell; Active Mage Sight triggers a Clash, and Focused Mage Sight reveals her. Conditions stay resolved, while Doors return when it ends.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133,
    "summaryReviewed": true,
    "summary": "Erase the subject's observable presence and evidence of existence: mundane detection fails, she becomes invisible, Social Doors reset, and all non-Paradox Conditions on or belonging to her resolve without Beats. Violence or overt destruction ends the spell; Active Mage Sight triggers a Clash, and Focused Mage Sight reveals her. Conditions stay resolved, while Doors return when it ends."
  },
  {
    "id": "mta-2ed:death-5-sever-the-awakened-soul",
    "name": "Sever the Awakened Soul",
    "originalName": "Sever the Awakened Soul",
    "requirements": {
      "Death": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Crafts",
      "Intimidation",
      "Medicine"
    ],
    "description": "Unmake the protections around an Awakened soul, remove it, and place it in a prepared vessel or the caster's body; otherwise it waits in Twilight. The subject gains Soulless, or advances from Soulless to Enervated. +1 Reach: Impose Enervated immediately. +1 additional Reach: Impose Thrall immediately.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 133,
    "summaryReviewed": true,
    "summary": "Unmake the protections around an Awakened soul, remove it, and place it in a prepared vessel or the caster's body; otherwise it waits in Twilight. The subject gains Soulless, or advances from Soulless to Enervated."
  },
  {
    "id": "mta-2ed:fate-1-interconnections",
    "name": "Interconnections",
    "originalName": "Interconnections",
    "requirements": {
      "Fate": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Medicine"
    ],
    "description": "Reveal sympathetic connections, who has violated an oath or geas and spells with conditional duration +1 Reach: Detect possession, supernatural mind control and alterations of destiny +2 Reach: Discern information about a persons destiny",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 134,
    "summary": "Reveal marks of Fate on observed people, places, and things, one subject per turn. The mage detects sympathetic connections, violations of magical oaths, and spells with conditional Durations.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-1-oaths-fulfilled",
    "name": "Oaths Fulfilled",
    "originalName": "Oaths Fulfilled",
    "requirements": {
      "Fate": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Politics",
      "Investigation"
    ],
    "description": "Know when the subject breaks or fulfills an oath +1 Reach: Also receive a brief vision of the subject when the oath is fullfilled +1 Reach: Track the subject of the spell +1 Reach: Trigger event may be something that could only be seen by Mage Sight",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 135,
    "summary": "Notify the mage when a specified perceivable fate befalls the subject, whether the subject causes or experiences it. The trigger must be something the mage could perceive if present.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-1-quantum-flux",
    "name": "Quantum Flux",
    "originalName": "Quantum Flux",
    "requirements": {
      "Fate": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Firearms",
      "Occult"
    ],
    "description": "Negate a number of penalties to your Mundane actions or wait a turn to receive a bonus to your next mundane action",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 135,
    "summary": "Negate penalties equal to Potency on up to Potency mundane instant actions. Alternatively, the subject may spend a turn stationary and without Defense to gain Potency as a bonus to the next mundane instant action; extended actions and spellcasting do not benefit.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-1-reading-the-outmost-eddies",
    "name": "Reading the Outmost Eddies",
    "originalName": "Reading the Outmost Eddies",
    "requirements": {
      "Fate": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Computer",
      "Persuasion",
      "Subterfuge"
    ],
    "description": "Subject of spell receives a minor twist of fate positive or negative in 24 hours. Only hostile applications are Withstood +1 Reach: Spell takes effect within an hour",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 135,
    "summary": "Draw a minor stroke of good or bad fortune to the subject within the next 24 hours. The mage may guide its general nature, but Fate determines the details; hostile castings are Withstood by Composure.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-1-serendipity",
    "name": "Serendipity",
    "originalName": "Serendipity",
    "requirements": {
      "Fate": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Crafts",
      "Survival"
    ],
    "description": "Reveal what course of action will bring you closer to your goal +1 Reach: When making a roll to achieve your stated goal, you may substitute the used Skill with another of the same type (Mental, Physical, Social) +2 Reach: As above but may substitute any Skill",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 135,
    "summary": "Receive a clear omen showing the next action that leads closer to a stated objective. It offers a meaningful step or breakthrough rather than guaranteeing immediate success.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-2-exceptional-luck",
    "name": "Exceptional Luck",
    "originalName": "Exceptional Luck",
    "requirements": {
      "Fate": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Socialize"
    ],
    "description": "Subject receives a boon or hex. A hex may be withstood +2 Reach: Boon or hex can affect spellcasting rolls +2 Reach: Spend a point of Mana. This spell can be cast reflexive",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136,
    "summary": "Grant the subject a boon or impose a hex, using Potency to choose and combine the standard Fate effects. A hostile hex is Withstood by Composure.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-2-fabricate-fortune",
    "name": "Fabricate Fortune",
    "originalName": "Fabricate Fortune",
    "requirements": {
      "Fate": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Larceny",
      "Occult",
      "Subterfuge"
    ],
    "description": "Conceal and falsify a subjects fate or Destiny. This can fool spells with conditional triggers.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136,
    "summary": "Conceal or falsify the subject’s fate and Destiny. The deception can fool conditional Durations or triggers and create false omens under Fate scrutiny, subject to a Clash of Wills.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-2-fools-rush-in",
    "name": "Fools Rush In",
    "originalName": "Fools Rush In",
    "requirements": {
      "Fate": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Socialize",
      "Streetwise"
    ],
    "description": "Suffer no untrained skill penalties when facing a situation unprepared +1 Reach: Also receive a dice bonus +3 Reach: As above but bonus may apply to spellcasting rolls",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136,
    "summary": "While entering a situation with little prior knowledge or preparation, the subject ignores untrained Skill penalties and improves first impressions by one level. Detailed reconnaissance or briefing prevents the spell from helping.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-2-lucky-number",
    "name": "Lucky Number",
    "originalName": "Lucky Number",
    "requirements": {
      "Fate": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Investigation",
      "Larceny",
      "Science"
    ],
    "description": "Guess the right password, phone number, etc. on the first try",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136,
    "summary": "Correctly guess a phone number, password, combination, or similar input on the first attempt and gain Informed on the next relevant roll. The spell manipulates random input through the device; it does not locate a target or reveal where the result leads.",
    "summaryReviewed": true
  },
  {
    "id": "core-dark-eras-2:fate-2-malleable-thorns",
    "name": "Malleable Thorns",
    "originalName": "Malleable Thorns",
    "requirements": {
      "Fate": 2,
      "Mind": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Survival"
    ],
    "description": "Mage states a goal and the Hedge alters itself to fulfill that goal. +1 Reach: Mage may also enact paradigm shifts.",
    "sourceId": "core-dark-eras-2",
    "source": "Dark Eras 2",
    "page": 377,
    "summary": "Gain Potency Hedgespinning successes to spend on subtle shifts while the spell lasts. The mage states a goal, but the Storyteller decides how the Hedge reshapes itself to fulfill it, often with unintended consequences.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-2-shifting-the-odds",
    "name": "Shifting the Odds",
    "originalName": "Shifting the Odds",
    "requirements": {
      "Fate": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Investigation",
      "Politics",
      "Subterfuge"
    ],
    "description": "Find a particular kind of person, place or thing within 24 hours. +1 Reach: Find desired object within an hour",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136,
    "summary": "Find the nearest or most available person, place, or thing matching a general description within 24 hours, never a specific individual or object. Alternatively, gain temporary Allies, Contacts, Mentor, Resources, or Retainer up to Potency, usable no more than Potency times.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-2-warding-gesture",
    "name": "Warding Gesture",
    "originalName": "Warding Gesture",
    "requirements": {
      "Fate": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Brawl",
      "Occult",
      "Subterfuge"
    ],
    "description": "Protect a subject against supernatural effect that would alter her fate including supernatural compulsion. Subject may also be excluded form any area-effect spell you may cast +1 Reach: Subject may be excluded from any spell/attainment you cast +2 Reach: Subject may be protected from any supernatural effects that target an area instead of individuals",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 136,
    "summary": "Protect the subject against supernatural effects that manipulate fate or compel action, forcing a Clash of Wills for each attempt; existing alterations remain. The caster may also exclude protected subjects individually from her own area spells.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-3-grave-misfortune",
    "name": "Grave Misfortune",
    "originalName": "Grave Misfortune",
    "requirements": {
      "Fate": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Weaponry"
    ],
    "description": "The next time the subjects suffers damage, increase the damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137,
    "summary": "For up to Potency attacks during the Duration, the next attack that deals at least one damage to the subject inflicts additional damage equal to Potency. The added damage keeps the original damage type.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-3-monkey-s-paw",
    "name": "Monkey's Paw",
    "originalName": "Monkey's Paw",
    "requirements": {
      "Fate": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Drive",
      "Crafts",
      "Science"
    ],
    "description": "Bless or curse an object altering it's equipment bonus +1 Reach: Anybody who caries the item also receives a boon or a hex +1 Reach: Spend a point of Mana. Bonus or penalty may exceed five dice",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137,
    "summary": "Bless or curse an inanimate object, increasing or decreasing its equipment bonus by Potency. The result may become a dice penalty below zero, but cannot exceed a five-die bonus or penalty without further Reach.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-3-shared-fate",
    "name": "Shared Fate",
    "originalName": "Shared Fate",
    "requirements": {
      "Fate": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Medicine",
      "Persuasion",
      "Politics"
    ],
    "description": "Two or more subjects are bound together. Any damage, Tilt or Condition suffered by one will also affect the other +1 Reach: Link is only one way +2 Reach: Subject is not linked to any other subjects. Instead, she suffers any damage, Tilt or Condition she inflicts on others",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137,
    "summary": "Bind the fates of multiple subjects so that damage, Tilts, and unwanted Conditions suffered by one affect all others. Unless Scale is increased, the caster is one of the linked subjects.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-3-superlative-luck",
    "name": "Superlative Luck",
    "originalName": "Superlative Luck",
    "requirements": {
      "Fate": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Crafts",
      "Occult"
    ],
    "description": "Cost: 1 Mana, Gain the rote quality +2 Reach: Rote quality may effect ritual spellcasting but this also doubles the casting time",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137,
    "summary": "For one Mana, grant the rote quality to a number of mundane rolls equal to Potency. The subject chooses each affected roll before rolling.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-3-sworn-oaths",
    "name": "Sworn Oaths",
    "originalName": "Sworn Oaths",
    "requirements": {
      "Fate": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Occult",
      "Politics"
    ],
    "description": "Supernaturally enforce a vow. Adhere to the oath and the subject receives a boon, break an she suffers a hex +1 Reach: If spell control is maintained the mage is aware if the spell is a boon or a hex",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137,
    "summary": "Enforce a voluntary vow and its stated consequence. The subject receives a boon while faithful; breaking the oath imposes the agreed hex once, and the mage may Clash against powers that would force a violation.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:fate-3-the-right-tool",
    "name": "The Right Tool",
    "originalName": "The Right Tool",
    "requirements": {
      "Fate": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Stealth",
      "Expression"
    ],
    "description": "Turn an ordinary object into the object needed to get the job done. During the duration of the spell this item could be conceivable used as the item needed to complete a task. When used for the new purpose the Items equipment bonus is increased (up to 5+) by the Potency, Items not normally used for the situation begin at 0",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 64,
    "summary": "Temporarily make an ordinary object function as the plausible tool needed for a stated task. When used for that purpose, its equipment bonus increases by Potency to a maximum of +5; an otherwise unsuitable object begins at zero.",
    "summaryReviewed": true
  },
  {
    "id": "core-dark-eras-2:fate-3-wyrdbound-oaths",
    "name": "Wyrdbound Oaths",
    "originalName": "Wyrdbound Oaths",
    "requirements": {
      "Fate": 3,
      "Mind": 2
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Politics",
      "Socialize"
    ],
    "description": "Allow Mages to be valid participants in Wyrd-backed oaths. Failure to follow the oath or breaking it inflicts the Oathbreaker Condition. +2 Reach: The effect is Lasting.",
    "sourceId": "core-dark-eras-2",
    "source": "Dark Eras 2",
    "page": 379,
    "summary": "Make the mage a valid participant in Wyrd-backed oaths, though she cannot initiate them. Breaking the oath or letting the spell expire before fulfilling it inflicts Oathbreaker, granting subjects of her Fate spells +1 Withstand until it resolves.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-4-atonement",
    "name": "Atonement",
    "originalName": "Atonement",
    "requirements": {
      "Fate": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "Subject effect's Potency",
    "roteSkills": [
      "Academics",
      "Empathy",
      "Survival"
    ],
    "description": "If a subject is cursed can grant them a quest that, if fulfilled, will lift the curse. Stronger curses require greater quests +1 Reach: Quest can be undertaken by another on the subjects behalf",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 137,
    "summary": "Provide a quest capable of dispelling a Fate-enforced supernatural curse once completed. The task grows from a minor errand to a major quest according to the curse’s strength; exceptionally powerful curses may require more elaborate atonement.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-4-chaos-mastery",
    "name": "Chaos Mastery",
    "originalName": "Chaos Mastery",
    "requirements": {
      "Fate": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Occult",
      "Science"
    ],
    "description": "Can manipulate complex probabilities within subject or area of effect, dictating any physically possible outcome, no matter how unlikely. Can't create supernatural effects. Cause number of effects = Potency, such as: • narrative effect such as controlling how vehicles behave in a multiple-car crash • seizures, hallucinations, and physical events (imposing suitable Conditions) by directing once-random biochemical changes within subject • reduce subject’s next action to a chance die • attack or protect subject by directing chance around them towards or away from dangerous circumstances; not a direct-attack spell, and uses any rules for the hazard",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138,
    "summary": "Direct complex probability within a subject or area to produce up to Potency physically possible outcomes, however unlikely. It cannot create supernatural effects, but may control a chaotic scene, cause biological events and suitable Conditions, reduce an action to a chance die, or direct an environmental hazard.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-4-divine-intervention",
    "name": "Divine Intervention",
    "originalName": "Divine Intervention",
    "requirements": {
      "Fate": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Subterfuge"
    ],
    "description": "Replace one of the subjects Aspirations with a stated goal. Subject suffers ill luck when no pursuing this goal. This can also be reversed causing bad luck only when pursuing the goal",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138,
    "summary": "Replace one Aspiration with a stated goal and bind the subject’s luck to it. As a goad, failure to pursue the goal meaningfully within 24 hours causes a hex; as a ban, actively pursuing the forbidden goal causes the hex.",
    "summaryReviewed": true
  },
  {
    "id": "core-dark-eras-2:fate-4-masking-the-false-fae",
    "name": "Masking the False Fae",
    "originalName": "Masking the False Fae",
    "requirements": {
      "Fate": 4,
      "Mind": 1
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Empathy",
      "Larceny",
      "Socialize"
    ],
    "description": "Allow Changelings to make Goblin Contracts with supernal entities. Releasing Paradox or on a critical failure the contract is made with an abyssal being. Add Death, Mind, or Spirit ••••: Allow Changelings to make Contracts with Goetia, ghosts, or spirits.",
    "sourceId": "core-dark-eras-2",
    "source": "Dark Eras 2",
    "page": 376,
    "summary": "Connect a Supernal entity to the Wyrd so changelings may bargain with it for unique Contracts and sufficiently powerful entities may enter court Bargains. The spell enables the agreement but does not waive persuasion, prices, Experience costs, or the resulting supernatural Debt.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:fate-4-scribe-daimonomikon",
    "name": "Scribe Daimonomikon",
    "originalName": "Scribe Daimonomikon",
    "requirements": {
      "Fate": 4,
      "Prime": 1
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Rank of Attainment + (10 - Caster's Gnosis)",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "*Cost 1 Mana* Scribe a Daimonomikon for the Mage's Legacy. A Mage must be of Gnosis 2 or above to cast this. Anyone initiated into a Legacy via a Daimonomikon must spend 1 Arcane Experience and if used to learn more Legacy Attainments must use the Experience cost listed for learning without a tutor. These serve as a sympathetic Yantra worth +2 Dice for members of the inscribed Legacy +1 Reach: For 1 Mana, the Spell's Duration is Lasting",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 87,
    "summary": "Inscribe one Legacy Attainment per casting into a vessel; consecutive castings may hold initiation through the fifth Attainment. The caster must meet the relevant Gnosis, Legacy, and optional-Arcanum prerequisites; readers pay the applicable Arcane Experience, and members treat the vessel as a +2 sympathetic Yantra.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-4-strings-of-fate",
    "name": "Strings of Fate",
    "originalName": "Strings of Fate",
    "requirements": {
      "Fate": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Academics",
      "Persuasion",
      "Stealth"
    ],
    "description": "The mage can encourage a specific event to befall the subject. The event will come pass when circumstances allow. If the subject's cooperation is required opportunities for this event to come to pass will appear once a week. +1 Reach: Opportunities appear once a day",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138,
    "summary": "Encourage a specified event to befall the subject when circumstances permit. If cooperation is necessary, Fate presents opportunities about once per week; the spell may place the subject in danger but cannot directly deal damage.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-4-sever-oaths",
    "name": "Sever Oaths",
    "originalName": "Sever Oaths",
    "requirements": {
      "Fate": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Occult",
      "Subterfuge",
      "Weaponry"
    ],
    "description": "Can have a variety of effects such as freeing a bound ephemeral entity or dispelling a conditional trigger +2 Reach: Spell's effects are lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 138,
    "summary": "Alter or remove Fate-enforced obligations and conditions: free a bound ephemeral entity, change a boon or hex, modify or negate an oath, change or dispel a conditional trigger, or alter the Doom granted by Destiny.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-5-forge-destiny",
    "name": "Forge Destiny",
    "originalName": "Forge Destiny",
    "requirements": {
      "Fate": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Persuasion"
    ],
    "description": "Mage can grant the subject a supernatural merit or increase and decrease an existing one. Mage can impose Aspirations, Obsessions or a Doom on the subject",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 139,
    "summary": "Choose one transformation of the subject’s destiny: grant a Supernatural Merit with dots up to Potency, alter an existing Supernatural Merit by Potency, replace up to Potency Aspirations or Obsessions, or assign a Doom even without Destiny.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-5-miracle",
    "name": "Miracle",
    "originalName": "Miracle",
    "requirements": {
      "Fate": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Persuasion",
      "Subterfuge"
    ],
    "description": "Mage gains a number of Intercessions that can be spend reflexively to increase/decrease dice pools or to cause likely events to happen on command +1 Reach: Spend one Intercession and Willpower to cause a low-probability event to pass +2 Reach: Spend one Intercession, Willpower and Mana to let the incredible come to pass",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 140,
    "summary": "Gain Potency Intercessions to spend reflexively during the Duration. Each Intercession can add or remove one success after a roll, with a result below zero becoming a dramatic failure, or cause an immediately convenient and reasonably likely event within sensory range.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-5-pariah",
    "name": "Pariah",
    "originalName": "Pariah",
    "requirements": {
      "Fate": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Investigation",
      "Medicine",
      "Politics"
    ],
    "description": "Turns the whole world against the subject +1 Reach: Mage can adjust the sensitivity of the curse",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 139,
    "summary": "Turn the world against the subject: impressions worsen by one level, or Social actions seeking kindness take a Potency penalty. Attempts to help suffer a hex, while attempts to harm receive a boon; the caster accounts separately for Reach used by each effect.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:fate-5-swarm-of-locusts",
    "name": "Swarm of Locusts",
    "originalName": "Swarm of Locusts",
    "requirements": {
      "Fate": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Science"
    ],
    "description": "Create chaotic conditions that cause Environmental Tilts of player's choosing on the area. This spell is a breaking point for most Sleepers",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 140,
    "summary": "Create an overtly supernatural Fortean event across the area, such as a rain of frogs, swarm of locusts, or untimely eclipse. It produces Environmental Tilts chosen by the player and is a breaking point for most Sleepers.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-1-influence-electricity",
    "name": "Influence Electricity",
    "originalName": "Influence Electricity",
    "requirements": {
      "Forces": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Computer",
      "Crafts",
      "Science"
    ],
    "description": "Operate or shut down electrical devices",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 140,
    "summary": "Operate or shut down an existing electrical device as though using its normal controls, bypassing passwords or electronic keys when necessary. The spell cannot make the device perform functions it does not normally possess.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-1-influence-fire",
    "name": "Influence Fire",
    "originalName": "Influence Fire",
    "requirements": {
      "Forces": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Science",
      "Survival"
    ],
    "description": "Guide flames along a particular path +1 Reach: Increase or decrease the size of a flame",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 140,
    "summary": "Guide existing flames along or away from a chosen path and shape their spread without increasing their size or intensity. Directing the flame into available fuel can still make it grow naturally.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-1-kinetic-efficiency",
    "name": "Kinetic Efficiency",
    "originalName": "Kinetic Efficiency",
    "requirements": {
      "Forces": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Science",
      "Survival"
    ],
    "description": "Run faster, jump further or lift more",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141,
    "summary": "Optimize the subject’s motion: add Potency to rolls against fatigue and add the caster’s Forces dots to jumping distance, running and swimming Speed, and climbing rolls.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-1-influence-heat",
    "name": "Influence Heat",
    "originalName": "Influence Heat",
    "requirements": {
      "Forces": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Science",
      "Survival"
    ],
    "description": "Control the flow of heat in an area. Can protect against heat- or cold-related Environments up to level 2(see p.224) +1 Reach: Protect against Environments up to level 3 +2 Reach: Protect against Environments up to level 4",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141,
    "summary": "Redirect existing heat through the area without creating or increasing it. The flow can warm or cool subjects and prevent heat- or cold-related damage and Conditions from Extreme Environments up to level 2.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-1-nightvision",
    "name": "Nightvision",
    "originalName": "Nightvision",
    "requirements": {
      "Forces": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Investigation",
      "Science",
      "Stealth"
    ],
    "description": "Suffer no penalty form dim to no light. Bright lights can inflict the Blind Condition +1 Reach: No longer risk the Blind Condition from sudden bright lights",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141,
    "summary": "Perceive electromagnetic radiation, sound, kinetic energy, and thermal changes well enough to see and navigate without penalties in complete darkness. Bright light and extreme sound instead impose darkness-like penalties and may cause Blind while the spell lasts.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-1-receiver",
    "name": "Receiver",
    "originalName": "Receiver",
    "requirements": {
      "Forces": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Science"
    ],
    "description": "Hear sounds outside normal human frequency",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141,
    "summary": "Hear infrasonic and ultrasonic frequencies outside normal human perception and add Potency to relevant rolls, such as detecting an ambush through otherwise inaudible sound.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-1-tune-in",
    "name": "Tune In",
    "originalName": "Tune In",
    "requirements": {
      "Forces": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Computer",
      "Empathy",
      "Science"
    ],
    "description": "Become able to see and listen to data transmission",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 141,
    "summary": "Perceive free-floating and wired data transmissions without a receiver, translating electromagnetic signals into intelligible sound or images while preserving their original language. Radio, cellular, wireless, cable, and similar communications become perceptible.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-control-electricity",
    "name": "Control Electricity",
    "originalName": "Control Electricity",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Computer",
      "Science"
    ],
    "description": "Alter the flow of a current or decrease it, but you cannot increase it. Direct a buildings electricity to one outlet, or divide the power from one outlet to many other sources",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142,
    "summary": "Redirect or diminish existing electrical current through conductive paths, controlling one power line per Potency. The mage may arc current into a target, divert it away to reduce electrical damage by Potency, or lower its power one level per Potency, but cannot amplify or create electricity.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-control-fire",
    "name": "Control Fire",
    "originalName": "Control Fire",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Science",
      "Survival"
    ],
    "description": "Increase or decrease the heat or size of a fire",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142,
    "summary": "Alter an existing fire’s heat or size by one level per Potency, distributing the changes between those factors. Reducing either below level one extinguishes the fire; diminished flames may spread again after the spell ends if fuel remains.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-control-gravity",
    "name": "Control Gravity",
    "originalName": "Control Gravity",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Occult",
      "Science"
    ],
    "description": "Cause gravity to pull upwards or horizontally",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142,
    "summary": "Redirect gravity within the area so unsecured subjects and objects fall upward or horizontally. The spell changes direction rather than strength; trapped creatures may attempt an appropriate action to grab support or escape.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-control-heat",
    "name": "Control Heat",
    "originalName": "Control Heat",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Science",
      "Survival"
    ],
    "description": "Increase or decrease the temperature of an area this may cause an Extreme Environment",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142,
    "summary": "Raise or lower the area’s temperature by one Extreme Environment level per Potency, measured from temperate room temperature and capable of crossing between cold and heat.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-control-light",
    "name": "Control Light",
    "originalName": "Control Light",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Investigation",
      "Science"
    ],
    "description": "Can focus or disperse light, and alter its wavelength on the spectrum +1 Reach: Can create a mirroring effect or a complete black-out which causes the Blinded Tilt or provides substantial cover",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142,
    "summary": "Double or halve existing light per Potency and focus, disperse, refract, or change its wavelength without altering the source itself. These manipulations can impose Poor Light but do not inherently add heat or damage the light source.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-control-sound",
    "name": "Control Sound",
    "originalName": "Control Sound",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Stealth",
      "Science"
    ],
    "description": "Amplify or dampen sound, can also influence the direction of sound. Loud sounds can cause the Deafened Tilt in combat +1 Reach: Create an echoing effect which imposes a penalty to stealth rolls +1 Reach: Gain a bonus to hearing-based perception rolls",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 142,
    "summary": "Double or halve sound volume per Potency, redirect or focus existing sounds, and alter tone or voice. The spell can isolate a sound to selected listeners, listen across the affected Scale, penalize hearing-based Perception by the caster’s Arcanum, or produce Deafened when sufficiently loud.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-control-weather",
    "name": "Control Weather",
    "originalName": "Control Weather",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Science",
      "Survival"
    ],
    "description": "Make changes to the weather may create an Extreme Environments up to level 4 +1 Reach: Weather changes are more gradual +2 Reach: Required for more drastic changes",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143,
    "summary": "Reshape existing weather within minutes, changing weather-based Extreme Environments by up to Potency and never beyond level 4, and creating appropriate Environmental Tilts. The caster receives no automatic protection from the conditions created.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-environmental-shield",
    "name": "Environmental Shield",
    "originalName": "Environmental Shield",
    "requirements": {
      "Forces": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Science",
      "Survival"
    ],
    "description": "This spell gives resistance to any Conditions and Tilts caused by the environment",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143,
    "summary": "Grant complete resistance to Conditions and Tilts caused indirectly by environments up to an Extreme Environment level equal to Potency. It does not prevent drowning, crushing waves, or a deliberately directed lightning strike, and magical weather requires a Clash of Wills.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-invisibility",
    "name": "Invisibility",
    "originalName": "Invisibility",
    "requirements": {
      "Forces": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Larceny",
      "Science",
      "Stealth"
    ],
    "description": "Make a subject invisible",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143,
    "summary": "Mask the subject from all forms of light, making it invisible even to cameras and specialized lenses. The spell does not conceal sound.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-kinetic-blow",
    "name": "Kinetic Blow",
    "originalName": "Kinetic Blow",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Brawl",
      "Science"
    ],
    "description": "Unarmed attacks gain a bonus +1 Reach: Apply the Knocked Down Tilt +1 Reach: Apply the Stunned Tilt +1 Reach: Spell can affect held weapons +2 Reach: Spell affects thrown weapons but can also grant bullets Armor Piercing",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 143,
    "summary": "Focus the force of the subject’s unarmed attacks, including grapples and attacks through close-fitting gloves or shoes. They gain a weapon bonus equal to Potency, maximum +5, and inflict lethal damage.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-transmission",
    "name": "Transmission",
    "originalName": "Transmission",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Science"
    ],
    "description": "Hijack existing signals and change the transmitted data or its destination +1 Reach: The signal becomes \"encrypted\" only specific actions will allow somebody to read them",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144,
    "summary": "Hijack an existing signal to alter its data, length, frequency, or destination, such as converting a wireless broadcast into television. The spell cannot create a signal, and imitating specific content requires the relevant data or a Skill roll.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-2-zoom-in",
    "name": "Zoom In",
    "originalName": "Zoom In",
    "requirements": {
      "Forces": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Investigation",
      "Science",
      "Survival"
    ],
    "description": "See distant objects or better examine small ones +1 Reach: See clearly for miles +1 Reach: Clearly examine dust-sized particles +1 Reach: No longer suffer penalties form atmospheric conditions +2 Reach: Clearly see microscopic particles, even molecular bonds",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144,
    "summary": "Magnify visible light for the subject, doubling clear viewing distance per Potency and adding Potency to rolls for small details. Atmospheric conditions still interfere, and interpreting tiny phenomena may require Intelligence + Science.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-3-call-lightning",
    "name": "Call Lightning",
    "originalName": "Call Lightning",
    "requirements": {
      "Forces": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Firearms",
      "Science"
    ],
    "description": "Can call lightning from an existing storm which may be created with \"Control Weather\".",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144,
    "summary": "Call lightning from an existing storm to strike exposed subjects the bolt can physically reach, applying the electricity damage rules. Multiple subjects are struck simultaneously; the spell cannot create the required storm.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:forces-3-data-hog",
    "name": "Data Hog",
    "originalName": "Data Hog",
    "requirements": {
      "Forces": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Computer",
      "Larceny",
      "Persuasion"
    ],
    "description": "increase or decrease a computer device's capability to process, accept and transfer data by Potency",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 65,
    "summary": "Increase or decrease a computerized device’s equipment bonus for processing, receiving, and transferring data by one per Potency.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:forces-3-energize-object",
    "name": "Energize Object",
    "originalName": "Energize Object",
    "requirements": {
      "Forces": 3,
      "Prime": 2
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Larceny",
      "Science"
    ],
    "description": "*Cost 1 Mana* Primes an object with the potential for activation to hold a spell. Once the object is primed a mage may spend a Mana to cast any other spell on the object which doesn't activate until appropriate force is applied to the object. May store spells up to Potency which won't take affect until either the controlling mage cancels this spell, the duration ends or the correct force is applied to the object",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 69,
    "summary": "For one Mana, prepare an object to store up to Potency spells, each cast into it for another Mana. The stored spells remain controlled but inactive until an appropriate kinetic action activates the object; anyone may trigger it, and untriggered spells end with Energize Object.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-3-gravitic-supremacy",
    "name": "Gravitic Supremacy",
    "originalName": "Gravitic Supremacy",
    "requirements": {
      "Forces": 3
    },
    "practice": "Fraying or Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Science",
      "Survival"
    ],
    "description": "Increase or decrease gravity",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144,
    "summary": "Increase gravity to reduce Speed by three per Potency, shorten jumps, penalize creatures whose Strength is lower than Potency, and force flyers to resist falling. Alternatively, nullify gravity to add Potency to Speed and jumping distance and choose the direction objects fall.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:forces-3-perpetual-motion",
    "name": "Perpetual Motion",
    "originalName": "Perpetual Motion",
    "requirements": {
      "Forces": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Science",
      "Survival"
    ],
    "description": "The subject no longer requires an energy input for the duration of the spell",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 65,
    "summary": "Allow a device to function for the Duration without consuming energy from batteries, fuel, an outlet, or another installed power source.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:forces-3-rapid-access-memory",
    "name": "Rapid Access Memory",
    "originalName": "Rapid Access Memory",
    "requirements": {
      "Forces": 3,
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Larceny",
      "Science"
    ],
    "description": "Allows the Subject to use the attainment Imbue Item on computer Software which can later be activated on a computer.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 69,
    "summary": "Prepare software on a computer-compatible object for Imbue Item, allowing its spell to activate when connected to a computer and specified interface conditions are met. The software or its user casts from the object’s stored Mana and cannot function after that Mana is exhausted.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-3-telekinesis",
    "name": "Telekinesis",
    "originalName": "Telekinesis",
    "requirements": {
      "Forces": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Brawl",
      "Science"
    ],
    "description": "Use telekinetic force to lift or manipulate an object remotely. Potency is applied to either Strength or Dexterity the remaining stat becomes 1 +1 Reach: Divide Potency between Two of the Three Physical Attributes +2 Reach: Divide Potency between any of the Three Physical Attributes",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 144,
    "summary": "Create a remote force with Potency assigned to Strength, Dexterity, or Speed while the other two traits default to one. Directing it requires an instant action each turn; without concentration it stops and holds carried objects until controlled again.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-3-telekinetic-strike",
    "name": "Telekinetic Strike",
    "originalName": "Telekinetic Strike",
    "requirements": {
      "Forces": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Firearms",
      "Science"
    ],
    "description": "Deal bashing damage +1 Reach: Apply the Knocked Down or Stunned Tilt",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145,
    "summary": "Crush a subject or strike with concentrated air and kinetic force, inflicting bashing damage equal to Potency.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-3-turn-momentum",
    "name": "Turn Momentum",
    "originalName": "Turn Momentum",
    "requirements": {
      "Forces": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Firearms",
      "Science"
    ],
    "description": "When applying defense against an object this spell may be used, causing the object to be deflected in an uncontrolled direction though it never reverses direction +1 Reach: Spell can be used as an reflexive action +1 Reach: Mage has control over where the object is deflected, sol long as the new direction is within 90 degrees of the original arc +2 Reach: Objects direction can be completely reversed Ranged weapons hit their users Add Time 1: Use a Reach, you can now turn objects too fast for you to apply defense against",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145,
    "summary": "Redirect up to Potency moving objects as an instant action when the mage could apply Defense, or in place of a prolonged spell’s Dodge benefit. Each valid object keeps its speed but veers in an uncontrolled direction and cannot normally reverse course.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-3-velocity-control",
    "name": "Velocity Control",
    "originalName": "Velocity Control",
    "requirements": {
      "Forces": 3
    },
    "practice": "Fraying or Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Drive",
      "Science"
    ],
    "description": "Increase or decrease an objects speed",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145,
    "summary": "Double or halve an entire object’s speed once per Potency without reducing it to zero. The change affects collision damage and adds or removes one damage from projectile attacks, potentially reducing projectile damage to zero.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-4-electromagnetic-pulse",
    "name": "Electromagnetic Pulse",
    "originalName": "Electromagnetic Pulse",
    "requirements": {
      "Forces": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Computer",
      "Science"
    ],
    "description": "By Unraveling electricity in the Subject this Creates an EMP that snuffs out powered devices in the affected area. Military devices may be shielded. Magical devices require a Clash of Wills. If used on a Living being this acts as an attack spell",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145,
    "summary": "Destroy mundane electronic devices by degrading their electromagnetic energy; hardened equipment requires sufficient Potency and magical devices trigger a Clash of Wills. Against a living subject, the nervous-system disruption inflicts Potency lethal damage as a direct attack.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-4-levitation",
    "name": "Levitation",
    "originalName": "Levitation",
    "requirements": {
      "Forces": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Athletics",
      "Science",
      "Survival"
    ],
    "description": "Levitate a subject, if unwilling the spell is withstood. You may direct the levitation each turn as an instant action. Without the mages focus the subject simply stops and floats in midair +1 Reach: Subject retains momentum form turn to turn, floating slowly in whatever direction it was last directed in +1 Reach: Subject can fly freely, apply defense normally and a speed equal to the mage's Gnosis+spell's Potency",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145,
    "summary": "Float the subject at an air Speed equal to Potency while allowing applicable Defense; unwilling subjects Withstand with Stamina. The mage must spend an instant action each turn to direct movement, otherwise the subject stops and hangs in place.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-4-rend-friction",
    "name": "Rend Friction",
    "originalName": "Rend Friction",
    "requirements": {
      "Forces": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Drive",
      "Science"
    ],
    "description": "Increase or decrease friction. Increases can cause lethal damage. Decreases cause objects to move after they normally would have stopped",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 145,
    "summary": "Increase friction so every three yards moved inflicts one lethal damage, up to Potency, with mundane armor half effective. Alternatively, reduce friction to double travel before slowing per Potency, double weapon ranges, and penalize vehicle Handling by Potency.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-4-thunderbolt",
    "name": "Thunderbolt",
    "originalName": "Thunderbolt",
    "requirements": {
      "Forces": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Firearms",
      "Science"
    ],
    "description": "Deal lethal damage +1 Reach: Spend one Mana, spell deals aggravated damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146,
    "summary": "Channel ambient energy into the subject as a direct attack, inflicting lethal damage equal to Potency.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-4-transform-energy",
    "name": "Transform Energy",
    "originalName": "Transform Energy",
    "requirements": {
      "Forces": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Science"
    ],
    "description": "Transform one type of energy into another of the same level +1 Reach: May decrease the level of transformed energy by one. This Reach can be applied multiply times +1 Reach: Split one type of energy into two others +1 Reach: Spend one Mana, increase the level of transformed energy by one",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146,
    "summary": "Convert one energy type into another at an equivalent level up to Potency, using the spell’s energy table to compare light, sound, heat, electricity, and fire.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-5-adverse-weather",
    "name": "Adverse Weather",
    "originalName": "Adverse Weather",
    "requirements": {
      "Forces": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Science"
    ],
    "description": "Create Extreme Environments of nearly any kind up to level 4 +1 Reach: Can create weather drastically different from the local conditions",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146,
    "summary": "Create a major weather system within minutes, including tornadoes, tsunamis, monsoons, or hurricanes, or milder weather under otherwise clear conditions. It may create nearly any Extreme Environment up to level 4 and dissipates when the spell ends.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-5-create-energy",
    "name": "Create Energy",
    "originalName": "Create Energy",
    "requirements": {
      "Forces": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Science"
    ],
    "description": "Create any type of energy form nothing, including sunlight and radiation",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146,
    "summary": "Create light, including sunlight, fire, radiation, sound, or electricity from nothing at a level up to Potency. Created fire scales in heat with Potency, radiation creates a hazardous Extreme Environment, and Control spells may subsequently alter the energy.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-5-eradicate-energy",
    "name": "Eradicate Energy",
    "originalName": "Eradicate Energy",
    "requirements": {
      "Forces": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "Stamina",
    "roteSkills": [
      "Intimidation",
      "Science",
      "Survival"
    ],
    "description": "Explosively destroy energy, if used on a creature the spell is instantly fatal",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 146,
    "summary": "Explosively annihilate energy within a subject or area up to the level permitted by Potency. Used on a living creature, the spell is instantly fatal and is Withstood by Stamina.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:forces-5-earthquake",
    "name": "Earthquake",
    "originalName": "Earthquake",
    "requirements": {
      "Forces": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Science",
      "Survival"
    ],
    "description": "Apply damage to all structures within the affected area. Buildings made to withstand earthquakes subtract their Durability",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 147,
    "summary": "Create an earthquake that deals Potency damage to every structure in the area; sturdy buildings subtract Durability, while small or flimsy structures do not. Living beings roll Dexterity + Athletics to keep their balance or suffer the consequences of falling and collapsing surroundings.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-1-analyze-life",
    "name": "Analyze Life",
    "originalName": "Analyze Life",
    "requirements": {
      "Life": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Animal Ken",
      "Medicine",
      "Survival"
    ],
    "description": "Observe a creature and learn information like species, age, sex and overall health. A supernatural creature's species shows up as unknown unless the mage has studied it's kind before. Can discern amount of dots in physical attributes and any illnesses, injuries, Personal Tilts and Condition on target +1 Reach: May learn a specific Physical Attribute level, rather than just the total number of dots",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 148,
    "summary": "Observe a living subject to learn its species, age, sex, overall health, total Physical Attribute dots, and any illnesses, injuries, Personal Tilts, or Conditions. An unfamiliar supernatural species registers as unknown until the mage has studied its kind.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-1-cleanse-the-body",
    "name": "Cleanse the Body",
    "originalName": "Cleanse the Body",
    "requirements": {
      "Life": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Medicine",
      "Survival"
    ],
    "description": "Help subject resist any toxins in her system +1 Reach: The subject may make a resistance roll immediately, in addition to the normal ones from regular intervals",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 148,
    "summary": "Add Potency to the subject’s resistance against drugs, poisons, and other toxins already in her system for the spell’s Duration.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-1-heightened-senses",
    "name": "Heightened Senses",
    "originalName": "Heightened Senses",
    "requirements": {
      "Life": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Survival"
    ],
    "description": "Heighten desired senses. Grants bonus to perception roles +1 Reach: You can track by scent",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149,
    "summary": "Enhance selected senses and add Potency to relevant Perception rolls. The enhancement does not grant entirely new sensory capabilities by itself.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-1-speak-with-beasts",
    "name": "Speak With Beasts",
    "originalName": "Speak With Beasts",
    "requirements": {
      "Life": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Animal Ken",
      "Empathy",
      "Survival"
    ],
    "description": "Magically speak with a specific species of animal. Animals have limited ability to understand things around them, for example a rat may refer to a cat and vampire alike as simply a \"predator\" +1 Reach: May communicate with all animals rather than only a single species",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 148,
    "summary": "Communicate with one chosen animal species for the Duration. Animals understand and describe the world through their own limited instincts and experience rather than human concepts.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-1-web-of-life",
    "name": "Web of Life",
    "originalName": "Web of Life",
    "requirements": {
      "Life": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Investigation",
      "Medicine",
      "Survival"
    ],
    "description": "Detect all forms of specified life in the spells area of effect",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 148,
    "summary": "Detect every example of a specified form of life within the area for the Duration. When focused on individual subjects, the spell can scan them for parasites, bacteria, or pregnancy.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-2-body-control",
    "name": "Body Control",
    "originalName": "Body Control",
    "requirements": {
      "Life": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Medicine",
      "Survival"
    ],
    "description": "Slow Breathing, Heartbeat and/or Metabolism. Up your Initiative, eliminate or increase body odors and halve healing time for bashing damage +1 Reach: Gain 1/0 armor +2 reach: Half healing time for lethal damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 148,
    "summary": "Consciously regulate the subject’s breathing, heartbeat, metabolism, reflexes, and bodily odors. The spell can add Potency to Initiative, halve bashing healing time, and suppress or intensify appropriate biological functions.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-2-control-instincts",
    "name": "Control Instincts",
    "originalName": "Control Instincts",
    "requirements": {
      "Life": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Animal Ken",
      "Intimidation",
      "Persuasion"
    ],
    "description": "Trigger a specific instinctual response in animals(includes humans). Subject suffers a Condition related to the desired  instinct +1 Reach: Control instincts of living supernatural creatures",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149,
    "summary": "Trigger a specific instinctive response in an animal, including a human, imposing an appropriate Condition for the Duration. Ordinary living creatures are valid subjects; supernatural creatures require additional Reach.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-2-lure-and-repel",
    "name": "Lure and Repel",
    "originalName": "Lure and Repel",
    "requirements": {
      "Life": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Animal Ken",
      "Persuasion",
      "Survival"
    ],
    "description": "Create a lure or repellent that works on a specific organism. Plant and bacteria have 0 resolve for the purposes of this spell +1 Reach: Lured creatures may offer food or small favors a appropriate for the animal +1 Reach: Lured creatures treat the subject good if a lure or bad if a repellent for the purposes of first impressions in Social maneuvering",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149,
    "summary": "Make the subject attract or repel a chosen organism. Affected creatures must resist the urge to approach or avoid it; plants and bacteria count as Resolve 0, while intelligent beings retain judgment once they confront the stimulus.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-2-mutable-mask",
    "name": "Mutable Mask",
    "originalName": "Mutable Mask",
    "requirements": {
      "Life": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Medicine",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Change a subjects appearance, apparent sex, voice, smell, etc. Changes are illusionary, bio-metric devices will still pick up the truth. Cannot imitate specific people +2 Reach: Can duplicate the appearance of a specific person, including fingerprints",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149,
    "summary": "Create an illusory biological disguise that changes apparent facial structure, body features, sex, voice, scent, and similar traits. Physical evidence and biometric examination still reveal the truth, and the basic spell cannot copy a specific person.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-2-purge-illness",
    "name": "Purge Illness",
    "originalName": "Purge Illness",
    "requirements": {
      "Life": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Medicine",
      "Survival"
    ],
    "description": "Cure yourself of an illness. Compare Potency to the illness'rating if less, reduce the illness by the difference if more, eliminate the illness",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 149,
    "summary": "Reduce a disease’s Severity by Potency; if Potency equals or exceeds its Severity, cure it completely. Otherwise the illness continues at its reduced rating.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-3-bruise-flesh",
    "name": "Bruise Flesh",
    "originalName": "Bruise Flesh",
    "requirements": {
      "Life": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Brawl",
      "Intimidation",
      "Medicine"
    ],
    "description": "Deal bashing damage +1 Reach: Inflict an additional -1 penalty to any wound penalties the target might have",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 150,
    "summary": "Attack living tissue directly, inflicting bashing damage equal to Potency.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:life-3-contact-high",
    "name": "Contact High",
    "originalName": "Contact High",
    "requirements": {
      "Life": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Occult",
      "Science"
    ],
    "description": "Creates a drug that targets the nervous system. Anyone who comes into contact with the Subject is affected by this drug for one scene. The Caster determines if it increases Initiative equal to Potency or penalizes Initiative equal to Potency. The drug affects a living subject as well as any touching it +1 Reach: Living subjects are Immune but still spread the drug to anything they touch",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 65,
    "summary": "Make the subject exude a drug that affects anyone whose bare skin touches it for one scene. The caster chooses whether it adds or subtracts Potency from Initiative, and a living carrier is also affected.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-3-degrading-the-form",
    "name": "Degrading the Form",
    "originalName": "Degrading the Form",
    "requirements": {
      "Life": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Brawl",
      "Medicine",
      "Survival"
    ],
    "description": "Reduce a targets Physical Attributes, but only one +1 Reach: Spell may effect two different Physical Attributes",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 150,
    "summary": "Reduce one of the subject’s Physical Attributes by Potency, to a minimum of one, for the Duration. The resulting reductions affect derived traits normally.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-3-honing-the-form",
    "name": "Honing the Form",
    "originalName": "Honing the Form",
    "requirements": {
      "Life": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Medicine",
      "Survival"
    ],
    "description": "Raise Strength, Dexterity or Stamina, but no higher than a subjects max for these stats +1 Reach: Spell may effect two different Physical. This effect can be applied twice so that all three attributes may be affected +1 Reach: Spend a point of Mana, may increase stats beyond the allowed maximum",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 150,
    "summary": "Increase one Physical Attribute by Potency without exceeding the subject’s normal maximum. Derived traits change with the enhanced Attribute.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-3-knit",
    "name": "Knit",
    "originalName": "Knit",
    "requirements": {
      "Life": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Medicine",
      "Survival"
    ],
    "description": "Heal 2 bashing damage per Potency +1 Reach: You can heal Personal Tilts such as Arm Wrack +1 Reach: Can heal damage done by deprivation +1 Reach: Reproduce the effect of night's rest, regain a Willpower point if appropriate +1 Reach: Heal one lethal per Potency instead of 2 Bashing",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 150,
    "summary": "Heal two points of bashing damage per Potency by accelerating natural recovery. The spell cannot restore lethal or aggravated damage without its respective Reach effects.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:life-3-living-vessel",
    "name": "Living Vessel",
    "originalName": "Living Vessel",
    "requirements": {
      "Life": 3,
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Academics",
      "Medicine",
      "Persuasion"
    ],
    "description": "Prepare a subject under the purview of Life for the Imbue Item Attainment. The mage can use the Attainment to imbue any living subject",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 69,
    "summary": "Prepare any living subject for the Imbue Item Attainment. The unwilling subject Withstands with Stamina, and the imbuement must otherwise follow the Attainment’s rules.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-3-many-faces",
    "name": "Many Faces",
    "originalName": "Many Faces",
    "requirements": {
      "Life": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Medicine",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Like \"Mutable Mask\" only the changes are real rather than an illusion. Poor vision or other senses can be restored. Missing organs and limbs can not be restored however. You may also rearrange the subjects Physical Attributes Add Time 3: You can change physical age as well",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 150,
    "summary": "Physically reshape a living subject’s appearance, sex, voice, scent, and related biology, making the changes real rather than illusory. It can restore impaired organs or senses and redistribute Physical Attribute dots, but cannot replace missing limbs or organs.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:life-3-steal-life-force",
    "name": "Steal Life Force",
    "originalName": "Steal Life Force",
    "requirements": {
      "Life": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Crafts",
      "Medicine",
      "Persuasion"
    ],
    "description": "This spell is cast on a mage to alter his imbument process causing the item to damage the user. The item appears to function as normal but requires Life force to function. This item deals 1 point of Lethal damage for each point of Mana spent to cast the imbued spell, if the Item runs out of Mana it deals Lethal to the user to replenish its Mana",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 72,
    "summary": "For one Mana, alter a mage’s imbuement process so an item created before this spell ends becomes cursed. Casting its imbued spell drains one lethal damage from the user per Mana spent; if the item has no Mana, it replenishes one Mana by inflicting one lethal damage on the next person who touches it.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-3-transform-life",
    "name": "Transform Life",
    "originalName": "Transform Life",
    "requirements": {
      "Life": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "Stamina",
    "roteSkills": [
      "Animal Ken",
      "Science",
      "Survival"
    ],
    "description": "Give life features normally belonging to other organisms. Gills, Claws, Senses, Etc. +2 Reach: The bestowed feature, if permanent, can be passed on to a creatures descendants",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 150,
    "summary": "Grant a living subject one biological feature per Potency from another organism, such as claws, gills, venom, limbs, lungs, or enhanced senses. Features use appropriate equipment bonuses or game traits and must remain biologically plausible.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-4-accelerate-growth",
    "name": "Accelerate Growth",
    "originalName": "Accelerate Growth",
    "requirements": {
      "Life": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Animal Ken",
      "Medicine",
      "Science"
    ],
    "description": "Cause a lifeform to rapidly grow, at the end of the duration the subject will return to their actual age. If the subject exceeds its natural lifespan, it will die of old age +1 Reach: When the spell ends the subject will rapidly de-age at an even faster rate than they grew, returning to their actual age in minutes. This puts great stress on the target. They must make a Stamina roll and on a failure they will enter a coma for a number of days.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 151,
    "summary": "Double a living subject’s growth rate once per Potency for the Duration. The subject returns to its actual age at the normal rate afterward, but dies of old age if accelerated beyond its natural lifespan before the spell ends.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-4-animal-minion",
    "name": "Animal Minion",
    "originalName": "Animal Minion",
    "requirements": {
      "Life": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Animal Ken",
      "Science",
      "Survival"
    ],
    "description": "The mage takes complete bodily control of a subject. Difference in gait may be noticeable to those familiair with the subject. The mage's body will be inert while this spell is active +1 Reach: Target behaves more normally, as you understand the targets habits",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 151,
    "summary": "Take complete bodily control of a living subject while the mage’s own body lies inert. The mage uses the target’s Physical Attributes and her own Mental and Social Attributes, but unfamiliar mannerisms may reveal the possession.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-4-life-force-assault",
    "name": "Life-Force Assault",
    "originalName": "Life-Force Assault",
    "requirements": {
      "Life": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Brawl",
      "Intimidation",
      "Medicine"
    ],
    "description": "Deal lethal damage +1 Reach: Inflict an additional -2 penalty to any wound penalties the target might have +1 Reach: Spend a point of Mana, deal aggravated damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 152,
    "summary": "Attack the vital force sustaining a living subject, inflicting lethal damage equal to Potency.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:life-4-living-grimoire",
    "name": "Living Grimoire",
    "originalName": "Living Grimoire",
    "requirements": {
      "Life": 4,
      "Prime": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Total Arcanum dots used in the Rote + Stamina",
    "roteSkills": [
      "Crafts",
      "Medicine",
      "Occult"
    ],
    "description": "The Mage scribes a single rote per casting of this spell onto a living being. Casting this spell constitutes as an act of Hubris against Understanding Wisdom",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 85,
    "summary": "For one Mana, inscribe one rote per casting into a living plant or creature, turning its body into a readable Grimoire. Unwilling subjects resist with Stamina plus the rote’s total Arcanum dots, and creating the living inscription is an Act of Hubris against Understanding Wisdom.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-4-mend",
    "name": "Mend",
    "originalName": "Mend",
    "requirements": {
      "Life": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Medicine",
      "Survival"
    ],
    "description": "Heal 2 lethal wounds per Potency +1 Reach: Can erase scars +1 Reach: Can heal damage done by deprivation +1 Reach: Reproduce the effect of night's rest, regain a Willpower point if appropriate +1 Reach: Spend a point of Mana, can heal aggravated damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 152,
    "summary": "Heal two points of lethal damage per Potency by rewriting and closing the subject’s wounds. Aggravated damage requires Mana and the appropriate Reach.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-4-regeneration",
    "name": "Regeneration",
    "originalName": "Regeneration",
    "requirements": {
      "Life": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Medicine",
      "Survival"
    ],
    "description": "Cost: 1 Mana, restore lost organs or limbs",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 152,
    "summary": "For one Mana, regrow or replace a missing limb or organ over the spell’s Duration. The restored tissue withers rapidly when the spell expires unless the effect becomes Lasting.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-4-shapechanging",
    "name": "Shapechanging",
    "originalName": "Shapechanging",
    "requirements": {
      "Life": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Animal Ken",
      "Athletics",
      "Science"
    ],
    "description": "Take on the form of another creature. Clothes and gear do not change with you. Instincts of the new form may need to be resisted with a Composure + Resolve roll Add Matter 4: Gear changes with you to fit the new form +1 Reach (with Matter 4): Gear becomes part of new form +1 Reach: Turn into a swarm of tiny creatures +1 Reach: Retain full control over reason",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 152,
    "summary": "Transform the subject into another living creature while clothing and equipment remain unchanged. The new body provides its physical traits and instincts, which may require Resolve + Composure to resist; the subject retains mental identity unless instinct overwhelms it.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-5-create-life",
    "name": "Create Life",
    "originalName": "Create Life",
    "requirements": {
      "Life": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Science",
      "Survival"
    ],
    "description": "Design and create any form of life you desire. If cast with finite duration life will disappear at the end of the spell, this may count as an Act of Hubris. Add Mind 5: Give your organism a true mind as appropriate to type +1 Reach: Creature can be given additional features as per \"Transform Life\"",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 153,
    "summary": "Design and create a plant, fungus, animal, or other living organism. Without Mind 5 it is mindless and acts only on instinct; finite-Duration life vanishes when the spell ends, while permanent creation may constitute an Act of Hubris.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-5-contagion",
    "name": "Contagion",
    "originalName": "Contagion",
    "requirements": {
      "Life": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Occult",
      "Science"
    ],
    "description": "Create minor or life-threatening diseases +1 Reach: Create a never before seen disease. This is likely to be an Act of Hubris as no creature in the world could have developed any defenses against it",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 153,
    "summary": "Create a disease with Severity equal to Potency, either inside a suitable container or in a living host. The disease may range from minor sickness to lethal plague and thereafter spreads according to its designed traits.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:life-5-salt-the-earth",
    "name": "Salt the Earth",
    "originalName": "Salt the Earth",
    "requirements": {
      "Life": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Science",
      "Survival"
    ],
    "description": "Destroy life-force in an area. This Creates an Extreme Environment equal to Potency +1 Reach: Individual living things that survive, will still suffer an additional -1 to any wound penalties they might have",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 153,
    "summary": "Destroy the vitality of all life in the area, creating an Extreme Environment with a level equal to Potency. The devastation affects plants, animals, and other living organisms rather than merely damaging individual targets.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-1-craftsman-s-eye",
    "name": "Craftsman's Eye",
    "originalName": "Craftsman's Eye",
    "requirements": {
      "Matter": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Investigation",
      "Science"
    ],
    "description": "Study an object for one turn to learn it's intended function. If the object has no purpose that will be revealed instead. If something prevents the object from fulfilling it's function, the spell will reveal the nature of the problem +1 Reach: Learn how to use the studied object. This grants the 8-Again when using the object. Only one object can benefit from this bonus at once +2 Reach: Learn all possible uses for an object Add Fate 1: Name a task while casting the spell. All objects that could help you with this task will become obvious to you",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 154,
    "summary": "Study an object for one turn to learn its intended purpose, whether it lacks one, and any problem preventing it from functioning. The basic spell identifies function without automatically teaching operation.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-1-detect-substance",
    "name": "Detect Substance",
    "originalName": "Detect Substance",
    "requirements": {
      "Matter": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Investigation",
      "Science"
    ],
    "description": "Become aware of a chosen type of substance in the area. \"Iron\", \"A knife\" and \"My hunting Knife\" are all valid choices Add Time 1: Determine if an object has been in the area Add Forces 1: Search for a specific type of electronic information",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 154,
    "summary": "Choose a substance or type of object and sense every matching example within the area, from broad categories such as iron to a specific personal item.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-1-discern-composition",
    "name": "Discern Composition",
    "originalName": "Discern Composition",
    "requirements": {
      "Matter": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Investigation",
      "Science"
    ],
    "description": "Become aware of an objects weight, density and the precise elements in it's makeup +1 Reach: Also become aware of any objects hidden within the studied object +1 Reach: You know an object's structural weak points. Reduce Durability by spell Potency Add Space 2: Know not only what an object was made of but also where the materials came from",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 154,
    "summary": "Learn an object’s weight, density, and precise material composition. The information describes what it is made from rather than its history or origin.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-1-lodestone",
    "name": "Lodestone",
    "originalName": "Lodestone",
    "requirements": {
      "Matter": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Larceny",
      "Science"
    ],
    "description": "Choose a substance or type of object. Those objects will be drawn toward you or repelled away from you",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 154,
    "summary": "Choose a substance or type of object and compel matching matter in the area to move toward or away from the subject for the Duration.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-1-remote-control",
    "name": "Remote Control",
    "originalName": "Remote Control",
    "requirements": {
      "Matter": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Drive",
      "Intimidation"
    ],
    "description": "Control a mechanical object, to make it fulfill its function +1 Reach: Perform more complex task while controlling the object",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 155,
    "summary": "Compel a mechanical object to perform its normal function without physical operation. The basic spell handles simple actions, with complex or extended tasks requiring additional Reach.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-2-alchemist-s-touch",
    "name": "Alchemist's Touch",
    "originalName": "Alchemist's Touch",
    "requirements": {
      "Matter": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Survival",
      "Persuasion"
    ],
    "description": "Choose a material, you become largely immune to its deleterious effects. The material cannot inflict bashing damage and lethal damage is reduced by spell Potency. The spell does not protect against damage from a sword or gun +1 Reach: Choose an additional material to be protected against +2 Reach: Your immune to both the bashing and lethal, aggravated damage is reduced by Potency Add Forces 2: You are now also protected against the damage from the extreme temperature of a material",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 155,
    "summary": "Choose one material and protect the subject from its direct harmful properties: it cannot inflict bashing damage and its lethal damage is reduced by Potency. The protection does not stop an object made from that material from harming through shape or force, such as a sword or bullet.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-2-find-the-balance",
    "name": "Find the Balance",
    "originalName": "Find the Balance",
    "requirements": {
      "Matter": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Persuasion",
      "Science"
    ],
    "description": "Improve the balance and heft of an item. This grants it the 9-Again quality +1 Reach: Grant a tool the 8-Again quality instead",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 155,
    "summary": "Perfect a tool’s balance, weight, and handling so rolls using it gain 9-Again for the Duration.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-2-hidden-hoard",
    "name": "Hidden Hoard",
    "originalName": "Hidden Hoard",
    "requirements": {
      "Matter": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Larceny",
      "Occult",
      "Subterfuge"
    ],
    "description": "Make matter difficult to detect. Mundane attempts to locate automatically fail. Supernatural power enters a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 156,
    "summary": "Veil selected matter from detection: mundane attempts to locate it fail automatically, while supernatural searches provoke a Clash of Wills.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-2-machine-invisibility",
    "name": "Machine Invisibility",
    "originalName": "Machine Invisibility",
    "requirements": {
      "Matter": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Larceny",
      "Science",
      "Stealth"
    ],
    "description": "Become invisible to mechanical sensors. Supernatural items enter a Clash of Wills +1 Reach: This spell now also works on constructs animated with magic, like zombies and golems. This triggers a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 156,
    "summary": "Make the subject undetectable to mechanical sensors, cameras, and similar devices. Supernatural sensing devices may overcome the veil through a Clash of Wills.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-2-shaping",
    "name": "Shaping",
    "originalName": "Shaping",
    "requirements": {
      "Matter": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Persuasion"
    ],
    "description": "Shape liquids and gases in any form you desire in defiance of gravity +1 Reach: Can alter solids as well. Warped tools or weapons will have their equipment bonus reduced by potency, if reduced to 0 the object becomes useless +1 Reach: If creating or repairing an object in an extended action reduce its required successes by this spell's Potency, the number cannot fall below one +2 Reach: The shaping can create an appropriate Environmental Tilt, such as Earthquake, Flooded or Howling Winds",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 156,
    "summary": "Freely shape liquid or gaseous matter within Scale and hold it in forms that defy gravity. The spell changes form and position without transmuting the substance.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-aegis",
    "name": "Aegis",
    "originalName": "Aegis",
    "requirements": {
      "Matter": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Crafts",
      "Science"
    ],
    "description": "For each level of Potency grant an object one of the following: Raise/lower ballistic Armor by 1, raise/lower general Armor by 1, raise/lower Defense penalty by 1 +1 Reach: The armor becomes immune to the Armor-Piercing effect",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 156,
    "summary": "Modify wearable armor, spending each point of Potency to raise or lower ballistic armor, general armor, or its Defense penalty by one. Matter cannot use this spell to armor a living body directly.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-alter-conductivity",
    "name": "Alter Conductivity",
    "originalName": "Alter Conductivity",
    "requirements": {
      "Matter": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Computer",
      "Science",
      "Subterfuge"
    ],
    "description": "Make an object more or less conductive to electricity +1 Reach: Alter an objects conductivity to other forms of energy. Each additional type is an extra Reach",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 156,
    "summary": "Increase or decrease an object’s electrical conductivity by Potency. It can disable devices whose current cannot cause damage or modify damage conducted through the subject.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-alter-integrity",
    "name": "Alter Integrity",
    "originalName": "Alter Integrity",
    "requirements": {
      "Matter": 3
    },
    "practice": "Fraying or Perfecting",
    "primaryFactor": "Potency",
    "withstand": "Durability",
    "roteSkills": [
      "Crafts",
      "Medicine",
      "Subterfuge"
    ],
    "description": "Increase or decrease an objects Durability +1 Reach: Instead of increasing Durability by 1 increase structure by 2 +2 Reach: The effect is lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 156,
    "summary": "Increase or decrease an object’s Durability by Potency, resisted by its existing Durability. Changes to Durability alter the protection against Structure damage rather than repairing damage already suffered.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-crucible",
    "name": "Crucible",
    "originalName": "Crucible",
    "requirements": {
      "Matter": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Science"
    ],
    "description": "Grant a tool the 8-Again for a number of turns. Valuable objects will have their Availability rating increased, this rating cannot become more than double the original rating +1 Reach: Spend one point of Mana, The object gains the rote quality for a number of rolls. So long as the durability last this effect can be recharged by spending more Mana +1 Reach: Availability may be triple the original rating",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157,
    "summary": "Perfect a tool to grant 8-Again on up to Potency uses, or improve a valuable substance’s Availability by Potency to no more than twice its original rating.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:matter-3-hone-the-perfected-form",
    "name": "Hone the Perfected Form",
    "originalName": "Hone the Perfected Form",
    "requirements": {
      "Matter": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Persuasion",
      "Science"
    ],
    "description": "*Cost 1 Mana* The mage takes an ordinary metal (iron, gold, silver, mercury, copper, tin or lead) and transmutes it into its perfected metal. +2 Reach: The spell may Perfect another substance like Glass or Gemstones Forces ●●●: May perfect fire",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 61,
    "summary": "For one Mana, transmute one continuous piece of iron, gold, silver, mercury, copper, tin, or lead into its corresponding Perfected Metal for the Duration.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-nigredo-and-albedo",
    "name": "Nigredo and Albedo",
    "originalName": "Nigredo and Albedo",
    "requirements": {
      "Matter": 3
    },
    "practice": "Fraying or Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Brawl",
      "Medicine"
    ],
    "description": "Repair or damage an objects Structure +1 Reach: When damaging ignore durability",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157,
    "summary": "Repair or damage an object’s Structure by Potency. Damage normally applies Durability, while repairs restore lost Structure without changing the object’s maximum.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-shrink-and-grow",
    "name": "Shrink and Grow",
    "originalName": "Shrink and Grow",
    "requirements": {
      "Matter": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "Durability",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Science"
    ],
    "description": "Increase or decrease an objects size Add Life 3: Can be cast on living subjects, unwilling subjects may Withstand with Stamina",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157,
    "summary": "Increase or decrease an object’s Size by one per Potency, resisted by Durability. Size 0 objects can shrink only to roughly the size of a dime.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:matter-3-spell-potion",
    "name": "Spell Potion",
    "originalName": "Spell Potion",
    "requirements": {
      "Matter": 3,
      "Prime": 2
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Medicine",
      "Subterfuge"
    ],
    "description": "*Costs 1 Mana* Magically alters an ingested item, making it act as a storage vessel for another spell. Once the Ingested item has been primed for holding a mage may spend a Mana to cast any other spell on the item if it uses touch/self range. The cast spell doesn't take affect until the item is ingested. May store spells up to level of Potency which don't activate until either Spell Potion is canceled, the Duration ends or the food is injested",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 70,
    "summary": "For one Mana, turn food or drink into a vessel for up to Potency touch- or self-range spells, each stored for an additional Mana. The spells remain controlled and inactive until someone consumes the potion; consuming it empty provides no nutrition, and stored spells end with Spell Potion.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-state-change",
    "name": "State Change",
    "originalName": "State Change",
    "requirements": {
      "Matter": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "Durability",
    "roteSkills": [
      "Crafts",
      "Persuasion",
      "Science"
    ],
    "description": "Change material one step along the path from solid to liquid to gas. This does not cause any temperature change +1 Reach: You may transform solids directly int gas and vice versa Add Forces 3: You may transmute matter into plasma",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157,
    "summary": "Move inorganic matter one step between solid, liquid, and gas without changing its temperature. Newly solid matter has Durability equal to Potency and Structure equal to Durability + Size; when the spell ends, it returns to its natural state while retaining its current shape.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-windstrike",
    "name": "Windstrike",
    "originalName": "Windstrike",
    "requirements": {
      "Matter": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Brawl",
      "Crafts"
    ],
    "description": "Deal bashing damage +1 Reach: Create an appropriate Environmental Tilt",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157,
    "summary": "Drive air or another fluid into the subject as an attack, inflicting bashing damage equal to Potency.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-3-wonderful-machine",
    "name": "Wonderful Machine",
    "originalName": "Wonderful Machine",
    "requirements": {
      "Matter": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Politics",
      "Science"
    ],
    "description": "Integrate multiple machines into one another Add Life 3: Machine properties can be grafted onto a living thing or vice versa",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 157,
    "summary": "Transfer one mechanical quality per Potency from component objects into another machine, including swapping weapon characteristics or concealing a firearm within a device. The resulting machine combines functions without creating capabilities absent from its components.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:matter-4-endless-bounty",
    "name": "Endless Bounty",
    "originalName": "Endless Bounty",
    "requirements": {
      "Matter": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Science",
      "Streetwise"
    ],
    "description": "Never run out of small expendable items. Enchant a single item that contains a smaller expendable item. For the duration of the spell the expendable item never runs out E.g.: Money in wallet, Bullets in magazine, Gas in car tank",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 66,
    "summary": "Enchant a container holding at least one small expendable item so its contents never run out during the spell. Each generated unit may have a value up to Resources equal to Potency, covering ammunition, cash, fuel, and similar supplies.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:matter-4-forge-dumanium",
    "name": "Forge Dumanium",
    "originalName": "Forge Dumanium",
    "requirements": {
      "Matter": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Persuasion"
    ],
    "description": "*Costs 1 Mana* Combine perfected metals into a single metal called Dumanium. The object is Durability 1 and holds 1 point of Mana. Weapons made from Dumanium can spend Mana to deal aggravated Damage for a single attack +2 Reach: The Spell is Lasting however this relies on all the Metals to remain perfect, should a perfected metal become mundane the alloy will collapse",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 62,
    "summary": "For one Mana, alloy Perfected kassiterum and siderite into dumanium with base Durability 1 and Mana capacity 1. Allocate Potency among Durability, Mana capacity, equipment bonus up to +5, or 1/1 armor; a weapon may spend stored Mana to deal aggravated damage for one attack.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:matter-4-forge-sophis",
    "name": "Forge Sophis",
    "originalName": "Forge Sophis",
    "requirements": {
      "Matter": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Science"
    ],
    "description": "*Costs 1 Mana* Combine perfected metals into a single metal that scavenges Mana called Sophis. The object is Durability 1 and can hold 1 Mana. Potency increases this 1 for 1 for Durability and Mana. +2 Reach: The Spell is Lasting however this relies on all the Metals to remain perfect, should a perfected metal become mundane the alloy will collapse",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 62,
    "summary": "For one Mana, alloy Perfected apeiron, bronzium, and hermium into sophis with base Durability 1 and Mana capacity 1, allocating Potency between them. Once per scene, it captures one Mana when its holder spends Mana, without reducing that expenditure.",
    "summaryReviewed": true
  },
  {
    "id": "mta-signs-of-sorcery:matter-4-forge-thaumium",
    "name": "Forge Thaumium",
    "originalName": "Forge Thaumium",
    "requirements": {
      "Matter": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Survival"
    ],
    "description": "*Costs 1 Mana* Combine perfected metals to create Thaumium, The object is Durability 1 and holds 1 point of Mana which it spends to shield against Magic. +2 Reach: The Spell is Lasting however this relies on all the Metals to remain perfect, should a perfected metal become mundane the alloy will collapse Other Arcanum ●●: Thaumium can protect against other types of Magic provided they fall under the Arcanum",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 62,
    "summary": "For one Mana, alloy Perfected orichalcum, lunargent, and hermium into thaumium with base Durability 1 and Mana capacity 1, allocating Potency between them. While charged, it spends one Mana to Clash against unwanted Supernal magic using its creator’s casting-time Gnosis + Matter.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-4-ghostwall",
    "name": "Ghostwall",
    "originalName": "Ghostwall",
    "requirements": {
      "Matter": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Occult",
      "Stealth"
    ],
    "description": "Turn objects intangible Add Death 3, Mind 3 or Spirit 3: The object may be shifted into the Twilight, attuned to the used Arcanum",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158,
    "summary": "Render a volume of inert matter partly or wholly insubstantial for the Duration. It remains in place and does not enter Twilight, but ceases to register as materially real.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-4-golem",
    "name": "Golem",
    "originalName": "Golem",
    "requirements": {
      "Matter": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "Animate a statue or other object Add Death 4 or Spirit 4: A ghost or spirit may serve as the intelligence of the golem Add Mind 5: Grant true  intelligence see \"Psychic Genesis\"",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158,
    "summary": "Animate an object as a mindless Retainer rated equal to Potency for simple labor, combat, and similar tasks. It follows only its latest simple order, has no Defense, and retains material Durability with Structure equal to Durability + Size.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-4-piercing-earth",
    "name": "Piercing Earth",
    "originalName": "Piercing Earth",
    "requirements": {
      "Matter": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Brawl",
      "Crafts"
    ],
    "description": "Deal lethal damage +1 Reach: Create an appropriate Environmental Tilt +1 Reach: Spend a point of Mana, deal aggravated damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158,
    "summary": "Make solid matter rise and crush the subject as an attack, inflicting lethal damage equal to Potency.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-4-transubstantiation",
    "name": "Transubstantiation",
    "originalName": "Transubstantiation",
    "requirements": {
      "Matter": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Science"
    ],
    "description": "Transform any type of matter into another type +1 Reach: Transmute multiply substance into a single substance or vice versa Add Life 4: Transform matter into living things or vice versa",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158,
    "summary": "Transform one relatively pure inert substance into another, with quality or purchasing value equal to Potency. Both source and result must be coherent substances rather than intricate mixtures.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-5-annihilate-matter",
    "name": "Annihilate Matter",
    "originalName": "Annihilate Matter",
    "requirements": {
      "Matter": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "Durability",
    "roteSkills": [
      "Athletics",
      "Intimidation",
      "Science"
    ],
    "description": "Destroy matter completely +1 Reach: Spend a point of Mana, can now destroy magical objects as well",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158,
    "summary": "Completely erase inert matter, leaving no fragments or residue, resisted by Durability. The basic spell cannot destroy magical materials or objects.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-5-ex-nihilo",
    "name": "Ex Nihilo",
    "originalName": "Ex Nihilo",
    "requirements": {
      "Matter": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Science"
    ],
    "description": "Create an object or relatively uncomplicated tool out of nothing +1 Reach: Create a complex machine or electronic device, like a car or smartphone",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 158,
    "summary": "Create a simple tool or relatively uncomplicated machine from nothing, with Size set by Scale. Allocate Potency between the object’s Durability and equipment bonus.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:matter-5-self-repairing-machine",
    "name": "Self-Repairing Machine",
    "originalName": "Self-Repairing Machine",
    "requirements": {
      "Matter": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Medicine",
      "Occult"
    ],
    "description": "Cause a machine to repair Potency in Structure per day +1 Reach: The machine heals every hour +2 Reach: The machine heals every 15 minutes",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159,
    "summary": "Give a machine the ability to repair itself, restoring Structure equal to Potency once per day until it reaches its normal maximum.",
    "summaryReviewed": true
  },
  {
    "id": "mta-2ed:mind-1-know-nature",
    "name": "Know Nature",
    "originalName": "Know Nature",
    "requirements": {
      "Mind": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Science",
      "Subterfuge"
    ],
    "description": "Determine a subject's Virtue, Vice and Mental and Social Attribute levels +1 Reach: Also determine Aspirations and Obsessions",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:mind-1-mental-scan",
    "name": "Mental Scan",
    "originalName": "Mental Scan",
    "requirements": {
      "Mind": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Occult"
    ],
    "description": "Ask storyteller questions about a subject's mental or emotional state +1 Reach: Read surface thoughts for snippets of a subject's current ideas or words and phrases before they are actually spoken",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:mind-1-one-mind-two-thoughts",
    "name": "One Mind, Two Thoughts",
    "originalName": "One Mind, Two Thoughts",
    "requirements": {
      "Mind": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Expression",
      "Science"
    ],
    "description": "Perform two Mental or Social extended tasks at the same time. Neither can be a purely Physical task. +1 Reach: May perform two Mental instant tasks at the same time +2 Reach: If in the Astral Realms one of the actions may be \"Physical\"",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 159
  },
  {
    "id": "mta-2ed:mind-1-perfect-recall",
    "name": "Perfect Recall",
    "originalName": "Perfect Recall",
    "requirements": {
      "Mind": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Expression",
      "Investigation"
    ],
    "description": "Recall old memories with perfect accuracy.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:mind-2-alter-mental-pattern",
    "name": "Alter Mental Pattern",
    "originalName": "Alter Mental Pattern",
    "requirements": {
      "Mind": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Science",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Add to subterfuge rolls. Supernatural powers that read surface thoughts or emotions provoke a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:mind-2-dream-reaching",
    "name": "Dream Reaching",
    "originalName": "Dream Reaching",
    "requirements": {
      "Mind": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Empathy",
      "Medicine",
      "Persuasion"
    ],
    "description": "Enter a subject's dream. You can influence but not take part in the dream. Cast on self to be able to remember your own dreams. +1 Reach: You can become an active part of the dream. Cast on self induces lucid dreaming",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:mind-2-emotional-urging",
    "name": "Emotional Urging",
    "originalName": "Emotional Urging",
    "requirements": {
      "Mind": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Empathy",
      "Intimidation",
      "Subterfuge"
    ],
    "description": "Open or close a subject's doors",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:mind-2-first-impressions",
    "name": "First Impressions",
    "originalName": "First Impressions",
    "requirements": {
      "Mind": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Crafts",
      "Socialize",
      "Subterfuge"
    ],
    "description": "Raise or lower the first impression",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:mind-2-incognito-presence",
    "name": "Incognito Presence",
    "originalName": "Incognito Presence",
    "requirements": {
      "Mind": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Costs ●. The Mage hides the Subject's Psychic Presence which Prevents people form remembering their presence or looking their way. Active attempts to do so with supernatural abilities (Including active Mage sight) provoke a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:mind-2-memory-hole",
    "name": "Memory Hole",
    "originalName": "Memory Hole",
    "requirements": {
      "Mind": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Medicine",
      "Subterfuge"
    ],
    "description": "Hide a specific memory forgetting it completely for the duration of the spell, One memory per Potency",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-2ed:mind-2-mental-shield",
    "name": "Mental Shield",
    "originalName": "Mental Shield",
    "requirements": {
      "Mind": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Intimidation",
      "Survival"
    ],
    "description": "Protects the Subject from Mental Attacks, Goetia Powers, Influences or Manifestations that target them. +1 Reach: Also Protects from Physical attacks of Goetia",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 160
  },
  {
    "id": "mta-signs-of-sorcery:mind-2-narcissus-mirror",
    "name": "Narcissus' Mirror",
    "originalName": "Narcissus' Mirror",
    "requirements": {
      "Mind": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Subterfuge"
    ],
    "description": "The mage can reflect the mental and emotional effects of a Nimbus tilt back onto its source. Whenever the Mage is subjected to a tilt that affects a Mental or Social trait this spell provokes a Clash of Wills. If the mage wins affect the instigator of the Tilt. Can be cast if the Mage is already under the effects of a tilt to immediately create a Clash of Wills Substitute Life ••: This Spell affects Nimbus Tilts relating to Physical Traits or purely Physical effects instead Add Life ••: This Spell affects all types of Nimbus Tilt Add Prime ••: Affects other type of Supernatural Auras with the appropriate kinds of effects",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 94
  },
  {
    "id": "mta-2ed:mind-2-psychic-domination",
    "name": "Psychic Domination",
    "originalName": "Psychic Domination",
    "requirements": {
      "Mind": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Expression",
      "Intimidation",
      "Subterfuge"
    ],
    "description": "Send one word commands to a subject that they are compelled to act upon, even against their will +1 Reach: take control of a subject, forcing him to take actions against their will. These actions cannot put him serious danger however +1 Reach: Force the subject to take an additional task",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-signs-of-sorcery:mind-2-ritual-focus",
    "name": "Ritual Focus",
    "originalName": "Ritual Focus",
    "requirements": {
      "Mind": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Empathy",
      "Leadership",
      "Persuasion"
    ],
    "description": "A Variant on Telepathy linking a Mage and his Subjects allowing him to guide them as they work in unison on a particular spell (see \"Teamwork\", MtAw 2e p.119) Must have Scale to affect every other Awakened participant in Ritual. Secondary Actors in ritual add Potency to dice pool",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 55
  },
  {
    "id": "mta-signs-of-sorcery:mind-2-soul-windows",
    "name": "Soul Windows",
    "originalName": "Soul Windows",
    "requirements": {
      "Mind": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Stealth"
    ],
    "description": "By Splitting their senses a mage may view whats happening around their Soul Stone 360° or hears the sounds in its vicinity. This doesn't require sympathetic range Add Forces ••: The mage may project their voice through the stone to speak or create a hologram of themselves +1 Reach: The mage experiences the Stone's surroundings with all their Senses +1 Reach: For each reach spent the Mage may split their senses to another Soul Stone",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 90
  },
  {
    "id": "mta-2ed:mind-2-telepathy",
    "name": "Telepathy",
    "originalName": "Telepathy",
    "requirements": {
      "Mind": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Socialize"
    ],
    "description": "Surface thoughts of the subjects play out in the each others minds. This may grant a bonus or penalty between the subjects. A deliberate message may be send along the link. +1 Reach: Only thoughts that the originating subject wants to share are shared +1 Reach: All subjects have the ability to send and receive thoughts",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-signs-of-sorcery:mind-3-astral-grimoire",
    "name": "Astral Grimoire",
    "originalName": "Astral Grimoire",
    "requirements": {
      "Mind": 3,
      "Prime": 1
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "Total Arcanum dots used in rote",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "*Costs 1 Mana* Scribe a Rote within ones own Oneiros, these can be cast from the Grimoire without needing to meditate to the Astral +1 Reach: The Mage can scribe the grimoire within the Temenos making it available to any who travel there. These can only be cast directly from the Astral representation or with its Summoned goetia +1 Reach: For 1 point of Mana the Spell's duration is lasting +2 Reach: The Mage can scribe within the Anima Mundi, these don't manifest as books or scrolls but as constellations or rock formations. Figuring these out is a mystery of itself",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 85
  },
  {
    "id": "mta-2ed:mind-3-augment-mind",
    "name": "Augment Mind",
    "originalName": "Augment Mind",
    "requirements": {
      "Mind": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Expression",
      "Survival"
    ],
    "description": "Increase a Mental or Social Attribute by Potency, up to normal limits. +1 Reach: Divide increase between an additional Attribute. +2 Reach: for 1 Mana, go above normal limits.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:mind-3-befuddle",
    "name": "Befuddle",
    "originalName": "Befuddle",
    "requirements": {
      "Mind": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "Composure or Resolve",
    "roteSkills": [
      "Intimidation",
      "Persuasion",
      "Science"
    ],
    "description": "Lower a Mental or Social Attributes. One Potency equal one dot to a minimum of one. +1 Reach: May lower an additional Attribute per reach, dividing Potency among the options",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-signs-of-sorcery:mind-3-broken-relinquishment",
    "name": "Broken Relinquishment",
    "originalName": "Broken Relinquishment",
    "requirements": {
      "Mind": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Subterfuge"
    ],
    "description": "This spell creates a breaking point for the subject as a way to relinquish spells without spending a willpower dot. The next act of hubris, braking point or genre equivalent by a subject of this spell suffers penalty by Potency +1 Reach: The Subject of this spell immediately suffers a breaking point",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 73
  },
  {
    "id": "mta-2ed:mind-3-clear-thoughts",
    "name": "Clear Thoughts",
    "originalName": "Clear Thoughts",
    "requirements": {
      "Mind": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Intimidation",
      "Persuasion"
    ],
    "description": "Suppress a Mental Condition or Tilt per Potency, for the Duration. Can't affect Paradox Conditions; those cause by the supernatural provoke a Clash of Wills. +1 Reach: subject gains 1 Willpower. +2 Reach: effect is lasting.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-2ed:mind-3-enhance-skill",
    "name": "Enhance Skill",
    "originalName": "Enhance Skill",
    "requirements": {
      "Mind": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Expression",
      "Survival"
    ],
    "description": "Increase an Skill with already at least one rank by Potency, for the Duration, up to their normal limits. +1 Reach: Divide increase between an additional Skill. + 2 Reach: for 1 Mana, go above normal limits.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 161
  },
  {
    "id": "mta-signs-of-sorcery:mind-3-give-me-that",
    "name": "Give Me That",
    "originalName": "Give Me That",
    "requirements": {
      "Mind": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Persuasion"
    ],
    "description": "The subject item evokes a concept of ownership. Those who do not Withstand the spell gain the Persistent Condition: Obsession with the object as their focus Space ●●●: Individuals with the Obsessed Condition to the object also gain a Strong sympathetic link to it for the spells duration",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 66
  },
  {
    "id": "mta-2ed:mind-3-goetic-summons",
    "name": "Goetic Summons",
    "originalName": "Goetic Summons",
    "requirements": {
      "Mind": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "Rank",
    "roteSkills": [
      "Persuasion",
      "Socialize",
      "Occult"
    ],
    "description": "Call the nearest Goetia; one personally known, specified by type of Resonance, or the nearest generally. Add Spirit or Death 2: it gains the Materialized Condition for the duration. +1 Reach: Also creates the Open Condition. +1 Reach: May give it a one-word command. +2 Reach: may give a complex but single task command. +1 Reach: summon a Goetia from the subject's Oneiros at a place one could reach the Astral. Must spend the Mana it would take to enter. +2 Reach: summon from the Temenos. +3 Reach: summon from Anima Mundi.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:mind-3-imposter",
    "name": "Imposter",
    "originalName": "Imposter",
    "requirements": {
      "Mind": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Persuasion",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Cause the subject to believe the caster is someone else. Manipulation + Subterfuge every minute if mimicking a specific person. Can't replicate Social Merits; any Doors opened benefit the assumed identity.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:mind-3-psychic-assault",
    "name": "Psychic Assault",
    "originalName": "Psychic Assault",
    "requirements": {
      "Mind": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Intimidation",
      "Medicine"
    ],
    "description": "Deal Bashing equal to Potency, mimicking a stroke. +1 Reach: give target -1 to Mental rolls (may stack 3 times).",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:mind-3-sleep-of-the-just",
    "name": "Sleep of the Just",
    "originalName": "Sleep of the Just",
    "requirements": {
      "Mind": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Academics",
      "Athletics",
      "Occult"
    ],
    "description": "Control sleep cycle and dreams. Anything else entering or influencing dreams provokes Clash of Wills.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-signs-of-sorcery:mind-3-supernal-translation",
    "name": "Supernal Translation",
    "originalName": "Supernal Translation",
    "requirements": {
      "Mind": 3,
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Expression",
      "Occult"
    ],
    "description": "Allows the subject to comprehend and translate High Speech as they hear or read it as if they had up Mage Sight. Does not allow them to Speak or Write it back and is still subject to Dissonance and Quiescence",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 28
  },
  {
    "id": "mta-2ed:mind-3-read-the-depths",
    "name": "Read the Depths",
    "originalName": "Read the Depths",
    "requirements": {
      "Mind": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Medicine"
    ],
    "description": "Read memories and ideas from target's subconscious. +1 Reach: modify one of the memories read, for the Duration.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-2ed:mind-3-universal-language",
    "name": "Universal Language",
    "originalName": "Universal Language",
    "requirements": {
      "Mind": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Investigation",
      "Persuasion"
    ],
    "description": "Target can understand and translate any language they are able to perceive: spoken, written, symbols, encoded signals, body language, hand symbols, or thoughts. Does not allow non-Awakened to understand High Speech.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 162
  },
  {
    "id": "mta-signs-of-sorcery:mind-4-haunted-grimoire",
    "name": "Haunted Grimoire",
    "originalName": "Haunted Grimoire",
    "requirements": {
      "Mind": 4,
      "Prime": 1
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Total Arcanum dots of Rote + Rank",
    "roteSkills": [
      "Crafts",
      "Intimidation",
      "Occult"
    ],
    "description": "*Costs 1 Mana* The Mage binds a Goetia to a grimoire, writing its essence into the vessel's pattern. This doesn't host the Goetia's numina or influences nor does it have an essence pool. The Grimoire gains the Open and Resonant Conditions. When cast the spell is increased by the Goetia Rank for Primary Factor however the Goetia has a chance to escape with a Clash of Wills to the caster. When someone memorizes a Rote the Goetia has a chance to possess them using a Clash of Wills. This spell is a Wisdom Sin against Understanding",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 86
  },
  {
    "id": "mta-2ed:mind-4-possession",
    "name": "Possession",
    "originalName": "Possession",
    "requirements": {
      "Mind": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Medicine",
      "Persuasion",
      "Subterfuge"
    ],
    "description": "Can possess the subject inflicting the Possessed Condition(see p. 261)",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:mind-4-gain-skill",
    "name": "Gain Skill",
    "originalName": "Gain Skill",
    "requirements": {
      "Mind": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Science"
    ],
    "description": "Increase a Skill by Potency. This cannot go above the normal maximum. +1 Reach: Divide the increase between an additional Skill. + 1 Reach: for 1 Mana, go above normal limits.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-signs-of-sorcery:mind-4-goetic-evocation",
    "name": "Goetic Evocation",
    "originalName": "Goetic Evocation",
    "requirements": {
      "Mind": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Rank of Entity",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Persuasion"
    ],
    "description": "May convert pieces of a persons Psyche from a soul stone into a Goetia +2 Reach: The Mage may extract the Goetia directly into his own Oneiros",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 90
  },
  {
    "id": "mta-2ed:mind-4-hallucination",
    "name": "Hallucination",
    "originalName": "Hallucination",
    "requirements": {
      "Mind": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Academics",
      "Persuasion",
      "Subterfuge"
    ],
    "description": "Create an illusion that affects all senses but touch. +1 Reach: The illusion can now be \"touched\" by the subject. It cannot harm or attack.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 163
  },
  {
    "id": "mta-2ed:mind-4-mind-flay",
    "name": "Mind Flay",
    "originalName": "Mind Flay",
    "requirements": {
      "Mind": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Intimidation",
      "Science"
    ],
    "description": "Deal lethal damage. +1 Reach: Cause Insane Tilt +2 Reach: Spend a point of Mana, deal aggravated damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:mind-4-psychic-projection",
    "name": "Psychic Projection",
    "originalName": "Psychic Projection",
    "requirements": {
      "Mind": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Academics",
      "Occult",
      "Socialize"
    ],
    "description": "Astral project into Twilight or into somebody's dreams. Add Spirit 2: May project into the Shadow. Withstand is Gauntlet rating.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:mind-4-psychic-reprogramming",
    "name": "Psychic Reprogramming",
    "originalName": "Psychic Reprogramming",
    "requirements": {
      "Mind": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Intimidation",
      "Medicine",
      "Persuasion"
    ],
    "description": "For each point of Potency change one of the followin: Virtue, Vice, Short-Term Aspiration, Long-Term Aspiration, Obsession, a non-Physical Persistent Condition, or may move one dot between two Social Skills, or between two Mental Skills. +1 Reach: May also move between two Social Attributes, or two Mental Attributes.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-signs-of-sorcery:mind-4-scribe-daimonomikon",
    "name": "Scribe Daimonomikon",
    "originalName": "Scribe Daimonomikon",
    "requirements": {
      "Mind": 4,
      "Prime": 1
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Rank of Attainment + (10 - Caster's Gnosis)",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "*Cost 1 Mana* Scribe a Daimonomikon for the Mage's Legacy. A Mage must be of Gnosis 2 or above to cast this. Anyone initiated into a Legacy via a Daimonomikon must spend 1 Arcane Experience and if used to learn more Legacy Attainments must use the Experience cost listed for learning without a tutor. These serve as a sympathetic Yantra worth +2 Dice for members of the inscribed Legacy +1 Reach: For 1 Mana, the Spell's Duration is Lasting",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 87
  },
  {
    "id": "mta-2ed:mind-4-terrorize",
    "name": "Terrorize",
    "originalName": "Terrorize",
    "requirements": {
      "Mind": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Expression",
      "Intimidation",
      "Medicine"
    ],
    "description": "Cause the Insensate Tilt for the duration or until it's resolved +1 Reach: Inflict Broken Condition instead",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:mind-5-amorality",
    "name": "Amorality",
    "originalName": "Amorality",
    "requirements": {
      "Mind": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Expression"
    ],
    "description": "Remove Virtue or Vice. Without Virtue the subject regains two Willpower for indulging Vice. Without Vice the subject cannot engage in any activity that would be a breaking point or Act of Hubris",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:mind-5-no-exit",
    "name": "No Exit",
    "originalName": "No Exit",
    "requirements": {
      "Mind": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Expression",
      "Persuasion",
      "Science"
    ],
    "description": "For the duration of the spell the subject is in a catatonic state. Reading of the subjects mind or memory reveals this spell.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:mind-5-mind-wipe",
    "name": "Mind Wipe",
    "originalName": "Mind Wipe",
    "requirements": {
      "Mind": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Academics",
      "Intimidation",
      "Occult"
    ],
    "description": "Remove large portions of the subjects memories, inflicts the Amnesia Tilt for the duration of the spell. You can affect one month of time per level Potency. You can specify what portions are forgotten. +1 Reach: May specify what memories are erased, rather than just erasing a single span of time. +2 Reach: The effect is Lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 164
  },
  {
    "id": "mta-2ed:mind-5-psychic-genesis",
    "name": "Psychic Genesis",
    "originalName": "Psychic Genesis",
    "requirements": {
      "Mind": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Expression",
      "Science"
    ],
    "description": "Create a self-aware intelligence. This is a Rank 1 Goetia in Twilight. +1 Reach: The entity works as a sleepwalker for the purposes of assisting ritual casting. +1 Reach: For one Mana, the rank is 2",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:mind-5-social-networking",
    "name": "Social Networking",
    "originalName": "Social Networking",
    "requirements": {
      "Mind": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Persuasion",
      "Politics",
      "Socialize"
    ],
    "description": "For every level of Potency, gain one dot in one of the following Merits: Allies, Contacts or Status",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:prime-1-dispel-magic",
    "name": "Dispel Magic",
    "originalName": "Dispel Magic",
    "requirements": {
      "Prime": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "Arcanum rating of the subject spell’s caster",
    "roteSkills": [
      "Athletics",
      "Intimidation",
      "Occult"
    ],
    "description": "Temporarily suppress or destroy an active spell Add Fate 1: Selectively suppress spell +2 Reach: Make the effect Lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-signs-of-sorcery:prime-1-nimbus-tuning",
    "name": "Nimbus Tuning",
    "originalName": "Nimbus Tuning",
    "requirements": {
      "Prime": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Occult"
    ],
    "description": "The mage can tune in more attentively to any Signature Nimbus he scrutinizes with Focused Mage sight. For Each potency learn one of the following: Gnosis, Wisdom, Virtue/Vice, An Act of Hubris resulting from cast magic, An Obsession related to the remaining Magic, Whether the Magic resulted in Paradox",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 94
  },
  {
    "id": "mta-2ed:prime-1-pierce-deception",
    "name": "Pierce Deception",
    "originalName": "Pierce Deception",
    "requirements": {
      "Prime": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Investigation",
      "Medicine",
      "Occult"
    ],
    "description": "See through falsehoods magical and mundane +1 Reach: Get a sense of the actual truth",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 165
  },
  {
    "id": "mta-2ed:prime-1-sacred-geometry",
    "name": "Sacred Geometry",
    "originalName": "Sacred Geometry",
    "requirements": {
      "Prime": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Occult",
      "Survival"
    ],
    "description": "Reveal ley lines and nodes +1 Reach: Reveal Hallows Add Death 1 or Spirit 1: See Avernian Gates or Loci as well.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:prime-1-scribe-grimoire",
    "name": "Scribe Grimoire",
    "originalName": "Scribe Grimoire",
    "requirements": {
      "Prime": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "Total Arcanum dots of all Arcana used in the spell being scribed",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "Create a Grimoire full of Rotes or transcribe it from one medium to another +1 Reach: Make the Grimoire Lasting Add Forces ●●: Transcribe the grimoire without needed equipment.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166,
    "additionalSources": [
      {
        "sourceId": "mta-signs-of-sorcery",
        "source": "Signs of Sorcery",
        "page": 83
      }
    ]
  },
  {
    "id": "mta-signs-of-sorcery:prime-1-shared-sight",
    "name": "Shared Sight",
    "originalName": "Shared Sight",
    "requirements": {
      "Prime": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Expression",
      "Investigation",
      "Occult"
    ],
    "description": "*Cost 1+ Mana per Arcanum per subject* Share your Mage sight with another Mage Prime ●●●●: Can be used on a Sleepwalker under the effects of Apocalypse Other Arcanum ●: *1 Mana per Arcanum* May add or substitute Prime for another Arcanum",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 28
  },
  {
    "id": "mta-signs-of-sorcery:prime-1-supernal-signature",
    "name": "Supernal Signature",
    "originalName": "Supernal Signature",
    "requirements": {
      "Prime": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Intimidation",
      "Politics"
    ],
    "description": "The Mage flares her Immediate Nimbus to imprint her signature on a subject, The signature reflects her Shadow Name and lasts for the Duration of the spell. Anyone who Studies the nimbus under focused mage sight can not only sense the details of the Nimbus but the Casters Supernal Identity. This moves the Caster one impression level up the Social Maneuvering unless the viewer succeeds a Resolve + Composure - Potency roll",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 93
  },
  {
    "id": "mta-2ed:prime-1-supernal-vision",
    "name": "Supernal Vision",
    "originalName": "Supernal Vision",
    "requirements": {
      "Prime": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Occult",
      "Survival"
    ],
    "description": "Perceive the Supernal properties of a subject +1 Reach: Perceive the non-Supernal magical properties of a subject",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:prime-1-word-of-command",
    "name": "Word of Command",
    "originalName": "Word of Command",
    "requirements": {
      "Prime": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Persuasion"
    ],
    "description": "Bypass triggers to activate magical effects Add Any Other Arcanum 1: Add another Arcanum to activate magical effects and objects created by other sources of power",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:prime-2-as-above-so-below",
    "name": "As Above, So Below",
    "originalName": "As Above, So Below",
    "requirements": {
      "Prime": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Occult",
      "Politics"
    ],
    "description": "Empower Yantras with 9-Again on spellcasting rolls +1 Reach: Make it 8-again",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 166
  },
  {
    "id": "mta-2ed:prime-2-cloak-nimbus",
    "name": "Cloak Nimbus",
    "originalName": "Cloak Nimbus",
    "requirements": {
      "Prime": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Politics",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Veil Nimbus and emotional state of auras. Attempts to see are subject to a Clash of Wills. Immediate Nimbus does not flare unless the caster chooses to. Signature Nimbus viewed by Mage Sight provokes Clash of Wills. Flaring or imprinting your Nimbus will immediately end this spell +1 Reach: Make your Nimbus appear lesser. For every Reach you may lower any of Gnosis, Mana or Arcanum to a desired lower false Trait value",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 167
  },
  {
    "id": "mta-signs-of-sorcery:prime-2-fracture-grimoire",
    "name": "Fracture Grimoire",
    "originalName": "Fracture Grimoire",
    "requirements": {
      "Prime": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Investigation",
      "Occult"
    ],
    "description": "*Costs 1 Mana* The mage copies one whole grimoire into two or more disparate parts that individually mean nothing. Only someone with all parts may use the rotes within the Grimoire +1 Reach: The mage may fracture the Grimoire into as many pieces as she wants.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 84
  },
  {
    "id": "mta-2ed:prime-2-invisible-runes",
    "name": "Invisible Runes",
    "originalName": "Invisible Runes",
    "requirements": {
      "Prime": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Intimidation",
      "Persuasion"
    ],
    "description": "Leave message in High Speech only visible to Mage Sight. Alteration or overwriting of these messages provokes a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 167
  },
  {
    "id": "mta-signs-of-sorcery:prime-2-light-under-a-bushel",
    "name": "Light Under a Bushel",
    "originalName": "Light Under a Bushel",
    "requirements": {
      "Prime": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Subterfuge"
    ],
    "description": "Adds Mages Potency to the number of rolls before Mages Nimbus leaks into a mystery",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 28
  },
  {
    "id": "mta-signs-of-sorcery:prime-2-nimbus-forgery",
    "name": "Nimbus Forgery",
    "originalName": "Nimbus Forgery",
    "requirements": {
      "Prime": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Larceny",
      "Subterfuge"
    ],
    "description": "Once a Mage has scrutinized an Immediate or Signature Nimbus with Focused mage sight she may cast this spell to disguise her own Nimbus as the Scrutinized one. If its the Immediate Nimbus it copies the Tilts of the Forged one instead of her own, if Signature nimbus any spell left behind holds the Forged one instead of her own until this spells duration ends. Any attempt to pierce the deception results with a Clash of Wills +1 Reach: The Mage Forges all three types of nimbus with one casting even if she's only scrutinized one.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 94
  },
  {
    "id": "mta-signs-of-sorcery:prime-2-path-to-jerusalem",
    "name": "Path to Jerusalem",
    "originalName": "Path to Jerusalem",
    "requirements": {
      "Prime": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Potency",
    "withstand": "Opacity",
    "roteSkills": [
      "Expression",
      "Larceny",
      "Subterfuge"
    ],
    "description": "Add Spell's Potency to the Opacity of the Subject Mystery +1 Reach: Every Reach spent allows mage to plant 1 falsehood of Surface or Deep information. Recognizing this is a Clash of Wills when focused on with Focused Mage Sight.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 28
  },
  {
    "id": "mta-2ed:prime-2-supernal-veil",
    "name": "Supernal Veil",
    "originalName": "Supernal Veil",
    "requirements": {
      "Prime": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Subterfuge",
      "Survival"
    ],
    "description": "Veil supernatural phenomenon including spells. Peripheral Mage Sight will fail to detect, active attempts cause a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-signs-of-sorcery:prime-2-sustain-nimbus",
    "name": "Sustain Nimbus",
    "originalName": "Sustain Nimbus",
    "requirements": {
      "Prime": 2,
      "Time": 1
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Investigation",
      "Survival"
    ],
    "description": "The mage casts this on a Signature Nimbus she's studied under Focused Mage Sight. Rather than fading like normal the Nimbus persists for the Duration of the spell, Once the Duration expires it fades at its usual rate +2 Reach: Duration is Lasting",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 93
  },
  {
    "id": "mta-2ed:prime-2-wards-and-signs",
    "name": "Wards and Signs",
    "originalName": "Wards and Signs",
    "requirements": {
      "Prime": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Survival"
    ],
    "description": "When subject is target of a spell apply Potency as Withstand rating. Spells used near but not directly at the target are not Withstood by this spell",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-2ed:prime-2-words-of-truth",
    "name": "Words of Truth",
    "originalName": "Words of Truth",
    "requirements": {
      "Prime": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Intimidation",
      "Persuasion"
    ],
    "description": "All subjects of the spell can hear and understand the caster regardless of distance, noise or language barriers. Subjects feel what the mage says is true, but this effect only works on statements the mage knows are true. May remove one Door or improve impression level by one per Potency",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-2ed:prime-3-aetheric-winds",
    "name": "Aetheric Winds",
    "originalName": "Aetheric Winds",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Expression",
      "Occult"
    ],
    "description": "Attack with shrieking aetheric wind +1 Reach: Create Heavy Winds Environmental Tilt +1 Reach: Destroy target's Mana instead of dealing damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-camera-obscura",
    "name": "Camera Obscura",
    "originalName": "Camera Obscura",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Science"
    ],
    "description": "*Cost 1 Mana* This spell enchants a Camera, video recorder or similar device and allows it to record Supernal Energies allowing a mage to study the recordings using Active and Focused mage sight. +2 Reach: 1 Mana to make the recordings Lasting",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 28
  },
  {
    "id": "mta-2ed:prime-3-channel-mana",
    "name": "Channel Mana",
    "originalName": "Channel Mana",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Politics",
      "Socialize"
    ],
    "description": "Move Mana equal to Potency between vessels(mages, Hallows, etc). This cannot exceed Gnosis-derived the Mana per turn limit though +1 Reach: Ignore Mana per turn limit for this spell",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-2ed:prime-3-cleanse-pattern",
    "name": "Cleanse Pattern",
    "originalName": "Cleanse Pattern",
    "requirements": {
      "Prime": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Investigation",
      "Occult",
      "Stealth"
    ],
    "description": "Remove the dramatic failure of a focused Mage Sight Revelation. This spell will also remove a mage's Signature Nimbus form the subject",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-2ed:prime-3-display-of-power",
    "name": "Display of Power",
    "originalName": "Display of Power",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Brawl",
      "Occult",
      "Socialize"
    ],
    "description": "Imagos become visible to all forms of Active Mage Sight +2 Reach: For one Mana all attempts to Counterspell gain the Rote Quality Add Fate •: Make clauses of fae Contracts visible.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168,
    "additionalSources": [
      {
        "sourceId": "core-dark-eras-2",
        "source": "Dark Eras 2",
        "page": 379
      }
    ]
  },
  {
    "id": "mta-2ed:prime-3-ephemeral-enchantment",
    "name": "Ephemeral Enchantment",
    "originalName": "Ephemeral Enchantment",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Weaponry"
    ],
    "description": "Subject becomes solid to any and all Twilight entities +2 Reach: For one Mana, if the subject is a weapon it will inflict aggravated damage to one specified Twilight entity. Every additional entity costs one Mana",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:prime-3-geomancy",
    "name": "Geomancy",
    "originalName": "Geomancy",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Expression",
      "Occult"
    ],
    "description": "Move ley lines within the area of effect. May also change the Resonance Keyword of a Node",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-imbue-room",
    "name": "Imbue Room",
    "originalName": "Imbue Room",
    "requirements": {
      "Prime": 3,
      "Space": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Larceny",
      "Occult",
      "Science"
    ],
    "description": "Allows a Mage to prepare a room or space for the Imbue Item attainment. Unlike an object the room does not have Mana storage so all Mana must be spent by the user of the Imbued room",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 69
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-mana-battery",
    "name": "Mana Battery",
    "originalName": "Mana Battery",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Occult",
      "Subterfuge"
    ],
    "description": "Allows a Mage to prime an item to store Mana, The mage casts the spell on a subject prior to using the Attainment Imbue Item. The subject is Primed to accept a Mana pool but not a spell, the Number of successes necessary to imbue the item is equal to the Mana Pool imbued within. An Item created this way can be used to cast spells without using a Mages own Mana, and can be refilled with Mana using the spell Channel Mana",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 70
  },
  {
    "id": "mta-2ed:prime-3-platonic-form",
    "name": "Platonic Form",
    "originalName": "Platonic Form",
    "requirements": {
      "Prime": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Crafts",
      "Expression"
    ],
    "description": "*Cost 1+ Mana* - Create a simple Tass object or tool of Size 5 or less from Mana. Durability is 1 and contains one Mana. Potency may be allocated to the following effects: increase Durability by +1, increase Mana capacity by +1, if a tool add +1 equipment bonus though each use of the tool now uses one up Mana. When all Mana is used up the object crumbles. If the spell expires any unused Mana will be lost Add Forces ●●●: The construct is not obviously magical +1 Reach: If a tool it gains the 8-Again +2 Reach: The construct can be a complex device",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-primary-subject",
    "name": "Primary Subject",
    "originalName": "Primary Subject",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Subterfuge"
    ],
    "description": "*Cost 1+ Mana* This spell alters the imbument process, creating an item that will always target the user. The subject of the spell must be a mage.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 72
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-reveal-marks",
    "name": "Reveal Marks",
    "originalName": "Reveal Marks",
    "requirements": {
      "Prime": 3,
      "Time": 2
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Investigation"
    ],
    "description": "You may discern all signature Nimbuses associated with the Subject, This spell reduces the difficulty to Focused Mage Sight to scrutinize the subject for a signature Nimbus and reveals all Nimbuses associated with the subject. Add Potency as bonus die to reveal them. +1 Reach: Add bonus dice equal to Potency to Clash of Wills to reveal an obscured Signature Nimbus",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 74
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-scribe-palimpsest",
    "name": "Scribe Palimpsest",
    "originalName": "Scribe Palimpsest",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "Rotes Total Arcanum dots +1",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "*Costs 1 Mana* Like \"Scribe Grimoire\" this spell gives physical form to a single rote's symbols using a Grimoire that has had its contents erased, scrubbed, scribbled out, painted over or otherwise made unreadable. The Storyteller chooses one Arcanum when the character casts this spell. Whenever a character later casts the rote from the completed Grimoire, it acts as though it incorporated dots of the chosen Arcanum equal to this spell’s Potency, creating unpredictable blended effects. +1 Reach: For 1 point of Mana, the spell's Duration is Lasting",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 84
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-spirit-vessel",
    "name": "Spirit Vessel",
    "originalName": "Spirit Vessel",
    "requirements": {
      "Prime": 3,
      "Spirit": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "Resistance",
    "roteSkills": [
      "Academics",
      "Intimidation",
      "Occult"
    ],
    "description": "Prepare a Spirit for the Imbue Item Attainment. The mage must either cast the spell through the Gauntlet or the spirit must be Manifested. The subject automatically withstands the casting.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 69
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-steal-mana",
    "name": "Steal Mana",
    "originalName": "Steal Mana",
    "requirements": {
      "Prime": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Duration",
    "withstand": "Stamina",
    "roteSkills": [
      "Expression",
      "Occult",
      "Subterfuge"
    ],
    "description": "*Costs 1 Mana* This spell alters the imbument process resulting in an item that siphons its users Mana. When under this spell when Imbuing an item you may set a Mana capacity to the item, instead of imbuing it with that much Mana it steals it from its user. When someone goes to activate the spell it will steal mana equal to capacity, should it attempt to take more than its capacity the leftover Mana dissipates into the atmosphere. If the user doesn't have enough Mana it deals Bashing damage for each Mana it cannot siphon",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 72
  },
  {
    "id": "mta-2ed:prime-3-stealing-fire",
    "name": "Stealing Fire",
    "originalName": "Stealing Fire",
    "requirements": {
      "Prime": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Expression",
      "Larceny",
      "Persuasion"
    ],
    "description": "Temporarily turn Sleeper into a Sleepwalker. Breaking points from magic will hit only when the spell expires",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 168
  },
  {
    "id": "mta-signs-of-sorcery:prime-3-stored-spell",
    "name": "Stored Spell",
    "originalName": "Stored Spell",
    "requirements": {
      "Prime": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Occult",
      "Subterfuge"
    ],
    "description": "A Mage may make an item capable of holding a spell until later activation similar to the Attainment Imbue Item. Once this spell is in effect a mage may spend a Mana to cast any other spell on the item that uses touch/self range, which is contained and unactivated. Stored Spell may store spells up to its level in Potency. These spells don't activate until someone Spends a point of Mana to activate the spell, Stored Spell is canceled, The duration of Stored Spell ends or the Duration of the stored spells end",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 70
  },
  {
    "id": "mta-2ed:prime-4-apocalypse",
    "name": "Apocalypse",
    "originalName": "Apocalypse",
    "requirements": {
      "Prime": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Occult",
      "Persuasion",
      "Socialize"
    ],
    "description": "Grant a Sleeper the ability to see what a Mage sees +1 Reach and Add Any Other Arcanum 1: Add the Arcanum to the granted Sight.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 169
  },
  {
    "id": "mta-2ed:prime-4-celestial-fire",
    "name": "Celestial Fire",
    "originalName": "Celestial Fire",
    "requirements": {
      "Prime": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Expression",
      "Occult"
    ],
    "description": "Attack spell inflict Lethal equal to Potency +1 Reach: Spell ignites flammable object in the scene +1 Reach: For one Mana, spell deals aggravated damage +1 Reach: May destroy target's Mana instead of dealing damage, spend Potency between regular and Mana damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:prime-4-destroy-tass",
    "name": "Destroy Tass",
    "originalName": "Destroy Tass",
    "requirements": {
      "Prime": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "Durability",
    "roteSkills": [
      "Brawl",
      "Intimidation",
      "Occult"
    ],
    "description": "Successful casting destroys Tass. Mana form the tass is not destroyed but released into the world likely to the nearest Hallow",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:prime-4-hallow-dance",
    "name": "Hallow Dance",
    "originalName": "Hallow Dance",
    "requirements": {
      "Prime": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Hallow Rating",
    "roteSkills": [
      "Expression",
      "Occult",
      "Survival"
    ],
    "description": "Suppress an active Hallow or awaken a dormant one. Rousing requires Potency equal to the Hallow's rating. Dampening reduces the Hallow's dot rating by Potency, if it falls to zero or less the Hallow is rendered dormant +2 Reach: For one point of Mana the effect is Lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-signs-of-sorcery:prime-4-primal-transfer",
    "name": "Primal Transfer",
    "originalName": "Primal Transfer",
    "requirements": {
      "Prime": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Subterfuge"
    ],
    "description": "This allows a Mage to transfer spell control of a spell they've cast to another mage. The spell transfers Spells up to Potency from Caster to Subject. Once the Duration ends control returns to the Caster +2 Reach: If Primal Transfer is Imbued into an item with this effect spell control is passed to the user of the Item allowing the user to assign reach and reassign spell factors",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 71
  },
  {
    "id": "mta-signs-of-sorcery:prime-4-scribe-daimonomikon",
    "name": "Scribe Daimonomikon",
    "originalName": "Scribe Daimonomikon",
    "requirements": {
      "Prime": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Rank of Attainment + (10 - Caster's Gnosis)",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "*Cost 1 Mana* Scribe a Daimonomikon for the Mage's Legacy. A Mage must be of Gnosis 2 or above to cast this. Anyone initiated into a Legacy via a Daimonomikon must spend 1 Arcane Experience and if used to learn more Legacy Attainments must use the Experience cost listed for learning without a tutor. These serve as a sympathetic Yantra worth +2 Dice for members of the inscribed Legacy +1 Reach: For 1 Mana, the Spell's Duration is Lasting",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 87
  },
  {
    "id": "mta-2ed:prime-4-supernal-dispellation",
    "name": "Supernal Dispellation",
    "originalName": "Supernal Dispellation",
    "requirements": {
      "Prime": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "Arcanum rating of the subject spell’s caster",
    "roteSkills": [
      "Athletics",
      "Intimidation",
      "Occult"
    ],
    "description": "Success suppresses target spell for Supernal Dispellations Duration Add Fate 1: Selectively suppress spell +2 Reach: Make the effect Lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-signs-of-sorcery:prime-4-transfer-soul-stone",
    "name": "Transfer Soul Stone",
    "originalName": "Transfer Soul Stone",
    "requirements": {
      "Prime": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Persuasion"
    ],
    "description": "May transfer a Soul Stone from one object to another of size 2 or below +2 Reach: This spell is Lasting",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 91
  },
  {
    "id": "mta-2ed:prime-5-blasphemy",
    "name": "Blasphemy",
    "originalName": "Blasphemy",
    "requirements": {
      "Prime": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "Hallow Rating, if applicable",
    "roteSkills": [
      "Athletics",
      "Occult",
      "Survival"
    ],
    "description": "Sever the connection to the Supernal in an area +2 Reach: Make the effect Lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:prime-5-create-truth",
    "name": "Create Truth",
    "originalName": "Create Truth",
    "requirements": {
      "Prime": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "Hallow Rating",
    "roteSkills": [
      "Expression",
      "Occult",
      "Persuasion"
    ],
    "description": "Cost 5 Mana per Potency. Create Hallow with rating equal to Potency, Hallows cannot have a rating above 5 +2 Reach: For 5 Mana the effect is Lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 170
  },
  {
    "id": "mta-2ed:prime-5-eidolon",
    "name": "Eidolon",
    "originalName": "Eidolon",
    "requirements": {
      "Prime": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Crafts",
      "Occult"
    ],
    "description": "Like \"Platonic Form\" but can create animate Tass. May spend Potency on an additional effect: grant the mage a dot of the Retainer Merit. Construct will obey its owner's command Add Forces ●●●: The construct is not obviously magical Add Mind ●●●●●: The construct may be given a mind of its own, as per the Psychic Genesis spell",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:prime-5-forge-purpose",
    "name": "Forge Purpose",
    "originalName": "Forge Purpose",
    "requirements": {
      "Prime": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Empathy",
      "Expression",
      "Medicine"
    ],
    "description": "Subject gains one of the caster's Obsessions. If subject is a mage already possessing the maximum number of Obsessions this spell causes a Clash of Wills. If successful replace one of these Obsessions +1 Reach: Can grant a wholly new Obsession",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:prime-5-word-of-unmaking",
    "name": "Word of Unmaking",
    "originalName": "Word of Unmaking",
    "requirements": {
      "Prime": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "Merit rating or Durability",
    "roteSkills": [
      "Intimidation",
      "Occult",
      "Weaponry"
    ],
    "description": "Destroy a magical item, but not artifacts +2 Reach: Item explodes violently, roll the item Merit rating or Durability. Anyone within 1 yard per dot suffers lethal damage per success",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 171
  },
  {
    "id": "mta-2ed:space-1-correspondence",
    "name": "Correspondence",
    "originalName": "Correspondence",
    "requirements": {
      "Space": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Empathy",
      "Medicine"
    ],
    "description": "Learn one of subjects sympathetic links per Potency. The oldest and strongest are revealed first. If the link is nearby you will learn it't exact location too. +1 Reach: You can follow a link to it's other end. +1 Reach: Learn the emotional aspect of the connection. Connection \"My childhood home\" may carry notes of comfort or fear depending on the subject. +2 Reach: Specify what links you want to learn. The answer comes form the subjects perspective. +2 Reach: If used on a keyed spell or iris this spell can learn the key.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 172
  },
  {
    "id": "mta-2ed:space-1-ground-eater",
    "name": "Ground Eater",
    "originalName": "Ground Eater",
    "requirements": {
      "Space": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "Stamina",
    "roteSkills": [
      "Athletics",
      "Science",
      "Survival"
    ],
    "description": "Add or reduce Speed by Potency. Speed cannot go below 1",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 173
  },
  {
    "id": "mta-2ed:space-1-isolation",
    "name": "Isolation",
    "originalName": "Isolation",
    "requirements": {
      "Space": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "Composure",
    "roteSkills": [
      "Academics",
      "Intimidation",
      "Subterfuge"
    ],
    "description": "Any attempt to interact with other people costs a Willpower point. Even then, dice pools are penalized by Potency. Prolonged exposure to spell (a day per point of subject's Composure) may cause breaking points or Conditions like Shaken or Spooked",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 173
  },
  {
    "id": "mta-2ed:space-1-locate-object",
    "name": "Locate Object",
    "originalName": "Locate Object",
    "requirements": {
      "Space": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Occult",
      "Science"
    ],
    "description": "Can find the subject in spell area. +1 Reach: Can track the subject even if it leaves the area.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 173
  },
  {
    "id": "mta-2ed:space-1-the-outward-and-inward-eye",
    "name": "The Outward and Inward Eye",
    "originalName": "The Outward and Inward Eye",
    "requirements": {
      "Space": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Firearms",
      "Investigation",
      "Occult"
    ],
    "description": "Gain 360 degree vision and hearing. All attempts to ambush the character fail, or in the case of exceptional camouflage or distraction a chance die. Finally all penalties due to range, cover or concealment(but not darkness or other poor visibility situations) are reduced by Potency. +2 Reach: Can see through warps or shortcuts in Space. This includes Distortion Irises, additional Arcana may allow sight into other types of Irises, this is at Storyteller's discretion",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 174
  },
  {
    "id": "mta-2ed:space-2-borrow-threads",
    "name": "Borrow Threads",
    "originalName": "Borrow Threads",
    "requirements": {
      "Space": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Sympathy",
    "roteSkills": [
      "Larceny",
      "Occult",
      "Subterfuge"
    ],
    "description": "Allows the transfer of a number of sympathetic connections between the caster and the subject(s) of the spell equal to potency. The caster must be aware of the links, either through other magic or knowledge of the subject. +1 Reach: The caster may also transfer connections between subjects affected without being involved in the transfer. +1 Reach: The caster may copy connections instead of transferring them.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 174
  },
  {
    "id": "mta-2ed:space-2-break-boundary",
    "name": "Break Boundary",
    "originalName": "Break Boundary",
    "requirements": {
      "Space": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Larceny",
      "Persuasion"
    ],
    "description": "Allows the subject to slip past an obstacle that is obstructing a path or similar restriction of movement. +1 Reach: The subject can fit through narrow or restrictive passageways they couldn't normally fit through. +2 Reach: Subjects unable to move can pass through obstructions, appearing on the other side.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 174
  },
  {
    "id": "mta-2ed:space-2-lying-maps",
    "name": "Lying Maps",
    "originalName": "Lying Maps",
    "requirements": {
      "Space": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "Resolve",
    "roteSkills": [
      "Academics",
      "Politics",
      "Survival"
    ],
    "description": "Makes a subject certain that a path of the caster's choosing is the correct path to a destination.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 174
  },
  {
    "id": "mta-2ed:space-2-scrying",
    "name": "Scrying",
    "originalName": "Scrying",
    "requirements": {
      "Space": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Computer",
      "Occult",
      "Subterfuge"
    ],
    "description": "Allows the caster to remotely view a distant location, with varying effects depending on the type of Sympathetic connection. Spells can also be cast on subjects as if one were viewing them remotely. The scrying window may be invisible or visible to everyone in the vicinity. Add Fate 2: The caster can select specific people who can see the scrying window.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 174
  },
  {
    "id": "mta-2ed:space-2-secret-door",
    "name": "Secret Door",
    "originalName": "Secret Door",
    "requirements": {
      "Space": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Allows the caster to hide a passageway from mundane perception, invoking Clash of Wills against magical perception. +1 Reach: A Key may be specified to allow entry.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 175
  },
  {
    "id": "mta-2ed:space-2-veil-sympathy",
    "name": "Veil Sympathy",
    "originalName": "Veil Sympathy",
    "requirements": {
      "Space": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "Sympathy",
    "roteSkills": [
      "Politics",
      "Subterfuge",
      "Survival"
    ],
    "description": "Conceals one of the subject's sympathetic connections. +1 Reach: May make the subject appear to have a nonexistent connection. +1 Reach: Prevents the connection from being used as a Sympathetic Yantra. +2 Reach: The caster may suppress all of the subject's connections.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 175
  },
  {
    "id": "mta-2ed:space-2-ward",
    "name": "Ward",
    "originalName": "Ward",
    "requirements": {
      "Space": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Subterfuge",
      "Weaponry"
    ],
    "description": "Prevents space from being manipulated in an area. +1 Reach: The caster may specify a Key that can allow the manipulation of space. +2 Reach: The caster may ward an Iris.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 176
  },
  {
    "id": "mta-2ed:space-3-ban",
    "name": "Ban",
    "originalName": "Ban",
    "requirements": {
      "Space": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Intimidation",
      "Science",
      "Stealth"
    ],
    "description": "Cuts an area off from the outside world, including light, sound, and air. Add Any Arcanum 2: Exclude phenomena under that Arcanum, or only Ban phenomena of that Arcanum.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 176
  },
  {
    "id": "mta-2ed:space-3-co-location",
    "name": "Co-Location",
    "originalName": "Co-Location",
    "requirements": {
      "Space": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Firearms",
      "Science"
    ],
    "description": "Allows the overlapping of multiple locations. Individuals who can perceive this overlap may switch between locations reflexively once a turn. +1 Reach: Anything in the overlapped locations may be made visible to the naked eye. +1 Reach: The caster may make the Co-Location a two-dimensional plane, creating a portal. +1 Reach: The caster may specify a Key needed to use the overlap. +2 Reach: Individuals who can perceive the overlap may reflexively switch locations twice per turn instead of once.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 176
  },
  {
    "id": "mta-signs-of-sorcery:space-3-forced-sympathy",
    "name": "Forced Sympathy",
    "originalName": "Forced Sympathy",
    "requirements": {
      "Space": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Empathy",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Must be cast on a Mage to alter his imbument process. Whenever a user casts the item's spell it always targets the subject with the closest sympathy to the user. Closest sympathy is determined by the best sympathetic Yantra on the user at the time of Casting. If the user has multiple items which could be used as Sympathetic Yantras the spells effect occurs on the one in closest physical range.",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 73
  },
  {
    "id": "mta-signs-of-sorcery:space-3-optimal-container",
    "name": "Optimal Container",
    "originalName": "Optimal Container",
    "requirements": {
      "Space": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Larceny",
      "Science",
      "Subterfuge"
    ],
    "description": "Expand the dimensions within a container to allow it to hold larger objects than usual. Enhance the sized item a container can hold by its base size + Potency",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 66
  },
  {
    "id": "mta-2ed:space-3-perfect-sympathy",
    "name": "Perfect Sympathy",
    "originalName": "Perfect Sympathy",
    "requirements": {
      "Space": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Empathy",
      "Larceny"
    ],
    "description": "Allows the subject to gain 8-Again when taking an action on a subject that is one of their Strong sympathies. +1 Reach: Can redirect spells at Sympathetic Range to a Strong connection instead. +1 Reach: For one Mana, the subject gains (Potency) rote actions when taking an action on a subject that is one of their Strong sympathies. +1 Reach: The benefits extend to Medium sympathetic connections.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 176
  },
  {
    "id": "mta-2ed:space-3-warp",
    "name": "Warp",
    "originalName": "Warp",
    "requirements": {
      "Space": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Brawl",
      "Medicine"
    ],
    "description": "Deals bashing damage equal to Potency by twisting the space the subject occupies. +1 Reach: The pain inflicts the Arm Wrack or Leg Wrack Tilt.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:space-3-web-weaver",
    "name": "Web-Weaver",
    "originalName": "Web-Weaver",
    "requirements": {
      "Space": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Persuasion"
    ],
    "description": "Allows bolstering of a sympathetic connection. Add Time 2: The caster may use temporal sympathy to anything the subject touched in the target time.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:space-4-alter-direction",
    "name": "Alter Direction",
    "originalName": "Alter Direction",
    "requirements": {
      "Space": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Firearms",
      "Persuasion"
    ],
    "description": "Allows the caster to change (Potency) absolute directions (e.g. north, south, up, down) in an area, or change directions relative to a chosen subject. +1 Reach: The caster can redefine directions in curves rather than just straight lines.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:space-4-collapse",
    "name": "Collapse",
    "originalName": "Collapse",
    "requirements": {
      "Space": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Firearms",
      "Intimidation"
    ],
    "description": "Forces a subject and a chosen object to occupy the same space, dealing (Potency) lethal damage. +1 Reach: For 1 Mana, damage inflicted becomes Aggravated. +1 Reach: The co-located object remains inside the subject.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:space-4-cut-threads",
    "name": "Cut Threads",
    "originalName": "Cut Threads",
    "requirements": {
      "Space": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "Sympathy (Connection)",
    "roteSkills": [
      "Persuasion",
      "Politics",
      "Weaponry"
    ],
    "description": "Destroy a sympathetic connection, effect is lasting, but connection can be restored in time. +2 Reach: Remove the subject's sympathetic name. This is not lasting and only last until the spell expires",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 177
  },
  {
    "id": "mta-2ed:space-4-secret-room",
    "name": "Secret Room",
    "originalName": "Secret Room",
    "requirements": {
      "Space": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Science",
      "Survival"
    ],
    "description": "Enlarge or shrink a space. Making a box bigger on the inside than on the outside, for example. Scale has to encompass the targets current size. And goes up or down equal to Potency in steps along the Area Scale Factor.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:space-4-teleportation",
    "name": "Teleportation",
    "originalName": "Teleportation",
    "requirements": {
      "Space": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Larceny",
      "Persuasion",
      "Science"
    ],
    "description": "Teleport a subject to another location. You may use the Sympathetic Range Attainment on either the subject or the location but not both. +1 Reach: You may swap the location of two subjects with no more a point of Size difference +2 Reach: You may now use two separate Sympathetic Ranges. The spell is Withstood by the worse of the two connections",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:space-5-create-sympathy",
    "name": "Create Sympathy",
    "originalName": "Create Sympathy",
    "requirements": {
      "Space": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "Desired Sympathy",
    "roteSkills": [
      "Empathy",
      "Persuasion",
      "Politics"
    ],
    "description": "Create a new sympathetic connection for the subject. This is Lasting, but may fade with time. +1 Reach: The created connection is Lasting and never fades. Only magic can sever it now +2 Reach: Give a subject a new sympathetic name. This is not Lasting and fades when the spell ends",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:space-5-forge-no-chains",
    "name": "Forge No Chains",
    "originalName": "Forge No Chains",
    "requirements": {
      "Space": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Subterfuge",
      "Survival"
    ],
    "description": "For the Duration of the spell the subjects cannot create new sympathetic connection. blood, hair, etc shed during the Duration of the spell do not link back to the subject. This also has an effect on any Space spells you leave behind. Any attempt to scrutinize your spells with Mage Sight has the spell's Potency added to the Opacity",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:space-5-pocket-dimension",
    "name": "Pocket Dimension",
    "originalName": "Pocket Dimension",
    "requirements": {
      "Space": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Survival"
    ],
    "description": "Create a space. By default this space is devoid of the other arcana: No Death or Spirit means no Twilight, No Time means things inside are held in stasis (unaging but also never growing/improving). Unless a portal connects the space to a point in the world the only way to get there is to teleport. Spells cast within never cause Paradox unless they sympathetic range is used to affect something outside of the space. The mage herself is considered a material sympathetic yantra for her own Pocket Dimension. If the space is ever destroyed or the spell expires objects within return to the exact location from which they entered the space. +1 Reach: Create an Iris to the Pocket Dimension in the physical world. For an additional Reach you may specify a Key for this Iris. Add Time 2: Time flows normally within the space mirroring time passed in the physical world. Without oxygen inside the space however this means anything inside can asphyxiate. Add Death 2, Mind 2 or Spirit 2: The space now contains a Twilight attuned to the Arcanum used",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 178
  },
  {
    "id": "mta-2ed:space-5-quarantine",
    "name": "Quarantine",
    "originalName": "Quarantine",
    "requirements": {
      "Space": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Larceny",
      "Socialize"
    ],
    "description": "Remove a subject from space altogether. The world adjusts for the missing space. A Quarantined house doesn't leave behind an empty space, instead the neighboring house would now find themselves adjacent. Meanwhile those within the Quarentined space will find they cannot leave. Similar to a Pocket Dimension except it still has it's own Time, Twilight, Matter and so forth +1 Reach: Specify a Key that allows access to and from the removed area. Add Mind 4: For the Duration of the spell no one remembers the area used to exist. Those within do still remember. Add Time 5: For the duration of the spell the area and those within retroactively never existed. History rewrites itself, but returns to normal when the spell expires",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 179
  },
  {
    "id": "mta-signs-of-sorcery:space-5-unnaming",
    "name": "Unnaming",
    "originalName": "Unnaming",
    "requirements": {
      "Space": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Duration",
    "withstand": "Composure",
    "roteSkills": [
      "Empathy",
      "Expression",
      "Occult"
    ],
    "description": "The Mage Erases a subject's sympathetic name from existance, the exicised name is immediately replaced with one that matches whatever most sleepers would use to refer to her as. Any Sympathetic connections to the old name cease to exist as well. Any mage attempting to cast sympathetically using the mage faces a penalty until learning the new one. Add Prime •••••: The Spell can be used on an Awakened Subject's Shadow Name and Nimbus instead. The Shadow name isn't replaced immediately and the subject needs to build their Supernal identity from scratch",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 94
  },
  {
    "id": "mta-2ed:spirit-1-coaxing-the-spirits",
    "name": "Coaxing the Spirits",
    "originalName": "Coaxing the Spirits",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "Composure or Rank",
    "roteSkills": [
      "Politics",
      "Athletics",
      "Expression"
    ],
    "description": "Compel a Spirit or it's physical representation to take a single instant action that is in accordance to it's nature.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 180
  },
  {
    "id": "mta-2ed:spirit-1-exorcist-s-eye",
    "name": "Exorcist's Eye",
    "originalName": "Exorcist's Eye",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Survival",
      "Socialize"
    ],
    "description": "See and speak with any Spirit, be they in Twilight, slumbering in an object or possessing somebody. Can also see the conduit of any Spirit with the Reaching Manifestation +1 Reach: Can see across the Gauntlet, Withstood by Gauntlet Strength Add Death 1 or Mind 1: These benefits extend to ghost or Goetia respectively",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 180
  },
  {
    "id": "mta-2ed:spirit-1-gremlins",
    "name": "Gremlins",
    "originalName": "Gremlins",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Larceny",
      "Politics",
      "Subterfuge"
    ],
    "description": "Cause Spirit of object to hinder it's user. Each level of Potency causes one failure with the item to become a dramatic failure. A player's character can earn a Beat from this as per normal +1 Reach: As long as the object is within sensory range, can decide what failure become dramatic failures",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 180
  },
  {
    "id": "mta-2ed:spirit-1-invoke-bane",
    "name": "Invoke Bane",
    "originalName": "Invoke Bane",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "Rank",
    "roteSkills": [
      "Brawl",
      "Intimidation",
      "Occult"
    ],
    "description": "Force a Spirit to avoid it's Bane even more then normal. Spirit needs to spend a Willpower to come within the area(this is the Area factor of the spell) of it's bane and cannot touch it. Spirits above Rank 5 are unaffected by this spell",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 180
  },
  {
    "id": "mta-2ed:spirit-1-know-spirit",
    "name": "Know Spirit",
    "originalName": "Know Spirit",
    "requirements": {
      "Spirit": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "Rank",
    "roteSkills": [
      "Academics",
      "Brawl",
      "Socialize"
    ],
    "description": "Learn a number of facts about the Spirit equal to Potency: Spirit's name, Rank, Manifestations, Numina, Influences and roughly how strong these are, Ban, Bane",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 180
  },
  {
    "id": "mta-2ed:spirit-2-cap-the-well",
    "name": "Cap the Well",
    "originalName": "Cap the Well",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Politics",
      "Survival",
      "Persuasion"
    ],
    "description": "Any attempt to feed from a source of Essence affected by this spell provokes a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 180
  },
  {
    "id": "mta-2ed:spirit-2-channel-essence",
    "name": "Channel Essence",
    "originalName": "Channel Essence",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Persuasion",
      "Survival"
    ],
    "description": "Move Essence equal to Potency but no higher than the Gnosis-derived Mana per turn, from a Resonant Condition or suitable receptacle to a Spirit. You can store Essence into your own Pattern which stays even after the spell has expired. You can hold an amount of Mana and Essence equal to Gnosis-derived maximum Mana Add Death 2 or Mind 2: Spell may be cast on ghosts or Goetia respectively +1 Reach: Can siphon Essence directly from a Spirit, subject may resist with Rank",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 180
  },
  {
    "id": "mta-2ed:spirit-2-command-spirit",
    "name": "Command Spirit",
    "originalName": "Command Spirit",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "Rank",
    "roteSkills": [
      "Medicine",
      "Athletics",
      "Persuasion"
    ],
    "description": "Force a Spirit to undertake a number of actions equal to Potency. Spirit may/will abandon uncomplete task if the spell Duration expires. No effect on Spirits above Rank 5",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:spirit-2-ephemeral-shield",
    "name": "Ephemeral Shield",
    "originalName": "Ephemeral Shield",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Animal Ken",
      "Medicine",
      "Stealth"
    ],
    "description": "Any Spirit Numina, Influences and Manifestations, Spirit Spells  and werewolf Gifts aimed at subject provoke a Clash of Wills +1 Reach: A Spirits physical attacks are likewise affected Add Death 2 or Mind 2: Shield affects ghosts or Goetia respectively",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:spirit-2-gossamer-touch",
    "name": "Gossamer Touch",
    "originalName": "Gossamer Touch",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Brawl",
      "Crafts",
      "Intimidation"
    ],
    "description": "Can interact physically with Spirits in Twilight Add Death 2 or Mind 2: Affects ghosts or Goetia respectively +1 Reach: Object you carry are likewise physical to Spirits +1 Reach: Unarmed attacks against Spirits deal Potency extra damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:spirit-2-opener-of-the-way",
    "name": "Opener of the Way",
    "originalName": "Opener of the Way",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Computer",
      "Socialize"
    ],
    "description": "Shift Resonant Condition to Open Condition or vice versa",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:spirit-2-shadow-walk",
    "name": "Shadow Walk",
    "originalName": "Shadow Walk",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Stealth",
      "Streetwise"
    ],
    "description": "Subject becomes shrouded from Spirit and Spirit magics notice. Supernatural effects to detect provoke a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:spirit-2-slumber",
    "name": "Slumber",
    "originalName": "Slumber",
    "requirements": {
      "Spirit": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "Rank",
    "roteSkills": [
      "Expression",
      "Occult",
      "Weaponry"
    ],
    "description": "Reduce the rate at which a hibernating Spirit regains Essence. Instead of one Essence per day the Spirit only regains one Essence per Potency days",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:spirit-3-bolster-spirit",
    "name": "Bolster Spirit",
    "originalName": "Bolster Spirit",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Occult",
      "Expression"
    ],
    "description": "Heal a Spirit. Each level of Potency heals two bashing damage +1 Reach: Instead of healing, each level of Potency can increase one of the Spirit's Attributes by one for the duration of the spell +2 Reach: Spend one Mana to increase the Spirit's Rank by one.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:spirit-3-erode-resonance",
    "name": "Erode Resonance",
    "originalName": "Erode Resonance",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Brawl",
      "Intimidation"
    ],
    "description": "Remove a subject's Open or Resonant condition. This effect is Lasting +1 Reach: Any future attempts to create the Conditions suffers a penalty equal to Potency",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 181
  },
  {
    "id": "mta-2ed:spirit-3-howl-from-beyond",
    "name": "Howl From Beyond",
    "originalName": "Howl From Beyond",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Firearms",
      "Medicine"
    ],
    "description": "Attack spell deal bashing damage equal to Potency. +1 Reach: the subject gains the Open Condition +1 Reach: Can target beings on the other side of the Gauntlet, but is Withstood by Gauntlet Strength",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:spirit-3-place-of-power",
    "name": "Place of Power",
    "originalName": "Place of Power",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Fraying or Perfecting",
    "primaryFactor": "Potency",
    "withstand": "Gauntlet Strength",
    "roteSkills": [
      "Academics",
      "Expression",
      "Survival"
    ],
    "description": "Raise or lower Gauntlet Strength in spell Area by Potency +1 Reach: Alter Gauntlet independently on either side. For example making it easier to enter the Shadow but harder to leave or vice versa",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:spirit-3-reaching",
    "name": "Reaching",
    "originalName": "Reaching",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "Gauntlet Strength",
    "roteSkills": [
      "Athletics",
      "Medicine",
      "Socialize"
    ],
    "description": "Interact physically and magically with things on the other side of the Gauntlet +1 Reach: Open an Iris between the physical world and the Shadow, which anybody can pass through. For another Reach may specify a Key",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:spirit-3-rouse-spirit",
    "name": "Rouse Spirit",
    "originalName": "Rouse Spirit",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "Rank",
    "roteSkills": [
      "Athletics",
      "Expression",
      "Investigation"
    ],
    "description": "Awaken a Spirit early Potency required is equal to the difference between the Spirit's current Essence and total Corpus +1 Reach: For each additional Reach, the Spirit wakes with an additional Corpus box cleared",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:spirit-3-spirit-summons",
    "name": "Spirit Summons",
    "originalName": "Spirit Summons",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "Rank",
    "roteSkills": [
      "Persuasion",
      "Socialize",
      "Occult"
    ],
    "description": "Call a Spirit in the local area to you +1 Reach: Spell also creates the Open Condition +1 Reach: Can give the Spirit a single word command to follow +1 Reach: Can call a Spirit form the Shadow instead. Spell it Withstood by the greater of Rank and Gauntlet Strength +2 Reach: Can give Spirit a complex command to follow",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-signs-of-sorcery:spirit-3-spiritual-tool",
    "name": "Spiritual Tool",
    "originalName": "Spiritual Tool",
    "requirements": {
      "Spirit": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Occult",
      "Survival"
    ],
    "description": "Enhance an item to be more in-tune with the Shadow and Spirits in general. The object becomes both an item of the material world and the shadow and is able to interact with spirits both within Twilight and the Shadow. If the item is carried into either other realm it retains its material form when it returns to the material world",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 66
  },
  {
    "id": "mta-2ed:spirit-4-banishment",
    "name": "Banishment",
    "originalName": "Banishment",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "Rank",
    "roteSkills": [
      "Brawl",
      "Expression",
      "Occult"
    ],
    "description": "Strip a number of Manifestation Conditions equal to Potency. Effect is Lasting, but Conditions may be reasteablished as normal. No effect on Spirits above Rank 5 Add Mind 4: affect Goetia Add Death4: addect Ghosts +1 Reach: Conditions cannot be reestablished until spell duration has expired",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 182
  },
  {
    "id": "mta-2ed:spirit-4-bind-spirit",
    "name": "Bind Spirit",
    "originalName": "Bind Spirit",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Rank",
    "roteSkills": [
      "Crafts",
      "Brawl",
      "Intimidation"
    ],
    "description": "Grant a number of Manifestation Conditions equal to Potency. No effect on Spirits above Rank 5 Add Mind 4: effect Goetia Add Death 4: effect Ghosts",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:spirit-4-craft-fetish",
    "name": "Craft Fetish",
    "originalName": "Craft Fetish",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "Rank",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Persuasion"
    ],
    "description": "Create a Fetish an item that contains a Spirit. And can be used to call upon a number of one of the Spirit's Influence dots and Numina equal to Potency. These abilities cost Essence and the item has the Spirit's Essence pool. Triggering the bound Spirit's Ban or Bane destroys the fetish. A fetish without a Spirit may also be created and can hold 10+Potency Essence",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:spirit-4-familiar",
    "name": "Familiar",
    "originalName": "Familiar",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Expression",
      "Intimidation"
    ],
    "description": "Gain the Familiar Merit for the duration of the spell. Both parties must be willing. Cannot effect Spirits above Rank 2 Substitute Death 4 or Mind 4: Bind a Ghost or Goetia respectively",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-signs-of-sorcery:spirit-4-haunted-grimoire",
    "name": "Haunted Grimoire",
    "originalName": "Haunted Grimoire",
    "requirements": {
      "Spirit": 4,
      "Prime": 1
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Total Arcanum dots of Rote + Rank",
    "roteSkills": [
      "Crafts",
      "Intimidation",
      "Occult"
    ],
    "description": "*Costs 1 Mana* The Mage binds a spirit to a grimoire, writing its essence into the vessel's pattern. This doesn't host the Spirits numina or influences nor does it have an essence pool. The Grimoire gains the Open and Resonant Conditions. When cast the spell is increased by the Spirits Rank for Primary Factor however the Spirit has a chance to escape with a Clash of Wills to the caster. When someone memorizes a Rote the Spirit has a chance to possess them using a CLash of Wills. This spell is a Wisdom Sin against Understanding",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 86
  },
  {
    "id": "mta-signs-of-sorcery:spirit-4-scribe-daimonomikon",
    "name": "Scribe Daimonomikon",
    "originalName": "Scribe Daimonomikon",
    "requirements": {
      "Spirit": 4,
      "Prime": 1
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Rank of Attainment + (10 - Caster's Gnosis)",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Occult"
    ],
    "description": "*Cost 1 Mana* Scribe a Daimonomikon for the Mage's Legacy. A Mage must be of Gnosis 2 or above to cast this. Anyone initiated into a Legacy via a Daimonomikon must spend 1 Arcane Experience and if used to learn more Legacy Attainments must use the Experience cost listed for learning without a tutor. These serve as a sympathetic Yantra worth +2 Dice for members of the inscribed Legacy +1 Reach: For 1 Mana, the Spell's Duration is Lasting",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 87
  },
  {
    "id": "mta-2ed:spirit-4-shadow-scream",
    "name": "Shadow Scream",
    "originalName": "Shadow Scream",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Firearms",
      "Medicine"
    ],
    "description": "Deal Lethal damage equal to Potency. Can hit targets in Twilight +1 Reach: For one point of Mana damage is aggravated +1 Reach: Can destroy Essence divide Potency between regular and Essence damage +1 Reach: Target gains Open Condition +1 Reach: Can hit target on the other side of the Gauntlet",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 183
  },
  {
    "id": "mta-2ed:spirit-4-shape-spirit",
    "name": "Shape Spirit",
    "originalName": "Shape Spirit",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Rank",
    "roteSkills": [
      "Crafts",
      "Medicine",
      "Persuasion"
    ],
    "description": "Change a Spirit with a number of effects equal to Potency: Change nature, Redistribute Attribute dots, Heal one Lethal corpus, Redefine and redistribute Influences, Add/remove/replace one Manifestation, Add/remove/replace one Numen, Rewrite Ban or Bane. In addition can also change the Spirit's size, shape and appearance but no bigger than the spell's Scale factor. Traits must stay within Rank-derived maximums. Change revert at the end of spell duration +1 Reach: For one Mana heal aggravated damage",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:spirit-4-twilit-body",
    "name": "Twilit Body",
    "originalName": "Twilit Body",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Subterfuge",
      "Survival"
    ],
    "description": "Turn yourself(and whatever you're wearing) into Spirit-attuned ephemera, and thus in Twilight +1 Reach: can become immaterial even in realms where Twilight doesn't normally exist",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:spirit-4-world-walker",
    "name": "World Walker",
    "originalName": "World Walker",
    "requirements": {
      "Spirit": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Gauntlet Strength",
    "roteSkills": [
      "Athletics",
      "Persuasion",
      "Survival"
    ],
    "description": "Bring subject across the Gauntlet, no portal necessary +1 Reach: Give conjured Spirit Materialized Condition",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:spirit-5-annihilate-spirit",
    "name": "Annihilate Spirit",
    "originalName": "Annihilate Spirit",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "Rank",
    "roteSkills": [
      "Intimidation",
      "Science",
      "Weaponry"
    ],
    "description": "Utterly destroy a Spirit. The Spirit may spend an Essence to roll Power + Finesse in a Clash of Wills to prevent this. But if the spell succeeds the Spirit is destroyed even if it still has Essence it won't go into hibernation the Spirit is simply gone. Cannot affect Spirits above Rank 5",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:spirit-5-birth-spirit",
    "name": "Birth Spirit",
    "originalName": "Birth Spirit",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Medicine",
      "Expression"
    ],
    "description": "Create a Rank 1 Spirit +1 Reach: For one Mana, create a Rank 2 Spirit",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:spirit-5-create-locus",
    "name": "Create Locus",
    "originalName": "Create Locus",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "Gauntlet Strength",
    "roteSkills": [
      "Crafts",
      "Empathy",
      "Survival"
    ],
    "description": "Create a Locus at a location with the Resonant Condition +1 Reach: The Locus generates Essence equal to Potency per day",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 184
  },
  {
    "id": "mta-2ed:spirit-5-essence-fountain",
    "name": "Essence Fountain",
    "originalName": "Essence Fountain",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Making",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Expression",
      "Occult"
    ],
    "description": "Create Essence equal to Potency. The Essence has a Resonance of your choosing, as long as you have encountered it before +1 Reach: Flavor the Essence with multiple Resonances",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 185
  },
  {
    "id": "mta-2ed:spirit-5-spirit-manse",
    "name": "Spirit Manse",
    "originalName": "Spirit Manse",
    "requirements": {
      "Spirit": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Expression",
      "Survival"
    ],
    "description": "Create a place in the Shadow for yourself and gain the Safe Place Merit with rating equal to Potency +1 Reach: You may create an Iris between this place and the material world and may give it a key. But the spell becomes Withstood by Gauntlet Strength",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 185
  },
  {
    "id": "mta-2ed:time-1-divination",
    "name": "Divination",
    "originalName": "Divination",
    "requirements": {
      "Time": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Empathy",
      "Investigation"
    ],
    "description": "Ask a general question regarding the future with an answer of \"Yes\", \"No\" or \"Irrelevant\" +1 Reach: The questions asked can be more specific and the answer gives more information",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 186
  },
  {
    "id": "mta-2ed:time-1-green-light-red-light",
    "name": "Green Light/Red Light",
    "originalName": "Green Light/Red Light",
    "requirements": {
      "Time": 1
    },
    "practice": "Compelling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Computer",
      "Larceny",
      "Subterfuge"
    ],
    "description": "Cast Positively: Anything that can help the subject achieve the objective faster will happen at the exact moment to do so. Cast Negatively: Anything that can delay the target will happen at the exact moment to do so",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 187
  },
  {
    "id": "mta-2ed:time-1-momentary-flux",
    "name": "Momentary Flux",
    "originalName": "Momentary Flux",
    "requirements": {
      "Time": 1
    },
    "practice": "Knowing",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Investigation",
      "Streetwise",
      "Survival"
    ],
    "description": "The Mage can determine if the subject will prove beneficial or baneful in the future. When acting on the information gained, the Mage can add the spell's potency to their Initiative.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 187
  },
  {
    "id": "mta-2ed:time-1-perfect-timing",
    "name": "Perfect Timing",
    "originalName": "Perfect Timing",
    "requirements": {
      "Time": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Socialize",
      "Streetwise"
    ],
    "description": "The subject can spend a turn during the spell's duration on planning, and, in doing so, can add the spell's Potency to their next instant action.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 187
  },
  {
    "id": "mta-2ed:time-1-postcognition",
    "name": "Postcognition",
    "originalName": "Postcognition",
    "requirements": {
      "Time": 1
    },
    "practice": "Unveiling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Empathy",
      "Investigation"
    ],
    "description": "The mage can see into the subject's past, wieving it all from a moment declared in \"real time\" +1 Reach: The mage can rewind, speed up, slow down and pause the vision at any given time The mage does not lose Defense when watching the vision",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 187
  },
  {
    "id": "mta-2ed:time-2-choose-the-thread",
    "name": "Choose the Thread",
    "originalName": "Choose the Thread",
    "requirements": {
      "Time": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Occult",
      "Science",
      "Subterfuge"
    ],
    "description": "You may roll twice for your next mundane dice roll. Then choose which takes effect. +2 Reach: May affect rolls for spellcasting and other supernatural powers",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 187
  },
  {
    "id": "mta-2ed:time-2-constant-presence",
    "name": "Constant Presence",
    "originalName": "Constant Presence",
    "requirements": {
      "Time": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Persuasion",
      "Survival"
    ],
    "description": "Preserve yourself against alterations to the timeline. Any alterations that would change you provoke a Clash of Wills. If you win the world will still be altered but you will not be.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 187
  },
  {
    "id": "mta-2ed:time-2-hung-spell",
    "name": "Hung Spell",
    "originalName": "Hung Spell",
    "requirements": {
      "Time": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Occult",
      "Expression"
    ],
    "description": "The subject of this spell must be a mage. The subject may then spend a Mana to \"hang\" his spell. Hung Spell may hold up to a Potency in number of spells these spells still counts against the caster's spell control. Any hanged spells will not have their Durations expire but won't take effect yet either. When Hung Spell ceases all the hanged spells immediately take effect according to their own Durations and effects.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:time-2-shield-of-chronos",
    "name": "Shield of Chronos",
    "originalName": "Shield of Chronos",
    "requirements": {
      "Time": 2
    },
    "practice": "Veiling",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Stealth",
      "Subterfuge"
    ],
    "description": "Anybody trying to view the subject through time, either by looking at the presently shielded subject's future or into a past when the subject was shielded. Provokes a Clash of Wills +1 Reach: Instead of simply preventing Time magic from seeing the subject. You may show a false series of events that the magic \"discovers\". If powers would seek to pierce the illusion anyway this provokes a Clash of Wills",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:time-2-tipping-the-hourglass",
    "name": "Tipping the Hourglass",
    "originalName": "Tipping the Hourglass",
    "requirements": {
      "Time": 2
    },
    "practice": "Ruling",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Athletics",
      "Crafts",
      "Investigation"
    ],
    "description": "Add or subtract Potency from a subjects Initiative. Subjects who have already taken an action this turn need to wait until the next turn to take advantage of their new Initiative",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:time-2-veil-of-moments",
    "name": "Veil of Moments",
    "originalName": "Veil of Moments",
    "requirements": {
      "Time": 2
    },
    "practice": "Shielding",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Medicine",
      "Investigation",
      "Subterfuge"
    ],
    "description": "Protect a subject from Time's effects. The subject will not bleed out form wounds, poison, toxins and the progression of disease are stalled. New Conditions and Tilts cannot be imposed on the subject. Supernatural powers that would anyway provoke a Clash of Wills. Downsides of the spell: you no longer heal naturally while under the spell's effect. Healing through Pattern Restoration and Life magic will still work. Willpower and Mana cannot be restored and Experiences cannot be spend. The subjects ceases aging. +1 Reach: may ignore Persistent Conditions. Time spend under this spell does not count toward any time necessary for Conditions to lapse +1 Reach: may heal naturally +1 Reach: may regain Willpower +1 Reach: may regain Mana",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 188
  },
  {
    "id": "mta-2ed:time-3-acceleration",
    "name": "Acceleration",
    "originalName": "Acceleration",
    "requirements": {
      "Time": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Drive",
      "Stealth"
    ],
    "description": "Speed up a subjects movements. Multiply speed by Potency, apply Defense against firearms and take the first action in a turn (unless you choose to delay it). You also apply Potency to Defense buy only when dodging",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 189
  },
  {
    "id": "mta-2ed:time-3-chronos-curse",
    "name": "Chronos' Curse",
    "originalName": "Chronos' Curse",
    "requirements": {
      "Time": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "Stamina",
    "roteSkills": [
      "Academics",
      "Occult",
      "Intimidation"
    ],
    "description": "Slow a subject down. This reduces their Defense by Potency and divides their Speed by Potency, rounding down. Subject go last in a turn. +1 Reach: Spend one Mana, the subject loses all Defense against attacks +1 Reach: Multiply the time per roll of extended actions by Potency. This does not effect the ritaul casting times of mages",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 190
  },
  {
    "id": "mta-2ed:time-3-shifting-sands",
    "name": "Shifting Sands",
    "originalName": "Shifting Sands",
    "requirements": {
      "Time": 3
    },
    "practice": "Fraying",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Occult",
      "Survival"
    ],
    "description": "The subject goes back in time a number of turns equal to Potency. Any injuries and Conditions obtained or Mana and Willpower spend in the reversed turns do not change back and stay as they are. Any spells cast in the reversed time are canceled. Once the subject catches up to the present, any changes made become Lasting +1 Reach: Travel back a full scene. This Reach may be applied multiple times",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 190
  },
  {
    "id": "mta-2ed:time-3-temporal-summoning",
    "name": "Temporal Summoning",
    "originalName": "Temporal Summoning",
    "requirements": {
      "Time": 3
    },
    "practice": "Weaving",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Investigation",
      "Persuasion"
    ],
    "description": "Return the subject to an younger version of itself. Buildings can be restored and injuries healed. Once the spell ends any changed made revert back to normal. Any injuries and Conditions obtained while this spell was active carry over to the subjects present self. Limits of Spell includes not being able to bring the dead back and a vampire returned to 'Childhood' becomes a vampiric child",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 190
  },
  {
    "id": "mta-signs-of-sorcery:time-3-time-limit",
    "name": "Time Limit",
    "originalName": "Time Limit",
    "requirements": {
      "Time": 3,
      "Prime": 2
    },
    "practice": "Weaving",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Expression",
      "Science",
      "Survival"
    ],
    "description": "The Caster instills a time limit on the effects of an imbued spell as she relinquishes it for one week per dot of Potency. This applies to one person each use so a new user can make the item work again but only for the time limit +1 Reach: The spell's time limit is increased to one month per Potency",
    "sourceId": "mta-signs-of-sorcery",
    "source": "Signs of Sorcery",
    "page": 71
  },
  {
    "id": "mta-2ed:time-3-weight-of-years",
    "name": "Weight of Years",
    "originalName": "Weight of Years",
    "requirements": {
      "Time": 3
    },
    "practice": "Perfecting",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Crafts",
      "Intimidation",
      "Medicine"
    ],
    "description": "An attack spell. Deal Bashing damage equal to Potency. If used on objects or structures. Apply Potency directly as damage to Structure and reduce Durability by 1 for every 2 points of Structure lost +1 Reach: For living subjects the spell also reduces Athletics by Potency",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:time-4-present-as-past",
    "name": "Present as Past",
    "originalName": "Present as Past",
    "requirements": {
      "Time": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Empathy",
      "Investigation",
      "Streetwise"
    ],
    "description": "The subject gains the following benefits. In combat you can require that all affected characters declare their action for that turn. You do not need to declare your own and can act anywhere in the Initiative order that you want. This trumps all supernatural powers except those from the Time Arcanum, these cause a Clash of Wills. In social situations this spell removes a number of Doors equal to Potency from the subject or adds Doors to yourself when the subject performs Social maneuvering against you",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:time-4-prophecy",
    "name": "Prophecy",
    "originalName": "Prophecy",
    "requirements": {
      "Time": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Expression",
      "Investigation"
    ],
    "description": "This spell works like \"Divination\" except that you can now ask 'what if?' questions. You can ask a number of question equal to Potency +1 Reach: By applying this spell to Social interaction you may reduce a number of Doors equal to Potency",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:time-4-rend-lifespan",
    "name": "Rend Lifespan",
    "originalName": "Rend Lifespan",
    "requirements": {
      "Time": 4
    },
    "practice": "Unraveling",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Athletics",
      "Medicine",
      "Intimidation"
    ],
    "description": "An attack spell. Deal Lethal damage equal to Potency.",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:time-4-rewrite-history",
    "name": "Rewrite History",
    "originalName": "Rewrite History",
    "requirements": {
      "Time": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Resolve",
    "roteSkills": [
      "Expression",
      "Investigation",
      "Persuasion"
    ],
    "description": "Change the subject's timeline as though different choices were made. Without Temporal Sympathy only recent decisions can be rewritten. Once the spell ends the person instantly reverts to the original timeline. Memories of the time under this spell will seem hazy, distant and dreamlike but the subject will remember the time at least to some extent. Supernatural creatures are not normally affected by this spell +1 Reach: Reassign a number of the subject's Skill or Merit dot equal to Potency. These can not exceed the subject's maximum +1 Reach: Reassign a number of the subject's Attributes equal to Potency. These may no exceed the subject's natural maximum or below the character creation priorities of Primary, Secondary and Tertiary +2 Reach: This spell can affect supernatural creatures. And may revert them back to before they acquired their supernatural template",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 191
  },
  {
    "id": "mta-2ed:time-4-temporal-stutter",
    "name": "Temporal Stutter",
    "originalName": "Temporal Stutter",
    "requirements": {
      "Time": 4
    },
    "practice": "Patterning",
    "primaryFactor": "Potency",
    "withstand": "Stamina",
    "roteSkills": [
      "Intimidation",
      "Science",
      "Survival"
    ],
    "description": "Throw a subject forward in time. The subject vanishes from the world and won't reappear until the spell expires. If, while reappearing, something new now occupies the space the subject used to inhabit apply the Knocked Down Tilt to whichever of the two has the least Size",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 192
  },
  {
    "id": "mta-2ed:time-5-blink-of-an-eye",
    "name": "Blink of an Eye",
    "originalName": "Blink of an Eye",
    "requirements": {
      "Time": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Crafts",
      "Occult"
    ],
    "description": "This spell turns the next extended action into a instant action. A number of rolls for the extended action may be made in this turn equal to Potency. This spell does not affect ritual casting time for mages +2 Reach: For a point of Mana this spell can affect spellcasting times. Increase the effective Gnosis of a mage equal to Potency for calculating ritual casting times only. For every point over Gnosis 10 reduce the interval by one turn",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 192
  },
  {
    "id": "mta-2ed:time-5-corridors-of-time",
    "name": "Corridors of Time",
    "originalName": "Corridors of Time",
    "requirements": {
      "Time": 5
    },
    "practice": "Unmaking",
    "primaryFactor": "Potency",
    "withstand": "",
    "roteSkills": [
      "Academics",
      "Investigation",
      "Persuasion"
    ],
    "description": "The Subject inhabits their own Past self and is able to Change History. Subject arrives at the Location they were in at the time chosen and is free to make different decisions. Can be viewed under active Time mage sight. Once the mage has 'Caught up' to the present or the spells duration factor is up the changes made to History become Lasting",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 192
  },
  {
    "id": "mta-2ed:time-5-temporal-pocket",
    "name": "Temporal Pocket",
    "originalName": "Temporal Pocket",
    "requirements": {
      "Time": 5
    },
    "practice": "Making",
    "primaryFactor": "Duration",
    "withstand": "",
    "roteSkills": [
      "Occult",
      "Science",
      "Stealth"
    ],
    "description": "Grant the subject extra time. The entire world around the subject freezes. The subject may do move and touch things freely. But physically moving, consuming or injuring anything ends the spell at the completion of such an action",
    "sourceId": "mta-2ed",
    "source": "Mage the Awakening",
    "page": 192
  }
];
