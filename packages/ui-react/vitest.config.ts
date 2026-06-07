import { defineConfig, mergeConfig } from 'vitest/config';

import reactConfig from '@stylobate/test-config/vitest-react';

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./src/setup-axe.ts'],
    },
  }),
);
