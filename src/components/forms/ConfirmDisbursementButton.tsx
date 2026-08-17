"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { confirmDisbursementAction } from "@/lib/actions";

export function ConfirmDisbursementButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() => {
        const formData = new FormData();
        formData.set("id", id);
        startTransition(async () => {
          await confirmDisbursementAction(formData);
        });
      }}
    >
      {pending ? "A confirmar..." : "Confirmar desembolso"}
    </Button>
  );
}
