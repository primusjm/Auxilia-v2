import {extractRecord} from './extract-all.mjs';
const names=['GRiC','Promises','RLC','AHFIA','Imara','Inuka','KPFoundation','SFA','CoopFoundation','RSIF'];
for(const n of names){
  try{
    const {data:d}=extractRecord(`auxilia/CS - ${n}.dc.html`);
    console.log(n.padEnd(15),d.order.join(','),'| facts',d.hero.facts.length,'mand',d.mandate?.cards.length,'found',d.found?.people.length,'dec',d.decisions?.items.length,'plates',d.screens?.plates.length,'caps',d.screens?.captions.length,'build',d.build?.cards.length,'stats',d.results?.stats.length,'q',d.results?.quotes?.length??0,'fq',d.results?.quote?1:0,'rel',d.related.map(r=>r.no).join('/'), 'link',d.screens?.link?'y':'n');
  }catch(e){console.log(n,'ERR',e.message.slice(0,300));}
}
