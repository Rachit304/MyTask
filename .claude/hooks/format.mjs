// PostToolUse: format only the edited file with the project's local Prettier, if installed.
// Silent no-op until frontend/ or backend/ install Prettier, so it costs nothing in Phase 0.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let file = '';
  try {
    file = JSON.parse(input).tool_input?.file_path ?? '';
  } catch {
    process.exit(0);
  }
  if (!/\.(ts|html|scss|css|json|js|mjs)$/.test(file) || /(^|[\\/])(node_modules|dist|migrations)[\\/]/.test(file)) {
    process.exit(0);
  }
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const dir = ['frontend', 'backend'].find((d) => path.resolve(file).startsWith(path.resolve(root, d) + path.sep));
  if (!dir) process.exit(0);
  const bin = path.join(root, dir, 'node_modules', 'prettier', 'bin', 'prettier.cjs');
  if (!fs.existsSync(bin)) process.exit(0);
  spawnSync(process.execPath, [bin, '--write', file], { stdio: 'ignore' });
  process.exit(0);
});
