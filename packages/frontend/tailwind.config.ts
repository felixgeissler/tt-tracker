import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-safe-area')],
} satisfies Config;
