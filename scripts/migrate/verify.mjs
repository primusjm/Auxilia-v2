import * as cheerio from 'cheerio';
import fs from 'fs';
import {readDc,clean,Collector} from './clean.mjs';
const IGN=new Set(['data-slot','data-lb-plate','data-lb-cap','data-astro-source-file','data-astro-source-loc']);
function norm($,el,depth=0){
  if(el.type==='text'){const t=el.data.replace(/\s+/g,' ').trim();return t?[t]:[];}
  if(el.type!=='tag')return [];
  const a={...el.attribs};
  for(const k of Object.keys(a)) if(IGN.has(k)) delete a[k];
  if(a.style){a.style=a.style.split(';').map(x=>x.trim().replace(/\s*:\s*/,':')).filter(Boolean).join(';');}
  if(a.class){a.class=a.class.split(/\s+/).sort().join(' ');}
  const attrs=Object.keys(a).sort().map(k=>`${k}="${a[k]}"`).join(' ');
  const nm=(el.name==='strong'&&a.style==='font-weight:500;color:var(--ink)')?'span':el.name;
  const out=[`${'  '.repeat(depth)}<${nm}${attrs?' '+attrs:''}>`];
  (el.children||[]).forEach(c=>out.push(...norm($,c,depth+1)));
  return out;
}
export function normHtml(html,sel){
  const $=cheerio.load(html,{xmlMode:false},false);
  const root=sel?$(sel).first():$.root();
  return norm($,root.get(0)).map(l=>l.replace(/^\s*(?=[^<])/,m=>m)).join('\n');
}
export function origMain(rel){
  const col=new Collector('ax');
  const body=readDc(rel);
  const i=body.indexOf('<main id="top">'),j=body.indexOf('</main>')+7;
  return clean(body.slice(i,j),col);
}
export function diff(a,b,ctx=3,max=200){
  const A=a.split('\n'),B=b.split('\n');
  let out=[],n=0;
  let i=0,j=0;
  // simple lockstep diff with resync by looking ahead
  while(i<A.length&&j<B.length&&n<max){
    if(A[i]===B[j]){i++;j++;continue;}
    // try resync
    let found=false;
    for(let d=1;d<40&&!found;d++){
      if(A[i+d]===B[j]&&A[i+d+1]===B[j+1]){out.push(`- (orig only) ${A.slice(i,i+d).join(' | ').slice(0,400)}`);i+=d;found=true;}
      else if(A[i]===B[j+d]&&A[i+1]===B[j+d+1]){out.push(`+ (new only) ${B.slice(j,j+d).join(' | ').slice(0,400)}`);j+=d;found=true;}
    }
    if(!found){out.push(`~ orig: ${A[i].slice(0,500)}\n  new : ${B[j].slice(0,500)}`);i++;j++;}
    n++;
  }
  if(i<A.length&&n<max)out.push('- (orig tail) '+A.slice(i,i+3).join(' | ').slice(0,300));
  if(j<B.length&&n<max)out.push('+ (new tail) '+B.slice(j,j+3).join(' | ').slice(0,300));
  return out;
}
if(process.argv[1]?.endsWith('verify.mjs')){
  const [,,orig,built]=process.argv;
  const a=normHtml(origMain(orig),'main#top');
  const b=normHtml(fs.readFileSync(built,'utf8'),'main#top');
  const d=diff(a,b);
  console.log(d.length?d.join('\n'):'IDENTICAL ('+a.split('\n').length+' nodes)');
}
