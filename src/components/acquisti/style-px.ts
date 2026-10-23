// Preact 11 no longer adds "px" to numeric inline styles, so values such as `top: 14` were dropped.
// The islands were ported from React, which adds it, so restore that behaviour for every element.
import { options } from 'preact';

const UNITLESS = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
const prev = options.vnode;

options.vnode = (vnode: any) => {
  const st = typeof vnode.type === 'string' && vnode.props && vnode.props.style;
  if (st && typeof st === 'object') {
    let out: Record<string, unknown> | null = null;
    for (const k in st) {
      const v = st[k];
      if (typeof v === 'number' && v !== 0 && k[0] !== '-' && !UNITLESS.test(k)) (out ||= { ...st })[k] = v + 'px';
    }
    if (out) vnode.props.style = out;
  }
  if (prev) prev(vnode);
};
