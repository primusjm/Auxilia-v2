// Light inline markup used in content fields:
//   **text**  emphasis (medium weight, ink colour)
//   ==text==  highlight (brand colour)
//   [[text]]  keep together on one line
//   a newline is a line break that only applies on wide screens
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

type Ctx = 'p' | 'h1' | 'h2';

export function rich(input: string | undefined, ctx: Ctx = 'p'): string {
  if (!input) return '';
  let o = esc(input);
  o = o.replace(/\*\*([\s\S]+?)\*\*/g, '<strong style="font-weight:500;color:var(--ink);">$1</strong>');
  const hi = ctx === 'h1' ? 'font-weight:500;color:var(--brand);' : 'color:var(--brand);';
  o = o.replace(/==([\s\S]+?)==/g, `<span style="${hi}">$1</span>`);
  o = o.replace(/\[\[([\s\S]+?)\]\]/g, '<span style="white-space:nowrap;">$1</span>');
  o = o.replace(/\s*\n\s*/g, ' <br data-desk-only="">');
  return o;
}

/** Plain text version, for meta descriptions. */
export function plain(input: string | undefined): string {
  return (input ?? '').replace(/\*\*|==|\[\[|\]\]/g, '').replace(/\s*\n\s*/g, ' ').trim();
}
