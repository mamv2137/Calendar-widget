import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'PaymentWidget',
      formats: ['umd', 'es'],
      fileName: (format) => `payment-widget.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: 'payment-widget.[ext]',
        // Exponer funciones para inicialización desde host
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
