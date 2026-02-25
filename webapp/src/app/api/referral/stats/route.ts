/**
 * API Route: Get the current user's referral stats
 *
 * GET /api/referral/stats
 * Returns: { count: number, monthsEarned: number }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

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
    const referralsTable = service.from("referrals") as any;
    const { count, error } = await referralsTable
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .eq("status", "rewarded");

    if (error) {
      console.error("[referral/stats] query error:", error);
      return NextResponse.json(
        { error: "Erro ao obter estatísticas" },
        { status: 500 }
      );
    }

    const rewarded = count ?? 0;

    return NextResponse.json({
      count: rewarded,
      monthsEarned: rewarded, // 1 referral = 1 month
    });
  } catch (error) {
    console.error("[referral/stats] error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
