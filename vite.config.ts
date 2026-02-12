import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Strip ANSI escape codes so Cursor/VS Code terminal on Windows doesn't glitch
const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '').replace(/\x1b\]8;;[^\x1b]*\x1b\\/g, '')

const seenErrors = new WeakSet<Error>()
const plainLogger = {
  hasWarned: false,
  info(msg: string) {
    process.stdout.write(stripAnsi(msg) + '\n')
  },
  warn(msg: string) {
    this.hasWarned = true
    process.stdout.write(stripAnsi(msg) + '\n')
  },
  warnOnce(msg: string) {
    this.warn(msg)
  },
  error(msg: string) {
    process.stderr.write(stripAnsi(msg) + '\n')
  },
  clearScreen() {
    // no-op: prevents terminal clear that glitches on Windows
  },
  hasErrorLogged(error: Error) {
    return seenErrors.has(error)
  },
}

// https://vitejs.dev/config/
// Terminal (Cursor/VS Code on Windows): customLogger strips ANSI and no-ops clearScreen; do not set logLevel: 'warn' (can freeze).
export default defineConfig({
  clearScreen: false,
  customLogger: plainLogger,
  plugins: [react()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
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
    minify: 'esbuild',
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
    strictPort: false, // Use next port if 4000 in use; avoids "port in use" errors when re-running dev
    hmr: {
      port: 4000
    }
  }
})
