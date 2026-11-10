import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Consumes @awesome-ui/* through their package.json "exports" (the built dist), like a real app.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
