import fs from 'fs';
import * as yaml from 'js-yaml';
import * as cheerio from 'cheerio';
import {readDc} from './clean.mjs';
const R='/home/user/Auxilia-v2/';
const S='/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/';
const $=cheerio.load('<root>'+readDc('acquisti/Acquisti Privacy.dc.html')+'</root>',{xmlMode:false},false);
const txt=e=>$(e).text().replace(/\s+/g,' ').trim();
const md=e=>{let o='';$(e).contents().each((i,n)=>{if(n.type==='text')o+=n.data;else if(n.name==='a')o+='['+$(n).text()+']('+$(n).attr('href')+')';else throw new Error('inline '+n.name);});return o.replace(/\s+/g,' ').trim();};
const h1=$('h1').first();
const intro={title:h1.clone().children().remove().end().text().trim(),titleEmphasis:txt(h1.children('span')),lead:txt($('[data-split] > p').first())};
const meta=$('[data-pmeta] > div').toArray().map(d=>({label:txt($(d).children().eq(0)),value:txt($(d).children().eq(1))}));
const sections=$('section[data-psec]').toArray().map(s=>{
  const body=$(s).children('div').first();
  const blocks=[];
  body.children().each((i,c)=>{
    if(c.name==='h2')return;
    if(c.name==='p'){
      const st=$(c).attr('style')||'';
      blocks.push({type:'p',text:md(c),variant:st.includes('margin-top:14px')?'spaced':st.includes('margin-bottom:16px')?'lead':''});
    } else if(c.name==='div'){
      blocks.push({type:'rows',items:$(c).children().toArray().map(r=>({term:txt($(r).children('strong')),text:md($(r).children('p'))}))});
    } else throw new Error('unknown '+c.name);
  });
  return {id:$(s).attr('id'),title:txt(body.children('h2')),blocks};
});
const contact=$('section[data-pcontact]');
const data={intro,meta,sections,contact:{title:txt(contact.find('h2')),text:txt(contact.find('p')),button:txt(contact.find('.ax-btn-t'))},apple:txt($('article > p[data-apple-tm]'))};
fs.writeFileSync(R+'src/content/acquisti/privacy.yaml',yaml.dump(data,{lineWidth:-1,quotingType:'"'}));
console.log(sections.map(s=>s.id+':'+s.blocks.map(b=>b.type[0]).join('')).join(' '));
