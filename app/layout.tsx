import { headers } from "next/headers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { business } from "@/config/business";
import { JsonLd, graph, businessNode, websiteNode } from "@/lib/seo";
import "./globals.css";
const arimo = localFont({
  src: [
    { path: "../public/fonts/arimo-regular-web.woff2", weight: "400" },
    { path: "../public/fonts/arimo-bold-web.woff2", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
  // Fallback only: most devices render the system font, so don't preload it.
  preload: false,
});
export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "Pacific Plains Electric | San Luis Obispo County Electrician",
    template: "%s | Pacific Plains Electric",
  },
  description: business.description,
  applicationName: business.name,
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  formatDetection: { telephone: false },
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : { index: true, follow: true },
};
const themeScript = `try{var t=localStorage.getItem('ppe-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}`;
export default async function Layout({ children }: { children: React.ReactNode }) {
  const spanish = (await headers()).get("x-ppe-language") === "es";
  return (
    <html lang={spanish ? "es" : "en"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={arimo.variable}>
        <a className="skip-link" href="#main">
          {spanish ? "Saltar al contenido" : "Skip to content"}
        </a>
        <JsonLd data={graph(businessNode(), websiteNode())} />
        <Header spanish={spanish} />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer spanish={spanish} />
      </body>
    </html>
  );
}
