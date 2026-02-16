/**
 * API Route: Create Stripe Checkout Session
 *
 * POST /api/checkout
 * Body: { interval: "monthly" | "annual" }
 * Returns: { url: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getStripe, getStripePrices, type BillingInterval } from "@/lib/stripe";

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
    const interval: BillingInterval = body.interval;

    if (interval !== "monthly" && interval !== "annual") {
      return NextResponse.json(
        { error: "Intervalo inválido. Use 'monthly' ou 'annual'." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const prices = getStripePrices();
    const priceId = interval === "monthly" ? prices.monthly : prices.annual;

    const serviceSupabase = createServiceClient();
    const usersTable = serviceSupabase.from("users") as any;

    const { data: profile } = await usersTable
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? profile?.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      await usersTable
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/settings?checkout=success`,
      cancel_url: `${origin}/dashboard/settings?checkout=cancelled`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento" },
      { status: 500 }
    );
  }
}
