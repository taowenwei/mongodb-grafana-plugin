# mongodb-grafana-plugin

this repo tries to modernize the good work from the [mongodb-grafana](https://github.com/JamesOsgood/mongodb-grafana) repo.

the mongodb plugin is a full stack app. it has to, because a webapp can't use a mongodb driver binary. it has,

- a frontend
    - used by the grafana UI
    - help configure the database connection and collect user queries
- a backend
    - run outside of grafana as a standalone node.js app
    - receive the queries from the frontend
    - call mongodb driver to execute the queries
    - return as either tabular or timeseries data frames 
## installation
see installation steps [here](./INSTALL.md)

## query