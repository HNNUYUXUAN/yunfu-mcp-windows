import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const cwd = resolve(fileURLToPath(new URL('..', import.meta.url)));
const helper = fileURLToPath(new URL('../.codex/cloudbat-headers.mjs', import.meta.url));
const probe = spawnSync(process.execPath, [helper], { stdio: ['ignore', 'ignore', 'inherit'] });
if (probe.status !== 0) process.exit(1);

const env = { ...process.env };
delete env.YUNFU_MCP_TOKEN;
delete env.SAAS_API_KEY;
const args = ['app-server', '--stdio'];
if (process.argv.includes('--trust-workspace')) {
  args.push('-c', 'projects={' + JSON.stringify(cwd) + '={trust_level="trusted"}}');
}
const child = spawn('codex.exe', args, {
  cwd, env, stdio: ['pipe', 'pipe', 'ignore'], windowsHide: true,
});
const pending = new Map();
let sequence = 0;
let phase = 'app-server';
function send(message) {
  child.stdin.write(JSON.stringify(message) + '\n');
}
function request(method, params) {
  phase = method;
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    send({ id, method, params });
  });
}

const lines = createInterface({ input: child.stdout });
lines.on('line', line => {
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    rejectPending(new Error('Codex app-server returned an invalid message.'));
    return;
  }
  const receiver = pending.get(message.id);
  if (!receiver) return;
  pending.delete(message.id);
  if (message.error) receiver.reject(new Error('Codex RPC error ' + Number(message.error.code)));
  else receiver.resolve(message.result);
});
function rejectPending(error) {
  for (const receiver of pending.values()) receiver.reject(error);
}
child.once('error', () => rejectPending(new Error('Check codex.exe is installed and on PATH.')));
child.once('exit', () => rejectPending(new Error('Codex app-server exited.')));
child.stdin.on('error', () => rejectPending(new Error('Codex app-server closed its input.')));
const deadline = setTimeout(() => {
  rejectPending(new Error('Timed out waiting for Codex.'));
  child.kill();
}, 40_000);

try {
  await request('initialize', { clientInfo: { name: 'yunfu_mcp_windows_verify', version: '1.0.0' } });
  send({ method: 'initialized' });
  const { config } = await request('config/read', { cwd, includeLayers: false });
  const saas = config.mcp_servers?.saas;
  if (saas?.url !== 'https://ai.telrobot.top/cli/mcp' || !saas.http_headers_helper ||
      saas.bearer_token_env_var || saas.env_http_headers || saas.http_headers) {
    throw new Error('Check the workspace configuration and project trust for the saas server.');
  }
  const isolated = Object.fromEntries(Object.keys(config.mcp_servers)
    .filter(name => name !== 'saas')
    .map(name => [`mcp_servers.${name}.enabled`, false]));
  const { thread } = await request('thread/start', { cwd, ephemeral: true, config: isolated });
  const status = await request('mcpServerStatus/list', {
    threadId: thread.id, serverName: 'saas', detail: 'toolsAndAuthOnly',
  });
  const server = status.data?.find(item => item.name === 'saas');
  const count = Object.keys(server?.tools ?? {}).length;
  if (!server?.serverCapabilities || server.toolsError || !count) {
    throw new Error('Handshake or tool discovery failed. See the troubleshooting guide.');
  }
  console.log('saas: initialized, ' + count + ' tools discovered.');
} catch (error) {
  console.error('Verification failed at ' + phase + '. ' + error.message);
  process.exitCode = 1;
} finally {
  clearTimeout(deadline);
  lines.close();
  child.stdin.end();
  child.kill();
}
