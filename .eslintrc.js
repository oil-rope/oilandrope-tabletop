module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:jest-dom/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 13,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint", "react", "jest-dom"],
  ignorePatterns: ["**/dist/**", "**/vendor/**"],
  settings: {
    react: {
      version: "17.0.2"
    }
  }
};
