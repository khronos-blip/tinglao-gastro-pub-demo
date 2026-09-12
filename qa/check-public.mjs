import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const base=process.env.QA_URL||'https://tinglao.khronosonline.work/';
const output=process.env.QA_PUBLIC_REPORT||'/tmp/tinglao-public-assets.json';
const digest=b=>createHash('sha256').update(b).digest('hex');
const entries=['index.html','styles.css','app.js','menu.js','media.js','favicon.svg','menu-oficial.pdf'];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const name=`${dir}/${e.name}`;if(e.isDirectory())await walk(name);else if(/\.(webp|jpg|woff2)$/.test(name))entries.push(name);}}
await walk('assets');
const results=[];
const queue=[...entries];
await Promise.all(Array.from({length:6},async()=>{
 while(queue.length){const file=queue.shift();const local=await readFile(file);const response=await fetch(new URL(file,base));assert.equal(response.status,200,file);const remote=Buffer.from(await response.arrayBuffer());assert.equal(digest(remote),digest(local),`Asset mismatch: ${file}`);results.push({file,status:response.status,bytes:remote.length,sha256:digest(remote)});}
}));
const expected=digest(await readFile('index.html'));
for(const suffix of ['', '?utm_source=whatsapp&utm_campaign=tinglao', '?fbclid=demo-verification']){
 const response=await fetch(new URL(suffix,base),{redirect:'manual'});assert.equal(response.status,200,`Public entry ${suffix}`);assert.equal(digest(Buffer.from(await response.arrayBuffer())),expected,`Public HTML ${suffix}`);results.push({file:suffix||'/',status:response.status});
}
const missing=await fetch(new URL('pagina-inexistente-qa',base),{redirect:'manual'});assert.equal(missing.status,404,'Missing route returns 404');
const report={status:'pass',base,runAt:new Date().toISOString(),checks:results.length+1,results,notFoundStatus:missing.status};
await writeFile(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,url:base,checks:report.checks,report:output}));
