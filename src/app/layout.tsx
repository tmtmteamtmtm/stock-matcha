import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import Navbar from "@/components/NavBar";
import { Providers } from "./providers"; // ✅ import จาก step 1

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "stock-matcha",
  description: "testing out nextjs 13.4",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased`}>
        <Providers> {/* ✅ ครอบ session provider ที่นี่ */}
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
