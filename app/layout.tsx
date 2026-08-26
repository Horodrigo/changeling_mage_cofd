import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arquivo das Trevas",
  description: "Fichas rastreáveis para Chronicles of Darkness.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
