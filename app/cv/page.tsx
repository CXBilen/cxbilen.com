import type { Metadata } from "next";
import Footer from "@/components/Footer";
import CVMain from "@/components/cv/CVMain";
import DownloadCV from "@/components/cv/DownloadCV";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Cem Bilen: software engineer working across full-stack development, AI-native workflows, UX and conversion optimization.",
};

export default function CVPage() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-6 pb-4 pt-12 sm:pt-16">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-muted-foreground">Curriculum vitae</p>
          <DownloadCV />
        </div>
        <CVMain />
      </main>
      <Footer />
    </>
  );
}
