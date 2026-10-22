import postcss from 'postcss';import fs from 'fs';
const C='/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/css/';
const OUT='/home/user/Auxilia-v2/src/styles/acquisti/';fs.mkdirSync(OUT,{recursive:true});
const norm=n=>n.toString().replace(/\s+/g,' ').trim();
const list=f=>{const seen=new Set(),o=[];postcss.parse(fs.readFileSync(C+f,'utf8')).each(n=>{if(n.type==='comment')return;const k=norm(n);if(seen.has(k))return;seen.add(k);o.push({k,css:n.toString().trim()});});return o;};
const L=list('acq-0.css'),P=list('priv-0.css');
const ls=new Set(L.map(x=>x.k)),ps=new Set(P.map(x=>x.k));
const base=[],land=[],priv=[];
for(const x of L){ (ps.has(x.k)?base:land).push(x.css); }
for(const x of P){ if(!ls.has(x.k)) priv.push(x.css); }
fs.writeFileSync(OUT+'base.css','/* Acquisti base: rules shared by the landing and privacy pages, from the handover. */\n'+base.join('\n')+'\n');
fs.writeFileSync(OUT+'landing.css','/* Acquisti landing page rules, from the handover. */\n'+land.join('\n')+'\n');
fs.writeFileSync(OUT+'privacy.css','/* Acquisti privacy page rules, from the handover. */\n'+priv.join('\n')+'\n');
console.log('base',base.length,'landing',land.length,'privacy',priv.length);
