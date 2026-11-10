/**
 * Spanish content, one entry for every English entry in config/content.ts and
 * config/areas.ts: the same services, the same lists in the same order, the
 * same FAQs. tests/i18n-parity.test.ts fails if a list here and its English
 * counterpart drift apart.
 *
 * Prices, license numbers, the utility (PG&E, Southern California Edison) and
 * code names (Title 24, GFCI, AFCI) stay exactly as in English.
 */
import { business } from "./business";
import { diagnosticEs } from "@/lib/i18n/shared";

export type ServiceEs = {
  description: string;
  metaDescription: string;
  overview: string[];
  reasons: string[];
  warningSigns?: string[];
  includes: string[];
  faqs: { q: string; a: string }[];
};

const price = `$${business.diagnosticPrice}`;

export const servicesEs: Record<string, ServiceEs> = {
  "residential-electrical": {
    description: "Pacific Plains Electric ofrece servicios eléctricos residenciales para propietarios, arrendadores y administradores de propiedades en los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Servicios eléctricos residenciales: diagnóstico, reparaciones, mejoras de panel, cargadores para vehículos eléctricos, iluminación y cableado para remodelaciones. CSLB #1162180.",
    overview: [
      "La mayoría del trabajo eléctrico en el hogar se divide en tres grupos: encontrar y reparar problemas, aumentar la capacidad e instalar algo nuevo. Pacific Plains Electric atiende los tres en casas unifamiliares, propiedades de alquiler y unidades de vivienda accesorias (ADU).",
      "Si no está seguro de lo que necesita, empiece por describir lo que sucede. Le diremos si necesita una visita de diagnóstico o un presupuesto para trabajo nuevo.",
    ],
    reasons: [
      "Un tomacorriente, interruptor o luz dejó de funcionar",
      "Los interruptores automáticos se disparan o las luces bajan cuando funcionan los electrodomésticos",
      "Agregar un cargador para vehículo eléctrico, bomba de calor, spa o ADU",
      "Remodelar una cocina, un baño o un garaje",
      "Actualizar la iluminación interior o exterior",
      "Preparar una propiedad de alquiler entre inquilinos",
    ],
    includes: [
      "Diagnóstico y reparación",
      "Instalación de tomacorrientes, interruptores y lámparas",
      "Circuitos dedicados para electrodomésticos y equipos",
      "Mejora y reemplazo de paneles",
      "Instalación de cargadores para vehículos eléctricos",
      "Cableado para remodelaciones y ampliaciones",
    ],
    faqs: [
      { q: "¿Trabajan en propiedades de alquiler y propiedades que administro?", a: "Sí. Pacific Plains Electric trabaja con propietarios, arrendadores y administradores de propiedades. Indíquenos quién dará acceso y quién aprueba el trabajo." },
      { q: "¿Qué hago si no sé cuál es el problema?", a: `Solicite una visita de diagnóstico. Cuesta ${price} e incluye la revisión en el lugar y una explicación de lo que encontremos. ${diagnosticEs}` },
    ],
  },
  troubleshooting: {
    description: `Pacific Plains Electric diagnostica problemas eléctricos en hogares y negocios de los condados de San Luis Obispo y Santa Barbara. La visita de diagnóstico cuesta ${price}.`,
    metaDescription: `¿Se dispara un interruptor, no funciona un tomacorriente o parpadean las luces? Una visita de diagnóstico de ${price} encuentra la causa y explica las opciones de reparación.`,
    overview: [
      "Los problemas eléctricos muchas veces no están donde aparecen. Un tomacorriente sin corriente puede deberse a un GFCI disparado dos habitaciones más allá, y un interruptor que se dispara de noche puede ser un electrodoméstico defectuoso y no el circuito. Diagnosticar significa rastrear el síntoma hasta la causa antes de reemplazar algo.",
      `La visita de diagnóstico cuesta ${price}. Incluye la revisión en el lugar y una explicación clara de lo que encontremos y de las opciones para repararlo. ${diagnosticEs}`,
    ],
    reasons: [
      "Una parte de la casa se quedó sin electricidad",
      "Un interruptor automático se dispara una y otra vez o no se restablece",
      "Los tomacorrientes o interruptores dejaron de funcionar",
      "Las luces parpadean o bajan de intensidad",
      "Un GFCI se dispara con frecuencia, sobre todo cuando llueve",
      "Huele a quemado o una placa de interruptor se siente caliente",
    ],
    warningSigns: [
      "Olor a quemado, marcas de quemadura o plástico derretido en un tomacorriente o en el panel",
      "Zumbidos o chasquidos en un interruptor, tomacorriente o panel",
      "Tomacorrientes o placas que se sienten calientes al tocarlos",
      "Descargas u hormigueo al tocar un electrodoméstico o una lámpara",
    ],
    includes: [
      "Revisión en el lugar de los circuitos afectados",
      "Pruebas de tomacorrientes, interruptores, interruptores automáticos y conexiones",
      "Una explicación clara de la causa",
      "Opciones de reparación y un presupuesto antes de empezar el trabajo",
    ],
    faqs: [
      { q: "¿Cuánto cuesta una visita de un electricista?", a: `La visita de diagnóstico cuesta ${price}. ${diagnosticEs}` },
      { q: "¿Debo seguir restableciendo un interruptor automático que se dispara?", a: "No. Un interruptor que se vuelve a disparar enseguida está haciendo su trabajo. Desconecte lo que esté en ese circuito, restablézcalo una vez y, si se vuelve a disparar, déjelo apagado y pida que lo revisen." },
    ],
  },
  "electrical-repair": {
    description: "Pacific Plains Electric repara tomacorrientes, interruptores, lámparas, interruptores automáticos y circuitos en hogares y negocios de los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Reparación de tomacorrientes, interruptores, interruptores automáticos, lámparas y circuitos en hogares y negocios. Contratista con licencia, CSLB #1162180.",
    overview: [
      "La mayoría de las reparaciones eléctricas se deben a un dispositivo desgastado, una conexión floja o sobrecalentada, o una sección de cableado dañada. Una vez que se encuentra la causa, la reparación suele ser sencilla; por eso empezamos con pruebas, no con suposiciones.",
      "Si la causa ya está clara, como un tomacorriente roto o un interruptor que falló, podemos darle un presupuesto directamente. Si no, empezamos con una visita de diagnóstico.",
    ],
    reasons: [
      "Tomacorrientes agrietados, flojos o quemados",
      "Interruptores y reguladores de intensidad que dejaron de funcionar",
      "Lámparas que parpadean o no encienden",
      "Interruptores automáticos desgastados o que no se mantienen",
      "Cableado dañado después de una remodelación, plagas o una fuga de agua",
    ],
    warningSigns: [
      "Enchufes que se salen del tomacorriente",
      "Tomacorrientes e interruptores descoloridos o calientes",
      "Luces que parpadean cuando se enciende otro aparato",
    ],
    includes: [
      "Reparación y reemplazo de tomacorrientes e interruptores",
      "Reparación de circuitos y conexiones",
      "Reemplazo de interruptores automáticos",
      "Reparación de lámparas",
      "Recomendaciones de reparación antes de empezar el trabajo",
    ],
    faqs: [
      { q: "¿Pueden revisar tomacorrientes que dejaron de funcionar?", a: "Sí. Primero revise si hay un tomacorriente GFCI disparado cerca (cocina, baño, garaje o exterior) y un interruptor automático disparado. Si ninguno lo resuelve, podemos rastrear el circuito y reparar la causa." },
    ],
  },
  "panel-upgrades": {
    description: "Pacific Plains Electric evalúa, mejora y reemplaza paneles eléctricos en hogares y negocios de los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Mejora y reemplazo de paneles eléctricos. Evaluaciones de carga para cargadores de vehículos eléctricos, bombas de calor y remodelaciones, por un electricista con licencia.",
    overview: [
      "El panel distribuye la electricidad de la compañía eléctrica a cada circuito del edificio. Una mejora suele significar más capacidad (por ejemplo, pasar de 100 a 200 amperios), más espacios para interruptores o reemplazar un panel antiguo que está desgastado o no es confiable.",
      "Una mejora no siempre es necesaria. Una evaluación de carga compara lo que consume la casa, y lo que usted piensa agregar, con lo que el servicio actual puede suministrar. A veces basta con un circuito nuevo o un dispositivo de control de carga.",
      "Las mejoras del servicio requieren un permiso e inspección del departamento de construcción local y coordinación con la compañía eléctrica, que es PG&E en la mayor parte del condado de San Luis Obispo. Le explicaremos los requisitos del permiso junto con el presupuesto.",
    ],
    reasons: [
      "Agregar un cargador para vehículo eléctrico, bomba de calor, spa o ADU",
      "Una remodelación que agrega circuitos",
      "No queda espacio para interruptores nuevos",
      "Reemplazar un panel antiguo o poco confiable",
      "El seguro o la venta de la casa señaló un problema con el panel",
    ],
    warningSigns: [
      "Interruptores automáticos que se disparan a menudo o se sienten calientes",
      "Un panel que zumba, huele a quemado o tiene óxido o quemaduras",
      "Fusibles en lugar de interruptores automáticos",
      "Marcas de paneles antiguos con problemas de confiabilidad documentados, como Federal Pacific Stab-Lok y Zinsco",
      "Luces que bajan de intensidad cuando arrancan los electrodomésticos grandes",
    ],
    includes: [
      "Evaluación del panel actual y de la carga",
      "Planificación de capacidad para equipos nuevos",
      "Reemplazo de panel y mejoras del servicio",
      "Subpaneles para garajes, ADU y construcciones anexas",
    ],
    faqs: [
      { q: "¿Cómo sé si necesito mejorar mi panel?", a: "Las señales comunes son interruptores que se disparan con frecuencia, no tener espacios libres para interruptores, una caja de fusibles o un panel antiguo, y planes de agregar un cargador para vehículo eléctrico, una bomba de calor o una ampliación. Una evaluación de carga lo confirma." },
      { q: "¿Mejoran paneles eléctricos?", a: "Sí. Pacific Plains Electric evalúa, mejora y reemplaza paneles en hogares y negocios de los condados de San Luis Obispo y Santa Barbara." },
    ],
  },
  "ev-charger-installation": {
    description: "Pacific Plains Electric instala cargadores de nivel 2 para vehículos eléctricos, incluidos los Tesla Wall Connector, en hogares y negocios de los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Instalación de cargadores de nivel 2 para vehículos eléctricos y Tesla Wall Connector, con circuitos adecuados a su panel y su vehículo. Contratista eléctrico con licencia.",
    overview: [
      "Un cargador de nivel 2 funciona con un circuito dedicado de 240 voltios y es la instalación más común en el hogar. Como la carga de un vehículo eléctrico es una carga continua, el circuito se dimensiona al 125 % de la salida del cargador. Un cargador de 48 amperios necesita un circuito de 60 amperios; uno de 32 amperios necesita un circuito de 40 amperios.",
      "El tamaño adecuado del cargador depende de cuánto maneja, de lo que acepta su vehículo y de cuánta capacidad le sobra a su panel. Muchos cargadores, incluido el Tesla Wall Connector, se pueden configurar a una corriente menor para que funcionen con el panel actual.",
    ],
    reasons: [
      "Un vehículo eléctrico o híbrido enchufable nuevo",
      "Dejar de cargar en un tomacorriente común de 120 voltios",
      "Agregar un segundo cargador para un segundo vehículo",
      "Carga en el lugar de trabajo o para inquilinos",
    ],
    includes: [
      "Evaluación de la capacidad del panel y de la carga",
      "Planificación de la ubicación del cargador y del circuito",
      "Instalación del circuito dedicado",
      "Instalación de cargador cableado y de tomacorriente de 240 voltios",
      "Instalaciones residenciales y comerciales",
    ],
    faqs: [
      { q: "¿Pueden instalar un Tesla Wall Connector?", a: "Sí. El Tesla Wall Connector es un cargador de nivel 2 cableado. Se instala en un circuito dedicado y su corriente se ajusta a ese circuito y a la capacidad disponible de su panel." },
      { q: "¿Mi panel eléctrico puede soportar un cargador para vehículo eléctrico?", a: "Muchas veces sí, a veces con una corriente de carga menor. Una evaluación de carga compara el consumo actual de su casa con la carga del cargador. Si falta capacidad, las opciones incluyen un circuito más pequeño, un dispositivo de control de carga o una mejora del panel." },
      { q: "¿Cuánto cuesta instalar un cargador para vehículo eléctrico?", a: "Depende de la distancia entre el panel y el lugar de estacionamiento, del tamaño del circuito y de si el panel necesita trabajo. Damos el presupuesto cuando conocemos esos detalles." },
    ],
  },
  lighting: {
    description: "Pacific Plains Electric instala y repara iluminación interior, exterior y de jardín en hogares y negocios de los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Instalación de iluminación interior, exterior y de jardín: lámparas, luces empotradas, reguladores de intensidad y controles, por un electricista con licencia.",
    overview: [
      "El trabajo de iluminación va desde cambiar una lámpara hasta agregar luces empotradas, luces debajo de los gabinetes, luces de seguridad exteriores e iluminación de caminos o jardín con temporizadores o sensores de movimiento.",
      "El código de energía Title 24 de California establece requisitos de iluminación para construcciones nuevas y muchas remodelaciones, incluidos lámparas y controles eficientes en ciertas habitaciones. Planificaremos el trabajo de acuerdo con esos requisitos.",
    ],
    reasons: [
      "Habitaciones demasiado oscuras",
      "Reemplazar lámparas anticuadas o que fallan",
      "Agregar luces empotradas o debajo de los gabinetes",
      "Iluminación exterior, de caminos y de seguridad",
      "Reguladores de intensidad, temporizadores y sensores de movimiento",
    ],
    includes: [
      "Lámparas interiores y luces empotradas",
      "Iluminación exterior y de jardín",
      "Interruptores, reguladores de intensidad y controles",
      "Mejoras de iluminación comercial",
    ],
    faqs: [
      { q: "¿Pueden instalar iluminación exterior cerca de la costa?", a: "Sí. Cerca de la costa recomendamos lámparas y cubiertas aptas para lugares húmedos y corrosivos, porque el aire salino acorta la vida útil de los accesorios exteriores comunes." },
    ],
  },
  "outlet-switch-installation": {
    description: "Pacific Plains Electric instala, reemplaza y repara tomacorrientes e interruptores, incluidos los tomacorrientes GFCI, AFCI y USB, en los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Instalación de tomacorrientes e interruptores: tomacorrientes nuevos, protección GFCI y AFCI, tomacorrientes USB, reguladores de intensidad y reemplazo de tomacorrientes de dos clavijas.",
    overview: [
      "Los tomacorrientes y los interruptores se desgastan, y muchas casas no tienen suficientes donde se necesitan. Los trabajos comunes incluyen agregar tomacorrientes, reemplazar dispositivos desgastados o dañados, agregar protección GFCI en cocinas, baños, garajes y exteriores, y actualizar tomacorrientes de dos clavijas sin conexión a tierra.",
      "Un tomacorriente de dos clavijas no se puede cambiar simplemente por uno de tres, a menos que haya conexión a tierra. Según el cableado, las opciones son instalar una conexión a tierra o agregar protección GFCI con el etiquetado correspondiente.",
    ],
    reasons: [
      "No hay suficientes tomacorrientes donde los necesita",
      "Tomacorrientes de dos clavijas en una casa antigua",
      "Falta protección GFCI cerca del agua",
      "Tomacorrientes flojos, agrietados o calientes",
      "Agregar reguladores de intensidad, interruptores inteligentes o tomacorrientes USB",
    ],
    warningSigns: [
      "Enchufes que no se quedan conectados",
      "Decoloración u olor a quemado en un tomacorriente",
      "Interruptores que se sienten calientes o zumban",
    ],
    includes: [
      "Instalación de tomacorrientes nuevos",
      "Protección GFCI y AFCI",
      "Actualización de tomacorrientes de dos clavijas",
      "Instalación de interruptores, reguladores de intensidad e interruptores inteligentes",
      "Tomacorrientes exteriores resistentes a la intemperie",
    ],
    faqs: [
      { q: "¿Cuál es la diferencia entre GFCI y AFCI?", a: "La protección GFCI evita descargas al cortar la electricidad cuando hay una fuga de corriente a tierra; por eso se exige cerca del agua. La protección AFCI reduce el riesgo de incendio al detectar arcos peligrosos en el cableado. Algunos dispositivos ofrecen ambas." },
    ],
  },
  "dedicated-circuits": {
    description: "Pacific Plains Electric instala circuitos dedicados para electrodomésticos, cargadores de vehículos eléctricos, talleres y equipos en hogares y negocios de los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Circuitos dedicados para electrodomésticos de cocina, cargadores de vehículos eléctricos, spas, bombas de calor, talleres y equipos comerciales. Electricista con licencia.",
    overview: [
      "Un circuito dedicado alimenta un solo electrodoméstico o equipo, así que no comparte capacidad con nada más. Las cargas grandes o con motor necesitan uno, y el código exige muchos: estufas, secadoras, lavavajillas, microondas, cargadores de vehículos eléctricos, spas y bombas de calor, entre otros.",
      "Agregar un circuito empieza por confirmar que el panel tiene la capacidad y un espacio libre para el interruptor.",
    ],
    reasons: [
      "Una estufa, secadora u otro electrodoméstico nuevo de 240 voltios",
      "Un cargador para vehículo eléctrico, spa o bomba de calor",
      "Un taller en el garaje o una oficina en casa",
      "Congeladores y equipos que no deben compartir un circuito",
      "Equipos para cocinas comerciales o talleres",
    ],
    warningSigns: [
      "Un interruptor automático se dispara cuando funcionan dos electrodomésticos a la vez",
      "Extensiones usadas como cableado permanente",
    ],
    includes: [
      "Circuitos dedicados de 120 y 240 voltios",
      "Revisión de la capacidad del panel",
      "Subpaneles para garajes y construcciones anexas",
      "Tomacorrientes y conexiones para el equipo",
    ],
    faqs: [
      { q: "¿Mi electrodoméstico necesita su propio circuito?", a: "Revise el manual de instalación; indica el tamaño de circuito que necesita. La mayoría de los electrodomésticos de 240 voltios, y muchos de cocina, requieren un circuito dedicado." },
    ],
  },
  "remodel-electrical": {
    description: "Pacific Plains Electric planifica e instala el trabajo eléctrico para remodelaciones de cocinas, baños y casas completas en los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Trabajo eléctrico para remodelaciones de cocinas, baños y casas completas, desde circuitos nuevos e iluminación hasta capacidad del panel y actualizaciones al código.",
    overview: [
      "Una remodelación es el mejor momento para actualizar el sistema eléctrico, porque las paredes están abiertas. Las cocinas suelen necesitar varios circuitos dedicados para electrodomésticos y tomacorrientes de encimera con protección GFCI; los baños necesitan protección GFCI y sus propios circuitos; y la iluminación nueva debe cumplir los requisitos del Title 24 de California.",
      "En las casas antiguas de la Costa Central, una remodelación también puede revelar cableado original, circuitos sin conexión a tierra o un panel sin espacio para lo que se agrega. Planificar la parte eléctrica desde el principio evita sorpresas más adelante.",
    ],
    reasons: [
      "Remodelaciones de cocinas y baños",
      "Ampliaciones de habitaciones y conversiones de garaje",
      "Construcción de ADU",
      "Actualizar el cableado de una casa antigua",
    ],
    includes: [
      "Planificación eléctrica con usted y su contratista",
      "Circuitos, tomacorrientes e iluminación nuevos",
      "Evaluación y mejora de la capacidad del panel",
      "Coordinación con el resto del equipo del proyecto",
    ],
    faqs: [
      { q: "¿Las remodelaciones necesitan un permiso eléctrico?", a: "La mayoría de las remodelaciones que agregan o modifican circuitos lo necesitan. Los permisos los emite el departamento de construcción de su ciudad o, en las zonas no incorporadas, el condado de San Luis Obispo. Le explicaremos los requisitos del permiso junto con el presupuesto." },
    ],
  },
  "new-construction": {
    description: "Pacific Plains Electric ofrece planificación e instalación eléctrica para casas nuevas, ampliaciones y ADU en los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Planificación e instalación eléctrica para casas nuevas, ampliaciones y ADU, coordinadas con su constructor y el equipo del proyecto.",
    overview: [
      "La parte eléctrica de una construcción nueva incluye el servicio, el panel, el cableado preliminar y el acabado de una casa nueva, una ampliación o una unidad de vivienda accesoria, además de las inspecciones intermedias.",
      "Definir el plan eléctrico desde el principio, incluida la ubicación de tomacorrientes, iluminación y carga para vehículos eléctricos, mantiene el proyecto en marcha y evita cambios después de cerrar las paredes.",
    ],
    reasons: [
      "Casas nuevas",
      "Ampliaciones de habitaciones",
      "Unidades de vivienda accesorias (ADU)",
      "Garajes independientes y construcciones anexas",
    ],
    includes: [
      "Planificación y distribución eléctrica",
      "Instalación del servicio y del panel",
      "Cableado preliminar y de acabado",
      "Coordinación con el equipo de su proyecto",
    ],
    faqs: [],
  },
  "commercial-electrical": {
    description: "Pacific Plains Electric ofrece servicios eléctricos comerciales para negocios, locales comerciales y administradores de propiedades en los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Servicios eléctricos comerciales: adecuaciones de locales, diagnóstico, mejoras de iluminación y circuitos para equipos de negocios.",
    overview: [
      "Los negocios necesitan un trabajo eléctrico confiable y programado según su horario de operación. El trabajo comercial incluye adecuaciones para locales nuevos o que cambian, diagnóstico y reparaciones, mejoras de iluminación y circuitos para equipos.",
    ],
    reasons: [
      "Mudarse a un local o reorganizarlo",
      "Iluminación débil, que falla o es ineficiente",
      "Equipos nuevos que necesitan electricidad",
      "Disparos o cortes que se repiten",
      "Carga de vehículos eléctricos en el lugar de trabajo",
    ],
    includes: [
      "Adecuaciones de locales",
      "Reparaciones y diagnóstico comerciales",
      "Mejoras de iluminación",
      "Circuitos dedicados para equipos",
    ],
    faqs: [
      { q: "¿Realizan trabajo eléctrico comercial?", a: "Sí. Pacific Plains Electric trabaja con negocios y administradores de propiedades en los condados de San Luis Obispo y Santa Barbara." },
    ],
  },
  generators: {
    description: "Pacific Plains Electric planifica e instala conexiones de generadores de respaldo para hogares y negocios en los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Planificación e instalación de generadores de respaldo, incluidos interruptores de transferencia y enclavamientos para conectar el generador al panel de forma segura.",
    overview: [
      "Un generador debe conectarse al panel mediante un interruptor de transferencia o un enclavamiento aprobado. Así no envía electricidad de regreso a la línea de la compañía eléctrica, lo que puede lesionar a los trabajadores de la línea, ni choca con la red cuando vuelve la electricidad. Conectar un generador a un tomacorriente de la casa nunca es seguro.",
      "La planificación empieza por decidir qué quiere mantener funcionando durante un corte y si le conviene un generador portátil o uno fijo.",
    ],
    reasons: [
      "Mantener lo esencial funcionando durante los cortes",
      "Bombas de pozo, refrigeración y equipo médico",
      "Conectar un generador portátil de forma segura",
    ],
    includes: [
      "Planificación de energía de respaldo",
      "Instalación de interruptor de transferencia y enclavamiento",
      "Evaluación del equipo y de su ubicación",
      "Alcance y precio de la instalación",
    ],
    faqs: [],
  },
  "service-plans": {
    description: "Pacific Plains Electric ofrece servicio y mantenimiento eléctrico periódico para hogares, negocios y propiedades administradas en los condados de San Luis Obispo y Santa Barbara.",
    metaDescription: "Servicio eléctrico periódico para hogares, propiedades de alquiler y propiedades administradas. El alcance y el precio se confirman individualmente con Nicholas Kane.",
    overview: [
      "Los propietarios y administradores con varias unidades, o los negocios que no pueden permitirse interrupciones, suelen preferir un acuerdo periódico en lugar de llamadas aisladas. El alcance y el precio se confirman individualmente.",
    ],
    reasons: [
      "Cambios de inquilinos",
      "Propiedades administradas",
      "Negocios que necesitan mantenimiento planificado",
    ],
    includes: [
      "Necesidades de mantenimiento eléctrico de la propiedad",
      "Planificación de servicio preventivo",
      "Recomendaciones adaptadas a su propiedad",
    ],
    faqs: [],
  },
};

