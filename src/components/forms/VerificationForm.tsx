"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { submitVerificationAction } from "@/lib/actions";
import { useI18n } from "@/lib/i18n/context";
import { ID_DOCUMENT_TYPES, type VerificationStatus } from "@/lib/types";

type Prefill = {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  profession: string;
  income: number;
  province: string;
  district: string;
  neighborhood: string;
  address: string;
  idDocument: string;
  idDocumentType: string;
};

export function VerificationForm({
  prefill,
  verificationStatus,
}: {
  prefill: Prefill;
  verificationStatus: VerificationStatus;
}) {
  const { dict, locale } = useI18n();
  const v = dict.verification;
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  if (verificationStatus === "verificado") {
    return (
      <Card className="max-w-2xl">
        <h2 className="text-[22px] font-bold tracking-[-0.04em]">{v.alreadyVerifiedTitle}</h2>
        <p className="mt-3 text-[14px] text-[#666]">{v.alreadyVerifiedBody}</p>
        <Link href="/cliente/pedidos/novo" className="mt-6 inline-block">
          <Button>{dict.client.requestCredit}</Button>
        </Link>
      </Card>
    );
  }

  if (verificationStatus === "em_analise" || done) {
    return (
      <Card className="max-w-2xl">
        <h2 className="text-[22px] font-bold tracking-[-0.04em]">{v.pendingTitle}</h2>
        <p className="mt-3 text-[14px] text-[#666]">{v.pendingBody}</p>
        <Link href="/cliente" className="mt-6 inline-block">
          <Button variant="secondary">{v.backToDashboard}</Button>
        </Link>
      </Card>
    );
  }

  return (
    <form
      className="grid max-w-3xl gap-4"
      action={(formData) => {
        startTransition(async () => {
          setError(null);
          const result = await submitVerificationAction(formData);
          if (result?.error) setError(result.error);
          else setDone(true);
        });
      }}
    >
      {verificationStatus === "rejeitado" ? (
        <div
          role="alert"
          className="rounded-xl border border-[#F5C2C2] bg-[#FFF5F5] px-4 py-3 text-[14px] text-[#B42318]"
        >
          {v.rejectedNotice}
        </div>
      ) : null}

      <Card>
        <h2 className="text-[18px] font-bold tracking-[-0.03em]">{v.personalSection}</h2>
        <p className="mt-1 text-[13px] text-[#666]">{v.personalHint}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.fullName}</label>
            <input
              required
              name="full_name"
              defaultValue={prefill.fullName}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">{dict.common.phone}</label>
            <input
              required
              name="phone"
              defaultValue={prefill.phone}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.dateOfBirth}</label>
            <input
              required
              type="date"
              name="date_of_birth"
              defaultValue={prefill.dateOfBirth}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.profession}</label>
            <input
              required
              name="profession"
              defaultValue={prefill.profession}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.income}</label>
            <input
              required
              type="number"
              min={0}
              step={1000}
              name="income"
              defaultValue={prefill.income || ""}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-[18px] font-bold tracking-[-0.03em]">{v.residenceSection}</h2>
        <p className="mt-1 text-[13px] text-[#666]">{v.residenceHint}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.province}</label>
            <input
              required
              name="province"
              defaultValue={prefill.province}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.district}</label>
            <input
              required
              name="district"
              defaultValue={prefill.district}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.neighborhood}</label>
            <input
              required
              name="neighborhood"
              defaultValue={prefill.neighborhood}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.address}</label>
            <input
              required
              name="address"
              defaultValue={prefill.address}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-[18px] font-bold tracking-[-0.03em]">{v.identitySection}</h2>
        <p className="mt-1 text-[13px] text-[#666]">{v.identityHint}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.documentType}</label>
            <div className="grid gap-2 sm:grid-cols-2">
              {ID_DOCUMENT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] has-[:checked]:border-[#111] has-[:checked]:bg-[#FAFAFA]"
                >
                  <input
                    type="radio"
                    name="id_document_type"
                    value={type.value}
                    required
                    defaultChecked={
                      prefill.idDocumentType === type.value ||
                      (!prefill.idDocumentType && type.value === "BI")
                    }
                    className="accent-black"
                  />
                  {locale === "en" ? type.labelEn : type.labelPt}
                </label>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.documentNumber}</label>
            <input
              required
              name="id_document"
              defaultValue={prefill.idDocument}
              placeholder={v.documentNumberPlaceholder}
              className="w-full rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] outline-none focus:border-[#111]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[12px] text-[#666]">{v.uploadLabel}</label>
            <input
              required
              type="file"
              name="identity_file"
              accept="image/*,.pdf"
              className="w-full rounded-xl border border-dashed border-[#D0D0D0] bg-[#FAFAFA] px-4 py-6 text-[13px] file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-[12px] file:font-medium file:text-white"
            />
            <p className="mt-2 text-[12px] text-[#999]">{v.uploadHint}</p>
          </div>
        </div>
      </Card>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-[#F5C2C2] bg-[#FFF5F5] px-4 py-3 text-[14px] text-[#B42318]"
        >
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? v.submitting : v.submit}
        </Button>
        <Link href="/cliente/perfil">
          <Button type="button" variant="secondary">
            {dict.common.cancel}
          </Button>
        </Link>
      </div>
    </form>
  );
}
