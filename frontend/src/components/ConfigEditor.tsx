import React, { ChangeEvent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from '../types';

interface Props
  extends DataSourcePluginOptionsEditorProps<
    MyDataSourceOptions,
    MySecureJsonData
  > {}

export function ConfigEditor(props: Props) {
  const { onOptionsChange, options } = props;

  // Secure field (only sent to the backend)
  const onFieldChanged = (
    event: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const jsonData = {
      ...options.jsonData,
      [field]: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  return (
    <>
      <InlineField
        label="mongodb connection string"
        labelWidth={30}
        interactive
        tooltip={'mongodb connection string'}
      >
        <Input
          required
          id="config-editor-api-key"
          value={options.jsonData?.mongoConnString}
          placeholder="mongodb+srv://[username:password@]host[/[defaultauthdb][?options]]"
          width={40}
          onReset={() => {}}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onFieldChanged(event, 'mongoConnString')
          }
        />
      </InlineField>
      <InlineField
        label="mongodb database name"
        labelWidth={30}
        interactive
        tooltip={'mongodb database name'}
      >
        <Input
          required
          id="config-editor-api-key"
          value={options.jsonData?.databaseName}
          placeholder="dbname"
          width={40}
          onReset={() => {}}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onFieldChanged(event, 'databaseName')
          }
        />
      </InlineField>
      <InlineField
        label="backend url"
        labelWidth={30}
        interactive
        tooltip={'mongodb plugin backend url'}
      >
        <Input
          required
          id="config-editor-api-key"
          value={options.jsonData?.backendUri}
          placeholder="http://localhost:4000"
          width={40}
          onReset={() => {}}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onFieldChanged(event, 'backendUri')
          }
        />
      </InlineField>
    </>
  );
}
