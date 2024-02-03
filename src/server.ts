require("dotenv").config();
import express, { Request, Response } from 'express';
import cors from "cors";
import logger from './utils/logger'
import pool from './utils/db'
import notFoundRoute from "./services/notFound/routes";

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
  res.json('Hello, this is your TypeScript REST API!');
});

// 404 route
app.use(notFoundRoute);

// Graceful termination function
const shutdown = async () => {
  logger.info("Received signal to terminate. Closing connections...");
  try {
    await pool.end(); // Close all connections in the pool gracefully
    logger.info("Database connections closed. Shutting down server...");
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