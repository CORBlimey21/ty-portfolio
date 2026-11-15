import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { chapters, rubric } from '../content/portfolio.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const name = 'Cillian Ó Ríordáin';
const siteTitle = `${name} — TY Portfolio`;
const dateFormat = new Intl.DateTimeFormat('en-IE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const picture = {
  breadboard: [458, 418, 'An ink drawing of a breadboard with jumper wires, a resistor and an LED'],
  erg: [586, 393, 'An indoor rowing machine with a round flywheel'],
  cork: [496, 380, 'A folded Cork street map showing the river and a route'],
  keys: [515, 334, 'A set of ivory piano keys'],
  shield: [421, 464, 'A capsule heat shield with a tiled surface and a terracotta rim'],
  europe: [537, 411, 'A folded map of Europe with a yellow pin'],
};

const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const rubricNames = new Map(rubric);

function safeUrl(url, prefix) {
  if (/^https:\/\//i.test(url)) return escape(new URL(url).href);
  if (/^media\/[\w./%-]+$/.test(url) && !url.split('/').includes('..')) return prefix + escape(url);
  throw new Error(`Use an https URL or a file under public/media/ for ${url}`);
}

function validate() {
  const chapterIds = new Set(['entries']);
  for (const chapter of chapters) {
    if (!slugPattern.test(chapter.id) || chapterIds.has(chapter.id) || !picture[chapter.object]) {
      throw new Error(`Invalid chapter ${chapter.id}`);
    }
    chapterIds.add(chapter.id);
    const entryIds = new Set(['content', 'chapter-title', 'chapter-entries']);
    for (const entry of chapter.entries) {
      if (!slugPattern.test(entry.id) || entryIds.has(entry.id)) throw new Error(`Invalid entry ${entry.id}`);
      entryIds.add(entry.id);
      if (entry.rubric.some(tag => !rubricNames.has(tag))) throw new Error(`Unknown rubric tag in ${entry.id}`);
      if (entry.date && (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date) ||
        new Date(entry.date).toISOString().slice(0, 10) !== entry.date)) {
        throw new Error(`Invalid entry date in ${entry.id}`);
      }
    }
  }
}

function img(object, prefix, decorative = false, eager = true) {
  const [width, height, alt] = picture[object];
  return `<img src="${prefix}assets/${object}-ink.webp" width="${width}" height="${height}" alt="${decorative ? '' : alt}"${eager ? '' : ' loading="lazy"'} draggable="false">`;
}

function date(entry) {
  return `<time datetime="${entry.date}">${dateFormat.format(new Date(entry.date))}</time>`;
}

function textParagraphs(value) {
  return value.trim().split(/\n\s*\n/).map(paragraph => `<p>${escape(paragraph)}</p>`).join('');
}

function artefact(item, prefix) {
  const url = safeUrl(item.url, prefix);
  const caption = escape(item.caption);
  switch (item.type) {
    case 'image': {
      const dimensions = item.width && item.height
        ? ` width="${escape(item.width)}" height="${escape(item.height)}"`
        : '';
      return `<figure><img src="${url}" alt="${escape(item.alt)}"${dimensions} loading="lazy" decoding="async">
        <figcaption>${caption} <a href="${url}">View full image</a></figcaption></figure>`;
    }
    case 'video':
      return `<figure><video controls playsinline preload="metadata" aria-label="${caption}" src="${url}">${caption}</video><figcaption><a href="${url}">${caption}</a></figcaption></figure>`;
    case 'link':
      return `<p><a class="text-link" href="${url}">${caption} <span aria-hidden="true">↗</span></a></p>`;
    default:
      throw new Error(`Unsupported artefact type ${item.type}`);
  }
}

function masthead(prefix, page) {
  const home = page === 'home';
  return `<header class="masthead shell">
    <a class="identity" href="${home ? './' : '../?intro=skip'}"${home ? ' aria-current="page"' : ''}>
      <span class="identity-mark" aria-hidden="true">${home ? 'CR' : '←'}</span>
      <span>${home ? name : 'Back to objects'}</span>
    </a>
    <nav aria-label="Portfolio"><a class="index-link" href="${prefix}entries/"${page === 'entries' ? ' aria-current="page"' : ''}><span class="index-mark" aria-hidden="true">☷</span> All entries <span aria-hidden="true">↗</span></a></nav>
  </header>`;
}

function footer() {
  return `<footer class="site-footer shell"><span>${name}</span><span>Transition Year portfolio</span></footer>`;
}

