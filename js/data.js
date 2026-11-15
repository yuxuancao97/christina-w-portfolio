/* ─────────────────────────────────────────────────────────────
   ALL PORTFOLIO CONTENT LIVES IN THIS FILE.

   The page follows Christina's CV: one chapter per role, newest
   first, and inside each chapter one group per kind of work.

   Profile and chapter text come from the CV. Her birth date, height
   and legal name are left out on purpose. The email is a placeholder.
   Every piece is still a generated placeholder.

   Adding the real work
   • A piece in a 'rows' or 'tiles' group:
       { label: 'Booth backdrop', ratio: [3, 1], image: 'images/…jpg' }
     `ratio` is the image's [width, height]. 'tiles' are portrait.
   • A product page in a 'pages' group:
       { title: '…', brand: '…', marketplace: 'A+ content', year: '…',
         summary: '…', modules: ['images/aplus/x/01.jpg', …] }
     one image per content module, top to bottom.
     Optional: role: '…', result: '…'

   Placeholders are drawn from `art: [style, palette]`.
     styles:   orb · arcs · dots · glyph · bands · blocks · rays · lines
     palettes: paper · cobalt · forest · rose · noir · lilac · tang ·
               sand · mint · oxblood · sky · butter
   ───────────────────────────────────────────────────────────── */

/* Sample product pages: the artwork and the copy inside it are generated. */
const SAMPLE_PAGES = [
  {
    title: 'Product page 01',
    brand: 'Amazon store',
    category: 'Sample layout',
    marketplace: 'A+ content',
    year: '2020/21',
    summary: 'Product imagery and text for an Amazon listing.',
    product: 'bottle', palette: 'apricot', style: 'arcs',
    copy: {
      headline: 'Glow that gets up early.',
      sub: '15% vitamin C serum with ferulic acid, for brighter skin in four weeks.',
      badge: 'New formula',
      features: [
        ['Brightens', 'Fades dullness and evens out skin tone.'],
        ['Protects', 'Antioxidants shield skin from daily stress.'],
        ['Absorbs fast', 'Light texture, no sticky finish under SPF.']
      ],
      story: { head: 'Made in small batches.', body: 'Vitamin C loses strength once it meets air. We bottle weekly in amber glass so every drop arrives as potent as the day it was made.' },
      statement: 'Good skin is a morning habit.',
      compare: {
        title: 'Find your serum',
        cols: ['Glow C', 'Calm B5', 'Night A'],
        rows: [['Brightening', 1, 0, 1], ['Sensitive skin', 1, 1, 0], ['Daily use', 1, 1, 0], ['Fragrance free', 1, 1, 1]]
      },
      steps: [['Cleanse', 'Start with a clean, dry face.'], ['Apply', 'Press three drops into skin.'], ['Protect', 'Follow with moisturiser and SPF.']]
    }
  },
  {
    title: 'Product page 02',
    brand: 'Amazon store',
    category: 'Sample layout',
    marketplace: 'A+ content',
    year: '2020/21',
    summary: 'Product imagery and text for an Amazon listing.',
    product: 'jar', palette: 'matcha', style: 'orb',
    copy: {
      headline: 'A calmer kind of energy.',
      sub: 'First-harvest ceremonial matcha, stone-ground in small lots in Uji.',
      badge: 'First harvest',
      features: [
        ['Shade grown', 'Three weeks under cover for a sweeter leaf.'],
        ['Stone ground', 'Milled slowly to keep colour and aroma.'],
        ['Nothing added', 'One ingredient. No sugar, no fillers.']
      ],
      story: { head: 'From one family farm.', body: 'We buy the whole spring harvest from a single grower, which means we can tell you the field, the week and the hands that picked your tin.' },
      statement: 'Whisk. Breathe. Begin.',
      compare: {
        title: 'Choose your grade',
        cols: ['Ceremonial', 'Daily', 'Culinary'],
        rows: [['Drink straight', 1, 1, 0], ['Lattes', 1, 1, 1], ['Baking', 0, 0, 1], ['First harvest', 1, 0, 0]]
      },
      stepsTitle: 'How to prepare',
      steps: [['Sift', 'One teaspoon through a fine sieve.'], ['Whisk', 'Add 70 ml hot water and whisk in a W.'], ['Enjoy', 'Drink straight or top with milk.']]
    }
  },
  {
    title: 'Product page 03',
    brand: 'Amazon store',
    category: 'Sample layout',
    marketplace: 'A+ content',
    year: '2020/21',
    summary: 'Product imagery and text for an Amazon listing.',
    product: 'can', palette: 'glacier', style: 'lines',
    copy: {
      headline: 'Cold for 24. Hot for 12.',
      sub: 'Double-wall steel flask built for long days out and the commute back.',
      badge: '750 ml',
      features: [
        ['Leakproof', 'A quarter-turn lid that stays shut in a bag.'],
        ['Fits holders', 'Slim base sits in car and bike cages.'],
        ['Built to last', 'Powder coat that shrugs off scuffs.']
      ],
      story: { head: 'Tested north of the circle.', body: 'Every flask is filled, frozen and dropped before it ships. If it survives a winter in Tromsø, it will survive your desk.' },
      statement: 'Take the long way home.',
      compare: {
        title: 'Pick your size',
        cols: ['Trail 750', 'City 500', 'Summit 1L'],
        rows: [['Cup holder fit', 1, 1, 0], ['24 h cold', 1, 0, 1], ['Carry loop', 1, 0, 1], ['Dishwasher safe', 1, 1, 1]]
      },
      stepsTitle: 'Care',
      steps: [['Rinse', 'Warm water before first use.'], ['Fill', 'Leave a finger of space below the rim.'], ['Seal', 'Quarter turn until it clicks.']]
    }
  },
  {
    title: 'Product page 04',
    brand: 'Amazon store',
    category: 'Sample layout',
    marketplace: 'A+ content',
    year: '2020/21',
    summary: 'Product imagery and text for an Amazon listing.',
    product: 'pouch', palette: 'roast', style: 'dots',
    copy: {
      headline: 'Roasted Monday. Yours by Friday.',
      sub: 'A sweet, round house blend with notes of cocoa, hazelnut and orange peel.',
      badge: 'Whole bean',
      features: [
        ['Roast to order', 'Nothing sits on a shelf for months.'],
        ['Traceable', 'Two farms, named on every bag.'],
        ['Any brewer', 'Forgiving in espresso, filter or press.']
      ],
      story: { head: 'Paid fairly, roasted lightly.', body: 'We pay growers well above market price and roast just far enough to let their work speak. The result is a cup that tastes like where it came from.' },
      statement: 'First light, first cup.',
      compare: {
        title: 'Explore the roasts',
        cols: ['House', 'Bright', 'Dark'],
        rows: [['Espresso', 1, 0, 1], ['Filter', 1, 1, 0], ['With milk', 1, 0, 1], ['Fruity notes', 0, 1, 0]]
      },
      stepsTitle: 'Brew guide',
      steps: [['Grind', 'Medium-fine, right before brewing.'], ['Bloom', 'Wet the grounds and wait 30 seconds.'], ['Pour', 'Slow circles until you reach 250 ml.']]
    }
  }
];

