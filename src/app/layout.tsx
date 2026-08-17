import type { Metadata } from "next";
import { SetupBanner } from "@/components/SetupBanner";
import { Providers } from "@/components/Providers";
import { isSupabaseConfigured } from "@/lib/env";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configured = isSupabaseConfigured();
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Providers initialLocale={locale}>
          {!configured ? <SetupBanner /> : null}
          {children}
        </Providers>
      </body>
    </html>
  );
}
