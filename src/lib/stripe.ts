/**
 * Stripe server-side singleton.
 *
 * Usage (in API routes or server components):
 *   import { getStripe } from "@/lib/stripe";
 *   const stripe = getStripe();
 *   const session = await stripe.checkout.sessions.create({ ... });
 *
 * Requires: npm install stripe
 */
import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
    if (!stripeInstance) {
        const key = process.env.STRIPE_SECRET_KEY;
        if (!key) {
            throw new Error("Missing STRIPE_SECRET_KEY environment variable");
        }
        stripeInstance = new Stripe(key, {
            apiVersion: "2026-01-28.clover",
            typescript: true,
        });
    }
    return stripeInstance;
}
