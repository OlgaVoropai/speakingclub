import fs from 'fs';
import path from 'path';
import { minify } from 'html-minifier-terser';

const distDir = path.resolve('dist');

// Recursively copy directory
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  if (stats && stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

async function build() {
  console.log('Building project into dist/...');

  // Clean / recreate dist
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // Copy assets, css, js, data, robots.txt, sitemap.xml
  const itemsToCopy = ['css', 'js', 'data', 'assets', 'robots.txt', 'sitemap.xml'];
  for (const item of itemsToCopy) {
    if (fs.existsSync(item)) {
      copyRecursiveSync(item, path.join(distDir, item));
    }
  }

  // Minify HTML files: index.html, privacy.html, 404.html
  const htmlFiles = ['index.html', 'privacy.html', '404.html'];
  for (const file of htmlFiles) {
    if (fs.existsSync(file)) {
      const htmlContent = fs.readFileSync(file, 'utf8');
      const minified = await minify(htmlContent, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      });
      fs.writeFileSync(path.join(distDir, file), minified, 'utf8');
    }
  }

  console.log('Build completed successfully!');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
