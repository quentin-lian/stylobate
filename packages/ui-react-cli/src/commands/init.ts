import { join } from 'node:path';
import chalk from 'chalk';

import { installDeps } from '../utils/deps.js';
import { copyFile, fileExists } from '../utils/files.js';
import { getSourceDir } from '../utils/registry.js';

interface InitOptions {
  yes?: boolean;
  cwd: string;
}

export async function init(options: InitOptions): Promise<void> {
  const cwd = options.cwd;
  const sourceDir = getSourceDir();

  console.log(chalk.bold('\nInitializing @stylobate/ui-react...\n'));

  const cnDest = join(cwd, 'src/lib/cn.ts');
  const cssDest = join(cwd, 'src/styles/globals.css');

  const cnSrc = join(sourceDir, 'lib/cn.ts');
  const cssSrc = join(sourceDir, 'styles/globals.css');

  if (copyFile(cnSrc, cnDest, false)) {
    console.log(chalk.green('  Created'), 'src/lib/cn.ts');
  } else if (fileExists(cnDest)) {
    console.log(chalk.yellow('  Skipped'), 'src/lib/cn.ts (already exists)');
  }

  if (copyFile(cssSrc, cssDest, false)) {
    console.log(chalk.green('  Created'), 'src/styles/globals.css');
  } else if (fileExists(cssDest)) {
    console.log(chalk.yellow('  Skipped'), 'src/styles/globals.css (already exists)');
  }

  console.log(chalk.bold('\nInstalling dependencies...\n'));
  installDeps(['clsx', 'tailwind-merge', 'tailwindcss'], cwd);

  console.log(chalk.bold('\nDone!'));
  console.log(
    chalk.dim('\nNext step: import globals.css in your root layout:\n'),
    chalk.cyan("  import '../styles/globals.css';\n"),
  );
}
