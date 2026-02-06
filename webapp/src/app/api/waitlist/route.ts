import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM_EMAIL } from "@/lib/email/resend";
import { getWaitlistConfirmationEmail } from "@/lib/email/templates/waitlist-confirmation";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Use admin client to bypass RLS for public waitlist
    const supabase = createAdminClient();

    // Insert into waitlist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("waitlist").insert({ email });

    if (error) {
      // Handle duplicate email
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Este email já está na lista de espera" },
          { status: 409 }
        );
      }
      console.error("Waitlist insert error:", error);
      return NextResponse.json(
        { error: "Erro ao registar email" },
        { status: 500 }
      );
    }

    // Send confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const { subject, html } = getWaitlistConfirmationEmail({ email, baseUrl });
    const { error: emailError } = await getResend().emails.send({
      from: FROM_EMAIL,
      replyTo: "paineldosrecibos@barrosbuilds.com",
      to: email,
      subject,
      html,
    });

    if (emailError) {
      // Log but don't fail - the user is already on the waitlist
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Waitlist error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
