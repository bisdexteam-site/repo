/**
 * Site settings that may change, kept in one place.
 */

/**
 * Canonical address of the site, used for canonical URLs, citations and the
 * sitemap. The `.invalid` address is a placeholder: replace it with the
 * Worker's address.
 */
export const SITE_URL = "https://site-address-placeholder.invalid";

/** Google Form where reviewers submit reviews. */
export const REVIEW_FORM_URL = "https://forms.gle/JkQis9eyVQNvtebw9";

/** Public contact address. */
export const CONTACT_EMAIL = "bisdex.team@gmail.com";

/**
 * When false, every page carries a noindex robots meta tag and robots.txt
 * blocks all crawlers.
 */
export const allowIndexing = false;

/** Cloudflare Web Analytics beacon token. The beacon is omitted when empty. */
export const ANALYTICS_TOKEN = "";
