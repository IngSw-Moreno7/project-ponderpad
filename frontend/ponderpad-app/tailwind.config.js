/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Colores utilizados en el proyecto
      colors: {
        primary: '#4FA7BA',
        secondary: '#EF863E',
      }
    },
  },
  plugins: [],
};
