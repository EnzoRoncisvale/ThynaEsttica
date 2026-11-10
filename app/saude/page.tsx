import React from "react";
import NicheBookingForm, { ServiceItem } from "@/components/public/NicheBookingForm";
import { HeartPulse, ArrowLeft, ShieldCheck, Heart, Award, Sparkles } from "lucide-react";
import Link from "next/link";

const SAUDE_SERVICES: ServiceItem[] = [
  {
    id: "pkg-saude-nutri",
    title: "Plano Vitalidade: Consulta Integrativa + Acompanhamento 45 Dias",
    subtitle:
      "Emagrecimento saudável, disposição física e regulação metabólica sem dietas restritivas.",
    tag: "Mais Procurado 🥗",
    highlight: true,
    priceOriginal: 480,
    pricePromo: 349,
    installments: "3x de R$ 116,33 sem juros",
    durationTotal: "45 dias de acompanhamento",
    rating: "5.0",
    reviewsCount: 114,
    includedItems: [
      "Consulta inicial presencial detalhada de 60 minutos",
      "Exame de Bioimpedância Tetrapolar (% gordura, massa magra, hidratação e idade metabólica)",
      "Cardápio personalizado de fácil execução no dia a dia",
      "Retorno com nova pesagem e reajuste de metas em 30 a 45 dias",
      "Suporte contínuo para dúvidas de compras e refeições no WhatsApp",
    ],
    exclusiveBonuses: [
      "🎁 Bônus 1: Guia Digital de Marmitas Saudáveis & Práticas",
      "🎁 Bônus 2: Lista de substituições inteligentes para restaurantes",
    ],
    suitableFor:
      "Quem quer perder peso com saúde, melhorar exames de sangue ou ganhar mais vitalidade e energia.",
  },
  {
    id: "pkg-saude-coluna",
    title: "Protocolo Coluna Livre de Dor: Avaliação + 3 Sessões Fisioterapia",
    subtitle:
      "Diagnóstico e tratamento da causa raiz de dores lombares, torcicolo e tensão postural.",
    tag: "Alívio Rápido 🩺",
    priceOriginal: 540,
    pricePromo: 399,
    installments: "3x de R$ 133,00 sem juros",
    durationTotal: "3 sessões de 50 min",
    rating: "4.9",
    reviewsCount: 88,
    includedItems: [
      "Avaliação postural e biomecânica detalhada na 1ª sessão",
      "3 sessões completas com atendimento exclusivo 1 para 1",
      "Liberação miofascial instrumental e manual",
      "Ventosaterapia e termoterapia quando indicado",
      "Prescrição de rotina de 5 minutos de exercícios para fazer em casa",
    ],
    exclusiveBonuses: [
      "🎁 Bônus: Cartilha em vídeo com exercícios posturais para trabalho sentado",
    ],
    suitableFor:
      "Pessoas que trabalham sentadas no computador, sofrem com lombalgia ou rigidez muscular.",
  },
  {
    id: "pkg-saude-mente",
    title: "Ciclo Equilíbrio & Clareza Mental (4 Encontros)",
    subtitle:
      "Sessões terapêuticas para regulação emocional, alívio de estresse e bem-estar integral.",
    tag: "Saúde Integrativa 🧠",
    priceOriginal: 800,
    pricePromo: 580,
    installments: "4x de R$ 145,00 sem juros",
    durationTotal: "4 encontros semanais",
    rating: "5.0",
    reviewsCount: 67,
    includedItems: [
      "4 sessões de 50 minutos (presenciais ou online à sua escolha)",
      "Mapeamento dos gatilhos de sobrecarga e cansaço mental",
      "Ferramentas práticas de regulação emocional e respiração",
      "Acompanhamento semanal de metas pessoais",
      "Sigilo profissional absoluto e acolhimento ético",
    ],
    exclusiveBonuses: [
      "🎁 Bônus: Áudios guiados de relaxamento e rotina de higiene do sono",
    ],
    suitableFor:
      "Pessoas sob pressão no trabalho, rotina exaustiva ou crises de ansiedade recorrentes.",
  },
];

export default function SaudePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-[#FFC107] selection:text-black flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Início</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-800">Consultas Abertas</span>
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold shadow-2xs">
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>Espaço Especializado em Saúde Integrativa & Bem-Estar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Recupere sua disposição, equilíbrio e qualidade de vida.
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            Abordagem acolhedora com a profissional Thyná que une nutrição funcional com bioimpedância,
            fisioterapia para alívio de dores e saúde emocional preventiva. Escolha a sua área abaixo:
          </p>
        </div>

        {/* Vitrine e Formulário Interativo */}
        <NicheBookingForm niche="saude" services={SAUDE_SERVICES} />

        {/* Diferenciais Clínicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-200/80">
          <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl flex items-start gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-900">Visão do Ser Completo</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Não tratamos apenas o sintoma, mas investigamos as causas raízes de fadiga, dores e estresse.
              </p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl flex items-start gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-900">Bioimpedância Tetrapolar</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Dados clínicos precisos sobre gordura visceral, massa magra e hidratação para guiar sua evolução.
              </p>
            </div>
          </div>

          <div className="bg-white border border-zinc-200/80 p-5 rounded-2xl flex items-start gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-purple-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-900">Acompanhamento de Perto</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Canal direto de suporte no WhatsApp entre as consultas para ajustes, dúvidas e incentivo contínuo.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-6 px-4 text-center text-xs text-zinc-500 space-y-1">
        <p className="font-bold text-zinc-700">Thyná Estética & Saúde Integrada</p>
        <p>© {new Date().getFullYear()} • Todos os direitos reservados • Consultas com hora marcada</p>
      </footer>
    </div>
  );
}

