import { getMeritsForLine } from "./merits";
import { courtCanonicalId } from "./changeling-courts";

export type MeritConfigValue = string | string[];
export type MeritConfiguration = Record<string, MeritConfigValue>;
export type MeritConfigField = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "list" | "court";
  placeholder?: string;
  minDots?: number;
};
export type MeritConfigDefinition = {
  name: string;
  fields: MeritConfigField[];
  grants?: boolean;
  line?: "CtL" | "MtA";
};

const text = (
  key: string,
  label: string,
  placeholder?: string,
  minDots?: number,
): MeritConfigField => ({ key, label, placeholder, minDots });
const area = (
  key: string,
  label: string,
  placeholder?: string,
  minDots?: number,
): MeritConfigField => ({ key, label, kind: "textarea", placeholder, minDots });
const list = (
  key: string,
  label: string,
  placeholder?: string,
  minDots?: number,
): MeritConfigField => ({ key, label, kind: "list", placeholder, minDots });
const court = (key: string, label: string): MeritConfigField => ({ key, label, kind: "court" });

export const MERIT_CONFIGURATIONS: MeritConfigDefinition[] = [
  {
    name: "Area of Expertise",
    fields: [
      text(
        "specialty",
        "Especialização beneficiada",
        "Perícia: Especialização",
      ),
    ],
  },
  {
    name: "Allies",
    fields: [text("subject", "Organização, grupo ou indivíduo")],
  },
  {
    name: "Alternate Identity",
    fields: [
      text("identity", "Nome da identidade"),
      area("details", "Descrição e documentação"),
    ],
  },
  {
    name: "Contacts",
    fields: [list("spheres", "Esferas de informação", "Uma esfera por linha")],
  },
  {
    name: "Defensive Combat",
    fields: [text("skill", "Perícia escolhida", "Briga ou Armas Brancas")],
  },
  { name: "Fame", fields: [text("field", "Área da fama")] },
  { name: "Elemental Warrior", fields: [text("element", "Elemento escolhido")] },
  { name: "Oath: Blood Liege", fields: [text("liege", "Vampiro a quem jurou lealdade"), area("oath", "Juramento e obrigações")] },
  {
    name: "Fighting Finesse",
    fields: [text("weapon", "Arma ou Briga escolhida")],
  },
  {
    name: "Hobbyist Clique",
    fields: [
      text("interest", "Interesse do círculo"),
      text("skill", "Perícia relacionada"),
    ],
  },
  {
    name: "Interdisciplinary Specialty",
    fields: [
      text(
        "specialty",
        "Especialização beneficiada",
        "Perícia: Especialização",
      ),
    ],
  },
  { name: "Investigative Aide", fields: [text("skill", "Perícia escolhida")] },
  {
    name: "Language",
    fields: [list("languages", "Idiomas", "Um idioma por linha")],
  },
  {
    name: "Library",
    fields: [list("subjects", "Assuntos da coleção", "Um assunto por linha")],
  },
  {
    name: "Mentor",
    fields: [
      text("name", "Nome do Mentor"),
      text("specialty", "Especialidade"),
      area("relationship", "Relação, expectativas e obrigações"),
    ],
  },
  {
    name: "Multilingual",
    fields: [list("languages", "Idiomas adicionais", "Um idioma por linha")],
  },
  { name: "Professional Training", fields: [], grants: true },
  { name: "Psychokinesis", fields: [text("element", "Força ou elemento")] },
  {
    name: "Quick Draw",
    fields: [text("weapon_category", "Categoria de arma")],
  },
  {
    name: "Retainer",
    fields: [
      text("name", "Nome do Seguidor"),
      text("specialty", "Especialidade"),
      area("profile", "Perfil e personalidade"),
    ],
  },
  {
    name: "Safe Place",
    fields: [
      text("name", "Nome do refúgio"),
      text("location", "Localização"),
      area("details", "Descrição e proteções"),
    ],
  },
  {
    name: "Staff",
    fields: [
      text("name", "Nome da equipe"),
      list("services", "Serviços e especialidades"),
    ],
  },
  {
    name: "Status",
    fields: [
      text("organization", "Organização ou comunidade"),
      text("role", "Cargo ou posição"),
    ],
  },
  {
    name: "Striking Looks",
    fields: [area("appearance", "Aparência marcante")],
  },
  { name: "Taste", fields: [text("field", "Área artística ou cultural")] },
  {
    name: "Unseen Sense",
    fields: [
      text("phenomenon", "Fenômeno sobrenatural"),
      text("reaction", "Sensação ou reação que o denuncia"),
    ],
  },
  { name: "Clairvoyance", fields: [text("method", "Método de clarividência")] },
  { name: "Cursed", fields: [area("curse", "Maldição ou destino inevitável")] },
  { name: "Mystery Cult Initiation", fields: [], grants: true },
  { name: "Mystery Cult Influence", fields: [], grants: true },
  {
    name: "Court Goodwill",
    line: "CtL",
    fields: [court("court", "Corte beneficiada")],
  },
  { name: "Fae Mount", line: "CtL", fields: [] },
  {
    name: "Holding",
    line: "CtL",
    fields: [
      text("name", "Nome do Domínio"),
      area("territory", "Descrição do território"),
      list("features", "Características compradas"),
    ],
  },
  {
    name: "Hollow",
    line: "CtL",
    fields: [
      text("name", "Nome do Recanto"),
      area("location", "Descrição e localização"),
      list("features", "Características compradas"),
    ],
  },
  { name: "Warded Dreams", line: "CtL", fields: [] },
  { name: "Dream Bastion", line: "CtL", fields: [] },
  {
    name: "Regalia Manifestation",
    line: "CtL",
    fields: [
      text("regalia", "Regalia vinculada"),
      area("manifestation", "Manifestação"),
    ],
  },
  {
    name: "Token",
    line: "CtL",
    fields: [
      text("name", "Nome do Símbolo"),
      area("benefit", "Benefício"),
      area("activation", "Ativação"),
      area("catch", "Ardil"),
    ],
  },
  {
    name: "Workshop",
    line: "CtL",
    fields: [
      text("work_type", "Tipo de trabalho"),
      area("facilities", "Instalações"),
    ],
  },
  {
    name: "Exoteric Arete",
    line: "MtA",
    fields: [
      text("skill", "Perícia escolhida"),
      text("specialty", "Especialização beneficiada"),
    ],
  },
  {
    name: "Artifact",
    line: "MtA",
    fields: [
      text("name", "Nome do Artefato"),
      text("gnosis", "Gnose"),
      list("arcana", "Arcanos"),
      list("powers", "Poderes e efeitos"),
    ],
  },
  {
    name: "Broad Dedication",
    line: "MtA",
    fields: [text("category", "Categoria de ferramentas")],
  },
  {
    name: "Cabal Theme",
    line: "MtA",
    fields: [
      text("theme", "Tema da Cabala"),
      list("symbols", "Símbolos e comportamentos"),
    ],
  },
  {
    name: "Cognoscente",
    line: "MtA",
    fields: [text("mystery", "Mistério ou campo esotérico")],
  },
  {
    name: "Daimonomikon",
    line: "MtA",
    fields: [
      text("name", "Nome do Daimonomikon"),
      text("legacy", "Legado"),
      list("attainments", "Attainments e ensinamentos"),
    ],
  },
  {
    name: "Destiny",
    line: "MtA",
    fields: [area("destiny", "Destino"), area("doom", "Ruína")],
  },
  {
    name: "Egregore",
    line: "MtA",
    fields: [
      text("name", "Nome da Egrégora"),
      area("identity", "Identidade psíquica da Cabala"),
    ],
  },
  {
    name: "Enhanced Item",
    line: "MtA",
    fields: [
      text("name", "Nome do objeto"),
      area("base_item", "Objeto mundano"),
      list("enhancements", "Melhorias compradas"),
    ],
  },
  {
    name: "Faction Member",
    line: "MtA",
    fields: [
      text("faction", "Facção interna"),
      area("duties", "Deveres e benefícios"),
    ],
  },
  { name: "Familiar", line: "MtA", fields: [] },
  {
    name: "Grimoire",
    line: "MtA",
    fields: [text("name", "Nome do Grimório"), list("rotes", "Rotas contidas")],
  },
  {
    name: "Hallow",
    line: "MtA",
    fields: [
      text("name", "Nome do Lugar Sagrado"),
      text("location", "Localização"),
      text("resonance", "Ressonância"),
    ],
  },
  {
    name: "Imbued Item",
    line: "MtA",
    fields: [
      text("name", "Nome do item"),
      list("spells", "Feitiços incorporados"),
      area("activation", "Ativação e fatores"),
    ],
  },
  {
    name: "Infamous Mentor",
    line: "MtA",
    fields: [
      text("name", "Nome do Mentor"),
      list("capabilities", "Capacidades"),
      area("obligations", "Reputação e obrigações"),
    ],
  },
  {
    name: "Inheritance",
    line: "MtA",
    fields: [
      area("inheritance", "Herança recebida"),
      list("resources", "Recursos"),
      list("responsibilities", "Responsabilidades"),
    ],
  },
  {
    name: "Library, Advanced",
    line: "MtA",
    fields: [list("subjects", "Campos esotéricos")],
  },
  {
    name: "Masque",
    line: "MtA",
    fields: [
      text("identity", "Identidade"),
      text("virtue", "Virtude alternativa"),
      text("vice", "Vício alternativo"),
      list("specialties", "Especializações próprias"),
      area("nimbus", "Assinatura do Nimbus", undefined, 3),
      list("hubris", "Atos de Húbris", undefined, 4),
      list("granted_merits", "Méritos concedidos", "Nome • pontos", 5),
    ],
    grants: true,
  },
  {
    name: "Prelacy",
    line: "MtA",
    fields: [
      text("exarch", "Exarca patrono"),
      area("yantra", "Simbolismo e Yantra", undefined, 2),
      text("attainment", "Attainment", undefined, 3),
      area("temple", "Templo", undefined, 4),
    ],
    grants: true,
  },
  {
    name: "Sanctum",
    line: "MtA",
    fields: [
      text("name", "Nome do Santuário"),
      text("location", "Localização"),
      list("facilities", "Instalações"),
    ],
  },
  {
    name: "Shadow Name",
    line: "MtA",
    fields: [
      text("shadow_name", "Nome das Sombras"),
      list("symbols", "Símbolos favoráveis"),
      list("contradictions", "Contradições e vulnerabilidades"),
    ],
  },
  {
    name: "Techne",
    line: "MtA",
    fields: [
      text("practice", "Prática criativa ou técnica"),
      list("tools", "Métodos e ferramentas"),
    ],
  },
  {
    name: "Hand of Destiny",
    line: "MtA",
    fields: [
      text("cult", "Nome do culto"),
      list("level_benefits", "Benefício de cada nível"),
    ],
    grants: true,
  },
];

