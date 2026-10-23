// Screenshots a study's three screens plates on the dev server at several widths, in light and
// dark, and runs axe at 375 and 1440. Usage: node check.mjs <slug> [port]. Writes check/*.png.
import { chromium } from 'playwright-core';
import fs from 'fs';
const [slug, port = '4321'] = process.argv.slice(2);
if (!slug) throw new Error('Usage: node check.mjs <slug> [port]');
const axe = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
fs.mkdirSync('check', { recursive: true });
const b = await chromium.launch({executablePath: process.env.HOME+'/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
for (const theme of ['light','dark']) for (const w of [375,560,768,1024,1440]) {
  // Reduced motion skips the page loader and the reveal animations, which otherwise hide the plates.
  const c = await b.newContext({viewport:{width:w,height:900},reducedMotion:'reduce'});
  await c.addInitScript(t=>localStorage.setItem('auxilia-theme-v2',t), theme);
  const p = await c.newPage();
  await p.goto(`http://localhost:${port}/case-study/${slug}`,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.querySelectorAll('#screens img').forEach(i=>i.loading='eager'));
  const plates = p.locator('#screens [data-plate]');
  for (let i = 0; i < await plates.count(); i++) {
    await plates.nth(i).scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
    await plates.nth(i).screenshot({path:`check/${slug}-${i}-${theme}-${w}.png`});
  }
  if (w===375||w===1440) {
    await p.addScriptTag({content:axe});
    const r = await p.evaluate(async()=>(await axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21aa','best-practice']})).violations.map(v=>`${v.id} (${v.nodes.length})`));
    console.log(theme, w, 'axe:', r.join(', ') || 'clean');
  }
  await c.close();
}
await b.close();
