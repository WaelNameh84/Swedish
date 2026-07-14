import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import router from "./routes";
import { logger } from "./lib/logger";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk proxy must be mounted before body parsers (it streams raw bytes).
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? false : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Resolve the publishable key from the incoming request host so the same
// server can serve multiple Clerk custom domains.
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

// API routes always take priority
app.use("/api", router);

// In production: serve the built React frontend as static files
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // STATIC_DIR env var for Render.com, fallback to relative path
  const staticDir =
    process.env.STATIC_DIR ||
    path.resolve(__dirname, "../../../artifacts/svenska-learn/dist/public");

  if (existsSync(staticDir)) {
    logger.info({ staticDir }, "Serving static frontend");
    app.use(express.static(staticDir));

    // SPA catch-all: any route not matched by /api returns index.html
    app.get("/*path", (_req, res) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });
  } else {
    logger.warn({ staticDir }, "Static dir not found, skipping static serving");
  }
}

export default app;
