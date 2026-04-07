import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRICING } from "@/lib/constants";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { type, user_id, gig_id } = session.metadata || {};

    if (!user_id || !type) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const supabase = createAdminClient();

    if (type === "featured_gig" && gig_id) {
      const featuredUntil = new Date();
      featuredUntil.setDate(featuredUntil.getDate() + PRICING.FEATURED_GIG.duration_days);

      await supabase
        .from("gigs")
        .update({
          is_featured: true,
          featured_until: featuredUntil.toISOString(),
        })
        .eq("id", gig_id);
    } else if (type === "premium_profile") {
      const premiumUntil = new Date();
      premiumUntil.setDate(premiumUntil.getDate() + PRICING.PREMIUM_PROFILE.duration_days);

      await supabase
        .from("users")
        .update({
          is_premium: true,
          premium_until: premiumUntil.toISOString(),
        })
        .eq("id", user_id);
    }
  }

  return NextResponse.json({ received: true });
}
