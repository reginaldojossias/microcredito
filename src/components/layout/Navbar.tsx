"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";
  const { dict } = useI18n();

  const links = [
    { href: "/#produtos", label: dict.nav.products },
    { href: "/#como-funciona", label: dict.nav.howItWorks },
    { href: "/#requisitos", label: dict.nav.requirements },
    { href: "/#faq", label: dict.nav.faq },
    { href: "/#contacto", label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-transparent bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-icon.png"
            alt="Kukula"
            width={36}
            height={36}
            className="h-9 w-9 rounded-md object-cover"
          />
          <div className="leading-none">
            <div className="text-[15px] font-bold tracking-[-0.04em] text-black">KUKULA</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#777]">
              {dict.common.brand}
            </div>
          </div>
        </Link>

        {isHome ? (
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] text-[#555] transition-colors hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <div className="hidden text-[12px] text-[#555] md:block">{dict.common.platformTagline}</div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Link href="/login">
            <Button variant="secondary" size="sm">
              {dict.nav.signIn}
            </Button>
          </Link>
          <Link href="/registo">
            <Button size="sm">{dict.nav.signUp}</Button>
          </Link>
        </div>

        <button
          className="rounded-full border border-[#E5E5E5] p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={dict.nav.menu}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#EEEEEE] bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {isHome
              ? links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-[13px] text-[#555]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))
              : null}
            <LanguageSwitcher className="self-start" />
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="w-full">
                {dict.nav.signIn}
              </Button>
            </Link>
            <Link href="/registo" onClick={() => setOpen(false)}>
              <Button className="w-full">{dict.nav.signUp}</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  const { dict } = useI18n();

  return (
    <footer className="border-t border-[#EEEEEE] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-8 text-[11px] text-[#777] md:flex-row md:items-center md:justify-between">
        <div className="font-medium text-[#555]">Kukula {dict.common.brand}</div>
        <div>
          © {new Date().getFullYear()} · {dict.footer.copyright}
        </div>
        <div className={cn("flex gap-4")}>
          <Link href="/login" className="hover:text-black">
            {dict.nav.clientArea}
          </Link>
          <Link href="/admin" className="hover:text-black">
            {dict.nav.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
