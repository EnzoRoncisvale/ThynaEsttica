"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldCheck,
  Star,
  Check,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { submitLeadCapture } from "@/app/actions/lead-capture";

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  highlight?: boolean;
  priceOriginal: number;
  pricePromo: number;
  installments: string;
  durationTotal: string;
  rating: string;
  reviewsCount: number;
  includedItems: string[];
  exclusiveBonuses: string[];
  suitableFor: string;
}

interface NicheBookingProps {
  niche: "estetica" | "saude";
  services: ServiceItem[];
}

const TIME_SLOTS = [
  "08:30",
  "09:30",
  "10:30",
  "11:30",
  "13:30",
  "14:30",
  "15:30",
  "16:30",
  "17:30",
];

export default function NicheBookingForm({ niche, services }: NicheBookingProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Days
  const [availableDays, setAvailableDays] = useState<
    { iso: string; weekday: string; dayNumber: string; monthName: string }[]
  >([]);
  const [selectedDayIso, setSelectedDayIso] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("14:30");

  // Client inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  useEffect(() => {
    const days = [];
    const today = new Date();
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === 0) continue; // Pula domingo

      const iso = d.toISOString().slice(0, 10);
      days.push({
        iso,
        weekday: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : weekdays[d.getDay()]!,
        dayNumber: String(d.getDate()).padStart(2, "0"),
        monthName: months[d.getMonth()]!,
      });
    }

    setAvailableDays(days);
    if (days.length > 0) {
      setSelectedDayIso(days[0]!.iso);
    }
  }, []);

  const selectedDayObj = availableDays.find((d) => d.iso === selectedDayIso);

  const handleStartBooking = (service: ServiceItem) => {
    setSelectedService(service);
    setStep(1);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !name || !phone) return;

    setIsSubmitting(true);
    const dayLabel = selectedDayObj
      ? `${selectedDayObj.weekday}, ${selectedDayObj.dayNumber} de ${selectedDayObj.monthName}`
      : selectedDayIso;

    const res = await submitLeadCapture({
      name,
      phone,
      email,
      niche,
      selectedService: selectedService.title,
      preferredDay: dayLabel,
      preferredTime: selectedTime,
      notes,
    });

    setIsSubmitting(false);

    if (res.success && res.whatsappUrl) {
      setWhatsappUrl(res.whatsappUrl);
      setStep(3);
      // Opcional: abre o WhatsApp imediatamente em nova aba
      if (typeof window !== "undefined") {
        window.open(res.whatsappUrl, "_blank");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Vitrine de Serviços / Protocolos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {services.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between ${
              item.highlight
                ? "bg-white border-2 border-[#FFC107] shadow-xl shadow-[#FFC107]/10"
                : "bg-white/80 border border-zinc-200/90 hover:border-[#FFC107]/80 hover:shadow-lg"
            }`}
          >
            {item.highlight && (
              <span className="absolute -top-3 left-6 px-3 py-1 bg-[#FFC107] text-black font-extrabold text-[11px] rounded-full shadow-sm">
                {item.tag}
              </span>
            )}

            <div className="space-y-4">
              {!item.highlight && (
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/70 font-bold text-[11px] rounded-full">
                  {item.tag}
                </span>
              )}

              <div>
                <h3 className="text-lg font-black text-zinc-950 tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.subtitle}</p>
              </div>

              {/* Duração & Avaliação */}
              <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 py-2 border-y border-zinc-100">
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-[#FFC107] text-[#FFC107]" />
                  <span className="font-bold">{item.rating}</span>
                  <span className="text-zinc-400 font-normal">({item.reviewsCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{item.durationTotal}</span>
                </div>
              </div>

              {/* Itens Inclusos */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  O que está incluso:
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-700">
                  {item.includedItems.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-tight">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bônus */}
              {item.exclusiveBonuses.length > 0 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-[11px] text-amber-950 space-y-1">
                  {item.exclusiveBonuses.map((b, i) => (
                    <div key={i} className="font-semibold leading-snug">
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preço e Botão */}
            <div className="pt-6 border-t border-zinc-100 mt-6 space-y-3">
              <div>
                <span className="text-[11px] line-through text-zinc-400 block">
                  De R$ {item.priceOriginal.toFixed(2).replace(".", ",")}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-zinc-950">
                    R$ {item.pricePromo.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    ({item.installments})
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleStartBooking(item)}
                className="w-full py-3 bg-[#FFC107] hover:bg-[#ffb300] active:scale-[0.98] text-black font-extrabold text-xs rounded-2xl shadow-md shadow-[#FFC107]/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Reservar Horário</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE AGENDAMENTO & CAPTURA */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFF8E7] text-[#FFC107] flex items-center justify-center font-bold text-sm">
                  🐝
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-950 leading-tight">
                    Agendamento • Thyná Estética
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    {niche === "estetica" ? "Beleza & Estética Avançada" : "Saúde & Bem-Estar"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* PASSO 1: ESCOLHA DE DATA E HORA */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    Protocolo Selecionado:
                  </span>
                  <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
                    <h5 className="font-extrabold text-sm text-zinc-900">{selectedService.title}</h5>
                    <p className="text-xs text-emerald-700 font-bold mt-0.5">
                      R$ {selectedService.pricePromo.toFixed(2).replace(".", ",")} ({selectedService.installments})
                    </p>
                  </div>
                </div>

                {/* Seletor de Dias */}
                <div>
                  <label className="text-xs font-extrabold text-zinc-800 block mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Escolha o melhor dia:</span>
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {availableDays.map((d) => {
                      const isSel = d.iso === selectedDayIso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setSelectedDayIso(d.iso)}
                          className={`p-2.5 rounded-2xl min-w-[70px] text-center border transition-all cursor-pointer ${
                            isSel
                              ? "bg-[#111111] text-white border-[#111111] shadow-md"
                              : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold block opacity-70">
                            {d.weekday}
                          </span>
                          <span className="text-lg font-black block leading-none my-1">
                            {d.dayNumber}
                          </span>
                          <span className="text-[9px] block opacity-60">{d.monthName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seletor de Horários */}
                <div>
                  <label className="text-xs font-extrabold text-zinc-800 block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Horário preferido:</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSel = slot === selectedTime;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isSel
                              ? "bg-[#FFC107] text-black border-[#FFC107] shadow-xs font-extrabold"
                              : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="px-4 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-800"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}

            {/* PASSO 2: DADOS DE CONTATO & DETALHES */}
            {step === 2 && (
              <form onSubmit={handleFinish} className="space-y-4">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Beatriz Ramos"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      Seu WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(61) 98765-4321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      Usaremos para confirmar seu horário e enviar a localização da clínica.
                    </span>
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="beatriz@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      {niche === "estetica"
                        ? "Dúvidas ou queixas sobre sua pele/corpo:"
                        : "Sintomas, queixas ou objetivo principal:"}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={
                        niche === "estetica"
                          ? "Ex: Gostaria de tratar manchas / pele sensível..."
                          : "Ex: Dores na lombar ao trabalhar sentado / emagrecimento..."
                      }
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>
                </div>

                {/* Resumo da Reserva */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Resumo do Agendamento:</span>
                  </div>
                  <div className="text-zinc-700">
                    <strong>{selectedService.title}</strong> — {selectedDayObj?.weekday},{" "}
                    {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às{" "}
                    <strong>{selectedTime}</strong>.
                  </div>
                  <div className="text-emerald-700 font-bold">
                    Investimento: R$ {selectedService.pricePromo.toFixed(2).replace(".", ",")}{" "}
                    ({selectedService.installments}).
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Registrando no CRM...</span>
                    ) : (
                      <>
                        <span>Finalizar & Abrir WhatsApp</span>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* PASSO 3: SUCESSO E ABERTURA DO WHATSAPP */}
            {step === 3 && (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-zinc-950">
                    Agendamento Registrado com Sucesso!
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Muito obrigado, <strong>{name}</strong>! Seu pedido para{" "}
                    <strong>{selectedService.title}</strong> já foi salvo no CRM da Thyná.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Horário:</span>
                    <span className="font-extrabold text-emerald-700">
                      {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de{" "}
                      {selectedDayObj?.monthName} às {selectedTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Valor com Desconto:</span>
                    <span className="font-bold text-zinc-900">
                      R$ {selectedService.pricePromo.toFixed(2).replace(".", ",")} (
                      {selectedService.installments})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">WhatsApp Informado:</span>
                    <span className="font-mono text-zinc-800">{phone}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Falar com a Thyná no WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setSelectedService(null);
                      setStep(1);
                    }}
                    className="w-full sm:w-auto px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

