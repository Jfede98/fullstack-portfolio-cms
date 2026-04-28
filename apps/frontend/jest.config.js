const nextJest = require("next/jest.js");

const createJestConfig = nextJest({
  dir: "./test"
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/dist/"],
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@modules/(.*)$": "<rootDir>/src/modules/$1",
    "^@context/(.*)$": "<rootDir>/src/context/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@views/(.*)$": "<rootDir>/src/views/$1",
    "^@next$": "<rootDir>/src/lib/config/next/index.ts",
    "^@global-styles$": "<rootDir>/src/styles/globals.css",
    "^@sitio-publico/shared-ui$": "<rootDir>/../../libs/shared-ui/src/lib/main",
    "^@shared-ui/components/(.*)$":
      "<rootDir>/../../libs/shared-ui/src/lib/components/$1",
    "^@shared-ui/interfaces/(.*)$":
      "<rootDir>/../../libs/shared-ui/src/lib/interfaces/$1",
    "^@shared-ui/config/(.*)$":
      "<rootDir>/../../libs/shared-ui/src/lib/config/$1",
    "^@shared-ui/constants/(.*)$":
      "<rootDir>/../../libs/shared-ui/src/lib/constants/$1",
    "^@shared-ui/hooks/(.*)$":
      "<rootDir>/../../libs/shared-ui/src/lib/hooks/$1",
    "^@shared-ui/helpers/(.*)$":
      "<rootDir>/../../libs/shared-ui/src/lib/helpers/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
    "^.+\\.(png|jpg|jpeg|gif|webp|svg|ico)$": "<rootDir>/__mocks__/fileMock.ts"
  },
  collectCoverage: true,
  coverageDirectory: "../../coverage/apps/frontend",
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

module.exports = createJestConfig(customJestConfig);
