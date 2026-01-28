import type { Response, Request } from "express";
import type { Express } from "express";
import express from "express";
import cors from "cors";
import { env } from "node:process";

const app: Express = express();
const port: number = env.PORT ? parseInt(env.PORT) : 3000;

app.use(cors(env.CORS_OPTIONS ? JSON.parse(env.CORS_OPTIONS) : {
    origin: "*",
    optionsSuccessStatus: 200
}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server working!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});