import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rules } from "@/db/schema";

const allowedStatuses = new Set(["PENDING", "APPROVED", "REJECTED"]);

export async function GET(request: Request) {
  try {
    const status = new URL(request.url).searchParams.get("status") ?? "PENDING";
    const db = getDb();
    const rows = status === "ALL"
      ? await db.select().from(rules).orderBy(asc(rules.sourcePage), asc(rules.originalName))
      : allowedStatuses.has(status)
        ? await db.select().from(rules).where(eq(rules.reviewStatus, status)).orderBy(asc(rules.sourcePage), asc(rules.originalName))
        : [];
    return Response.json({ rules: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Falha ao carregar regras." }, { status: 500 });
  }
}
