import express, { NextFunction, Request, Response } from "express";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { output as webpackCfgOutput } from "../../webpack.config.js";

const envPort = Number(process.env.DEV_SERVER_PORT);

/** HTTP port of the dev server */
const devServerPort = isNaN(envPort) || envPort < 1024 ? 8710 : envPort;
/** Whether to log requests to the console */
const enableLogging = process.env.DEV_SERVER_LOG === "true";

const app = express();

if(enableLogging) {
  app.use((_req, _res, next) => {
    process.stdout.write("*");
    next();
  });
}

// serve everything from `webpackConfig.output.path` (`dist/` by default)
app.use(express.static(
  resolve(fileURLToPath(import.meta.url), "../../", webpackCfgOutput.path)
));

// disable caching
app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// log errors to the console
app.use((err: unknown, _req: Request, _res: Response, _next: NextFunction) => {
  if(typeof err === "string" || err instanceof Error)
    console.error("\x1b[31mError in dev server:\x1b[0m\n", err);
});

// listen on the configured port and all network interfaces
app.listen(devServerPort, "0.0.0.0", () => {
  const userscriptDevUrl = `http://localhost:${devServerPort}/${encodeURI(webpackCfgOutput.filename)}`;
  console.log(`The dev server is running.\nUserscript is served at \x1b[34m\x1b[4m${userscriptDevUrl}\x1b[0m`);
  if(enableLogging)
    process.stdout.write("\nRequests: ");
  else
    console.log("\x1b[2m(request logging is disabled)\x1b[0m");
});
