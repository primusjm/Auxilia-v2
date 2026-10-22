import fs from 'fs';
import {readDc,Collector} from './clean.mjs';
import {dc2jsx} from './dc2jsx.mjs';
import crypto from 'crypto';
const [,,rel,outName]=process.argv;
const col=new Collector('aq');
const icons=new Map();
const hash=s=>crypto.createHash('sha1').update(s).digest('hex').slice(0,6);
// icon keys must match registry keys in icons.json (hash of cheerio-normalised inner)
import * as cheerio from 'cheerio';
const iconKey=(inner)=>{const norm=cheerio.load('<svg>'+inner+'</svg>',{xmlMode:false},false)('svg').html().trim();const k='ic'+hash(norm);icons.set(k,norm);return k;};
const body=readDc(rel);
const {jsx,roots}=dc2jsx(body,{assetBase:'/acquisti/assets/',col,iconKey});
const dest='/home/user/Auxilia-v2/src/components/acquisti/'+outName+'.template.tsx';
fs.mkdirSync('/home/user/Auxilia-v2/src/components/acquisti',{recursive:true});
const reserved=new Set(['h','Fragment']);
const vars=roots.filter(r=>!reserved.has(r));
const src=`/** @jsxImportSource preact */
/* eslint-disable */
// Generated from the Claude Design handover (${rel}) by scripts/migrate/dc2jsx.mjs, then maintained by hand.
import { Fragment } from 'preact';
import { I } from './icons';

export default function template(v: any) {
  const { ${vars.join(', ')} } = v;
  return (
    <>${jsx}</>
  );
}
`;
fs.writeFileSync(dest,src);
fs.writeFileSync('/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/aq-icons-'+outName+'.json',JSON.stringify(Object.fromEntries(icons)));
fs.writeFileSync('/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/aq-states-'+outName+'.css',col.cssText());
console.log(outName,'roots:',vars.join(','),'icons:',icons.size,'bytes',src.length);