window.PORTFOLIO = {
  profile: {
    name: 'Christina W',
    role: 'Visual designer',
    span: '2020 - 2025 Portfolio',
    email: 'hello@example.com',
    socials: [],
    /* Handwritten lines. Sample wording: replace with her own. */
    cover: 'Christina W',
    hello: 'Hello, I design brand visuals, Amazon store content, packaging & posters.',
    bio: 'I have a degree in Visual Communication Design. Since 2020 I have worked in-house for brands in automotive electronics, fitness and cross-border e-commerce.',
    /* Resume rows: [left, right]. Experience is filled in from `work` below. */
    education: [
      ['2014.09 - 2018.06', 'Jincheng College, BA Visual Communication Design'],
      ['2014 - 2018', 'Scholarship in each of the four years']
    ],
    skills: [
      ['Ps', 'Photoshop'],
      ['Ai', 'Illustrator'],
      ['Design', 'Visual identity, layout, typeface, packaging'],
      ['Also', 'Advertising, photography']
    ],
    certificates: [
      ['CET-6', 'College English Test, Band 6'],
      ['CET-4', 'College English Test, Band 4']
    ]
  },

  work: [
    {
      id: 'kunyi',
      title: 'Kunyi Electronic Technology',
      industry: 'Automotive electronics',
      role: 'Graphic Designer',
      years: '2023.04 - 2025.01', short: '2023/25', mark: 'Kunyi',
      summary: 'Overall responsibility for the brand’s visual design and presentation, in print, online and at domestic and international exhibitions.',
      groups: [
        {
          title: 'Exhibitions & workshops', layout: 'rows', art: ['rays', 'cobalt'],
          items: [
            { label: 'Booth backdrop', ratio: [3, 1] },
            { label: 'Roll-up banner', ratio: [2, 5] },
            { label: 'Exhibition poster', ratio: [5, 7] },
            { label: 'Workshop poster', ratio: [5, 7] },
            { label: 'Screen graphic', ratio: [16, 9] }
          ]
        },
        {
          title: 'Product brochures', layout: 'rows', art: ['blocks', 'paper'],
          items: [
            { label: 'Brochure cover', ratio: [5, 7] },
            { label: 'Brochure spread', ratio: [10, 7] },
            { label: 'Brochure spread', ratio: [10, 7] }
          ]
        },
        {
          title: 'Website & WeChat official account', layout: 'rows', art: ['bands', 'sky'],
          items: [
            { label: 'Website banner', ratio: [16, 9] },
            { label: 'WeChat visual', ratio: [1, 1] },
            { label: 'WeChat visual', ratio: [4, 5] },
            { label: 'Website banner', ratio: [3, 1] }
          ]
        },
        {
          title: 'Culture wall', layout: 'rows', art: ['lines', 'sand'],
          items: [
            { label: 'Culture wall', ratio: [4, 1] },
            { label: 'Wall detail', ratio: [16, 9] }
          ]
        }
      ]
    },
    {
      id: 'shuhua',
      title: 'Shuhua Sports',
      industry: 'Fitness',
      role: 'Graphic Designer',
      years: '2022.01 - 2023.04', short: '2022/23', mark: 'Shuhua',
      summary: 'Independently produced the commercial visual design for the Shuhua Fitness sub-brand and its directly operated locations, from sampling and proofs to final production.',
      groups: [
        {
          title: 'Visual identity', layout: 'rows', art: ['orb', 'tang'],
          items: [
            { label: 'Logo', ratio: [1, 1] },
            { label: 'Colour and type', ratio: [16, 9] },
            { label: 'Brand applications', ratio: [16, 9] }
          ]
        },
        {
          title: 'Lightbox posters', layout: 'tiles',
          items: [
            { title: 'Lightbox poster 01', art: ['orb', 'cobalt'] },
            { title: 'Lightbox poster 02', art: ['glyph', 'noir'] },
            { title: 'Lightbox poster 03', art: ['arcs', 'butter'] },
            { title: 'Lightbox poster 04', art: ['bands', 'tang'] }
          ]
        },
        {
          title: 'WeChat official account', layout: 'rows', art: ['dots', 'rose'],
          items: [
            { label: 'Marketing visual', ratio: [1, 1] },
            { label: 'Marketing visual', ratio: [4, 5] },
            { label: 'Marketing visual', ratio: [9, 16] },
            { label: 'Marketing visual', ratio: [1, 1] },
            { label: 'Marketing visual', ratio: [4, 5] }
          ]
        },
        {
          title: 'Brochures & event promotion', layout: 'rows', art: ['arcs', 'mint'],
          items: [
            { label: 'Brochure cover', ratio: [5, 7] },
            { label: 'Event banner', ratio: [3, 1] },
            { label: 'Event poster', ratio: [5, 7] }
          ]
        }
      ]
    },
    {
      id: 'sainuoweier',
      title: 'Sainuoweier Technology',
      industry: 'Cross-border e-commerce',
      role: 'Graphic Designer',
      years: '2020.04 - 2021.12', short: '2020/21', mark: 'Sainuoweier',
      summary: 'Product imagery and text, packaging and promotions for the company’s Amazon store.',
      groups: [
        { title: 'Amazon product pages', layout: 'pages', items: SAMPLE_PAGES },
        {
          title: 'Promotional posters & banners', layout: 'rows', art: ['glyph', 'butter'], glyph: '%',
          items: [
            { label: 'Storefront banner', ratio: [3, 1] },
            { label: 'Promo poster', ratio: [4, 5] },
            { label: 'Promo poster', ratio: [4, 5] },
            { label: 'Campaign banner', ratio: [2, 1] },
            { label: 'Listing image', ratio: [1, 1] }
          ]
        },
        {
          title: 'Packaging', layout: 'rows', art: ['blocks', 'forest'],
          items: [
            { label: 'Kraft box', ratio: [4, 3] },
            { label: 'Colour-printed carton', ratio: [4, 3] },
            { label: 'Dieline', ratio: [16, 9] }
          ]
        }
      ]
    }
  ]
};
