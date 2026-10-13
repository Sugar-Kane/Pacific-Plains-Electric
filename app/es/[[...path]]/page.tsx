import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SpanishPage, spanishTitles } from "@/components/spanish-public";
import { services } from "@/config/content";
import { publishedAreas } from "@/config/areas";
import { serviceNamesEs, spanishPath } from "@/lib/i18n/shared";
import { business } from "@/config/business";
type Props = { params: Promise<{ path?: string[] }>; searchParams: Promise<{ service?: string }> };
function valid(path: string) { return !!spanishTitles[path] || services.some(s => path === "/services/" + s.slug) || publishedAreas.some(a => path === "/service-areas/" + a.slug); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = "/" + ((await params).path || []).join("/");
  if (!valid(path)) return {};
  const title = spanishTitles[path] || serviceNamesEs[path.split("/").at(-1)!] || "Electricista en " + publishedAreas.find(a => path === "/service-areas/" + a.slug)?.name;
  return { title, description: "Pacific Plains Electric: servicios eléctricos para hogares y negocios en San Luis Obispo y Santa Barbara. Diagnóstico de $180 con crédito para reparaciones posteriores aprobadas que cumplan los requisitos.", alternates: { canonical: spanishPath(path), languages: { en: path, es: spanishPath(path), "x-default": path } }, openGraph: { title, locale: "es_US", url: business.siteUrl + spanishPath(path) } };
}
export default async function Page({ params, searchParams }: Props) {
  const path = "/" + ((await params).path || []).join("/");
  if (!valid(path)) notFound();
  return <SpanishPage path={path} service={(await searchParams).service} />;
}
