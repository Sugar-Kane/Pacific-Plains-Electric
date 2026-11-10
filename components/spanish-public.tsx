import Link from "next/link";
import { ArrowRight, Check, TriangleAlert, Landmark, Phone, MessageCircle, Mail, Clock, ArrowUpRight } from "lucide-react";
import HeroBeach from "./hero-beach";
import CaliforniaMap from "./california-map";
import RequestForm from "./request-form";
import CoverageCheck from "./coverage-check";
import AccessibilityContent from "./accessibility-content";
import { ServiceIcon } from "./icons";
import {
  Actions, AreaLinks, ContactCTA, Diagnostic, Facts, FaqList, OwnerSection, PageHero, PricingPanel,
  ProcessSteps, Reviews, SectionHead, ServiceChoices, ServiceGrid, serviceName, serviceSummary,
} from "./public";
import { business } from "@/config/business";
import { services, requestable, findService, listedServices } from "@/config/content";
import { publishedAreas, findArea, countyOf, DEFAULT_COUNTY } from "@/config/areas";
import { areasEs, faqsEs, servicesEs } from "@/config/content-es";
import { diagnosticEs } from "@/lib/i18n/shared";

/**
 * The Spanish site. Each page below has the same sections, in the same order,
 * as its English page under app/, built from the same shared components in
 * components/public.tsx with lang="es". Content comes from config/content-es.ts.
 */
export const spanishTitles: Record<string, string> = {
  "/": "Electricista en San Luis Obispo y Santa Barbara", "/services": "Servicios eléctricos", "/about": "Sobre Pacific Plains Electric", "/contact": "Contáctenos", "/service-areas": "Áreas de servicio", "/request-service": "Solicitar servicio eléctrico", "/faq": "Preguntas frecuentes", "/privacy": "Aviso de privacidad", "/terms": "Términos del sitio web", "/accessibility": "Accesibilidad",
};
const L = "es" as const;
/** Kept for other modules that import it. */
export function SpanishActions() { return <Actions lang={L} />; }
const homeFaqs = [faqsEs[3], faqsEs[6], faqsEs[0], faqsEs[2]];
const permitAuthorityEs = (a: NonNullable<ReturnType<typeof findArea>>) =>
  a.kind === "community" ? "el Departamento de Planificación y Construcción del condado de San Luis Obispo" : `el departamento de construcción de la ciudad de ${a.name}`;
const settingEs = (a: NonNullable<ReturnType<typeof findArea>>) =>
  countyOf(a) !== DEFAULT_COUNTY ? "Condado de Santa Barbara" : a.setting === "coastal" ? "Costa" : a.setting === "inland" ? "Norte del condado" : "Centro y sur del condado";

