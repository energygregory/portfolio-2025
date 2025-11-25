import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow connections from specific public tunnel hosts used for testing.
    // You can add more hostnames here if needed.
    allowedHosts: [
      "rude-dryers-beg.loca.lt",
    ],
  },
})
