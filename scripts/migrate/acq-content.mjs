import fs from 'fs';
import * as yaml from 'js-yaml';
import * as cheerio from 'cheerio';
import {readDc} from './clean.mjs';
const S='/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/';
const cls=fs.readFileSync(S+'aq-class-landing.js','utf8');
function grab(src,startRe){
  const m=startRe.exec(src);if(!m)throw new Error('no '+startRe);
  let i=src.indexOf('[',m.index+m[0].length-1);const start=i;let d=0,q=null;
  for(;i<src.length;i++){const c=src[i];
    if(q){if(c==='\\'){i++;continue;}if(c===q)q=null;continue;}
    if(c==="'"||c==='"'||c==='`'){q=c;continue;}
    if(c==='[')d++;else if(c===']'){d--;if(d===0)break;}
  }
  return new Function('return '+src.slice(start,i+1))();
}
const sup=grab(cls,/_sup = \[/);
const tms=grab(cls,/_tms = \[/);
const hcL=grab(cls,/_hcL = \[/);
const hcR=grab(cls,/_hcR = \[/);
const fb=grab(cls,/_fb = \[/);
const quotes=grab(cls,/_quotes = \[/);
const feats=grab(cls,/const feats = \[/);
const menu=grab(cls,/mNav: \[/);
console.log({sup:sup.length,tms:tms.length,hcL:hcL.length,hcR:hcR.length,fb:fb.length,quotes:quotes.length,feats:feats.length,menu:menu.length});
console.log('sup cats',sup.map(c=>[c[0],c[1].length,c[3]]));
console.log('sup[0] shape',JSON.stringify(sup[0]).slice(0,200));
fs.writeFileSync(S+'acq-arrays.json',JSON.stringify({sup,tms,hcL,hcR,fb,quotes,feats,menu},null,1));

// ---------- static parts from the template ----------
import crypto from 'crypto';
const hash=s=>crypto.createHash('sha1').update(s).digest('hex').slice(0,6);
const ikey=el=>{const inner=$(el).html().trim();const norm=cheerio.load('<svg>'+inner+'</svg>',{xmlMode:false},false)('svg').html().trim();return 'ic'+hash(norm);};
const $=cheerio.load('<root>'+readDc('acquisti/Acquisti.dc.html')+'</root>',{xmlMode:false},false);
const txt=el=>$(el).text().replace(/\s+/g,' ').trim();
const steps=$('#how [data-grid3] > div[data-reveal]').toArray().filter(e=>$(e).find('[data-tl]').length).map(c=>{
  const tl=$(c).find('[data-tl]');const spans=tl.children('span');
  const peek=$(c).find('[data-hpeek]');const img=peek.find('img[data-l]');
  const src=img.attr('src');const slug=/trip-(\d+-[a-z0-9-]+?)-light\.webp/.exec(src)[1];
  const body=$(c).children('div').last();
  const head=body.children('span').first();
  const caps=body.children('span').last();
  const capA=caps.find('[data-cap-a]');const capB=caps.find('[data-cap-b]');
  return {no:txt(spans.eq(1)),stage:txt(spans.eq(2)),title:txt(head),icon:ikey(head.find('[data-sico] svg')),image:'trip-'+slug,alt:img.attr('alt'),capA:txt(capA),capB:txt(capB.find('span').last()),capBIcon:ikey(capB.find('svg')),delay:/transition-delay:([^;"]+)/.exec($(c).attr('style'))[1],drawDelay:/--d:([^;"]+)/.exec(head.find('[data-sico]').attr('style'))?.[1]||'0s'};
});
console.log('steps',steps.length,JSON.stringify(steps[1]));
const tiles=$('#privacy [data-ptile]').toArray().map(t=>({no:txt($(t).children('span').last()),icon:ikey($(t).find('[data-pico] svg')),kind:$(t).find('[data-pico]').attr('data-pico'),title:txt($(t).find('h3')),text:txt($(t).find('p')),delay:/transition-delay:([^;"]+)/.exec($(t).attr('style'))[1]}));
console.log('tiles',JSON.stringify(tiles[0]));
const hl=$('section[aria-label="Highlights"] .ldr-marquee > div').first().children('span').toArray().map(e=>txt(e));
console.log('highlights',hl);
const hero=$('[data-hero-fit] section').first();
const heroData={kicker:txt(hero.children('span').first()),titleA:'',lead:txt(hero.children('p').first())};
const h1=hero.find('h1');heroData.titleA=h1.clone().children().remove().end().text().trim();heroData.titleB=txt(h1.children('span'));
console.log(heroData);
const feat=$('#features');
const featHead={title:feat.find('h2').first().clone().children().remove().end().text().trim(),titleB:txt(feat.find('h2 span').first()),intro:txt(feat.find('h2').first().next('p'))};
console.log(featHead);
fs.writeFileSync(S+'acq-static.json',JSON.stringify({steps,tiles,hl,heroData,featHead},null,1));
