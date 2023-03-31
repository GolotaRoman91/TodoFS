module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.css$": "identity-obj-proxy",
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
    testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx}"],
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.test.json",
        },
    },
};
