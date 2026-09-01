import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaManager } from "./pwa-manager";

export const metadata: Metadata = {
  title: "Arquivo das Trevas",
  description: "Fichas rastreáveis para Chronicles of Darkness.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#311c35", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}<PwaManager /></body>
    </html>
  );
}
