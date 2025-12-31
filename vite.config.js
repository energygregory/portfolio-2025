import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow connections from specific public tunnel hosts used for testing.
    // You can add more hostnames here if needed.
    allowedHosts: [
      "rude-dryers-beg.loca.lt",
      "happy-moles-cut.loca.lt",
      "36df0344a33f.ngrok-free.app",
      "54a93074926f.ngrok-free.app",
      "88eda831a155.ngrok-free.app",
      "ff614dd5ac9f.ngrok-free.app",
    ],
  },
});
