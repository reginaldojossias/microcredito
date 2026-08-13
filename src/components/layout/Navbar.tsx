"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#produtos", label: "Produtos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#requisitos", label: "Requisitos" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contacto", label: "Contacto" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

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
            <div className="text-[15px] font-bold tracking-[-0.04em] text-black">
              KUKULA
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#777]">
              Microcrédito E.I
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
          <div className="hidden text-[12px] text-[#555] md:block">
            Plataforma de gestão de microcrédito
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="secondary" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/registo">
            <Button size="sm">Criar conta</Button>
          </Link>
        </div>

        <button
          className="rounded-full border border-[#E5E5E5] p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
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
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="secondary" className="w-full">
                Entrar
              </Button>
            </Link>
            <Link href="/registo" onClick={() => setOpen(false)}>
              <Button className="w-full">Criar conta</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[#EEEEEE] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-8 text-[11px] text-[#777] md:flex-row md:items-center md:justify-between">
        <div className="font-medium text-[#555]">Kukula Microcrédito E.I</div>
        <div>© {new Date().getFullYear()} · Plataforma de gestão de microcrédito</div>
        <div className={cn("flex gap-4")}>
          <Link href="/login" className="hover:text-black">
            Área do cliente
          </Link>
          <Link href="/admin" className="hover:text-black">
            Administração
          </Link>
        </div>
      </div>
    </footer>
  );
}
