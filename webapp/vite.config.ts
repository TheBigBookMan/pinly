import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const csp = [
 "default-src 'self'",
 "script-src 'self'",
 "style-src 'self'",
 "style-src-attr 'unsafe-inline'",
 "img-src 'self' data: blob: https://*.basemaps.cartocdn.com",
 "font-src 'self'",
 "connect-src 'self' http://localhost:3000",
 "frame-src https://www.youtube.com https://www.tiktok.com https://www.instagram.com",
 "object-src 'none'",
 "base-uri 'self'",
 "form-action 'self'",
 "frame-ancestors 'none'",
].join("; ")

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {headers: {"Content-Security-Policy-Report-Only": csp}}
})