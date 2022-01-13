module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    "eslint:recommended",
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
  plugins: ["react", "jest-dom"],
  ignorePatterns: ["**/dist/"],
  settings: {
    react: {
      version: "17.0.2"
    }
  }
};
