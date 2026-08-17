"use client";

import { useState, useTransition } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createDocumentAction } from "@/lib/actions";

export function CreateDocumentForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-[14px] text-ink-secondary">
          Identificação, comprovativos e informação financeira ficam associados ao seu
          perfil.
        </p>
        <Button onClick={() => setOpen(true)}>
          <Upload size={16} />
          Enviar documento
        </Button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-3 rounded-[18px] border border-line bg-surface p-5 sm:grid-cols-[1fr_1fr_auto]"
      action={(formData) => {
        startTransition(async () => {
          setError(null);
          const result = await createDocumentAction(formData);
          if (result?.error) setError(result.error);
          else setOpen(false);
        });
      }}
    >
      <input
        required
        name="name"
        placeholder="Nome do documento"
        className="k-input"
      />
      <input
        required
        name="doc_type"
        placeholder="Tipo (ex.: Identificação)"
        defaultValue="Identificação"
        className="k-input"
      />
      <Button type="submit" disabled={pending}>
        {pending ? "A enviar..." : "Guardar"}
      </Button>
      {error ? <p className="sm:col-span-3 text-[13px] text-ink-tertiary">{error}</p> : null}
    </form>
  );
}
