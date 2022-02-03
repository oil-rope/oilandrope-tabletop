module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:jest-dom/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest', 'jest-dom'],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  settings: {
    react: {
      version: '17.0.2',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
