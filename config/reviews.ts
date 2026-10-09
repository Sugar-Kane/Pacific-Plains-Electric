/**
 * Customer reviews shown on the site.
 *
 * Only add real reviews, copied word for word, from customers who agreed to
 * have them shown (for example, reviews already public on Google). Never edit,
 * combine, or write reviews, and never add rating markup. The reviews section
 * stays hidden while this list is empty.
 */
export type Review = {
  quote: string;
  name: string; // as the customer wants it shown, e.g. "Maria G."
  area?: string; // e.g. "Arroyo Grande"
  service?: string;
  source: "Google" | "Yelp" | "Direct";
  url?: string; // link to the public review, if there is one
};

export const reviews: Review[] = [];