export const findMeritConfiguration = (name: string) =>
  MERIT_CONFIGURATIONS.find((item) => item.name === name);
export const isInlineMeritConfiguration = (name:string) => {
  const definition=findMeritConfiguration(name);
  const field=definition?.fields[0];
  return Boolean(definition?.fields.length === 1 && !isStructuredMerit(name) && (!field?.kind || field.kind === "text" || field.kind === "textarea"));
};
export const normalizeMeritConfiguration = (
  value: unknown,
): MeritConfiguration =>
  value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [
          key,
          Array.isArray(item) ? item.map(String) : String(item ?? ""),
        ]),
      )
    : {};
const MERIT_TITLE_KEYS = [
  "name",
  "appearance",
  "subject",
  "organization",
  "identity",
  "field",
  "court",
  "specialty",
  "weapon",
  "interest",
  "element",
  "method",
  "phenomenon",
  "faction",
  "theme",
  "shadow_name",
  "work_type",
];
export function meritConfigurationTitle(value: unknown) {
  const configuration = normalizeMeritConfiguration(value);
  if (typeof configuration.court === "string" && configuration.court.trim())
    return courtCanonicalId(configuration.court);
  for (const key of MERIT_TITLE_KEYS) {
    const item = configuration[key];
    if (Array.isArray(item)) {
      if (item[0]?.trim()) return item[0].trim();
    } else if (String(item ?? "").trim()) return String(item).trim();
  }
  for (const key of ["spheres", "languages", "subjects"]) {
    const item = configuration[key];
    if (Array.isArray(item) && item[0]?.trim()) return item[0].trim();
  }
  return "";
}
export const isStructuredMerit = (name: string) =>
  [
    "Professional Training",
    "Mystery Cult Initiation",
    "Mystery Cult Influence",
    "Hollow",
    "Warded Dreams",
    "Dream Bastion",
  ].includes(name);

