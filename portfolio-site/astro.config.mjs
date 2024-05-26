import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), sitemap()],
  site: 'https://matthewaisthorpe.com.au',
  //base: 'mattaisthorpe.github.io',
  redirects: {
    '/vr/streaming-oculusmeta-quest-2-to-discord': {
      status: 301,
      destination: '/posts/vr/stream-quest-to-discord'
    },
    '/hosting/host-unity-projects-on-github-pages': {
      status: 301,
      destination: '/posts/unity/host-unity-github-pages'
    },
    '/code/json-object-vs-json-array': {
      status: 301,
      destination: '/posts/code/json-object-vs-array'
    }
  }
});