import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://outro.supabase.co",
    SUPABASE_SERVER_URL: "",
    LANDING_SUPABASE_PROJECT_REF: "arofhwinueenjvdtnvch",
    LANDING_ORGANIZATION_ID: "56e0f251-8248-409e-8d90-e6cff7232257",
    LANDING_PIPELINE_ID: "a4d190c7-38af-497f-9625-dea2e65ee48a",
    LANDING_STAGE_ID: "f5586240-0bca-48e5-8758-e672bfaaf665",
    LANDING_COMPANY_WHATSAPP: "5561999991234",
  },
  admin: vi.fn(),
  rate: vi.fn(),
  audit: vi.fn(),
}));
vi.mock("@/lib/env", () => ({ env: mocks.env }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: mocks.admin }));
vi.mock("@/lib/audit", () => ({ audit: mocks.audit }));
vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn() } }));
vi.mock("@/lib/ai/dispatcher/rate-limit", () => ({ checkRateLimit: mocks.rate }));
import { submitLeadCapture } from "./lead-capture";
const input = {
  name: "Cliente Teste",
  phone: "61999991234",
  niche: "estetica" as const,
  selectedService: "Avaliação",
};

describe("isolamento da captura pública", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.env.NEXT_PUBLIC_SUPABASE_URL = "https://outro.supabase.co";
    mocks.env.SUPABASE_SERVER_URL = "";
  });
  it("não abre o banco quando o projeto é diferente", async () => {
    expect((await submitLeadCapture(input)).success).toBe(false);
    expect(mocks.admin).not.toHaveBeenCalled();
  });
  it("recusa transporte interno apontando para outro banco", async () => {
    mocks.env.NEXT_PUBLIC_SUPABASE_URL = "https://arofhwinueenjvdtnvch.supabase.co";
    mocks.env.SUPABASE_SERVER_URL = "https://outro.supabase.co";
    expect((await submitLeadCapture(input)).success).toBe(false);
    expect(mocks.admin).not.toHaveBeenCalled();
  });
  it("não anuncia sucesso quando o banco falha", async () => {
    mocks.env.NEXT_PUBLIC_SUPABASE_URL = "https://arofhwinueenjvdtnvch.supabase.co";
    mocks.rate.mockResolvedValue({ allowed: true });
    mocks.admin.mockImplementation(() => {
      throw new Error("database offline");
    });
    const result = await submitLeadCapture(input);
    expect(result.success).toBe(false);
    expect(result).not.toHaveProperty("whatsappUrl");
  });
});
