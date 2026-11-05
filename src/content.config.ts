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
    /** Set to 'light' to show the white Auxilia logo, for a hero photo that is dark behind it. */
    logo: z.enum(['light']).optional(),
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
    /** `srcSmall` is an optional squarer image used below 560px wide, where the plate crops a wide image's sides. */
    plates: z.array(z.object({ src: z.string(), srcSmall: z.string().optional(), alt: z.string(), caption: z.string() })),
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
    plates: z.array(z.object({ src: z.string(), srcSmall: z.string().optional(), alt: z.string(), caption: z.string() })),
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

const caseStudy = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/case-study' }),
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

const iconPath = z.string();
const acqChip = z.object({ label: z.string(), value: z.string(), left: z.string(), top: z.string() });
const acqLanding = z.object({
  hero: z.object({ kicker: z.string(), title: z.string(), titleEmphasis: z.string(), lead: z.string() }),
  heroChips: z.object({ left: z.array(acqChip), right: z.array(acqChip) }),
  highlights: z.array(z.string()),
  features: z.object({
    title: z.string(),
    titleEmphasis: z.string(),
    intro: z.string(),
    items: z.array(
      z.object({ title: z.string(), body: z.string(), image: z.string(), chipLabel: z.string(), chipValue: z.string(), caption: z.string() }),
    ),
  }),
  trip: z.object({
    steps: z.array(
      z.object({
        no: z.string(),
        stage: z.string(),
        title: z.string(),
        icon,
        image: z.string(),
        alt: z.string(),
        capA: z.string(),
        capB: z.string(),
        capBIcon: icon,
        delay: z.string(),
        drawDelay: z.string(),
      }),
    ),
  }),
  privacy: z.object({
    tiles: z.array(z.object({ no: z.string(), icon, kind: z.string(), title: z.string(), text: z.string(), delay: z.string() })),
  }),
  /** Support topics. `shot` picks the phone screenshot shown beside the topic. */
  support: z.array(
    z.object({
      label: z.string(),
      blurb: z.string(),
      shot: z.string(),
      items: z.array(z.object({ q: z.string(), a: z.string() })),
    }),
  ),
  reviews: z.array(z.object({ tag: z.string(), text: z.string(), name: z.string(), where: z.string(), init: z.string() })),
  quotes: z.array(z.object({ text: z.string(), who: z.string(), role: z.string() })),
});
const acqPrivacy = z.object({
  intro: z.object({ title: z.string(), titleEmphasis: z.string(), lead: z.string() }),
  meta: z.array(z.object({ label: z.string(), value: z.string() })),
  /** Policy sections. Text accepts [link text](url) for links. */
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      blocks: z.array(
        z.union([
          z.object({ type: z.literal('p'), text: z.string(), variant: z.enum(['', 'spaced', 'lead']) }),
          z.object({ type: z.literal('rows'), items: z.array(z.object({ term: z.string(), text: z.string() })) }),
        ]),
      ),
    }),
  ),
  /** Contact text accepts [link text](url) for links. */
  contact: z.object({ title: z.string(), text: z.string(), button: z.string() }),
  apple: z.string(),
});
const acqShared = z.object({
  feedbackTopics: z.array(z.object({ label: z.string(), icon: iconPath })),
  menu: z.array(z.object({ label: z.string(), sub: z.string(), href: z.string(), icon: z.array(iconPath) })),
});
// Acquisti is a separate site. Its content is kept apart from the Auxilia collections.
const acquisti = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/acquisti' }),
  schema: z.union([acqLanding, acqPrivacy, acqShared]),
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

export const collections = { 'case-study': caseStudy, pages, acquisti, settings };
