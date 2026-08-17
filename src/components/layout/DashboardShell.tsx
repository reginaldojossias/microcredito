"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  UserRound,
  Wallet,
  X,
  ClipboardList,
  Users,
  Landmark,
  AlertTriangle,
  BarChart3,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { signOutAction } from "@/lib/actions";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

export function DashboardShell({
  area,
  title,
  subtitle,
  children,
  userName,
}: {
  area: "cliente" | "admin";
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { dict } = useI18n();

  const clientNav: NavItem[] = [
    { href: "/cliente", label: dict.dashboard.clientNav.dashboard, icon: LayoutDashboard },
    { href: "/cliente/verificacao", label: dict.dashboard.clientNav.verification, icon: ShieldCheck },
    { href: "/cliente/documentos", label: dict.dashboard.clientNav.documents, icon: FileText },
    { href: "/cliente/pedidos", label: dict.dashboard.clientNav.applications, icon: ClipboardList },
    { href: "/cliente/emprestimos", label: dict.dashboard.clientNav.loans, icon: Wallet },
    { href: "/cliente/pagamentos", label: dict.dashboard.clientNav.payments, icon: Receipt },
    { href: "/cliente/notificacoes", label: dict.dashboard.clientNav.notifications, icon: Bell },
    { href: "/cliente/perfil", label: dict.dashboard.clientNav.profile, icon: UserRound },
  ];

  const adminNav: NavItem[] = [
    { href: "/admin", label: dict.dashboard.adminNav.dashboard, icon: LayoutDashboard },
    { href: "/admin/clientes", label: dict.dashboard.adminNav.clients, icon: Users },
    { href: "/admin/documentos", label: dict.dashboard.adminNav.documents, icon: FileText },
    { href: "/admin/pedidos", label: dict.dashboard.adminNav.applications, icon: ClipboardList },
    { href: "/admin/emprestimos", label: dict.dashboard.adminNav.loans, icon: Wallet },
    { href: "/admin/desembolsos", label: dict.dashboard.adminNav.disbursements, icon: Banknote },
    { href: "/admin/pagamentos", label: dict.dashboard.adminNav.payments, icon: Receipt },
    { href: "/admin/cobrancas", label: dict.dashboard.adminNav.collections, icon: AlertTriangle },
    { href: "/admin/relatorios", label: dict.dashboard.adminNav.reports, icon: BarChart3 },
  ];

  const nav = area === "cliente" ? clientNav : adminNav;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[260px] border-r border-[#E7E7E7] bg-white p-5 transition-transform duration-200 md:static md:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-icon.png"
                alt="Kukula"
                width={34}
                height={34}
                className="h-[34px] w-[34px] rounded-md object-cover"
              />
              <div>
                <div className="text-[14px] font-bold tracking-[-0.04em]">KUKULA</div>
                <div className="text-[10px] uppercase tracking-[0.1em] text-[#999]">
                  {area === "cliente" ? dict.dashboard.clientArea : dict.dashboard.adminArea}
                </div>
              </div>
            </Link>
            <button className="md:hidden" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== `/${area}` && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition-colors",
                    active
                      ? "bg-black text-white"
                      : "text-[#555] hover:bg-[#F4F4F4] hover:text-black",
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-5 left-5 right-5">
            <button
              disabled={pending}
              onClick={() => startTransition(() => signOutAction())}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-[#666] hover:bg-[#F4F4F4]"
            >
              <LogOut size={16} />
              {dict.nav.signOut}
            </button>
          </div>
        </aside>

        {open ? (
          <button
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setOpen(false)}
            aria-label={dict.nav.closeMenu}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#EEEEEE] bg-white/90 px-5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button
                className="rounded-full border border-[#E5E5E5] p-2 md:hidden"
                onClick={() => setOpen(true)}
                aria-label={dict.nav.menu}
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="text-[18px] font-bold tracking-[-0.04em] text-[#0A0A0A]">
                  {title}
                </h1>
                {subtitle ? <p className="text-[12px] text-[#999]">{subtitle}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <div className="hidden items-center gap-2 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-1.5 text-[12px] text-[#555] sm:flex">
                <Landmark size={14} />
                Kukula
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[12px] font-semibold text-white">
                {userName
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
          </header>
          <main className="flex-1 p-5 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
