module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./setupTests.js"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$"
};
