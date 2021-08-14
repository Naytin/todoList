module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: ['active','hover','checked'],
      backgroundImage: ['hover'],
      textColor: ['hover'],
      borderColor: ['checked'],
      borderWidth: ['hover'],
      opacity: ['checked'],
      scale: ['hover'],
      transform: ['hover'],
      translate: ['hover'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}