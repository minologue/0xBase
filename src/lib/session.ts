import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";

/**
 * Returns the current session, deduplicating the DB lookup within a single
 * render pass via React.cache. All server components call this instead of
 * auth.api.getSession() directly, so a /profile page load triggers one DB
 * query even though AuthGuard, Nav, and the page itself all need the session.
 */
export const getCachedSession = cache(async () => {
	return auth.api.getSession({ headers: await headers() });
});
