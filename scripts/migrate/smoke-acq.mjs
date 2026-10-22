import {chromium} from 'playwright-core';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:1280,height:800}});
const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));p.on('console',m=>{if(['error','warning'].includes(m.type()))errs.push(m.type().toUpperCase()+' '+m.text().slice(0,200))});
let posted=null;
await p.route('https://formspree.io/**',r=>{posted=r.request().postData()?.slice(0,300);r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:4321/acquisti',{waitUntil:'networkidle'});
await p.waitForTimeout(3500);
ok('hydrated (menu button works)',await (async()=>{await p.click('header[data-hdr] button[aria-expanded]');await p.waitForTimeout(500);return (await p.getAttribute('header[data-hdr] button[aria-expanded]','aria-expanded'))==='true';})());
await p.keyboard.press('Escape');await p.waitForTimeout(300);
// logo tap switches theme
const t0=await p.getAttribute('html','data-theme');
await p.click('a[aria-label^="Acquisti: tap to switch"]');await p.waitForTimeout(200);
ok('logo tap switches theme',(await p.getAttribute('html','data-theme'))!==t0);
ok('theme stored under own key',!!(await p.evaluate(()=>localStorage.getItem('acquisti-theme-v1'))));
ok('does not touch auxilia key',(await p.evaluate(()=>localStorage.getItem('auxilia-theme-v2')))===null);
// features tour
await p.evaluate(()=>document.getElementById('features').scrollIntoView());await p.waitForTimeout(800);
const feat=p.locator('[data-flist] > div[role=button]');
ok('6 feature rows',(await feat.count())===6);
await feat.nth(3).click();await p.waitForTimeout(400);
ok('feature select',(await feat.nth(3).evaluate(e=>getComputedStyle(e).width))!==(await feat.nth(2).evaluate(e=>getComputedStyle(e).width)));
await p.click('[data-ftour]');await p.waitForTimeout(200);
ok('tour pause toggles',(await p.textContent('[data-ftour]')).includes('Play'));
// support
await p.evaluate(()=>document.getElementById('support').scrollIntoView());await p.waitForTimeout(600);
const tabs=p.locator('#support [role=tab]');
ok('support tabs',(await tabs.count())>=8);
await tabs.nth(2).click();await p.waitForTimeout(700);
ok('tab selected',(await tabs.nth(2).getAttribute('aria-selected'))==='true');
await p.fill('#support input[type=search]','icloud');await p.waitForTimeout(500);
ok('search shows answers label',/answer/.test(await p.locator('#support [aria-live=polite]').first().textContent()));
await p.fill('#support input[type=search]','');await p.waitForTimeout(400);
// faq accordion
const faq=p.locator('#support [role=button][aria-expanded]');
const n=await faq.count();
await faq.nth(1).click();await p.waitForTimeout(500);
ok('faq opens',(await faq.nth(1).getAttribute('aria-expanded'))==='true');
// contact
await p.evaluate(()=>document.getElementById('contact').scrollIntoView());await p.waitForTimeout(500);
await p.click('#contact a[data-ft-mail]');
await p.waitForTimeout(900);
ok('feedback dialog open',await p.locator('[role=dialog][aria-label="Send feedback"]').isVisible());
await p.fill('[role=dialog] [name=name]','A').catch(()=>{});
await p.fill('[role=dialog] [name=email]','a@b.co').catch(()=>{});
await p.fill('[role=dialog] input[name=phone]','712345678').catch(()=>{});
await p.fill('[role=dialog] [name=message]','Hello').catch(()=>{});
await p.click('[role=dialog] button[type=submit]');await p.waitForTimeout(1500);
ok('posted to formspree',!!posted);
console.log('posted:',posted&&posted.slice(0,150));
console.log(errs.length?errs.join('\n'):'no console errors');
await b.close();
