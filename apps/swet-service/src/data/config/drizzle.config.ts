import type { DatasourceConfig } from '@swet/common/config/datasource.config';
import { defineConfig } from 'drizzle-kit';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import * as path from 'path';

const raw = readFileSync(
  path.resolve(__dirname, `../../../swet-service-${process.env.NODE_ENV}.yml`),
  'utf8',
);

const parsed = load(raw) as Record<string, Record<string, DatasourceConfig>>;
const datasourceConfig = parsed.swet.database;
const url = datasourceConfig.url
  .replaceAll('${swet.database.', '')
  .replace('username}', datasourceConfig.username)
  .replace('password}', datasourceConfig.password)
  .replace('name}', datasourceConfig.name);

const migrationsAbsolute = path.resolve(__dirname, 'migrations');
const migrationsRelative = path.relative(process.cwd(), migrationsAbsolute);

export default defineConfig({
  out: migrationsRelative,
  schema: [
    path.join(datasourceConfig.baseModelPath, '**', '*.enum.ts'),
    path.join(__dirname, '..', 'modules', '**', '*.enum.ts'),
    path.join(datasourceConfig.baseModelPath, '**', '*.model.ts'),
    path.join(__dirname, '..', 'modules', '**', '*.model.ts'),
  ],
  dialect: 'postgresql',
  dbCredentials: { url },
  casing: 'snake_case',
});
