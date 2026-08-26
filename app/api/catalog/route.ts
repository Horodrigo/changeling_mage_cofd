import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { rules, sources } from "@/db/schema";
import { SHARED_RULES, SOURCE_CATALOG } from "@/lib/creation-rules";
import { MERIT_RULES } from "@/lib/merits";

export async function POST() {
  try {
    const db = getDb();
    const statements = [
      ...SOURCE_CATALOG.map((source) => db.insert(sources).values({
        id: source.id,
        filename: source.title,
        title: source.title,
        sourceType: source.type,
        edition: source.edition,
        gameLine: source.gameLine,
        language: "en",
        reviewStatus: "APPROVED",
        enabled: true,
        notes: source.role,
      }).onConflictDoUpdate({
        target: sources.id,
        set: { reviewStatus: "APPROVED", enabled: true, notes: source.role },
      })),
      ...[...SHARED_RULES, ...MERIT_RULES].map((rule) => db.insert(rules).values({
        id: rule.id,
        originalName: rule.name,
        translatedName: rule.name,
        category: rule.id.startsWith("merits-") ? "Méritos" : "Criação de personagem",
        gameLine: rule.gameLine,
        sourceId: rule.sourceId,
        sourcePage: rule.page,
        sourceSection: "Character Creation",
        sourceType: "OFFICIAL",
        structuredData: JSON.stringify(rule.data),
        reviewStatus: "APPROVED",
        needsReview: false,
        reviewNotes: "Regra estruturada automaticamente a partir da fonte principal.",
      }).onConflictDoUpdate({
        target: rules.id,
        set: { structuredData: JSON.stringify(rule.data), reviewStatus: "APPROVED", needsReview: false },
      })),
    ] as const;
    await db.batch(statements);
    const rows = await db.select().from(rules).orderBy(asc(rules.gameLine), asc(rules.originalName));
    return Response.json({ rules: rows, sources: SOURCE_CATALOG });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao carregar o catálogo compartilhado." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows = await getDb().select().from(rules).orderBy(asc(rules.gameLine), asc(rules.originalName));
    return Response.json({ rules: rows, sources: SOURCE_CATALOG });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao carregar o catálogo compartilhado." }, { status: 500 });
  }
}
