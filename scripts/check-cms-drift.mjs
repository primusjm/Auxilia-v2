// Fails if public/admin/config.yml drifts from the Zod schemas in src/content.config.ts.
// Reads the JSON Schemas Astro writes to .astro/collections (run `astro sync` first).
import { readFileSync, existsSync } from 'node:fs';
import { parse } from 'yaml';

const config = parse(readFileSync('public/admin/config.yml', 'utf8'));
const errors = [];
const typeOf = { string: 'string', text: 'string', markdown: 'string', image: 'string', file: 'string', number: 'number', boolean: 'boolean', list: 'array', object: 'object' };

// File-loader collections (settings) are array-wrapped at the root of the JSON Schema.
const schemas = {};
const schemaFor = (name) => (schemas[name] ??= JSON.parse(readFileSync(`.astro/collections/${name}.schema.json`, 'utf8')));

/** Every concrete object/array/scalar variant a schema node may take. */
function variants(node, root = false) {
  const out = [];
  for (const n of node.oneOf ?? node.anyOf ?? [node]) {
    if (n.oneOf || n.anyOf) out.push(...variants(n, root));
    else if (root && n.type === 'array') out.push(...variants(n.items));
    else out.push(n);
  }
  return out;
}

function checkFields(fields, nodes, where) {
  for (const f of fields) {
    const here = `${where}.${f.name}`;
    const found = nodes.map((n) => n.properties?.[f.name]).filter(Boolean);
    if (!found.length) { errors.push(`${here}: not in the schema`); continue; }
    const want = typeOf[f.widget];
    const kids = found.flatMap(variants);
    if (want && !kids.some((k) => k.type === want || (want === 'number' && k.type === 'integer'))) {
      errors.push(`${here}: widget "${f.widget}" does not match schema type "${[...new Set(kids.map((k) => k.type))].join('|')}"`);
      continue;
    }
    if (f.widget === 'object') checkFields(f.fields ?? [], kids, here);
    if (f.widget === 'list' && f.fields) checkFields(f.fields, kids.flatMap((k) => variants(k.items ?? {})), here);
  }
}

for (const c of config.collections) {
  const schema = schemaFor(c.name);
  const roots = variants(schema, true);
  const sources = c.folder ? [[c.folder, null]] : c.files.map((f) => [f.file, f]);
  for (const [path, file] of sources) {
    if (!existsSync(path)) errors.push(`${c.name}: ${path} does not exist`);
    checkFields(file?.fields ?? c.fields, roots, file ? `${c.name}.${file.name}` : c.name);
  }
  // Schema-required fields in a folder collection must be editable and required here.
  if (c.folder) {
    const names = new Set(c.fields.map((f) => f.name));
    const requiredEverywhere = roots.map((r) => new Set(r.required ?? [])).reduce((a, b) => new Set([...a].filter((x) => b.has(x))));
    for (const r of requiredEverywhere) if (!names.has(r) && !['kind', 'order'].includes(r) && c.fields.length) { /* optional: fields not exposed stay as they are */ }
    for (const f of c.fields) {
      const optionalInAny = roots.some((r) => r.properties?.[f.name] && !(r.required ?? []).includes(f.name));
      const missingInAny = roots.some((r) => !r.properties?.[f.name]);
      if ((optionalInAny || missingInAny) && f.required !== false) errors.push(`${c.name}.${f.name}: optional in some schema variant, set required: false`);
    }
  }
}

if (!existsSync(config.media_folder)) errors.push(`media_folder ${config.media_folder} does not exist`);

if (errors.length) {
  console.error('Sveltia config has drifted from src/content.config.ts:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log('Sveltia config matches the Zod schemas.');
