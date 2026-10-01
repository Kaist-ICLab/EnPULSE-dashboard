/**
 * Set NEXT_PUBLIC_DEMO_MODE=true for public demos (e.g. a conference booth) to hide
 * destructive actions such as removing a campaign. NEXT_PUBLIC_ values are inlined
 * at build time, so rebuild after changing it.
 */
export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
