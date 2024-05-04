import React from 'react';
import { InlineField, TextArea, Stack, Select } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery, QueryType } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

const queryHint = `{
  collection: "collection name",
  aggregations: [
    {
      string: "string",
      date: new Date(),
      id: new ObjectId("573a1393f29313caabcdc50e"),
      bool: true,
      float: 12345.4,
      expandable1: $from,
      expandable2: $to,
      expandable3: $intervalMs
    },
  ],
}`;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const { queryText, queryType } = query;

  return (
    <Stack gap={0} direction="column">
      <InlineField label="Type" labelWidth={16} tooltip="Not used yet">
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
      <InlineField label="Query Text" labelWidth={16} tooltip="Not used yet">
        <TextArea
          style={{ width: 500, minHeight:200 }}
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
}
