import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "補助金申請ガイド｜中小企業・個人事業主の補助金を5問で診断",
  description: "業種・従業員数・目的を答えるだけ。AIがあなたに最適な補助金を即診断。IT導入補助金・ものづくり補助金・持続化補助金など主要補助金の申請方法・不採択理由を完全解説。",
  verification: {
    google: "Gt61M2S35xDo4Q9hmYa_oy7M2vPB54Ibxycf3roXQhA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2317215173633118"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
