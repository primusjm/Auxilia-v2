// The prototype's runtime serialised inline colours as rgb(); static HTML keeps the hex we wrote.
// Add a hex twin for every selector that matches on the rgb form.
import postcss from 'postcss';import fs from 'fs';
for(const f of process.argv.slice(2)){
  const root=postcss.parse(fs.readFileSync(f,'utf8'));
  let n=0;
  root.walkRules(r=>{
    if(!r.selector.includes('[style*="rgb(59, 40, 255)"]'))return;
    const parts=r.selectors;const out=[...parts];
    for(const s of parts){ if(s.includes('[style*="rgb(59, 40, 255)"]')){const twin=s.replace('[style*="rgb(59, 40, 255)"]','[style*="#3B28FF" i]'); if(!out.includes(twin)){out.push(twin);n++;}} }
    r.selectors=out;
  });
  fs.writeFileSync(f,root.toString());
  console.log(f,n,'twins');
}
