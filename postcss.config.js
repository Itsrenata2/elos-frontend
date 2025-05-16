module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jost: ['"Jost"', "sans-serif"],
        nunito: ['"Nunito Sans"', "sans-serif"],
      },
      colors: {
        zinc: {
          950: "#09090b",
          900: "#18181b",
          800: "#27272a",
          200: "#e4e4e7",
          50: "#fafafa",
        },
      },
    },
  },
  plugins: [],
};
