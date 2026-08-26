import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { characters } from "@/db/schema";

function owner(request: Request) {
  return request.headers.get("oai-authenticated-user-email") ?? "workspace-user";
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = await request.json() as Record<string, unknown>;
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    if (!name) return Response.json({ error: "Nome é obrigatório." }, { status: 400 });
    const [updated] = await getDb().update(characters).set({
      name,
      concept: typeof payload.concept === "string" ? payload.concept.trim() : "",
      characterData: JSON.stringify(typeof payload.character_data === "object" && payload.character_data ? payload.character_data : {}),
      updatedAt: new Date().toISOString(),
    }).where(and(eq(characters.id, id), eq(characters.ownerId, owner(request)))).returning();
    if (!updated) return Response.json({ error: "Personagem não encontrado." }, { status: 404 });
    return Response.json({ character: updated });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao atualizar personagem." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const [deleted] = await getDb().delete(characters)
    .where(and(eq(characters.id, id), eq(characters.ownerId, owner(request)))).returning();
  if (!deleted) return Response.json({ error: "Personagem não encontrado." }, { status: 404 });
  return Response.json({ ok: true });
}
