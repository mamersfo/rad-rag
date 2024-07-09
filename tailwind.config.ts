/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        finalist: {
          primary: '#ff9100',
          'primary-content': '#000',
          secondary: '#faefe7',
          'secondary-content': '#000',
          accent: '#c0c0ff',
          'accent-content': '#000',
          neutral: '#162020',
          'neutral-content': '#fff',
          'base-100': '#ffffff',
          'base-100-content': '#000',
          'base-200': '#dfe5e5',
          'base-200-content': '#000',
          'base-300': '#c1cece',
          'base-300-content': '#fff',
        },
      },
    ],
  },
};
