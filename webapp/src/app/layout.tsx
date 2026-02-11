import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const GA_ID = "G-SP3F57K2D4";

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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
