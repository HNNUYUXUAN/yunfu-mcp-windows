import { copyFileSync, constants, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const helper = fileURLToPath(new URL('../.codex/cloudbat-headers.mjs', import.meta.url));
const config = new URL('../.codex/config.toml', import.meta.url);
const command = 'node "' + helper.replaceAll('\\', '/') + '"';
const content = [
  '[mcp_servers.saas]',
  'url = "https://ai.telrobot.top/cli/mcp"',
  'http_headers_helper = ' + JSON.stringify(command),
  '',
].join('\n');

if (process.argv[2] === '--print-config') {
  process.stdout.write(content);
} else {
  try {
    try {
      writeFileSync(config, content, { flag: 'wx' });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (readFileSync(config, 'utf8').replaceAll('\r\n', '\n') !== content) {
        throw new Error('Existing .codex/config.toml differs. Run setup with --print-config and merge the saas entry.');
      }
    }
    try {
      copyFileSync(new URL('../.env.example', import.meta.url), new URL('../.env', import.meta.url), constants.COPYFILE_EXCL);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    console.log('Workspace configured. Set YUNFU_MCP_TOKEN in .env and open a new Codex project chat.');
  } catch (error) {
    console.error(error.code ? 'Setup failed (' + error.code + ').' : error.message);
    process.exitCode = 1;
  }
}
