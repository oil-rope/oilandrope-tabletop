/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { defaults } = require('jest-config');

module.exports = {
  automock: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  errorOnDeprecated: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleDirectories: [...defaults.moduleDirectories, 'src'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'scss', 'css'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@Components/(.*)$': '<rootDir>/src/components/$1',
    '^@Constants$': '<rootDir>/src/const/globalConst',
    '^@Contexts$': '<rootDir>/src/contexts',
    '^@Utils/(.*)$': '<rootDir>/src/utils/$1',
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  verbose: true,
};
