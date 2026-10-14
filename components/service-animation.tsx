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
  ["POWER FLOW · CHARGING", "ENERGÍA · CARGANDO"],
  ["CHARGING", "CARGANDO"], ["VOLTAGE • AC", "VOLTAJE • CA"],
  ["KITCHEN", "COCINA"], ["LIGHTING", "LUCES"], ["BEDROOMS", "CUARTOS"],
  ["OUTLETS", "TOMAS"], ["LAUNDRY", "LAVADO"], ["GARAGE", "GARAJE"],
  ["CIRCUIT DIRECTORY", "CIRCUITOS"], ["DIMMABLE LED", "LED REGULABLE"],
  ["LIGHT THAT FEELS RIGHT", "LA LUZ IDEAL"],
  ["FROM ROUGH-IN TO FINISHED ROOM", "DE INSTALACIÓN A ESPACIO TERMINADO"],
  ["CLARITY STARTS WITH A DIAGNOSIS", "TODO EMPIEZA CON UN DIAGNÓSTICO"],
] as const;
