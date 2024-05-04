import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export enum QueryType {
  table = 'table',
  timeserie = 'timeserie',
}

export interface MyQuery extends DataQuery {
  queryText: string;
  queryType: QueryType;
}

export interface TimeSeriesResponse {
  target: string;
  datapoints: object[];
}

export interface TableResponse {
  type: string;
  rows: object[];
  columns: string[];
}

export interface ConnectionResponse {
  status: string;
  message: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  backendUri: string;
  mongoConnString: string;
  databaseName: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {}
