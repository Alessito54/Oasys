import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Habilita HTTPS con certificado autofirmado.
    // Necesario para Web Bluetooth API (requiere Secure Context).
    // Chrome mostrará una advertencia de certificado — click en "Avanzado > Continuar" la primera vez.
  ],
  server: {
    host: 'localhost',
    port: 5173,
    cors: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "unsafe-none"
    }
  }
})
