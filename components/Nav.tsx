import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Nav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          aria-label="Home"
        >
          <span
            className="flex size-7 items-center justify-center rounded-lg border bg-muted font-mono text-xs"
            aria-hidden="true"
          >
            cb
          </span>
          <span>Cem Bilen</span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" render={<Link href="/work" />}>
            Work
          </Button>
          <Button variant="ghost" render={<Link href="/cv" />}>
            CV
          </Button>
          <span className="mx-1 h-4 border-l" aria-hidden="true" />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
