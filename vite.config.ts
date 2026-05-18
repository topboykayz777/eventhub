import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Standardizing the literal type to satisfy the TS compiler
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['lucide-react', 'framer-motion', 'clsx', 'tailwind-merge'],
          'vendor-db': ['@supabase/supabase-js', '@tanstack/react-query'],
        },
      },
    },
  },
});