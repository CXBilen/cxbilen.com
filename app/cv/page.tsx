import type { Metadata } from "next";
import Background from "@/components/Background";
import Card from "@/components/Card";
import Sidebar from "@/components/cv/Sidebar";
import CVMain from "@/components/cv/CVMain";
import DownloadCV from "@/components/cv/DownloadCV";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae of Cem Bilen, Product Designer & Senior UX Engineer.",
};

export default function CVPage() {
  return (
    <>
      <Background />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-heading">CV</h1>
          <DownloadCV />
        </div>
        <Card className="p-8">
          <div className="flex flex-col gap-10 sm:flex-row">
            <Sidebar />
            <CVMain />
          </div>
        </Card>
      </main>
    </>
  );
}
