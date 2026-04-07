import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { PRICING } from "@/lib/constants";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, gigId } = body as { type: "featured_gig" | "premium_profile"; gigId?: string };

  if (type === "featured_gig" && !gigId) {
    return NextResponse.json({ error: "gigId is required for featured gig" }, { status: 400 });
  }

  // Get or create Stripe customer
  const { data: dbUser } = await supabase
    .from("users")
    .select("stripe_customer_id, email, full_name")
    .eq("id", user.id)
    .single();

  let customerId = dbUser?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: dbUser?.email || user.email,
      name: dbUser?.full_name || undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);
  }

  const pricing = type === "featured_gig" ? PRICING.FEATURED_GIG : PRICING.PREMIUM_PROFILE;

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: pricing.amount,
          product_data: {
            name: type === "featured_gig" ? "Featured Gig Listing" : "Premium Musician Profile",
            description: pricing.description,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type,
      user_id: user.id,
      ...(gigId && { gig_id: gigId }),
    },
    success_url: `${new URL(request.url).origin}${
      type === "featured_gig" ? `/gigs/${gigId}?upgraded=featured` : "/profile?upgraded=premium"
    }`,
    cancel_url: `${new URL(request.url).origin}${
      type === "featured_gig" ? `/gigs/${gigId}` : "/profile"
    }`,
  });

  return NextResponse.json({ url: session.url });
}
