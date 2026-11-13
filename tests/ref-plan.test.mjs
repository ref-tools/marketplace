import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { register } from '../plugins/ref-plan/hooks/memory.js';

const root = new URL('../plugins/ref-plan/', import.meta.url);
const json = async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const manifest = await json('.claude-plugin/plugin.json');
const config = await json('hooks/memory.json');

function fixture(options = { automaticMemory: true }) {
  let handler;
  const calls = [];
  const logs = [];
  const native = { blocks: [{ name: 'memory', text: 'Native memory' }], instructionFiles: [] };
  const host = {
    plugin: { root: '/plugin' },
    fs: { read: async (path) => {
      assert.equal(path, '/plugin/hooks/memory.json');
      return JSON.stringify(config);
    } },
    mcp: {
      connect: async (server) => {
        assert.equal(server, config.server);
        return { isConnected: true, server: 'Ref_Plan' };
      },
      call: async (...args) => {
        calls.push(args);
        return { content: [{ type: 'text', text: 'Personal memory index' }] };
      },
    },
    ui: { log: (text) => logs.push(text) },
  };
  register((event, fn) => {
    assert.equal(event, 'prompt.context');
    handler = fn;
  }, options);
  return { host, calls, logs, native, handler, run: () => handler(host, {}, async () => native) };
}

test('ships an opt-in module wired to the declared OAuth server', async () => {
  const mcp = await json('.mcp.json');
  assert.deepEqual(mcp.mcpServers[config.server], {
    type: 'http', url: 'https://api.plan.ref.tools/mcp',
  });
  assert.deepEqual(await json('hooks/hooks.json'), { modules: ['./memory.js'] });
  assert.equal(manifest.userConfig.automaticMemory.default, false);
  assert.equal(manifest.userConfig.api_key, undefined);
  const generic = await json('plugin.json');
  assert.equal(generic.version, manifest.version);
  const genericMcp = await json('mcp.json');
  assert.deepEqual(genericMcp.mcpServers[config.server].extensions['com.openai'].auth, { type: 'oauth' });
});

test('default configuration and explicit opt-out register no memory hook', () => {
  const defaults = Object.fromEntries(Object.entries(manifest.userConfig).map(([key, value]) => [key, value.default]));
  assert.equal(fixture(defaults).handler, undefined);
  assert.equal(fixture({ automaticMemory: false }).handler, undefined);
});

test('uses the resolved connector alias and preserves native context', async () => {
  const f = fixture();
  const result = await f.run();
  assert.deepEqual(f.calls, [['Ref_Plan', 'Memory', { action: 'context', scope: 'user' }]]);
  assert.deepEqual(result.blocks, [...f.native.blocks, { name: 'refMemory', text: 'Personal memory index' }]);
  assert.equal(f.native.blocks.length, 1);
  assert.equal(result.instructionFiles, f.native.instructionFiles);
});

test('unavailable authentication preserves context without calling Memory', async () => {
  const f = fixture();
  f.host.mcp.connect = async () => ({ isConnected: false, reason: 'auth' });
  assert.equal(await f.run(), f.native);
  assert.equal(f.calls.length, 0);
  assert.equal(f.logs.length, 1);
});

test('tool failures and empty results preserve context', async () => {
  for (const result of [{ isError: true, content: [] }, { content: [] }]) {
    const f = fixture();
    f.host.mcp.call = async () => result;
    assert.equal(await f.run(), f.native);
    assert.equal(f.logs.length, 1);
  }
});

test('connection exceptions do not expose private error details', async () => {
  const f = fixture();
  f.host.mcp.connect = async () => { throw new Error('private credential'); };
  assert.equal(await f.run(), f.native);
  assert.equal(f.logs.length, 1);
  assert.ok(!f.logs[0].includes('private credential'));
});

test('reports a missing connection once while every prompt keeps native context', async () => {
  const f = fixture();
  f.host.mcp.connect = async () => ({ isConnected: false, reason: 'unlisted' });
  for (let i = 0; i < 3; i++) assert.equal(await f.run(), f.native);
  assert.equal(f.calls.length, 0);
  assert.equal(f.logs.length, 1);
});

test('ships the connection setup skill for the declared server', async () => {
  const skill = await readFile(new URL('skills/ref-plans-setup/SKILL.md', root), 'utf8');
  assert.match(skill, /^---\nname: ref-plans-setup\n/);
  const mcp = await json('.mcp.json');
  assert.ok(skill.includes(mcp.mcpServers[config.server].url));
});

test('ships the memory import skill', async () => {
  const skill = await readFile(new URL('skills/ref-import-memory/SKILL.md', root), 'utf8');
  assert.match(skill, /^---\nname: ref-import-memory\n/);
});
