

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-yellow-400',
    'hover:bg-yellow-300',
    'border-yellow-500'
  ],
};

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          // ... you can define your specific emerald teal hex codes here
          700: '#047857', 
          800: '#065f46',
        }
      }
    }
  }
}

export default config;
