import { MongoClient } from "mongodb";
import * as Query from "./query.mjs";
import * as Mongo from "./mongo.mjs";

// grafana: test datasource connect
export const dbConfig = async (req, res) => {
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
};

// grafana: qeury
export const dbQuery = async (req, res, next) => {
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
};

// grafana: getall collection names
export const dbCollections = async (req, res) => {
  const { url, db } = req.body;
  let client = null;
  try {
    client = new MongoClient(url);
    await client.connect();
    const cursor = await client.db(db).listCollections().toArray();
    const collections = cursor.map((collection) => collection.name);
    res.json(collections);
  } finally {
    client?.close();
  }
};
