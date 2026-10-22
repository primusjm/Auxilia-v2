import * as cheerio from 'cheerio';
import fs from 'fs';
const D='/home/user/Auxilia-v2/design/auxilia/';
export function body(f){const s=fs.readFileSync(D+f,'utf8');return s.slice(s.indexOf('</helmet>')+9,s.indexOf('</x-dc>'));}
export function skel(f){
  const $=cheerio.load('<root>'+body(f)+'</root>',{xmlMode:false},false);
  const main=$('main#top');
  let out=[];
  function walk(n,d){
    if(n.type==='text'){ if(n.data.trim()) out.push(' '.repeat(d)+'T'); return;}
    if(n.type!=='tag')return;
    const a=n.attribs||{};
    const keep=Object.keys(a).filter(k=>k.startsWith('data-')||k==='id'||k==='class'||k==='role').map(k=>k+(k==='id'?'='+a[k]:'')).join(' ');
    if(n.name==='svg'){out.push(' '.repeat(d)+'svg');return;}
    out.push(' '.repeat(d)+n.name+(keep?' ['+keep+']':''));
    (n.children||[]).forEach(c=>walk(c,d+1));
  }
  main.children().each((i,c)=>walk(c,0));
  return out.join('\n');
}
if(process.argv[1].endsWith('skel.mjs')){
 const f=process.argv[2];console.log(skel(f));
}
