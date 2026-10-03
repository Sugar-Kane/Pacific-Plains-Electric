import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Assistant from "@/components/assistant";
import { business } from "@/config/business";
import "./globals.css";
const arimo = localFont({
  src: [
    { path: "../public/fonts/arimo-regular-web.woff2", weight: "400" },
    { path: "../public/fonts/arimo-bold-web.woff2", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: "Pacific Plains Electric | Central Coast Electrician",
    template: "%s | Pacific Plains Electric",
  },
  description:
    "Electrical repair, panel upgrades, EV chargers, and lighting in San Luis Obispo County. $180 diagnostic service. CSLB #1162180.",
  icons: { icon: "/brand/favicon.svg" },
  robots:
    process.env.VERCEL_ENV === "preview"
      ? { index: false, follow: false }
      : { index: true, follow: true },
};
const themeScript = `try{var t=localStorage.getItem('ppe-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}`;
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={arimo.variable}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Assistant />
      </body>
    </html>
  );
}
