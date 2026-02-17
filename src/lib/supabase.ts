/**
 * Supabase client-side singleton.
 *
 * Usage:
 *   import { getSupabase } from "@/lib/supabase";
 *   const supabase = getSupabase();
 *   const { data } = await supabase.from("profiles").select("*");
 *
 * Requires: npm install @supabase/supabase-js
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
    if (!supabaseInstance) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
            throw new Error(
                "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables"
            );
        }

        supabaseInstance = createClient(url, key);
    }
    return supabaseInstance;
}
