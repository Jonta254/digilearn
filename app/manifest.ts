import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DigiLearn",
    short_name: "DigiLearn",
    description: "Practical digital learning, structured for progress.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f8f8",
    theme_color: "#12304a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
