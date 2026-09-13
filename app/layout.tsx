import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./changeling-sheet.css";
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
    <html lang="pt-BR">
      <body>
        <div className="app-launch-splash" aria-hidden="true">
          <img src="/app-icon-192.png" alt="" />
          <strong>Characters of the Darkness</strong>
        </div>
        <LanguageProvider>{children}<PwaManager /></LanguageProvider>
      </body>
    </html>
  );
}
