import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    clearMocks: true,
    testMatch: ["**/*.test.ts"],
};

export default config;
