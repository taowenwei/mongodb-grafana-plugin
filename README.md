# mongodb-grafana-plugin

this repo tries to modernize the good work from the [mongodb-grafana](https://github.com/JamesOsgood/mongodb-grafana) repo.

## installation
1. download and install grafana locally from [here](https://grafana.com/grafana/download)

2. enable unsigned plugins (yes, the plugin is unsigned)
![unsigned screenshot](./imgs/unsigned.png)

3. copy the `frontend` folder to the installed grafana
<img src="./imgs/frontend-install.png" alt="frontend" style="zoom: 50%;" />

4. launch grafana
```bash
cd [grafana installed path]
./bin/grafana server
```
<img src="./imgs/plugin.png" alt="plugin" style="zoom: 50%;" />
