import { findService } from "./content";

/** Six plain-language entry points; legacy service links remain valid. */
export const intakeCategories = [
  {
    slug: "electrical-repair",
    name: "Electrical Problems & Repairs",
    summary:
      "Outlets not working, breakers tripping, flickering lights, or other electrical problems.",
    action: "Get Help",
    icon: "Wrench",
  },
  {
    slug: "panel-upgrades",
    name: "Electrical Panels & Breakers",
    summary:
      "Panel upgrades, electrical capacity concerns, and breaker issues.",
    action: "Request Service",
    icon: "Zap",
  },
  {
    slug: "ev-charger-installation",
    name: "EV Charger Installation",
    summary: "Home EV charger installation and electrical preparation.",
    action: "Request Installation",
    icon: "CarFront",
  },
  {
    slug: "lighting",
    name: "Lighting & Outlets",
    summary: "Install or replace lights, outlets, switches, and fixtures.",
    action: "Request Service",
    icon: "Lamp",
  },
  {
    slug: "new-construction",
    name: "Remodeling & New Construction",
    summary: "Electrical work for renovations, additions, and new projects.",
    action: "Discuss Your Project",
    icon: "House",
  },
  {
    slug: "other",
    name: "Something Else / I’m Not Sure",
    summary: "Not sure which service you need? Tell us what’s happening.",
    action: "Describe Your Problem",
    icon: "Wrench",
  },
] as const;
export function intakeServiceName(slug: string) {
  return (
    intakeCategories.find((s) => s.slug === slug)?.name ??
    findService(slug)?.name ??
    slug
  );
}
