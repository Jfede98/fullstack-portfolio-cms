import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 6006;
const PREFIX = process.env.AWS_BUCKET_PREFIX || "";

if (!PREFIX) throw new Error("AWS_BUCKET_PREFIX is required");

const distPath = path.join(__dirname, "./web-statics");

app.use(
  `/${PREFIX}`,
  express.static(distPath, {
    index: "index.html",
    redirect: false
  })
);

app.listen(PORT, () =>
  console.log(`Storybook running on http://localhost:${PORT}/${PREFIX}/`)
);
