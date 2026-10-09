/**
 * Communities in the service area: San Luis Obispo County, plus Santa Barbara.
 *
 * TODO(owner): confirm each community is one you want to take work in. To stop
 * publishing a page, set `published: false`; it disappears from the site,
 * sitemap, structured data, and llms.txt.
 *
 * Pages describe the area served, not an office: there is no storefront in any
 * of these towns. Local facts here are deliberately general and verifiable
 * (who issues permits, coastal vs. inland conditions, typical housing).
 */
export type Area = {
  slug: string;
  name: string;
  published: boolean;
  /** Incorporated city, or unincorporated community under the County. */
  kind: "city" | "community";
  permitAuthority: string;
  /** County the community is in; defaults to San Luis Obispo County. */
  county?: string;
  wikipedia: string;
  setting: "coastal" | "inland" | "central";
  intro: string;
  considerations: { title: string; body: string }[];
  /** Service slugs most relevant here, in order. */
  services: string[];
  nearby: string[];
};

const county = "the County of San Luis Obispo Planning & Building Department";
export const DEFAULT_COUNTY = "San Luis Obispo County";
export const countyOf = (a: Pick<Area, "county">) => a.county ?? DEFAULT_COUNTY;

export const areas: Area[] = [
  {
    slug: "san-luis-obispo",
    name: "San Luis Obispo",
    published: true,
    kind: "city",
    permitAuthority: "the City of San Luis Obispo's building department",
    wikipedia: "https://en.wikipedia.org/wiki/San_Luis_Obispo,_California",
    setting: "central",
    intro:
      "Pacific Plains Electric provides residential and commercial electrical services in the City of San Luis Obispo, from troubleshooting and repairs in older homes to panel upgrades and EV chargers in newer ones.",
    considerations: [
      {
        title: "Older homes near downtown",
        body: "Many houses in the older neighborhoods around downtown were wired for far less than a modern household uses. Two-prong outlets, small panels, and circuits that trip when the microwave and toaster run together are common reasons for a diagnostic visit.",
      },
      {
        title: "Rentals and property managers",
        body: "With a large rental market around Cal Poly, a lot of electrical work here is repairs between tenants, lighting and outlet replacements, and making sure smoke-alarm and kitchen circuits are working before move-in.",
      },
      {
        title: "ADUs, EVs, and panel capacity",
        body: "Adding an accessory dwelling unit, a heat pump, or an EV charger all draw on the same panel. A load evaluation tells you whether the existing service can handle it or needs an upgrade first.",
      },
    ],
    services: ["troubleshooting", "panel-upgrades", "ev-charger-installation", "remodel-electrical", "commercial-electrical"],
    nearby: ["avila-beach", "arroyo-grande", "morro-bay", "atascadero"],
  },
  {
    slug: "nipomo",
    name: "Nipomo",
    published: true,
    kind: "community",
    permitAuthority: county,
    wikipedia: "https://en.wikipedia.org/wiki/Nipomo,_California",
    setting: "central",
    intro:
      "Pacific Plains Electric serves homeowners and businesses in Nipomo, including newer subdivisions and larger rural properties on the Nipomo Mesa.",
    considerations: [
      {
        title: "Larger lots and outbuildings",
        body: "Detached garages, shops, barns, and workshops often need their own feeder or subpanel. Running power to an outbuilding is planned around the distance, the load, and what the main panel can spare.",
      },
      {
        title: "Wells, pumps, and gates",
        body: "Rural parcels frequently depend on well pumps, gate operators, and outdoor lighting on long circuit runs. When a pump or gate stops working, the cause is often a failed breaker, a bad connection, or voltage drop on the run.",
      },
      {
        title: "Newer homes adding EV charging",
        body: "Many newer Nipomo homes have room in the panel for a Level 2 charger, but it should be confirmed with a load evaluation before choosing a charger size.",
      },
    ],
    services: ["ev-charger-installation", "dedicated-circuits", "panel-upgrades", "troubleshooting", "lighting"],
    nearby: ["arroyo-grande", "grover-beach", "pismo-beach"],
  },
  {
    slug: "arroyo-grande",
    name: "Arroyo Grande",
    published: true,
    kind: "city",
    permitAuthority: "the City of Arroyo Grande's building department",
    wikipedia: "https://en.wikipedia.org/wiki/Arroyo_Grande,_California",
    setting: "central",
    intro:
      "Pacific Plains Electric provides electrical repair, upgrades, and installations for homes and businesses in Arroyo Grande, from the historic Village to newer neighborhoods.",
    considerations: [
      {
        title: "Older homes and the Village",
        body: "Older houses and storefronts can have outdated panels, ungrounded outlets, or wiring that has been added onto over the years. Remodels are a good time to bring circuits up to current code.",
      },
      {
        title: "Kitchen and bath remodels",
        body: "Modern kitchens need several dedicated appliance circuits and GFCI protection near water. Planning the electrical early keeps the remodel on schedule.",
      },
      {
        title: "Adding loads to an existing panel",
        body: "EV chargers, spas, and heat pumps are the most common reasons a panel runs out of room. A load evaluation shows whether you need an upgrade or just a new circuit.",
      },
    ],
    services: ["remodel-electrical", "panel-upgrades", "outlet-switch-installation", "ev-charger-installation", "troubleshooting"],
    nearby: ["grover-beach", "pismo-beach", "nipomo", "san-luis-obispo"],
  },
  {
    slug: "grover-beach",
    name: "Grover Beach",
    published: true,
    kind: "city",
    permitAuthority: "the City of Grover Beach's building department",
    wikipedia: "https://en.wikipedia.org/wiki/Grover_Beach,_California",
    setting: "coastal",
    intro:
      "Pacific Plains Electric serves homes and businesses in Grover Beach, where many smaller, older homes are being updated for how people live today.",
    considerations: [
      {
        title: "Smaller panels in older homes",
        body: "Older homes often have smaller electrical services and fewer circuits than a modern household needs. Frequent breaker trips and dimming lights are signs the panel or a circuit is overloaded.",
      },
      {
        title: "Salt air near the beach",
        body: "Coastal air corrodes exterior fixtures, outdoor outlets, meter bases, and panel connections faster than inland. Corrosion-resistant fixtures and weatherproof covers last longer here.",
      },
      {
        title: "Two-prong outlets",
        body: "Ungrounded outlets are common in older housing. They can be updated with proper grounding or GFCI protection, depending on what the wiring allows.",
      },
    ],
    services: ["panel-upgrades", "outlet-switch-installation", "troubleshooting", "lighting", "ev-charger-installation"],
    nearby: ["pismo-beach", "arroyo-grande", "nipomo"],
  },
  {
    slug: "pismo-beach",
    name: "Pismo Beach",
    published: true,
    kind: "city",
    permitAuthority: "the City of Pismo Beach's building department",
    wikipedia: "https://en.wikipedia.org/wiki/Pismo_Beach,_California",
    setting: "coastal",
    intro:
      "Pacific Plains Electric provides electrical services for homes, vacation rentals, and businesses in Pismo Beach.",
    considerations: [
      {
        title: "Coastal corrosion",
        body: "Salt air is hard on exterior lighting, outdoor outlets, and panels mounted outside. Replacing corroded fixtures and connections early prevents intermittent problems that are harder to trace later.",
      },
      {
        title: "Vacation rentals",
        body: "Rental owners and managers usually need quick repairs, reliable exterior and path lighting, and outlets that work for every guest. Scheduled visits between bookings keep work out of the way.",
      },
      {
        title: "Outdoor living spaces",
        body: "Decks and patios often add lighting, outdoor outlets, and spa circuits, each of which needs the right protection for wet locations.",
      },
    ],
    services: ["lighting", "electrical-repair", "outlet-switch-installation", "troubleshooting", "service-plans"],
    nearby: ["grover-beach", "avila-beach", "arroyo-grande"],
  },
  {
    slug: "avila-beach",
    name: "Avila Beach",
    published: true,
    kind: "community",
    permitAuthority: county,
    wikipedia: "https://en.wikipedia.org/wiki/Avila_Beach,_California",
    setting: "coastal",
    intro:
      "Pacific Plains Electric serves homes and second homes in Avila Beach and the surrounding Avila Valley.",
    considerations: [
      {
        title: "Second homes",
        body: "Homes that sit empty part of the year can develop problems no one notices right away, from a tripped circuit to failing exterior lighting. A visit before guests arrive catches them.",
      },
      {
        title: "Salt air and moisture",
        body: "Exterior fixtures, outlets, and panel connections close to the water corrode faster. Weather-resistant devices and in-use covers hold up better.",
      },
      {
        title: "Permits through the County",
        body: "Avila Beach is unincorporated, so permitted electrical work goes through the County of San Luis Obispo rather than a city building department.",
      },
    ],
    services: ["lighting", "troubleshooting", "electrical-repair", "service-plans", "panel-upgrades"],
    nearby: ["san-luis-obispo", "pismo-beach"],
  },
  {
    slug: "morro-bay",
    name: "Morro Bay",
    published: true,
    kind: "city",
    permitAuthority: "the City of Morro Bay's building department",
    wikipedia: "https://en.wikipedia.org/wiki/Morro_Bay,_California",
    setting: "coastal",
    intro:
      "Pacific Plains Electric provides electrical repair and installation for homes and businesses in Morro Bay.",
    considerations: [
      {
        title: "Fog, moisture, and salt",
        body: "Damp coastal air is one of the most common causes of corroded outdoor outlets, failing exterior lights, and GFCI devices that trip in wet weather.",
      },
      {
        title: "Older cottages",
        body: "Many smaller, older homes have limited circuits and dated panels. Adding a kitchen appliance or a space heater can be enough to start tripping breakers.",
      },
      {
        title: "Small businesses",
        body: "Shops and restaurants rely on lighting and dedicated equipment circuits. Repairs can be planned around business hours.",
      },
    ],
    services: ["troubleshooting", "outlet-switch-installation", "lighting", "panel-upgrades", "commercial-electrical"],
    nearby: ["san-luis-obispo", "atascadero"],
  },
  {
    slug: "atascadero",
    name: "Atascadero",
    published: true,
    kind: "city",
    permitAuthority: "the City of Atascadero's building department",
    wikipedia: "https://en.wikipedia.org/wiki/Atascadero,_California",
    setting: "inland",
    intro:
      "Pacific Plains Electric serves homeowners and businesses in Atascadero, including larger residential lots and properties with shops and outbuildings.",
    considerations: [
      {
        title: "Summer heat and cooling loads",
        body: "Hot inland summers mean air conditioning and heat pumps run hard. If lights dim when the AC starts or breakers trip on hot days, the panel or circuit may need attention.",
      },
      {
        title: "Shops and outbuildings",
        body: "Workshops, detached garages, and barns often need a subpanel and dedicated circuits for tools and equipment.",
      },
      {
        title: "Backup power",
        body: "Some properties want a generator connection for outages. It has to be installed with a proper transfer switch or interlock so it never backfeeds the utility line.",
      },
    ],
    services: ["dedicated-circuits", "panel-upgrades", "generators", "ev-charger-installation", "troubleshooting"],
    nearby: ["paso-robles", "san-luis-obispo", "morro-bay"],
  },
  {
    slug: "paso-robles",
    name: "Paso Robles",
    published: true,
    kind: "city",
    permitAuthority: "the City of Paso Robles's building department",
    wikipedia: "https://en.wikipedia.org/wiki/Paso_Robles,_California",
    setting: "inland",
    intro:
      "Pacific Plains Electric provides residential and commercial electrical services in Paso Robles, from homes in town to rural properties and businesses.",
    considerations: [
      {
        title: "Heat and electrical load",
        body: "Long, hot summers put steady load on air conditioning, pool equipment, and the panel that feeds them. Overheated connections and tripping breakers are worth checking before peak season.",
      },
      {
        title: "Rural properties",
        body: "Properties outside town may have long runs to pumps, gates, and outbuildings, where voltage drop and weathered connections cause intermittent failures.",
      },
      {
        title: "Commercial and hospitality",
        body: "Tasting rooms, shops, and offices need reliable lighting and dedicated equipment circuits, with work scheduled around opening hours.",
      },
    ],
    services: ["commercial-electrical", "panel-upgrades", "dedicated-circuits", "generators", "lighting"],
    nearby: ["atascadero"],
  },
  {
    slug: "santa-barbara",
    name: "Santa Barbara",
    published: true,
    kind: "city",
    county: "Santa Barbara County",
    permitAuthority: "the City of Santa Barbara's building department",
    wikipedia: "https://en.wikipedia.org/wiki/Santa_Barbara,_California",
    setting: "coastal",
    intro:
      "Pacific Plains Electric provides residential and commercial electrical services in Santa Barbara, from repairs and remodel wiring in older homes to panel upgrades, EV chargers, and backup power.",
    considerations: [
      {
        title: "Older and historic homes",
        body: "Many Santa Barbara homes are decades old, and original wiring, small panels, and ungrounded outlets are common. Homes in the city's historic districts may also need design review for visible exterior changes, so it helps to plan fixture and equipment locations early.",
      },
      {
        title: "Power shutoffs and backup power",
        body: "Southern California Edison, the utility here, can turn off power in high fire-risk areas during dangerous weather, including parts of the foothills. A generator connected through a transfer switch or approved interlock keeps essentials running without backfeeding the utility line.",
      },
      {
        title: "Salt air near the coast",
        body: "Exterior fixtures, outdoor outlets, and panel connections close to the water corrode faster than inland. Weather-resistant devices and in-use covers hold up better.",
      },
    ],
    services: ["remodel-electrical", "panel-upgrades", "generators", "ev-charger-installation", "lighting"],
    nearby: [],
  },
];

export const publishedAreas = areas.filter((a) => a.published);
export const findArea = (slug: string) => publishedAreas.find((a) => a.slug === slug);
