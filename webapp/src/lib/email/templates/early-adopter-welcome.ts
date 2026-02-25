export function getEarlyAdopterWelcomeEmail(baseUrl: string): { subject: string; html: string } {
  return {
    subject: "Bem-vindo ao Painel dos Recibos — tem 1 ano de Pro grátis!",
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
                Bem-vindo a bordo!
              </h2>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                A sua conta está ativa. Como um dos primeiros utilizadores do Painel dos Recibos, ativamos automaticamente <strong>1 ano de acesso Pro gratuito</strong> na sua conta.
              </p>

              <!-- Early Adopter Highlight -->
              <div style="margin: 24px 0; padding: 20px; background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0;">
                <h3 style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #166534;">
                  Acesso antecipado ativado
                </h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
                  Tem acesso completo a todas as funcionalidades Pro durante 1 ano, sem precisar de cartão de crédito.
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${baseUrl}/dashboard"
                   style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                  Ir para o Painel
                </a>
              </div>

              <!-- Feedback request -->
              <div style="margin: 24px 0; padding: 20px; background-color: #eff6ff; border-radius: 12px; border: 1px solid #bfdbfe;">
                <h3 style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #1e40af;">
                  A sua opinião conta
                </h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
                  Em troca, gostaríamos de receber o seu feedback. Se encontrar algum problema ou tiver sugestões, responda diretamente a este email.
                </p>
              </div>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Obrigado por fazer parte do início deste projeto.
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
