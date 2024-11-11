module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: { "sans": ["Poppins"] },
    extend: {
      colors: { "secondary": "#FC9E2D" },
      padding: {
        "1/2": "50%",
        full: "100%",
      },
    } 
  },
  plugins: [require("@tailwindcss/forms")],
}
