import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  return (
    <nav
      aria-label="Main"
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--bg) 70%, transparent)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image
            src="/images/cx-logo.png"
            alt="Cem Bilen"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-bold text-heading">Cem Bilen</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-body">
          <Link href="/work" className="transition-colors hover:text-accent">
            Work
          </Link>
          <Link href="/cv" className="transition-colors hover:text-accent">
            CV
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
