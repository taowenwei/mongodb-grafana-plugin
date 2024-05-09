import React from 'react';
import {
  InlineField,
  TextArea,
  Stack,
  Select,
  Modal,
  Button,
  Spinner,
} from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery, QueryType } from '../types';
import { getBackendSrv } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

const queryHint = `[
    {
      string: "string",
      date: new Date(),
      id: new ObjectId("573a1393f29313caabcdc50e"),
      bool: true,
      float: 12345.4,
      expandable1: $from,
      expandable2: $to,
      expandable3: $intervalMs
    }
    {
      ...more stages
    }
  ]`;

export function QueryEditor(props: Props) {
  const {
    query,
    datasource: { baseUrl, db },
    onChange,
    onRunQuery,
  } = props;
  const { collection, queryText, queryType } = query;
  const [collections, setCollections] = React.useState<string[]>([]);
  const [spinner, setSpinner] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    if (!!db && !!baseUrl) {
      (async () => {
        try {
          const response = await getBackendSrv().fetch<string[]>({
            url: `${baseUrl}/collections`,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify(db),
          });
          const values = await lastValueFrom(response);
          const collections = values.data;
          if (collections.length > 0) {
            onChange({ ...query, collection: collections[0] });
          }
          setCollections(collections);
          setSpinner(false);
        } catch (err: any) {
          setErrorMsg(err?.message ?? err);
        }
      })();
    }
    // eslint-disable-next-line
  }, [db, baseUrl]);

  const queryUI = (
    <Stack gap={0} direction="column">
      <InlineField label="Type" labelWidth={20}>
        <Select
          width={20}
          options={[
            { label: QueryType.table, value: QueryType.table },
            { label: QueryType.timeserie, value: QueryType.timeserie },
          ]}
          value={queryType}
          onChange={(sv) => onChange({ ...query, queryType: sv.value!! })}
        />
      </InlineField>
      <InlineField label="Collection Name" labelWidth={20}>
        <Select
          width={50}
          options={collections.map((collection) => ({
            label: collection,
            value: collection,
          }))}
          value={collection}
          onChange={(sv) => onChange({ ...query, collection: sv.value!! })}
        />
      </InlineField>
      <InlineField label="Aggregation Pipeline" labelWidth={20}>
        <TextArea
          style={{ width: 500, minHeight: 200 }}
          value={queryText ?? ''}
          placeholder={queryHint}
          onChange={(event) => {
            onChange({ ...query, queryText: event.currentTarget.value });
          }}
          onBlur={(event) => {
            onChange({ ...query, queryText: event.target.value });
            onRunQuery();
          }}
        />
      </InlineField>
    </Stack>
  );

  const loadingUI = (
    <Stack gap={0} direction="column">
      <Spinner />
      <Modal title="error" isOpen={!!errorMsg}>
        {errorMsg}
        <Modal.ButtonRow>
          <Button onClick={() => setErrorMsg('')}>Ok</Button>
        </Modal.ButtonRow>
      </Modal>
    </Stack>
  );

  return spinner ? loadingUI : queryUI;
}
