import fs from 'fs';import {PNG} from 'pngjs';import pixelmatch from 'pixelmatch';
const [,,a,b,out]=process.argv;
const A=PNG.sync.read(fs.readFileSync(a)),B=PNG.sync.read(fs.readFileSync(b));
const w=Math.min(A.width,B.width),h=Math.min(A.height,B.height);
function crop(P){const o=new PNG({width:w,height:h});PNG.bitblt(P,o,0,0,w,h,0,0);return o;}
const a2=crop(A),b2=crop(B),d=new PNG({width:w,height:h});
const n=pixelmatch(a2.data,b2.data,d.data,w,h,{threshold:0.12,includeAA:false});
fs.writeFileSync(out,PNG.sync.write(d));
console.log(`size A ${A.width}x${A.height} B ${B.width}x${B.height}; diff px ${n} (${(100*n/(w*h)).toFixed(3)}%)`);
// row-band summary: bands of 200px with diff counts
const bands=[];for(let y=0;y<h;y+=200){let c=0;for(let yy=y;yy<Math.min(h,y+200);yy++)for(let x=0;x<w;x++){const i=(yy*w+x)*4;if(d.data[i]===255&&d.data[i+1]===0&&d.data[i+2]===0)c++;}bands.push(c);}
console.log('bands(200px):',bands.map((c,i)=>c>w*20?`${i*200}:${c}`:null).filter(Boolean).join(' '));
