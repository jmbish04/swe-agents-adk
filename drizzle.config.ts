import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/backend/db/schemas/**/*.ts",
  out: "./drizzle",
});
