import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-[14px] text-ink-secondary">A carregar...</div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
