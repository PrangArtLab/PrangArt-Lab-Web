import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "PragArt Lab | Produksi Musik Tari Custom",
  description:
    "Musik digarap secara custom sesuai konsep tari, karakter daerah, dan kebutuhan artistik pertunjukan.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-prag-black text-white antialiased">{children}</body>
    </html>
  );
}
