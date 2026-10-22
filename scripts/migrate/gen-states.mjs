import fs from 'fs';
import {D,readDc,clean,Collector} from './clean.mjs';
const col=new Collector('ax');
for(const f of fs.readdirSync(D+'auxilia').filter(f=>f.endsWith('.dc.html'))) clean(readDc('auxilia/'+f),col);
fs.writeFileSync('/home/user/Auxilia-v2/src/styles/auxilia/states.css','/* Hover, focus and active states from the prototype\'s style-hover / style-focus attributes. Generated. */\n'+col.cssText());
console.log(col.css.size,'state rules');
