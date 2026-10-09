/**
 * The single source of truth for who Pacific Plains Electric is.
 * Pages, structured data, llms.txt, and the footer all read from here,
 * so the business name, phone, and service area stay identical everywhere.
 *
 * Never fill a TODO with a guess. A `null` value is simply left off the site
 * and out of the structured data until the owner confirms it.
 */
export const business = {
  name: "Pacific Plains Electric",
  /** Plain factual description used in schema, llms.txt, and the About page. */
  description:
    "Pacific Plains Electric is a licensed electrical contractor providing residential and commercial electrical services throughout San Luis Obispo County, California.",
  category: "Electrician",
  owner: "Nicholas Kane",
  license: "CSLB #1162180",
  licenseNumber: "1162180",
  // TODO(owner): confirm the license classification (for example C-10
  // Electrical) as shown on the CSLB license lookup before adding it here.
  licenseClassification: null as string | null,
  workPhone: {
    display: "(805) 626-7761",
    tel: "tel:+18056267761",
    sms: "sms:+18056267761",
    e164: "+18056267761",
    raw: "8056267761",
    aiAnswered: true,
  },
  email: "nick@pacificplainselectric.com",
  timezone: "America/Los_Angeles",
  hours: {
    start: "07:00",
    end: "17:00",
    display: "7:00 AM – 5:00 PM Pacific",
    // TODO(owner): which days are these hours? e.g. ["Monday", …, "Friday"].
    // Until set, hours are shown without days and left out of schema.
    days: null as string[] | null,
  },
  diagnosticPrice: 180,
  diagnosticFeeAppliedToWork: false,
  schedulingEnabled: false,
  // TODO(owner): set true only if the business carries liability insurance
  // and wants it advertised.
  insured: false,
  // TODO(owner): bonded status (CSLB license bond) if you want it shown.
  bonded: null as boolean | null,
  // TODO(owner): accepted payment methods, e.g. ["Credit card", "Check"].
  paymentMethods: null as string[] | null,
  serviceArea: "San Luis Obispo County, California",
  county: "San Luis Obispo County",
  state: "California",
  siteUrl: "https://www.pacificplainselectric.com",
  logoPng: "/brand/logo-512.png",
  ogImage: "/images/og-default.jpg",
  /**
   * Public profiles that represent this exact business (schema `sameAs`).
   * TODO(owner): add the Google Business Profile, Yelp, Facebook, Nextdoor,
   * BBB, and Angi URLs once they exist and list the business as an electrician.
   */
  sameAs: [] as string[],
  // TODO(owner): Google "write a review" link from Google Business Profile
  // (Ask for reviews → share link). The site shows a review button only when set.
  googleReviewUrl: null as string | null,
} as const;

/** The one place the diagnostic terms are worded. Reuse it; don't restate it. */
export const diagnosticTerms =
  "Repairs and project work are quoted separately. The diagnostic fee is not automatically credited toward repairs.";
export const smsDisclosure =
  "I agree to receive transactional text messages from Pacific Plains Electric about my service request and appointment. Consent is optional and is not a condition of service. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.";
export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
