/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const rotateX = plugin(function ({ addUtilities }) {
    addUtilities({
        '.rotate-y-180': {
            transform: 'rotateY(180deg)',
        },
    });
});
module.exports = {
    content: ['./App.tsx', './app/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4F4397',
                    light: '#9E8FF0',
                    'dark-light': 'rgba(67,97,238,.15)',
                    700: '#008fc6',
                    800: '#0076a3'
                },
                secondary: {
                    DEFAULT: '#005A9E',
                    light: '#ebe4f7',
                    'dark-light': 'rgb(128 93 202 / 15%)',
                },
                success: {
                    DEFAULT: '#00ab55',
                    light: '#ddf5f0',
                    'dark-light': 'rgba(0,171,85,.15)',
                },
                danger: {
                    DEFAULT: '#FB3748',
                    light: '#fff5f5',
                    'dark-light': 'rgba(231,81,90,.15)',
                },
                warning: {
                    DEFAULT: '#e2a03f',
                    light: '#fff9ed',
                    'dark-light': 'rgba(226,160,63,.15)',
                },
                info: {
                    DEFAULT: '#2196f3',
                    light: '#e7f7ff',
                    'dark-light': 'rgba(33,150,243,.15)',
                },
                dark: {
                    DEFAULT: '#282828',
                    light: '#eaeaec',
                    'dark-light': 'rgba(59,63,92,.15)',
                },
                black: {
                    DEFAULT: '#0e1726',
                    light: '#e3e4eb',
                    'dark-light': 'rgba(14,23,38,.15)',
                    priceDesc:'#6D6D6D'
                },
                white: {
                    DEFAULT: '#FFFFFF',
                    light: '#e0e6ed',
                    dark: '#888',
                },
                neutral: {
                    20: '#11111133',
                    400: '#B0B0B0',
                    1000: '#111111',
                },

                neutral100: {
                    DEFAULT: "#F6F6F6"
                },
                neutral500: {
                    DEFAULT: "#6D6D6D"
                },
                neutral200: {
                    DEFAULT: "#D1D1D1"
                },
                neutral800: {
                    DEFAULT: "#454545"
                },
                neutral150: {
                    DEFAULT: "#E8E8E8"
                },
                neutralAlpha20: {
                    DEFAULT: "rgba(40, 40, 40, 0.2)"

                },
                neutralAlpha10: {
                    DEFAULT: "rgba(40, 40, 40, 0.1)"
                },
                YellowAlpha10: {
                    DEFAULT: "rgba(231, 180, 61, 0.1)"
                },
                Yellow200: {
                    DEFAULT: "#D5961D"
                },
                primary200: {
                    DEFAULT: "#E4E7FB"
                },
                primaryAlpha20: {
                    DEFAULT: "rgba(109, 90, 206, 0.2)"
                },
                deepSkyBlue: {
                    DEFAULT: "#E7F7FF"
                },
                raspberry: {
                    DEFAULT: "#FFF4F7"
                },
                red100: {
                    DEFAULT: "#FB3748"
                },
                secondaryAlpha40: {
                    Default: "rgba(0, 90, 158, 0.4)"
                },
                secondaryAlpha20: {
                    Default: "rgba(0, 90, 158, 0.2)"
                },
                primary300: {
                    DEFAULT: "#CFD3F6"
                },
                primary100: {
                    DEFAULT: "#F0F2FD"
                },
                primary700: {
                    DEFAULT: "#6D5ACE"
                }
            },
            borderRadius: {
                '4xl': '28px',
                '6xl': '50.5px',
                '8xl': '60px',
            },
            fontFamily: {
                manrope: 'var(--font-manrope)',
                barlow: 'var(--font-barlow)',
            },
            spacing: {
                4.5: '18px',
            },
            boxShadow: {
                '3xl': '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-invert-headings': theme('colors.white.dark'),
                        '--tw-prose-invert-links': theme('colors.white.dark'),
                        h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
                        h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
                        h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
                        h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
                        h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
                        h6: { fontSize: '16px', marginBottom: '0.5rem', marginTop: 0 },
                        p: { marginBottom: '0.5rem' },
                        li: { margin: 0 },
                        img: { margin: 0 },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
        rotateX,
    ],
};
