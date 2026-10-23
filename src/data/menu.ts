// The Auxilia site menu, shared by the Homepage and the case studies.
// Off the Homepage the section links point back to it; Contact stays on the page, since every page ends with it.
export function siteMenu(onHome: boolean) {
  const home = onHome ? '' : '/';
  return [
    { label: 'Record', sub: 'Our missions', href: `${home}#record`, icon: ['M3 6h7l2 2h9v11H3Z'] },
    { label: 'Constraints', sub: 'What we plan around', href: `${home}#constraints`, icon: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18Z', 'M12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10Z', 'M12 11a1 1 0 1 0 0 2a1 1 0 1 0 0-2Z'] },
    { label: 'Capability', sub: 'What we build', href: `${home}#capability`, icon: ['m12 3 9 5-9 5-9-5Z', 'm3 13 9 5 9-5'] },
    { label: 'Method', sub: 'How we work', href: `${home}#method`, icon: ['M4 6h10', 'M4 12h16', 'M4 18h7'] },
    { label: 'Contact', sub: 'Say hello', href: '#contact', icon: ['M3 5h18v14H3Z', 'm3 7 9 6 9-6'] },
  ];
}
