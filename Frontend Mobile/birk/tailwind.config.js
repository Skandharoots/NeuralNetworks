/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media", // Enable dark mode support
  variants: {
    extend: {
      textOpacity: ["dark"], // Enable dark mode variants for textOpacity
    },
  },
  theme: {
    extend: {
      colors: {
        irish: {
                main: 'rgb(39, 99, 24)',
                light: 'rgb(61, 147, 40)',
                dark: 'rgb(39, 99, 24)',
                contrastText: 'rgb(255, 255, 255)',
            },
            background: {
                light: 'rgb(255, 255, 255)',
                dark: 'rgb(20, 20, 20)',
            },
            text: {
                light: 'rgb(0, 0, 0)',
                dark: 'rgb(255, 255, 255)',
            },
            editBtn: {
                main: 'rgb(255, 189, 3)',
                light: 'rgb(255,211,51)',
            },
            errorBtn: {
                main: 'rgb(159,20,20)',
                light: 'rgb(193,56,56)',
            },
            blueBtn: {
                main: 'rgb(11,108,128)',
                light: 'rgb(16,147,177)',
            },
            downloadBtn: {
                main: 'rgb(117,31,131)',
                light: 'rgb(174,68,189)',
            },
            account: {
                main: 'rgb(0, 0, 0)',
                dark: 'rgb(255, 255, 255)',
                light: 'rgb(0, 0, 0)',
            },
            shadowLink: {
                main: 'rgba(184, 184, 184, 0.2)',
                light: 'rgba(184, 184, 184, 0.2)',
                dark: 'rgba(255, 255, 255, 0.4)',
            },
            shadow: {
                main: 'rgba(184, 184, 184, 0.2)',
                light: 'rgba(184, 184, 184, 0.4)',
                dark: 'rgba(255, 255, 255, 0.2)',
            },
      },
    },
  },
  fontFamily: {
    serif: ["Verdana", "Georgia", "serif"],
  },
  plugins: [],
}