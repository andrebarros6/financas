/**
 * API Route: Stripe Webhook Handler
 *
 * POST /api/webhooks/stripe
 * Receives Stripe webhook events and updates user subscriptions in the database.
 * Validates requests via Stripe webhook signature (no auth middleware).
 */

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    console.log(`[Webhook] Processing ${event.type}`);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[Webhook] checkout.session.completed — subscription: ${session.subscription}, customer: ${session.customer}`);
        await handleCheckoutCompleted(session, supabase, stripe);
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const interval = sub.items.data[0]?.price?.recurring?.interval;
        console.log(`[Webhook] subscription.updated — id: ${sub.id}, status: ${sub.status}, interval: ${interval}`);
        await handleSubscriptionUpdated(sub, supabase);
        break;
      }
      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;
      }
      case "invoice.payment_failed": {
        handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`Error handling ${event.type}:`, error);
  }

  return NextResponse.json({ received: true });
}

type ServiceClient = ReturnType<typeof createServiceClient>;

async function findUserByCustomerId(
  customerId: string,
  supabase: ServiceClient
): Promise<string | undefined> {
  const usersTable = supabase.from("users") as any;
  const { data } = await usersTable
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  return data?.id ?? undefined;
}

async function findUserBySubscriptionId(
  subscriptionId: string,
  supabase: ServiceClient
): Promise<string | undefined> {
  const usersTable = supabase.from("users") as any;
  const { data } = await usersTable
    .select("id")
    .eq("stripe_subscription_id", subscriptionId)
    .single();
  return data?.id ?? undefined;
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: ServiceClient,
  stripe: Stripe
) {
  if (session.mode !== "subscription" || !session.subscription) return;

  let userId = session.metadata?.supabase_user_id;

  if (!userId) {
    userId = await findUserByCustomerId(session.customer as string, supabase);
  }

  if (!userId) {
    console.error("No user found for checkout session:", session.id);
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );

  const interval = subscription.items.data[0]?.price?.recurring?.interval;
  const periodEnd = new Date(
    subscription.current_period_end * 1000
  ).toISOString();
  const mappedInterval = interval === "year" ? "annual" : "monthly";

  console.log(`[Webhook] handleCheckoutCompleted — userId: ${userId}, stripe interval: ${interval}, mapped: ${mappedInterval}, sub: ${subscription.id}`);

  const usersTable = supabase.from("users") as any;
  const { error: updateError } = await usersTable
    .update({
      subscription_tier: "pro",
      subscription_interval: mappedInterval,
      subscription_expires_at: periodEnd,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("[Webhook] handleCheckoutCompleted update failed:", updateError);
  } else {
    console.log("[Webhook] handleCheckoutCompleted update SUCCESS");
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: ServiceClient
) {
  let userId: string | undefined =
    subscription.metadata?.supabase_user_id || undefined;

  if (!userId) {
    userId = await findUserBySubscriptionId(subscription.id, supabase);
  }

  if (!userId) {
    console.error("No user found for subscription:", subscription.id);
    return;
  }

  const interval = subscription.items.data[0]?.price?.recurring?.interval;
  const periodEnd = new Date(
    subscription.current_period_end * 1000
  ).toISOString();

  const status = subscription.status;
  const usersTable = supabase.from("users") as any;

  if (status === "active" || status === "trialing") {
    await usersTable
      .update({
        subscription_tier: "pro",
        subscription_interval: interval === "year" ? "annual" : "monthly",
        subscription_expires_at: periodEnd,
      })
      .eq("id", userId);
  } else if (status === "canceled" || status === "incomplete_expired") {
    await usersTable
      .update({
        subscription_tier: "free",
        subscription_interval: null,
        stripe_subscription_id: null,
      })
      .eq("id", userId);
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: ServiceClient
) {
  const userId = await findUserBySubscriptionId(subscription.id, supabase);

  if (!userId) {
    console.error("No user found for deleted subscription:", subscription.id);
    return;
  }

  const usersTable = supabase.from("users") as any;
  await usersTable
    .update({
      subscription_tier: "free",
      subscription_interval: null,
      subscription_expires_at: null,
      stripe_subscription_id: null,
    })
    .eq("id", userId);
}

function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  console.warn(
    `Payment failed for customer ${customerId}, invoice ${invoice.id}. ` +
      `Stripe will retry automatically.`
  );
}
