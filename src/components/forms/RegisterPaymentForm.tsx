"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { registerPaymentAction } from "@/lib/actions";
import type { Loan } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function RegisterPaymentForm({ loans }: { loans: Loan[] }) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!loans.length) {
    return <p className="text-[14px] text-[#666]">Não há empréstimos com saldo em aberto.</p>;
  }

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1.4fr_1fr_1fr_auto]"
      action={(formData) => {
        startTransition(async () => {
          setError(null);
          setOk(false);
          const result = await registerPaymentAction(formData);
          if (result?.error) setError(result.error);
          else setOk(true);
        });
      }}
    >
      <select
        name="loan_id"
        required
        className="rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
      >
        {loans.map((loan) => (
          <option key={loan.id} value={loan.id}>
            {loan.reference} · saldo {formatCurrency(loan.balance)}
          </option>
        ))}
      </select>
      <input
        required
        name="amount"
        type="number"
        min={1}
        defaultValue={loans[0]?.nextInstallment || 1000}
        className="rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
      />
      <select
        name="method"
        className="rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
      >
        <option>Carteira móvel</option>
        <option>Transferência bancária</option>
      </select>
      <Button type="submit" disabled={pending}>
        {pending ? "..." : "Pagar"}
      </Button>
      {error ? <p className="sm:col-span-4 text-[13px] text-[#777]">{error}</p> : null}
      {ok ? (
        <p className="sm:col-span-4 text-[13px] text-[#111]">Pagamento registado.</p>
      ) : null}
    </form>
  );
}
