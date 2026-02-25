/**
 * API Route: Claim a referral code
 *
 * POST /api/referral/claim
 * Body: { code: string }
 * Returns: { success: boolean }
 *
 * Note: The primary claim path goes through the callback route directly
 * (importing claimReferral from @/lib/referrals/claim). This route exists
 * as a fallback for clients that need to claim via HTTP.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { claimReferral } from "@/lib/referrals/claim";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const code = body?.code;

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return NextResponse.json(
        { error: "Código de referência inválido" },
        { status: 400 }
      );
    }

    const result = await claimReferral(user.id, code.trim());

    if (!result.success) {
      if (result.error === "code_not_found") {
        return NextResponse.json(
          { error: "Código não encontrado" },
          { status: 404 }
        );
      }
      if (result.error === "self_referral") {
        return NextResponse.json(
          { error: "Não pode usar o seu próprio código" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Erro ao processar referência" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[referral/claim] error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
