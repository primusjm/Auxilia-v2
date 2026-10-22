import * as cheerio from 'cheerio';
import fs from 'fs';
import {readDc,clean,Collector} from './clean.mjs';
import {extractHead,rich,iconKey} from './extract-record.mjs';
const f=process.argv[2];
const col=new Collector('ax');
const body=readDc(f);
const i=body.indexOf('<main id="top">'),j=body.indexOf('</main>')+7;
const html=clean(body.slice(i,j),col);
const $=cheerio.load(html,{xmlMode:false},false);
const out={};
const secs=$('main > section').toArray();
out.sectionIds=secs.map(s=>$(s).attr('id')||'(hero)');
for(const s of secs){
  const id=$(s).attr('id');
  if(!id||!$(s).find('[data-sh-split]').length){continue;}
  out[id]=extractHead($,s,col);
}
console.log(JSON.stringify(out,null,1));
