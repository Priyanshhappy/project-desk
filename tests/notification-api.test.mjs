import {strict as assert} from 'node:assert';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
async function compile(path,remove){let source=await readFile(path,'utf8');source=source.replace(remove,'');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));}
const route=await compile('app/api/cron/notifications/route.ts',/^import .*;\n/);
delete process.env.CRON_SECRET;
assert.equal((await route.GET(new Request('https://example.com/api/cron/notifications'))).status,401);
process.env.CRON_SECRET='test-secret';
assert.equal((await route.GET(new Request('https://example.com/api/cron/notifications',{headers:{authorization:'Bearer wrong'}}))).status,401);
const server=await compile('lib/notification-server.ts',/^import .*;\n/gm);
process.env.RESEND_API_KEY='test-key';process.env.RESEND_FROM_EMAIL='test@example.com';process.env.APP_URL='https://example.com';
let calls=0;const requests=[];const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,init)=>{calls++;requests.push(init);return new Response(JSON.stringify(calls===1?{message:'temporary'}:{id:'email-test'}),{status:calls===1?503:200,headers:{'Content-Type':'application/json'}})};
assert.equal(await server.sendEmail('recipient@example.com','<test>',['<unsafe>'],'stable-key',42),'email-test');
assert.equal(calls,2);assert.equal(requests[0].headers['Idempotency-Key'],requests[1].headers['Idempotency-Key']);
const body=JSON.parse(requests[1].body);assert.ok(body.html.includes('&lt;unsafe&gt;'));assert.ok(body.html.includes('record=42'));assert.ok(!body.html.includes('<unsafe>'));
globalThis.fetch=originalFetch;
console.log('Cron rejects missing/wrong auth; email retries with stable key, escapes HTML and links the record.');
