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
import { faqs, products as fallbackProducts } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { getProducts } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";

const steps = [
  {
    title: "Crie a sua conta",
    text: "Cadastre dados pessoais, profissionais e de contacto de forma segura.",
  },
  {
    title: "Envie documentos",
    text: "Carregue identificação, comprovativos e ficheiros exigidos pelo produto.",
  },
  {
    title: "Simule e peça crédito",
    text: "Escolha valor, prazo e finalidade. Veja a simulação antes de enviar.",
  },
  {
    title: "Acompanhe tudo online",
    text: "Análise, contrato, desembolso, prestações e pagamentos num só lugar.",
  },
];

export default async function HomePage() {
  let products = fallbackProducts;
  if (isSupabaseConfigured()) {
    try {
      products = await getProducts();
      if (!products.length) products = fallbackProducts;
    } catch {
      products = fallbackProducts;
    }
  }
  return (
    <div className="bg-white">
      <Navbar />

      <main>
        <section className="geo-bg relative overflow-hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center px-5 pb-24 pt-16 text-center md:pb-32 md:pt-24">
            <span className="animate-fade-up mb-6 inline-flex items-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] px-3 py-1 text-[11px] text-[#555]">
              Plataforma digital de microcrédito
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

            <h1 className="animate-fade-up max-w-[700px] text-[40px] font-bold leading-[0.98] tracking-[-0.04em] text-[#0A0A0A] md:text-[64px]">
              Crédito organizado. Decisão clara. Controlo total.
            </h1>
            <p className="animate-fade-up mt-6 max-w-[600px] text-[16px] leading-[1.6] text-[#666]">
              Modernize todo o ciclo de microcrédito — do cadastro e documentos à
              aprovação, desembolso, pagamentos e liquidação.
            </p>

            <div className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/registo">
                <Button size="lg">
                  Começar agora
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="secondary">
                  Entrar na plataforma
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-[#F0F0F0] bg-[#FAFAFA] py-14">
          <div className="mx-auto grid max-w-[1200px] gap-3 px-5 md:grid-cols-3">
            <StatCard label="Ciclo digital" value="100%" hint="Do pedido à liquidação" />
            <StatCard label="Áreas da plataforma" value="03" hint="Público · Cliente · Admin" />
            <StatCard label="Visibilidade" value="24/7" hint="Estado do crédito em tempo real" />
          </div>
        </section>

        <section id="produtos" className="py-24">
          <div className="mx-auto max-w-[1200px] px-5">
            <SectionHeading
              eyebrow="Produtos"
              title="Linhas de crédito pensadas para o seu momento"
              description="Condições transparentes, simulação antes do pedido e acompanhamento contínuo."
            />

            <div className="mt-12 grid gap-3 lg:grid-cols-12">
              <Card hover className="lg:col-span-7">
                <div className="mb-5 flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-[#F3F3F3]">
                  <Wallet size={18} className="text-[#111]" />
                </div>
                <h3 className="text-[28px] font-bold tracking-[-0.04em]">
                  {products[0].name}
                </h3>
                <p className="mt-3 max-w-xl text-[15px] text-[#666]">
                  {products[0].description}
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
                      Montante
                    </div>
                    <div className="mt-1 text-[15px] font-semibold">
                      {formatCurrency(products[0].minAmount)} –{" "}
                      {formatCurrency(products[0].maxAmount)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
                      Prazo
                    </div>
                    <div className="mt-1 text-[15px] font-semibold">
                      {products[0].minTerm}–{products[0].maxTerm} meses
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
                      Taxa mensal
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
                    <p className="mt-2 text-[14px] text-[#666]">{product.description}</p>
                    <div className="mt-4 text-[12px] text-[#999]">
                      Até {formatCurrency(product.maxAmount)} · {product.minTerm}–
                      {product.maxTerm} meses
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="dark-geo py-24 text-white">
          <div className="mx-auto max-w-[1200px] px-5">
            <SectionHeading
              dark
              eyebrow="Como funciona"
              title="Do primeiro acesso à liquidação do empréstimo"
              description="Uma experiência financeira simples para o cliente e controlo total para a instituição."
            />

            <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[18px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#AFAFAF]">
                    Passo {index + 1}
                  </div>
                  <h3 className="mt-4 text-[20px] font-bold tracking-[-0.04em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.6] text-[#AAAAAA]">
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
                eyebrow="Requisitos"
                title="Documentação clara, análise segura"
                description="Cada documento fica associado ao perfil do cliente e pode ser acompanhado em tempo real: pendente, em análise, aprovado ou a corrigir."
              />
              <div className="grid gap-3">
                {[
                  {
                    icon: FileCheck2,
                    title: "Identificação e comprovativos",
                    text: "BI, morada, rendimentos e documentos do produto.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Decisão auditável",
                    text: "Registo de quem analisou, quando e qual foi a decisão.",
                  },
                  {
                    icon: Smartphone,
                    title: "Notificações automáticas",
                    text: "Pedido, aprovação, desembolso, lembretes e atrasos.",
                  },
                ].map((item) => (
                  <Card key={item.title} hover className="flex gap-4">
                    <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] border border-[#E5E5E5] bg-[#F3F3F3]">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold tracking-[-0.02em]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[14px] text-[#666]">{item.text}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#F0F0F0] bg-[#FAFAFA] py-24">
          <div className="mx-auto max-w-[1200px] px-5">
            <SectionHeading
              align="center"
              eyebrow="Gestão administrativa"
              title="Operação de microcrédito de ponta a ponta"
              description="Dashboard, fila de análise, desembolsos, cobranças, relatórios e permissões."
            />
            <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
              {[
                "Gestão e pesquisa de clientes",
                "Verificação de documentos",
                "Análise e decisão de crédito",
                "Controlo de desembolsos",
                "Acompanhamento de pagamentos",
                "Gestão de empréstimos em atraso",
                "Notificações e cobranças",
                "Perfis e permissões de funcionários",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] border border-[#E5E5E5] bg-white px-5 py-4"
                >
                  <CheckCircle2 size={16} className="shrink-0 text-black" />
                  <span className="text-[14px] text-[#333]">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/admin">
                <Button variant="secondary">
                  Ver área administrativa
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="py-24">
          <div className="mx-auto max-w-[1200px] px-5">
            <SectionHeading
              eyebrow="FAQ"
              title="Perguntas frequentes"
              description="Respostas objectivas sobre o pedido, a análise e o acompanhamento do crédito."
            />
            <div className="mt-12 grid gap-3">
              {faqs.map((item) => (
                <Card key={item.q}>
                  <h3 className="text-[16px] font-semibold tracking-[-0.02em]">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-[14px] text-[#666]">{item.a}</p>
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
              eyebrow="Contacto"
              title="Pronto para digitalizar o seu microcrédito?"
              description="Crie conta para experimentar a área do cliente, ou aceda à administração para gerir a operação."
            />
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/registo">
                <Button size="lg" variant="dark">
                  Criar conta
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  className="border-white/20 bg-transparent text-white hover:bg-white/5"
                >
                  Já tenho conta
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-[13px] text-[#AFAFAF]">
              contacto@kukula.ao · +244 900 000 000 · Luanda, Angola
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
