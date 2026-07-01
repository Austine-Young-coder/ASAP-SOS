import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/*.png"],
      manifest: {
        name: "ASAP-SOS",
        short_name: "ASAP-SOS",
        description:
          "Get help fast. One-tap emergency calling, location-based responder numbers, and community alerts for Nigeria.",
        theme_color: "#0B0E14",
        background_color: "#0B0E14",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/data/"),
            handler: "CacheFirst",
            options: { cacheName: "asap-sos-data" }
          }
        ]
      },
      devOptions: { enabled: false }
    })
  ],
  server: { port: 5173 }
});
