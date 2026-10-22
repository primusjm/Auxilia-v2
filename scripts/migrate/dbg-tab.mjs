import {chromium} from 'playwright-core';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
for(const [name,url] of [['orig','http://localhost:8801/auxilia/CS%20-%20Britam.dc.html'],['new','http://localhost:4321/work/britam']]){
const ctx=await b.newContext({viewport:{width:390,height:800},reducedMotion:'reduce'});
const p=await ctx.newPage();await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const t=document.querySelectorAll('[role=tab]')[1];const lab=t.firstElementChild;const cs=getComputedStyle(lab);const g=document.querySelector('[data-tabgrid]');const gs=getComputedStyle(g);
return {labW:lab.getBoundingClientRect().width,ws:cs.whiteSpace,disp:cs.display,fs:cs.fontSize,tabW:t.getBoundingClientRect().width,cols:gs.gridTemplateColumns,cellPad:getComputedStyle(g.children[1]).paddingLeft+'/'+getComputedStyle(g.children[1]).paddingRight,html:lab.outerHTML.slice(0,300),textNodes:[...lab.childNodes].map(n=>n.nodeType+':'+(n.textContent||'').slice(0,30))}});
console.log(name,JSON.stringify(r));await ctx.close();}
await b.close();
