import { chromium } from 'playwright-core';
const cwd = process.cwd();
// Transparent canvas: the frames float on the plate, so one image works in light and dark.
const bg = 'transparent';
const base = (w,h,inner)=>`<!doctype html><meta charset=utf-8><style>*{box-sizing:border-box;margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${bg};position:relative}
.win{position:absolute;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(12,10,40,.22),0 4px 14px rgba(12,10,40,.12),0 0 0 1px rgba(128,128,150,.35)}
.bar{height:44px;background:#ecebf5;display:flex;align-items:center;gap:9px;padding:0 18px}
.bar i{width:12px;height:12px;border-radius:50%;background:#c9c7da;display:block}
.win img{display:block;width:100%}
.ph{position:absolute;background:#0d0d12;border-radius:46px;padding:11px;box-shadow:0 22px 50px rgba(12,10,40,.24),0 4px 12px rgba(12,10,40,.12),0 0 0 1px rgba(128,128,150,.45)}
.ph img{display:block;width:100%;border-radius:36px}
</style>${inner}`;
const win=(src,w,top)=>`<div class=win style="width:${w}px;left:calc(50% - ${w/2}px);top:${top}px"><div class=bar><i></i><i></i><i></i></div><img src="file://${cwd}/raw/${src}.png"></div>`;
// Homepage: a big window rising from the bottom edge and cut off below it. The wide plate
// crops the sides as it narrows, so the window keeps about 12% clear each side, and
// home-sm is a squarer version for phone-width plates (the plate's srcSmall).
const bleed=(src,w,top,cw)=>`<div class=win style="width:${w}px;left:${(cw-w)/2}px;top:${top}px;border-bottom-left-radius:0;border-bottom-right-radius:0"><div class=bar><i></i><i></i><i></i></div><img src="file://${cwd}/raw/${src}.png"></div>`;
const jobs=[
 ['home',2400,976,base(2400,976,bleed('home-tall',1840,80,2400))],
 ['home-sm',1200,750,base(1200,750,bleed('home-tall',1000,125,1200))],
 // Half-width plate: the plate is anchored to the top, so a wide one-column plate only crops the cut-off bottom.
 ['impact',1600,865,base(1600,865,bleed('impact-tall',1260,70,1600))],
];
// mobile: four phones
const pw=300, gap=48, n=4, total=n*pw+(n-1)*gap, x0=(1600-total)/2;
const phones=['m1','m2','m3','m4'].map((m,i)=>`<div class=ph style="width:${pw}px;left:${x0+i*(pw+gap)}px;top:122px"><img src="file://${cwd}/raw/${m}.png"></div>`).join('');
jobs.push(['mobile',1600,865,base(1600,865,phones)]);
const b = await chromium.launch({executablePath: process.env.HOME+'/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
for (const [name,w,h,html] of jobs){
  const p = await b.newPage({viewport:{width:w,height:h}});
  await (await import('fs')).promises.writeFile(`out/${name}.html`,html);
  await p.goto(`file://${cwd}/out/${name}.html`);
  await p.waitForTimeout(400);
  await p.screenshot({path:`out/${name}.png`,omitBackground:true});
  await p.close();
}
await b.close();
