const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

// Clear gh-pages cache to avoid "destination path already exists" on Windows
const cacheDir = path.join(root, 'node_modules', '.cache', 'gh-pages');
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true });
}

if (!fs.existsSync(distDir)) {
  console.error('Run "npm run build" first.');
  process.exit(1);
}

// Deploy dist contents at branch root. GitHub Pages project site serves branch root at /2DU/
execSync('npx gh-pages -d dist', { cwd: root, stdio: 'inherit' });
