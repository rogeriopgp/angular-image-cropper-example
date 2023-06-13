/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
    screens: {
      'xs': '450px',
      'sm':	'640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1366px',
      '2xl': '1536px',
      '3xl': '1920px',
      'xs-only': {'min': '250px', 'max': '450px'},
      'sm-only':	{'min': '451px', 'max': '640px'},
      'md-only': {'min': '641px', 'max': '768px'},
      'lg-only': {'min': '769px', 'max': '1024px'},
      'xl-only': {'min': '1025px', 'max': '1366px'},
      '2xl-only': {'min': '1367px', 'max': '1536px'},
      '3xl-only': {'min': '1537px', 'max': '1920px'},
      'lt-xs': {'max': '450px'},
      'lt-sm': {'max': '640px'},
      'lt-md': {'max': '768px'},
      'lt-lg': {'max': '1024px'},
      'lt-xl': {'max': '1366px'},
      'lt-2xl': {'max': '1536px'},
      'lt-3xl': {'max': '1920px'},
    }
  },
  plugins: [],
}
