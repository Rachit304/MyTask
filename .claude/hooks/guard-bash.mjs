// PreToolUse guard for Bash. Exit code 2 blocks the call and shows stderr to Claude.
let input = '';
process.stdin.on('data', (c) => (input += c));
process.stdin.on('end', () => {
  let event;
  try {
    event = JSON.parse(input);
  } catch {
    process.exit(0);
  }
  const cmd = String(event.tool_input?.command ?? '');

  const rules = [
    [/\bprisma\s+migrate\s+reset\b|\bdb\s+push\b.*--force-reset/i, 'destructive Prisma database reset'],
    [/\brm\s+(-[a-z]*r[a-z]*f|-[a-z]*f[a-z]*r)\b|Remove-Item\b.*-Recurse/i, 'recursive delete'],
    [/\bgit\s+push\b/i, 'git push is a human action'],
    [/\bgit\s+reset\s+--hard\b|\bgit\s+clean\s+-[a-z]*f/i, 'destructive git operation'],
    [/\b(curl|wget|iwr|Invoke-WebRequest)\b.*\|\s*(sh|bash|iex|pwsh|powershell)\b/i, 'piping downloads into a shell'],
    [/\bnpm\s+publish\b/i, 'publishing packages'],
    // Reading secret or personal-data files through the shell.
    [/\b(cat|type|more|less|head|tail|grep|rg|sed|awk|Get-Content|gc|Select-String)\b[^|;&]*\.env(?!\.example)\b/i, 'reading .env through the shell'],
    [/\b(cat|type|Get-Content|sqlite3)\b[^|;&]*\.(db|sqlite3?)\b/i, 'reading the database file directly'],
    // Secrets passed on the command line end up in history and logs.
    [/sk-ant-[A-Za-z0-9_-]{10,}/, 'Anthropic API key in a command'],
  ];

  for (const [re, why] of rules) {
    if (re.test(cmd)) {
      console.error(`Blocked by project hook: ${why}.`);
      process.exit(2);
    }
  }
  process.exit(0);
});
