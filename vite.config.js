import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteImagemin from "vite-plugin-imagemin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Compress images during build for faster loading
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.7, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: "removeViewBox", active: false },
          { name: "removeEmptyAttrs", active: false },
        ],
      },
    }),
  ],
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
      "b6e9448af744.ngrok-free.app",
      "ff614dd5ac9f.ngrok-free.app",
      "upset-symbols-rest.loca.lt",
      "eda110df46647c.lhr.life",
      "2b87577bcc66.ngrok-free.app",
      "064f6a546f44.ngrok-free.app",
      "https://thick-bananas-deny.loca.lt",
    ],
  },
});
