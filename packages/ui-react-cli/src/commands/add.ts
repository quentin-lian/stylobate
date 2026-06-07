import { join } from 'node:path';
import chalk from 'chalk';

import { installDeps } from '../utils/deps.js';
import { copyFile, fileExists } from '../utils/files.js';
import { getComponent, getSourceDir, listComponents } from '../utils/registry.js';

interface AddOptions {
  cwd: string;
  overwrite: boolean;
}

export async function add(componentName: string, options: AddOptions): Promise<void> {
  const cwd = options.cwd;
  const sourceDir = getSourceDir();

  const component = getComponent(componentName);
  if (!component) {
    const available = listComponents();
    console.error(chalk.red(`Component "${componentName}" not found.`));
    console.error(chalk.dim(`Available: ${available.join(', ')}`));
    process.exit(1);
  }

  const cnPath = join(cwd, 'src/lib/cn.ts');
  if (!fileExists(cnPath)) {
    console.error(chalk.red('Project not initialized. Run `stylobate-ui init` first.'));
    process.exit(1);
  }

  console.log(chalk.bold(`\nAdding ${componentName}...\n`));

  for (const file of component.files) {
    const src = join(sourceDir, file);
    const dest = join(cwd, 'src/components/ui', file);
    if (copyFile(src, dest, options.overwrite)) {
      console.log(chalk.green('  Created'), `src/components/ui/${file}`);
    } else {
      console.log(chalk.yellow('  Skipped'), `src/components/ui/${file} (use --overwrite)`);
    }
  }

  if (component.dependencies.length > 0) {
    console.log(chalk.bold('\nInstalling dependencies...\n'));
    installDeps(component.dependencies, cwd);
  }

  console.log(chalk.bold('\nDone!'));
  console.log(
    chalk.dim(`\nUsage:\n`),
    chalk.cyan(`  import { Button } from './components/ui/button';\n`),
  );
}
