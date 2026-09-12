import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),pw=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const engine=process.env.QA_BROWSER||'chromium';
const browser=await pw[engine].launch({headless:true,...(engine==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const base=process.env.QA_URL||'http://127.0.0.1:4188/',out=process.env.QA_OUTPUT||'qa/compact-navigation';
await mkdir(out,{recursive:true});
const page=await browser.newPage({viewport:{width:390,height:844}}),results=[],errors=[];
const check=(n,v)=>{assert.ok(v,n);results.push(n);};
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 check('Beverages is the single and final drinks category',await page.locator('[data-filter="cocteles"]').count()===0&&await page.locator('.chip').last().getAttribute('data-filter')==='bebidas');
 for(const width of [320,360,390,430,768]){
  await page.setViewportSize({width,height:844});await page.locator('[data-filter="tapas"]').click();
  const geometry=await page.evaluate(()=>({header:document.querySelector('.site-head').getBoundingClientRect().toJSON(),bar:document.querySelector('.category-wrap').getBoundingClientRect().toJSON(),width:document.documentElement.scrollWidth}));
  check(`Compact upper controls at ${width}`,geometry.header.top===0&&geometry.bar.bottom<=120&&geometry.width<=width);
  check(`No lower toolbar at ${width}`,await page.locator('.mobile-dock').count()===0);
  check(`Reservation and order are visible in the header at ${width}`,await page.locator('.reserve-head').isVisible()&&await page.locator('.cart-label').isVisible());
  check(`Header touch targets are at least 44px at ${width}`,await page.locator('.head-actions button').evaluateAll(nodes=>nodes.every(n=>{const r=n.getBoundingClientRect();return r.width>=44&&r.height>=44;})));
  await page.locator('#searchToggle').click();check(`Search takes one row at ${width}`,await page.locator('.categories').isHidden()&&await page.locator('#search').isVisible()&&await page.locator('.category-wrap').evaluate(n=>n.getBoundingClientRect().height<=56));
  check(`Search receives focus at ${width}`,await page.locator('#search').evaluate(n=>n===document.activeElement));
  await page.locator('#search').fill('mojito');check(`Search finds a cocktail at ${width}`,await page.locator('[data-add]').count()===1);
  if(width===390){await page.locator('#productGrid img').first().evaluate(el=>el.decode());await page.screenshot({path:`${out}/search-mobile.png`,animations:'disabled'});}
  await page.keyboard.press('Escape');check(`Escape restores filters at ${width}`,await page.locator('.categories').isVisible()&&await page.locator('#search').inputValue()===''&&await page.locator('#searchToggle').evaluate(n=>n===document.activeElement));
 }
 await page.setViewportSize({width:390,height:844});await page.locator('[data-filter="bebidas"]').click();
 check('Beverages contains the complete drinks menu',await page.locator('[data-add]').count()===60);
 check('All cocktail and sangria photos remain accessible',await page.locator('#productGrid [data-add]').count()===25);
 await page.waitForLoadState('networkidle');
 for(const img of (await page.locator('#productGrid img').all()).slice(0,4))await img.evaluate(el=>el.decode());
 await page.screenshot({path:`${out}/catalog-mobile.png`,animations:'disabled'});
 await page.locator('.reserve-head').click();check('Header reservation opens the demo',await page.locator('#reservationModal').isVisible());await page.keyboard.press('Escape');
 check('Closing reservation restores its header trigger',await page.locator('.reserve-head').evaluate(n=>n===document.activeElement));
 await page.locator('[data-add="mojito"]').click();await page.locator('.cart-btn').click();check('Header order opens the selected cocktail',await page.locator('.line-item').innerText().then(t=>t.includes('Mojito')));await page.keyboard.press('Escape');
 await page.setViewportSize({width:1440,height:1000});check('Desktop keeps its visible search field',await page.locator('#search').isVisible()&&await page.locator('#searchToggle').isHidden());
 check('No browser errors',errors.length===0);
 const report={status:'pass',engine,base,checks:results.length,results,errors};await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({status:'pass',engine,checks:results.length}));
}finally{await browser.close()}
