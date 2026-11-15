/* ─────────────────────────────────────────────────────────────
   ALL PORTFOLIO CONTENT LIVES IN THIS FILE.

   Profile and experience come from Christina's CV. The artwork is
   still generated placeholders, labelled by where the real work
   comes from. Replace each with the real piece.

   Using your real artwork
   • Poster:          add  image: 'images/posters/my-poster.jpg'
   • Campaign format: add  image: 'images/campaigns/launch-kv.jpg'
                      and set `ratio` to the image's [width, height]
   • A+ page:         add  modules: ['images/aplus/x-1.jpg', 'images/aplus/x-2.jpg', …]
                      (one image per content module, top to bottom)
                      optional extras: role: 'Design & art direction', result: '…'

   Any item without an image shows a generated placeholder, drawn
   from `art: [style, palette]`.
     styles:   orb · arcs · dots · glyph · bands · blocks · rays · lines
     palettes: paper · cobalt · forest · rose · noir · lilac · tang ·
               sand · mint · oxblood · sky · butter
   ───────────────────────────────────────────────────────────── */
window.PORTFOLIO = {
  /* Profile, experience and education come from Christina's CV.
     Employers are described by industry until she says they can be named.
     The email is a placeholder. */
  profile: {
    name: 'Christina W',
    role: 'Visual designer',
    since: 'Since 2020',
    email: 'hello@example.com',
    socials: [],
    bio: 'Visual designer with a degree in Visual Communication Design. Since 2020 she has worked in-house for brands in automotive electronics, fitness and cross-border e-commerce.',
    experience: [
      {
        years: '2023 to 2025', role: 'Graphic Designer', field: 'Automotive electronics',
        points: [
          'Responsible for the brand’s visual design and presentation',
          'Culture wall displays, product brochures, website visuals and social media content',
          'Materials for domestic and international exhibitions and workshops'
        ]
      },
      {
        years: '2022 to 2023', role: 'Graphic Designer', field: 'Fitness',
        points: [
          'Visual identity system for the company’s fitness sub-brand',
          'Social media marketing visuals, lightbox posters and brochures',
          'Event promotion and marketing for directly operated locations',
          'Sampling and proofs through to final production'
        ]
      },
      {
        years: '2020 to 2021', role: 'Graphic Designer', field: 'Cross-border e-commerce',
        points: [
          'Product imagery and text for the company’s Amazon store',
          'Packaging: kraft boxes and colour-printed cartons',
          'Promotional posters and banners for on-platform campaigns'
        ]
      }
    ],
    about: [
      ['Education', ['BA, Visual Communication Design', '2014 to 2018', 'Scholarship in each of the four years']],
      ['Skills', ['Visual identity', 'Layout and typeface design', 'Packaging design', 'Advertising', 'Photography']],
      ['Tools', ['Photoshop', 'Illustrator']],
      ['Languages', ['English, Band 6 certificate']]
    ]
  },

  /* How many posters show before the "Show all" button. */
  postersInitial: 12,

  /* Placeholder slots, grouped by where the real work comes from.
     Swap each for the real piece: set title, and add image: '…'. */
  posters: [
    { title: 'Lightbox poster 01',    client: 'Fitness sub-brand',      year: '2022/23', art: ['orb', 'cobalt'] },
    { title: 'Exhibition poster 01',  client: 'Automotive electronics', year: '2023/25', art: ['blocks', 'paper'] },
    { title: 'Promo poster 01',       client: 'Amazon store',           year: '2020/21', art: ['bands', 'tang'] },
    { title: 'Event poster 01',       client: 'Fitness sub-brand',      year: '2022/23', art: ['glyph', 'noir'] },
    { title: 'Promo poster 02',       client: 'Amazon store',           year: '2020/21', art: ['dots', 'rose'] },
    { title: 'Workshop poster 01',    client: 'Automotive electronics', year: '2023/25', art: ['rays', 'oxblood'] },
    { title: 'Lightbox poster 02',    client: 'Fitness sub-brand',      year: '2022/23', art: ['arcs', 'butter'] },
    { title: 'Exhibition poster 02',  client: 'Automotive electronics', year: '2023/25', art: ['lines', 'sand'] },
    { title: 'Promo poster 03',       client: 'Amazon store',           year: '2020/21', art: ['orb', 'mint'] },
    { title: 'Event poster 02',       client: 'Fitness sub-brand',      year: '2022/23', art: ['bands', 'sky'] },
    { title: 'Brand poster 01',       client: 'Automotive electronics', year: '2023/25', art: ['glyph', 'lilac'] },
    { title: 'Promo poster 04',       client: 'Amazon store',           year: '2020/21', art: ['blocks', 'forest'] }
  ],

  campaigns: [
    {
      title: 'Brand & exhibitions',
      client: 'Automotive electronics',
      year: '2023/25',
      summary: 'Brand visuals for an automotive electronics company, including materials for domestic and international exhibitions and workshops.',
      scope: ['Exhibition materials', 'Product brochures', 'Culture wall', 'Website visuals', 'Social media content'],
      art: ['rays', 'cobalt'],
      formats: [
        { label: 'Website banner', ratio: [16, 9] },
        { label: 'Social post', ratio: [1, 1] },
        { label: 'Brochure cover', ratio: [5, 7] },
        { label: 'Roll-up banner', ratio: [2, 5] },
        { label: 'Booth backdrop', ratio: [3, 1] }
      ]
    },
    {
      title: 'Fitness sub-brand',
      client: 'Fitness',
      year: '2022/23',
      summary: 'Visual identity, marketing visuals and event promotion for a fitness sub-brand and its directly operated locations.',
      scope: ['Visual identity', 'Lightbox posters', 'Social media visuals', 'Brochures', 'Event promotion'],
      art: ['bands', 'tang'],
      formats: [
        { label: 'Key visual', ratio: [16, 9] },
        { label: 'Lightbox poster', ratio: [5, 7] },
        { label: 'Social post', ratio: [4, 5] },
        { label: 'Square post', ratio: [1, 1] },
        { label: 'Event banner', ratio: [3, 1] }
      ]
    },
    {
      title: 'Amazon store promotions',
      client: 'Cross-border e-commerce',
      year: '2020/21',
      summary: 'Promotional posters and banners for on-platform sales campaigns.',
      scope: ['Promotional posters', 'Campaign banners', 'Product imagery', 'Packaging'],
      art: ['glyph', 'butter'], glyph: '%',
      formats: [
        { label: 'Storefront banner', ratio: [3, 1] },
        { label: 'Listing image', ratio: [1, 1] },
        { label: 'Promo poster', ratio: [4, 5] },
        { label: 'Story ad', ratio: [9, 16] },
        { label: 'Banner', ratio: [2, 1] }
      ]
    }
  ],

  /* Placeholder pages: the artwork and the copy inside it are generated samples.
     Swap each for a real page with  modules: ['images/aplus/…/01.jpg', …]. */
  aplus: [
    {
      title: 'Product page 01',
      brand: 'Amazon store',
      category: 'Sample layout',
      marketplace: 'Amazon',
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
      marketplace: 'Amazon',
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
      marketplace: 'Amazon',
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
      marketplace: 'Amazon',
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
  ]
};
