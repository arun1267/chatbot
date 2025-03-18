/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          'bg-primary': '#ffffff',
          'bg-secondary': '#f9f5ff',
          'text-primary': '#1e293b',
          'text-secondary': '#4b5563',
          'gradient-primary': '#9C27B0', // Purple
          'gradient-secondary': '#E91E63', // Pink/Magenta
        },
        // Dark theme colors
        dark: {
          'bg-primary': '#0f172a',
          'bg-secondary': '#1e293b',
          'text-primary': '#f8fafc',
          'text-secondary': '#cbd5e1',
          'gradient-primary': '#6366f1', // Indigo
          'gradient-secondary': '#3b82f6', // Blue
        },
        primary: {
          light: '#9C27B0', // Purple
          DEFAULT: '#7B1FA2',
          dark: '#6A1B9A',
        },
        secondary: {
          light: '#E91E63', // Pink/Magenta
          DEFAULT: '#C2185B',
          dark: '#880E4F',
        },
        accent: {
          light: '#E1BEE7', // Light purple
          DEFAULT: '#CE93D8',
          dark: '#BA68C8',
        },
      },
    },
  },
  plugins: [],
}

