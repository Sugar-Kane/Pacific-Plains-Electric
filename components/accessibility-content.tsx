import { business } from "@/config/business";
export default function AccessibilityContent({ spanish = false }: { spanish?: boolean }) {
  return <article className="section container content-narrow">
    <h1>{spanish ? "Accesibilidad" : "Accessibility"}</h1>
    <p>{spanish ? "Queremos que todas las personas puedan conocer nuestros servicios y solicitar ayuda eléctrica. Trabajamos para que el sitio cumpla las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2, nivel AA." : "We want everyone to be able to learn about our services and request electrical help. We work toward the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA."}</p>
    <h2>{spanish ? "Usar el sitio" : "Using the website"}</h2>
    <p>{spanish ? "Puede navegar con el teclado, ampliar el texto con su navegador, elegir un tema claro u oscuro y cambiar entre inglés y español. El formulario incluye etiquetas, instrucciones y avisos de error. No se requiere una cuenta ni un pago para enviar una solicitud." : "You can navigate with a keyboard, enlarge text with your browser, choose a light or dark theme, and switch between English and Spanish. The request form includes labels, instructions, and error notices. No account or payment is required to submit an inquiry."}</p>
    <h2>{spanish ? "Ayuda y problemas de accesibilidad" : "Accessibility help and feedback"}</h2>
    <p>{spanish ? "Si alguna parte del sitio le impide obtener información o solicitar servicio, contacte a Nicholas Kane por el medio que le resulte más accesible. Indique la página, el problema y cómo prefiere que le respondamos. No incluya información médica ni datos confidenciales." : "If any part of the site prevents you from getting information or requesting service, contact Nicholas Kane using the method that works best for you. Include the page, the problem, and how you prefer us to respond. Do not include medical information or sensitive details."}</p>
    <ul><li><a href={"mailto:" + business.email}>{business.email}</a></li><li><a href={business.workPhone.tel}>{spanish ? "Llamar: " : "Call: "}{business.workPhone.display}</a></li><li><a href={business.workPhone.sms}>{spanish ? "Enviar mensaje de texto" : "Send a text message"}</a></li></ul>
    <p>{spanish ? "Seguimos revisando y mejorando la accesibilidad. Las pruebas automáticas no detectan todas las barreras, y esta página no constituye una certificación de cumplimiento." : "We continue to review and improve accessibility. Automated tests do not detect every barrier, and this page is not a certification of compliance."}</p>
  </article>;
}
