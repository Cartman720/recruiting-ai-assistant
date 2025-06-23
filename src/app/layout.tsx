import type { Metadata } from "next";
import {
  Exo_2,
  Geist,
  Geist_Mono,
  Lato,
} from "next/font/google";
import "./globals.css";
import cn from "@/lib/utils";

const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Softang | Your Talent Partner",
  description:
    "Softang is your talent partner, we help you find the best candidates for your startup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={cn(
          `${exo.variable} ${lato.variable} antialiased`
        )}
      >
        {children}
      </body>
    </html>
  );
}
