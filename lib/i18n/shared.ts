export type Language = "en" | "es";
export const translatedPaths = ["/", "/services", "/about", "/contact", "/service-areas", "/request-service", "/faq", "/privacy", "/terms", "/accessibility"];
export function hasSpanish(path: string) {
  return translatedPaths.includes(path) || path.startsWith("/services/") || path.startsWith("/service-areas/");
}
export function spanishPath(path: string) { return path === "/" ? "/es" : `/es${path}`; }
/** Only language preferences are considered. Never infer identity from a name or location. */
export function preferredLanguage(header: string | null): Language {
  const choices = (header || "").split(",").map((entry) => {
    const [tag, ...params] = entry.trim().toLowerCase().split(";");
    const quality = params.find((p) => p.trim().startsWith("q="));
    return { tag: tag.split("-")[0], q: quality ? Number(quality.trim().slice(2)) : 1 };
  }).filter((x) => (x.tag === "en" || x.tag === "es") && x.q > 0 && x.q <= 1).sort((a, b) => b.q - a.q);
  return choices[0]?.tag === "es" ? "es" : "en";
}
export const diagnosticEs = "El cargo de diagnóstico de $180 se aplica como crédito a las reparaciones posteriores que cumplan los requisitos, que usted apruebe y que estén relacionadas con la visita de diagnóstico original. Le daremos un presupuesto antes de que apruebe el trabajo.";
export const smsEs = "Acepto recibir mensajes de texto de Pacific Plains Electric sobre mi solicitud de servicio y mi cita. El consentimiento es opcional y no es una condición para recibir servicio. La frecuencia de los mensajes varía. Pueden aplicarse cargos por mensajes y datos. Responda STOP para cancelar o HELP para obtener ayuda.";
export const serviceNamesEs: Record<string, string> = {
  "electrical-repair": "Problemas y reparaciones eléctricas", "panel-upgrades": "Paneles e interruptores automáticos", "ev-charger-installation": "Instalación de cargadores para vehículos eléctricos", lighting: "Iluminación y tomacorrientes", "new-construction": "Remodelaciones y nuevas construcciones", other: "Otro servicio / No estoy seguro", troubleshooting: "Diagnóstico eléctrico", "residential-electrical": "Servicios eléctricos residenciales", "commercial-electrical": "Servicios eléctricos comerciales", "outlet-switch-installation": "Tomacorrientes e interruptores", "dedicated-circuits": "Circuitos dedicados", "remodel-electrical": "Electricidad para remodelaciones", generators: "Generadores", "service-plans": "Planes de servicio",
};
export const serviceSummariesEs: Record<string, string> = {
  "electrical-repair": "Tomacorrientes que no funcionan, interruptores automáticos que se disparan, luces que parpadean y otros problemas eléctricos.", "panel-upgrades": "Actualizaciones de paneles, capacidad eléctrica y problemas con interruptores automáticos.", "ev-charger-installation": "Instalación de cargadores en el hogar y preparación del sistema eléctrico.", lighting: "Instalación o reemplazo de luces, tomacorrientes, interruptores y accesorios.", "new-construction": "Trabajo eléctrico para renovaciones, ampliaciones y proyectos nuevos.", other: "Cuéntenos qué sucede y le ayudaremos a identificar el servicio adecuado.", troubleshooting: "Una visita de $180 para identificar la causa del problema y explicar las opciones de reparación.", "residential-electrical": "Reparaciones, mejoras e instalaciones para hogares, propiedades de alquiler y administradores de propiedades.", "commercial-electrical": "Reparaciones, iluminación y trabajo eléctrico para negocios y propiedades comerciales.", "outlet-switch-installation": "Instalación y reemplazo de tomacorrientes e interruptores según las necesidades de su propiedad.", "dedicated-circuits": "Circuitos para electrodomésticos y equipos que requieren su propia alimentación eléctrica.", "remodel-electrical": "Planificación e instalación eléctrica para renovar cocinas, baños y otros espacios.", generators: "Consulte las opciones de alimentación de respaldo y los requisitos eléctricos de su propiedad.", "service-plans": "Consulte las opciones de mantenimiento y servicio para su propiedad.",
};
