"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createLoanApplicationAction } from "@/lib/actions";
import type { CreditProduct } from "@/lib/types";
import { formatCurrency, simulateLoan } from "@/lib/utils";

export function NovoPedidoForm({ products }: { products: CreditProduct[] }) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [amount, setAmount] = useState(products[0]?.minAmount ?? 100000);
  const [term, setTerm] = useState(products[0]?.minTerm ?? 6);
  const [purpose, setPurpose] = useState("Reforço de stock");
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const product = products.find((p) => p.id === productId) ?? products[0];
  const simulation = useMemo(
    () =>
      product
        ? simulateLoan(amount, term, product.interestRate)
        : { monthlyPayment: 0, totalPayable: 0, totalInterest: 0 },
    [amount, term, product],
  );

  if (!products.length) {
    return (
      <Card>
        <p className="text-[14px] text-[#666]">
          Nenhum produto disponível. Execute a migration e o seed do Supabase.
        </p>
      </Card>
    );
  }

  if (result) {
    return (
      <Card className="max-w-xl">
        <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">Referência</div>
        <h2 className="mt-2 text-[32px] font-bold tracking-[-0.04em]">{result.reference}</h2>
        <p className="mt-4 text-[14px] text-[#666]">
          O pedido foi gravado no Supabase e entrou na fila de análise.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/cliente/pedidos">
            <Button>Ver pedidos</Button>
          </Link>
          <Link href="/cliente">
            <Button variant="secondary">Ir ao dashboard</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <form
          className="space-y-5"
          action={(formData) => {
            startTransition(async () => {
              setError(null);
              formData.set("product_id", productId);
              formData.set("amount", String(amount));
              formData.set("term", String(term));
              formData.set("purpose", purpose);
              const res = await createLoanApplicationAction(formData);
              if (res?.error) setError(res.error);
              else if (res?.reference) setResult({ reference: res.reference });
            });
          }}
        >
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">Produto</label>
            <select
              value={productId}
              onChange={(e) => {
                const next = products.find((p) => p.id === e.target.value);
                setProductId(e.target.value);
                if (next) {
                  setAmount(next.minAmount);
                  setTerm(next.minTerm);
                }
              }}
              className="w-full rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">
              Valor pretendido ({formatCurrency(amount)})
            </label>
            <input
              type="range"
              min={product.minAmount}
              max={product.maxAmount}
              step={10000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">
              Prazo ({term} meses)
            </label>
            <input
              type="range"
              min={product.minTerm}
              max={product.maxTerm}
              step={1}
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">Finalidade</label>
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          {error ? <p className="text-[13px] text-[#777]">{error}</p> : null}
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "A enviar..." : "Enviar pedido"}
          </Button>
        </form>
      </Card>

      <Card className="lg:col-span-2">
        <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">Simulação</div>
        <h3 className="mt-2 text-[22px] font-bold tracking-[-0.04em]">{product.name}</h3>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-[14px]">
            <span className="text-[#666]">Montante</span>
            <span className="font-semibold">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[#666]">Prestação mensal</span>
            <span className="font-semibold">
              {formatCurrency(simulation.monthlyPayment)}
            </span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[#666]">Total a pagar</span>
            <span className="font-semibold">
              {formatCurrency(simulation.totalPayable)}
            </span>
          </div>
          <div className="flex justify-between text-[14px]">
            <span className="text-[#666]">Juros totais</span>
            <span className="font-semibold">
              {formatCurrency(simulation.totalInterest)}
            </span>
          </div>
        </div>
        <p className="mt-6 text-[12px] text-[#999]">
          Taxa mensal indicativa de {product.interestRate}%.
        </p>
      </Card>
    </div>
  );
}
