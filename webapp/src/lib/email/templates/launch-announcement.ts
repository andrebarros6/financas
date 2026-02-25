export function getLaunchAnnouncementEmail(baseUrl: string): { subject: string; html: string } {
  return {
    subject: "O Painel dos Recibos está disponível!",
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
                Chegou o dia!
              </h2>
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                O Painel dos Recibos está agora disponível. Pode começar a usar hoje mesmo.
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                Importe os seus recibos verdes e tenha numa só página tudo o que precisa — rendimento por mês, por cliente, e comparações entre anos.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${baseUrl}"
                   style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                  Aceder ao Painel
                </a>
              </div>

              <!-- Early Adopter Note -->
              <div style="margin: 24px 0; padding: 20px; background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0;">
                <h3 style="margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #166534;">
                  Acesso antecipado
                </h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
                  Como esteve na lista de espera, os primeiros 10 utilizadores a registar-se têm <strong>1 ano de Pro grátis</strong>. Não perca!
                </p>
              </div>

              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                Se tiver alguma questão ou sugestão, responda diretamente a este email.
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
