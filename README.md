# Cillian Ó Ríordáin — TY Portfolio

A static Transition Year portfolio. The build creates the object homepage, six chapter pages and the All entries index. Node 20 or later is sufficient.

## Run locally

```sh
npm run dev
```

Open http://127.0.0.1:4173/. After editing, run `npm run build` again and reload the page. To try the production files under a GitHub Pages project path, use:

```sh
npm run build
npm run preview -- --base /TY_Portfolio/ --port 4174
```

The opening plays once per tab session. Add `?intro=replay` to the homepage URL to play it again. Chapter return links open the settled homepage. Reduced motion skips the opening and object animations.

## Add work

Edit [content/portfolio.mjs](content/portfolio.mjs). Each entry lives in its chapter’s `entries` array. The build links each entry from the chapter and index.

```js
{
  id: 'led-test',
  title: 'Testing the LED',
  date: '2026-11-13',
  rubric: ['learner', 'career'],
  body: 'What I did, in my own words.',
  artefacts: [
    { type: 'image', url: 'media/led-test.webp', alt: 'Describe what the photo shows', caption: 'My circuit on the bench' },
  ],
  reflection: 'What changed my mind, what I learned or what I’d try next.',
},
```

- Use a unique entry ID within its chapter. Keep the ID when revising the title so old links still work.
- Leave out `date` when you do not know it. The index lists dated entries newest first, followed by entries without date labels.
- Add your photos, PDFs and clips under `public/media/`. Artefacts can use `image`, `video` or `link`. Use a `link` for a PDF or an external video. Supply an `alt` description for images and a `caption` for every artefact.
- Remove an `evidence` prompt once you’ve added the artefact. The `intro` and `reflection` fields contain the author’s copy. Blank lines in `body` and `reflection` create paragraphs.
- The index uses the [four dimensions published by CBC Cork](https://www.cbccork.ie/copy-of-senior-cycle). Change the `rubric` list and entry tags in the same file if the assessment sheet supplies different headings.

A chapter’s `id` is its directory URL, so keep it stable. Its title, subtitle, intro, entries and optional featured link are editable in the same file. The homepage and chapter illustrations live in `public/assets/`. Chapter styling lives in `public/assets/site.css` and motion in `public/assets/home.js`.

The six `*-ink.webp` illustrations in `public/assets/` came from the built-in ImageGen tool. The prompt asked to redraw the existing objects as pen-and-ink notebook illustrations with blue-black outlines, fine cross-hatching, ivory paper and sparse spot colour, using the ink breadboard sketch as the style reference. The opening reveals each object through animated strokes while it is in flight.

## GitHub Pages

The build output is `dist/`. The included [Pages workflow](.github/workflows/pages.yml) builds and deploys that directory on manual dispatch. After adding this project to the intended GitHub repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**, then run **Deploy TY portfolio to GitHub Pages** from the Actions tab. All internal paths are relative, including the direct chapter and entry links.
