import cheerio from 'cheerio';

export default async function sanitizeDoc(html) {
  const $ = cheerio.load(html);

  return $('body')
    .children()
    .map((idx, el) => $.html(el)) // N.b., this is Cheerio's bizarro jQuery-esque .map()
    .toArray() // Now it's an actual Array-like.
    .filter(e => e !== '<p></p>') // Remove empty paragraphs
    .map(el => el.replace(/^<p>(.+?)<\/p>$/, '$1')); // Remove wrapping p tags
}
