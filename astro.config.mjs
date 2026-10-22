import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';

// Static output only, for GitHub Pages. Custom domain, so no `base`.
export default defineConfig({
  site: 'https://auxilia.io',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [preact(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
