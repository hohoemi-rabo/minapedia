import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";

const mplusRounded = M_PLUS_Rounded_1c({
  variable: "--font-mplus-rounded",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Minapedia（ミナペディア）",
  description:
    "南信州の日常をみんなでのこす場所。ほほえみラボの生徒さん向けクローズドSNS。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${mplusRounded.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
