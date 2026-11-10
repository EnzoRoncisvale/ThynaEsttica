"use client";
import Link from "next/link";

import { ArrowCircleUp } from "@/lib/ui/icons";
import { useT } from "@/hooks/i18n/useT";
import { useSystemVersion } from "@/hooks/system/useSystemVersion";
import { cn } from "@/lib/utils";

/**
 * Controle essencial da instalação: não é removível pela interface do vínculo.
 * Versão instalada no rodapé da sidebar. Vira um aviso clicável só para quem
 * é dono do servidor E tem versão nova — quem não pode atualizar não é
 * alertado sobre algo que não pode resolver.
 */
export function VersionFooter({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  /** Fecha a gaveta do mobile — é o único Link do drawer que não a recebia. */
  onNavigate?: () => void;
}) {
  const t = useT();
  const { data } = useSystemVersion();
  if (!data) return null;

  const label = data.current_version.replace(/^v/i, "");
  const personalizada = data.identity?.customized === true;
  const titulo = label
    ? `${t("Versão")} ${label}${personalizada ? ` · ${t("Personalizada")}` : ""}`
    : t("Versão ainda não confirmada");
  // Só acende quando existe versão nova de verdade. `off_release` sozinho não
  // conta: uma instalação de desenvolvimento sem versão publicada mais nova
  // ficava com o ponto pulsando pra sempre, e o texto "Nova versão · " com o
  // número vazio, apontando para uma tela que não tem o que oferecer.
  const alerta = data.is_owner && data.update_available;

  const instalada = (
    <p
      className={cn("px-3 py-1 text-[11px] text-muted-foreground", collapsed && "px-0 text-center")}
      title={titulo}
    >
      {collapsed && label ? label.split(".").slice(0, 2).join(".") : titulo}
      {data.identity && data.identity.status !== "confirmed" && (
        <span className="block text-[10px]">{t("Execução não confirmada")}</span>
      )}
    </p>
  );
  return instalada;
}
