export default (environment = 'development') => ({ // eslint-disable-line

  // link file UUID
  id: '0c140ac4-6d64-11e8-92d3-6c13e5c92914',

  // canonical URL of the published page
  //  get filled in by the ./configure script
  url: 'https://ig.ft.com/gb-broadband-speed-map/',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date(),

  headline: 'Broadband speed map: High-speed internet infrastructure patchy in Britain’s cities',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'The wide variation in British consumers’ access to broadband is more complicated than an urban-rural divide',

  topic: {
    name: 'UK Broadband',
    url: 'https://www.ft.com/stream/909907e7-99f8-4cda-9a10-add72bdd2a23',
  },

  relatedArticle: {
    text: '',
    url: '',
  },

  mainImage: {
    title: '',
    description: '',
    credit: '',

    // You can provide a UUID to an image and it was populate everything else
    uuid: '1a788bcc-709c-11e8-852d-d8b934ff5ffa',

    // You can also provide a URL
    // url: 'https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fc4bf0be4-7c15-11e4-a7b8-00144feabdc0?source=ig&fit=scale-down&width=700',
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Nic Fildes', url: 'https://www.ft.com/nic-fildes' },
  ],

  igByline: [
    { name: 'Alan Smith', url: 'https://www.ft.com/alan-smith' },
    { name: 'David Blood', url: 'https://www.ft.com/david-blood' },
    { name: 'Max Harlow', url: 'https://www.ft.com/max-harlow' },
    { name: 'Caroline Nevitt', url: 'https://www.ft.com/caroline-nevitt' },
    { name: 'Ændrew Rininsland', url: 'https://www.ft.com/%C3%A6ndrew-rininsland' },
  ],

  // Appears in the HTML <title>
  title: 'British broadband speed map',

  // meta data
  description: 'How is your area affected by Britain’s struggle to roll out high-speed internet infrastructure?',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary_large_image',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  socialImage: '',
  socialHeadline: '',
  socialDescription: 'Britain’s broadband speed divide: How does your postcode compare?',
  twitterCreator: '@ftdata', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  //tweetText: 'Britain’s broadband speed divide: How does your postcode compare?',
  //
  // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)
  twitterRelatedAccounts: ['ft', 'ftdata'],

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the General social options above

  // TWITTER METADATA (for Twitter cards)
  // twitterImage: '',
  twitterHeadline: 'British broadband speed map',
  twitterDescription: 'Britain’s broadband speed divide: How does your postcode compare?',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  facebookDescription: 'Britain’s broadband speed divide: How does your postcode compare?',

  // ADVERTISING
  ads: {
    // Ad unit hierarchy makes ads more granular.
    gptSite: 'ft.com',
    // Start with ft.com and /companies /markets /world as appropriate to your story
    gptZone: false,
    // granular targeting is optional and will be specified by the ads team
    dfpTargeting: false,
  },

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
