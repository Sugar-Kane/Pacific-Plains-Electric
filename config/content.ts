import { business, diagnosticTerms } from "./business";

/**
 * Service request categories the intake database accepts. New service pages
 * map to one of these with `requestAs` instead of adding a category, so the
 * request form keeps working without a database migration.
 */
export const requestable = [
  "electrical-repair",
  "troubleshooting",
  "panel-upgrades",
  "ev-charger-installation",
  "lighting",
  "new-construction",
  "commercial-electrical",
  "generators",
  "service-plans",
] as const;

export type Faq = {
  q: string;
  /** null = TODO(owner); unanswered questions are not shown or marked up. */
  a: string | null;
};

export type Service = {
  slug: string;
  name: string;
  /** Short card copy. */
  summary: string;
  /** One-sentence factual description (page lede). */
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  requestAs: (typeof requestable)[number];
  audience: "Residential" | "Commercial" | "Residential and commercial";
  /** Shown in the services index and request form. */
  listed: boolean;
  overview: string[];
  reasons: string[];
  warningSigns?: string[];
  includes: string[];
  faqs: Faq[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "residential-electrical",
    name: "Residential Electrical",
    summary: "Repairs, upgrades, and new work for homes.",
    description:
      "Pacific Plains Electric provides residential electrical services for homeowners, landlords, and property managers throughout San Luis Obispo County.",
    metaTitle: "Residential Electrician in SLO County | Pacific Plains Electric",
    metaDescription:
      "Residential electrical services across San Luis Obispo County: troubleshooting, repairs, panel upgrades, EV chargers, lighting, and remodel wiring. CSLB #1162180.",
    icon: "House",
    requestAs: "electrical-repair",
    audience: "Residential",
    listed: true,
    overview: [
      "Most household electrical work falls into a few groups: finding and fixing problems, adding capacity, and installing something new. Pacific Plains Electric handles all three for single-family homes, rentals, and accessory dwelling units.",
      "If you are not sure what you need, start with a description of what is happening. We will tell you whether it needs a diagnostic visit or a quote for new work.",
    ],
    reasons: [
      "An outlet, switch, or light stopped working",
      "Breakers trip or lights dim when appliances run",
      "Adding an EV charger, heat pump, spa, or ADU",
      "Remodeling a kitchen, bath, or garage",
      "Updating lighting inside or out",
      "Preparing a rental between tenants",
    ],
    includes: [
      "Troubleshooting and repair",
      "Outlet, switch, and fixture installation",
      "Dedicated circuits for appliances and equipment",
      "Panel upgrades and replacements",
      "EV charger installation",
      "Remodel and addition wiring",
    ],
    faqs: [
      {
        q: "Do you work on rentals and properties I manage?",
        a: "Yes. Pacific Plains Electric works with homeowners, landlords, and property managers. Let us know who will provide access and who approves the work.",
      },
      {
        q: "What if I don't know what's wrong?",
        a: `Book a diagnostic visit. It's $${business.diagnosticPrice} and covers on-site troubleshooting and an explanation of what we find. ${diagnosticTerms}`,
      },
    ],
    related: ["troubleshooting", "panel-upgrades", "ev-charger-installation", "remodel-electrical"],
  },
  {
    slug: "troubleshooting",
    name: "Electrical Troubleshooting",
    summary: "A $180 visit to find what's causing the problem.",
    description: `Pacific Plains Electric troubleshoots electrical problems in homes and businesses across San Luis Obispo County. A diagnostic visit is $${business.diagnosticPrice}.`,
    metaTitle: "Electrical Troubleshooting, SLO County | Pacific Plains Electric",
    metaDescription:
      "Breaker tripping, dead outlets, or flickering lights? A $180 diagnostic visit traces the cause and explains repair options. Serving San Luis Obispo County.",
    icon: "Search",
    requestAs: "troubleshooting",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "Electrical problems are often not where they appear. A dead outlet can come from a tripped GFCI two rooms away; a breaker that trips at night can be a failing appliance rather than the circuit. Troubleshooting means tracing the symptom back to the cause before replacing anything.",
      `A diagnostic visit is $${business.diagnosticPrice}. It covers on-site troubleshooting and a clear explanation of what we find and the options to fix it. ${diagnosticTerms}`,
    ],
    reasons: [
      "Part of the house lost power",
      "A breaker trips repeatedly or won't reset",
      "Outlets or switches stopped working",
      "Lights flicker or dim",
      "A GFCI keeps tripping, especially in wet weather",
      "Something smells hot or a switch plate feels warm",
    ],
    warningSigns: [
      "Burning smell, scorch marks, or melted plastic at an outlet or panel",
      "Buzzing or crackling from a switch, outlet, or panel",
      "Outlets or cover plates that are warm to the touch",
      "Shocks or tingling when touching an appliance or fixture",
    ],
    includes: [
      "On-site evaluation of the affected circuits",
      "Testing outlets, switches, breakers, and connections",
      "A clear explanation of the cause",
      "Repair options and a quote before work begins",
    ],
    faqs: [
      {
        q: "How much does an electrician service call cost?",
        a: `A diagnostic visit is $${business.diagnosticPrice}. ${diagnosticTerms}`,
      },
      {
        q: "Should I keep resetting a breaker that trips?",
        a: "No. A breaker that trips again right away is doing its job. Unplug what's on the circuit, reset it once, and if it trips again, leave it off and have it checked.",
      },
    ],
    related: ["electrical-repair", "outlet-switch-installation", "panel-upgrades"],
  },
  {
    slug: "electrical-repair",
    name: "Electrical Repair",
    summary: "Outlets, switches, breakers, and circuits that stopped working.",
    description:
      "Pacific Plains Electric repairs outlets, switches, fixtures, breakers, and circuits for homes and businesses in San Luis Obispo County.",
    metaTitle: "Electrical Repair in SLO County | Pacific Plains Electric",
    metaDescription:
      "Electrical repair for outlets, switches, breakers, fixtures, and circuits in San Luis Obispo County homes and businesses. Licensed contractor, CSLB #1162180.",
    icon: "Wrench",
    requestAs: "electrical-repair",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "Most electrical repairs come down to a worn device, a loose or overheated connection, or a damaged section of wiring. The fix is usually straightforward once the cause is found, which is why repair starts with testing rather than guessing.",
      "If the cause is already clear, such as a broken outlet or a failed switch, we can quote the repair directly. If not, we start with a diagnostic visit.",
    ],
    reasons: [
      "Cracked, loose, or burned outlets",
      "Switches and dimmers that stopped working",
      "Light fixtures that flicker or won't turn on",
      "Breakers that are worn or won't hold",
      "Damaged wiring after a remodel, pest, or water issue",
    ],
    warningSigns: [
      "Plugs that fall out of an outlet",
      "Discolored or warm outlets and switches",
      "Lights that flicker when something else turns on",
    ],
    includes: [
      "Outlet and switch repairs and replacements",
      "Circuit and connection repairs",
      "Breaker replacement",
      "Fixture repairs",
      "Repair recommendations before work begins",
    ],
    faqs: [
      {
        q: "Can you troubleshoot outlets that stopped working?",
        a: "Yes. Start by checking for a tripped GFCI outlet nearby (kitchen, bath, garage, or outdoors) and a tripped breaker. If neither brings it back, we can trace the circuit and repair the cause.",
      },
    ],
    related: ["troubleshooting", "outlet-switch-installation", "residential-electrical"],
  },
  {
    slug: "panel-upgrades",
    name: "Panel Upgrades",
    summary: "More capacity for a remodel, new appliances, or an EV.",
    description:
      "Pacific Plains Electric evaluates, upgrades, and replaces electrical panels for homes and businesses in San Luis Obispo County.",
    metaTitle: "Electrical Panel Upgrades | San Luis Obispo County",
    metaDescription:
      "Electrical panel upgrades and replacements in San Luis Obispo County. Load evaluations for EV chargers, heat pumps, and remodels from a licensed electrician.",
    icon: "PanelsTopLeft",
    requestAs: "panel-upgrades",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "The panel distributes power from the utility to every circuit in the building. An upgrade usually means more capacity (for example, moving from 100 to 200 amps), more breaker spaces, or replacing an older panel that is worn or unreliable.",
      "An upgrade isn't automatic. A load evaluation compares what the home uses, and what you plan to add, against what the existing service can supply. Sometimes a new circuit or a load-management device is enough.",
      "Service upgrades require a permit and inspection from your local building department and coordination with the utility, which is PG&E in most of San Luis Obispo County. We'll go over permit requirements with your quote.",
    ],
    reasons: [
      "Adding an EV charger, heat pump, spa, or ADU",
      "A remodel that adds circuits",
      "No room left for new breakers",
      "Replacing an older or unreliable panel",
      "Insurance or a home sale flagged the panel",
    ],
    warningSigns: [
      "Breakers that trip often or feel warm",
      "A panel that buzzes, smells hot, or shows rust or scorching",
      "Fuses instead of breakers",
      "Older panel brands with documented reliability concerns, such as Federal Pacific Stab-Lok and Zinsco",
      "Lights that dim when large appliances start",
    ],
    includes: [
      "Existing panel and load evaluation",
      "Capacity planning for new equipment",
      "Panel replacement and service upgrades",
      "Subpanels for garages, ADUs, and outbuildings",
    ],
    faqs: [
      {
        q: "How do I know whether I need a panel upgrade?",
        a: "Common signs are frequent breaker trips, no open breaker spaces, a fuse box or older panel, and plans to add an EV charger, heat pump, or addition. A load evaluation tells you for sure.",
      },
      {
        q: "Do you upgrade electrical panels?",
        a: "Yes. Pacific Plains Electric evaluates, upgrades, and replaces panels for homes and businesses in San Luis Obispo County.",
      },
    ],
    related: ["ev-charger-installation", "dedicated-circuits", "remodel-electrical"],
  },
  {
    slug: "ev-charger-installation",
    name: "EV Charger Installation",
    summary: "Home and workplace chargers, sized to your panel.",
    description:
      "Pacific Plains Electric installs Level 2 EV chargers, including Tesla Wall Connectors, for homes and businesses in San Luis Obispo County.",
    metaTitle: "EV Charger Installation in SLO County | Pacific Plains Electric",
    metaDescription:
      "Level 2 EV charger and Tesla Wall Connector installation in San Luis Obispo County, with circuits sized to your panel and vehicle. Licensed electrical contractor.",
    icon: "CarFront",
    requestAs: "ev-charger-installation",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "A Level 2 charger runs on a 240-volt dedicated circuit and is the most common home setup. Because EV charging is a continuous load, the circuit is sized at 125% of the charger's output. A 48-amp charger needs a 60-amp circuit; a 32-amp charger needs a 40-amp circuit.",
      "The right charger size depends on how far you drive, what your vehicle accepts, and how much capacity your panel has to spare. Many chargers, including the Tesla Wall Connector, can be set to a lower current to fit an existing panel.",
    ],
    reasons: [
      "A new EV or plug-in hybrid",
      "Upgrading from a regular 120-volt outlet",
      "Adding a second charger for a second vehicle",
      "Workplace or tenant charging",
    ],
    includes: [
      "Panel capacity and load evaluation",
      "Charger location and circuit planning",
      "Dedicated circuit installation",
      "Hardwired charger and 240-volt outlet installation",
      "Home and commercial installations",
    ],
    faqs: [
      {
        q: "Can you install a Tesla Wall Connector?",
        a: "Yes. A Tesla Wall Connector is a hardwired Level 2 charger. It's installed on a dedicated circuit, and its current setting is matched to that circuit and your panel's available capacity.",
      },
      {
        q: "Can my electrical panel support an EV charger?",
        a: "Often, yes, sometimes at a reduced charging current. A load evaluation compares your home's existing demand with the charger's load. If capacity is short, options include a smaller circuit, a load-management device, or a panel upgrade.",
      },
      {
        q: "How much does EV charger installation cost?",
        a: "It depends on the distance from the panel to the parking spot, the circuit size, and whether the panel needs work. Installations are quoted after we know those details.",
      },
    ],
    related: ["panel-upgrades", "dedicated-circuits", "residential-electrical"],
  },
  {
    slug: "lighting",
    name: "Lighting Installation",
    summary: "Interior fixtures, dimmers, and exterior and landscape lighting.",
    description:
      "Pacific Plains Electric installs and repairs interior, exterior, and landscape lighting for homes and businesses in San Luis Obispo County.",
    metaTitle: "Lighting Installation in SLO County | Pacific Plains Electric",
    metaDescription:
      "Indoor, outdoor, and landscape lighting installation in San Luis Obispo County: fixtures, recessed lights, dimmers, and controls from a licensed electrician.",
    icon: "Lamp",
    requestAs: "lighting",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "Lighting work ranges from swapping a fixture to adding new recessed lighting, under-cabinet lights, exterior security lights, and path or landscape lighting with timers or motion control.",
      "California's Title 24 energy code sets lighting requirements for new construction and many remodels, including efficient fixtures and controls in certain rooms. We'll plan around them.",
    ],
    reasons: [
      "Rooms that are too dark",
      "Replacing outdated or failing fixtures",
      "Adding recessed or under-cabinet lighting",
      "Exterior, path, and security lighting",
      "Dimmers, timers, and motion sensors",
    ],
    includes: [
      "Interior fixtures and recessed lighting",
      "Exterior and landscape lighting",
      "Switches, dimmers, and controls",
      "Commercial lighting upgrades",
    ],
    faqs: [
      {
        q: "Can you install outdoor lighting near the coast?",
        a: "Yes. Near the coast, we recommend fixtures and covers rated for wet and corrosive locations, since salt air shortens the life of standard outdoor hardware.",
      },
    ],
    related: ["outlet-switch-installation", "remodel-electrical", "commercial-electrical"],
  },
  {
    slug: "outlet-switch-installation",
    name: "Outlets and Switches",
    summary: "New outlets, GFCI and USB outlets, switches, and dimmers.",
    description:
      "Pacific Plains Electric installs, replaces, and repairs outlets and switches, including GFCI, AFCI, and USB outlets, in San Luis Obispo County.",
    metaTitle: "Outlet and Switch Installation | Pacific Plains Electric",
    metaDescription:
      "Outlet and switch installation in San Luis Obispo County: new outlets, GFCI and AFCI protection, USB outlets, dimmers, and replacing two-prong outlets.",
    icon: "Plug",
    requestAs: "electrical-repair",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "Outlets and switches wear out, and many homes don't have enough of them where they're needed. Common jobs include adding outlets, replacing worn or damaged devices, adding GFCI protection in kitchens, baths, garages, and outdoors, and updating ungrounded two-prong outlets.",
      "Two-prong outlets can't simply be swapped for three-prong outlets unless a ground is available. Depending on the wiring, the options are running a ground, or GFCI protection with the proper labeling.",
    ],
    reasons: [
      "Not enough outlets where you need them",
      "Two-prong outlets in an older home",
      "Missing GFCI protection near water",
      "Loose, cracked, or warm outlets",
      "Adding dimmers, smart switches, or USB outlets",
    ],
    warningSigns: [
      "Plugs that don't stay in",
      "Discoloration or a burning smell at an outlet",
      "Switches that feel warm or buzz",
    ],
    includes: [
      "New outlet installation",
      "GFCI and AFCI protection",
      "Two-prong outlet updates",
      "Switch, dimmer, and smart switch installation",
      "Outdoor weather-resistant outlets",
    ],
    faqs: [
      {
        q: "What's the difference between GFCI and AFCI?",
        a: "GFCI protection prevents shocks by cutting power when current leaks to ground, which is why it's required near water. AFCI protection reduces fire risk by detecting dangerous arcing in wiring. Some devices provide both.",
      },
    ],
    related: ["electrical-repair", "dedicated-circuits", "troubleshooting"],
  },
  {
    slug: "dedicated-circuits",
    name: "Dedicated Circuits",
    summary: "Circuits for appliances, EVs, shops, and equipment.",
    description:
      "Pacific Plains Electric installs dedicated circuits for appliances, EV chargers, workshops, and equipment in San Luis Obispo County homes and businesses.",
    metaTitle: "Dedicated Circuit Installation | Pacific Plains Electric",
    metaDescription:
      "Dedicated circuits in San Luis Obispo County for kitchen appliances, EV chargers, spas, heat pumps, workshops, and commercial equipment. Licensed electrician.",
    icon: "Cable",
    requestAs: "electrical-repair",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "A dedicated circuit serves one appliance or piece of equipment, so it isn't sharing capacity with anything else. Large or motor-driven loads need one, and many are required by code: ranges, dryers, dishwashers, microwaves, EV chargers, spas, and heat pumps among them.",
      "Adding a circuit starts with checking that the panel has the capacity and a breaker space for it.",
    ],
    reasons: [
      "A new range, dryer, or other 240-volt appliance",
      "An EV charger, spa, or heat pump",
      "A garage workshop or home office",
      "Freezers and equipment that shouldn't share a circuit",
      "Commercial kitchen or shop equipment",
    ],
    warningSigns: [
      "A breaker trips when two appliances run together",
      "Extension cords used as permanent wiring",
    ],
    includes: [
      "120-volt and 240-volt dedicated circuits",
      "Panel capacity checks",
      "Subpanels for garages and outbuildings",
      "Outlets and connections for the equipment",
    ],
    faqs: [
      {
        q: "Does my appliance need its own circuit?",
        a: "Check the installation manual; it lists the circuit size it needs. Most 240-volt appliances, and many kitchen appliances, require a dedicated circuit.",
      },
    ],
    related: ["panel-upgrades", "ev-charger-installation", "outlet-switch-installation"],
  },
  {
    slug: "remodel-electrical",
    name: "Remodel Electrical",
    summary: "Wiring for kitchen, bath, and whole-home remodels.",
    description:
      "Pacific Plains Electric plans and installs electrical work for kitchen, bathroom, and whole-home remodels in San Luis Obispo County.",
    metaTitle: "Remodel Electrical Work in SLO County | Pacific Plains Electric",
    metaDescription:
      "Electrical work for kitchen, bath, and whole-home remodels in San Luis Obispo County, from new circuits and lighting to panel capacity and code updates.",
    icon: "House",
    requestAs: "new-construction",
    audience: "Residential",
    listed: true,
    overview: [
      "A remodel is the best time to update electrical work, because the walls are open. Kitchens typically need several dedicated appliance circuits and GFCI-protected countertop outlets; bathrooms need GFCI protection and their own circuits; and new lighting has to meet California's Title 24 requirements.",
      "In older Central Coast homes, a remodel can also reveal original wiring, ungrounded circuits, or a panel without room for what's being added. Planning the electrical early avoids surprises later in the project.",
    ],
    reasons: [
      "Kitchen and bathroom remodels",
      "Room additions and garage conversions",
      "ADU construction",
      "Updating wiring in an older home",
    ],
    includes: [
      "Electrical planning with you and your contractor",
      "New circuits, outlets, and lighting",
      "Panel capacity evaluation and upgrades",
      "Coordination with the rest of the project team",
    ],
    faqs: [
      {
        q: "Do remodels need an electrical permit?",
        a: "Most remodels that add or change circuits do. Permits come from your city's building department, or from the County of San Luis Obispo in unincorporated areas. We'll go over permit requirements with your quote.",
      },
    ],
    related: ["new-construction", "panel-upgrades", "lighting"],
  },
  {
    slug: "new-construction",
    name: "New Construction",
    summary: "Wiring for new homes, additions, and ADUs.",
    description:
      "Pacific Plains Electric provides electrical planning and installation for new homes, additions, and ADUs in San Luis Obispo County.",
    metaTitle: "New Construction Electrical | Pacific Plains Electric",
    metaDescription:
      "Electrical planning and installation for new homes, additions, and ADUs in San Luis Obispo County, coordinated with your builder and project team.",
    icon: "House",
    requestAs: "new-construction",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "New construction electrical covers the service, panel, rough wiring, and finish work for a new home, addition, or accessory dwelling unit, along with the inspections in between.",
      "Getting the electrical plan settled early, including where outlets, lighting, and EV charging will go, keeps the project moving and avoids changes after the walls close.",
    ],
    reasons: ["New homes", "Room additions", "Accessory dwelling units (ADUs)", "Detached garages and outbuildings"],
    includes: [
      "Electrical planning and layout",
      "Service and panel installation",
      "Rough and finish wiring",
      "Coordination with your project team",
    ],
    faqs: [],
    related: ["remodel-electrical", "panel-upgrades", "ev-charger-installation"],
  },
  {
    slug: "commercial-electrical",
    name: "Commercial Electrical",
    summary: "Tenant improvements, repairs, and upgrades for businesses.",
    description:
      "Pacific Plains Electric provides commercial electrical services for businesses, tenant spaces, and property managers in San Luis Obispo County.",
    metaTitle: "Commercial Electrician in SLO County | Pacific Plains Electric",
    metaDescription:
      "Commercial electrical services in San Luis Obispo County: tenant improvements, troubleshooting, lighting upgrades, and equipment circuits for businesses.",
    icon: "Building2",
    requestAs: "commercial-electrical",
    audience: "Commercial",
    listed: true,
    overview: [
      "Businesses need electrical work that's reliable and scheduled around operating hours. Commercial work includes tenant improvements for new or changing spaces, troubleshooting and repairs, lighting upgrades, and circuits for equipment.",
    ],
    reasons: [
      "Moving into or reconfiguring a space",
      "Lighting that's dim, failing, or inefficient",
      "New equipment that needs power",
      "Recurring trips or outages",
      "Workplace EV charging",
    ],
    includes: [
      "Tenant improvements",
      "Commercial repairs and troubleshooting",
      "Lighting upgrades",
      "Dedicated equipment circuits",
    ],
    faqs: [
      {
        q: "Do you perform commercial electrical work?",
        a: "Yes. Pacific Plains Electric works with businesses and property managers in San Luis Obispo County.",
      },
    ],
    related: ["lighting", "dedicated-circuits", "service-plans"],
  },
  {
    slug: "generators",
    name: "Generators",
    summary: "Backup power planning and installation.",
    description:
      "Pacific Plains Electric plans and installs backup generator connections for homes and businesses in San Luis Obispo County.",
    metaTitle: "Generator Installation, SLO County | Pacific Plains Electric",
    metaDescription:
      "Backup generator planning and installation in San Luis Obispo County, including transfer switches and interlocks so the generator connects safely to your panel.",
    icon: "Zap",
    requestAs: "generators",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "A generator has to connect to the panel through a transfer switch or an approved interlock. That keeps it from sending power back onto the utility line, which can injure line workers, and from fighting the utility when power returns. Plugging a generator into a household outlet is never safe.",
      "Planning starts with what you want to keep running during an outage and whether a portable or a standby generator fits.",
    ],
    reasons: [
      "Keeping essentials running during outages",
      "Well pumps, refrigeration, and medical equipment",
      "Connecting a portable generator safely",
    ],
    includes: [
      "Backup power planning",
      "Transfer switch and interlock installation",
      "Equipment and placement evaluation",
      "Installation scope and pricing",
    ],
    faqs: [],
    related: ["panel-upgrades", "dedicated-circuits"],
  },
  {
    slug: "service-plans",
    name: "Service and Maintenance",
    summary: "Ongoing care for homes and managed properties.",
    description:
      "Pacific Plains Electric provides recurring electrical service and maintenance for homes, businesses, and managed properties in San Luis Obispo County.",
    metaTitle: "Electrical Maintenance | Pacific Plains Electric",
    metaDescription:
      "Recurring electrical service for homes, rentals, and managed properties in San Luis Obispo County. Scope and pricing confirmed individually with Nicholas Kane.",
    icon: "ClipboardCheck",
    requestAs: "service-plans",
    audience: "Residential and commercial",
    listed: true,
    overview: [
      "Property owners and managers with several units, or businesses that can't afford downtime, often prefer a recurring arrangement over one-off calls. Scope and pricing are confirmed individually.",
    ],
    reasons: ["Rental turnovers", "Managed properties", "Businesses that need planned maintenance"],
    includes: [
      "Property electrical maintenance needs",
      "Preventive service planning",
      "Recommendations tailored to your property",
    ],
    faqs: [],
    related: ["commercial-electrical", "electrical-repair"],
  },
];

