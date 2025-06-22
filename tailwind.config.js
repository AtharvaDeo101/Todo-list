/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#ff9066',
        'primary-orange-hover': '#ff7a4d',
        'dark-brown': '#2a1711',
        'zinc-900-alpha': 'rgba(39, 39, 42, 0.5)',
        'zinc-900-alpha-hover': 'rgba(39, 39, 42, 0.8)',
      },
    },
  },
  plugins: [],
}