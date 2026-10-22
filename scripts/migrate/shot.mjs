import {chromium} from 'playwright-core';
import fs from 'fs';
const [,,url,out,theme='dark',width='1440',height='900',keyName='auxilia-theme-v2']=process.argv;
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
const ctx=await b.newContext({viewport:{width:+width,height:+height},deviceScaleFactor:1,reducedMotion:process.env.REDUCE?'reduce':'no-preference'});
await ctx.addInitScript(([k,t])=>{try{localStorage.setItem(k,t)}catch(e){}},[keyName,theme]);
const p=await ctx.newPage();
p.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url().slice(0,120));});
p.on('pageerror',e=>console.log('PAGEERROR',e.message.slice(0,200)));
p.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,200));});
await p.goto(url,{waitUntil:'networkidle',timeout:60000}).catch(e=>console.log('goto',e.message.slice(0,100)));
await p.waitForTimeout(4200);
// scroll through to trigger observers
const h=await p.evaluate(()=>document.documentElement.scrollHeight);
for(let y=0;y<h;y+=500){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(120);}
await p.waitForTimeout(1800);
await p.evaluate(()=>window.scrollTo(0,0));
await p.waitForTimeout(1200);
await p.screenshot({path:out,fullPage:true});
console.log('shot',out,h);
await b.close();
