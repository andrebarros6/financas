import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return stripeClient;
}

export function getStripePrices(): { monthly: string; annual: string } {
  const monthly = process.env.STRIPE_PRICE_MONTHLY;
  const annual = process.env.STRIPE_PRICE_ANNUAL;

  if (!monthly || !annual) {
    throw new Error(
      "Missing STRIPE_PRICE_MONTHLY or STRIPE_PRICE_ANNUAL environment variables"
    );
  }

  return { monthly, annual };
}

export type BillingInterval = "monthly" | "annual";
