import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

let env;
try {
  env = parseEnv(readFileSync(new URL('../.env', import.meta.url), 'utf8'));
} catch {
  console.error('Cloudbat MCP: could not read the workspace .env file.');
  process.exit(1);
}

const key = env.YUNFU_MCP_TOKEN?.trim();
if (!key || /[^\x21-\x7E]/.test(key)) {
  console.error('Cloudbat MCP: set YUNFU_MCP_TOKEN to the API key in the workspace .env file.');
  process.exit(1);
}

process.stdout.write(JSON.stringify({ Authorization: `Bearer ${key}` }));
