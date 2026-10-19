import type { Metadata } from "next";
import localFont from "next/font/local";
import { getLanguage } from "@/tolgee/language";
import { getTolgee } from "@/tolgee/server";
import { TolgeeNextProvider } from "@/tolgee/client";

import "@/assets/css/globals.css";
import "@/assets/css/animations.css";
import { Toaster } from "react-hot-toast";

const pofak = localFont({
  src: "../assets/fonts/pofak/PofakVF.woff",
  variable: "--font-pofak",
});

const morabba = localFont({
  src: "../assets/fonts/morabba/MorabbaVF.woff",
  variable: "--font-morabba",
});

const inter = localFont({
  src: "../assets/fonts/inter/Inter-Variable.ttf",
  variable: "--font-inter",
  weight: "100 900",
  style: "normal",
  display: "swap",
  // The previous Google loader used Inter's default optical size (14).
  declarations: [{ prop: "font-variation-settings", value: "'opsz' 14" }],
});

const teko = localFont({
  src: "../assets/fonts/teko/Teko-Variable.ttf",
  variable: "--font-teko",
  weight: "300 700",
  style: "normal",
  display: "swap",
});

const yekanBakh = localFont({
  src: "../assets/fonts/yekan-bakh/YekanBakh-VF.woff",
  variable: "--font-yekan",
});

export const metadata: Metadata = {
  title: "Beenbo",
  icons: "https://assets.beenbo.com/logo/Logo.svg",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getLanguage();
  const tolgee = await getTolgee();
  const staticData = await tolgee.loadRequired();

  const direction = language === "fa-IR" ? "rtl" : "ltr";

  const font =
    language === "fa-IR"
      ? `${yekanBakh.variable} ${morabba.variable} ${pofak.variable} font-yekan`
      : `${inter.variable} ${teko.variable} font-inter`;

  return (
    <html dir={direction} lang={language} className="scroll-smooth">
      <body className={`${font} antialiased bg-background text-on-surface`}>
        <TolgeeNextProvider language={language} staticData={staticData}>
          {children}
          <Toaster />
        </TolgeeNextProvider>
      </body>
    </html>
  );
}
