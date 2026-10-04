import { translate, type Locale } from "@/lib/i18n";
import { systemTerm } from "@/lib/system-terms";
import { decodeMeritGrantChoice, normalizeMeritConfiguration, type MeritConfigDefinition } from "@/lib/core/character/merit-configuration";
import type { MeritDefinition } from "@/lib/merits";
import { resolveMeritDefinition } from "@/lib/merit-identity";
import { meritPresentation } from "@/lib/merit-presentation";

export function configuredDefinitionLines(
  definition: MeritConfigDefinition | undefined,
  dots: number,
  value: unknown,
  locale: Locale = "en-US",
) {
  if (!definition) return [];
  const configuration = normalizeMeritConfiguration(value);
  return definition.fields.filter((field) => field.kind !== "merit" && (field.minDots ?? 0) <= dots).flatMap((field) => {
    const stored = configuration[field.key];
    const text = Array.isArray(stored)
      ? stored.slice(0, field.fixedRows ?? dots * (field.rowsPerDot ?? 1)).filter(Boolean).join(", ")
      : String(stored ?? "");
    const option = field.kind === "select" ? field.options?.find((item) => item.value === text) : undefined;
    const displayed = option ? (option.label.startsWith("ui.") ? translate(locale, option.label) : systemTerm(option.label, locale)) : text;
    const label = field.label.startsWith("ui.") ? translate(locale, field.label) : field.label;
    return text.trim() ? [`${label}: ${displayed}`] : [];
  });
}

/** Presentation shared only by genuinely Core merit configurations. */
export function commonExpandedConfigurationLines(
  definitionId: string | undefined,
  dots: number,
  value: unknown,
  locale: Locale = "en-US",
  catalog: readonly MeritDefinition[] = [],
): string[] | undefined {
  const configuration = normalizeMeritConfiguration(value);
  if (definitionId === "core-2ed:professional-training") {
    const lines: string[] = [];
    const profession = String(configuration.profession ?? "").trim();
    const contacts = Array.isArray(configuration.contacts) ? configuration.contacts.filter(Boolean) : [];
    const assets = Array.isArray(configuration.asset_skills) ? configuration.asset_skills.filter(Boolean) : [];
    if (profession) lines.push(`${translate(locale, "ui.profession")}: ${profession}`);
    if (dots >= 1 && contacts.length) lines.push(`${translate(locale, "ui.contacts")}: ${contacts.join(", ")}`);
    if (dots >= 1 && assets.length) lines.push(`${translate(locale, "ui.assetSkills")}: ${assets.slice(0, dots >= 3 ? 3 : 2).map((skill) => systemTerm(skill, locale)).join(", ")}`);
    for (const index of [1, 2]) {
      const skill = String(configuration[`specialty_${index}_skill`] ?? "").trim();
      const specialty = String(configuration[`specialty_${index}_name`] ?? "").trim();
      if (dots >= 3 && skill && specialty) lines.push(`${translate(locale, "ui.specialty")}: ${systemTerm(skill, locale)} (${specialty})`);
    }
    const boosted = String(configuration.boosted_skill ?? "").trim();
    if (dots >= 4 && boosted) lines.push(`${translate(locale, "ui.skillIncrease")}: ${systemTerm(boosted, locale)} +1`);
    return lines;
  }
  if (definitionId === "core-2ed:contacts") {
    const groups = configuration.groups;
    const choices = Array.isArray(groups) ? groups.filter(Boolean) : String(groups ?? "").trim() ? [String(groups)] : [];
    return choices.map((choice, index) => `${translate(locale, "ui.contact")} ${index + 1}: ${choice}`);
  }
  if (definitionId === "core-2ed:multilingual") {
    const configured = configuration.languages;
    const languages = Array.isArray(configured) ? configured.filter(Boolean) : String(configured ?? "").trim() ? [String(configured)] : [];
    return languages.length ? [`${translate(locale, "ui.languages")}: ${languages.join(", ")}`] : [];
  }
  if (definitionId === "core-2ed:mystery-cult-initiation" || definitionId === "core-2ed:mystery-cult-influence") {
    const lines: string[] = [];
    const cult = String(configuration.cult ?? "").trim();
    if (cult) lines.push(`${translate(locale, "ui.cult")}: ${cult}`);
    for (let level = 1; level <= Math.min(5, dots); level += 1) {
      const prefix = `level_${level}`;
      const type = String(configuration[`${prefix}_type`] ?? "");
      const benefits: string[] = [];
      if (type === "specialty") {
        const skill = String(configuration[`${prefix}_specialty_skill`] ?? "").trim();
        const specialty = String(configuration[`${prefix}_specialty_name`] ?? "").trim();
        if (skill || specialty) benefits.push(`${translate(locale, "ui.specialty")}: ${systemTerm(skill, locale)}${skill && specialty ? " (" : ""}${specialty}${skill && specialty ? ")" : ""}`);
      }
      if (type === "skill" || type === "merit_skill") {
        const skill = String(configuration[`${prefix}_skill`] ?? "").trim();
        if (skill) benefits.push(`${systemTerm(skill, locale)} +1`);
      }
      if (type === "rote_skills") {
        const skills = Array.isArray(configuration[`${prefix}_rote_skills`]) ? configuration[`${prefix}_rote_skills`] as string[] : [];
        if (skills.some(Boolean)) benefits.push(`${translate(locale, "ui.roteSkills")}: ${skills.filter(Boolean).map((skill) => systemTerm(skill, locale)).join(", ")}`);
      }
      if (type === "merit" || type === "merits" || type === "merit_skill") {
        const merits = Array.isArray(configuration[`${prefix}_merits`]) ? configuration[`${prefix}_merits`] as string[] : [];
        benefits.push(...merits.flatMap((row) => {
          const choice = decodeMeritGrantChoice(row);
          if (!choice) return [];
          const definition = resolveMeritDefinition(choice, catalog);
          const name = definition ? meritPresentation(definition, locale).name : choice.name;
          return [`${name} ${choice.dots > 5 ? choice.dots : "•".repeat(choice.dots)}`];
        }));
      }
      if (type === "custom") {
        const custom = String(configuration[`${prefix}_custom`] ?? "").trim();
        if (custom) benefits.push(custom);
      }
      if (benefits.length) lines.push(`${translate(locale, "ui.dot")} ${level}: ${benefits.join("; ")}`);
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
