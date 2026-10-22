// Converts a Claude Design template (x-dc body) into a Preact TSX template function.
import * as cheerio from 'cheerio';
import fs from 'fs';
import crypto from 'crypto';
import {readDc,Collector,rewriteHref} from './clean.mjs';

const VOID=new Set(['img','input','br','hr','meta','link','source','area','col','embed','wbr']);
const EVT={onclick:'onClick',onkeydown:'onKeyDown',onkeyup:'onKeyUp',onmouseenter:'onMouseEnter',onmouseleave:'onMouseLeave',onmousemove:'onMouseMove',onsubmit:'onSubmit',onchange:'onInput',oninput:'onInput',onfocus:'onFocus',onblur:'onBlur',onanimationend:'onAnimationEnd',onmouseover:'onMouseOver',onmouseout:'onMouseOut'};
const NAME={tabindex:'tabIndex',readonly:'readOnly',autocomplete:'autoComplete',inputmode:'inputMode',class:'class',for:'for',viewbox:'viewBox',preserveaspectratio:'preserveAspectRatio',pathlength:'pathLength',colspan:'colSpan',rowspan:'rowSpan',maxlength:'maxLength',srcset:'srcSet'};
const hash=s=>crypto.createHash('sha1').update(s).digest('hex').slice(0,6);

export function dc2jsx(html,{assetBase,col,iconKey}){
  const $=cheerio.load('<root>'+html+'</root>',{xmlMode:false},false);
  const roots=new Set();
  const scope=[];
  const exprs=[];
  const isLoopVar=n=>scope.some(s=>s.has(n));
  function ex(e){ // translate a {{ }} expression; record root identifiers
    e=e.trim();
    const m=/^[A-Za-z_$][\w$]*/.exec(e);
    if(m&&!isLoopVar(m[0])&&!['true','false','null','undefined'].includes(m[0])) roots.add(m[0]);
    // identifiers inside more complex expressions
    for(const mm of e.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)/g)){const n=mm[1];if(!isLoopVar(n)&&!['true','false','null','undefined','typeof'].includes(n))roots.add(n);}
    return e;
  }
  const attrVal=(name,val)=>{
    const parts=val.split(/(\{\{[\s\S]*?\}\})/).filter(p=>p!=='');
    if(parts.length===1&&/^\{\{[\s\S]*\}\}$/.test(parts[0])) return `{${ex(parts[0].slice(2,-2))}}`;
    if(!parts.some(p=>p.startsWith('{{'))) return JSON.stringify(val);
    return '{`'+parts.map(p=>p.startsWith('{{')?'${'+ex(p.slice(2,-2))+'}':p.replace(/[`\\$]/g,m=>'\\'+m)).join('')+'`}';
  };
  function fixUrl(v){
    if(v.startsWith('./assets/')) return assetBase+v.slice(9);
    return rewriteHref(v);
  }
  function attrs(el){
    const out=[];const a=el.attribs||{};const cls=[];
    for(const k of Object.keys(a)){
      let v=a[k];
      if(k==='hint-placeholder-count'||k==='hint-placeholder-val'||k==='as'&&el.name==='sc-for'||k==='list'&&el.name==='sc-for')continue;
      if(k==='style-hover'){cls.push(col.cls('hover',v));continue;}
      if(k==='style-focus'){cls.push(col.cls('focus',v));continue;}
      if(k==='style-active'){cls.push(col.cls('active',v));continue;}
      if(k==='ref'){out.push(`ref=${attrVal(k,v)}`);continue;}
      if(EVT[k]){out.push(`${EVT[k]}=${attrVal(k,v)}`);continue;}
      if(/^on[a-z]+$/.test(k)){throw new Error('unmapped event '+k);}
      if((k==='src'||k==='href')&&!v.includes('{{')) v=fixUrl(v);
      if(k==='style'&&!v.includes('{{')) v=v.replace(/url\(\.\/assets\//g,'url('+assetBase);
      const name=NAME[k]||k;
      out.push(`${name}=${attrVal(k,v)}`);
    }
    if(cls.length){const i=out.findIndex(o=>o.startsWith('class='));if(i>=0){const cur=a.class;out[i]=`class=${attrVal('class',(cur?cur+' ':'')+cls.join(' '))}`;}else out.push(`class=${JSON.stringify(cls.join(' '))}`);}
    return out.length?' '+out.join(' '):'';
  }
  function text(t){
    // returns JSX text pieces
    const parts=t.split(/(\{\{[\s\S]*?\}\})/);
    return parts.map(p=>{
      if(p.startsWith('{{'))return `{${ex(p.slice(2,-2))}}`;
      if(!p)return '';
      // JSX-safe: wrap in expression if has special chars
      if(/[{}<>]/.test(p)) return `{${JSON.stringify(p)}}`;
      return p;
    }).join('');
  }
  function node(n){
    if(n.type==='text'){
      const raw=n.data;
      if(!raw.trim()) return '';
      // collapse whitespace runs like HTML; keep single spaces at edges where meaningful
      let t=raw.replace(/\s+/g,' ');
      const lead=/^\s/.test(t),trail=/\s$/.test(t);
      let core=t.trim();
      let out=text(core);
      if(lead)out='{" "}'+out; if(trail)out+='{" "}';
      return out;
    }
    if(n.type==='comment')return '';
    if(n.type!=='tag')return '';
    const name=n.name;
    if(name==='sc-for'){
      const list=n.attribs.list.replace(/^\{\{|\}\}$/g,'').trim();const as=n.attribs.as;
      const L=ex(list);scope.push(new Set([as,as+'_i']));
      const inner=kids(n);scope.pop();
      return `{(${L}||[]).map((${as}: any, ${as}_i: number) => (<Fragment key={${as}_i}>${inner}</Fragment>))}`;
    }
    if(name==='sc-if'){
      const v=n.attribs.value.replace(/^\{\{|\}\}$/g,'').trim();
      return `{(${ex(v)}) ? (<Fragment>${kids(n)}</Fragment>) : null}`;
    }
    if(name==='svg'&&iconKey){
      const inner=$(n).html()||'';
      if(!inner.includes('{{')){
        const k=iconKey(inner.trim());
        return `<I k="${k}"${attrs(n)} />`;
      }
    }
    if(VOID.has(name))return `<${name}${attrs(n)} />`;
    return `<${name}${attrs(n)}>${kids(n)}</${name}>`;
  }
  const kids=n=>(n.children||[]).map(node).join('');
  const root=$('root').get(0);
  const body=kids(root);
  return {jsx:body,roots:[...roots]};
}
