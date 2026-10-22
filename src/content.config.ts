import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/** Icon keys point at entries in src/data/icons.json. */
const icon = z.string().regex(/^ic[0-9a-z]+$/);
/** Inline markup: **emphasis**, ==highlight==, newline for a desktop-only line break. */
const rich = z.string();
const image = z.string().startsWith('/');

const head = {
  tab: z.string(),
  title: rich,
  icon,
  intro: rich,
};
const avatar = z.union([z.object({ icon }), z.object({ initials: z.string() })]);

const record = z.object({
  kind: z.literal('record'),
  /** Position in the record, 1 to 10. Drives numbering, related cards and the homepage list. */
  order: z.number().int().positive(),
  title: z.string(),
  client: z.string(),
  sector: z.string(),
  year: z.string(),
  stat: z.string(),
  statLabel: z.string(),
  /** The record card image. Also the hero image and the related-card image. */
  cardImage: image,
  formSubject: z.string(),
  menu: z.array(z.object({ label: z.string(), sub: z.string(), id: z.string(), icon: z.array(z.string()) })),
  hero: z.object({
    eyebrow: z.string(),
    title: rich,
    lead: rich,
    facts: z.array(z.object({ icon, label: z.string(), value: rich })),
  }),
  sections: z.array(z.string()),
  mandate: z.object({ ...head, note: z.string(), cards: z.array(z.object({ icon, label: z.string(), text: rich })) }),
  found: z.object({
    ...head,
    note: z.string(),
    image: z.object({ src: image, alt: z.string() }),
    people: z.array(z.object({ icon, title: z.string(), text: rich })),
  }),
  decisions: z.object({
    ...head,
    note: z.string(),
    items: z.array(z.object({ icon, title: z.string(), text: rich, onSiteLabel: z.string(), onSite: rich })),
  }),
  logo: z
    .object({
      ...head,
      note: z.string(),
      beforeAfter: z.array(z.object({ src: z.string(), alt: z.string(), caption: rich })),
      cards: z.array(z.object({ label: z.string(), text: rich })),
      system: z.object({ src: z.string(), alt: z.string(), caption: rich }),
    })
    .optional(),
  screens: z.object({
    ...head,
    link: z.object({ href: z.string().url(), text: z.string(), underline: z.boolean().optional() }),
    plates: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string() })),
  }),
  build: z.object({ ...head, note: z.string(), cards: z.array(z.object({ icon, label: z.string(), text: rich })) }),
  results: z.object({
    ...head,
    note: z.string(),
    stats: z.array(z.object({ value: z.string(), text: rich })),
    quote: z.object({ text: rich, name: z.string(), role: z.string(), tag: z.string(), avatar }).optional(),
    quotes: z.array(z.object({ text: rich, name: z.string(), role: z.string(), avatar })).optional(),
  }),
});

const block = z.discriminatedUnion('type', [
  z.object({ type: z.literal('plate'), src: z.string(), alt: z.string() }),
  z.object({
    type: z.literal('head'),
    kicker: z.string(),
    title: rich,
    icon,
    intro: rich,
    links: z.array(z.object({ href: z.string().url(), text: z.string() })).optional(),
  }),
  z.object({ type: z.literal('cards'), variant: z.enum(['mandate', 'flat']), items: z.array(z.object({ icon, label: z.string(), text: rich })) }),
  z.object({
    type: z.literal('decisions'),
    items: z.array(z.object({ icon, title: z.string(), text: rich, onSiteLabel: z.string(), onSite: rich })),
  }),
  z.object({
    type: z.literal('band'),
    kind: z.enum(['timeline', 'stats']),
    title: z.string(),
    note: z.string(),
    /** Timeline only: the column count the design sets (4 or 3), or empty for the default. */
    cols: z.string().optional(),
    steps: z.array(z.object({ no: z.string(), title: z.string(), text: rich })).optional(),
    items: z.array(z.object({ value: z.string(), text: rich })).optional(),
  }),
  z.object({ type: z.literal('stats'), label: z.string(), items: z.array(z.object({ value: z.string(), text: rich })) }),
  z.object({
    type: z.literal('screens'),
    label: z.string(),
    plates: z.array(z.object({ src: z.string(), alt: z.string(), caption: z.string() })),
  }),
]);

const appendix = z.object({
  kind: z.literal('appendix'),
  /** Position among the appendix studies, 1 to 3. */
  order: z.number().int().positive(),
  title: z.string(),
  client: z.string(),
  cardImage: image,
  formSubject: z.string(),
  menu: z.array(z.object({ label: z.string(), sub: z.string(), id: z.string(), icon: z.array(z.string()), tab: z.number().int().optional() })),
  hero: z.object({ image, eyebrow: z.string(), title: rich, lead: rich }),
  tablistLabel: z.string(),
  projects: z.array(
    z.object({
      id: z.string(),
      num: z.string(),
      name: z.string(),
      type: z.string(),
      icon: z.array(z.string()),
      blocks: z.array(block),
    }),
  ),
  thread: z.object({
    ...head,
    note: z.string().optional(),
    cards: z.array(z.object({ icon, label: z.string(), text: rich })),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.discriminatedUnion('kind', [record, appendix]),
});

const homeHead = { tab: z.string(), title: rich, icon, intro: rich, note: z.string() };
const pages = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/pages' }),
  schema: z.object({
    hero: z.object({
      title: rich,
      lead: rich,
      primaryCta: z.string(),
      secondaryCta: z.string(),
      caseStudyLabel: z.string(),
      /** Slugs of the studies shown in the proof slideshow, in order. */
      slides: z.array(z.string()),
    }),
    marquee: z.object({ topics: z.array(z.string()), services: z.array(z.string()), servicesLabel: z.string() }),
    stats: z.array(z.object({ icon, value: z.number(), prefix: z.string(), suffix: z.string(), label: z.string(), client: z.string() })),
    record: z.object(homeHead),
    trusted: z.object({
      eyebrow: z.string(),
      title: rich,
      stats: z.array(z.object({ value: z.string(), icon, iconStyle: z.enum(['brand', 'paper']), text: z.string(), srPrefix: z.string() })),
      clients: z.array(z.object({ name: z.string(), href: z.string(), external: z.boolean() })),
      featuredLabel: z.string(),
      featuredGo: z.string(),
    }),
    constraints: z.object({ ...homeHead, tiles: z.array(z.object({ image, alt: z.string(), icon, title: z.string(), text: z.string() })) }),
    capability: z.object({ ...homeHead, steps: z.array(z.object({ icon, kicker: z.string(), title: z.string(), text: z.string() })) }),
    method: z.object({
      ...homeHead,
      phases: z.array(
        z.object({
          icon,
          label: z.string(),
          time: z.string(),
          title: z.string(),
          text: z.string(),
          bullets: z.array(z.string()),
          leave: z.string(),
          yourTimeLabel: z.string(),
          yourTime: z.string(),
        }),
      ),
      closing: z.string(),
    }),
  }),
});

const settings = defineCollection({
  loader: file('./src/content/settings/site.json', { parser: (text) => [{ id: 'site', ...JSON.parse(text) }] }),
  schema: z.object({
    email: z.string().email(),
    copyright: z.string(),
    footerNav: z.array(z.object({ label: z.string(), href: z.string() })),
    quotes: z.array(z.object({ text: z.string(), who: z.string(), role: z.string() })),
  }),
});

export const collections = { work, pages, settings };
