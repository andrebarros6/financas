/**
 * notify-waitlist.mjs
 *
 * Sends the launch announcement email to all waitlist entries where
 * notified_at IS NULL, then marks each one as notified.
 *
 * Usage (from the project root):
 *   node scripts/notify-waitlist.mjs
 *
 * Dry-run (no emails sent, no DB updates):
 *   DRY_RUN=1 node scripts/notify-waitlist.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// Load .env.local manually (Next.js env files are not auto-loaded in plain Node)
// ---------------------------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../webapp/.env.local");

function loadEnv(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.error(`Could not read ${filePath} — make sure it exists.`);
    process.exit(1);
  }
}

loadEnv(envPath);

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://paineldosrecibos.barrosbuilds.com";
const FROM_EMAIL = "Painel dos Recibos <paineldosrecibos@barrosbuilds.com>";
const DRY_RUN = process.env.DRY_RUN === "1";

for (const [key, val] of [
  ["NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL],
  ["SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY],
  ["RESEND_API_KEY", RESEND_API_KEY],
]) {
  if (!val) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Email template (inline to avoid TS import issues in plain .mjs)
// ---------------------------------------------------------------------------
function buildEmail(baseUrl) {
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
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #e5e7eb;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: #16a34a; border-radius: 12px; margin-bottom: 16px;">
                <span style="color: #ffffff; font-size: 24px; font-weight: bold;">P</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Painel dos Recibos</h1>
            </td>
          </tr>
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
              <div style="text-align: center; margin: 32px 0;">
                <a href="${baseUrl}"
                   style="display: inline-block; padding: 14px 32px; background-color: #16a34a; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                  Aceder ao Painel
                </a>
              </div>
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

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const resend = new Resend(RESEND_API_KEY);

async function main() {
  console.log(DRY_RUN ? "[DRY RUN] No emails will be sent.\n" : "");

  // 1. Fetch unnotified waitlist entries
  const { data: entries, error } = await supabase
    .from("waitlist")
    .select("id, email")
    .is("notified_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch waitlist:", error.message);
    process.exit(1);
  }

  if (!entries || entries.length === 0) {
    console.log("No unnotified waitlist entries found.");
    return;
  }

  console.log(`Found ${entries.length} unnotified email(s).\n`);

  const { subject, html } = buildEmail(APP_URL);

  let sent = 0;
  let failed = 0;

  for (const entry of entries) {
    process.stdout.write(`  Sending to ${entry.email} ... `);

    if (DRY_RUN) {
      console.log("[skipped]");
      continue;
    }

    try {
      const { error: sendError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: entry.email,
        subject,
        html,
      });

      if (sendError) {
        console.log(`FAILED (${sendError.message})`);
        failed++;
        continue;
      }

      // 2. Mark as notified
      const { error: updateError } = await supabase
        .from("waitlist")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", entry.id);

      if (updateError) {
        console.log(`sent but DB update FAILED (${updateError.message})`);
        failed++;
      } else {
        console.log("ok");
        sent++;
      }
    } catch (err) {
      console.log(`ERROR (${err.message})`);
      failed++;
    }

    // Small delay to stay within Resend rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone. Sent: ${sent} | Failed: ${failed}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
