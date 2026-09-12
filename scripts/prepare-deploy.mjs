import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','app.js','menu.js','media.js','favicon.svg','menu-oficial.pdf','ASSET-NOTICE.md','assets','_headers']) {
  if(!existsSync(file))throw new Error(`Missing public asset: ${file}`);
  await cp(file,`dist/${file}`,{recursive:true});
}
await writeFile('dist/404.html','<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Tinglao · Página no encontrada</title><link rel="stylesheet" href="/styles.css"><main style="max-width:600px;margin:15vh auto;padding:30px"><span class="eyebrow">TINGLAO GASTRO PUB</span><h1 style="font-size:64px;line-height:1">Por aquí no era.</h1><p>Esta página no está en nuestra carta.</p><a class="btn btn-dark" href="/">Volver a Tinglao</a></main></html>');
await writeFile('dist/robots.txt','User-agent: *\nDisallow: /\n');
console.log('Static public assets prepared in dist/.');
