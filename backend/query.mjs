import { ObjectId } from "mongodb"; // to support new ObjectId()

export const parseQuery = (req, target) => {
  const {
    body: {
      range: { from, to },
      intervalMs,
    },
  } = req;
  const { queryText, queryType} = target;
  const $from = new Date(from);
  const $to = new Date(to);
  const $intervalMs = intervalMs;
  
  const getBucketCount = (from, to, intervalMs) => {
    const current = new Date(from).getTime();
    const toMs = new Date(to).getTime();
    return (toMs - current) / intervalMs;
  };

  if (!queryText || !queryType ) {
    return [];
  }
  // expected query format
  // cqueryType = table | timeserie
  // queryText = {
  //   collection: "collection name",
  //   aggregations: [
  //     {
  //       string: "string",
  //       date: new Date(),
  //       id: new ObjectId("573a1393f29313caabcdc50e"),
  //       bool: true,
  //       float: 12345.4,
  //       expandable1: $from,
  //       expandable2: $to,
  //       expandable3: $intervalMs
  //     },
  //   ],
  // };
  const jsObject = eval(`(${queryText})`);
  const { collection, aggregations } = jsObject;
  if (!collection || !aggregations) {
    throw new Error("invalid format. check query placeholder for example");
  }
  return {...jsObject, type: queryType};
};