/** The same steps as `process` in config/content.ts. */
export const processEs = [
  { title: "Cuéntenos qué necesita", body: "Envíe una solicitud breve o llámenos." },
  { title: "Confirmamos los detalles", body: "Hablamos de sus necesidades eléctricas y coordinamos una cita. Una solicitud no reserva un horario." },
  { title: "Realizamos el trabajo", body: "Su electricista evalúa el trabajo y le explica las opciones de reparación y el precio antes de que usted apruebe los siguientes pasos." },
];

/** The same answered questions, in the same order, as `answeredFaqs` in config/content.ts. */
export const faqsEs: { q: string; a: string }[] = [
  { q: "¿En qué zonas ofrece servicio Pacific Plains Electric?", a: "Pacific Plains Electric atiende hogares y negocios en todo el condado de San Luis Obispo, California, incluidos San Luis Obispo, Arroyo Grande, Grover Beach, Pismo Beach, Nipomo, Avila Beach, Morro Bay, Atascadero y Paso Robles, además de todo el condado de Santa Barbara. Contáctenos para confirmar el servicio en su dirección." },
  { q: "¿Cuánto cuesta una visita de un electricista?", a: `La visita de diagnóstico cuesta ${price}. Incluye la revisión en el lugar y una explicación de lo que encontremos. ${diagnosticEs}` },
  { q: "¿Pacific Plains Electric es un electricista con licencia?", a: `Sí. Pacific Plains Electric es un contratista con licencia en California, ${business.license}, propiedad de ${business.owner}.` },
  { q: "¿Pacific Plains Electric instala cargadores para vehículos eléctricos?", a: "Sí, incluidos cargadores de nivel 2 para el hogar como el Tesla Wall Connector, en hogares y negocios. El circuito se dimensiona según el cargador y la capacidad disponible de su panel." },
  { q: "¿Mejoran paneles eléctricos?", a: "Sí. Evaluamos, mejoramos y reemplazamos paneles, empezando con una evaluación de carga para confirmar lo que realmente necesita." },
  { q: "¿Hacen trabajo eléctrico residencial y comercial?", a: "Ambos. Pacific Plains Electric trabaja con propietarios, arrendadores, administradores de propiedades y negocios." },
  { q: "¿Puedo programar una cita con un electricista en línea?", a: "Todavía no es posible reservar en línea. Envíe una solicitud de servicio con los días u horarios que prefiera y nos comunicaremos con usted para confirmar una cita. También puede llamar o enviar un mensaje de texto." },
  { q: "¿Ofrecen servicio de emergencia las 24 horas?", a: "Un asistente automatizado contesta la línea principal a toda hora, pero las visitas del electricista se programan con cita. Si hay fuego, humo, chispas o cualquier peligro inmediato, aléjese y llame al 911." },
  { q: "¿Quién contesta el número de teléfono principal?", a: `Un asistente automatizado contesta la línea principal, ${business.workPhone.display}. Para comunicarse directamente con ${business.owner}, escriba a ${business.email}.` },
];