export const listedServices = services.filter((s) => s.listed);
export const findService = (slug: string) => services.find((s) => s.slug === slug);
export const requestableServices = requestable.map((slug) => findService(slug)!);

/** What happens after someone gets in touch; shared by every service page. */
export const process = [
  {
    title: "Tell us about the job",
    body: "Call, text, or send the online form with what's happening or what you're planning.",
  },
  {
    title: "We follow up",
    body: "We contact you to talk it through and set a time. Sending a request doesn't book an appointment.",
  },
  {
    title: "Diagnose or scope",
    body: `For problems, a $${business.diagnosticPrice} diagnostic visit finds the cause. For new work, we review the scope and quote it before work begins.`,
  },
  {
    title: "The work",
    body: "Work that needs a permit is inspected by your local building department.",
  },
];

/** General FAQ. Questions with `a: null` are TODOs and are not published. */
export const faqs: Faq[] = [
  {
    q: "What areas does Pacific Plains Electric serve?",
    a: "Pacific Plains Electric serves homes and businesses throughout San Luis Obispo County, California, including San Luis Obispo, Arroyo Grande, Grover Beach, Pismo Beach, Nipomo, Avila Beach, Morro Bay, Atascadero, and Paso Robles. Contact us to confirm service for your address.",
  },
  {
    q: "How much does an electrician service call cost?",
    a: `A diagnostic visit is $${business.diagnosticPrice}. It covers on-site troubleshooting and an explanation of what we find. ${diagnosticTerms}`,
  },
  {
    q: "Is Pacific Plains Electric a licensed electrician?",
    a: `Yes. Pacific Plains Electric is a California-licensed contractor, ${business.license}, owned by ${business.owner}.`,
  },
  {
    q: "Does Pacific Plains Electric install EV chargers?",
    a: "Yes, including Level 2 home chargers such as the Tesla Wall Connector, for homes and businesses. The circuit is sized to the charger and to your panel's available capacity.",
  },
  {
    q: "Do you upgrade electrical panels?",
    a: "Yes. We evaluate, upgrade, and replace panels, starting with a load evaluation to confirm what you actually need.",
  },
  {
    q: "Do you do residential and commercial electrical work?",
    a: "Both. Pacific Plains Electric works with homeowners, landlords, property managers, and businesses.",
  },
  {
    q: "Can I schedule an electrician online?",
    a: "Online booking isn't available yet. Send a service request with your preferred days or times, and we'll contact you to confirm an appointment. You can also call or text.",
  },
  {
    q: "How quickly can an electrician come out?",
    // TODO(owner): typical lead time for a diagnostic visit, if you want to state one.
    a: null,
  },
  {
    q: "Do you offer 24/7 emergency service?",
    a: "The main line is answered around the clock by an automated assistant, but electrician visits are scheduled by appointment. For fire, smoke, sparking, or any immediate hazard, move away and call 911.",
  },
  {
    q: "Who answers the main phone number?",
    a: `An automated assistant answers the main line, ${business.workPhone.display}. To reach ${business.owner} directly, call ${business.directPhone.display} or email ${business.email}.`,
  },
  {
    q: "Are you insured?",
    // TODO(owner): answer only if insurance is in place and you want it published.
    a: null,
  },
  {
    q: "What payment methods do you accept?",
    // TODO(owner): list accepted payment methods.
    a: null,
  },
];
export const answeredFaqs = faqs.filter((f): f is { q: string; a: string } => !!f.a);

