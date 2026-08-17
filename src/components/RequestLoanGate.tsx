"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { VerificationStatus } from "@/lib/types";

export function RequestLoanGate({
  verificationStatus,
  href = "/cliente/pedidos/novo",
  children,
}: {
  verificationStatus: VerificationStatus;
  href?: string;
  children: ReactNode;
}) {
  const { dict } = useI18n();
  const [showAlert, setShowAlert] = useState(false);
  const verified = verificationStatus === "verificado";

  if (verified) {
    return <Link href={href}>{children}</Link>;
  }

  return (
    <div className="space-y-3">
      {showAlert ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-[14px] text-danger"
        >
          <p className="font-medium">{dict.verification.blockedTitle}</p>
          <p className="mt-1">
            {verificationStatus === "em_analise"
              ? dict.verification.blockedPending
              : dict.verification.blockedBody}
          </p>
          <Link
            href="/cliente/verificacao"
            className="mt-3 inline-block font-semibold underline underline-offset-2"
          >
            {verificationStatus === "em_analise"
              ? dict.verification.viewStatus
              : dict.verification.goVerify}
          </Link>
        </div>
      ) : null}
      <div
        role="button"
        tabIndex={0}
        className="inline-flex"
        onClick={() => setShowAlert(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setShowAlert(true);
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
