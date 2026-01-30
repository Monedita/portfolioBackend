import type { Response, Request } from "express";
import type { Express } from "express";

import express from "express";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import router from './routes/index';
import errorHandler from "./middlewares/errorHandler.middleware";

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentación generada automáticamente con Swagger",
    },
  },
  apis: ["./src/routes/**/*.ts", "./src/models/**/*.ts"], // Ajusta las rutas según tu estructura
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

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

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (req: Request, res: Response): void => {
  res.send("Server working!");
});
app.use('/api', router);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, (): void => {
  console.log(`Server is running at http://localhost:${port}`);
});