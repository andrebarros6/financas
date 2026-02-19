/**
 * API Route: Create Stripe Customer Portal Session
 *
 * POST /api/billing-portal
 * Returns: { url: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

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

    const serviceSupabase = createServiceClient();
    const usersTable = serviceSupabase.from("users") as any;
    const { data: profile } = await usersTable
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    const customerId = profile?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { error: "Nenhuma subscrição encontrada" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Billing portal error:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Erro ao abrir portal de pagamento: ${message}` },
      { status: 500 }
    );
  }
}
