/** @type {import('tailwindcss').Config} */

import colors from './constants/colors';
import typography from './constants/typography';

module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./components/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      ...typography,
    },
  },
  plugins: [],
};
