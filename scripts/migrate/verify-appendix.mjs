import * as cheerio from 'cheerio';import fs from 'fs';
import {normHtml,origMain,diff} from './verify.mjs';
for(const [n,s] of [['Britam','britam'],['CoopBank','coop-bank'],['KenyaPower','kenya-power']]){
  const orig=origMain(`auxilia/CS - ${n}.dc.html`);
  const built=fs.readFileSync(`/home/user/Auxilia-v2/dist/work/${s}.html`,'utf8');
  // compare each tabpanel, thread and hero separately
  const oa=cheerio.load(orig,{xmlMode:false},false), ba=cheerio.load(built,{xmlMode:false},false);
  const parts=[['hero','section[data-hero]'],['thread','#thread'],['next','#next'],['tabbar','#projects-top']];
  oa('[role=tabpanel]').each((i,e)=>parts.push(['panel '+e.attribs.id,'#'+e.attribs.id]));
  for(const [name,sel] of parts){
    const a=normHtml(orig,sel), b=normHtml(built,sel);
    const d=diff(a,b,3,12);
    console.log(`${n} ${name}: ${d.length?'\n  '+d.join('\n  ').slice(0,1500):'IDENTICAL ('+a.split('\n').length+')'}`);
  }
}
