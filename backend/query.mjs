import { ObjectId } from "mongodb"; // to support new ObjectId()

export const buildSubstitution = (req) => {
  const getBucketCount = (from, to, intervalMs) => {
    const current = new Date(from).getTime();
    const toMs = new Date(to).getTime();
    return (toMs - current) / intervalMs;
  };

  return {
    $from: new Date(req.body.range.from),
    $to: new Date(req.body.range.to),
    $dateBucketCount: getBucketCount(
      req.body.range.from,
      req.body.range.to,
      req.body.intervalMs
    ),
  };
};

export const parseQuery = (req, target) => {
  const {
    body: {
      range: { from, to },
      intervalMs,
    },
  } = req;
  const { target: query, type } = target;
  const $from = new Date(from);
  const $to = new Date(to);
  const $intervalMs = intervalMs;
  const getBucketCount = (from, to, intervalMs) => {
    const current = new Date(from).getTime();
    const toMs = new Date(to).getTime();
    return (toMs - current) / intervalMs;
  };

  const jsObject = eval(`(${query})`);
  const { collection, aggregations } = jsObject;
  if (!collection || !aggregations) {
    throw new Error("invalid format. check query placeholder for example");
  }
  return jsObject;
};
