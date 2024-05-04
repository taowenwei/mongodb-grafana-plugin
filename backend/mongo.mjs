import { MongoClient } from "mongodb";

// each mongo aggregation result shall have,
// __name: a series's name
// __value: a current value at a time stamp
// __timestamp: a time stamp
const buildTimeseries = (docs) => {
  const row = {
    target: docs.length > 0 ? docs[0]["__name"] : "",
    datapoints: [],
  };
  for (const doc of docs) {
    row.datapoints.push([doc["__value"], doc["__timestamp"]]);
  }
  return row;
};

const buildTable = (docs) => {
  // build superset of columns
  const columns = new Set();
  for (const doc of docs) {
    const keys = Object.keys(doc);
    keys.forEach((key) => columns.add(key));
  }

  // build return rows
  const rows = [];
  for (const doc of docs) {
    const row = [];
    const keys = [...columns];
    keys.forEach((key) => {
      if (key in doc) {
        row.push(doc[key]);
      } else {
        row.push(null);
      }
    });
    rows.push(row);
  }

  return {
    columns: [...columns],
    rows: rows,
    type: "table",
  };
};

export const aggregate = async (uri, dbName, queryArgs) => {
  console.log(JSON.stringify(queryArgs, null, 2));
  let client = null;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const { collection: cname, aggregations, type } = queryArgs;
    const collection = db.collection(cname);

    const docs = await collection.aggregate(aggregations).toArray();
    switch (type) {
      case "timeserie":
        return buildTimeseries(docs);
      case "table":
      default:
        return buildTable(docs);
    }
  } finally {
    client?.close();
  }
};
