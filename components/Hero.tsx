import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cvData } from "@/lib/cv";

export default function Hero() {
  return (
    <section className="flex flex-col gap-6 border-b py-16 sm:py-24">
      <p className="font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
        {cvData.title} / {cvData.subtitle}
      </p>
      <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
        Cem Bilen
      </h1>
      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        I build web products from interface to backend: application logic, APIs
        and the data behind them. I work with AI throughout development,
        bringing software engineering, UX and conversion thinking into the same
        process.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <Button size="lg" render={<Link href="/work" />}>
          View work <ArrowRightIcon aria-hidden="true" />
        </Button>
        <Button size="lg" variant="outline" render={<Link href="/cv" />}>
          View CV
        </Button>
      </div>
    </section>
  );
}
