"use client";

import { HardDrive } from "lucide-react";

export function StorageSettings() {
  return <section className="panel wide storage-panel">
    <div className="panel-heading"><div><span className="kicker">ARMAZENAMENTO OFFLINE</span><h3>Dados neste dispositivo</h3><p>Fichas e homebrews são mantidos no IndexedDB privado do aplicativo.</p></div></div>
    <div className="storage-options single"><div className="selected"><HardDrive/><span><strong>Somente neste dispositivo</strong><small>Use a exportação JSON para manter cópias de segurança fora do aplicativo.</small></span></div></div>
  </section>;
}
