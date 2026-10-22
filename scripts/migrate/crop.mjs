import fs from 'fs';import {PNG} from 'pngjs';
const [,,src,out,y='0',h='900']=process.argv;
const A=PNG.sync.read(fs.readFileSync(src));const hh=Math.min(+h,A.height-+y);
const o=new PNG({width:A.width,height:hh});PNG.bitblt(A,o,0,+y,A.width,hh,0,0);fs.writeFileSync(out,PNG.sync.write(o));
