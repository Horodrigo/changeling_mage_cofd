import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { characters } from "@/db/schema";

function owner(request: Request) {
  return request.headers.get("oai-authenticated-user-email") ?? "workspace-user";
}

export async function GET(request: Request) {
  try {
    const rows = await getDb().select().from(characters)
      .where(eq(characters.ownerId, owner(request)))
      .orderBy(desc(characters.updatedAt));
    return Response.json({ characters: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao carregar personagens." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const gameLine = payload.game_line === "MtA" ? "MtA" : payload.game_line === "CtL" ? "CtL" : "";
    if (!name || !gameLine) return Response.json({ error: "Nome e linha são obrigatórios." }, { status: 400 });
    const id = crypto.randomUUID();
    const rulesetId = typeof payload.ruleset_id === "string" ? payload.ruleset_id : `${gameLine.toLowerCase()}-base`;
    const characterData = typeof payload.character_data === "object" && payload.character_data ? payload.character_data : {};
    const [created] = await getDb().insert(characters).values({
      id,
      ownerId: owner(request),
      name,
      concept: typeof payload.concept === "string" ? payload.concept.trim() : "",
      gameLine,
      rulesetId,
      rulesetVersion: typeof payload.ruleset_version === "number" ? payload.ruleset_version : 1,
      schemaVersion: 1,
      characterData: JSON.stringify(characterData),
    }).returning();
    return Response.json({ character: created }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao salvar personagem." }, { status: 500 });
  }
}
