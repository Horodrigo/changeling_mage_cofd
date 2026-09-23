import type { Metadata, Viewport } from "next";
import Image from "next/image";
import "./css/globals.css";
import "./css/mortal-sheet.css";
import "./css/changeling-sheet.css";
import "./css/mage-sheet.css";
import "./css/vampire-sheet.css";
import "./css/vampire-interactions.css";
import { PwaManager } from "./pwa-manager";
import { LanguageProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Characters of the Darkness",
  description: "Trackable character sheets for Chronicles of Darkness.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/app-icon-192.png", shortcut: "/app-icon-192.png", apple: "/app-icon-192.png" },
  appleWebApp: { capable: true, title: "Characters of the Darkness", statusBarStyle: "black-translucent" },
};
export const viewport: Viewport = { themeColor: "#311c35", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US">
      <body>
        {process.env.NODE_ENV === "development" && <script
          // A previously installed production worker can cache Vite modules
          // before the React client starts. Clear it before those modules load.
          dangerouslySetInnerHTML={{ __html: `if ("serviceWorker" in navigator) { navigator.serviceWorker.getRegistrations().then((registrations) => Promise.all(registrations.map((registration) => registration.unregister()))); } if ("caches" in window) { caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("characters-of-the-darkness-") || key.startsWith("arquivo-das-trevas-")).map((key) => caches.delete(key)))); }` }}
        />}
        <div className="app-launch-splash" aria-hidden="true">
          <Image src="/app-icon-192.png" alt="" width={192} height={192} priority unoptimized />
          <strong>{metadata.title as string}</strong>
        </div>
        <LanguageProvider>{children}<PwaManager /></LanguageProvider>
      </body>
    </html>
  );
}
