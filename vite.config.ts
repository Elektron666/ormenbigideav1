import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.',
  plugins: [react()],
  
  // Build optimizations
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      },
      mangle: {
        safari10: true
      }
    },
    chunkSizeWarningLimit: 1000
  },

  // Development optimizations
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: false,
    hmr: {
      overlay: true
    }
  },

  // Preview optimizations
  preview: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: false
  },

  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['lucide-react']
  },

  // CSS optimization
  css: {
    devSourcemap: false
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.2.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  }
});