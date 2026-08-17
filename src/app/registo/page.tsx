"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signUpAction } from "@/lib/actions";
import { useI18n } from "@/lib/i18n/context";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { dict } = useI18n();

  return (
    <div className="geo-bg flex min-h-screen items-center justify-center px-5 py-12">
      <div className="absolute right-5 top-5">
        <LanguageSwitcher />
      </div>
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
              <div className="text-[11px] uppercase tracking-[0.12em] text-ink-tertiary">
                {dict.auth.registerSubtitle}
              </div>
            </div>
          </Link>
        </div>

        <Card>
          <h1 className="text-[28px] font-bold tracking-[-0.04em]">{dict.auth.registerTitle}</h1>
          <p className="mt-2 text-[14px] text-ink-secondary">{dict.auth.registerHint}</p>

          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            action={(formData) => {
              startTransition(async () => {
                setError(null);
                const password = String(formData.get("password") ?? "");
                const confirm = String(formData.get("confirm") ?? "");
                if (password !== confirm) {
                  setError(dict.auth.passwordMismatch);
                  return;
                }
                const result = await signUpAction(formData);
                if (result?.error) setError(result.error);
              });
            }}
          >
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.auth.fullName}</label>
              <input
                required
                name="full_name"
                className="k-input"
                placeholder={dict.auth.fullNamePlaceholder}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.common.email}</label>
              <input
                required
                name="email"
                type="email"
                className="k-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.common.phone}</label>
              <input
                required
                name="phone"
                className="k-input"
                placeholder={dict.auth.phonePlaceholder}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.auth.idDocument}</label>
              <input
                required
                name="id_document"
                className="k-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.auth.profession}</label>
              <input
                required
                name="profession"
                className="k-input"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.auth.address}</label>
              <input
                required
                name="address"
                className="k-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.common.password}</label>
              <input
                required
                name="password"
                type="password"
                minLength={6}
                className="k-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-ink-secondary">{dict.common.confirm}</label>
              <input
                required
                name="confirm"
                type="password"
                minLength={6}
                className="k-input"
              />
            </div>
            {error ? <p className="sm:col-span-2 text-[13px] text-ink-tertiary">{error}</p> : null}
            <div className="sm:col-span-2 pt-2">
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? dict.auth.creating : dict.auth.createAndContinue}
              </Button>
            </div>
          </form>

          <p className="mt-6 text-center text-[13px] text-ink-secondary">
            {dict.auth.hasAccount}{" "}
            <Link href="/login" className="font-medium text-gold-2 hover:underline">
              {dict.auth.signIn}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
