/** Shared attributes for the stroked line icons. */
export function ico(size: number, stroke: number) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': stroke,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    width: size,
    height: size,
    'aria-hidden': 'true',
  };
}
