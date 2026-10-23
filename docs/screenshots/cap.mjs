import { chromium } from 'playwright-core';
const b = await chromium.launch({executablePath: process.env.HOME+'/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
async function shot(url, name, w, h, mobile){
  const c = await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:mobile,hasTouch:mobile,colorScheme:'light'});
  const p = await c.newPage();
  await p.goto(url,{waitUntil:'networkidle'});
  await p.waitForTimeout(1500);
  await p.screenshot({path:`raw/${name}.png`});
  await c.close();
}
const base='https://risingleaderscenter.org';
await shot(base+'/','home',1440,900,false);
await shot(base+'/','home-tall',1440,1500,false);
await shot(base+'/our-impact/','impact',1440,900,false);
await shot(base+'/our-impact/','impact-tall',1440,1500,false);
await shot(base+'/programs/crli/','m1',375,812,true);
await shot(base+'/our-impact/','m2',375,812,true);
await shot(base+'/gallery/','m3',375,812,true);
await shot(base+'/contact/','m4',375,812,true);
await b.close();
