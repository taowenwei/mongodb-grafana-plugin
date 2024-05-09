# ways of deployment

## 1. AWS serverless (lambda)

### setup

you will need an aws api gateway and a new aws lambda function to begin with

the index-sls.mjs is your lambda function's entry point

when you create a new route in api gateway, don't know why, the full stage name and the route name of the api gateway need to be baked into the index-sls.mjs's app.all(`route`)

## build and deploy

```bash
sls package

aws s3 cp ./serverless/lambda-mongo-grafana.zip s3://[bucket name]/[path key]

aws lambda update-function-code --function-name [your lambda name] --s3-bucket [bucket name] --s3-key [path key] --region [region of your lambda]
```

## 2. Docker container

```bash
docker build -t mongo-grafana .
docker run -d -p 4000:4000 mongo-grafana
```
