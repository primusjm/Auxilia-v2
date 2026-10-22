import postcss from 'postcss';import fs from 'fs';
const C='/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/css/';
function rules(f){const r=postcss.parse(fs.readFileSync(C+f,'utf8'));const out=[];r.each(n=>out.push(n.toString().replace(/\s+/g,' ').trim()));return out;}
const sets={};
for (const [k,fs_] of Object.entries({home:['home-0.css','home-1.css','home-2.css'],rec:['rec-0.css','rec-1.css','rec-2.css','rec-3.css','rec-4.css'],app:['app-0.css','app-1.css','app-2.css','app-3.css','app-4.css','app-5.css']})) sets[k]=fs_.flatMap(rules);
const S=Object.fromEntries(Object.entries(sets).map(([k,v])=>[k,new Set(v)]));
for(const k in sets) console.log(k,sets[k].length,S[k].size);
const all=[...S.home].filter(r=>S.rec.has(r)&&S.app.has(r));
console.log('common to all three',all.length);
console.log('home&rec',[...S.home].filter(r=>S.rec.has(r)).length,'home&app',[...S.home].filter(r=>S.app.has(r)).length,'rec&app',[...S.rec].filter(r=>S.app.has(r)).length);
console.log('home only',[...S.home].filter(r=>!S.rec.has(r)&&!S.app.has(r)).length,'rec only',[...S.rec].filter(r=>!S.home.has(r)&&!S.app.has(r)).length,'app only',[...S.app].filter(r=>!S.home.has(r)&&!S.rec.has(r)).length);
// show first 300 chars of tokens rules
for(const r of sets.home.slice(0,60)) if(/^(:root|\[data-theme)/.test(r)) console.log(r.slice(0,1200),'\n');
