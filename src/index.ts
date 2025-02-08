import serverless from "serverless-http";
import { APIGatewayProxyHandler } from "aws-lambda";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/db";
import config from "./config/commons";
import routes from "./config/routes";
import definition from "./documentation/swagger";
import { serve, setup } from "swagger-ui-express";
import registerRoutes from "./middleware/registerRoutes";

db(config.dbUrl);

const server = express();
server.use(bodyParser.json());
server.use(cors());

routes(server);

server.use(
  "/api-docs",
  serve,
  setup(definition, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: "none",
    },
  })
);

server.use(express.static(config.publicRoute));
server.use(express.static("./static"));
registerRoutes(server);

server.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});

export const handler: APIGatewayProxyHandler = serverless(server);
