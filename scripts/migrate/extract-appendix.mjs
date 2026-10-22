import * as cheerio from 'cheerio';
import fs from 'fs';
import {D,readDc,clean,Collector,slugMap} from './clean.mjs';
import {extractHead,rich} from './extract-record.mjs';
const txt=($,el)=>$(el).text().replace(/\s+/g,' ').trim();

export function extractAppendix(name){
  const f=`auxilia/CS - ${name}.dc.html`;
  const col=new Collector('ax');
  const body=readDc(f);
  const i=body.indexOf('<main id="top">'),j=body.indexOf('</main>')+7;
  const $=cheerio.load(clean(body.slice(i,j),col),{xmlMode:false},false);
  const R=el=>rich($,el,{col});
  const ik=el=>col.icon($(el).html().trim());
  const data={};
  const hero=$('main > section[data-hero]');
  const tb=hero.children('div').filter((k,e)=>$(e).children('h1').length).first();
  data.hero={image:hero.children('img').attr('src'),eyebrow:txt($,tb.children().eq(0)),title:R(tb.find('h1')),lead:R(tb.find('p').first())};
  data.tablistLabel=$('[role=tablist]').attr('aria-label');
  // tabs in source script
  const raw=fs.readFileSync(D+f,'utf8');
  const tabsSrc=/_tabs = (\[\[[\s\S]*?\]\]);/.exec(raw)[1];
  const tabs=new Function('return '+tabsSrc)();
  const icMap=new Function('return '+/const ic = (\{[\s\S]*?\});\s*\n/.exec(raw)[1])();
  const mnav=new Function('return '+/mNav: (\[\[[\s\S]*?\]\]).map\(/.exec(raw)[1])();
  data.menu=mnav.map(n=>({label:n[0],sub:n[1],id:n[2].replace('#',''),icon:n[3].filter(Boolean),...(n[4]!=null?{tab:n[4]}:{})}));
  data.projects=tabs.map(t=>{
    const id=t[0];
    const panel=$('#panel-'+id);
    const blocks=[];
    const kids=panel.children().toArray();
    for(let k=0;k<kids.length;k++){
      const c=$(kids[k]);
      const st=(c.attr('style')||'').replace(/\s+/g,'');
      if(c.is('[data-plate]')&&!c.is('[data-lb]')){const im=c.find('img');blocks.push({type:'plate',src:im.attr('src'),alt:im.attr('alt')});continue;}
      if(c.is('[data-sh-split]')){
        const left=c.children().eq(0),right=c.children().eq(1);
        const links=right.find('a[data-live-link]').toArray().map(a=>({href:$(a).attr('href'),text:txt($,a)}));
        blocks.push({type:'head',kicker:txt($,left.children().eq(0)),title:R(left.find('h3')),icon:ik(right.children('span[aria-hidden]').find('svg')),intro:R(right.find('p').first()),...(links.length?{links}:{})});continue;
      }
      if(c.is('[data-three]')&&c.find('[data-mcard]').length){blocks.push({type:'cards',variant:'mandate',items:c.children().toArray().map(x=>({icon:ik($(x).find('svg').first()),label:txt($,$(x).children('div').first()),text:R($(x).children('p'))}))});continue;}
      if(c.is('[data-three]')&&c.find('span[data-draw-ico]').length){blocks.push({type:'cards',variant:'flat',items:c.children().toArray().map(x=>({icon:ik($(x).find('svg').first()),label:txt($,$(x).children('div').first()),text:R($(x).children('p'))}))});continue;}
      if(c.is('[data-three]')&&c.find('[data-count]').length){blocks.push({type:'stats',label:'',items:c.children().toArray().map(x=>({value:txt($,$(x).children('div').first()),text:R($(x).children('p'))}))});continue;}
      if(c.find('[data-tile-row]').length){blocks.push({type:'decisions',items:c.find('[data-tile-row]').toArray().map((r,n)=>{const left=$(r).children().eq(0),right=$(r).children().eq(1);const ps=right.children('p').toArray();const second=$(ps[1]);const lead=second.children('span').first();const onSite=lead.text();lead.remove();return {icon:ik(left.find('svg')),title:txt($,left.find('h3')),text:R(ps[0]),onSiteLabel:onSite.trim(),onSite:R(second)};})});continue;}
      if(/100vw/.test(st)&&c.find('h4').length){
        const head=c.find('> div > div').first();
        const title=txt($,head.find('h4')),note=txt($,head.find('p'));
        const tl=c.find('[data-tl]');
        if(tl.length){blocks.push({type:'band',kind:'timeline',title,note,cols:tl.attr('data-tl')||'',steps:tl.children().toArray().map(s=>({no:txt($,$(s).children('span')),title:txt($,$(s).children('h4')),text:R($(s).children('p'))}))});continue;}
        const three=c.find('[data-three]');
        blocks.push({type:'band',kind:'stats',title,note,items:three.children().toArray().map(x=>({value:txt($,$(x).children('div').first()),text:R($(x).children('p'))}))});continue;
      }
      if(c.is('div')&&!c.children().length&&/font-size:11px/.test(st)){
        const label=txt($,c);
        // next sibling decides
        const nx=$(kids[k+1]);
        if(nx.is('[data-three]')){blocks.push({type:'stats',label,items:nx.children().toArray().map(x=>({value:txt($,$(x).children('div').first()),text:R($(x).children('p'))}))});k++;continue;}
        if(label==='The screens'){
          // lead plate, caption, plates
          const lead=$(kids[k+1]),cap=$(kids[k+2]),grid=$(kids[k+3]);
          const plates=[{src:lead.find('img').attr('src'),alt:lead.find('img').attr('alt'),caption:txt($,cap)}];
          grid.children().each((m,d)=>plates.push({src:$(d).find('img').attr('src'),alt:$(d).find('img').attr('alt'),caption:txt($,$(d).children().eq(1))}));
          blocks.push({type:'screens',label,plates});k+=3;continue;
        }
      }
      throw new Error(name+' '+id+' unclassified child '+k+': '+(kids[k].name)+' '+txt($,c).slice(0,60));
    }
    return {id,num:t[1],name:t[2],type:t[3],icon:icMap[id],blocks};
  });
  const th=$('#thread');
  const cards=th.find('[data-bcard]').toArray().map(c=>({icon:ik($(c).find('svg')),label:txt($,$(c).children('span').eq(1)),text:R($(c).children('p'))}));
  data.thread={...extractHead($,th.get(0),col),cards};
  data.related=$('#next [data-cs-tile]').toArray().map(a=>({href:$(a).attr('href'),no:txt($,$(a).find('span[aria-hidden]')),client:txt($,$(a).find('[data-cs-cap] > div').eq(0)),title:txt($,$(a).find('[data-cs-cap] > div').eq(1)),image:$(a).find('img').attr('src')}));
  return {data,col,$};
}
if(process.argv[1]?.endsWith('extract-appendix.mjs')){
  const {data}=extractAppendix(process.argv[2]);
  console.log(JSON.stringify(data,null,1).slice(0,7000));
  for(const p of data.projects) console.log(p.id,p.blocks.map(b=>b.type+(b.variant?':'+b.variant:'')+(b.kind?':'+b.kind:'')).join(' > '));
}
