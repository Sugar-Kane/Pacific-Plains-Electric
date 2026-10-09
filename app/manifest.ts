import type { MetadataRoute } from "next";
import { business } from "@/config/business";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: "Pacific Plains",
    description: business.description,
    start_url: "/",
    display: "browser",
    background_color: "#f6f1e7",
    theme_color: "#1f4d3c",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
