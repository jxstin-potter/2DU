import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Prefer TypeScript source over compiled .js so edits to .tsx/.ts are used
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mts', '.mjs', '.json'],
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-date-pickers',
      '@mui/utils',
      '@mui/system',
      '@popperjs/core',
      'react-is',
      'react-transition-group',
      'stylis',
      'date-fns',
      'date-fns/locale/en-US'
    ]
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'mui'
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('firebase')) {
              return 'vendor'
            }
            if (id.includes('date-fns')) {
              return 'utils'
            }
            return 'vendor'
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    sourcemap: false,
    reportCompressedSize: false
  },
  server: {
    port: 4000,
    strictPort: true,
    hmr: {
      port: 4000
    }
  }
})
