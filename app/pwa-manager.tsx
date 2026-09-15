"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, RefreshCw, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_VERSION } from "@/lib/app-version";
import { useLanguage } from "@/lib/i18n";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{outcome:"accepted"|"dismissed"}> };
const DISMISSED_KEY = "characters-of-the-darkness:pwa-notice-dismissed";
const subscribeToConnection = (notify:()=>void) => {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};

export function PwaManager() {
  const {tr}=useLanguage();
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(null);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const online = useSyncExternalStore(subscribeToConnection,()=>navigator.onLine,()=>true);
  const [remoteVersion, setRemoteVersion] = useState(APP_VERSION);
  const [dismissed, setDismissed] = useState(() =>
    typeof window !== "undefined" && window.sessionStorage.getItem(DISMISSED_KEY) === "1",
  );

  useEffect(() => {
    const install = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPrompt); };
    window.addEventListener("beforeinstallprompt", install);
    if (process.env.NODE_ENV === "development" && "serviceWorker" in navigator) {
      // A production worker must never cache Vite's mutable development
      // modules. Remove an old registration before the dev client loads them.
      void navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister())),
      );
      void caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith("characters-of-the-darkness-") || key.startsWith("arquivo-das-trevas-")).map((key) => caches.delete(key))),
      );
    }
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
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
      window.removeEventListener("beforeinstallprompt", install);
    };
  }, []);

  const newerVersion = remoteVersion !== APP_VERSION;
  if (dismissed || (!installPrompt && !waiting && !newerVersion && online)) return null;
  return <aside className="pwa-notice" role="status">
    <div>{waiting || newerVersion ? <RefreshCw /> : installPrompt ? <Smartphone /> : <Download />}</div>
    <span><strong>{waiting || newerVersion ? tr("Atualização disponível","Update available") : installPrompt ? tr("Instale o aplicativo","Install the app") : tr("Você está offline","You are offline")}</strong><small>{waiting ? tr(`Versão ${remoteVersion} pronta para instalar.`,`Version ${remoteVersion} is ready to install.`) : newerVersion ? tr(`Preparando a versão ${remoteVersion}…`,`Preparing version ${remoteVersion}…`) : installPrompt ? tr("Use Characters of the Darkness pela tela inicial.","Use Characters of the Darkness from your home screen.") : tr("Suas fichas locais continuam disponíveis.","Your local character sheets remain available.")}</small></span>
    {waiting && <Button size="sm" onClick={() => waiting.postMessage({type:"SKIP_WAITING"})}>{tr("Atualizar agora","Update now")}</Button>}
    {installPrompt && <Button size="sm" onClick={async()=>{await installPrompt.prompt();await installPrompt.userChoice;setInstallPrompt(null)}}>{tr("Instalar","Install")}</Button>}
    <button type="button" className="pwa-dismiss" onClick={()=>{window.sessionStorage.setItem(DISMISSED_KEY,"1");setDismissed(true)}} aria-label={tr("Fechar","Close")}><X /></button>
  </aside>;
}
