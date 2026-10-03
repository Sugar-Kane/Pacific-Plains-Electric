import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 3,
  use: { baseURL: "http://127.0.0.1:3000", headless: true },
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    command: "npm run start -- --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
  },
});
