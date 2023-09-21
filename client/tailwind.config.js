/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
 */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      'xxs': ['0.625rem'],
      'xs': ['0.75rem'],
      'sm': ['0.875rem'],
      'base': ['1rem'],
      'lg': ['1.125rem'],
      'xl': ['1.25rem'],
      '2xl': ['1.5rem'],
      '3xl': ['1.875rem'],
      '4xl': ['2.25rem'],
      '5xl': ['3rem'],
      '6xl': ['3.75rem'],
      '7xl': ['4.5rem'],
      '8xl': ['6rem'],
      '9xl': ['8rem'],
    },
    customForms: (theme) => ({
      default: {
        checkbox: {
          'width': theme('spacing.6'),
          'height': theme('spacing.6'),
          'backgroundColor': 'rgba(23, 49, 79, 0.6)',
          'borderColor': theme('colors.blue.800'),
          'textColor': theme('colors.blue.1000'),
          '&:focus': {
            backgroundColor: theme('colors.blue.1000'),
            borderColor: theme('colors.blue.700'),
            boxShadow: undefined,
          },
          '&:checked': {
            backgroundColor: theme('colors.blue.1000'),
            borderColor: 'transparent',
          },
        },
      },
    }),
    extend: {
      colors: {
        teal: {
          100: '#E6FFFA',
          200: '#B2F5EA',
          300: '#81E6D9',
          400: '#4FD1C5',
          500: '#38B2AC',
          600: '#319795',
          700: '#2C7A7B',
          800: '#285E61',
          900: '#234E52',
          flashy: '#24e8cc',
        },
        blue: {
          100: '#EBF8FF',
          200: '#BEE3F8',
          300: '#90CDF4',
          400: '#63B3ED',
          500: '#4299E1',
          600: '#3182CE',
          700: '#2B6CB0',
          800: '#2C5282',
          900: '#2A4365',
          760: '#2C5C94',
          850: '#2B4B74',
          1000: '#17314f',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
