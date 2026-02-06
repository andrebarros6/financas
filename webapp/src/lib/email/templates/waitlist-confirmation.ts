interface WaitlistEmailParams {
  email: string;
  baseUrl: string;
}

export function getWaitlistConfirmationEmail({ email, baseUrl }: WaitlistEmailParams): { subject: string; html: string } {
  const encodedEmail = encodeURIComponent(email);

  const pollOptions = [
    { id: "rendimento_mensal", label: "Rendimento por mês", emoji: "📊" },
    { id: "rendimento_cliente", label: "Rendimento por cliente", emoji: "👥" },
    { id: "comparacao_anual", label: "Comparação entre anos", emoji: "📈" },
    { id: "previsao_irs", label: "Previsão de IRS a pagar", emoji: "🧮" },
    { id: "exportar_relatorios", label: "Exportar relatórios", emoji: "📄" },
  ];

  const pollButtonsHtml = pollOptions
    .map(
      (opt) => `
        <a href="${baseUrl}/api/vote?email=${encodedEmail}&feature=${opt.id}"
           style="display: block; padding: 12px 16px; margin-bottom: 8px; background-color: #f3f4f6; border-radius: 8px; text-decoration: none; color: #374151; font-size: 15px;">
          ${opt.emoji} ${opt.label}
        </a>
      `
    )
    .join("");

  return {
    subject: "Está na lista de espera do Painel dos Recibos!",
    html: `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: #16a34a; border-radius: 12px; margin-bottom: 16px;">
                <span style="color: #ffffff; font-size: 24px; font-weight: bold;">P</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Painel dos Recibos</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #111827;">
                Obrigado pelo interesse!
              </h2>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                O seu email foi adicionado à nossa lista de espera. Vamos avisá-lo assim que o Painel dos Recibos estiver disponível para testar.
              </p>

              <!-- Poll Section -->
              <div style="margin: 24px 0; padding: 20px; background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0;">
                <h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #166534;">
                  🗳️ Ajude-nos a priorizar!
                </h3>
                <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.5; color: #4b5563;">
                  Qual funcionalidade é mais importante para si? Clique para votar:
                </p>
                ${pollButtonsHtml}
              </div>

              <!-- Reply Request Section -->
              <div style="margin: 24px 0; padding: 20px; background-color: #eff6ff; border-radius: 12px; border: 1px solid #bfdbfe;">
                <h3 style="margin: 0 0 12px; font-size: 16px; font-weight: 600; color: #1e40af;">
                  💬 A sua opinião conta!
                </h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
                  Tem alguma sugestão ou funcionalidade que gostaria de ver no dashboard?
                  <strong>Responda diretamente a este email</strong> — lemos todas as mensagens e a sua opinião ajuda-nos a construir um produto melhor.
                </p>
              </div>

              <p style="margin: 24px 0 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Estamos a trabalhar para criar a melhor forma de visualizar e analisar os seus recibos verdes. Fique atento à sua caixa de entrada!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9fafb; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; text-align: center;">
                © ${new Date().getFullYear()} Painel dos Recibos
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
}
