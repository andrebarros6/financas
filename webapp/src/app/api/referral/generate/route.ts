/**
 * API Route: Generate or return the current user's referral code
 *
 * GET /api/referral/generate
 * Returns: { code: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

function generateCode(): string {
  // 8-char uppercase code using an unambiguous charset (no 0/O/1/I)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const service = createServiceClient();
    const usersTable = service.from("users") as any;

    // Return existing code if already generated
    const { data: profile } = await usersTable
      .select("referral_code")
      .eq("id", user.id)
      .single();

    if (profile?.referral_code) {
      return NextResponse.json({ code: profile.referral_code });
    }

    // Generate a new code, retrying up to 3 times on the rare unique collision
    for (let attempt = 0; attempt < 3; attempt++) {
      const code = generateCode();
      const { error: updateError } = await usersTable
        .update({ referral_code: code })
        .eq("id", user.id);

      if (!updateError) {
        return NextResponse.json({ code });
      }

      // 23505 = unique_violation — try a different code
      if (updateError.code !== "23505") {
        throw updateError;
      }
    }

    return NextResponse.json(
      { error: "Erro ao gerar código de referência" },
      { status: 500 }
    );
  } catch (error) {
    console.error("[referral/generate] error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
