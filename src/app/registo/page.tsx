"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signUpAction } from "@/lib/actions";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="geo-bg flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-[560px]">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <Image
              src="/logo-icon.png"
              alt="Kukula"
              width={48}
              height={48}
              className="rounded-lg object-cover"
            />
            <div>
              <div className="text-[22px] font-bold tracking-[-0.04em]">KUKULA</div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#999]">
                Criar conta segura
              </div>
            </div>
          </Link>
        </div>

        <Card>
          <h1 className="text-[28px] font-bold tracking-[-0.04em]">Criar conta</h1>
          <p className="mt-2 text-[14px] text-[#666]">
            Os dados são gravados no Supabase Auth e no perfil do cliente.
          </p>

          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            action={(formData) => {
              startTransition(async () => {
                setError(null);
                const password = String(formData.get("password") ?? "");
                const confirm = String(formData.get("confirm") ?? "");
                if (password !== confirm) {
                  setError("As palavras-passe não coincidem.");
                  return;
                }
                const result = await signUpAction(formData);
                if (result?.error) setError(result.error);
              });
            }}
          >
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-[#666]">Nome completo</label>
              <input
                required
                name="full_name"
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
                placeholder="Ex.: Maria Fernandes"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-[#666]">Email</label>
              <input
                required
                name="email"
                type="email"
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-[#666]">Telefone</label>
              <input
                required
                name="phone"
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
                placeholder="+244 ..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-[#666]">Documento de ID</label>
              <input
                required
                name="id_document"
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-[#666]">Profissão</label>
              <input
                required
                name="profession"
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-[#666]">Morada</label>
              <input
                required
                name="address"
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-[#666]">Palavra-passe</label>
              <input
                required
                name="password"
                type="password"
                minLength={6}
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-[#666]">Confirmar</label>
              <input
                required
                name="confirm"
                type="password"
                minLength={6}
                className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
              />
            </div>
            {error ? (
              <p className="sm:col-span-2 text-[13px] text-[#777]">{error}</p>
            ) : null}
            <div className="sm:col-span-2 pt-2">
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "A criar..." : "Criar conta e continuar"}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#666]">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-black hover:underline">
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
