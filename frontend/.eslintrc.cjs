module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'expo',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    camelcase: ['error', { properties: 'never' }],
    quotes: ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/no-require-imports': 'off',
  },
};
