#!/usr/bin/env node
import { Command } from 'commander';

import { add } from './commands/add.js';
import { init } from './commands/init.js';

const program = new Command();

program
  .name('stylobate-ui')
  .description('CLI for @stylobate/ui-react — add components to your project')
  .version('0.0.0');

program
  .command('init')
  .description('Initialize your project with design tokens and utilities')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--cwd <path>', 'Target directory', process.cwd())
  .action(init);

program
  .command('add')
  .description('Add a component to your project')
  .argument('<component>', 'Component name (e.g. button)')
  .option('--cwd <path>', 'Target directory', process.cwd())
  .option('--overwrite', 'Overwrite existing files', false)
  .action(add);

program.parse();
