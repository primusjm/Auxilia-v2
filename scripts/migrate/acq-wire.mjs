import fs from 'fs';
import * as yaml from 'js-yaml';
const S='/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/';
const A=JSON.parse(fs.readFileSync(S+'acq-arrays.json','utf8'));
const T=JSON.parse(fs.readFileSync(S+'acq-static.json','utf8'));
const R='/home/user/Auxilia-v2/';
// ---- content ----
const content={
  hero:{kicker:T.heroData.kicker,title:T.heroData.titleA,titleEmphasis:T.heroData.titleB,lead:T.heroData.lead},
  heroChips:{left:A.hcL.map(c=>({label:c[0],value:c[1],left:c[2],top:c[3]})),right:A.hcR.map(c=>({label:c[0],value:c[1],left:c[2],top:c[3]}))},
  highlights:T.hl,
  features:{title:T.featHead.title,titleEmphasis:T.featHead.titleB,intro:T.featHead.intro,items:A.feats.map(f=>({title:f[0],body:f[1],image:f[2],chipLabel:f[3],chipValue:f[4],caption:f[5]}))},
  trip:{steps:T.steps},
  privacy:{tiles:T.tiles},
  support:A.sup.map(c=>({label:c[0],blurb:c[2],shot:c[3],items:c[1].map(x=>({q:x[0],a:x[1]}))})),
  reviews:A.tms,
  quotes:A.quotes,
  feedbackTopics:A.fb.map(t=>({label:t[0],icon:t[1]})),
  menu:A.menu.map(n=>({label:n[0],sub:n[1],href:n[2],icon:n[3].filter(Boolean)})),
};
fs.mkdirSync(R+'src/content/acquisti',{recursive:true});
fs.writeFileSync(R+'src/content/acquisti/landing.yaml',yaml.dump(content,{lineWidth:-1,quotingType:'"'}));
console.log('yaml written');
// ---- patch class ----
const cp=R+'src/components/acquisti/AcquistiLanding.tsx';
let c=fs.readFileSync(cp,'utf8');
function replaceField(re,repl){ const m=re.exec(c); if(!m) throw new Error('class field not found '+re); c=c.slice(0,m.index)+repl+c.slice(m.index+m[0].length); }
function cutBracketed(startRe,replacement){ // replace from startRe through matching ] and trailing ;
  const m=startRe.exec(c); if(!m) throw new Error('nf '+startRe);
  let i=c.indexOf('[',m.index+m[0].length-1);let d=0,q=null;
  for(;i<c.length;i++){const ch=c[i];
    if(q){if(ch==='\\'){i++;continue;}if(ch===q)q=null;continue;}
    if(ch==="'"||ch==='"'||ch==='`'){q=ch;continue;}
    if(ch==='[')d++;else if(ch===']'){d--;if(d===0)break;}
  }
  let end=i+1; if(c[end]===';')end++;
  c=c.slice(0,m.index)+replacement+c.slice(end);
}
cutBracketed(/  _sup = \[/,"  _sup = this.props.data.support.map((c) => [c.label, c.items.map((i) => [i.q, i.a]), c.blurb, c.shot]);");
cutBracketed(/  _tms = \[/,"  _tms = this.props.data.reviews;");
cutBracketed(/  _hcL = \[/,"  _hcL = this.props.data.heroChips.left.map((c) => [c.label, c.value, c.left, c.top]);");
cutBracketed(/  _hcR = \[/,"  _hcR = this.props.data.heroChips.right.map((c) => [c.label, c.value, c.left, c.top]);");
cutBracketed(/  _fb = \[/,"  _fb = this.props.data.feedbackTopics.map((t) => [t.label, t.icon]);");
cutBracketed(/  _quotes = \[/,"  _quotes = this.props.data.quotes;");
cutBracketed(/    const feats = \[/,"    const feats = this.props.data.features.items.map((f) => [f.title, f.body, f.image, f.chipLabel, f.chipValue, f.caption]);");
cutBracketed(/      mNav: \[/,"      mNav: this.props.data.menu.map((n, i) => ({ no: '0' + (i + 1), label: n.label, sub: n.sub, href: n.href, d1: n.icon[0], d2: n.icon[1], d3: n.icon[2] })),");
// extra values for the template
c=c.replace("      ...this._menuVals(),\n      theme, features, chips,","      ...this._menuVals(),\n      hero: this.props.data.hero, highlights: this.props.data.highlights, featuresHead: this.props.data.features, trip: this.props.data.trip, privacyTiles: this.props.data.privacy.tiles,\n      theme, features, chips,");
if(!c.includes('privacyTiles'))throw new Error('renderVals patch failed');
fs.writeFileSync(cp,c);
// ---- patch template ----
const tp=R+'src/components/acquisti/landing.template.tsx';
let t=fs.readFileSync(tp,'utf8');
const need=(s)=>{if(!t.includes(s))throw new Error('template string not found: '+s.slice(0,80));};
// destructuring
t=t.replace("const { rootRef,","const { hero, highlights, featuresHead, trip, privacyTiles, rootRef,");
// hero
need('>Shopping list with a running total</span>');
t=t.replace('>Shopping list with a running total</span>','>{hero.kicker}</span>');
t=t.replace(/Plan the list\. <span style="font-weight:500;color:var\(--brand-text\);">Know the total\.<\/span>/,'{hero.title} <span style="font-weight:500;color:var(--brand-text);">{hero.titleEmphasis}</span>');
need("Tick items off in the shop and see what you'll spend before the till.");
t=t.replace("Tick items off in the shop and see what you'll spend before the till.","{hero.lead}");
// features heading
t=t.replace(/A list that knows <span style="font-weight:500;color:var\(--brand-text\);">what it costs<\/span>/,'{featuresHead.title} <span style="font-weight:500;color:var(--brand-text);">{featuresHead.titleEmphasis}</span>');
t=t.replace("Most lists remember what you need. Acquisti also remembers what it costs, and where.","{featuresHead.intro}");
// highlights: two rows of static spans
{
  const rowRe=/<div style="display:flex;align-items:center;white-space:nowrap;font-family:'Outfit',sans-serif;font-weight:500;font-size:clamp\(11\.5px,1\.3vw,13px\);letter-spacing:\.15em;text-transform:uppercase;color:#FFFFFF;">.*?<\/div>/gs;
  const rows=[...t.matchAll(rowRe)];
  if(rows.length!==2)throw new Error('highlight rows '+rows.length);
  const mk=(aria)=>`<div${aria?' aria-hidden="true"':''} style="display:flex;align-items:center;white-space:nowrap;font-family:'Outfit',sans-serif;font-weight:500;font-size:clamp(11.5px,1.3vw,13px);letter-spacing:.15em;text-transform:uppercase;color:#FFFFFF;">{(highlights||[]).map((w: string) => (<Fragment key={w}><span style="padding:0 24px;">{w}</span><I k="ic0df2f2" viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true" style="color:#C9C5F7;flex:none;align-self:center;" /></Fragment>))}</div>`;
  // keep original attributes of the second row (aria-hidden?) by inspecting
  const second=rows[1][0];
  const secondAria=/^<div aria-hidden="true"/.test(second);
  t=t.replace(rows[0][0],mk(false)).replace(rows[1][0],mk(secondAria));
}
// trip cards
{
  const re=/<div data-reveal="1" style="display:flex;flex-direction:column;gap:18px;transition-delay:/g;
  const idx=[...t.matchAll(re)].map(m=>m.index);
  if(idx.length!==12)throw new Error('trip cards '+idx.length);
  const endMarker='</div><div data-reveal="1" data-ready="1"';
  const end=t.indexOf(endMarker,idx[11]);
  const first=t.slice(idx[0],idx[1]);
  let card=first
    .replace('transition-delay:0s;"','transition-delay:${s.delay};"')
    .replace('<div data-reveal="1" style="display:flex','<div data-reveal="1" style={`display:flex')
    .replace(/(transition-delay:\$\{s\.delay\};)"/,'$1`}');
  // simplest robust approach: rebuild style attribute as template literal
  card=first.replace(/<div data-reveal="1" style="display:flex;flex-direction:column;gap:18px;transition-delay:0s;">/,'<div data-reveal="1" style={`display:flex;flex-direction:column;gap:18px;transition-delay:${s.delay};`}>');
  card=card.replace('>01</span>','>{s.no}</span>').replace('>Starting out</span>','>{s.stage}</span>');
  card=card.replace('src="/acquisti/assets/acquisti/trip-01-list-templates-light.webp" alt="List templates"','src={`/acquisti/assets/acquisti/${s.image}-light.webp`} alt={s.alt}').replace('src="/acquisti/assets/acquisti/trip-01-list-templates-dark.webp" alt="List templates"','src={`/acquisti/assets/acquisti/${s.image}-dark.webp`} alt={s.alt}');
  card=card.replace('style="--d:0s;flex:none','style={`--d:${s.drawDelay};flex:none').replace(/(background:var\(--wash\);color:var\(--brand-text\);)"><I k="icb1c258"/,'$1`}><I k={s.icon}');
  card=card.replace('<I k="icb1c258"','<I k={s.icon}').replace('</span>List templates</span>','</span>{s.title}</span>');
  card=card.replace('>Save a list you buy often, or start from a pack.</span>','>{s.capA}</span>').replace('<I k="ice46ef5"','<I k={s.capBIcon}').replace('<span>Or tap Weekly basics and the list fills itself.</span>','<span>{s.capB}</span>');
  for(const bad of ['List templates','Starting out','icb1c258']) if(card.includes(bad)) throw new Error('trip card still has '+bad);
  t=t.slice(0,idx[0])+'{(trip.steps||[]).map((s: any) => ('+card+'))}'+t.slice(end);
}
fs.writeFileSync(tp,t);
console.log('patched');
