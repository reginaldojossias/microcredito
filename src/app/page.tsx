import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Footer, Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/ui/StatCard";
import { isSupabaseConfigured } from "@/lib/env";
import { getProducts } from "@/lib/queries";
import { getServerI18n } from "@/lib/i18n/server";
import type { CreditProduct } from "@/lib/types";

export default async function HomePage() {
  const { dict, formatCurrency } = await getServerI18n();

  let products: CreditProduct[] = [];
  if (isSupabaseConfigured()) {
    try {
      products = await getProducts();
    } catch {
      products = [];
    }
  }

  return (
    <div className="bg-canvas">
      <Navbar />

      <main>
        <section className="geo-bg relative overflow-hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 pb-24 pt-16 text-center md:pb-32 md:pt-24">
            <span className="animate-fade-up mb-6 inline-flex items-center rounded-full border border-line bg-gold-soft px-3 py-1 text-[11px] text-gold-2">
              {dict.home.badge}
            </span>

            <div className="animate-fade-up mb-8 flex flex-col items-center gap-4">
              <Image
                src="/logo-full.png"
                alt="Kukula Microcrédito E.I"
                width={280}
                height={90}
                className="h-auto w-[220px] object-contain md:w-[280px]"
                priority
              />
            </div>

            <h1 className="animate-fade-up max-w-[700px] text-[40px] font-bold leading-[0.98] tracking-[-0.04em] text-ink md:text-[64px]">
              {dict.home.heroTitle}
            </h1>
            <p className="animate-fade-up mt-6 max-w-[600px] text-[16px] leading-[1.6] text-ink-secondary">
              {dict.home.heroDescription}
            </p>

            <div className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/registo">
                <Button size="lg">
                  {dict.home.getStarted}
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  {dict.home.enterPlatform}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-canvas py-14">
          <div className="mx-auto grid max-w-[1200px] gap-3 px-5 md:grid-cols-3">
            <StatCard
              label={dict.home.statCycle}
              value="100%"
              hint={dict.home.statCycleHint}
            />
            <StatCard
              label={dict.home.statAreas}
              value="03"
              hint={dict.home.statAreasHint}
            />
            <StatCard
              label={dict.home.statVisibility}
              value="24/7"
              hint={dict.home.statVisibilityHint}
            />
          </div>
        </section>

        <section id="produtos" className="py-24">
          <div className="mx-auto max-w-[1200px] px-5">
            <SectionHeading
              eyebrow={dict.home.productsEyebrow}
              title={dict.home.productsTitle}
              description={dict.home.productsDescription}
            />

            <div className="mt-12 grid gap-3 lg:grid-cols-12">
              {products.length ? (
                <>
                  <Card hover className="lg:col-span-7">
                    <div className="k-icon-well mb-5">
                      <Wallet size={18} />
                    </div>
                    <h3 className="text-[28px] font-bold tracking-[-0.04em]">
                      {products[0].name}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] text-ink-secondary">
                      {products[0].description}
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                          {dict.common.amount}
                        </div>
                        <div className="mt-1 text-[15px] font-semibold">
                          {formatCurrency(products[0].minAmount)} –{" "}
                          {formatCurrency(products[0].maxAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                          {dict.common.term}
                        </div>
                        <div className="mt-1 text-[15px] font-semibold">
                          {products[0].minTerm}–{products[0].maxTerm}{" "}
                          {dict.common.months}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.08em] text-ink-tertiary">
                          {dict.common.monthlyRate}
                        </div>
                        <div className="mt-1 text-[15px] font-semibold">
                          {products[0].interestRate}%
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="grid gap-3 lg:col-span-5">
                    {products.slice(1).map((product) => (
                      <Card key={product.id} hover>
                        <h3 className="text-[20px] font-bold tracking-[-0.04em]">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-[14px] text-ink-secondary">
                          {product.description}
                        </p>
                        <div className="mt-4 text-[12px] text-ink-tertiary">
                          {dict.common.upTo} {formatCurrency(product.maxAmount)} ·{" "}
                          {product.minTerm}–{product.maxTerm} {dict.common.months}
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="lg:col-span-12">
                  <p className="text-[14px] text-ink-secondary">
                    {dict.home.productsEmpty}
                  </p>
                </Card>
              )}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="dark-geo py-24 text-white">
          <div className="mx-auto max-w-[1200px] px-5">
            <SectionHeading
              dark
              eyebrow={dict.home.howEyebrow}
              title={dict.home.howTitle}
              description={dict.home.howDescription}
            />

            <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {dict.home.steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[18px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="text-[11px] uppercase tracking-[0.12em] text-gold-light">
                    {dict.common.step} {index + 1}
                  </div>
                  <h3 className="mt-4 text-[20px] font-bold tracking-[-0.04em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-white/60">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="requisitos" className="py-24">
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <SectionHeading
                eyebrow={dict.home.requirementsEyebrow}
                title={dict.home.requirementsTitle}
                description={dict.home.requirementsDescription}
              />
              <div className="grid gap-3">
                {[
                  { icon: FileCheck2, ...dict.home.requirementsItems[0] },
                  { icon: ShieldCheck, ...dict.home.requirementsItems[1] },
                  { icon: Smartphone, ...dict.home.requirementsItems[2] },
                ].map((item) => (
                  <Card key={item.title} hover className="flex gap-4">
                    <div className="k-icon-well shrink-0">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold tracking-[-0.02em]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[14px] text-ink-secondary">{item.text}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-line bg-canvas py-24">
          <div className="mx-auto max-w-[1200px] px-5">
            <SectionHeading
              align="center"
              eyebrow={dict.home.adminEyebrow}
              title={dict.home.adminTitle}
              description={dict.home.adminDescription}
            />
            <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
              {dict.home.adminFeatures.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] border border-line bg-surface px-5 py-4"
                >
                  <CheckCircle2 size={16} className="shrink-0 text-gold" />
                  <span className="text-[14px] text-ink">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/admin">
                <Button variant="secondary">
                  {dict.home.viewAdmin}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24">
          <div className="mx-auto max-w-[1200px] px-5">
            <SectionHeading
              eyebrow={dict.home.faqEyebrow}
              title={dict.home.faqTitle}
              description={dict.home.faqDescription}
            />
            <div className="mt-12 grid gap-3">
              {dict.home.faqs.map((item) => (
                <Card key={item.q}>
                  <h3 className="text-[16px] font-semibold tracking-[-0.02em]">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-[14px] text-ink-secondary">{item.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="dark-geo py-24">
          <div className="mx-auto max-w-[1200px] px-5 text-center">
            <SectionHeading
              dark
              align="center"
              eyebrow={dict.home.contactEyebrow}
              title={dict.home.contactTitle}
              description={dict.home.contactDescription}
            />
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/registo">
                <Button size="lg" variant="dark">
                  {dict.auth.createAccount}
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  className="border-white/20 bg-transparent text-white hover:bg-white/5"
                >
                  {dict.home.haveAccount}
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-[13px] text-ink-tertiary">{dict.home.contactInfo}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
