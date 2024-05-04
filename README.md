# mongodb-grafana-plugin

this repo tries to modernize the good work from the [mongodb-grafana](https://github.com/JamesOsgood/mongodb-grafana) repo.

## installation
0. clone the repo

1. download and install grafana locally from [here](https://grafana.com/grafana/download)

2. enable unsigned plugins (yes, the plugin is unsigned)

<img src="./imgs/unsigned.png" alt="unsigned" style="zoom: 50%;" />

3. copy the `frontend` folder to the installed grafana

<img src="./imgs/frontend-install.png" alt="frontend" style="zoom: 40%;" />

build the frontend
```bash
cd [grafana installed path]/data/plugins/frontend
npm install
npm run dev
```

**<ins>after step 4 and 5 below</ins>**, since it is a debug build, you code change in the frontend will take effect immediately. open chrome's inspector, just do an `Empty Cache and Hard Reload` to load the new change(s).

<img src="./imgs/frontend-debug.png" alt="plugin" style="zoom: 50%;" />

4. launch grafana
```bash
cd [grafana installed path]
./bin/grafana server
```
<img src="./imgs/plugin.png" alt="plugin" style="zoom: 50%;" />

5. add and configure the datasource

choose `Mongodb-Grafana-Plugin`
<img src="./imgs/datasource.png" alt="plugin" style="zoom: 50%;" />

configure the mongodb connection parameters and the plug's backend url
<img src="./imgs/datasource-config.png" alt="plugin" style="zoom: 50%;" />

6. run the `backend`

open the repo from visual studio code. the backend is in the `backend` folder. it is default hardcoded to use port number 4000 and a `launch.json` has been provided. just `Run | Start Debugging` from menu bar

<img src="./imgs/backend-debug.png" alt="plugin" style="zoom: 50%;" />