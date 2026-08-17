"use client";

import { useI18n } from "@/lib/i18n/context";

export function SetupBanner() {
  const { dict } = useI18n();

  return (
    <div className="border-b border-line bg-canvas px-5 py-3 text-center text-[13px] text-ink-secondary">
      {dict.setup.prefix}{" "}
      <code className="rounded bg-surface px-1.5 py-0.5 text-[12px]">{dict.setup.envExample}</code>{" "}
      {dict.setup.middle}{" "}
      <code className="rounded bg-surface px-1.5 py-0.5 text-[12px]">{dict.setup.migration}</code>{" "}
      {dict.setup.suffix}{" "}
      <span className="font-medium text-ink">{dict.setup.docs}</span>.
    </div>
  );
}
