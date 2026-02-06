import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
      </body>
    </html>
  );
}
