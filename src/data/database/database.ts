import {open, type NitroSQLiteConnection} from 'react-native-nitro-sqlite';
import {SCHEMA_VERSION, schemaStatements} from './schema';

const connection: NitroSQLiteConnection = open({name: 'haulsafe.sqlite'});
let initialization: Promise<void> | undefined;

export function getDatabase(): NitroSQLiteConnection {
  return connection;
}

export function initializeDatabase(): Promise<void> {
  if (!initialization) {
    initialization = (async () => {
      await connection.executeAsync('PRAGMA foreign_keys = ON');
      await connection.executeAsync('PRAGMA journal_mode = WAL');
      await connection.executeBatchAsync(
        schemaStatements.map(query => ({query})),
      );
      await connection.executeAsync(
        `INSERT INTO app_meta(key, value) VALUES('schema_version', ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [String(SCHEMA_VERSION)],
      );
    })();
  }
  return initialization;
}