export function SpanishPage({ path, service }: { path: string; service?: string }) {
  if (path === "/accessibility") return <AccessibilityContent spanish />;
  if (path === "/") return <>
    <section className="hero hero-with-beach"><HeroBeach spanish /><div className="container hero-content">
      <span className="eyebrow">Contratista eléctrico con licencia · {business.license}</span>
      <h1>¿Necesita un electricista?<br />Podemos ayudarle.</h1>
      <p className="lede">Reparaciones eléctricas, diagnóstico de problemas, mejoras de paneles, cargadores para vehículos eléctricos y más en los condados de San Luis Obispo y Santa Barbara.</p>
      <Actions lang={L} />
      <p className="hero-meta">Propietario: {business.owner} · Visita de diagnóstico de $180, acreditada a reparaciones posteriores aprobadas que cumplan los requisitos.</p>
    </div></section>
    <section className="section container home-services"><SectionHead eyebrow="Servicios eléctricos" title="¿Con qué necesita ayuda?" link={{ label: "Ver todos los servicios", href: "/es/services" }} /><ServiceChoices lang={L} /></section>
    <section className="section container"><SectionHead eyebrow="Tres pasos sencillos" title="Cómo funciona" /><ProcessSteps lang={L} /></section>
    <Diagnostic lang={L} />
    <section className="section container"><SectionHead eyebrow="Áreas de servicio" title="Al servicio de la Costa Central" link={{ label: "Todas las áreas de servicio", href: "/es/service-areas" }} />
      <p>Servicios eléctricos en los condados de San Luis Obispo y Santa Barbara. Contáctenos para confirmar la cobertura de su dirección.</p>
      <AreaLinks lang={L} /><CoverageCheck spanish /></section>
    <OwnerSection lang={L} />
    <Reviews lang={L} />
    <section className="section container faq-grid"><SectionHead eyebrow="Preguntas frecuentes" title="Preguntas comunes" link={{ label: "Todas las preguntas", href: "/es/faq" }} /><FaqList items={homeFaqs} lang={L} /></section>
    <ContactCTA lang={L} />
  </>;
  if (path === "/request-service") {
    const initial = (service && ((requestable as readonly string[]).includes(service) ? service : findService(service)?.requestAs)) || "other";
    return <>
      <PageHero lang={L} eyebrow="Solicitar servicio" title={spanishTitles[path]} description="Cuéntenos qué necesita y cómo contactarle. Nos comunicaremos con usted para hablar de los detalles y confirmar los próximos pasos." />
      <section className="section container two-column request-layout">
        <RequestForm spanish initialService={initial} />
        <PricingPanel lang={L}><div className="notice">Enviar una solicitud no reserva una cita. Confirmaremos un horario con usted.</div></PricingPanel>
      </section>
    </>;
  }
  if (path === "/services") return <>
    <PageHero lang={L} eyebrow="Servicios" title="Servicios eléctricos en los condados de San Luis Obispo y Santa Barbara" description={`${business.name} ofrece servicios eléctricos residenciales y comerciales en los condados de San Luis Obispo y Santa Barbara. Elija un servicio para solicitarlo o lea primero los detalles.`} />
    <section className="section container"><h2>¿Con qué necesita ayuda?</h2><ServiceChoices lang={L} />
      <details className="service-catalogue"><summary>Ver todos los servicios eléctricos</summary><ServiceGrid lang={L} /></details></section>
    <Diagnostic lang={L} />
    <section className="section container"><h2>Dónde trabajamos</h2><p className="lede">Todos los servicios están disponibles en los condados de San Luis Obispo y Santa Barbara. <Link href="/es/service-areas">Ver todas las áreas de servicio</Link>.</p><AreaLinks lang={L} /></section>
    <ContactCTA lang={L} />
  </>;
  if (path.startsWith("/services/")) {
    const s = services.find((x) => path === "/services/" + x.slug)!;
    const es = servicesEs[s.slug];
    const name = serviceName(L, s.slug, s.name);
    const related = s.related.map(findService).filter((x) => x !== undefined);
    return <>
      <PageHero lang={L} crumbs={[{ label: "Servicios", href: "/es/services" }, { label: name }]} title={name} description={es.description} />
      <section className="section container two-column">
        <div className="prose service-body">
          <h2>Sobre este servicio</h2>
          {es.overview.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
          <h2>Motivos comunes para llamar</h2>
          <ul className="check-list">{es.reasons.map((x) => <li key={x}><Check size={18} aria-hidden="true" />{x}</li>)}</ul>
          {es.warningSigns && <>
            <h2>Señales de advertencia</h2>
            <ul className="check-list warning-list">{es.warningSigns.map((x) => <li key={x}><TriangleAlert size={18} aria-hidden="true" />{x}</li>)}</ul>
            <p className="notice">Si ve chispas, humo o fuego, aléjese y llame al 911. Si puede llegar sin peligro, apague el interruptor automático de ese circuito.</p>
          </>}
          <h2>Lo que hacemos</h2>
          <ul className="check-list">{es.includes.map((x) => <li key={x}><Check size={18} aria-hidden="true" />{x}</li>)}</ul>
          <Link className="button" href={"/es/request-service?service=" + s.requestAs}>Solicitar servicio <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <PricingPanel lang={L} />
      </section>
      <section className="section band"><div className="container"><span className="eyebrow">Qué esperar</span><h2>Cómo funciona</h2><ProcessSteps lang={L} /></div></section>
      <section className="section container"><span className="eyebrow">Área de servicio</span><h2>Dónde ofrecemos {name.toLowerCase()}</h2>
        <p className="lede">{business.name} atiende a clientes {s.audience === "Commercial" ? "comerciales" : s.audience === "Residential" ? "residenciales" : "residenciales y comerciales"} en los condados de San Luis Obispo y Santa Barbara, incluidos:</p><AreaLinks lang={L} /></section>
      {es.faqs.length > 0 && <section className="section container faq-grid"><div className="section-head"><div><span className="eyebrow">Preguntas frecuentes</span><h2>Preguntas sobre {name.toLowerCase()}</h2></div></div><FaqList items={es.faqs} lang={L} /></section>}
      {related.length > 0 && <section className="section container"><h2 className="subhead">Servicios relacionados</h2><ul className="related">{related.map((o) => <li key={o.slug}><Link href={"/es/services/" + o.slug}>{serviceName(L, o.slug, o.name)}</Link></li>)}</ul></section>}
      <ContactCTA lang={L} />
    </>;
  }
  if (path === "/about") return <>
    <PageHero lang={L} eyebrow="Nosotros" title={spanishTitles[path]} description="Pacific Plains Electric, propiedad de Nicholas Kane, ofrece servicios eléctricos residenciales y comerciales en la Costa Central de California." />
    <OwnerSection lang={L} aboutLink={false} />
    <section className="container"><Facts lang={L} /></section>
    <section className="section container"><div className="prose">
      <h2>Lo que hacemos</h2>
      <p>{business.name} es un contratista eléctrico con licencia en California, {business.license}, propiedad de {business.owner}. La empresa se encarga del diagnóstico y reparación eléctrica, mejoras de paneles, instalación de cargadores para vehículos eléctricos, iluminación, circuitos dedicados, cableado para remodelaciones y construcciones nuevas, y trabajo eléctrico comercial.</p>
      <ul className="related">{listedServices.map((s) => <li key={s.slug}><Link href={"/es/services/" + s.slug}>{serviceName(L, s.slug, s.name)}</Link></li>)}</ul>
      <h2>Dónde trabajamos</h2>
      <p>Atendemos hogares y negocios en los condados de San Luis Obispo y Santa Barbara, incluidos {publishedAreas.slice(0, -1).map((a) => a.name).join(", ")} y {publishedAreas.at(-1)!.name}. Vamos a su domicilio; no tenemos local abierto al público. <Link href="/es/service-areas">Ver áreas de servicio</Link>.</p>
      <h2>Cómo trabajamos</h2>
      <p>La visita de diagnóstico cuesta ${business.diagnosticPrice}. {diagnosticEs} El trabajo nuevo se presupuesta antes de empezar, y las preguntas llegan directamente al propietario.</p>
      <h2>Cómo comunicarse</h2>
      <p>Para solicitar servicio, llame a la línea principal, <a href={business.workPhone.tel}>{business.workPhone.display}</a>. La contesta un asistente telefónico automatizado, así que puede llamar a cualquier hora. Para comunicarse directamente con Nicholas, escriba a <a href={"mailto:" + business.email}>{business.email}</a>. El horario de oficina es de 7:00 a. m. a 5:00 p. m., hora del Pacífico, y las visitas se programan con cita.</p>
    </div></section>
    <ContactCTA lang={L} />
  </>;
  if (path === "/contact") return <>
    <PageHero lang={L} eyebrow="Contacto" title="Comuníquese con nosotros" description="Llame o envíe un mensaje sobre una reparación, hable de un proyecto o envíe los detalles en línea." />
    <section className="section container two-column"><div>
      <ul className="contact-list">
        <li className="contact-item"><Phone size={22} aria-hidden="true" /><div><span className="contact-label">Hable con nosotros</span><a className="contact-value large" href={business.workPhone.tel}>Llamar al {business.workPhone.display}</a><small>Un asistente automatizado contesta las 24 horas. Las visitas son con cita.</small></div></li>
        <li className="contact-item"><MessageCircle size={22} aria-hidden="true" /><div><span className="contact-label">¿Tiene una pregunta rápida?</span><p>Envíenos un mensaje de texto con lo que necesita.</p><a className="button outline" href={business.workPhone.sms}>Enviar un mensaje</a></div></li>
        <li className="contact-item"><Mail size={22} aria-hidden="true" /><div><span className="contact-label">Correo electrónico</span><a className="contact-value" href={"mailto:" + business.email}>{business.email}</a></div></li>
        <li className="contact-item"><Clock size={22} aria-hidden="true" /><div><span className="contact-label">Horario</span><span className="contact-value">7:00 a. m. a 5:00 p. m., hora del Pacífico</span><small>Los días de cita se confirman individualmente.</small></div></li>
      </ul>
      <h2>¿Prefiere enviar los detalles en línea?</h2>
      <p>Envíe una solicitud de servicio y nos comunicaremos con usted para hablar de los próximos pasos.</p>
      <Link className="button" href="/es/request-service">Solicitar servicio <ArrowRight size={18} aria-hidden="true" /></Link>
    </div>
    <div className="map-panel">
      <CaliforniaMap spanish />
      <h2>Condados de San Luis Obispo y Santa Barbara</h2>
      <p className="map-legend"><span /> Nuestra área de servicio</p>
      <p className="legal-note">Vamos a su domicilio. No tenemos local abierto al público.</p>
      <a className="text-link" href="https://www.google.com/maps/search/San+Luis+Obispo+County+California" target="_blank" rel="noreferrer">Abrir en Google Maps <ArrowUpRight size={16} aria-hidden="true" /></a>
    </div></section>
  </>;
  if (path === "/service-areas") return <>
    <PageHero lang={L} eyebrow="Áreas de servicio" title="Al servicio de los condados de San Luis Obispo y Santa Barbara" description={`${business.name} ofrece servicios eléctricos residenciales y comerciales en los condados de San Luis Obispo y Santa Barbara. Vamos a su domicilio; no tenemos local abierto al público.`} />
    <section className="section container two-column"><div>
      <h2>Comunidades que atendemos</h2>
      <ul className="area-cards">{publishedAreas.map((a) => <li key={a.slug}><Link className="area-card" href={"/es/service-areas/" + a.slug}><strong>{a.name}</strong><span>{settingEs(a)}{a.kind === "community" ? " · zona no incorporada" : ""}</span><ArrowRight size={16} aria-hidden="true" /></Link></li>)}</ul>
      <p>¿No ve su ciudad? Trabajamos en todos los condados de San Luis Obispo y Santa Barbara. <Link className="inline-link" href="/es/contact">Contáctenos</Link> para confirmar el servicio en su dirección.</p>
    </div>
    <div className="map-panel"><CaliforniaMap spanish /><h2>Condados de San Luis Obispo y Santa Barbara</h2><p className="map-legend"><span /> Nuestra área de servicio</p></div></section>
    <section className="section container"><CoverageCheck spanish /></section>
    <ContactCTA lang={L} />
  </>;
  if (path.startsWith("/service-areas/")) {
    const a = findArea(path.split("/").at(-1)!)!;
    const es = areasEs[a.slug];
    const areaServices = a.services.map(findService).filter((x) => x !== undefined);
    const nearby = a.nearby.map(findArea).filter((x) => x !== undefined);
    const linked = nearby.length ? nearby : publishedAreas.filter((x) => x.slug !== a.slug);
    const authority = permitAuthorityEs(a);
    const county = countyOf(a) === DEFAULT_COUNTY ? "el condado de San Luis Obispo" : "el condado de Santa Barbara";
    const faqs = [
      { q: `¿${business.name} ofrece servicio en ${a.name}?`, a: `Sí. ${a.name}, en ${county}, forma parte de nuestra área de servicio. Vamos a su domicilio; no tenemos oficina en ${a.name}. Contáctenos para confirmar el servicio en su dirección.` },
      { q: `¿Quién emite los permisos eléctricos en ${a.name}?`, a: a.kind === "community" ? `${a.name} es una zona no incorporada, así que los permisos los emite ${authority}.` : `Los permisos para trabajos en ${a.name} los emite ${authority}.` },
      { q: `¿Cuánto cuesta una visita de diagnóstico en ${a.name}?`, a: `La visita de diagnóstico cuesta $${business.diagnosticPrice}, lo mismo en toda nuestra área de servicio. ${diagnosticEs}` },
    ];
    return <>
      <PageHero lang={L} crumbs={[{ label: "Áreas de servicio", href: "/es/service-areas" }, { label: a.name }]} title={`Electricista en ${a.name}, CA`} description={es.intro} />
      <section className="section container two-column"><div className="prose">
        <h2>Trabajo eléctrico en {a.name}</h2>
        {es.considerations.map((c) => <div key={c.title}><h3>{c.title}</h3><p>{c.body}</p></div>)}
        <h3><Landmark size={20} aria-hidden="true" className="inline-icon" /> Permisos</h3>
        <p>{a.kind === "community" ? `${a.name} es una comunidad no incorporada, así que el trabajo eléctrico con permiso se tramita con ${authority}.` : `El trabajo eléctrico con permiso en ${a.name} se tramita con ${authority}.`} Le explicaremos los requisitos del permiso junto con el presupuesto.</p>
      </div><PricingPanel lang={L} /></section>
      <section className="section band"><div className="container"><span className="eyebrow">Servicios</span><h2>Solicitudes comunes en {a.name}</h2>
        <div className="service-grid">{areaServices.map((s) => <Link className="service-card" href={"/es/services/" + s.slug} key={s.slug}><span className="service-icon"><ServiceIcon name={s.icon} size={24} /></span><h3>{serviceName(L, s.slug, s.name)}</h3><p>{serviceSummary(L, s.slug, s.summary)}</p><span className="service-card-more">Más información <ArrowRight size={16} aria-hidden="true" /></span></Link>)}</div>
        <p><Link className="text-link" href="/es/services">Ver todos los servicios eléctricos <ArrowRight size={17} aria-hidden="true" /></Link></p></div></section>
      <section className="section container faq-grid"><div className="section-head"><div><span className="eyebrow">Preguntas frecuentes</span><h2>Preguntas sobre {a.name}</h2></div></div><FaqList items={faqs} lang={L} /></section>
      {linked.length > 0 && <section className="section container"><h2 className="subhead">{nearby.length ? "Comunidades cercanas que atendemos" : "Otras comunidades que atendemos"}</h2><ul className="related">{linked.map((n) => <li key={n.slug}><Link href={"/es/service-areas/" + n.slug}>{n.name}</Link></li>)}<li><Link href="/es/service-areas">Todas las áreas de servicio</Link></li></ul></section>}
      <ContactCTA lang={L} />
    </>;
  }
  if (path === "/faq") return <>
    <PageHero lang={L} eyebrow="Preguntas frecuentes" title="Preguntas frecuentes" description="Precios, área de servicio, citas y cómo comunicarse con nosotros." />
    <div className="container"><section className="content-narrow"><FaqList lang={L} />
      <p className="after-list">Encontrará más detalles en cada <Link href="/es/services">página de servicio</Link> y en nuestras <Link href="/blog" hrefLang="en">guías (en inglés)</Link>.</p></section></div>
    <ContactCTA lang={L} />
  </>;
  return <><PageHero lang={L} title={spanishTitles[path]} description={path === "/privacy" ? "Qué información recopila este sitio al enviar una solicitud y cómo se utiliza." : "Condiciones aplicables al usar este sitio y enviar una solicitud."} /><Legal spanishPath={path} /></>;
}
function Legal({ spanishPath }: { spanishPath: string }) {
  return <article className="container content-narrow">{spanishPath === "/privacy" ? <>
    <h2>Solicitudes de servicio</h2><p>Al enviar una solicitud, recopilamos los datos de contacto, la ciudad o el código postal, la descripción opcional del proyecto, los horarios preferidos y las opciones de comunicación que usted proporciona. Utilizamos estos datos para revisar y responder a su solicitud y coordinar el servicio.</p>
    <h2>Almacenamiento y proveedores</h2><p>Las solicitudes se almacenan en nuestra base de datos de Supabase y el sitio está alojado en Vercel. Las solicitudes pueden revisarse en el área protegida del propietario. Cuando la integración de Volteira está activada, la información del servicio se transfiere a ese sistema de administración para coordinar el trabajo.</p>
    <h2>Preferencias e información técnica</h2><p>El sitio recuerda su tema en el navegador y su elección de idioma mediante una cookie. Si no ha elegido un idioma, puede usar la preferencia de idioma de su navegador. Las cookies de autenticación permiten el acceso del propietario. El alojamiento puede procesar información técnica de las solicitudes para la seguridad y el funcionamiento.</p>
    <h2>Análisis del sitio</h2><p>Usamos Vercel Web Analytics, que cuenta las visitas a las páginas sin cookies, y Google Analytics, que usa cookies para medir las visitas y los toques en los botones de llamada, mensaje, correo y solicitud. Las funciones publicitarias de Google están desactivadas y Google Analytics no se carga cuando su navegador envía una señal de Control Global de Privacidad (GPC). También puede bloquearlo con el <a className="inline-link" href="https://tools.google.com/dlpage/gaoptout">complemento de exclusión de Google</a>. No enviamos nombres, teléfonos, correos electrónicos, direcciones de servicio ni descripciones del formulario a herramientas de análisis.</p>
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
