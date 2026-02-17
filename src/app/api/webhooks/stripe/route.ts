/**
 * Stripe Webhook Handler
 *
 * POST /api/webhooks/stripe
 *
 * This route receives Stripe webhook events and verifies them using the
 * webhook signing secret. Raw body parsing is handled by Next.js App Router —
 * we read the raw body via request.text().
 *
 * In production (Vercel), register this URL in the Stripe Dashboard:
 *   https://<YOUR_DOMAIN>/api/webhooks/stripe
 *
 * Events you should enable:
 *   - checkout.session.completed
 *   - customer.subscription.created
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 *   - invoice.payment_succeeded
 *   - invoice.payment_failed
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
        return NextResponse.json(
            { error: "Webhook secret not configured" },
            { status: 500 }
        );
    }

    // 1. Read the raw body as text (required for signature verification)
    const body = await request.text();

    // 2. Retrieve the Stripe signature header
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing stripe-signature header" },
            { status: 400 }
        );
    }

    // 3. Verify + construct the event
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(`⚠️  Webhook signature verification failed: ${message}`);
        return NextResponse.json(
            { error: `Webhook Error: ${message}` },
            { status: 400 }
        );
    }

    // 4. Handle the event
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log(`✅ Checkout completed: ${session.id}`);
                // TODO: Provision access, update Supabase user profile, etc.
                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(
                    `📦 Subscription ${event.type}: ${subscription.id} — status: ${subscription.status}`
                );
                // TODO: Sync subscription status to Supabase
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                console.log(`🗑️ Subscription canceled: ${subscription.id}`);
                // TODO: Revoke access in Supabase
                break;
            }

            case "invoice.payment_succeeded": {
                const invoice = event.data.object as Stripe.Invoice;
                console.log(`💰 Payment succeeded: ${invoice.id}`);
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                console.log(`❌ Payment failed: ${invoice.id}`);
                // TODO: Notify user, update status in Supabase
                break;
            }

            default:
                console.log(`🔔 Unhandled event type: ${event.type}`);
        }
    } catch (err) {
        console.error(`Error processing webhook event ${event.type}:`, err);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }

    // 5. Return a 200 response to acknowledge receipt
    return NextResponse.json({ received: true });
}
