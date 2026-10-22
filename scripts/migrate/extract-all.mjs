import * as cheerio from 'cheerio';
import fs from 'fs';
import {readDc,clean,Collector,slugMap} from './clean.mjs';
import {extractHead,rich} from './extract-record.mjs';

const txt=($,el)=>$(el).text().replace(/\s+/g,' ').trim();
const kids=($,el)=>$(el).children().toArray();

export function extractRecord(f){
  const col=new Collector('ax');
  const body=readDc(f);
  const i=body.indexOf('<main id="top">'),j=body.indexOf('</main>')+7;
  const html=clean(body.slice(i,j),col);
  const $=cheerio.load(html,{xmlMode:false},false);
  const ik=el=>col.icon($(el).html().trim());
  const R=el=>rich($,el,{col});
  const data={};
  // ----- hero
  const hero=$('main > section[data-hero]');
  data.hero={image:hero.children('img').attr('src')};
  const hc=hero.children('div').eq(2); // text block (after grid rule)
  const textBlock=hero.children('div').filter((i,e)=>$(e).children('h1').length).first();
  data.hero.eyebrow=txt($,textBlock.children().eq(0));
  data.hero.title=R(textBlock.find('h1'));
  data.hero.lead=R(textBlock.find('p').first());
  data.hero.facts=hero.find('[data-facts] > div').toArray().map(d=>{
    const lab=$(d).children().eq(0);
    return {icon:ik(lab.find('svg')),label:lab.clone().children().remove().end().text().trim(),value:R($(d).children().eq(1))};
  });
  // ----- sections
  const secs=$('main > section[id]').toArray();
  data.order=secs.map(s=>$(s).attr('id'));
  for(const s of secs){
    const id=$(s).attr('id');
    if(id==='next')continue;
    const sec={...extractHead($,s,col)};
    const inner=$(s).children('div').last();
    if(id==='mandate'){
      sec.cards=$(s).find('[data-mcard]').toArray().map(c=>({icon:ik($(c).find('svg')),label:txt($,$(c).children('div').first()),text:R($(c).children('p'))}));
    } else if(id==='found'){
      const split=$(s).find('[data-found-split]');
      const img=split.find('img').first();
      sec.image={src:img.attr('src'),alt:img.attr('alt')};
      sec.people=split.children().eq(1).children().toArray().map(p=>({icon:ik($(p).find('svg')),title:txt($,$(p).find('h3')),text:R($(p).children('p'))}));
    } else if(id==='decisions'){
      sec.items=$(s).find('[data-tile-row]').toArray().map((r,n)=>{
        const left=$(r).children().eq(0),right=$(r).children().eq(1);
        const lab=txt($,left.children().eq(0));
        if(lab!=='Decision '+String(n+1).padStart(2,'0'))throw new Error(f+' decision label '+lab);
        const ps=right.children('p').toArray();
        const second=$(ps[1]);
        const lead=second.children('span').first();
        const onSite=lead.text();
        lead.remove();
        return {icon:ik(left.find('svg')),title:txt($,left.find('h3')),text:R(ps[0]),onSiteLabel:onSite.trim(),onSite:R(second)};
      });
    } else if(id==='logo'){
      const pl=$(s).find('[data-plates] > div').toArray();
      sec.beforeAfter=pl.map(d=>{const im=$(d).find('img');return {src:im.attr('src'),alt:im.attr('alt'),caption:R($(d).children().eq(1))};});
      sec.cards=$(s).find('[data-three] > div').toArray().map(c=>({label:txt($,$(c).children('div').first()),text:R($(c).children('p'))}));
      const sys=$(s).children('div').last().children('div[data-reveal]').last();
      const im=sys.find('img');
      sec.system={src:im.attr('src'),alt:im.attr('alt'),caption:R(sys.children('div').last())};
    } else if(id==='screens'){
      const plates=$(s).find('[data-lb]').toArray();
      sec.plates=plates.map(p=>{
        const im=$(p).find('img');const cap=$(p).parent().is('[data-plates]')||true;
        return {src:im.attr('src'),alt:im.attr('alt'),lb:$(p).attr('data-lb')};
      });
      // captions: lead caption is next sibling div; others in same wrapper
      sec.captions=[];
      const lead=$(s).find('[data-lb="0"]');
      sec.captions.push(txt($,lead.next()));
      $(s).find('[data-plates] > div').each((n,d)=>sec.captions.push(txt($,$(d).children().eq(1))));
    } else if(id==='build'){
      sec.cards=$(s).find('[data-bcard]').toArray().map(c=>({icon:ik($(c).find('svg')),label:txt($,$(c).children('span').eq(1)),text:R($(c).children('p'))}));
    } else if(id==='results'){
      sec.stats=$(s).find('[data-three]').first().children().toArray().map(c=>({value:txt($,$(c).children().eq(0)),text:R($(c).children('p'))}));
      const avatar=el=>{const a=$(el);return a.find('svg').length?{icon:col.icon(a.find('svg').html().trim())}:{initials:txt($,a)};};
      const fig=$(s).find('figure').not('[data-tq]').first();
      if(fig.length){
        const cap=fig.find('figcaption');
        sec.quote={text:R(fig.find('blockquote')),name:txt($,cap.find('span').eq(1).children().eq(0)),role:txt($,cap.find('span').eq(1).children().eq(1)),tag:txt($,cap.children('span').last()),avatar:avatar(cap.children('span').first())};
      }
      const cards=$(s).find('figure[data-tq]').toArray();
      if(cards.length) sec.quotes=cards.map(q=>({text:R($(q).find('blockquote')),name:txt($,$(q).find('figcaption span').eq(1).children().eq(0)),role:txt($,$(q).find('figcaption span').eq(1).children().eq(1)),avatar:avatar($(q).find('figcaption > span').first())}));
    }
    data[id]=sec;
  }
  // ----- related
  data.related=$('#next [data-cs-tile]').toArray().map(a=>({href:$(a).attr('href'),no:txt($,$(a).find('span[aria-hidden]')),client:txt($,$(a).find('[data-cs-cap] > div').eq(0)),title:txt($,$(a).find('[data-cs-cap] > div').eq(1)),image:$(a).find('img').attr('src')}));
  data.liveLink=data.screens?.link;
  return {data,col,$};
}
if(process.argv[1].endsWith('extract-all.mjs')){
  const f=process.argv[2];
  const {data}=extractRecord(f);
  console.log(JSON.stringify(data,null,1));
}
