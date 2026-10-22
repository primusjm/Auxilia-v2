import {clean,Collector,readDc} from './clean.mjs';
import fs from 'fs';
const [,, file, part] = process.argv;
const S='/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/raw/';
let h=fs.readFileSync(S+file,'utf8');
const col=new Collector('ax');
let out=clean(h,col);
// collapse svg inner
out=out.replace(/(<svg[^>]*>)([\s\S]*?)(<\/svg>)/g,(m,a,b,c)=>a+'⟦'+col.icon(b.trim())+'⟧'+c);
console.log(out);
console.error([...col.icons.keys()].length,'icons');
fs.writeFileSync(S+'icons-'+file+'.json',JSON.stringify(Object.fromEntries(col.icons),null,1));
