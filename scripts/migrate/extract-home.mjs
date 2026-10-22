import * as cheerio from 'cheerio';
import fs from 'fs';
import * as yaml from 'js-yaml';
import {D,readDc,clean,Collector} from './clean.mjs';
import {rich} from './extract-record.mjs';
const col=new Collector('ax');
const body=readDc('auxilia/Homepage.dc.html');
const i=body.indexOf('<main id="top">'),j=body.indexOf('</main>')+7;
let html=clean(body.slice(i,j),col);
const $=cheerio.load(html,{xmlMode:false},false);
const txt=el=>$(el).text().replace(/\s+/g,' ').trim();
const R=el=>rich($,el,{col});
const ik=el=>col.icon($(el).html().trim());
// rich: homepage inline highlight uses color:var(--brand) spans; nowrap wrapper span handled specially
function richH(el){
  let out='';
  $(el).contents().each((k,n)=>{
    if(n.type==='text'){out+=n.data.replace(/\s+/g,' ');return;}
    if(n.type!=='tag')return;
    const st=(n.attribs.style||'').replace(/\s+/g,'');
    if(n.name==='br'){out+='\n';return;}
    const inner=richH(n);
    if(n.name==='strong'||n.name==='span'){
      if(/white-space:nowrap/.test(st)){out+='[['+inner+']]';return;}
      if(/color:var\(--ink\)/.test(st)&&/font-weight:500/.test(st)){out+='**'+inner+'**';return;}
      if(/color:var\(--brand\)/.test(st)){out+='=='+inner+'==';return;}
    }
    throw new Error('home inline: '+n.name+' '+st);
  });
  return out.replace(/ *\n */g,'\n').trim();
}
function head(sec){
  const hd=$(sec).find('[data-sh-split]').first();
  const chip=$(sec).find('[data-reveal]').first().children().first().find('span').first();
  const tab=chip.clone().children().remove().end().text().trim();
  const side=hd.children().eq(1);
  const info=side.children().eq(1);
  return {tab,title:richH(hd.find('h2').first()),icon:ik(side.children('span[aria-hidden]').first().find('svg')),intro:richH(info.find('p').first()),note:txt(info.children().not('p').first())};
}
const secs=$('main > section').toArray();
const data={};
// hero
const hero=secs[0];
const heroText=$(hero).find('[data-hero] > div').first();
data.hero={
  title:richH($(hero).find('h1')),
  lead:richH(heroText.find('p').first()),
  primaryCta:txt(heroText.find('[data-book]')),
  secondaryCta:txt(heroText.find('[data-cta-down]')),
  caseStudyLabel:txt($(hero).find('a[href="{{ heroCur.href }}"]')),
  slides:['rlc','gric','inuka','kenya-power-foundation'],
};
// marquees
const marq=(sec)=>$(sec).find('.ldr-marquee > div').first().children('span').toArray().filter(e=>!$(e).attr('aria-hidden')&&e.name==='span'&&!$(e).find('svg').length).map(e=>txt(e));
data.marquee={topics:marq(secs[1])};
// stats
data.stats=$('[data-stats] > div').toArray().map(c=>{
  const cnt=$(c).find('[data-count]');
  return {icon:ik($(c).find('[data-stat-ico] svg')),value:+cnt.attr('data-count'),prefix:cnt.attr('data-pre')||'',suffix:cnt.attr('data-suf')||'',label:txt(cnt.next()),client:txt($(c).find('a')),};
});
// record
const recSec=$('#record').get(0);
data.record=head(recSec);
// trusted
const tr=$('[data-trusted]');
data.trusted={
  eyebrow:txt(tr.children().eq(0).children().eq(0).children().eq(0)),
  title:richH(tr.find('h3').first()),
  stats:tr.find('[data-apx-stats] > div').toArray().map(d=>{const sp=$(d).children('span').eq(0);return {value:txt(sp.children().eq(0)),icon:ik(sp.children().eq(1).find('svg')),iconStyle:/background:var\(--brand\)/.test(sp.children().eq(1).attr('style'))?'brand':'paper',text:(()=>{const t=$(d).children('span').eq(1);const c=t.clone();c.find('span').remove();return c.text().replace(/\s+/g,' ').trim();})(),srPrefix:txt($(d).children('span').eq(1).children('span'))};}),
  clients:$('[data-apx-marq] > span').toArray().slice(0,6).map(e=>{const a=$(e).find('a');return {name:txt($(e).find('[data-apx-name]')),href:a.attr('href'),external:a.attr('target')==='_blank'};}),
  featuredLabel:txt($('[data-apx-featured] > div').first()),
  featured:$('[data-apx-featured] a[data-cs-tile]').toArray().map(a=>({href:$(a).attr('href'),image:$(a).find('img').attr('src'),client:txt($(a).find('[data-cs-cap] > div').eq(0)),title:txt($(a).find('[data-cs-cap] > div').eq(1)),go:txt($(a).find('[data-cs-go]'))})),
};
// constraints
const cx=$('#constraints').get(0);
data.constraints={...head(cx),tiles:$(cx).find('.cx-tile').toArray().map(t=>({image:$(t).find('img').attr('src'),alt:$(t).find('img').attr('alt'),icon:ik($(t).find('h3 svg')),title:txt($(t).find('h3')),text:txt($(t).find('p'))}))};
// capability
const cp=$('#capability').get(0);
data.capability={...head(cp),steps:$(cp).find('[data-lc-step]').toArray().map(s=>({icon:ik($(s).find('.lc-ico svg')),kicker:txt($(s).children('span').eq(1)),title:txt($(s).find('h3')),text:txt($(s).find('p'))}))};
// method
const mt=$('#method').get(0);
data.method={...head(mt),phases:$(mt).find('[data-mt-row]').toArray().map(r=>{
  const left=$(r).children().eq(0),mid=$(r).children().eq(1),right=$(r).children().eq(2);
  const meta=mid.children().eq(0).children('span').toArray().filter(e=>!$(e).attr('aria-hidden'));
  return {icon:ik(left.find('.mt-node svg')),label:txt(meta[0]),time:txt(meta[1]),title:txt(mid.find('h3')),text:txt(mid.find('p')),bullets:mid.find('li').toArray().map(l=>txt(l)),leave:txt(right.find('[data-mt-leave]')),yourTimeLabel:txt(right.find('strong')),yourTime:(()=>{const s=right.find('strong').parent();const c=s.clone();c.find('strong').remove();return c.text().replace(/\s+/g,' ').trim();})()};
}),closing:txt($(mt).find('.mt-end').parent().next())};
// marquee 2
const mq2=secs.find(s=>$(s).attr('aria-label')==='What we deliver');
data.marquee.services=marq(mq2);
data.marquee.servicesLabel='What we deliver';
data.hero.lead=data.hero.lead.replace('{{ missionWord }}','{missions}');data.record.title=data.record.title.replace('{{ missionWord }}','{missions}');data.record.note=data.record.note.replace('{{ missionCount }}','{count}');
fs.writeFileSync('/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/home.json',JSON.stringify(data,null,1));
console.log(JSON.stringify(data,null,1).slice(0,6000));
export {data};
