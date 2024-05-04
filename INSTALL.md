# installation

0. clone the repo

1. download grafana from [here](https://grafana.com/grafana/download) and install it locally 

2. grafana settings, conf/defaults.ini, enable unsigned plugins (yes, the plugin is unsigned)

<img src="./imgs/unsigned.png" alt="unsigned" style="zoom: 50%;" />

3. copy the `frontend` folder to the installed grafana

<img src="./imgs/frontend-install.png" alt="frontend" style="width: 40%;" />

build the frontend
```bash
cd [grafana installed path]/data/plugins/frontend
npm install
npm run dev
```

4. launch grafana
```bash
cd [grafana installed path]
./bin/grafana server
```
<img src="./imgs/plugin.png" alt="plugin" style="zoom: 50%;" />

5. add and configure the datasource

choose `Mongodb-Grafana-Plugin`

<img src="./imgs/datasource.png" alt="plugin" style="zoom: 50%;" />

configure the mongodb connection parameters and the plugin's backend url. **<span style="color:red;">DON'T</span>** click the `Save & test` button yet. let's do it at step 7.


<img src="./imgs/datasource-config.png" alt="plugin" style="zoom: 50%;" />

6. debug the frontend

since it is a debug build in step 3 `npm run dev`, you code change in the frontend will take effect immediately. open a chrome's inspector, just do an `Empty Cache and Hard Reload` to load the new change(s). 

you will then be able to view the source, set breakpoints, step through the code; just like debugging any react.js apps

<img src="./imgs/frontend-debug.png" alt="plugin" style="zoom: 50%;" />

7. debug the `backend`

```bash
cd [repo path]/backend
npm install
```

open the repo from visual studio code. the backend is in the `backend` folder. it is default hardcoded to use port number 4000 and a `launch.json` has been provided. just `Run | Start Debugging` from menu bar. you can set a breakpoiint at [code](./backend/index.mjs#L15)

<img src="./imgs/backend-debug.png" alt="plugin" style="zoom: 50%;" />

7. save the database connection

click on the `Save & test` button. your breakpoint in step 6 shall be triggered

<img src="./imgs/config-done.png" alt="plugin" style="zoom: 50%;" />

hurray! you have everything set up.