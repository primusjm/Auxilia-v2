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

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.discriminatedUnion('kind', [record]),
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

export const collections = { work, settings };
