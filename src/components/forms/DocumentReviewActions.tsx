"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { updateDocumentStatusAction } from "@/lib/actions";

export function DocumentReviewActions({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  function update(status: "aprovado" | "corrigir") {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", status);
    startTransition(async () => {
      await updateDocumentStatusAction(formData);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={pending} onClick={() => update("aprovado")}>
        Aprovar
      </Button>
      <Button
        size="sm"
        variant="secondary"
        disabled={pending}
        onClick={() => update("corrigir")}
      >
        Pedir correção
      </Button>
    </div>
  );
}
