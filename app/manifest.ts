import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Điện Máy Nga Sơn",
    short_name: "Nga Sơn",
    theme_color: "#0EA5E9",
    background_color: "#FFFFFF",
    display: "standalone",
    start_url: "/",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
