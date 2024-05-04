import { FetchResponse, getBackendSrv, isFetchError } from '@grafana/runtime';
import {
  CoreApp,
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
} from '@grafana/data';
import {
  MyQuery,
  MyDataSourceOptions,
  TimeSeriesResponse,
  TableResponse,
  ConnectionResponse,
  QueryType,
} from './types';
import { lastValueFrom } from 'rxjs';
import _ from 'lodash';

interface PluginConfigs {
  url: string;
  db: string;
}

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;
  db: PluginConfigs;
  defaultErrorMessage = 'unknown error';

  constructor(
    instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>
  ) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.jsonData.backendUri;
    this.db = {
      url: instanceSettings.jsonData.mongoConnString,
      db: instanceSettings.jsonData.databaseName,
    };
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return {
      queryText: '',
      queryType: QueryType.timeserie,
    };
  }

  filterQuery(query: MyQuery): boolean {
    // if no query has been provided, prevent the query from being executed
    return !!query.queryText;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    options.targets = options.targets.filter((target) => !target.queryType);
    try {
      const response = (await this.request('/query', options)) as FetchResponse<
        TimeSeriesResponse[] | TableResponse[]
      >;
      const data = response.data;
      const dqr = {
        data: options.targets.map((target, index) => {
          switch (target.queryType) {
            case QueryType.timeserie:
              {
                const targetData = data[index] as TimeSeriesResponse;
                const dataFrame = {
                  name: targetData.target,
                  fields: targetData.datapoints,
                };
                return dataFrame;
              }
              break;
            case QueryType.table:
            default:
              {
                const targetData = data[index] as TableResponse;
                const dataFrame = {
                  name: targetData.type,
                  fields: targetData.rows.map((row) =>
                    targetData.columns.map((col, index) => [
                      col,
                      (row as object[])[index],
                    ])
                  ),
                };
                return dataFrame;
              }
              break;
          }
        }),
      };
      return dqr;
    } catch (err) {
      let message = '';
      if (_.isString(err)) {
        message = err;
      } else if (isFetchError(err)) {
        message =
          'Fetch error: ' + (err.statusText ?? this.defaultErrorMessage);
        if (err.data && err.data.error && err.data.error.code) {
          message += ': ' + err.data.error.code + '. ' + err.data.error.message;
        }
      }
      return { data: [], error: { message } };
    }
  }

  async request(
    url: string,
    body: object
  ): Promise<
    FetchResponse<TimeSeriesResponse[] | TableResponse[] | ConnectionResponse>
  > {
    const response = getBackendSrv().fetch<
      TimeSeriesResponse[] | TableResponse[] | ConnectionResponse
    >({
      url: `${this.baseUrl}${url}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body),
    });
    return lastValueFrom(response);
  }

  /**
   * Checks whether we can connect to the API.
   */
  async testDatasource() {
    try {
      const response = (await this.request('/', {
        db: this.db,
      })) as FetchResponse<ConnectionResponse>;
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: response.data.message ?? this.defaultErrorMessage,
        };
      }
    } catch (err) {
      let message = '';
      if (_.isString(err)) {
        message = err;
      } else if (isFetchError(err)) {
        message =
          'Fetch error: ' + (err.statusText ?? this.defaultErrorMessage);
        if (err.data && err.data.error && err.data.error.code) {
          message += ': ' + err.data.error.code + '. ' + err.data.error.message;
        }
      }
      return {
        status: 'error',
        message,
      };
    }
  }
}
