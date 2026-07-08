// Maps route patterns to lazy module import functions.
// Calling import() primes the browser module cache so that
// React.lazy resolves instantly when the user clicks —
// no Suspense spinner because the chunk is already loaded.

const routeLoaders: Record<string, () => Promise<unknown>> = {
  "/faq": () => import("../pages/FaqPage"),
  "/history": () => import("../pages/HistoryTab"),
  "/": () => import("../pages/CurrentRatesTab"),
  "/bank": () => import("../pages/BankDetailPage"),
};

/**
 * Prefetch a route's lazy module chunk on hover/mouseenter.
 *
 * The browser module cache deduplicates import() calls for the same
 * specifier, so calling this early (on hover) and again later (when
 * React.lazy resolves the route) is safe and idempotent.
 */
export const prefetchRoute = (path: string): void => {
  // Exact match first
  if (path in routeLoaders) {
    routeLoaders[path]();
    return;
  }
  // Dynamic /bank/:slug pattern — same module handles all banks
  if (path.startsWith("/bank/")) {
    routeLoaders["/bank"]();
    return;
  }
};