function page({ title, description, body, theme, prefix = '../', head = '', script = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(description)}">
  <title>${escape(title)}</title>
  <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
  ${head}
  <link rel="stylesheet" href="${prefix}assets/site.css">
  ${script}
</head>
<body class="${theme}">
${body}
</body>
</html>\n`;
}

function homepage() {
  // Set the first paint before CSS, while keeping the static page available without scripting.
  const head = `<script>
    (() => {
      const query = new URLSearchParams(location.search);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || location.hash || query.get('intro') === 'skip') return;
      try { if (query.get('intro') !== 'replay' && sessionStorage.getItem('ty-paper-intro-seen')) return; } catch {}
      document.documentElement.dataset.intro = 'pending';
      document.addEventListener('click', event => {
        if (document.documentElement.dataset.intro !== 'pending' || !event.target.closest?.('#skip-intro')) return;
        delete document.documentElement.dataset.intro;
        try { sessionStorage.setItem('ty-paper-intro-seen', '1'); } catch {}
        document.querySelector('#content').focus({ preventScroll: true });
      }, { capture: true });
      window.setTimeout(() => {
        if (document.documentElement.dataset.intro === 'pending') delete document.documentElement.dataset.intro;
      }, 1600);
    })();
  </script>`;
  const cards = chapters.map(chapter => `<li class="object-tile tile-${chapter.object}">
    <a href="./${chapter.id}/" class="object-link" data-object="${chapter.object}">
      <div class="object-art">${img(chapter.object, './', true)}</div>
      <div class="object-label">
        <div><h2>${escape(chapter.title)}</h2><p>${escape(chapter.subtitle)}</p></div>
        <span class="object-arrow" aria-hidden="true">↗</span>
      </div>
    </a>
  </li>`).join('\n');
  return page({
    title: siteTitle,
    description: 'My Transition Year portfolio, organised around six objects.',
    prefix: './',
    theme: 'home',
    head,
    script: '<script type="module" src="./assets/home.js"></script>',
    body: `<div id="portfolio">
      <a class="skip-content" href="#content">Skip to chapters</a>
      ${masthead('./', 'home')}
      <main id="content" class="shell" tabindex="-1">
        <div class="home-heading">
          <div><p class="eyebrow">Cillian Ó Ríordáin</p><h1>TY Portfolio<span>.</span></h1></div>
          <p class="home-instruction">Pick an object to open its chapter<span aria-hidden="true">↓</span></p>
        </div>
        <ul class="object-grid" aria-label="Chapters">${cards}</ul>
      </main>
      ${footer()}
    </div>
    <div id="opening" aria-label="Portfolio opening">
      <div class="intro-paper" aria-hidden="true"></div>
      <button type="button" id="skip-intro">Skip intro <span aria-hidden="true">↗</span></button>
      <div class="intro-origin" aria-hidden="true">
        <div class="intro-wordmark">
          <div class="intro-title">${name} <span>— TY Portfolio</span></div>
          <svg class="intro-line" viewBox="0 0 700 12" preserveAspectRatio="none" focusable="false">
            <path class="intro-line-left" pathLength="1" d="M350 6 C281 6 222 7.1 155 6.3 S60 5.5 2 7.5"/>
            <path class="intro-line-right" pathLength="1" d="M350 6 C425 4.8 470 7.6 536 6.2 S641 5.1 697 6.9"/>
            <path class="intro-mark" d="M341 6.1 Q350 5.1 361 6"/>
          </svg>
        </div>
      </div>
    </div>
    <div id="chapter-transition" aria-hidden="true" hidden></div>
    <template id="circuit-transition">${circuit}</template>`,
  });
}

const circuit = await readFile(new URL('scripts/circuit.svg', root), 'utf8');

function chapterPage(chapter) {
  const { object, title, lines, subtitle, intro, entries, link } = chapter;
  const prefix = '../';
  const heroArt = object === 'breadboard'
    ? `<figure class="chapter-illustration circuit-figure">
        ${circuit}
        <figcaption>Illustration of an LED circuit</figcaption>
      </figure>`
    : `<figure class="chapter-illustration">${img(object, prefix)}</figure>`;

  const entryMarkup = entries.map(entry => {
    const reflection = entry.reflection ?? entry.reflectionText;
    return `<article class="entry" id="${entry.id}">
      <header class="entry-heading">
        ${entry.date ? `<p class="eyebrow">${date(entry)}</p>` : ''}
        <h3>${escape(entry.title)}</h3>
      </header>
      <div class="entry-content">
        ${entry.body ? textParagraphs(entry.body) : ''}
        <div class="entry-evidence">
          <h4>Evidence</h4>
          ${(entry.artefacts ?? []).map(item => artefact(item, prefix)).join('')}
          ${entry.evidence ? `<p class="placeholder">${escape(entry.evidence)}</p>` : ''}
        </div>
        <div class="entry-reflection">
          <h4>Reflection</h4>
          ${reflection ? textParagraphs(reflection) : '<p class="placeholder">Add my reflection.</p>'}
        </div>
      </div>
    </article>`;
  }).join('\n');
  return page({
    title: `${title} · ${siteTitle}`,
    description: subtitle,
    theme: `chapter chapter-${object}`,
    body: `<a class="skip-content" href="#content">Skip to chapter</a>
      ${masthead(prefix, 'chapter')}
      <main id="content" class="shell" tabindex="-1">
        <header class="chapter-hero" aria-labelledby="chapter-title">
          <div class="chapter-copy">
            <p class="eyebrow">${escape(subtitle)}</p>
            <h1 id="chapter-title">${lines.map(escape).join('<br class="chapter-break"> ')}</h1>
            <p class="chapter-intro">${escape(intro)}</p>
            ${link ? `<a class="project-link" href="${safeUrl(link.url, prefix)}">${escape(link.label)} <span aria-hidden="true">↗</span></a>` : ''}
          </div>
          ${heroArt}
        </header>
        ${chapter.artefacts?.length ? `<div class="chapter-artefacts">${chapter.artefacts.map(item => artefact(item, prefix)).join('')}</div>` : ''}
        <section class="chapter-entries" aria-labelledby="chapter-entries">
          <div class="entry-directory">
            <h2 id="chapter-entries">Chapter entries</h2>
            <nav aria-labelledby="chapter-entries"><ul>
            ${entries.map(entry => `<li><a href="#${entry.id}">${escape(entry.title)}</a></li>`).join('')}
            </ul></nav>
          </div>
          <div class="entry-list">${entryMarkup}</div>
        </section>
        <a class="end-back" href="../?intro=skip">← Back to objects</a>
      </main>
      ${footer()}`,
  });
}

function entriesPage() {
  const all = chapters.flatMap(chapter => chapter.entries.map(entry => ({ ...entry, chapter })));
  const byDate = all.filter(entry => entry.date).sort((first, second) => second.date.localeCompare(first.date));
  const pending = all.filter(entry => !entry.date);
  const indexLabel = byDate.length ? 'Chronological' : 'Entries';
  const list = entries => `<ul class="index-list">
    ${entries.map(entry => `<li><a href="../${entry.chapter.id}/#${entry.id}">
      <span><strong>${escape(entry.title)}</strong><small>${escape(entry.chapter.title)}</small></span>
      ${entry.date ? `<span class="entry-date">${date(entry)}</span>` : '<span aria-hidden="true">↗</span>'}
    </a></li>`).join('')}
  </ul>`;
  return page({
    title: `All entries · ${siteTitle}`,
    description: 'Browse my Transition Year portfolio entries by date or by CBC’s Transition Year dimensions.',
    theme: 'entries-page',
    body: `<a class="skip-content" href="#content">Skip to entries</a>
      ${masthead('../', 'entries')}
      <main class="shell" id="content" tabindex="-1">
        <header class="index-heading">
          <p class="eyebrow">TY Portfolio</p>
          <h1>All entries<span>.</span></h1>
          <nav aria-label="Index views"><a href="#chronology">${indexLabel} ↓</a><a href="#school-rubric">By TY dimension ↓</a></nav>
        </header>
        <div class="index-columns">
          <section aria-labelledby="chronology">
            <h2 id="chronology">${indexLabel}</h2>
            ${list([...byDate, ...pending])}
          </section>
          <section aria-labelledby="school-rubric">
            <h2 id="school-rubric">By TY dimension</h2>
            <p class="index-source">Based on <a href="https://www.cbccork.ie/copy-of-senior-cycle">CBC’s published Transition Year dimensions</a>.</p>
            ${rubric.map(([key, label]) => `<section class="rubric-group"><h3>${escape(label)}</h3>${list(all.filter(entry => entry.rubric.includes(key)))}</section>`).join('')}
          </section>
        </div>
      </main>
      ${footer()}`,
  });
}

async function writePage(path, html) {
  await mkdir(new URL(path, dist), { recursive: true });
  await writeFile(new URL(`${path}index.html`, dist), html);
}

validate();
await rm(dist, { recursive: true, force: true });
await cp(new URL('public/', root), dist, { recursive: true });
await writeFile(new URL('.nojekyll', dist), '');
await Promise.all([
  writePage('', homepage()),
  writePage('entries/', entriesPage()),
  ...chapters.map(chapter => writePage(`${chapter.id}/`, chapterPage(chapter))),
]);
console.log(`Built ${chapters.length} chapters, homepage and index in dist/.`);
