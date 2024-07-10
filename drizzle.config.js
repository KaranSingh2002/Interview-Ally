/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://karan_owner:xmhc1AS4eMLa@ep-long-truth-a58617i0.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require",
  },
};
