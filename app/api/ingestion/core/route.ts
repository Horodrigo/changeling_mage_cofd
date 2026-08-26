import { getDb } from "@/db";
import { rules, sources } from "@/db/schema";

const source = {
  id: "core-2ed-chronicles-of-darkness",
  filename: "2ed - Core - Chronicles of Darkness.pdf",
  title: "Chronicles of Darkness",
  sourceType: "OFFICIAL",
  edition: 2,
  gameLine: "Core",
  language: "en",
  reviewStatus: "PENDING_REVIEW",
  enabled: false,
  notes: "Sumário indexado; conteúdo mecânico aguardando revisão manual.",
};

const candidates = [
  ["character-creation", "Character Creation", "Criação de personagem", 24],
  ["anchors", "Anchors", "Personagem", 27],
  ["attributes", "Attributes", "Características", 30],
  ["skills", "Skills", "Características", 31],
  ["merits", "Merits", "Méritos", 43],
  ["rolling-dice", "Rolling Dice", "Sistema básico", 68],
  ["skill-specialties", "Skill Specialties", "Características", 73],
  ["willpower", "Willpower", "Recursos", 73],
  ["integrity", "Integrity", "Integridade", 73],
  ["conditions", "Conditions", "Condições", 75],
  ["experience", "Experience", "Progressão", 76],
  ["investigation", "Investigation", "Sistema dramático", 77],
  ["social-maneuvering", "Social Maneuvering", "Sistema dramático", 81],
  ["chases", "Chases", "Sistema dramático", 84],
  ["violence", "Violence", "Combate", 86],
  ["sources-of-harm", "Sources of Harm", "Perigos", 96],
  ["equipment", "Equipment", "Equipamento", 100],
  ["ephemeral-beings", "Ephemeral Beings", "Entidades", 122],
  ["appendix-equipment", "Appendix One: Equipment", "Equipamento", 268],
  ["tilts", "Appendix Two: Tilts", "Tilts", 280],
  ["appendix-conditions", "Appendix Three: Conditions", "Condições", 288],
] as const;

export async function POST() {
  try {
    const db = getDb();
    const statements = [
      db.insert(sources).values(source).onConflictDoUpdate({
        target: sources.id,
        set: { reviewStatus: "PENDING_REVIEW", notes: source.notes },
      }),
      ...candidates.map(([slug, name, category, page]) =>
        db.insert(rules).values({
          id: `core-2ed-${slug}`,
          originalName: name,
          translatedName: null,
          category,
          gameLine: "Core",
          sourceId: source.id,
          sourcePage: page,
          sourceSection: name,
          sourceType: "OFFICIAL",
          originalText: null,
          translatedText: null,
          structuredData: "{}",
          reviewStatus: "PENDING",
          needsReview: true,
          reviewNotes: "",
        }).onConflictDoNothing()
      ),
    ] as const;
    await db.batch(statements);
    return Response.json({ imported: candidates.length, source });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao processar o Core." }, { status: 500 });
  }
}
