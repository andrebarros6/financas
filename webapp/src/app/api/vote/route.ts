import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Poll options - the features users can vote for
export const POLL_OPTIONS = [
  { id: "rendimento_mensal", label: "Rendimento por mês" },
  { id: "rendimento_cliente", label: "Rendimento por cliente" },
  { id: "comparacao_anual", label: "Comparação entre anos" },
  { id: "previsao_irs", label: "Previsão de IRS a pagar" },
  { id: "exportar_relatorios", label: "Exportar relatórios" },
] as const;

export type PollOptionId = (typeof POLL_OPTIONS)[number]["id"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const feature = searchParams.get("feature");

  // Validate params
  if (!email || !feature) {
    return new NextResponse(
      renderVotePage("Parâmetros em falta", "error"),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Validate feature is a valid option
  const validFeature = POLL_OPTIONS.find((opt) => opt.id === feature);
  if (!validFeature) {
    return new NextResponse(
      renderVotePage("Opção inválida", "error"),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  try {
    const supabase = createAdminClient();

    // Find waitlist entry by email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: waitlistEntry, error: findError } = await (supabase as any)
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .single();

    if (findError || !waitlistEntry) {
      return new NextResponse(
        renderVotePage("Email não encontrado na lista de espera", "error"),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // Record the vote
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: voteError } = await (supabase as any)
      .from("waitlist_votes")
      .insert({
        waitlist_id: waitlistEntry.id,
        feature: feature,
      });

    if (voteError) {
      // Duplicate vote
      if (voteError.code === "23505") {
        return new NextResponse(
          renderVotePage(`Já votou em "${validFeature.label}"! Obrigado pelo seu interesse.`, "already_voted"),
          { headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }
      console.error("Vote error:", voteError);
      return new NextResponse(
        renderVotePage("Erro ao registar voto", "error"),
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    return new NextResponse(
      renderVotePage(`Voto registado: "${validFeature.label}". Obrigado!`, "success"),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (err) {
    console.error("Vote error:", err);
    return new NextResponse(
      renderVotePage("Erro interno", "error"),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

function renderVotePage(message: string, status: "success" | "error" | "already_voted"): string {
  const bgColor = status === "success" ? "#dcfce7" : status === "already_voted" ? "#fef3c7" : "#fee2e2";
  const textColor = status === "success" ? "#166534" : status === "already_voted" ? "#92400e" : "#991b1b";
  const icon = status === "success" ? "✓" : status === "already_voted" ? "ℹ" : "✗";

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Painel dos Recibos - Voto</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom, #ffffff, #f9fafb);
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      padding: 40px;
      max-width: 400px;
      text-align: center;
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 28px;
      background: ${bgColor};
      color: ${textColor};
    }
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 24px;
    }
    .logo-icon {
      width: 32px;
      height: 32px;
      background: #16a34a;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
    }
    .message {
      font-size: 18px;
      color: #374151;
      line-height: 1.6;
    }
    .back-link {
      display: inline-block;
      margin-top: 24px;
      color: #16a34a;
      text-decoration: none;
      font-weight: 500;
    }
    .back-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <div class="logo-icon">P</div>
      <span class="logo-text">Painel dos Recibos</span>
    </div>
    <div class="icon">${icon}</div>
    <p class="message">${message}</p>
    <a href="/" class="back-link">← Voltar à página inicial</a>
  </div>
</body>
</html>
  `.trim();
}