type GrantSheet = {
  merits: Array<{
    name: string;
    dots: number;
    sourceId?: string;
    source?: string;
    configuration?: MeritConfiguration;
    grantedBy?: string;
  }>;
  specializations: Array<{ skill: string; name: string; grantedBy?: string }>;
  line_data: Record<string, unknown>;
};
const lines = (value: MeritConfigValue | undefined) =>
  Array.isArray(value)
    ? value
    : value
      ? String(value)
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
const parsedDots = (value: string) => {
  const bullet = (value.match(/[•●]/g) || []).length;
  const number = Number(value.match(/\d+/)?.[0] ?? 0);
  return Math.max(1, bullet || number || 1);
};
const cleanGrantName = (value: string) =>
  value
    .replace(/[•●]+|\b\d+\b/g, "")
    .replace(/[-–—:]+$/g, "")
    .trim();
export function synchronizeMeritGrants<T extends GrantSheet>(sheet: T): T {
  sheet.merits = sheet.merits.filter(
    (item) =>
      !item.grantedBy ||
      item.grantedBy === "Corte" ||
      item.grantedBy === "Ordem",
  );
  const court = courtCanonicalId(sheet.line_data?.court);
  const currentMantle = sheet.merits.find(
    (item) =>
      item.name === "Mantle" &&
      item.grantedBy === "Corte" &&
      String(item.configuration?.court ?? "").trim() === court,
  );
  sheet.merits = sheet.merits.filter(
    (item) => !(item.name === "Mantle" && item.grantedBy === "Corte"),
  );
  if (court && court !== "Sem Corte")
    sheet.merits.push({
      name: "Mantle",
      dots: Math.max(1, Number(currentMantle?.dots ?? 1)),
      sourceId: "ctl-2ed",
      source: "Changeling the Lost",
      configuration: { court },
      grantedBy: "Corte",
    });
  sheet.specializations = sheet.specializations.filter(
    (item) => !item.grantedBy,
  );
  const skillBonuses: Record<string, number> = {},
    conditions: string[] = [],
    attainments: string[] = [],
    courtGoodwill: Array<{ court: string; dots: number; mantleDots: number }> =
      [];
  const sources = [...sheet.merits];
  for (const source of sources) {
    const configuration = normalizeMeritConfiguration(source.configuration);
    const sourceKey = `merit:${source.name}`;
    const grantMerit = (
      name: string,
      dots: number,
      additive = false,
      meritConfiguration?: MeritConfiguration,
    ) => {
      if (!name) return;
      const existing = sheet.merits.find(
        (item) => item.name === name && item.grantedBy === sourceKey,
      );
      if (existing) {
        existing.dots = Math.min(
          5,
          additive ? existing.dots + dots : Math.max(existing.dots, dots),
        );
        return;
      }
      sheet.merits.push({
        name,
        dots: Math.min(5, dots),
        source: `Concedido por ${source.name}`,
        configuration: meritConfiguration,
        grantedBy: sourceKey,
      });
    };
    if (source.name === "Court Goodwill") {
      const court = courtCanonicalId(configured(configuration, "court")) || "Corte não definida";
      source.configuration = { ...configuration, court };
      const goodwillKey = `${sourceKey}:${court}`;
      const grantGoodwillMerit = (name: string, dots: number) => {
        const existing = sheet.merits.find(
          (item) => item.name === name && item.grantedBy === goodwillKey,
        );
        if (existing) existing.dots = Math.max(existing.dots, dots);
        else
          sheet.merits.push({
            name,
            dots,
            source: `Concedido por Benevolência da Corte: ${court}`,
            configuration: { court },
            grantedBy: goodwillKey,
          });
      };
      grantGoodwillMerit("Allies", source.dots);
      grantGoodwillMerit("Mentor", 1);
      courtGoodwill.push({
        court,
        dots: source.dots,
        mantleDots: Math.max(0, source.dots - 2),
      });
    }
    if (source.name === "Professional Training") {
      const assetSkills = lines(configuration.asset_skills).slice(
        0,
        source.dots >= 3 ? 3 : 2,
      );
      if (source.dots >= 1)
        grantMerit("Contacts", 2, false, {
          spheres: lines(configuration.contacts),
        });
      if (source.dots >= 3)
        for (let index = 1; index <= 2; index++) {
          const skill = String(
              configuration[`specialty_${index}_skill`] ?? "",
            ).trim(),
            name = String(
              configuration[`specialty_${index}_name`] ?? "",
            ).trim();
          if (assetSkills.includes(skill) && name)
            sheet.specializations.push({ skill, name, grantedBy: sourceKey });
        }
      if (source.dots >= 4) {
        const skill = String(configuration.boosted_skill ?? "").trim();
        if (assetSkills.includes(skill))
          skillBonuses[skill] = (skillBonuses[skill] ?? 0) + 1;
      }
    }
    if (
      source.name === "Mystery Cult Initiation" ||
      source.name === "Mystery Cult Influence"
    ) {
      for (let level = 1; level <= source.dots; level++) {
        const type = String(configuration[`level_${level}_type`] ?? "");
        if (type === "specialty") {
          const skill = String(
              configuration[`level_${level}_specialty_skill`] ?? "",
            ).trim(),
            name = String(
              configuration[`level_${level}_specialty_name`] ?? "",
            ).trim();
          if (skill && name)
            sheet.specializations.push({ skill, name, grantedBy: sourceKey });
        }
        if (type === "skill" || type === "merit_skill") {
          const skill = String(
            configuration[`level_${level}_skill`] ?? "",
          ).trim();
          if (skill) skillBonuses[skill] = (skillBonuses[skill] ?? 0) + 1;
        }
        if (type === "merit" || type === "merits" || type === "merit_skill")
          for (const entry of lines(configuration[`level_${level}_merits`])) {
            const [name, dots] = entry.split("|");
            grantMerit(name.trim(), Math.max(1, Number(dots) || 1), true);
          }
      }
    }
    for (const entry of lines(configuration.granted_merits))
      grantMerit(cleanGrantName(entry), parsedDots(entry));
    const specialtyEntries = isStructuredMerit(source.name)
      ? []
      : lines(configuration.granted_specialties);
    for (const entry of specialtyEntries) {
      const [skill, ...rest] = entry.split(":");
      const name = rest.join(":").trim();
      if (
        skill.trim() &&
        name &&
        !sheet.specializations.some(
          (item) => item.skill === skill.trim() && item.name === name,
        )
      )
        sheet.specializations.push({
          skill: skill.trim(),
          name,
          grantedBy: sourceKey,
        });
    }
    for (const entry of lines(configuration.granted_skills)) {
      const name = cleanGrantName(entry);
      if (name)
        skillBonuses[name] = (skillBonuses[name] ?? 0) + parsedDots(entry);
    }
    conditions.push(...lines(configuration.granted_conditions));
    attainments.push(...lines(configuration.granted_attainments));
    if (source.name === "Prelacy" && source.dots >= 1)
      conditions.push("Comandos Misteriosos");
    if (
      source.name === "Prelacy" &&
      source.dots >= 3 &&
      String(configuration.attainment ?? "").trim()
    )
      attainments.push(String(configuration.attainment).trim());
  }
  sheet.line_data = {
    ...sheet.line_data,
    merit_granted_skill_bonuses: skillBonuses,
    merit_granted_conditions: [...new Set(conditions)],
    merit_granted_attainments: [...new Set(attainments)],
    court_goodwill_benefits: courtGoodwill,
  };
  return sheet;
}