export type Article = {
  slug: string;
  title: string;
  category: string;
  dek: string;
  metaDescription: string;
  published: string;
  icon: string;
  sections: [string, string][];
  related: string[];
};

export const articles: Article[] = [
  {
    slug: "why-does-my-breaker-keep-tripping",
    title: "Why does my breaker keep tripping?",
    category: "Troubleshooting",
    dek: "The four usual causes, what you can safely check yourself, and when to stop.",
    metaDescription:
      "Why a circuit breaker keeps tripping: overloads, short circuits, ground faults, and worn breakers. What you can check safely and when to call an electrician.",
    published: "2026-10-09",
    icon: "Search",
    sections: [
      [
        "A trip is the breaker doing its job",
        "A breaker shuts a circuit off when it senses more current than the wiring can safely carry, or a fault that could cause a shock or fire. The question is which of those is happening.",
      ],
      [
        "1. Overload",
        "Too many things running on one circuit, such as a space heater and a hair dryer, or a microwave and a toaster. The breaker trips after a few seconds or minutes of heavy use. Moving a load to another circuit usually stops it; if it happens often, the circuit or panel may be undersized for how the space is used.",
      ],
      [
        "2. Short circuit",
        "A hot wire touching neutral or ground, often from a damaged cord, a failing appliance, or a loose connection in a box. Shorts trip the breaker instantly, sometimes with a pop or scorch mark. Don't keep resetting it.",
      ],
      [
        "3. Ground fault",
        "Current leaking to ground, often through moisture. GFCI outlets and breakers trip on very small leaks to prevent shocks, which is why outdoor and bathroom circuits are more likely to trip in wet weather near the coast.",
      ],
      [
        "4. A worn breaker or loose connection",
        "Breakers wear out, and loose or overheated connections in the panel can trip breakers that aren't overloaded. Warmth, buzzing, or a burning smell at the panel needs a professional.",
      ],
      [
        "What you can check",
        "Unplug everything on the circuit, reset the breaker once, and plug things back in one at a time. If one device trips it, that device is the likely problem. If it trips with nothing plugged in, or trips again immediately, leave it off and have it checked. Never replace a breaker with a larger one to stop trips; the breaker size is set by the wire.",
      ],
    ],
    related: ["troubleshooting", "panel-upgrades", "dedicated-circuits"],
  },
  {
    slug: "100-amp-vs-200-amp-service",
    title: "100-amp vs. 200-amp electrical service",
    category: "Panels",
    dek: "What the number on your main breaker means, and whether you need more.",
    metaDescription:
      "100-amp vs 200-amp electrical service explained: what each supports, when an upgrade makes sense, and how a load calculation decides it for your home.",
    published: "2026-10-09",
    icon: "PanelsTopLeft",
    sections: [
      [
        "What the rating means",
        "Your service rating, usually printed on the main breaker, is the most current the panel and service wires can supply to the whole house at once. Many older homes have 100-amp or smaller service; 200 amps is common in newer homes.",
      ],
      [
        "Is 100 amps enough?",
        "It can be for a modest home with gas heating, cooking, and water heating. It gets tight when you add electric appliances, air conditioning or a heat pump, an EV charger, or an ADU.",
      ],
      [
        "A load calculation decides it",
        "Rather than guessing, an electrician calculates the home's demand from its square footage and appliances using the method in the electrical code, then adds what you plan to install. That shows whether there's room.",
      ],
      [
        "Alternatives to a full upgrade",
        "If you're close, options include a lower-current EV charger setting, a load-management device that pauses the charger when the house is busy, or circuit sharing. These can avoid or delay a service upgrade.",
      ],
      [
        "If you do upgrade",
        "A service upgrade requires a permit, an inspection, and coordination with the utility (PG&E in most of San Luis Obispo County) to disconnect and reconnect power.",
      ],
    ],
    related: ["panel-upgrades", "ev-charger-installation"],
  },
  {
    slug: "can-my-panel-support-an-ev-charger",
    title: "Can my panel support an EV charger?",
    category: "EV charging",
    dek: "How charger size, circuit size, and panel capacity fit together, including the Tesla Wall Connector.",
    metaDescription:
      "Can your panel support an EV charger or Tesla Wall Connector? How charger current, the 125% circuit rule, and a load calculation decide what fits your home.",
    published: "2026-10-09",
    icon: "CarFront",
    sections: [
      [
        "Charger current and circuit size",
        "EV charging counts as a continuous load, so the circuit is sized at 125% of the charger's current. A charger set to 48 amps needs a 60-amp circuit; 40 amps needs 50; 32 amps needs 40.",
      ],
      [
        "Most chargers are adjustable",
        "Hardwired chargers, including the Tesla Wall Connector, can be configured for a lower current to match the circuit you have room for. A 32-amp setting still adds roughly 25 miles of range per hour for many vehicles, which is plenty for overnight charging.",
      ],
      [
        "Checking panel capacity",
        "A load calculation adds the charger to your home's existing demand. Two things matter: total capacity, and whether there's physical space for a two-pole breaker.",
      ],
      [
        "If capacity is short",
        "Options include a lower charger setting, a load-management system that limits charging when the house is busy, or a panel upgrade.",
      ],
      [
        "What to have ready",
        "Your vehicle and charger model, where you park, and a photo of your panel with the door open help us quote it accurately.",
      ],
    ],
    related: ["ev-charger-installation", "panel-upgrades", "dedicated-circuits"],
  },
  {
    slug: "gfci-vs-afci-protection",
    title: "GFCI vs. AFCI protection",
    category: "Safety",
    dek: "Two kinds of protection that do different jobs, and where you need each.",
    metaDescription:
      "GFCI vs AFCI protection: how each works, where California homes need them, why GFCIs trip in damp weather, and when dual-function devices make sense.",
    published: "2026-10-09",
    icon: "ClipboardCheck",
    sections: [
      [
        "GFCI: protection from shock",
        "A ground-fault circuit interrupter compares the current going out and coming back. If some is leaking, possibly through a person, it shuts off in a fraction of a second. GFCI protection is required in wet and damp locations such as bathrooms, kitchen countertops, garages, laundry areas, and outdoors.",
      ],
      [
        "AFCI: protection from fire",
        "An arc-fault circuit interrupter detects the electrical signature of arcing from damaged or loose wiring, a common cause of electrical fires, and shuts the circuit off. AFCI protection is required on most living-area circuits in new construction and when circuits are extended.",
      ],
      [
        "Why a GFCI trips in wet weather",
        "Moisture in an outdoor outlet or fixture can create a small leak to ground. In coastal areas this is common. Weather-resistant outlets and in-use covers help; frequent trips mean something should be checked.",
      ],
      [
        "Dual-function protection",
        "Combination devices and breakers provide both GFCI and AFCI protection where both are required, such as kitchens and laundry areas.",
      ],
    ],
    related: ["outlet-switch-installation", "troubleshooting"],
  },
  {
    slug: "planning-an-ev-charger",
    title: "Planning an EV charger at home",
    category: "EV charging",
    dek: "A few details to gather before you request an installation.",
    metaDescription:
      "Planning a home EV charger in San Luis Obispo County: choosing a location, checking panel capacity, and what to share with your electrician before a quote.",
    published: "2026-10-03",
    icon: "CarFront",
    sections: [
      [
        "Start with your everyday parking spot",
        "Think about where you park, where a cable can reach comfortably, and whether the charger will be indoors or outside. Share your vehicle and charger model with your electrician.",
      ],
      [
        "Have your electrical capacity evaluated",
        "A charger adds load to the electrical system. Your electrician can evaluate the available capacity and whether a new circuit or other changes are needed.",
      ],
      [
        "Discuss the complete scope",
        "Installation requirements vary by property. Request an evaluation and a project quote before assuming a standard installation price.",
      ],
    ],
    related: ["ev-charger-installation", "panel-upgrades"],
  },
  {
    slug: "when-to-discuss-a-panel-upgrade",
    title: "Does my home need a panel upgrade?",
    category: "Panels",
    dek: "New appliances or a remodel? Start with your electrical capacity.",
    metaDescription:
      "Signs your home may need an electrical panel upgrade, from frequent breaker trips to adding an EV or heat pump, and why a load evaluation comes first.",
    published: "2026-10-03",
    icon: "PanelsTopLeft",
    sections: [
      [
        "Tell your electrician what is changing",
        "A remodel, new heating equipment, or an EV charger may affect electrical demand. Share your plans early so electrical work can be considered alongside the rest of the project.",
      ],
      [
        "Signs worth checking",
        "Breakers that trip often, no open breaker spaces, a fuse box, a panel that's warm or buzzing, or an older panel brand with known reliability concerns are all reasons for an evaluation.",
      ],
      [
        "An evaluation comes first",
        "An upgrade is not automatically required for every new appliance. A professional evaluation helps identify the right scope for the property.",
      ],
      [
        "Keep the next step simple",
        `Pacific Plains Electric offers diagnostic evaluation for $${business.diagnosticPrice}. Repair and project costs are separate.`,
      ],
    ],
    related: ["panel-upgrades", "ev-charger-installation"],
  },
  {
    slug: "planning-outdoor-lighting",
    title: "A practical guide to outdoor lighting",
    category: "Lighting",
    dek: "Make entrances, paths, and outdoor spaces work better after sunset.",
    metaDescription:
      "Planning outdoor lighting for a Central Coast home: entries, paths, and patios, choosing controls, and fixtures that hold up to salt air and coastal fog.",
    published: "2026-10-03",
    icon: "Lamp",
    sections: [
      [
        "Start with the places you use",
        "Consider your front entry, walkways, driveway, and outdoor gathering areas. Note which places feel too dark and which existing lights create glare.",
      ],
      [
        "Think about controls",
        "Timers, motion sensing, and dimming can be discussed as part of your lighting plan. The right approach depends on the fixtures, location, and how you use the space.",
      ],
      [
        "Choose fixtures for the coast",
        "Salt air and fog are hard on outdoor hardware. Fixtures, outlets, and covers rated for wet and corrosive locations last longer close to the water.",
      ],
      [
        "Request a lighting consultation",
        "Share your goals with Nicholas and discuss placement, installation needs, and project pricing.",
      ],
    ],
    related: ["lighting", "outlet-switch-installation"],
  },
];
export const findArticle = (slug: string) => articles.find((a) => a.slug === slug);
