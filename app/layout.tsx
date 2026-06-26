import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Nav from "@/components/Nav";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cxbilen.com"),
  title: {
    default: "Cem Bilen — Product Designer & Senior UX Engineer",
    template: "%s — Cem Bilen",
  },
  description: "Product Designer & Senior UX Engineer based in Izmir, Türkiye.",
  openGraph: {
    title: "Cem Bilen — Product Designer & Senior UX Engineer",
    description:
      "Product Designer & Senior UX Engineer based in Izmir, Türkiye.",
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
    <html lang="en" className={hanken.variable} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
