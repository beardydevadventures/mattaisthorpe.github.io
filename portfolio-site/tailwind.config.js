import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {},
  },
  darkMode: ['selector', 'theme-dark'],
  plugins: [
    typography,
  ],
}
