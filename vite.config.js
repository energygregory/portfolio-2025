import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable asset inlining for small images (< 10kb become base64)
    assetsInlineLimit: 10240,
    rollupOptions: {
      output: {
        // Hash assets for optimal caching
        assetFileNames: "assets/[name]-[hash][extname]",
        manualChunks: {
          "liquid-logo": ["./src/components/LiquidLogo.jsx"],
          dither: ["./src/components/Dither.jsx"],
          "ascii-effects": [
            "./src/components/AsciiEffect.jsx",
            "./src/components/AsciiSceneDark.jsx",
            "./src/components/AsciiSceneLight.jsx",
          ],
          animations: [
            "./src/components/LogoLoop.jsx",
            "./src/components/MultiRowLogoLoop.jsx",
            "./src/components/MetallicPaint.jsx",
          ],
        },
      },
    },
  },
  server: {
    // Expose to local network (access via your IP on same WiFi)
    host: true,
    // Allow connections from specific public tunnel hosts used for testing.
    // You can add more hostnames here if needed.
    allowedHosts: [
      "rude-dryers-beg.loca.lt",
      "happy-moles-cut.loca.lt",
      "36df0344a33f.ngrok-free.app",
      "54a93074926f.ngrok-free.app",
      "bad276294d51.ngrok-free.app",
      "ecd30e2995cf.ngrok-free.app",
      "fe046b7a796e0c.lhr.life",
      "cbe616d28152f5.lhr.life",
      "upset-symbols-rest.loca.lt",
      "96ead36722f5ee.lhr.life",
      "eda110df46647c.lhr.life",
      "2a8534bfe36635.lhr.life",
      "2b87577bcc66.ngrok-free.app",
      "064f6a546f44.ngrok-free.app",
      "2e8dccef22df81.lhr.life",
      "d7744db09a919c.lhr.life",
      "976e1fbf600dd4.lhr.life",
      "oct-must-austin-tions.trycloudflare.com",
    ],
  },
});
