export const business = {
  name: "Pacific Plains Electric",
  owner: "Nicholas Kane",
  license: "CSLB #1162180",
  workPhone: {
    display: "(805) 626-7761",
    tel: "tel:+18056267761",
    sms: "sms:+18056267761",
    raw: "8056267761",
    aiAnswered: true,
  },
  directPhone: { display: "(209) 626-9313", tel: "tel:+12096269313" },
  email: "nick@pacificplainselectric.com",
  timezone: "America/Los_Angeles",
  hours: { start: "07:00", end: "17:00", display: "7:00 AM – 5:00 PM Pacific" },
  diagnosticPrice: 180,
  diagnosticFeeAppliedToWork: false,
  schedulingEnabled: false,
  insured: false,
  serviceArea: "San Luis Obispo County, California",
  siteUrl: "https://www.pacificplainselectric.com",
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