const configured = (configuration: MeritConfiguration, key: string) =>
  String(configuration[key] ?? "").trim();
const configuredMeritNames = new Map(
  [...getMeritsForLine("CtL"), ...getMeritsForLine("MtA")].map((item) => [
    item.name,
    item.translatedName,
  ]),
);
const meritPicks = (configuration: MeritConfiguration, level: number) =>
  lines(configuration[`level_${level}_merits`])
    .map((entry) => {
      const [name, dots] = entry.split("|");
      return `${configuredMeritNames.get(name) ?? name} ${Number(dots) || 1}`;
    })
    .join(", ");
export function expandedConfigurationLines(
  name: string,
  dots: number,
  value: unknown,
): string[] {
  const configuration = normalizeMeritConfiguration(value);
  if (name === "Court Goodwill") {
    const court = configured(configuration, "court") || "Corte não definida",
      mantle = Math.max(0, dots - 2);
    return [
      `Corte: ${court}.`,
      `Influência: funciona como Aliados ${dots} dentro dessa Corte.`,
      `Manto acessível: benefícios de Manto ${mantle} da Corte (dois pontos abaixo da Benevolência).`,
      "Mentor: concede um ponto de Mentor, representando o contato que serve como ligação com a Corte.",
      "Conflitos: não pode coexistir com Manto da mesma Corte; tentativas de bloquear alguém com Benevolência na mesma Corte reduzem ambos em um ponto até que haja reparação.",
    ];
  }
  if (name === "Hollow") {
    const features = lines(configuration.features).map(
      (entry) => entry.split("|")[0],
    );
    return [
      `Localização: ${configured(configuration, "location") || "não definida"}.`,
      `Melhorias: ${features.join(", ") || "nenhuma selecionada"}.`,
    ];
  }
  if (name === "Warded Dreams" || name === "Dream Bastion")
    return [
      `Bastião dos Sonhos: ${configured(configuration, "description") || "não descrito"}.`,
      `Fortificação adicional: +${dots}.`,
    ];
  if (name === "Professional Training") {
    const assetSkills = lines(configuration.asset_skills),
      contacts = lines(configuration.contacts),
      result: string[] = [];
    if (dots >= 1)
      result.push(
        `Nv 1: Contatos 2 (${contacts.join(", ") || "nomes não definidos"}).`,
      );
    if (dots >= 2)
      result.push(
        `Nv 2: Perícias de Ativo — ${assetSkills.slice(0, 2).join(", ") || "não definidas"}.`,
      );
    if (dots >= 3) {
      const specialties = [1, 2]
        .map((index) => {
          const skill = configured(configuration, `specialty_${index}_skill`),
            specialty = configured(configuration, `specialty_${index}_name`);
          return assetSkills.includes(skill) && specialty
            ? `${skill}: “${specialty}”`
            : "";
        })
        .filter(Boolean);
      result.push(
        `Nv 3: ${assetSkills[2] ? `Terceira Perícia de Ativo — ${assetSkills[2]}. ` : ""}Especializações — ${specialties.join(", ") || "não definidas"}.`,
      );
    }
    if (dots >= 4) {
      const boosted = configured(configuration, "boosted_skill");
      result.push(
        `Nv 4: +1 em ${assetSkills.includes(boosted) ? boosted : "Perícia de Ativo não definida"}.`,
      );
    }
    if (dots >= 5) result.push("Nv 5: Rotina aplicada às Perícias de Ativo.");
    return result;
  }
  if (name !== "Mystery Cult Initiation" && name !== "Mystery Cult Influence")
    return [];
  const result: string[] = [];
  for (let level = 1; level <= dots; level++) {
    const type = configured(configuration, `level_${level}_type`);
    let description = "benefício não definido";
    if (type === "specialty")
      description = `Especialização ${configured(configuration, `level_${level}_specialty_skill`)}: “${configured(configuration, `level_${level}_specialty_name`)}”`;
    if (type === "merit" || type === "merits")
      description = meritPicks(configuration, level) || "Mérito não definido";
    if (type === "skill")
      description = `+1 em ${configured(configuration, `level_${level}_skill`) || "Perícia não definida"}`;
    if (type === "merit_skill")
      description = `${meritPicks(configuration, level) || "Mérito não definido"}; +1 em ${configured(configuration, `level_${level}_skill`) || "Perícia não definida"}`;
    if (type === "custom")
      description = `Descrição própria: ${configured(configuration, `level_${level}_custom`) || "não definida"}`;
    result.push(`Nv ${level}: ${description}.`);
  }
  return result;
}
