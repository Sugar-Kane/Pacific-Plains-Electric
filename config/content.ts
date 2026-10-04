import { business, diagnosticTerms } from "./business";
export const services = [
  {
    slug: "electrical-repair",
    name: "Electrical Repair",
    summary: "Outlets, switches, breakers, and circuits that stopped working.",
    description:
      "Help with outlets, switches, circuits, and everyday electrical problems in your home or business.",
    icon: "Wrench",
    includes: [
      "Outlet and switch repairs",
      "Circuit issues and power interruptions",
      "Repair recommendations before work begins",
    ],
  },
  {
    slug: "troubleshooting",
    name: "Troubleshooting",
    summary: "An on-site visit to find the cause and explain your options.",
    description:
      `An on-site evaluation to find what’s causing the problem and explain your options. Diagnostic visits are $${business.diagnosticPrice}; repair work is quoted separately.`,
    icon: "Search",
    includes: [
      "On-site electrical evaluation",
      "Clear explanation of findings",
      "Repair or project recommendations",
    ],
  },
  {
    slug: "panel-upgrades",
    name: "Panel Upgrades",
    summary: "More capacity for a remodel, new appliances, or an EV.",
    description:
      "Plan for the electrical demands of your home, an addition, new appliances, or an EV charger.",
    icon: "PanelsTopLeft",
    includes: [
      "Existing panel evaluation",
      "Capacity planning for new equipment",
      "Panel replacement and upgrade planning",
    ],
  },
  {
    slug: "ev-charger-installation",
    name: "EV Charger Installation",
    summary: "Home and workplace chargers, sized to your panel.",
    description:
      "Home and commercial charging planned around your vehicle, parking space, and electrical capacity.",
    icon: "CarFront",
    includes: [
      "Charger location and circuit planning",
      "Electrical capacity evaluation",
      "Home and commercial installation",
    ],
  },
  {
    slug: "lighting",
    name: "Lighting",
    summary: "Interior fixtures, dimmers, and exterior and landscape lighting.",
    description:
      "Indoor, outdoor, and landscape lighting that makes your space comfortable and practical.",
    icon: "Lamp",
    includes: [
      "Interior fixtures and lighting",
      "Exterior and landscape lighting",
      "Switches, dimmers, and controls",
    ],
  },
  {
    slug: "new-construction",
    name: "New Construction",
    summary: "Wiring for new homes, additions, and remodels.",
    description:
      "Electrical planning and installation for new homes, additions, and remodeling projects.",
    icon: "House",
    includes: [
      "New home electrical installation",
      "Remodels and additions",
      "Coordination with your project team",
    ],
  },
  {
    slug: "commercial-electrical",
    name: "Commercial Electrical",
    summary: "Tenant improvements, repairs, and upgrades for businesses.",
    description:
      "Electrical services for businesses, tenant spaces, and property managers throughout San Luis Obispo County.",
    icon: "Building2",
    includes: [
      "Tenant improvements",
      "Commercial repairs and troubleshooting",
      "Lighting and electrical upgrades",
    ],
  },
  {
    slug: "generators",
    name: "Generators",
    summary: "Backup power planning and installation for your property.",
    description:
      "Discuss backup power needs, equipment options, and installation requirements for your property.",
    icon: "Zap",
    includes: [
      "Backup power planning",
      "Equipment and placement evaluation",
      "Installation scope and pricing consultation",
    ],
  },
  {
    slug: "service-plans",
    name: "Service & Maintenance",
    summary: "Ongoing electrical care for homes and managed properties.",
    description:
      "Talk with Nicholas about maintenance needs for your home, business, or managed property. Scope and pricing are confirmed individually.",
    icon: "ClipboardCheck",
    includes: [
      "Property electrical maintenance needs",
      "Preventive service planning",
      "Recommendations tailored to your property",
    ],
  },
];
export const faqs = [
  [
    "How much is a diagnostic visit?",
    `A diagnostic visit is $${business.diagnosticPrice}. It covers on-site troubleshooting and an explanation of what we find. ${diagnosticTerms}`,
  ],
  [
    "Where do you work?",
    "Pacific Plains Electric serves homes and businesses in San Luis Obispo County, California. Contact us to confirm service for your address.",
  ],
  [
    "Can I book an appointment online?",
    "Send a service request with your preferred days or times. We’ll contact you to confirm an appointment.",
  ],
  [
    "Who answers the main phone number?",
    `An automated assistant answers the main line around the clock. Electrician visits are by appointment. To reach Nicholas directly, call ${business.directPhone.display}.`,
  ],
  [
    "Can I speak directly with Nicholas?",
    `Yes. Nicholas Kane’s direct line is ${business.directPhone.display}, or email ${business.email}.`,
  ],
  [
    "Are you licensed?",
    `Yes. Pacific Plains Electric holds California contractor license ${business.license}.`,
  ],
  [
    "Do you work on homes and commercial properties?",
    "Yes. Services include residential and commercial electrical repairs, lighting, panel upgrades, EV chargers, and new construction.",
  ],
];
export const articles = [
  {
    slug: "planning-an-ev-charger",
    title: "Planning an EV charger at home",
    category: "EV charging",
    dek: "A few details to gather before you request an installation.",
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
  },
  {
    slug: "when-to-discuss-a-panel-upgrade",
    title: "When to discuss a panel upgrade",
    category: "Panels",
    dek: "New appliances or a remodel? Start with your electrical capacity.",
    sections: [
      [
        "Tell your electrician what is changing",
        "A remodel, new heating equipment, or an EV charger may affect electrical demand. Share your plans early so electrical work can be considered alongside the rest of the project.",
      ],
      [
        "An evaluation comes first",
        "An upgrade is not automatically required for every new appliance. A professional evaluation helps identify the right scope for the property.",
      ],
      [
        "Keep the next step simple",
        `If you’re not sure where to start, a $${business.diagnosticPrice} diagnostic visit gives you a clear picture of your current system. Repair and project costs are quoted separately.`,
      ],
    ],
  },
  {
    slug: "planning-outdoor-lighting",
    title: "A practical guide to outdoor lighting",
    category: "Lighting",
    dek: "Make entrances, paths, and outdoor spaces work better after sunset.",
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
        "Request a lighting consultation",
        "Share your goals with Nicholas and discuss placement, installation needs, and project pricing.",
      ],
    ],
  },
];
