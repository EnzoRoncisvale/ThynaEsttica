import React from "react";
import NicheBookingForm, { ServiceItem } from "@/components/public/NicheBookingForm";
import { Sparkles, ArrowLeft, ShieldCheck, Heart, Award } from "lucide-react";
import Link from "next/link";

const ESTETICA_SERVICES: ServiceItem[] = [
  {
    id: "pkg-estetica-glow",
    title: "Protocolo Glow & Revitalização Facial Total",
    subtitle: "Tratamento intensivo para renovação celular, fechamento de poros e viço radiante.",
    tag: "Mais Procurado ✨",
    highlight: true,
    priceOriginal: 520,
    pricePromo: 379,
    installments: "3x de R$ 126,33 sem juros",
    durationTotal: "90 min",
    rating: "5.0",
    reviewsCount: 142,
    includedItems: [
      "Higienização com vapor de ozônio e emoliência sem dor",
      "Extração profunda de cravos por sucção a vácuo",
      "Peeling de Diamante para remoção da camada córnea e manchas",
      "Aplicação de Sérum Tensor com Nanotecnologia Hialurônica",
      "Máscara de Ouro & Fototerapia Led Calmante",
    ],
    exclusiveBonuses: [
      "🎁 Bônus 1: Drenagem linfática facial relaxante (cortesia)",
      "🎁 Bônus 2: Consultoria Home Care para manutenção em casa",
    ],
    suitableFor:
      "Peles com oleosidade, poros abertos, manchas superficiais ou que buscam efeito radiante imediato.",
  },
  {
    id: "pkg-estetica-olhar",
    title: "Combo Olhar Marcante: Lash Lifting + Sobrancelhas",
    subtitle: "Destaque e naturalidade para o rosto sem necessidade de rímel ou maquiagem diária.",
    tag: "Queridinho das Clientes 💖",
    priceOriginal: 240,
    pricePromo: 189,
    installments: "2x de R$ 94,50 sem juros",
    durationTotal: "60 min",
    rating: "4.9",
    reviewsCount: 98,
    includedItems: [
      "Mapeamento facial e alinhamento milimétrico das sobrancelhas",
      "Depilação com cera hipoalergênica ou pinça de precisão",
      "Lash Lifting orgânico para curvatura máxima e natural dos cílios",
      "Tintura especial efeito rímel 24h",
      "Nutrição profunda com sérum vitamínico reconstrutor",
    ],
    exclusiveBonuses: [
      "🎁 Bônus: Escovinha higiênica e óleo de hidratação pós-procedimento",
    ],
    suitableFor:
      "Mulheres que buscam praticidade na rotina matinal com olhar expressivo e natural.",
  },
  {
    id: "pkg-estetica-corpo",
    title: "Ciclo Silhouette: 5 Sessões de Drenagem & Modeladora",
    subtitle: "Redução de medidas, alívio de retenção e melhora expressiva do contorno corporal.",
    tag: "Tratamento Corporal 🌿",
    priceOriginal: 850,
    pricePromo: 620,
    installments: "4x de R$ 155,00 sem juros",
    durationTotal: "5 sessões de 50 min",
    rating: "4.9",
    reviewsCount: 76,
    includedItems: [
      "5 sessões completas individuais de 50 minutos cada",
      "Massagem modeladora nos focos de celulite e gordura localizada",
      "Drenagem desintoxicante para eliminação de líquidos retidos",
      "Cremes termoativos com cafeína e centella asiática",
      "Acompanhamento quinzenal de medidas corporais",
    ],
    exclusiveBonuses: [
      "🎁 Bônus: 1 Sessão de esfoliação corporal detox na 1ª visita",
    ],
    suitableFor:
      "Inchaço pré-menstrual, retenção hídrica, pernas cansadas ou redução de medidas.",
  },
];

export default function EsteticaPage() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-zinc-900 font-sans selection:bg-[#FFC107] selection:text-black flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-amber-900/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-black bg-white hover:bg-amber-100/60 px-3 py-1.5 rounded-xl border border-amber-900/10 transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Início</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border border-amber-900/10 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-800">Agenda Aberta</span>
          </div>

          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs font-bold bg-[#111111] text-white hover:bg-black rounded-xl transition-all shadow-xs"
          >
            Acesso Equipe →
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16 flex-1 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8E7] text-amber-900 border border-[#FFC107]/60 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>Espaço Especializado em Beleza & Estética Avançada</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Realce sua beleza natural com cuidados exclusivos.
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Protocolos de alta performance desenvolvidos pela profissional Thyná para devolver
            viço, saúde e harmonia ao seu rosto e corpo. Escolha o procedimento desejado abaixo para
            reservar seu horário:
          </p>
        </div>

        {/* Vitrine e Formulário Interativo */}
        <NicheBookingForm niche="estetica" services={ESTETICA_SERVICES} />

        {/* Diferenciais da Clínica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-amber-900/10">
          <div className="bg-white/80 border border-amber-900/10 p-5 rounded-2xl flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#FFC107]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-900">Atendimento Individualizado</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Cada sessão é única e reservada exclusivamente para você, sem salas cheias ou pressa.
              </p>
            </div>
          </div>

          <div className="bg-white/80 border border-amber-900/10 p-5 rounded-2xl flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-900">Insumos de Alta Pureza</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Utilizamos dermocosméticos nano-hialurônicos certificados pela Anvisa com segurança total.
              </p>
            </div>
          </div>

          <div className="bg-white/80 border border-amber-900/10 p-5 rounded-2xl flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-900">Ambiente Aconchegante</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Aromaterapia relaxante e música ambiente para uma pausa renovadora no seu dia.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-900/10 bg-white/60 py-6 px-4 text-center text-xs text-zinc-500 space-y-1">
        <p className="font-bold text-zinc-700">Thyná Estética & Saúde Integrada</p>
        <p>© {new Date().getFullYear()} • Todos os direitos reservados • Atendimento com hora marcada</p>
      </footer>
    </div>
  );
}

