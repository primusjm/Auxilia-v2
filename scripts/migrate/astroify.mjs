import {clean,Collector} from './clean.mjs';
// Convert cleaned html with ⟦icon⟧ placeholders into Astro-friendly markup.
export function collapseSvg(html,col){
  return html.replace(/(<svg\b)([^>]*)>([\s\S]*?)<\/svg>/g,(m,a,attrs,inner)=>{
    if(inner.includes('{{'))return m;
    const k=col.icon(inner.trim());
    const at=attrs.trim().replace(/\s+/g,' ');
    return `<Icon k="${k}" ${at} />`;
  });
}
export function prep(html,col,opts){return collapseSvg(clean(html,col,opts),col);}
