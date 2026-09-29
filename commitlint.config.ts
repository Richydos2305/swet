import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-min-length': [2, 'always', 10],
    'header-max-length': [2, 'always', 180],
  },
};

export default config;
