import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { getEarlyAdopterWelcomeEmail } from "@/lib/email/templates/early-adopter-welcome";

const FROM_EMAIL = "Painel dos Recibos <paineldosrecibos@barrosbuilds.com>";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Read referral code from cookie (set on signup page when ?ref= was present)
      const cookieHeader = request.headers.get("cookie") ?? "";
      const refMatch = cookieHeader.match(/(?:^|;\s*)ref_code=([^;]+)/);
      const refCode = refMatch ? decodeURIComponent(refMatch[1]) : null;

      const response = NextResponse.redirect(`${origin}${next}`);

      if (refCode) {
        // Clear the referral cookie immediately on the outgoing response
        response.cookies.set("ref_code", "", { maxAge: 0, path: "/" });

        // Get the newly-created session to obtain the user ID.
        // Using getSession() (not getUser()) to avoid the known dev hang.
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (userId) {
          // Fire-and-forget: do not block the redirect on referral processing.
          // Failures are logged but do not affect the user's login flow.
          import("@/lib/referrals/claim")
            .then(({ claimReferral }) =>
              claimReferral(userId, refCode).catch((err) =>
                console.error("[callback] referral claim failed:", err)
              )
            )
            .catch((err) =>
              console.error("[callback] referral import failed:", err)
            );
        }
      }

      // Send early adopter welcome email if this user got free Pro on signup.
      // Fire-and-forget — do not block the redirect.
      const {
        data: { session: welcomeSession },
      } = await supabase.auth.getSession();
      const newUserId = welcomeSession?.user?.id;
      const newUserEmail = welcomeSession?.user?.email;

      if (newUserId && newUserEmail) {
        const adminSupabase = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { persistSession: false } }
        );

        Promise.resolve(
          adminSupabase
            .from("users")
            .select("subscription_tier, subscription_expires_at, created_at")
            .eq("id", newUserId)
            .single()
        ).then(({ data: userRow }) => {
            if (!userRow) return;

            // Only send if: they have Pro, it expires (not lifetime), and the
            // account was just created (within the last 5 minutes — i.e. this
            // is the email confirmation callback, not a subsequent login).
            const createdAt = new Date(userRow.created_at);
            const isNewAccount = Date.now() - createdAt.getTime() < 5 * 60 * 1000;

            if (
              userRow.subscription_tier === "pro" &&
              userRow.subscription_expires_at &&
              isNewAccount
            ) {
              const resend = new Resend(process.env.RESEND_API_KEY!);
              const { subject, html } = getEarlyAdopterWelcomeEmail(origin);
              resend.emails
                .send({ from: FROM_EMAIL, to: newUserEmail, subject, html })
                .catch((err) =>
                  console.error("[callback] early adopter email failed:", err)
                );
            }
          })
          .catch((err) =>
            console.error("[callback] early adopter check failed:", err)
          );
      }

      return response;
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
