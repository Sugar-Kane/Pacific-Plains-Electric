import { useId } from "react";
import artwork from "./service-animation-artwork.json";

// Reviewed, repository-owned SVG only. Never pass user-supplied HTML here.
export default function ServiceAnimation({ service, spanish = false }: { service: string; spanish?: boolean }) {
  const instance = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  if (!(service in artwork)) return null;
  let svg = artwork[service as keyof typeof artwork].replaceAll("__INSTANCE__", `service-${instance}-`);
  if (spanish) {
    for (const [english, translated] of translations) svg = svg.replaceAll(english, translated);
  }
  return <span className="service-animation" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}
const translations = [
  ["RATED 15 A · 125 V", "NOMINAL 15 A · 125 V"],
  ["EXAMPLE · 120/240 V AC", "EJEMPLO · 120/240 V CA"],
  ["EXAMPLE READING · 120 V AC", "LECTURA DE EJEMPLO · 120 V CA"],
  ["HOME LEVEL 2 · ILLUSTRATED ENERGY FLOW", "NIVEL 2 EN CASA · FLUJO ILUSTRADO"],
  ["POWER FLOW · CHARGING", "ENERGÍA · CARGANDO"],
  ["CHARGING", "CARGANDO"], ["VOLTAGE • AC", "VOLTAJE • CA"],
  ["KITCHEN", "COCINA"], ["LIGHTING", "LUCES"], ["BEDROOMS", "CUARTOS"],
  ["OUTLETS", "TOMAS"], ["LAUNDRY", "LAVADO"], ["GARAGE", "GARAJE"],
  ["CIRCUIT DIRECTORY", "CIRCUITOS"], ["DIMMABLE LED", "LED REGULABLE"],
  ["LIGHT THAT FEELS RIGHT", "LA LUZ IDEAL"],
  ["FROM ROUGH-IN TO FINISHED ROOM", "DE INSTALACIÓN A ESPACIO TERMINADO"],
  ["CLARITY STARTS WITH A DIAGNOSIS", "TODO EMPIEZA CON UN DIAGNÓSTICO"],
] as const;
