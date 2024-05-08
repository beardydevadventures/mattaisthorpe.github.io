import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()]
} //site: 'https://beardydevadventures.github.io/',
//base: 'mattaisthorpe.github.io',
);