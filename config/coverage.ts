/** Coverage authorized for both entire counties on 2026-10-11.
 * Sources and limitations: docs/ZIP-COVERAGE.md. ZIPs are not exact county boundaries.
 */
export const countyZips = {
  "San Luis Obispo": [
    "93252",
    "93254",
    "93401",
    "93402",
    "93403",
    "93405",
    "93406",
    "93407",
    "93408",
    "93409",
    "93410",
    "93412",
    "93420",
    "93421",
    "93422",
    "93423",
    "93424",
    "93426",
    "93428",
    "93430",
    "93432",
    "93433",
    "93434",
    "93435",
    "93442",
    "93443",
    "93444",
    "93445",
    "93446",
    "93447",
    "93448",
    "93449",
    "93451",
    "93452",
    "93453",
    "93454",
    "93458",
    "93461",
    "93465",
    "93475",
    "93483",
  ],
  "Santa Barbara": [
    "93013",
    "93014",
    "93067",
    "93101",
    "93102",
    "93103",
    "93105",
    "93106",
    "93107",
    "93108",
    "93109",
    "93110",
    "93111",
    "93116",
    "93117",
    "93118",
    "93120",
    "93121",
    "93130",
    "93140",
    "93150",
    "93160",
    "93190",
    "93199",
    "93252",
    "93254",
    "93427",
    "93429",
    "93434",
    "93436",
    "93437",
    "93438",
    "93440",
    "93441",
    "93454",
    "93455",
    "93456",
    "93457",
    "93458",
    "93460",
    "93463",
    "93464",
  ],
} as const;
export const crossCountyZips: readonly string[] = [
  "93013",
  "93252",
  "93426",
  "93451",
  "93461",
];
export const servedZips: readonly string[] = [
  ...new Set(Object.values(countyZips).flat()),
].sort();
export function coverageMessage(location: string) {
  const zip = location
    .trim()
    .match(/^\d{5}(?:-\d{4})?$/)?.[0]
    .slice(0, 5);
  if (!zip)
    return "We serve all of San Luis Obispo and Santa Barbara counties. Enter a ZIP code to check the area, or enter your city.";
  if (crossCountyZips.includes(zip))
    return "This ZIP code includes part of our service area. We serve addresses in San Luis Obispo and Santa Barbara counties; we’ll confirm your location when we contact you.";
  if (servedZips.includes(zip))
    return "This ZIP code serves our coverage area. We’ll confirm the work address and appointment availability with you.";
  return "This ZIP code is not on our two-county list. Coverage needs confirmation; you can still send a request or call us.";
}
