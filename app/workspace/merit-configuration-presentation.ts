import type { Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { normalizeMeritConfiguration, type MeritConfigDefinition } from "@/lib/core/character/merit-configuration";

export function configuredDefinitionLines(
  definition: MeritConfigDefinition | undefined,
  dots: number,
  value: unknown,
) {
  if (!definition) return [];
  const configuration = normalizeMeritConfiguration(value);
  return definition.fields.filter((field) => field.kind !== "merit").flatMap((field) => {
    const stored = configuration[field.key];
    const text = Array.isArray(stored)
      ? stored.slice(0, field.fixedRows ?? dots * (field.rowsPerDot ?? 1)).filter(Boolean).join(", ")
      : String(stored ?? "");
    return text.trim() ? [`${field.label}: ${text}`] : [];
  });
}

/** Presentation shared only by genuinely Core merit configurations. */
export function commonExpandedConfigurationLines(
  name: string,
  dots: number,
  value: unknown,
  locale: Locale = "pt-BR",
): string[] | undefined {
  const configuration = normalizeMeritConfiguration(value);
  if (name === "Professional Training") {
    const lines: string[] = [];
    const profession = String(configuration.profession ?? "").trim();
    const contacts = Array.isArray(configuration.contacts) ? configuration.contacts.filter(Boolean) : [];
    const assets = Array.isArray(configuration.asset_skills) ? configuration.asset_skills.filter(Boolean) : [];
    if (profession) lines.push(`${locale === "en-US" ? "Profession" : "Profissão"}: ${profession}`);
    if (dots >= 1 && contacts.length) lines.push(`${locale === "en-US" ? "Contacts" : "Contatos"}: ${contacts.join(", ")}`);
    if (dots >= 2 && assets.length) lines.push(`${locale === "en-US" ? "Asset Skills" : "Perícias de Ativo"}: ${assets.join(", ")}`);
    for (const index of [1, 2]) {
      const skill = String(configuration[`specialty_${index}_skill`] ?? "").trim();
      const specialty = String(configuration[`specialty_${index}_name`] ?? "").trim();
      if (dots >= 3 && skill && specialty) lines.push(`${locale === "en-US" ? "Specialty" : "Especialização"}: ${skill} (${specialty})`);
    }
    const boosted = String(configuration.boosted_skill ?? "").trim();
    if (dots >= 4 && boosted) lines.push(`${locale === "en-US" ? "Skill Increase" : "Aumento de Perícia"}: ${boosted} +1`);
    return lines;
  }
  if (name === "Contacts") {
    const groups = configuration.groups;
    const choices = Array.isArray(groups) ? groups.filter(Boolean) : String(groups ?? "").trim() ? [String(groups)] : [];
    return choices.map((choice, index) => `${locale === "en-US" ? "Contact" : "Contato"} ${index + 1}: ${choice}`);
  }
  if (name === "Multilingual") {
    const configured = configuration.languages;
    const languages = Array.isArray(configured) ? configured.filter(Boolean) : String(configured ?? "").trim() ? [String(configured)] : [];
    return languages.length ? [`${locale === "en-US" ? "Languages" : "Idiomas"}: ${languages.join(", ")}`] : [];
  }
  if (name === "Mystery Cult Initiation" || name === "Mystery Cult Influence") {
    const lines: string[] = [];
    const cult = String(configuration.cult ?? "").trim();
    if (cult) lines.push(`${locale === "en-US" ? "Cult" : "Culto"}: ${cult}`);
    for (let level = 1; level <= Math.min(5, dots); level += 1) {
      const prefix = `level_${level}`;
      const type = String(configuration[`${prefix}_type`] ?? "");
      const benefits: string[] = [];
      if (type === "specialty") {
        const skill = String(configuration[`${prefix}_specialty_skill`] ?? "").trim();
        const specialty = String(configuration[`${prefix}_specialty_name`] ?? "").trim();
        if (skill || specialty) benefits.push(`${locale === "en-US" ? "Specialty" : "Especialização"}: ${skill}${skill && specialty ? " (" : ""}${specialty}${skill && specialty ? ")" : ""}`);
      }
      if (type === "skill" || type === "merit_skill") {
        const skill = String(configuration[`${prefix}_skill`] ?? "").trim();
        if (skill) benefits.push(`${systemTerm(skill, locale)} +1`);
      }
      if (type === "rote_skills") {
        const skills = Array.isArray(configuration[`${prefix}_rote_skills`]) ? configuration[`${prefix}_rote_skills`] as string[] : [];
        if (skills.some(Boolean)) benefits.push(`${locale === "en-US" ? "Rote Skills" : "Perícias de Rota"}: ${skills.filter(Boolean).map((skill) => systemTerm(skill, locale)).join(", ")}`);
      }
      if (type === "merit" || type === "merits" || type === "merit_skill") {
        const merits = Array.isArray(configuration[`${prefix}_merits`]) ? configuration[`${prefix}_merits`] as string[] : [];
        benefits.push(...merits.filter((row) => row.split("|")[0]).map((row) => {
          const [merit, rating] = row.split("|");
          return `${merit} ${"•".repeat(Math.max(1, Number(rating) || 1))}`;
        }));
      }
      if (type === "custom") {
        const custom = String(configuration[`${prefix}_custom`] ?? "").trim();
        if (custom) benefits.push(custom);
      }
      if (benefits.length) lines.push(`${locale === "en-US" ? "Dot" : "Nível"} ${level}: ${benefits.join("; ")}`);
    }
    return lines;
  }
  return undefined;
}

export function decodeConfiguredRows<T>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    try {
      const parsed = JSON.parse(String(row));
      return parsed && typeof parsed === "object" ? [parsed as T] : [];
    } catch {
      return [];
    }
  });
}
