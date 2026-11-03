import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
const root = new URL('../', import.meta.url).pathname
function files(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : /\.tsx?$/.test(entry.name) ? [join(dir, entry.name)] : []) }
test('shared does not import app, pages or modules', () => {
 for (const path of files(join(root, 'src/shared'))) assert.doesNotMatch(readFileSync(path,'utf8'), /(?:from|import)\s*['"](?:@\/(?:app|pages|modules)|@(?:app|pages|modules))\b/, path)
})
test('no Redux or unmanaged direct native transports remain', () => {
 for (const path of files(join(root, 'src'))) {
   assert.doesNotMatch(readFileSync(path,'utf8'), /from ['"](?:@reduxjs|react-redux|redux)/, path)
   if(!path.includes('/native/')) assert.doesNotMatch(readFileSync(path,'utf8'), /window\.(?:MBankBridge|flutter_inappwebview)/, path)
 }
})
