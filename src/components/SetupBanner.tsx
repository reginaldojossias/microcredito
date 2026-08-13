export function SetupBanner() {
  return (
    <div className="border-b border-[#E5E5E5] bg-[#FAFAFA] px-5 py-3 text-center text-[13px] text-[#555]">
      Configure o Supabase: copie{" "}
      <code className="rounded bg-white px-1.5 py-0.5 text-[12px]">.env.local.example</code>{" "}
      para <code className="rounded bg-white px-1.5 py-0.5 text-[12px]">.env.local</code>, execute o
      SQL em{" "}
      <code className="rounded bg-white px-1.5 py-0.5 text-[12px]">
        supabase/migrations/001_schema.sql
      </code>{" "}
      e depois <code className="rounded bg-white px-1.5 py-0.5 text-[12px]">npm run seed</code>. Ver{" "}
      <span className="font-medium text-black">SUPABASE.md</span>.
    </div>
  );
}
