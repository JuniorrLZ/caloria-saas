/**
 * Returns the base URL for the application.
 *
 * Priority:
 * 1. NEXT_PUBLIC_BASE_URL — set manually in Vercel env vars (e.g. https://myapp.com)
 * 2. VERCEL_URL — auto-injected by Vercel (no protocol, e.g. myapp.vercel.app)
 * 3. localhost fallback for local development
 */
export function getBaseUrl(): string {
    // Explicitly set base URL (recommended for production)
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
    }

    // Vercel auto-injected URL (preview/production deployments)
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Local development fallback
    return `http://localhost:${process.env.PORT ?? 3000}`;
}
