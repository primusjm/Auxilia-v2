import * as cheerio from 'cheerio';
import fs from 'fs';
import {readDc,clean,Collector,slugMap} from './clean.mjs';

export function iconKey(col,$el){const inner=$el.html()||'';return col.icon(inner.trim());}
// rich text: strong/span(ink) -> **x**, span(brand) -> ==x==
export function rich($,el,{col}={}){
  let out='';
  $(el).contents().each((i,n)=>{
    if(n.type==='text'){out+=n.data.replace(/\s+/g,' ');return;}
    if(n.type==='tag'){
      const st=(n.attribs.style||'').replace(/\s+/g,'');
      if(n.name==='br'){out+='\n';return;}
      const inner=rich($,n,{col});
      if(n.name==='strong'||n.name==='span'){
        if(/color:var\(--ink\)/.test(st)&&/font-weight:500/.test(st)) {out+='**'+inner+'**';return;}
        if(/color:var\(--brand\)/.test(st)) {out+='=='+inner+'==';return;}
        throw new Error('unknown inline style: '+n.name+' '+st+' | '+inner);
      }
      throw new Error('unknown inline tag '+n.name);
    }
  });
  return out.replace(/ *\n */g,'\n').trim();
}
const txt=($,el)=>$(el).text().replace(/\s+/g,' ').trim();

export function extractHead($,sec,col,{rest}={}){
  // section head: tab chip, h2, icon, intro p, note
  const head=$(sec).find('[data-sh-split]').first();
  const chip=$(sec).find('[data-reveal]').first().children().first().find('span').first();
  const tabSpan=chip.clone();tabSpan.children().remove();
  const tab=chip.clone().children().remove().end().text().trim();
  const h2=head.find('h2').first();
  const side=head.children().eq(1);
  const ic=side.children('span[aria-hidden]').first().find('svg');
  const info=side.children().eq(1);
  const intro=rich($,info.find('p').first(),{col});
  const noteEl=info.children().not('p').first();
  const note={};
  if(noteEl.is('a')){note.link={href:noteEl.attr('href'),text:txt($,noteEl)};if(/text-decoration:\s*underline/.test(noteEl.attr('style')||''))note.link.underline=true;}
  else note.text=txt($,noteEl);
  return {tab,title:rich($,h2,{col}),icon:col.icon(ic.html().trim()),intro,...(note.link?{link:note.link}:{note:note.text})};
}
