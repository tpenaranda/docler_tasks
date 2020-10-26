module.exports = {
  theme: {
    fontFamily: {
      body: ["Montserrat, sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    textColor: theme => {
      return {
        ...theme("colors"),
        "rt-green": "#05D477",
      }
    },
    extend: {
      colors: {
        "rt-green": "#05D477",
        "rt-green-light": "#06E07E",
        "rt-green-dark": "#03703F",
        "rt-pale-sky": "#657687",
        "rt-white-smoke": "#F4F4F4",
      },
      fontSize: {
        xxs: "0.675rem",
        "8xl": "5rem",
        "9xl": "6rem",
        "10xl": "7rem",
      },
    },
  },
  variants: {},
  plugins: [],
  prefix: "",
  important: false,
  purge: ["./src/**/*.jsx"],
  future: {
    defaultLineHeights: true,
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
    standardFontWeights: true,
  },
}
