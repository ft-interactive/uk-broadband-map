import cheerio from 'cheerio';

export default async function sanitizeDoc(html) {
  const $ = cheerio.load(html);

  return $('body')
    .children()
    .map((idx, el) => $.html(el))
    .toArray()
    .filter(e => e !== '<p></p>');
}
