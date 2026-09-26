import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import { cvData } from "@/lib/cv";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cxbilen.com"),
  title: {
    default: `Cem Bilen — ${cvData.title} | Full-stack & AI-native`,
    template: "%s — Cem Bilen",
  },
  description:
    "Software engineer building full-stack web products with AI-native workflows, UX expertise and conversion thinking. Based in Izmir, Türkiye.",
  openGraph: {
    title: `Cem Bilen — ${cvData.title} | Full-stack & AI-native`,
    description:
      "Full-stack web development, AI-native workflows and product engineering informed by UX and conversion optimization.",
    url: "https://cxbilen.com",
    siteName: "cxbilen.com",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider>
          <div className="isolate relative flex min-h-svh flex-col">
            <Nav />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
