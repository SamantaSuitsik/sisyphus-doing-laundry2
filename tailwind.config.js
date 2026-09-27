/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // Main page
        background: "#121213",
        foreground: "#FAFAFA",

        primary: "#FAFAFA",
        "primary-foreground": "#18181B",

        secondary: "#27272A",
        "secondary-foreground": "#FAFAFA",

        muted: "#27272A",
        "muted-foreground": "#A1A1AA",

        // Hover backgrounds
        accent: "#27272A",
        "accent-foreground": "#FAFAFA",

        // Destructive / danger
        destructive: "#EF4444",
        "destructive-foreground": "#FAFAFA",

        border: "#3F3F46",
        input: "#161619",

        ring: "#A1A1AA",

        text: "#FFFFFF",
      },

      fontFamily: {
        syne: ["SyneTactile"],
      },
    },
  },

  plugins: [],
};