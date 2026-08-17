"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { decideApplicationAction } from "@/lib/actions";

export function DecisionForm({
  id,
  currentStatus,
  initialNote,
}: {
  id: string;
  currentStatus: string;
  initialNote: string;
}) {
  const [note, setNote] = useState(initialNote);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function decide(decision: "aprovado" | "rejeitado" | "info_adicional") {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("decision", decision);
    formData.set("note", note);
    startTransition(async () => {
      const result = await decideApplicationAction(formData);
      if (result?.error) setMessage(result.error);
      else setMessage(`Decisão registada: ${decision}`);
    });
  }

  return (
    <Card>
      <h3 className="text-[18px] font-bold tracking-[-0.03em]">Decisão</h3>
      <p className="mt-2 text-[13px] text-ink-secondary">
        Estado actual: {currentStatus.replaceAll("_", " ")}. Cada decisão fica
        registada com analista, data e motivo.
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nota da análise..."
        className="k-input mt-5 min-h-[120px]"
      />
      <div className="mt-4 grid gap-2">
        <Button disabled={pending} onClick={() => decide("aprovado")}>
          Aprovar
        </Button>
        <Button
          variant="secondary"
          disabled={pending}
          onClick={() => decide("info_adicional")}
        >
          Pedir informação adicional
        </Button>
        <Button variant="ghost" disabled={pending} onClick={() => decide("rejeitado")}>
          Rejeitar
        </Button>
      </div>
      {message ? <p className="mt-4 text-[13px] text-ink-secondary">{message}</p> : null}
    </Card>
  );
}