export type AreaEs = { intro: string; considerations: { title: string; body: string }[] };

/** Same areas and the same considerations, in the same order, as config/areas.ts. */
export const areasEs: Record<string, AreaEs> = {
  "san-luis-obispo": {
    intro: "Pacific Plains Electric ofrece servicios eléctricos residenciales y comerciales en la ciudad de San Luis Obispo, desde diagnóstico y reparaciones en casas antiguas hasta mejoras de panel y cargadores para vehículos eléctricos en casas más nuevas.",
    considerations: [
      { title: "Casas antiguas cerca del centro", body: "Muchas casas de los barrios antiguos alrededor del centro se cablearon para mucho menos de lo que consume un hogar moderno. Los tomacorrientes de dos clavijas, los paneles pequeños y los circuitos que se disparan cuando funcionan juntos el microondas y la tostadora son motivos comunes para una visita de diagnóstico." },
      { title: "Propiedades de alquiler y administradores", body: "Con un gran mercado de alquiler alrededor de Cal Poly, gran parte del trabajo eléctrico aquí son reparaciones entre inquilinos, reemplazo de luces y tomacorrientes, y confirmar que los circuitos de las alarmas de humo y de la cocina funcionan antes de la mudanza." },
      { title: "ADU, vehículos eléctricos y capacidad del panel", body: "Agregar una unidad de vivienda accesoria, una bomba de calor o un cargador para vehículo eléctrico usa el mismo panel. Una evaluación de carga indica si el servicio actual puede soportarlo o si primero necesita una mejora." },
    ],
  },
  nipomo: {
    intro: "Pacific Plains Electric atiende a propietarios y negocios en Nipomo, incluidas las urbanizaciones más nuevas y las propiedades rurales más grandes de Nipomo Mesa.",
    considerations: [
      { title: "Terrenos grandes y construcciones anexas", body: "Los garajes independientes, talleres, graneros y cobertizos suelen necesitar su propio alimentador o subpanel. Llevar electricidad a una construcción anexa se planifica según la distancia, la carga y la capacidad disponible del panel principal." },
      { title: "Pozos, bombas y portones", body: "Las parcelas rurales suelen depender de bombas de pozo, motores de portones e iluminación exterior en circuitos largos. Cuando una bomba o un portón deja de funcionar, la causa suele ser un interruptor automático que falló, una mala conexión o una caída de voltaje en el recorrido." },
      { title: "Casas nuevas que agregan carga para vehículos eléctricos", body: "Muchas casas nuevas de Nipomo tienen espacio en el panel para un cargador de nivel 2, pero conviene confirmarlo con una evaluación de carga antes de elegir el tamaño del cargador." },
    ],
  },
  "arroyo-grande": {
    intro: "Pacific Plains Electric ofrece reparaciones, mejoras e instalaciones eléctricas para hogares y negocios en Arroyo Grande, desde el histórico Village hasta los barrios más nuevos.",
    considerations: [
      { title: "Casas antiguas y el Village", body: "Las casas y los locales antiguos pueden tener paneles anticuados, tomacorrientes sin conexión a tierra o cableado al que se le han hecho agregados con los años. Las remodelaciones son un buen momento para actualizar los circuitos al código vigente." },
      { title: "Remodelaciones de cocinas y baños", body: "Las cocinas modernas necesitan varios circuitos dedicados para electrodomésticos y protección GFCI cerca del agua. Planificar la parte eléctrica desde el principio mantiene la remodelación a tiempo." },
      { title: "Agregar cargas a un panel existente", body: "Los cargadores para vehículos eléctricos, los spas y las bombas de calor son los motivos más comunes por los que un panel se queda sin espacio. Una evaluación de carga muestra si necesita una mejora o solo un circuito nuevo." },
    ],
  },
  "grover-beach": {
    intro: "Pacific Plains Electric atiende hogares y negocios en Grover Beach, donde muchas casas pequeñas y antiguas se están actualizando para la forma en que se vive hoy.",
    considerations: [
      { title: "Paneles pequeños en casas antiguas", body: "Las casas antiguas suelen tener servicios eléctricos más pequeños y menos circuitos de los que necesita un hogar moderno. Los disparos frecuentes de los interruptores y las luces que bajan de intensidad indican que el panel o un circuito están sobrecargados." },
      { title: "Aire salino cerca de la playa", body: "El aire de la costa corroe las lámparas exteriores, los tomacorrientes exteriores, las bases de los medidores y las conexiones del panel más rápido que tierra adentro. Aquí duran más las lámparas resistentes a la corrosión y las cubiertas a prueba de intemperie." },
      { title: "Tomacorrientes de dos clavijas", body: "Los tomacorrientes sin conexión a tierra son comunes en las viviendas antiguas. Se pueden actualizar con una conexión a tierra adecuada o con protección GFCI, según lo que permita el cableado." },
    ],
  },
  "pismo-beach": {
    intro: "Pacific Plains Electric ofrece servicios eléctricos para hogares, alquileres vacacionales y negocios en Pismo Beach.",
    considerations: [
      { title: "Corrosión costera", body: "El aire salino es duro con la iluminación exterior, los tomacorrientes exteriores y los paneles instalados afuera. Reemplazar a tiempo las lámparas y conexiones corroídas evita problemas intermitentes que después son más difíciles de rastrear." },
      { title: "Alquileres vacacionales", body: "Los propietarios y administradores de alquileres suelen necesitar reparaciones rápidas, iluminación exterior y de caminos confiable, y tomacorrientes que funcionen para cada huésped. Las visitas programadas entre reservas mantienen el trabajo fuera del camino." },
      { title: "Espacios exteriores", body: "Las terrazas y los patios suelen agregar iluminación, tomacorrientes exteriores y circuitos para spa, y cada uno necesita la protección adecuada para lugares húmedos." },
    ],
  },
  "avila-beach": {
    intro: "Pacific Plains Electric atiende casas y segundas residencias en Avila Beach y el valle de Avila.",
    considerations: [
      { title: "Segundas residencias", body: "Las casas que permanecen vacías parte del año pueden tener problemas que nadie nota enseguida, desde un circuito disparado hasta luces exteriores que fallan. Una visita antes de que lleguen los huéspedes los detecta." },
      { title: "Aire salino y humedad", body: "Las lámparas exteriores, los tomacorrientes y las conexiones del panel cerca del agua se corroen más rápido. Los dispositivos resistentes a la intemperie y las cubiertas para uso continuo duran más." },
      { title: "Permisos a través del condado", body: "Avila Beach es una zona no incorporada, así que el trabajo eléctrico con permiso se tramita con el condado de San Luis Obispo y no con el departamento de construcción de una ciudad." },
    ],
  },
  "morro-bay": {
    intro: "Pacific Plains Electric ofrece reparación e instalación eléctrica para hogares y negocios en Morro Bay.",
    considerations: [
      { title: "Niebla, humedad y sal", body: "El aire húmedo de la costa es una de las causas más comunes de tomacorrientes exteriores corroídos, luces exteriores que fallan y dispositivos GFCI que se disparan cuando llueve." },
      { title: "Casitas antiguas", body: "Muchas casas pequeñas y antiguas tienen pocos circuitos y paneles anticuados. Agregar un electrodoméstico de cocina o un calentador puede bastar para que empiecen a dispararse los interruptores." },
      { title: "Pequeños negocios", body: "Las tiendas y los restaurantes dependen de la iluminación y de circuitos dedicados para sus equipos. Las reparaciones se pueden programar según el horario del negocio." },
    ],
  },
  atascadero: {
    intro: "Pacific Plains Electric atiende a propietarios y negocios en Atascadero, incluidos terrenos residenciales grandes y propiedades con talleres y construcciones anexas.",
    considerations: [
      { title: "Calor del verano y cargas de refrigeración", body: "Los veranos calurosos tierra adentro hacen que el aire acondicionado y las bombas de calor trabajen mucho. Si las luces bajan cuando arranca el aire acondicionado o los interruptores se disparan en los días calurosos, quizá el panel o el circuito necesiten atención." },
      { title: "Talleres y construcciones anexas", body: "Los talleres, garajes independientes y graneros suelen necesitar un subpanel y circuitos dedicados para herramientas y equipos." },
      { title: "Energía de respaldo", body: "Algunas propiedades quieren conectar un generador para los cortes. Debe instalarse con un interruptor de transferencia o un enclavamiento adecuados para que nunca envíe electricidad de regreso a la línea de la compañía eléctrica." },
    ],
  },
  "paso-robles": {
    intro: "Pacific Plains Electric ofrece servicios eléctricos residenciales y comerciales en Paso Robles, desde casas en el pueblo hasta propiedades rurales y negocios.",
    considerations: [
      { title: "Calor y carga eléctrica", body: "Los veranos largos y calurosos ponen una carga constante en el aire acondicionado, el equipo de la piscina y el panel que los alimenta. Conviene revisar las conexiones sobrecalentadas y los interruptores que se disparan antes de la temporada de más calor." },
      { title: "Propiedades rurales", body: "Las propiedades fuera del pueblo pueden tener recorridos largos hasta bombas, portones y construcciones anexas, donde la caída de voltaje y las conexiones deterioradas causan fallas intermitentes." },
      { title: "Comercio y hospitalidad", body: "Las salas de cata, tiendas y oficinas necesitan iluminación confiable y circuitos dedicados para sus equipos, con el trabajo programado según su horario de apertura." },
    ],
  },
  "santa-barbara": {
    intro: "Pacific Plains Electric ofrece servicios eléctricos residenciales y comerciales en Santa Barbara, desde reparaciones y cableado para remodelaciones en casas antiguas hasta mejoras de panel, cargadores para vehículos eléctricos y energía de respaldo.",
    considerations: [
      { title: "Casas antiguas e históricas", body: "Muchas casas de Santa Barbara tienen décadas, y son comunes el cableado original, los paneles pequeños y los tomacorrientes sin conexión a tierra. Las casas en los distritos históricos de la ciudad también pueden requerir revisión de diseño para cambios exteriores visibles, así que conviene planificar desde el principio la ubicación de lámparas y equipos." },
      { title: "Cortes preventivos y energía de respaldo", body: "Southern California Edison, la compañía eléctrica de la zona, puede cortar la electricidad en áreas de alto riesgo de incendio durante condiciones climáticas peligrosas, incluidas partes de las colinas. Un generador conectado mediante un interruptor de transferencia o un enclavamiento aprobado mantiene lo esencial funcionando sin enviar electricidad de regreso a la línea." },
      { title: "Aire salino cerca de la costa", body: "Las lámparas exteriores, los tomacorrientes exteriores y las conexiones del panel cerca del agua se corroen más rápido que tierra adentro. Los dispositivos resistentes a la intemperie y las cubiertas para uso continuo duran más." },
    ],
  },
};
