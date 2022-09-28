/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { defaults } = require('jest-config');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleDirectories: [...defaults.moduleDirectories, 'src'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  testEnvironment: 'jsdom',
};

module.exports = jestConfig;
