module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors:{
      index: {
        0: '#FFD000',
        1: '#FF8500',
        2: '#FF0000',
        3: '#FF008C',
      },
      red: '#FF6F4B',
      green: '#2DFF85',
      blue: '#005B77',
      black: '#000000',
      white: '#FFFFFF'
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
