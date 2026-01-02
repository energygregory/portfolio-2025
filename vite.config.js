import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'liquid-logo': ['./src/components/LiquidLogo.jsx'],
          'dither': ['./src/components/Dither.jsx'],
          'ascii-effects': ['./src/components/AsciiEffect.jsx', './src/components/AsciiSceneDark.jsx', './src/components/AsciiSceneLight.jsx'],
          'animations': ['./src/components/LogoLoop.jsx', './src/components/MultiRowLogoLoop.jsx', './src/components/MetallicPaint.jsx'],
        },
      },
    },
  },
  server: {
    // Allow connections from specific public tunnel hosts used for testing.
    // You can add more hostnames here if needed.
    allowedHosts: [
      "rude-dryers-beg.loca.lt",
      "happy-moles-cut.loca.lt",
      "36df0344a33f.ngrok-free.app",
      "54a93074926f.ngrok-free.app",
      "b6e9448af744.ngrok-free.app",
      "ff614dd5ac9f.ngrok-free.app",
      "upset-symbols-rest.loca.lt",
      "unabashed-dayfly-coraline.ngrok-free.dev",
      "2b87577bcc66.ngrok-free.app",
    ],
  },
});
