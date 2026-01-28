import type { Response, Request } from "express";
import type { Express } from "express";
import express from "express";
import cors from "cors";

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Middlewares
app.use(cors(
  process.env.CORS_OPTIONS
    ? JSON.parse(process.env.CORS_OPTIONS)
    : {
      origin: "*",
      optionsSuccessStatus: 200
    }
));
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response): void => {
  res.send("Server working!");
});

// Start server
app.listen(port, (): void => {
  console.log(`Server is running at http://localhost:${port}`);
});