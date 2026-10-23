import fs from 'fs';
import * as yaml from 'js-yaml';
import {D,readDc,slugMap} from './clean.mjs';
import {extractRecord} from './extract-all.mjs';
const OUT='/home/user/Auxilia-v2/src/content/case-study/';
fs.mkdirSync(OUT,{recursive:true});
const home=fs.readFileSync(D+'auxilia/Homepage.dc.html','utf8');
const spotSrc=/_spot = (\[[\s\S]*?\]);\n/.exec(home)[1];
const spot=JSON.parse(spotSrc);
const names=['GRiC','Promises','RLC','AHFIA','Imara','Inuka','KPFoundation','SFA','CoopFoundation','RSIF'];
const fix=s=>s; 
const warn=[];
function parseMenu(file){
  const s=fs.readFileSync(D+'auxilia/'+file,'utf8');
  const m=/mNav: (\[\[[\s\S]*?\]\]).map\(/.exec(s);
  const arr=new Function('return '+m[1])();
  return arr.map(n=>({label:n[0],sub:n[1],href:n[2],icon:n[3].filter(Boolean)}));
}
names.forEach((n,idx)=>{
  const file=`CS - ${n}.dc.html`;
  const {data}=extractRecord('auxilia/'+file);
  const sp=spot.find(p=>decodeURIComponent(p.href).includes(`CS - ${n}.dc.html`));
  if(!sp) throw new Error('no spot for '+n);
  if(sp.src!==data.hero.image && '/assets/'+sp.src.slice(9)!==data.hero.image) warn.push(n+': hero image differs from card image: '+data.hero.image+' vs '+sp.src);
  const menu=parseMenu(file);
  const raw=fs.readFileSync(D+'auxilia/'+file,'utf8');
  const subj=/name="_subject" value="([^"]*)"/.exec(raw)?.[1];
  if(subj!==`Book a call: ${sp.client}`) warn.push(n+': subject '+subj);
  const fm={
    title:sp.title, client:sp.client, sector:sp.sector, year:sp.year, stat:sp.stat, statLabel:sp.statLabel,
    kind:'record', order:idx+1, formSubject:subj, cardImage:'/assets/'+sp.src.slice(9),
    menu: menu.map(m=>({label:m.label,sub:m.sub,id:m.href.replace('#',''),icon:m.icon})),
    hero:{eyebrow:data.hero.eyebrow,title:data.hero.title,lead:data.hero.lead,facts:data.hero.facts},
    sections:data.order.filter(x=>x!=='next'),
  };
  for(const k of data.order){ if(k==='next')continue; const s={...data[k]}; delete s.__raw; fm[k]=s; }
  if(fm.screens){
    // merge plates + captions
    fm.screens.plates=fm.screens.plates.map((p,i)=>({src:p.src,alt:p.alt,caption:fm.screens.captions[i]}));
    delete fm.screens.captions;
  }
  fs.writeFileSync(OUT+slugMap[n]+'.md','---\n'+yaml.dump(fm,{lineWidth:-1,noRefs:true,quotingType:'"'})+'---\n');
  console.log('wrote',slugMap[n]);
});
console.log(warn.join('\n')||'no warnings');

// ---------------- appendix ----------------
import {extractAppendix} from './extract-appendix.mjs';
const featured={Britam:{client:'Britam',title:'Trusts, microinsurance & awards'},CoopBank:{client:'Co-op Bank',title:'Four product sites, one bank'},KenyaPower:{client:'Kenya Power',title:'Four sites, one utility'}};
['Britam','CoopBank','KenyaPower'].forEach((n,idx)=>{
  const {data}=extractAppendix(n);
  const raw=fs.readFileSync(D+`auxilia/CS - ${n}.dc.html`,'utf8');
  const subj=/name="_subject" value="([^"]*)"/.exec(raw)?.[1];
  const fm={
    title:featured[n].title,client:featured[n].client,kind:'appendix',order:idx+1,cardImage:data.hero.image,formSubject:subj,
    menu:data.menu,hero:data.hero,tablistLabel:data.tablistLabel,projects:data.projects,thread:data.thread,
  };
  fs.writeFileSync(OUT+slugMap[n]+'.md','---\n'+yaml.dump(fm,{lineWidth:-1,noRefs:true,quotingType:'"'})+'---\n');
  console.log('wrote',slugMap[n]);
});
