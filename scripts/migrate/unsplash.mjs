import fs from 'fs';import {execFileSync} from 'child_process';import {createRequire} from 'module';
const require=createRequire('/home/user/Auxilia-v2/package.json');
const sharp=require('sharp');
const D='/home/user/Auxilia-v2/design/';
const urls=new Set();
for(const dir of ['auxilia','acquisti']) for(const f of fs.readdirSync(D+dir).filter(f=>f.endsWith('.html'))){
  const s=fs.readFileSync(D+dir+'/'+f,'utf8').replace(/&amp;/g,'&');
  for(const m of s.matchAll(/https:\/\/(?:images|plus)\.unsplash\.com\/[^"'\s)]*/g)) urls.add(m[0]);
}
const byId={};
for(const u of urls){const id=/photo-[A-Za-z0-9_-]+/.exec(u)?.[0];if(!id){console.log('no id',u);continue;}const w=+(/[?&]w=(\d+)/.exec(u)?.[1]||0);if(!byId[id]||w>byId[id].w)byId[id]={w,u};}
const OUT='/home/user/Auxilia-v2/public/assets/stock/';fs.mkdirSync(OUT,{recursive:true});
const map={};
for(const [id,{w,u}] of Object.entries(byId)){
  const tmp='/tmp/'+id+'.jpg';
  try{
    execFileSync('curl',['-sS','-L','-m','60','-o',tmp,u]);
    const buf=fs.readFileSync(tmp);
    await sharp(buf).webp({quality:78}).toFile(OUT+id+'.webp');
    const meta=await sharp(buf).metadata();
    map[id]='/assets/stock/'+id+'.webp';
    console.log(id,w,meta.width+'x'+meta.height,fs.statSync(OUT+id+'.webp').size);
  }catch(e){console.log('FAIL',id,e.message.slice(0,100));}
}
fs.writeFileSync('/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/tools/unsplash-map.json',JSON.stringify(map,null,1));
console.log(Object.keys(map).length,'of',Object.keys(byId).length);
