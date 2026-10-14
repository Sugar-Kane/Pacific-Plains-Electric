import ServiceAnimation from "./service-animation";
import ServiceMotionGroup from "./service-motion-group";
import HeroBeach from "./hero-beach";
import CaliforniaMap from "./california-map";
import Link from "next/link";
import { business } from "@/config/business";
import { intakeCategories } from "@/config/intake";
import { services, requestable } from "@/config/content";
import { publishedAreas } from "@/config/areas";
import { diagnosticEs, serviceNamesEs, serviceSummariesEs } from "@/lib/i18n/shared";
import RequestForm from "./request-form";
import CoverageCheck from "./coverage-check";
import AccessibilityContent from "./accessibility-content";
import { ServiceIcon } from "./icons";

export const spanishTitles: Record<string, string> = {
  "/": "Electricista en San Luis Obispo y Santa Barbara", "/services": "Servicios eléctricos", "/about": "Conozca a su electricista", "/contact": "Contáctenos", "/service-areas": "Áreas de servicio", "/request-service": "Solicitar servicio eléctrico", "/faq": "Preguntas frecuentes", "/privacy": "Aviso de privacidad", "/terms": "Términos del sitio web", "/accessibility": "Accesibilidad",
};
export function SpanishActions() { return <div className="actions primary-actions" role="group" aria-label="Contactar a Pacific Plains Electric">
  <Link className="button" href="/es/request-service">Solicitar servicio</Link>
  <a className="button outline" href={business.workPhone.tel}>Llamar</a>
  <a className="button outline" href={business.workPhone.sms}>Enviar mensaje</a>
</div>; }
function Diagnostic() { return <section className="section container" aria-labelledby="diagnostic-title"><div className="diagnostic"><div>
  <span className="eyebrow">Visita de diagnóstico: $180</span><h2 id="diagnostic-title">Los $180 del diagnóstico se aplican a su reparación.</h2>
  <p>¿No sabe qué causa el problema eléctrico? Revisaremos el problema, identificaremos la causa probable y explicaremos sus opciones de reparación.</p>
  <p className="diagnostic-policy">{diagnosticEs}</p><Link className="button on-brand" href="/es/request-service?service=troubleshooting">Solicitar un diagnóstico</Link>
</div><div className="credit-example"><h3>Un ejemplo sencillo</h3><dl>
  <div><dt>Diagnóstico pagado</dt><dd>$180</dd></div><div><dt>Presupuesto de reparación posterior</dt><dd>$500</dd></div><div><dt>Crédito por el diagnóstico</dt><dd>−$180</dd></div><div className="credit-balance"><dt>Saldo restante de la reparación</dt><dd>$320</dd></div>
</dl><p>Este ejemplo no es un presupuesto. Paga $180 por el diagnóstico y después $320 por la reparación aprobada: $500 en total. Su pago previo se aplica una sola vez.</p></div></div></section>; }
function Choices({ all = false }: { all?: boolean }) {
  const cards = <div className="service-grid service-choices">{(all ? services : intakeCategories).map((s) => <Link className={all ? "service-card" : "service-card service-card-animated"} key={s.slug} href={all ? "/es/services/" + s.slug : "/es/request-service?service=" + s.slug}>
    {all ? <span className="service-icon"><ServiceIcon name={s.icon} size={24} /></span> : <ServiceAnimation service={s.slug} spanish />}
    <div className={all ? undefined : "service-card-copy"}><h3>{serviceNamesEs[s.slug]}</h3><p>{serviceSummariesEs[s.slug]}</p><span className="service-card-more">{all ? "Ver servicio" : "Solicitar ayuda"}</span></div>
  </Link>)}</div>;
  return all ? cards : <ServiceMotionGroup spanish>{cards}</ServiceMotionGroup>;
}
const faqs = [
  ["¿Cuánto cuesta el diagnóstico?", "La visita de diagnóstico cuesta $180. " + diagnosticEs],
  ["¿Mi solicitud confirma una cita?", "No. Nos comunicaremos con usted para hablar de los detalles y confirmar los próximos pasos y un horario."],
  ["¿En qué lugares ofrecen servicio?", "Atendemos los condados de San Luis Obispo y Santa Barbara. Confirmaremos la cobertura de su dirección al contactarle."],
  ["¿Puedo enviar un mensaje de texto?", "Sí. Use el enlace para enviar un mensaje o elija Mensaje de texto en el formulario y marque el consentimiento para recibir mensajes sobre su solicitud. También puede elegir una llamada telefónica."],
  ["¿Qué hago si hay una emergencia?", "Si hay un peligro inmediato, incendio, humo o lesiones, aléjese del peligro y llame al 911. La atención telefónica automatizada no significa que haya electricistas disponibles para acudir las 24 horas."],
];
function Faqs() { return <div className="faq-list">{faqs.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>; }
function Owner() { return <section className="section container owner-section"><div><span className="eyebrow">Su electricista</span><h2>{business.owner}</h2><p>Propietario de Pacific Plains Electric · {business.license}</p><a className="text-link" href={business.licenseUrl}>Verificar licencia #1162180 con CSLB (en inglés)</a></div><div><p className="lede">Pacific Plains Electric es una empresa local que ofrece servicios eléctricos para hogares, negocios y administradores de propiedades en los condados de San Luis Obispo y Santa Barbara.</p><a href={"mailto:" + business.email}>{business.email}</a></div></section>; }
export function SpanishPage({ path, service }: { path: string; service?: string }) {
  if (path === "/accessibility") return <AccessibilityContent spanish />;
  if (path === "/") return <>
    <section className="hero hero-with-beach"><HeroBeach spanish /><div className="container hero-content"><span className="eyebrow">Contratista eléctrico con licencia · {business.license}</span><h1>¿Necesita un electricista?<br />Podemos ayudarle.</h1><p className="lede">Reparaciones eléctricas, diagnóstico de problemas, mejoras de paneles, cargadores para vehículos eléctricos y más en los condados de San Luis Obispo y Santa Barbara.</p><SpanishActions /><p className="hero-meta">Propietario: {business.owner} · Diagnóstico de $180, acreditado a reparaciones posteriores aprobadas que cumplan los requisitos.</p></div></section>
    <section className="section container home-services"><span className="eyebrow">Servicios eléctricos</span><h2>¿Con qué necesita ayuda?</h2><Choices /></section>
    <section className="section container"><h2>Tres pasos sencillos</h2><ol className="process">{[["Cuéntenos qué necesita", "Envíe una solicitud breve, llame o mande un mensaje."],["Confirmamos los detalles", "Hablamos de su proyecto y acordamos los próximos pasos."],["Apruebe el trabajo", "Le explicamos las opciones y el precio antes de que apruebe la reparación."]].map(([title,body],i)=><li key={title}><span className="process-number">{i+1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol></section>
    <Diagnostic /><section className="section container"><h2>Al servicio de la Costa Central</h2><p>Atendemos los condados de San Luis Obispo y Santa Barbara. Consulte su código postal o contáctenos para confirmar la cobertura.</p><CoverageCheck spanish /></section><Owner /><section className="section container"><h2>Preguntas frecuentes</h2><Faqs /></section>
  </>;
  if (path === "/request-service") return <><Hero title={spanishTitles[path]} description="Cuéntenos qué necesita y cómo contactarle. Nos comunicaremos con usted para hablar de los detalles y confirmar los próximos pasos." /><section className="section container two-column request-layout"><RequestForm spanish initialService={service && (requestable as readonly string[]).includes(service) ? service : services.find(s=>s.slug===service)?.requestAs || "other"} /><aside className="panel request-aside"><h2>Visita de diagnóstico: $180</h2><p>{diagnosticEs}</p><p className="notice">Enviar una solicitud no confirma una cita.</p><a href={business.workPhone.tel}>{business.workPhone.display}</a></aside></section></>;
  if (path === "/services") return <><Hero title={spanishTitles[path]} description="Servicios eléctricos para hogares y negocios. Elija un servicio o cuéntenos qué sucede." /><section className="section container"><Choices all /></section><Diagnostic /></>;
  if (path.startsWith("/services/")) { const s=services.find(s=>path==="/services/"+s.slug)!; return <><Hero title={serviceNamesEs[s.slug]} description={serviceSummariesEs[s.slug]} /><section className="section container content-narrow"><h2>Hablemos de su proyecto</h2><p>Indique qué necesita, su ciudad o código postal y cómo prefiere que le contactemos. Confirmaremos el alcance, la disponibilidad y el precio antes de que apruebe el trabajo.</p><Link className="button" href={"/es/request-service?service="+s.requestAs}>Solicitar este servicio</Link><p><a href={"/services/"+s.slug+"?lang=en"} lang="en">Read the detailed service guide in English</a></p></section><Diagnostic /></>; }
  if (path === "/about") return <><Hero title={spanishTitles[path]} description="Pacific Plains Electric, propiedad de Nicholas Kane, ofrece servicios eléctricos residenciales y comerciales en la Costa Central de California." /><Owner /><section className="section container"><SpanishActions /></section></>;
  if (path === "/contact") return <><Hero title={spanishTitles[path]} description="Llame, envíe un mensaje o solicite servicio en línea. No necesita una cuenta." /><section className="section container content-narrow"><SpanishActions /><h2>Contacto directo</h2><p><a href={business.workPhone.tel}>{business.workPhone.display}</a></p><p><a href={"mailto:"+business.email}>{business.email}</a></p><p>Horario de oficina: 7:00 a. m. a 5:00 p. m., hora del Pacífico.</p><p>La línea principal cuenta con un asistente automatizado las 24 horas. Esto no garantiza atención presencial inmediata.</p><p>Propietario: {business.owner} · {business.license}</p></section></>;
  if (path === "/service-areas" || path.startsWith("/service-areas/")) { const area=publishedAreas.find(a=>path==="/service-areas/"+a.slug); return <><Hero title={area ? "Electricista en "+area.name : spanishTitles[path]} description="Ofrecemos servicios eléctricos en los condados de San Luis Obispo y Santa Barbara. Confirmaremos la cobertura de su dirección y la disponibilidad con usted." /><section className="section container"><div className="map-panel"><CaliforniaMap spanish /><p>Condados de San Luis Obispo y Santa Barbara</p></div><CoverageCheck spanish /><ul className="area-links">{publishedAreas.map(a=><li key={a.slug}><Link href={"/es/service-areas/"+a.slug}>{a.name}</Link></li>)}</ul><SpanishActions /></section></>; }
  if (path === "/faq") return <><Hero title={spanishTitles[path]} description="Respuestas sobre precios, solicitudes y cobertura." /><section className="section container"><Faqs /><SpanishActions /></section><Diagnostic /></>;
  return <><Hero title={spanishTitles[path]} description={path === "/privacy" ? "Qué información recopila este sitio al enviar una solicitud y cómo se utiliza." : "Condiciones aplicables al usar este sitio y enviar una solicitud."} /><Legal spanishPath={path} /></>;
}
function Hero({ title, description }: { title: string; description: string }) { return <section className="page-hero"><div className="container"><h1>{title}</h1><p>{description}</p></div></section>; }
function Legal({ spanishPath }: { spanishPath: string }) {
  return <article className="container content-narrow">{spanishPath === "/privacy" ? <>
    <h2>Solicitudes de servicio</h2><p>Al enviar una solicitud, recopilamos los datos de contacto, la ciudad o el código postal, la descripción opcional del proyecto, los horarios preferidos y las opciones de comunicación que usted proporciona. Utilizamos estos datos para revisar y responder a su solicitud y coordinar el servicio.</p>
    <h2>Almacenamiento y proveedores</h2><p>Las solicitudes se almacenan en nuestra base de datos de Supabase y el sitio está alojado en Vercel. Las solicitudes pueden revisarse en el área protegida del propietario. Cuando la integración de Volteira está activada, la información del servicio se transfiere a ese sistema de administración para coordinar el trabajo.</p>
    <h2>Preferencias e información técnica</h2><p>El sitio recuerda su tema en el navegador y su elección de idioma mediante una cookie. Si no ha elegido un idioma, puede usar la preferencia de idioma de su navegador. Las cookies de autenticación permiten el acceso del propietario. El alojamiento puede procesar información técnica de las solicitudes para la seguridad y el funcionamiento. No enviamos nombres, teléfonos, correos electrónicos, direcciones de servicio ni descripciones del formulario a herramientas generales de análisis.</p>
    <h2>Opciones de comunicación</h2><p>El consentimiento de contacto sobre el servicio es independiente del consentimiento opcional para mensajes de texto. El formulario no le inscribe en mensajes de marketing. Si acepta mensajes sobre el servicio, la frecuencia varía y pueden aplicarse cargos por mensajes y datos. Responda STOP para cancelar o HELP para obtener ayuda. Cuando el seguimiento automatizado está activado, un asistente puede contactarle sobre su solicitud según sus preferencias de contacto y el consentimiento registrado.</p>
    <h2>Preguntas y solicitudes</h2><p>Escriba a <a href={"mailto:"+business.email}>{business.email}</a> con preguntas sobre privacidad o para solicitar acceso, corrección o eliminación de los datos que envió. Es posible que debamos conservar cierta información por requisitos comerciales o legales aplicables.</p>
  </> : <>
    <h2>Solicitudes y citas</h2><p>Una solicitud de servicio es una consulta, no una cita confirmada. Las citas se coordinan y confirman con Pacific Plains Electric.</p>
    <h2>Precio del diagnóstico</h2><p>El diagnóstico cuesta $180 e incluye evaluación profesional e identificación de problemas. {diagnosticEs} El cargo se paga por la visita y se aplica una sola vez a las reparaciones aprobadas que cumplan los requisitos; no es un descuento adicional. Enviar una solicitud no realiza un pago ni autoriza un cargo.</p>
    <h2>Alcance del servicio</h2><p>La disponibilidad, la cobertura de su dirección, el alcance del proyecto y el precio se confirman individualmente. Cualquier acuerdo para realizar trabajo eléctrico es independiente de esta consulta.</p>
    <h2>Información y emergencias</h2><p>Los artículos del sitio contienen información general, no un diagnóstico ni instrucciones para realizar trabajo eléctrico. El asistente telefónico automatizado no significa que haya electricistas disponibles para acudir las 24 horas. Ante un peligro inmediato, incendio, humo o lesiones, aléjese y llame al 911.</p>
    <h2>Contacto</h2><p>Pacific Plains Electric · {business.license}<br /><a href={business.workPhone.tel}>{business.workPhone.display}</a><br /><a href={"mailto:"+business.email}>{business.email}</a></p>
  </>}</article>;
}
