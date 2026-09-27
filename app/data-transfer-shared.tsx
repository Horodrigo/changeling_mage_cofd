"use client";

import type { ReactNode } from "react";

export function TransferAction({ icon, title, description, children }: { icon: ReactNode; title: string; description: string; children: ReactNode }) {
  return <section className="data-transfer-action"><div className="data-transfer-action-heading">{icon}<div><h4>{title}</h4><p>{description}</p></div></div><div className="data-transfer-action-controls">{children}</div></section>;
}

export function downloadJson(value: unknown, filename: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
