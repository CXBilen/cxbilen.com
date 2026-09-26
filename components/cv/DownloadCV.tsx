import { Button } from "@/components/ui/button";

const BASE = "/cv/Cem Bilen CV 2026";

export default function DownloadCV() {
  return (
    <div role="group" aria-label="Download CV" className="flex flex-wrap items-center gap-2">
      <Button render={<a href={`${BASE}.pdf`} download />}>
        Download PDF
      </Button>
      <Button variant="outline" render={<a href={`${BASE}.docx`} download />}>
        DOCX
      </Button>
      <Button variant="ghost" render={<a href={`${BASE}.txt`} download />}>
        TXT
      </Button>
    </div>
  );
}
