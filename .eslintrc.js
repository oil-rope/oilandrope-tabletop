/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jest',
    'testing-library',
  ],
  // 'eslint-testing-library' only for tests
  overrides: [
    {
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  rules: {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'testing-library/no-node-access': [
      'error',
      { allowContainerFirstChild: true },
    ],
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
