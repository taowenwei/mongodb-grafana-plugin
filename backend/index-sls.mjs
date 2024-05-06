import express from "express";
import serverless from "serverless-http";
import { dbConfig, dbQuery } from "./express.mjs";

const app = express();
app.use(express.json());

// don't know why, but once deployed to an aws api gateway
// the full stage+route name, /[aws api gateway stage name]/[aws api gateway route name],
// is required for express.js to route properly
// e.g.
// /default/mongo
const awsApiGatewayRoute = "";

// grafana: test datasource connect
app.all(`${awsApiGatewayRoute}/`, dbConfig);

// grafana: qeury
app.all(`${awsApiGatewayRoute}/query`, dbQuery);

//default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message ?? "unknown error");
});

export const handler = serverless(app);
