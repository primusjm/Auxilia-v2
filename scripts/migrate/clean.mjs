// Cleans design-tool markup: style-hover/focus -> classes, strips event/state bindings, rewrites links/assets.
import * as cheerio from 'cheerio';
import fs from 'fs';
import crypto from 'crypto';
const UMAP=JSON.parse(fs.readFileSync(new URL('./unsplash-map.json',import.meta.url),'utf8'));
export function localise(u){const id=/photo-[A-Za-z0-9_-]+/.exec(u||'')?.[0];return id&&/unsplash\.com/.test(u)&&UMAP[id]?UMAP[id]:u;}
export const D='/home/user/Auxilia-v2/design/';
export const slugMap={GRiC:'gric',Promises:'promises',RLC:'rlc',AHFIA:'ahfia',Imara:'imara',Inuka:'inuka',KPFoundation:'kenya-power-foundation',SFA:'sfa',CoopFoundation:'coop-bank-foundation',RSIF:'rsif',Britam:'britam',CoopBank:'coop-bank',KenyaPower:'kenya-power'};
export function readDc(rel){const s=fs.readFileSync(D+rel,'utf8');const b=s.slice(s.indexOf('</helmet>')+9,s.indexOf('</x-dc>'));return b;}
const hash=s=>crypto.createHash('sha1').update(s).digest('hex').slice(0,6);
export class Collector{constructor(prefix){this.prefix=prefix;this.css=new Map();this.icons=new Map();}
  cls(state,decl){decl=decl.trim().replace(/;?$/,'');const key=state+'|'+decl;if(!this.css.has(key)){const name=`${this.prefix}-${state[0]}${hash(key)}`;this.css.set(key,{name,state,decl});}return this.css.get(key).name;}
  icon(inner){const k='ic'+hash(inner);this.icons.set(k,inner);return k;}
  cssText(){let o='';for(const {name,state,decl} of this.css.values()){const d=decl.split(';').filter(Boolean).map(x=>x.trim()+'!important').join(';');o+=`.${name}:${state}{${d}}\n`;}return o;}
}
export function rewriteHref(h){
  if(!h)return h;
  let m=h.match(/^\.\/CS%20-%20([A-Za-z]+)\.dc\.html(#.*)?$/); if(m&&slugMap[m[1]]) return '/case-study/'+slugMap[m[1]]+(m[2]||'');
  m=h.match(/^\.\/Homepage\.dc\.html(#.*)?$/); if(m) return '/'+(m[1]||'');
  m=h.match(/^\.\/Acquisti(?:%20|\s)Privacy\.dc\.html(#.*)?$/); if(m) return '/acquisti/privacy'+(m[1]||'');
  m=h.match(/^\.\/Acquisti\.dc\.html(#.*)?$/); if(m) return '/acquisti'+(m[1]||'');
  return h;
}
export function clean(html,col,{assetBase='/assets/'}={}){
  const $=cheerio.load('<root>'+html+'</root>',{xmlMode:false},false);
  $('*').each((i,el)=>{
    const a=el.attribs||{};
    const cls=[];
    for(const k of Object.keys(a)){
      if(/^on[a-z]+$/i.test(k)&&a[k].includes('{{')) {delete a[k];continue;}
      if(k==='style-hover'){cls.push(col.cls('hover',a[k]));delete a[k];}
      else if(k==='style-focus'){cls.push(col.cls('focus',a[k]));delete a[k];}
      else if(k==='style-active'){cls.push(col.cls('active',a[k]));delete a[k];}
      else if(k==='hint-placeholder-count'||k==='hint-placeholder-val') delete a[k];
    }
    if(cls.length) a.class=((a.class?a.class+' ':'')+cls.join(' '));
    if(a.style) a.style=a.style.replace(/url\(\.\/assets\//g,'url('+assetBase);
    if(a.href) a.href=rewriteHref(a.href);
    if(el.name==='image-slot'){
      el.name='img';
      const alt=a.placeholder||'';
      const src=a.src||'';
      const keep={src: localise(src.startsWith('./assets/')?assetBase+src.slice(9):src), alt: a['data-decor']?'':alt, loading:'lazy', decoding:'async', 'data-slot':a.id||'' ,style:'display:block;width:100%;height:100%;object-fit:cover;'};
      for(const k of Object.keys(a)) delete a[k];
      Object.assign(a,keep);
    }
    if(a.src&&a.src.startsWith('./assets/')) a.src=assetBase+a.src.slice(9);
    if(el.name==='svg'){ /* move paths into registry */ }
  });
  return $('root').html();
}
