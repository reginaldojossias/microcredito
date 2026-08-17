"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { sendCollectionReminderAction } from "@/lib/actions";

export function CollectionReminderButton({ loanId }: { loanId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      disabled={pending}
      onClick={() => {
        const formData = new FormData();
        formData.set("loan_id", loanId);
        startTransition(async () => {
          await sendCollectionReminderAction(formData);
        });
      }}
    >
      {pending ? "A enviar..." : "Enviar lembrete"}
    </Button>
  );
}
