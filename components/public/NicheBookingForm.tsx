"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  Star,
  Check,
  ArrowLeft,
  MessageSquare,
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
  const [submitError, setSubmitError] = useState<string | null>(null);
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

      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
    setSubmitError(null);
    setWhatsappUrl(null);
    setSelectedService(service);
    setStep(1);
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !selectedService || !name || !phone) return;

    setIsSubmitting(true);
    setSubmitError(null);
    const dayLabel = selectedDayObj
      ? `${selectedDayObj.weekday}, ${selectedDayObj.dayNumber} de ${selectedDayObj.monthName}`
      : selectedDayIso;

    try {
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

      if (res.success && res.whatsappUrl) {
        setWhatsappUrl(res.whatsappUrl);
        setStep(3);
      } else {
        setSubmitError(res.error || "Não foi possível registrar sua solicitação.");
      }
    } catch {
      setSubmitError("Falha de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Vitrine de Serviços / Protocolos */}
      <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3">
        {services.map((item) => (
          <div
            key={item.id}
            className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 ${
              item.highlight
                ? "border-2 border-[#FFC107] bg-white shadow-xl shadow-[#FFC107]/10"
                : "border border-zinc-200/90 bg-white/80 hover:border-[#FFC107]/80 hover:shadow-lg"
            }`}
          >
            {item.highlight && (
              <span className="absolute -top-3 left-6 rounded-full bg-[#FFC107] px-3 py-1 text-[11px] font-extrabold text-black shadow-sm">
                {item.tag}
              </span>
            )}

            <div className="space-y-4">
              {!item.highlight && (
                <span className="inline-block rounded-full border border-amber-200/70 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-900">
                  {item.tag}
                </span>
              )}

              <div>
                <h3 className="text-lg leading-snug font-black tracking-tight text-zinc-950">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{item.subtitle}</p>
              </div>

              {/* Duração & Avaliação */}
              <div className="flex items-center gap-4 border-y border-zinc-100 py-2 text-xs font-semibold text-zinc-500">
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-[#FFC107] text-[#FFC107]" />
                  <span className="font-bold">{item.rating}</span>
                  <span className="font-normal text-zinc-400">({item.reviewsCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{item.durationTotal}</span>
                </div>
              </div>

              {/* Itens Inclusos */}
              <div className="space-y-2 pt-1">
                <span className="block text-[11px] font-extrabold tracking-wider text-zinc-400 uppercase">
                  O que está incluso:
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-700">
                  {item.includedItems.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[2.5] text-emerald-600" />
                      <span className="leading-tight">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bônus */}
              {item.exclusiveBonuses.length > 0 && (
                <div className="space-y-1 rounded-2xl border border-amber-200/60 bg-amber-50/70 p-3 text-[11px] text-amber-950">
                  {item.exclusiveBonuses.map((b, i) => (
                    <div key={i} className="leading-snug font-semibold">
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preço e Botão */}
            <div className="mt-6 space-y-3 border-t border-zinc-100 pt-6">
              <div>
                <span className="block text-[11px] text-zinc-400 line-through">
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
                className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-[#FFC107] py-3 text-xs font-extrabold text-black shadow-md shadow-[#FFC107]/20 transition-all hover:bg-[#ffb300] active:scale-[0.98]"
              >
                <span>Reservar Horário</span>
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE AGENDAMENTO & CAPTURA */}
      {selectedService && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200">
          <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            {/* Header Modal */}
            <div className="mb-5 flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF8E7] text-sm font-bold text-[#FFC107]">
                  🐝
                </div>
                <div>
                  <h4 className="text-sm leading-tight font-black text-zinc-950">
                    Agendamento • Thyná Estética
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    {niche === "estetica" ? "Beleza & Estética Avançada" : "Saúde & Bem-Estar"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-500 hover:bg-zinc-200"
              >
                ✕
              </button>
            </div>

            {/* PASSO 1: ESCOLHA DE DATA E HORA */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <span className="mb-1 block text-[11px] font-bold tracking-wider text-amber-700 uppercase">
                    Protocolo Selecionado:
                  </span>
                  <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50 p-3">
                    <h5 className="text-sm font-extrabold text-zinc-900">
                      {selectedService.title}
                    </h5>
                    <p className="mt-0.5 text-xs font-bold text-emerald-700">
                      R$ {selectedService.pricePromo.toFixed(2).replace(".", ",")} (
                      {selectedService.installments})
                    </p>
                  </div>
                </div>

                {/* Seletor de Dias */}
                <div>
                  <label className="mb-2 block flex items-center gap-1.5 text-xs font-extrabold text-zinc-800">
                    <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Escolha o melhor dia:</span>
                  </label>
                  <div className="flex scrollbar-none gap-2 overflow-x-auto pb-2">
                    {availableDays.map((d) => {
                      const isSel = d.iso === selectedDayIso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setSelectedDayIso(d.iso)}
                          className={`min-w-[70px] cursor-pointer rounded-2xl border p-2.5 text-center transition-all ${
                            isSel
                              ? "border-[#111111] bg-[#111111] text-white shadow-md"
                              : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
                          }`}
                        >
                          <span className="block text-[10px] font-bold uppercase opacity-70">
                            {d.weekday}
                          </span>
                          <span className="my-1 block text-lg leading-none font-black">
                            {d.dayNumber}
                          </span>
                          <span className="block text-[9px] opacity-60">{d.monthName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seletor de Horários */}
                <div>
                  <label className="mb-2 block flex items-center gap-1.5 text-xs font-extrabold text-zinc-800">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Horário preferido:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((slot) => {
                      const isSel = slot === selectedTime;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`cursor-pointer rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                            isSel
                              ? "border-[#FFC107] bg-[#FFC107] font-extrabold text-black shadow-xs"
                              : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300"
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
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#FFC107] px-6 py-2.5 text-xs font-extrabold text-black shadow-md transition-all hover:bg-[#ffb300]"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            )}

            {/* PASSO 2: DADOS DE CONTATO & DETALHES */}
            {step === 2 && (
              <form onSubmit={handleFinish} className="space-y-4">
                <p className="text-xs text-zinc-600">
                  O dia e o horário são preferências e dependem de confirmação da equipe.
                </p>
                {submitError && (
                  <p role="alert" className="text-sm text-red-700">
                    {submitError}
                  </p>
                )}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="mb-1 block font-extrabold text-zinc-800">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Beatriz Ramos"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 focus:ring-2 focus:ring-[#FFC107] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-extrabold text-zinc-800">
                      Seu WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(61) 98765-4321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 focus:ring-2 focus:ring-[#FFC107] focus:outline-none"
                    />
                    <span className="mt-1 block text-[10px] text-zinc-400">
                      Usaremos para confirmar seu horário e enviar a localização da clínica.
                    </span>
                  </div>

                  <div>
                    <label className="mb-1 block font-extrabold text-zinc-800">
                      E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="beatriz@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 focus:ring-2 focus:ring-[#FFC107] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-extrabold text-zinc-800">
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
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 focus:ring-2 focus:ring-[#FFC107] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Resumo da Reserva */}
                <div className="space-y-1 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3 text-[11px] text-amber-950">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
                    <span>Resumo do Agendamento:</span>
                  </div>
                  <div className="text-zinc-700">
                    <strong>{selectedService.title}</strong> — {selectedDayObj?.weekday},{" "}
                    {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às{" "}
                    <strong>{selectedTime}</strong>.
                  </div>
                  <div className="font-bold text-emerald-700">
                    Investimento: R$ {selectedService.pricePromo.toFixed(2).replace(".", ",")} (
                    {selectedService.installments}).
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#FFC107] px-6 py-2.5 text-xs font-extrabold text-black shadow-md transition-all hover:bg-[#ffb300] active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Registrando no CRM...</span>
                    ) : (
                      <>
                        <span>Enviar solicitação</span>
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* PASSO 3: SUCESSO E ABERTURA DO WHATSAPP */}
            {step === 3 && (
              <div className="animate-in zoom-in-95 space-y-4 py-6 text-center duration-200">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                  <CheckCircle2 className="h-9 w-9 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-zinc-950">
                    Solicitação recebida! Aguarde a confirmação.
                  </h4>
                  <p className="mx-auto max-w-sm text-xs text-zinc-500">
                    Muito obrigado, <strong>{name}</strong>! Seu pedido para{" "}
                    <strong>{selectedService.title}</strong> já foi salvo no CRM da Thyná.
                  </p>
                </div>

                <div className="mx-auto max-w-md space-y-2 rounded-2xl border border-zinc-200/80 bg-zinc-50 p-4 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">Horário:</span>
                    <span className="font-extrabold text-emerald-700">
                      {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de{" "}
                      {selectedDayObj?.monthName} às {selectedTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">Valor com Desconto:</span>
                    <span className="font-bold text-zinc-900">
                      R$ {selectedService.pricePromo.toFixed(2).replace(".", ",")} (
                      {selectedService.installments})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-400">WhatsApp Informado:</span>
                    <span className="font-mono text-zinc-800">{phone}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 pt-2 sm:flex-row">
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-extrabold text-white shadow-md transition-colors hover:bg-emerald-700 sm:w-auto"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Falar com a Thyná no WhatsApp</span>
                    </a>
                  )}

                  <button
                    onClick={() => {
                      setSelectedService(null);
                      setStep(1);
                    }}
                    className="w-full cursor-pointer rounded-xl bg-zinc-100 px-4 py-3 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-200 sm:w-auto"
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
