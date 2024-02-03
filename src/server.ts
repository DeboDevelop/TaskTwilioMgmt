require("dotenv").config();
import express, { Request, Response } from 'express';
import cors from "cors";
import logger from './utils/logger'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Middleware for logging incoming requests
app.use((req: Request, res: Response, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, this is your TypeScript REST API!');
});

// 404 route
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

// Graceful termination function
const shutdown = async () => {
  logger.info("Received signal to terminate. Closing connections...");
  try {
      process.exit(0);
  } catch (error) {
      logger.error("Error while closing connections:", error);
      process.exit(1);
  }
};

app.listen(port, () => {
  logger.info(`Server is running on PORT ${port}`);
});

// Handle SIGINT (Ctrl+C) and SIGTERM signals for graceful termination
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:");
  logger.error(promise);
  logger.error("reason:");
  logger.error(reason);
  // Recommended to close the server and exit the process when there are unhandled promise rejections
  shutdown();
});