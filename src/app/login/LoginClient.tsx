"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signInAction } from "@/lib/actions";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="geo-bg flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-[440px]">
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
                Microcrédito E.I
              </div>
            </div>
          </Link>
        </div>

        <Card>
          <h1 className="text-[28px] font-bold tracking-[-0.04em]">Entrar</h1>
          <p className="mt-2 text-[14px] text-[#666]">
            Use a sua conta Supabase (ex.: maria.fernandes@email.com ou admin@kukula.ao).
          </p>

          <form
            className="mt-6 space-y-4"
            action={(formData) => {
              startTransition(async () => {
                setError(null);
                const result = await signInAction(formData);
                if (result?.error) setError(result.error);
              });
            }}
          >
            <input type="hidden" name="next" value={next} />
            <div>
              <label className="mb-1.5 block text-[12px] text-[#666]">Email</label>
              <input
                required
                name="email"
                type="email"
                defaultValue="maria.fernandes@email.com"
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-[#111]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-[#666]">Palavra-passe</label>
              <input
                required
                name="password"
                type="password"
                defaultValue="demo1234"
                className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[14px] outline-none transition focus:border-[#111]"
              />
            </div>
            {error ? <p className="text-[13px] text-[#777]">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "A entrar..." : "Entrar na plataforma"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px] text-[#666]">
            Ainda não tem conta?{" "}
            <Link
              href="/registo"
              className="font-medium text-black underline-offset-2 hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
