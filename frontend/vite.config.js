import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,                 // or 5174 if you prefer
    proxy: {
      '/api': 'http://localhost:4000'   // backend dev server
    }
  }
});
