/**
 * API Route: Account Management
 *
 * DELETE /api/account - Deletes the authenticated user's account and all associated data
 */

import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function DELETE() {
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

    // Fetch profile to check for active Stripe subscription
    const { data: profile } = await usersTable
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("id", user.id)
      .single();

    // Cancel active Stripe subscription immediately if present
    if (profile?.stripe_subscription_id) {
      try {
        const stripe = getStripe();
        await stripe.subscriptions.cancel(profile.stripe_subscription_id);
      } catch (stripeError) {
        console.error("Stripe cancellation error:", stripeError);
        // Non-fatal: proceed with account deletion even if Stripe cancel fails
      }
    }

    // Delete user data (receipts are deleted via CASCADE or explicitly)
    const receiptsTable = serviceSupabase.from("receipts") as any;
    await receiptsTable.delete().eq("user_id", user.id);

    // Delete user profile row
    await usersTable.delete().eq("id", user.id);

    // Delete the auth user (requires service role)
    const { error: deleteAuthError } =
      await serviceSupabase.auth.admin.deleteUser(user.id);

    if (deleteAuthError) {
      console.error("Auth user deletion error:", deleteAuthError);
      return NextResponse.json(
        { error: "Erro ao eliminar conta de autenticação" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Erro ao eliminar conta" },
      { status: 500 }
    );
  }
}
