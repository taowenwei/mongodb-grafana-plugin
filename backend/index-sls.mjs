import express from "express";
import serverless from "serverless-http";
import { dbConfig, dbQuery } from "./express.mjs";

const app = express();
app.use(express.json());

// grafana: test datasource connect
app.all("/", dbConfig);

// grafana: qeury
app.all("/query", dbQuery);

//default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message ?? "unknown error");
});

export const handler = serverless(app);
