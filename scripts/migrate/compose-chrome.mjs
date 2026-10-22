import fs from 'fs';
import {Collector} from './clean.mjs';
import {prep} from './astroify.mjs';
const R='/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/raw/';
const OUT='/home/user/Auxilia-v2/src/components/';
const col=new Collector('ax');
const head=prep(fs.readFileSync(R+'gric-head.html','utf8'),col);
const tail=prep(fs.readFileSync(R+'gric-tail.html','utf8'),col);
const must=(s,a)=>{if(!s.includes(a))throw new Error('missing: '+a.slice(0,80));return s;};
const between=(s,a,b)=>{const i=s.indexOf(a);if(i<0)throw new Error('missing '+a);const j=s.indexOf(b,i+a.length);if(j<0)throw new Error('missing end '+b);return s.slice(i,j+b.length);};
function swap(s,a,b){must(s,a);return s.replace(a,b);}
// ---- Loader
let loader=between(head,'<div data-loader=','</div></div>\n');
// the loader block ends after the bar span; find exact end: up to '<div data-aurora'
loader=head.slice(head.indexOf('<div data-loader='),head.indexOf('<div data-aurora'));
fs.writeFileSync(OUT+'Loader.astro',`---\n---\n${loader.trim()}\n<div data-aurora="" aria-hidden="true"></div>\n<div class="ldr-bar" aria-hidden="true"></div>\n`);
// ---- Contact section
let sec=between(tail,'<section id="contact"','</section>');
sec=swap(sec,/<sc-for list="\{\{ quotes \}\}"[\s\S]*?<\/sc-for>/.exec(sec)[0],
`{quotes.map((q, i) => (
              <p class={'ax-q' + (i === 0 ? ' is-on' : '')} aria-hidden={i === 0 ? 'false' : 'true'}><span style="display:block;font-size:15px;line-height:1.4;color:var(--ft-ink);text-wrap:pretty;">{q.text}</span><span data-ft-who="" style="display:block;margin-top:2px;font-size:13px;line-height:1.4;color:var(--ft-soft);"><strong style="font-weight:500;color:var(--ft-accent);">{q.who}</strong>, {q.role}</span></p>
            ))}`);
sec=swap(sec,/<sc-for list="\{\{ quoteDots \}\}"[\s\S]*?<\/sc-for>/.exec(sec)[0],
`{quotes.map((q, i) => (
              <button type="button" data-q-dot={i} aria-label={'Show testimonial ' + (i + 1)} style="background:none;border:0;padding:10px 0;cursor:pointer;display:flex;align-items:center;"><span class={i === 0 ? 'ax-qd-on' : 'ax-qd-off'}>{i === 0 && <span />}</span></button>
            ))}`);
sec=sec.replace(/ aria-live="polite" style="display:grid/,' data-ft-quotes="" aria-live="polite" style="display:grid');
// footer nav -> loop
const nav=/<nav data-ft-nav[\s\S]*?<\/nav>/.exec(sec)[0];
const navOpen=nav.slice(0,nav.indexOf('>')+1);
const aTpl=/<a href="\/#record" ([^>]*)>Record<\/a>/.exec(nav);
sec=swap(sec,nav,`${navOpen}{nav.map((n) => (<a href={n.href} ${aTpl[1].replace(/"/g,'"')}>{n.label}</a>))}</nav>`);
sec=sec.replace('© 2026 Auxilia Ltd','{copyright}');
sec=sec.replace(/ aria-pressed="\{\{ isLight \}\}"/,' aria-pressed="false"').replace(/ aria-pressed="\{\{ isDark \}\}"/,' aria-pressed="false"');
sec=sec.replace(/mailto:hello@auxilia\.io/g,'mailto:{email}').replace(/>hello</,'>{email.split("@")[0]}<').replace(/<span>auxilia\.io<\/span>/,'<span>{email.split("@")[1]}</span>').replace('aria-label="Email hello@auxilia.io"','aria-label={`Email ${email}`}');
sec=sec.replace(/onclick="\{\{ openContact \}\}"/,'data-open-contact=""');
fs.writeFileSync(OUT+'ContactSection.astro',`---
import Icon from './Icon.astro';
import site from '../content/settings/site.json';
const { quotes, footerNav: nav, copyright, email } = site;
---
${sec}
`);
console.log('contact section ok');
fs.writeFileSync('/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/states.css',col.cssText());
fs.writeFileSync('/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/raw/tail-prep.txt',tail);
fs.writeFileSync('/tmp/claude-0/-home-user-Auxilia-v2/07a07848-80e2-501c-9ce2-064e48cce958/scratchpad/raw/head-prep.txt',head);

// ================= second stage: modal, lightbox, menu =================
{
const after=tail.slice(tail.indexOf('</section>')+10);
let ctm=after;
const lbStart=ctm.indexOf('<sc-if value="{{ lbOpen }}"');
let lb=ctm.slice(lbStart);
ctm=ctm.slice(0,lbStart);
// scrim + dialog
ctm=swap(ctm,'<div aria-hidden="true" style="{{ ctScrim }}"></div>','<div class="ax-ct-scrim" aria-hidden="true" data-ct-close=""></div>');
ctm=swap(ctm,/<div role="dialog" aria-modal="true" aria-label="Contact Auxilia"[^>]*>/.exec(ctm)[0],'<div class="ax-ct-wrap" role="dialog" aria-modal="true" aria-label="Contact Auxilia" aria-hidden="true" data-ct-dialog="">');
ctm=ctm.replace('<button type="button" class="ax-fx ax-fx-out ax-x" aria-label="Close"','<button type="button" class="ax-fx ax-fx-out ax-x" data-ct-close="" aria-label="Close"');
ctm=swap(ctm,'<sc-if value="{{ ctForm }}">','');
ctm=swap(ctm,/<form[^>]*>/.exec(ctm)[0],'<form data-ct-form="" style="display:flex;flex-direction:column;gap:16px;padding:14px 24px 24px;">');
ctm=swap(ctm,'</form>\n    </sc-if>','</form>');
ctm=ctm.replace('name="_subject" value="Book a call: GRiC Africa"','name="_subject" value={subject}');
ctm=swap(ctm,'value="{{ ccValue }}"','value="KE +254"');
ctm=swap(ctm,/<button type="button" aria-haspopup="listbox"[^>]*>/.exec(ctm)[0],m=>m, ) ;
