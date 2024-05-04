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

export const parseQuery = (req) => {
  const forIn = (obj, processFunc) => {
    for (const key in obj) {
      const value = obj[key];
      processFunc(obj, key, value);
      if (value != null && typeof value == "object") {
        forIn(value, processFunc);
      }
    }
  };

  const queryArgs = {};
  query = query.trim();
  if (query.substring(0, 3) != "db.") {
    throw new Error("query must start with db.");
  }

  // Query is of the form db.<collection>.aggregate or db.<collection>.find
  // Split on the first ( after db.
  const openBracketIndex = query.indexOf("(", 3);
  if (openBracketIndex == -1) {
    throw new Error("can't find opening bracket");
  } else {
    // Split the first bit - it's the collection name and operation ( must be aggregate )
    const parts = query.substring(3, openBracketIndex).split(".");
    // Collection names can have .s so last part is operation, rest is the collection name
    if (parts.length >= 2) {
      queryArgs.operation = parts.pop().trim();
      queryArgs.collection = parts.join(".");
    } else {
      throw new Error("invalid collection and operation syntax");
    }

    // Args is the rest up to the last bracket
    const closeBracketIndex = query.indexOf(")", openBracketIndex);
    if (closeBracketIndex == -1) {
      throw new Error("can't find last bracket");
    } else {
      const args = query.substring(openBracketIndex + 1, closeBracketIndex);
      if (queryArgs.operation == "aggregate") {
        // Wrap args in array syntax so we can check for optional options arg
        docs = JSON.parse(`[${args}]`);
        // First Arg is pipeline
        queryArgs.pipeline = docs[0];
        // If we have 2 top level args, second is agg options
        if (docs.length == 2) {
          queryArgs.agg_options = docs[1];
        }
        // Replace with substitutions
        for (const stage of queryArgs.pipeline) {
          forIn(stage, function (obj, key, value) {
            if (typeof value == "string") {
              if (value in substitutions) {
                obj[key] = substitutions[value];
              }
            }
          });
        }
      } else {
        throw new Error(
          "unknown operation " +
            queryArgs.operation +
            ", only aggregate supported"
        );
      }
    }
  }

  return queryArgs;
};
