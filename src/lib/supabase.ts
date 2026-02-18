/**
 * Re-export the Supabase browser client for backward compatibility.
 *
 * New code should import directly from "@/lib/supabaseClient".
 */
import { createClient } from "./supabaseClient";

export function getSupabase() {
    return createClient();
}
