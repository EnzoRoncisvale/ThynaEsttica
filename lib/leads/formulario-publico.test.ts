import { describe, expect, it } from "vitest";
import { formularioPublicoSchema } from "./formulario-publico";

const input = {
  name: "Cliente Teste",
  phone: "(55) 99999-1234",
  niche: "estetica",
  selectedService: "Avaliação",
};

describe("formulário público", () => {
  it("acrescenta o país mesmo quando o DDD é 55", () => {
    expect(formularioPublicoSchema.parse(input).phone).toBe("5555999991234");
  });
  it("preserva o país de um telefone internacional", () => {
    expect(formularioPublicoSchema.parse({ ...input, phone: "+55 61 99999-1234" }).phone).toBe(
      "5561999991234",
    );
  });
  it.each([
    { phone: "123" },
    { name: " " },
    { email: "invalido" },
    { preferredTime: "25:70" },
    { notes: "a".repeat(2001) },
    { niche: "outro" },
  ])("recusa dados inválidos: %o", (change) => {
    expect(formularioPublicoSchema.safeParse({ ...input, ...change }).success).toBe(false);
  });
});
