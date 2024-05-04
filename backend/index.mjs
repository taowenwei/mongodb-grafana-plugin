import express from "express";
import { MongoClient } from "mongodb";
import * as Query from "./query.mjs";
import * as Mongo from "./mongo.mjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// grafana: test datasource connect
app.all("/", async (req, res) => {
  let client = null;
  try {
    client = new MongoClient(req.body.db.url);
    await client.connect();
    res.send({
      status: "success",
      message: "MongoDB Connection test OK",
    });
  } catch (err) {
    res.send({
      status: "error",
      message: "MongoDB Connection Error: " + err.message,
    });
  } finally {
    client?.close();
  }
});

// grafana: qeury
app.all("/query", async (req, res, next) => {
  try {
    const results = await Promise.all(
      req.body.targets.map(async (target) => {
        const queryArgs = Query.parseQuery(req, target);
        const result = await Mongo.aggregate(
          req.body.db.url,
          req.body.db.db,
          queryArgs
        );
        return result;
      })
    );
    res.json(results);
  } catch (err) {
    next(err);
  }
});

//default error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message ?? "unknown error");
});

// start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
