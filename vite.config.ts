import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// GitHub Pages serves 404.html when a path is not found. Copy index.html → 404.html
// so client routes (e.g. /2DU/login) load the SPA and React Router can handle the path.
function copy404ForGitHubPages() {
  return {
    name: 'copy-404',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      const indexPath = path.join(outDir, 'index.html')
      const notFoundPath = path.join(outDir, '404.html')
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath)
      }
    }
  }
}

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
// base required for GitHub Pages: site is served at https://<user>.github.io/2DU/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/2DU/' : '/',
  clearScreen: false,
  customLogger: plainLogger,
  plugins: [react(), copy404ForGitHubPages()],
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
        // Single vendor chunk: splitting MUI into its own chunk can cause "X is not a function"
        // at runtime (MUI expects React in same bundle). Keep react + mui + core deps together.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('date-fns')) return 'utils'
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
}))
