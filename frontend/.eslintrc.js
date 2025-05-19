// https://docs.expo.dev/guides/using-eslint/
// module.exports = {
//   extends: 'expo',
//   ignorePatterns: ['/dist/*'],
// };

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off', // niepotrzebne w React 17+
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};