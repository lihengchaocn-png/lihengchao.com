# Bundled browser libraries

These files are copied from the official npm packages and served from this site, without a runtime CDN dependency:

| Package | Version | File | Upstream |
| --- | --- | --- | --- |
| marked | 18.0.14 | `marked.umd.js` | https://marked.js.org/ |
| dompurify | 3.4.16 | `purify.min.js` | https://github.com/cure53/DOMPurify |
| js-yaml | 5.4.2 | `js-yaml.umd.min.js` | https://github.com/nodeca/js-yaml |

Original licenses are included next to the bundles. Markdown output is sanitized before insertion, following Marked's documented guidance.

To update, use `npm pack <package>@<version> --ignore-scripts`, copy the corresponding browser bundle and license from the archive, update this table, then run `node --test tests/content.test.cjs` and check a note and résumé in the browser. No npm install or build step is needed for normal content edits or deployment.
