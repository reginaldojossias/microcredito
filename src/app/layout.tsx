import type { Metadata } from "next";
import { SetupBanner } from "@/components/SetupBanner";
import { isSupabaseConfigured } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kukula Microcrédito E.I",
  description:
    "Plataforma de gestão de microcrédito — do cadastro ao desembolso, pagamentos e liquidação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configured = isSupabaseConfigured();

  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {!configured ? <SetupBanner /> : null}
        {children}
      </body>
    </html>
  );
}

