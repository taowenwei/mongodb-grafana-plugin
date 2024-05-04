import React from 'react';
import { InlineField, TextArea, Stack, Select } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery, QueryType } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const { queryText, queryType } = query;

  return (
    <Stack gap={0}>
      <InlineField label="Query Text" labelWidth={16} tooltip="Not used yet">
        <Select
          options={[{ value: QueryType.table }, { value: QueryType.timeserie }]}
          value={queryType}
          onChange={(sv) => onChange({ ...query, queryType: sv.value!! })}
        />
      </InlineField>
      <InlineField label="Query Text" labelWidth={16} tooltip="Not used yet">
        <TextArea
          id="query-editor-query-text"
          value={queryText ?? ''}
          required
          placeholder="db.[collection name].aggregate([...])"
          onBlur={(event) => {
            onChange({ ...query, queryText: event.target.value });
            onRunQuery();
          }}
        />
      </InlineField>
    </Stack>
  );
}
