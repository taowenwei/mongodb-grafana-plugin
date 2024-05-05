# mongodb-grafana-plugin

this repo tries to modernize the good work from the [mongodb-grafana](https://github.com/JamesOsgood/mongodb-grafana) repo.

the mongodb plugin is a full stack app. it has to, because a webapp can't load a mongodb driver binary in a browser. the plugin has two parts,

- a frontend
    - used by the grafana UI
    - help configure a database connection and collect user queries
- a backend
    - run outside of grafana as a standalone node.js app
    - receive the queries from the frontend
    - call a mongodb driver to execute the queries
    - return as either tabular or timeseries data frames 
## installation
see installation steps [here](./INSTALL.md)

## query

th plugin supports all mongodb aggregation pipeline [operators](https://www.mongodb.com/docs/manual/reference/operator/aggregation/)

### query types

there are two types of query the plugin supports, `table` or `timeserie`.

<img src="./imgs/query-type.png" alt="frontend" style="width: 40%;" />

### query schema
```javascript
  {
    collection: "collection name",
    aggregations: [
      {
        string: "string",
        date: new Date(),
        id: new ObjectId("573a1393f29313caabcdc50e"),
        bool: true,
        number: 12345.4,
        expandable1: $from,
        expandable2: $to,
        expandable3: $intervalMs
      },
    ],
  }
```

<img src="./imgs/query.png" alt="frontend" style="width: 40%;" />

a query is a `javascript` object.

the `collection` field specifies the name of the collection to perform an aggregation.

the `aggregations` field can have multiple aggregation steps. the supported data types are listed above.

`timeserie` in detail

- `$from`, `$to`, `$intervalMs` are grafana expandable variables for using as a time boundary and an interval
- `__name`, `__value`, `__timestamp` are the plugin's internal variables to construct a named grafana timeserie data frame
- an example query can be found at [code](./sample/timeserie-query.json). all 6 variables mentioned above are used. it `$group` by month and `$sum` how many movies were released during a month of a year.

## sample dashboard

an example dashboard can be found at [here](./sample/dashboard.json)

<img src="./imgs/dashboard.png" alt="frontend"/>

courtesy from mongodb atlas's default `sample_mflix` database which collects movies from early 20th century all the way to 2016

## contribution

you're welcomed to contribute to the repo in any way.