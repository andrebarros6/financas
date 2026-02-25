/**
 * Shared server-side referral claim logic.
 * Called directly from the auth callback route (no HTTP round-trip needed).
 * Also used by the /api/referral/claim route for direct API access.
 */

import { createServiceClient } from "@/lib/supabase/server";

export async function claimReferral(
  refereeId: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const service = createServiceClient();
  const referralsTable = service.from("referrals") as any;
  const usersTable = service.from("users") as any;

  // Idempotency: if this user already claimed a referral, exit silently
  const { data: existing } = await referralsTable
    .select("id")
    .eq("referee_id", refereeId)
    .maybeSingle();

  if (existing) {
    return { success: true };
  }

  // Look up the referrer by code (case-insensitive via uppercase normalisation)
  const { data: referrer } = await usersTable
    .select("id")
    .eq("referral_code", code.toUpperCase())
    .maybeSingle();

  if (!referrer) {
    return { success: false, error: "code_not_found" };
  }

  // Prevent self-referral
  if (referrer.id === refereeId) {
    return { success: false, error: "self_referral" };
  }

  // Insert referral row
  const { data: referral, error: insertError } = await referralsTable
    .insert({
      referrer_id: referrer.id,
      referee_id: refereeId,
      code_used: code.toUpperCase(),
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError) {
    // Unique violation: race condition — another request already created this row
    if (insertError.code === "23505") {
      return { success: true };
    }
    console.error("[claimReferral] insert error:", insertError);
    return { success: false, error: insertError.message };
  }

  // Grant reward via the SECURITY DEFINER SQL function (atomic + race-safe)
  const { error: rewardError } = await (service as any).rpc(
    "grant_referral_reward",
    { p_referral_id: referral.id }
  );

  if (rewardError) {
    console.error("[claimReferral] reward error:", rewardError);
    return { success: false, error: rewardError.message };
  }

  return { success: true };
}
