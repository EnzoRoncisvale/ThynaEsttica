import { z } from "zod";

export const formularioPublicoSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .max(30)
    .transform((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
    })
    .pipe(z.string().regex(/^55[1-9]\d{9,10}$/, "Informe um telefone brasileiro com DDD.")),
  email: z.union([z.email().max(254), z.literal("")]).optional(),
  niche: z.enum(["estetica", "saude"]),
  selectedService: z.string().trim().min(1).max(180),
  preferredDay: z.string().trim().max(60).optional(),
  preferredTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional(),
  notes: z.string().trim().max(2000).optional(),
});
