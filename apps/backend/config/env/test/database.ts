const databaseConfig = ({ env }: { env: (key: string, defaultValue?: string) => string }) => {
  const filename = env('DATABASE_FILENAME', '.tmp/test.db');
  const rawClient = env('DATABASE_CLIENT', 'sqlite');
  const client = ['sqlite3', 'better-sqlite3'].includes(rawClient)
    ? 'sqlite'
    : rawClient;

  return {
    connection: {
      client,
      connection: {
        filename,
      },
      useNullAsDefault: true,
    },
  };
};

export default databaseConfig;
