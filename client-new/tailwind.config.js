/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    customForms: theme => ({
      default: {
        checkbox: {
          width: theme('spacing.6'),
          height: theme('spacing.6'),
          backgroundColor: 'rgba(23, 49, 79, 0.6)',
          borderColor: theme('colors.blue.800'),
          textColor: theme('colors.blue.1000'),
          '&:focus': {
            backgroundColor: theme('colors.blue.1000'),
            borderColor: theme('colors.blue.700'),
            boxShadow: undefined,
          },
          '&:checked': {
            backgroundColor: theme('colors.blue.1000'),
            borderColor: 'transparent',
          }
        }
      }
    }),
    extend: {
      colors: {
        teal: {
          ...defaultTheme.colors.teal,
          'flashy': '#24e8cc',
        },
        blue: {
          ...defaultTheme.colors.blue,
          760: '#2C5C94',
          850: '#2B4B74',
          1000: '#17314f'
        },
      },
      spacing: {
        '2px': '2px',
        '3p5': '0.875rem',
        '4b': '1.15rem',
        '11': '2.75rem',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: '0.625rem',
      },
      height: {
        '200': '50rem',
        '1/2': '50%',
      },
      maxWidth: {
        '12': '3rem',
      },
      width: {
        '22': '5.5rem',
      },
    },
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
  ],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './index.html', './src/**/*.{vue,js,ts,jsx,tsx}'
    ]
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
}
