/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Główne kolory
        primary: "#069494",
        accent: "#1EE3CF",
        secondary: "#52C5C3",
        'subtle-accent': "#E0F5F5",
        
        // Neutralne
        background: "#F8F9FA",
        surface: "#FFFFFF",
        'text-primary': "#1A202C",
        'text-secondary': "#718096",
        border: "#E2E8F0",
        
        // Systemowe
        success: "#38A169",
        error: "#E53E3E",
        warning: "#DD6B20",
        info: "#3182CE",
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}