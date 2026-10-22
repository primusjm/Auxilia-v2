import * as cheerio from 'cheerio';import fs from 'fs';
import {readDc,clean,Collector} from './clean.mjs';
const f=process.argv[2];
const col=new Collector('ax');
const body=readDc(f);
const i=body.indexOf('<main id="top">'),j=body.indexOf('</main>')+7;
const $=cheerio.load(clean(body.slice(i,j),col),{xmlMode:false},false);
const label=e=>{const a=e.attribs||{};const k=Object.keys(a).filter(k=>k.startsWith('data-')||k==='role').join(',');const t=$(e).text().replace(/\s+/g,' ').trim().slice(0,70);return `${e.name}[${k}] "${t}"`;};
console.log('SECTIONS',$('main > section, main > div').toArray().map(e=>e.name+'#'+(e.attribs.id||'')).join(' '));
$('[role=tabpanel]').each((n,p)=>{
  console.log('== panel',p.attribs.id);
  $(p).children().each((k,c)=>{
    console.log('  ',k,label(c));
    if(k>=3){ $(c).children().each((m,cc)=>console.log('       -',m,label(cc))); }
  });
});
const th=$('#thread');console.log('== thread',label(th.get(0)));th.find('> div > *').each((k,c)=>console.log('   ',k,label(c)));
