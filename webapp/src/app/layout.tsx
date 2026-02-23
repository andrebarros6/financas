import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "Painel dos Recibos - Visualize os seus recibos verdes",
  description: "Importe o ficheiro SIRE do Portal das Finanças e veja gráficos de rendimento por mês e cliente. A forma mais fácil de analisar os seus recibos verdes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="pt">
      <head>
        {/* GA4 Consent Mode v2 — must run before the GA script loads */}
        <Script
          id="ga-consent-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}

        {/* GA4 script — loads after page is interactive; consent state already set above */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`gtag('config', '${GA_ID}', { anonymize_ip: true });`}
        </Script>

        <CookieBanner />
      </body>
    </html>
  );
}
