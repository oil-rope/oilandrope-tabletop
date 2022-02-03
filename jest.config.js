/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { defaults } = require('jest-config');

module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  errorOnDeprecated: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleDirectories: [...defaults.moduleDirectories, 'src'],
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@Components/(.*)$': '<rootDir>/src/components/$1',
  },
};
