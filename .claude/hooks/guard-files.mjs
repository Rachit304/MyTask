// PreToolUse guard for file tools. Exit code 2 blocks the call and shows stderr to Claude.
import fs from 'node:fs';

let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let event;
  try {
    event = JSON.parse(input);
  } catch {
    process.exit(0);
  }
  const tool = event.tool_name;
  const raw = event.tool_input?.file_path ?? '';
  const p = String(raw).replace(/\\/g, '/');
  if (!p) process.exit(0);

  const block = (why) => {
    console.error(`Blocked by project hook: ${why} (${p})`);
    process.exit(2);
  };

  // Secrets: .env and variants, except the committed template.
  if (/(^|\/)\.env(\.[^/]*)?$/.test(p) && !/\.env\.example$/.test(p)) {
    block('secret env files are off limits; edit .env.example instead');
  }
  // Local database files and backups hold personal data.
  if (/\.(db|sqlite|sqlite3)(-journal|-wal|-shm)?$/.test(p)) {
    block('database files contain personal data');
  }
  if (/(^|\/)backups?\//.test(p)) {
    block('backup files contain personal data');
  }
  // Applied Prisma migrations are immutable; only new files may be created.
  if (/(^|\/)prisma\/migrations\//.test(p) && tool !== 'Read' && fs.existsSync(raw)) {
    block('existing Prisma migrations must not be edited; create a new migration');
  }
  process.exit(0);
});
