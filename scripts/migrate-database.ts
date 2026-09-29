import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import * as path from 'path';
import { Pool } from 'pg';

interface DatasourceYaml {
  url: string;
  name: string;
  username: string;
  password: string;
  ssl?: boolean;
  migrationBasePath: string;
}

const raw = readFileSync(
  path.resolve(
    process.cwd(),
    `apps/swet-service/swet-service-${process.env.NODE_ENV}.yml`,
  ),
  'utf8',
);

const parsed = load(raw) as Record<string, Record<string, DatasourceYaml>>;
const datasourceConfig = parsed.swet.database;
const url = datasourceConfig.url
  .replaceAll('${swet.database.', '')
  .replace('username}', datasourceConfig.username)
  .replace('password}', datasourceConfig.password)
  .replace('name}', datasourceConfig.name);

async function main() {
  const pool = new Pool({
    connectionString: url,
    ssl: datasourceConfig.ssl ?? false,
  });
  const db = drizzle(pool, { casing: 'snake_case' });

  console.log(
    `Applying migrations from ${datasourceConfig.migrationBasePath} ...`,
  );
  await migrate(db, { migrationsFolder: datasourceConfig.migrationBasePath });
  console.log('Migrations applied successfully.');

  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
