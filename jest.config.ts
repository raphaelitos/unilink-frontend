import type { Config } from "jest";
const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  transform: { "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass)$": "<rootDir>/tests/styleMock.js",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};
export default config;
