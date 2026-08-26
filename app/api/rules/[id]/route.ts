import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rules } from "@/db/schema";

const statuses = new Set(["PENDING", "APPROVED", "REJECTED"]);

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const payload = await request.json() as Record<string, unknown>;
    const status = typeof payload.review_status === "string" ? payload.review_status : "";
    if (!statuses.has(status)) return Response.json({ error: "Status de revisão inválido." }, { status: 400 });
    const page = Number(payload.source_page);
    if (!Number.isInteger(page) || page < 1) return Response.json({ error: "A página precisa ser um número válido." }, { status: 400 });
    const structured = typeof payload.structured_data === "object" && payload.structured_data ? payload.structured_data : {};
    const reviewer = request.headers.get("oai-authenticated-user-email") ?? "workspace-user";
    const [updated] = await getDb().update(rules).set({
      translatedName: typeof payload.translated_name === "string" ? payload.translated_name.trim() || null : null,
      translatedText: typeof payload.summary === "string" ? payload.summary.trim() || null : null,
      category: typeof payload.category === "string" ? payload.category.trim() : "",
      sourcePage: page,
      sourceSection: typeof payload.source_section === "string" ? payload.source_section.trim() : "",
      structuredData: JSON.stringify(structured),
      reviewNotes: typeof payload.review_notes === "string" ? payload.review_notes.trim() : "",
      reviewStatus: status,
      needsReview: status !== "APPROVED",
      reviewerId: reviewer,
      reviewedAt: status === "PENDING" ? null : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).where(eq(rules.id, id)).returning();
    if (!updated) return Response.json({ error: "Regra não encontrada." }, { status: 404 });
    return Response.json({ rule: updated });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao revisar regra." }, { status: 500 });
  }
}
