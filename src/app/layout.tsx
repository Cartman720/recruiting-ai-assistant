import type { Metadata } from "next";
import { Roboto, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import cn from "@/lib/utils";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
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
          `${roboto.variable} ${robotoCondensed.variable} antialiased`
        )}
      >
        {children}
      </body>
    </html>
  );
}
