export type LeadInput = { name: string; whatsapp: string; city: string; monthlyRevenue: number; monthlyOrders: number; averageTicket: number; consent: boolean; honeypot?: string };
export type DiagnosticItem = { title: string; label: string; detail: string; action: string; tone: "attention" | "growth" | "positive" };
export type DiagnosticResult = { estimatedTicket: number; consistencyGap: number; headline: string; summary: string; items: DiagnosticItem[]; scoreLabel: string };

export const DIAGNOSTIC_THRESHOLDS = { lowTicket: 35, lowOrders: 300, consistencyTolerance: 0.2 };
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
export function formatCurrency(value: number) { return currency.format(value); }
export function normalizeNumber(value: string | number) { if (typeof value === "number") return Number.isFinite(value) ? value : 0; return Number(value.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")) || 0; }

export function calculateDiagnostic(input: Pick<LeadInput, "monthlyRevenue" | "monthlyOrders" | "averageTicket">): DiagnosticResult {
  const estimatedTicket = input.monthlyOrders > 0 ? input.monthlyRevenue / input.monthlyOrders : 0;
  const consistencyGap = input.averageTicket > 0 ? Math.abs(estimatedTicket - input.averageTicket) / input.averageTicket : 1;
  const items: DiagnosticItem[] = [];
  if (input.averageTicket < DIAGNOSTIC_THRESHOLDS.lowTicket) items.push({ title: "Seu ticket médio está apertado", label: "Ticket médio", detail: `Hoje você informou ${formatCurrency(input.averageTicket)} por pedido. Cada pedido precisa carregar mais margem para o crescimento não depender só de volume.`, action: "Trabalhar combos, adicionais e uma escada de preços que aumente o valor por pedido.", tone: "attention" });
  if (input.monthlyOrders < DIAGNOSTIC_THRESHOLDS.lowOrders) items.push({ title: "Existe espaço para gerar mais pedidos", label: "Volume de pedidos", detail: `Com ${input.monthlyOrders.toLocaleString("pt-BR")} pedidos/mês, o delivery ainda pode ganhar previsibilidade e recorrência.`, action: "Ajustar oferta, conversão do cardápio e campanhas para trazer o cliente de volta.", tone: "growth" });
  if (consistencyGap > DIAGNOSTIC_THRESHOLDS.consistencyTolerance) items.push({ title: "Seus números merecem uma conferência", label: "Previsibilidade", detail: `Pelos dados informados, o ticket calculado seria ${formatCurrency(estimatedTicket)}. Essa diferença pode esconder um gargalo de medição ou margem.`, action: "Separar faturamento, pedidos e ticket por período para tomar decisões com a mesma base.", tone: "attention" });
  const trimmedItems = items.slice(0, 2);
  if (trimmedItems.length === 0) trimmedItems.push({ title: "Sua base parece pronta para escalar", label: "Próximo nível", detail: `Com ${input.monthlyOrders.toLocaleString("pt-BR")} pedidos/mês e ticket informado de ${formatCurrency(input.averageTicket)}, o foco agora é crescer sem perder margem.`, action: "Otimizar campanhas, operação e recompra para transformar crescimento em lucro.", tone: "positive" });
  return { estimatedTicket, consistencyGap, headline: trimmedItems[0].title, summary: `Seu cenário indica ${trimmedItems.length === 1 ? "um ponto principal" : "dois pontos principais"} para destravar o próximo nível do delivery.`, items: trimmedItems, scoreLabel: input.monthlyOrders >= DIAGNOSTIC_THRESHOLDS.lowOrders && input.averageTicket >= DIAGNOSTIC_THRESHOLDS.lowTicket ? "Base com potencial de escala" : "Oportunidade clara de otimização" };
}

export function validateLead(input: LeadInput) { const errors: Partial<Record<keyof LeadInput, string>> = {}; if (input.name.trim().length < 2) errors.name = "Digite seu nome."; if (input.whatsapp.replace(/\D/g, "").length < 10) errors.whatsapp = "Digite um WhatsApp válido."; if (input.city.trim().length < 2) errors.city = "Digite sua cidade."; if (input.monthlyRevenue <= 0) errors.monthlyRevenue = "Informe seu faturamento."; if (input.monthlyOrders <= 0) errors.monthlyOrders = "Informe seus pedidos."; if (input.averageTicket <= 0) errors.averageTicket = "Informe seu ticket médio."; if (!input.consent) errors.consent = "Autorize o contato para receber a consultoria."; return errors; }
