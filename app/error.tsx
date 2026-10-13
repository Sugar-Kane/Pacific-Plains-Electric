"use client";
import { usePathname } from "next/navigation";
import { business } from "@/config/business";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const spanish = usePathname().startsWith("/es");
  return (
    <section className="error-page container">
      <h1>{spanish ? "Ocurrió un problema" : "Something went wrong"}</h1>
      <p>{spanish ? "No se pudo cargar la página. Vuelva a intentarlo o llámenos." : "This page didn’t load. Try again, or give us a call."}</p>
      <div className="actions">
        <button className="button" onClick={reset}>
          {spanish ? "Volver a intentar" : "Try again"}
        </button>
        <a className="button outline" href={business.workPhone.tel}>
          {spanish ? "Llamar" : "Call"} {business.workPhone.display}
        </a>
      </div>
    </section>
  );
}
