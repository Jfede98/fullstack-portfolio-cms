import type { Config } from "jest";

const config: Config = {
  testPathIgnorePatterns: ["/node_modules/", "/\\.tmp/", "/\\.cache/"],
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json"
      }
    ]
  },
  coverageDirectory: "../../coverage/apps/backend",
  collectCoverage: true,
  coverageReporters: ["lcov", "text"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

export default config;
