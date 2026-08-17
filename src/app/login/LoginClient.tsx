"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signInAction } from "@/lib/actions";
import { useI18n } from "@/lib/i18n/context";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { dict } = useI18n();

  return (
    <div className="geo-bg flex min-h-screen items-center justify-center px-5 py-12">
      <div className="absolute right-5 top-5">
        <LanguageSwitcher />
      </div>
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
              <div className="text-[11px] uppercase tracking-[0.12em] text-ink-tertiary">
                {dict.common.brand}
              </div>
            </div>
          </Link>
        </div>

        <Card>
          <h1 className="text-[28px] font-bold tracking-[-0.04em]">{dict.auth.signIn}</h1>
          <p className="mt-2 text-[14px] text-ink-secondary">{dict.auth.signInHint}</p>

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
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.common.email}</label>
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                className="k-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.common.password}</label>
              <input
                required
                name="password"
                type="password"
                autoComplete="current-password"
                className="k-input"
              />
            </div>
            {error ? <p className="text-[13px] text-ink-tertiary">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? dict.auth.signingIn : dict.auth.enterPlatform}
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink-secondary">
            {dict.auth.noAccount}{" "}
            <Link
              href="/registo"
              className="font-medium text-gold-2 underline-offset-2 hover:underline"
            >
              {dict.auth.createAccount}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
