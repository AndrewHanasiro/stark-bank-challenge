import express, { Request, Response } from "express";
import dotenv from "dotenv";

import { Event } from "starkbank";
import { WebhookUsecase } from "../usecase/receive_webhook";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/health", (req: Request, res: Response) => {
  res.send("Ok");
});

// Another example route
app.post("/webhook", async (req: Request, res: Response) => {
  const body = req.body as Event;
  const usecase = WebhookUsecase.getType(body);
  await usecase.process(body);
  res.status(200).send("Received webhook request");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
