import type { Config } from 'tailwindcss'
export default {
  content: [
    './src/pages/**/*.{js,jsx,tsx,mdx}',
    './src/components/**/*.{js,jsx,tsx,mdx}',
	],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config

