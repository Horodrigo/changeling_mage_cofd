"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_VERSION } from "@/lib/app-version";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{outcome:"accepted"|"dismissed"}> };

export function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [online, setOnline] = useState(true);
  const [remoteVersion, setRemoteVersion] = useState(APP_VERSION);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const connected = () => setOnline(true), disconnected = () => setOnline(false);
    const install = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPrompt); };
    window.addEventListener("online", connected);
    window.addEventListener("offline", disconnected);
    window.addEventListener("beforeinstallprompt", install);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        const checkVersion = async () => {
          if (!navigator.onLine) return;
          try {
            const response = await fetch(`/version.json?t=${Date.now()}`, {cache:"no-store"});
            const data = await response.json() as {version?:string};
            if (data.version && data.version !== APP_VERSION) { setRemoteVersion(data.version); await registration.update(); }
          } catch {}
        };
        if (registration.waiting) setWaiting(registration.waiting);
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) setWaiting(worker);
          });
        });
        if (navigator.onLine) void registration.update();
        void checkVersion();
        window.addEventListener("focus", checkVersion);
        window.addEventListener("online", checkVersion);
      }).catch(() => undefined);
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) { refreshing = true; window.location.reload(); }
      });
    }
    return () => {
      window.removeEventListener("online", connected);
      window.removeEventListener("offline", disconnected);
      window.removeEventListener("beforeinstallprompt", install);
    };
  }, []);

  const newerVersion = remoteVersion !== APP_VERSION;
  if (dismissed || (!installPrompt && !waiting && !newerVersion && online)) return null;
  return <aside className="pwa-notice" role="status">
    <div>{waiting || newerVersion ? <RefreshCw /> : installPrompt ? <Smartphone /> : <Download />}</div>
    <span><strong>{waiting || newerVersion ? "Atualização disponível" : installPrompt ? "Instale o aplicativo" : "Você está offline"}</strong><small>{waiting ? `Versão ${remoteVersion} pronta para instalar.` : newerVersion ? `Preparando a versão ${remoteVersion}…` : installPrompt ? "Use o Arquivo das Trevas pela tela inicial." : "Suas fichas locais continuam disponíveis."}</small></span>
    {waiting && <Button size="sm" onClick={() => waiting.postMessage({type:"SKIP_WAITING"})}>Atualizar agora</Button>}
    {installPrompt && <Button size="sm" onClick={async()=>{await installPrompt.prompt();await installPrompt.userChoice;setInstallPrompt(null)}}>Instalar</Button>}
    <button className="pwa-dismiss" onClick={()=>setDismissed(true)} aria-label="Fechar"><X /></button>
  </aside>;
}
