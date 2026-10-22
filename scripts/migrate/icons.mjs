import fs from 'fs';
import {readDc,D,clean,Collector} from './clean.mjs';
import {collapseSvg} from './astroify.mjs';
const col=new Collector('ax');
const files=fs.readdirSync(D+'auxilia').filter(f=>f.endsWith('.dc.html')).map(f=>'auxilia/'+f).concat(fs.readdirSync(D+'acquisti').filter(f=>f.endsWith('.dc.html')).map(f=>'acquisti/'+f));
for(const f of files){collapseSvg(clean(readDc(f),col,{assetBase:f.startsWith('acq')?'/acquisti/assets/':'/assets/'}),col);}
const reg=Object.fromEntries(col.icons);
reg.icsend='<path d="M22 2 11 13"></path><path d="M22 2 15 22l-4-9-9-4Z"></path>';
fs.writeFileSync('/home/user/Auxilia-v2/src/data/icons.json',JSON.stringify(reg));
console.log(Object.keys(reg).length,'icons');
for(const k of ['ic07338b','ice82a54','ic13b615','ice28539','ic5779a4','ic49d1a5','ic40f752','ice70e5c','ic113c36','icd0074d','icd3b3d1','icaa80bf']) if(!reg[k]) console.log('MISSING',k);
