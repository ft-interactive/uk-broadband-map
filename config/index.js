import structuredGoogleDoc from 'structured-google-docs-client';
import sanitise from './sanitise';
import article from './article';
import getFlags from './flags';
import getOnwardJourney from './onward-journey';

if (process.env.NODE_ENV !== 'production') require('dotenv').config(); // eslint-disable-line

export default async (environment = 'development') => {
  const copy = await sanitise(await structuredGoogleDoc(process.env.DOC_KEY));
  const d = await article(environment);
  const flags = await getFlags(environment);
  const onwardJourney = await getOnwardJourney(environment);
  const mapboxToken = process.env.MAPBOX_TOKEN || '';
  /*
  An experimental demo that gets content from the API
  and overwrites some model values. This requires the Link File
  to have been published. Also next-es-interface.ft.com probably
  isn't a reliable source. Also this has no way to prevent development
  values being seen in productions... use with care.

  try {
    const a = (await axios(`https://next-es-interface.ft.com/content/${d.id}`)).data;
    d.headline = a.title;
    d.byline = a.byline;
    d.summary = a.summaries[0];
    d.title = d.title || a.title;
    d.description = d.description || a.summaries[1] || a.summaries[0];
    d.publishedDate = new Date(a.publishedDate);
    f.comments = a.comments;
  } catch (e) {
    console.log('Error getting content from content API');
  }

  */

  return {
    ...d,
    flags,
    onwardJourney,
    mapboxToken,
    copy: copy.map((par, idx) => ({ id: idx, content: par })),
  };
};
