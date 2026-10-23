import {chromium} from 'playwright-core';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:1280,height:800}});
const p=await ctx.newPage();
const errs=[];p.on('pageerror',e=>errs.push('PAGEERROR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text())});
let posted=null;
await p.route('https://formspree.io/**',r=>{posted=r.request().postData()?.slice(0,200);r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
await p.goto('http://localhost:4321/',{waitUntil:'networkidle'});
await p.waitForTimeout(3500);
ok('theme attr set',['light','dark'].includes(await p.getAttribute('html','data-theme')));
// menu
await p.click('[data-menu-toggle]');await p.waitForTimeout(900);
ok('menu opens',await p.evaluate(()=>document.documentElement.classList.contains('menu-open')));
ok('menu aria-expanded',(await p.getAttribute('[data-menu-toggle]','aria-expanded'))==='true');
await p.keyboard.press('Escape');await p.waitForTimeout(300);
ok('menu closes on Escape',!(await p.evaluate(()=>document.documentElement.classList.contains('menu-open'))));
// contact modal
await p.click('[data-book]');await p.waitForTimeout(900);
ok('contact opens',await p.evaluate(()=>document.documentElement.classList.contains('ct-open')));
// country picker
await p.click('[data-cc-btn]');await p.waitForTimeout(300);
ok('picker opens with list',(await p.locator('[data-cc-list] > span').count())>200);
await p.fill('[data-cc-search]','uganda');await p.waitForTimeout(150);
ok('picker filters',(await p.locator('[data-cc-list] > span').count())===1);
await p.keyboard.press('Enter');await p.waitForTimeout(200);
ok('picker selects UG',(await p.inputValue('[data-cc-value]'))==='UG +256');
await p.fill('[name=first_name]','A');await p.fill('[name=email]','a@b.co');await p.fill('input[name=phone]','712345678');await p.fill('[name=message]','Hi');
await p.click('[data-ct-submit]');await p.waitForTimeout(1200);
ok('form posted to formspree',!!posted&&posted.includes('first_name'));
ok('sent state shown',await p.locator('[data-ct-sent]').isVisible());
await p.keyboard.press('Escape');await p.waitForTimeout(900);
ok('contact closes',!(await p.evaluate(()=>document.documentElement.classList.contains('ct-open'))));
// theme toggle
const before=await p.getAttribute('html','data-theme');
await p.evaluate(()=>document.querySelector('[data-ft-light]').scrollIntoView());
await p.click(before==='dark'?'[data-ft-light]':'[data-ft-dark]');
ok('theme toggles',(await p.getAttribute('html','data-theme'))!==before);
ok('theme persisted',(await p.evaluate(()=>localStorage.getItem('auxilia-theme-v2')))===(await p.getAttribute('html','data-theme')));
// quotes
const q0=await p.locator('.ax-q.is-on').count();
await p.click('[data-q-dot="2"]');await p.waitForTimeout(300);
ok('quote dot switches',(await p.locator('.ax-q').nth(2).getAttribute('class')).includes('is-on'));
// hero slideshow & spot
await p.evaluate(()=>window.scrollTo(0,0));
await p.click('[data-hseg="2"]');await p.waitForTimeout(200);
ok('hero seg click',(await p.textContent('[data-h-label]')).includes('Inuka'));
await p.click('[data-spot-row="3"]');await p.waitForTimeout(200);
ok('spot row click',(await p.textContent('[data-s-meta]')).includes('AHFIA'));
// case study lightbox
await p.goto('http://localhost:4321/case-study/gric',{waitUntil:'networkidle'});await p.waitForTimeout(3500);
await p.evaluate(()=>document.querySelector('[data-lb="0"]').scrollIntoView());
await p.click('[data-lb="0"]');await p.waitForTimeout(400);
ok('lightbox opens',await p.locator('[data-lb-root]').isVisible());
await p.keyboard.press('ArrowRight');await p.waitForTimeout(200);
ok('lightbox next',(await p.textContent('[data-lb-count]')).startsWith('02'));
await p.keyboard.press('Escape');await p.waitForTimeout(200);
ok('lightbox closes',!(await p.locator('[data-lb-root]').isVisible()));
console.log(errs.length?errs.join('\n'):'no console errors');
await b.close();
