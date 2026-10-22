import postcss from 'postcss';import fs from 'fs';
const C='/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/css/';
const OUT='/home/user/Auxilia-v2/src/styles/auxilia/';
fs.mkdirSync(OUT,{recursive:true});
const norm=n=>n.toString().replace(/\s+/g,' ').trim();
function list(files){const seen=new Set(),out=[];for(const f of files){postcss.parse(fs.readFileSync(C+f,'utf8')).each(n=>{if(n.type==='comment')return;const k=norm(n);if(seen.has(k))return;seen.add(k);out.push({k,css:n.toString().trim()});});}return out;}
const H=list(['home-0.css','home-1.css','home-2.css']);
const R=list(['rec-0.css','rec-1.css','rec-2.css','rec-3.css','rec-4.css']);
const A=list(['app-0.css','app-1.css','app-2.css','app-3.css','app-4.css','app-5.css']);
const hs=new Set(H.map(x=>x.k)),rs=new Set(R.map(x=>x.k)),as=new Set(A.map(x=>x.k));
const isTok=n=>{const r=postcss.parse(n.css).first;return r.type==='rule'&&r.nodes.length&&r.nodes.every(d=>d.type==='decl'&&(d.prop.startsWith('--')||d.prop==='color-scheme'));};
const buckets={tokens:[],base:[],cs:[],home:[],record:[],appendix:[]};
const emitted=new Set();
function put(b,x){ if(emitted.has(b+x.k))return; emitted.add(b+x.k); buckets[b].push(x.css);}
// order: iterate rec first (superset ordering), then app extras, then home extras
for(const x of R){const h=hs.has(x.k),a=as.has(x.k);
  if(isTok(x)&&h&&a) put('tokens',x); else if(h&&a) put('base',x); else if(a) put('cs',x); else if(h) put('home',x); else put('record',x);}
for(const x of A){ if(rs.has(x.k))continue; const h=hs.has(x.k); if(isTok(x)&&h) put('tokens',x); else if(h) put('base',x); else put('appendix',x);}
for(const x of H){ if(rs.has(x.k)||as.has(x.k)) {if(!rs.has(x.k)&&as.has(x.k)) {/*HA only*/ put('home',x);} continue;} if(isTok(x)) put('tokens',x); else put('home',x);}
// home&app not rec: also needed in appendix (already put in base above via A loop if h)
for(const k in buckets){fs.writeFileSync(OUT+k+'.css',`/* Auxilia ${k}: split from the Claude Design handover. */\n`+buckets[k].join('\n')+'\n');console.log(k,buckets[k].length);}
